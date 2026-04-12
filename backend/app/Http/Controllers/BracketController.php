<?php

namespace App\Http\Controllers;

use App\Models\Round;
use App\Models\Tournament;
use App\Models\TournamentMatch;
use Illuminate\Http\Request;

class BracketController extends Controller
{
    /**
     * Genera el bracket de eliminación simple para un torneo.
     * Maneja byes automáticamente para potencias de 2.
     */
    public function generate(Tournament $tournament)
    {
        if ($tournament->status !== 'inscripciones') {
            return response()->json(['message' => 'El torneo ya fue iniciado o finalizado.'], 422);
        }

        $teams = $tournament->teams()->get()->shuffle();
        $teamCount = $teams->count();

        if ($teamCount < 2) {
            return response()->json(['message' => 'Se necesitan al menos 2 equipos.'], 422);
        }

        // Limpiar rondas y partidos anteriores
        $tournament->rounds()->delete();

        $bracketSize = $this->nextPowerOfTwo($teamCount);
        $totalRounds = (int) log($bracketSize, 2);

        // Crear todas las rondas
        $rounds = [];
        for ($r = 1; $r <= $totalRounds; $r++) {
            $rounds[$r] = Round::create([
                'tournament_id' => $tournament->id,
                'number'        => $r,
                'name'          => $this->roundName($r, $totalRounds),
                'status'        => $r === 1 ? 'en_curso' : 'pendiente',
            ]);
        }

        // Rellenar con byes si no es potencia de 2
        $slots = array_fill(0, $bracketSize, null);
        foreach ($teams as $i => $team) {
            $slots[$i] = $team;
        }

        // Crear partidos de la primera ronda
        $matchesFirstRound = $bracketSize / 2;
        for ($i = 0; $i < $matchesFirstRound; $i++) {
            $team1 = $slots[$i * 2];
            $team2 = $slots[$i * 2 + 1];
            $isBye = $team1 !== null && $team2 === null;

            $match = TournamentMatch::create([
                'tournament_id' => $tournament->id,
                'round_id'      => $rounds[1]->id,
                'team1_id'      => $team1?->id,
                'team2_id'      => $team2?->id,
                'winner_id'     => $isBye ? $team1->id : null,
                'match_order'   => $i + 1,
                'is_bye'        => $isBye,
                'status'        => $isBye ? 'completado' : 'pendiente',
            ]);
        }

        // Crear partidos vacíos para rondas siguientes
        for ($r = 2; $r <= $totalRounds; $r++) {
            $matchCount = $bracketSize / (int) pow(2, $r);
            for ($i = 0; $i < $matchCount; $i++) {
                TournamentMatch::create([
                    'tournament_id' => $tournament->id,
                    'round_id'      => $rounds[$r]->id,
                    'match_order'   => $i + 1,
                    'is_bye'        => false,
                    'status'        => 'pendiente',
                ]);
            }
        }

        // Avanzar byes automáticamente a la siguiente ronda
        $this->advanceByes($tournament, $rounds[1]);

        $tournament->update(['status' => 'en_curso', 'current_round' => 1]);

        return response()->json([
            'message' => 'Bracket generado correctamente.',
            'tournament' => $tournament->load('rounds.matches.team1', 'rounds.matches.team2'),
        ]);
    }

    /**
     * Registra el resultado de un partido y avanza al ganador.
     */
    public function recordResult(Request $request, TournamentMatch $match)
    {
        if ($match->status === 'completado') {
            return response()->json(['message' => 'Este partido ya tiene resultado.'], 422);
        }

        $data = $request->validate([
            'score_team1' => 'required|integer|min:0',
            'score_team2' => 'required|integer|min:0',
            'winner_id'   => 'required|exists:teams,id',
        ]);

        // Validar que el ganador sea uno de los dos equipos
        if (!in_array($data['winner_id'], [$match->team1_id, $match->team2_id])) {
            return response()->json(['message' => 'El ganador debe ser uno de los equipos del partido.'], 422);
        }

        $match->update([
            'score_team1' => $data['score_team1'],
            'score_team2' => $data['score_team2'],
            'winner_id'   => $data['winner_id'],
            'status'      => 'completado',
        ]);

        $this->advanceWinner($match);

        return response()->json([
            'message' => 'Resultado registrado.',
            'match'   => $match->load('team1', 'team2', 'winner'),
        ]);
    }

    /**
     * Avanza al ganador al siguiente partido disponible.
     */
    private function advanceWinner(TournamentMatch $match): void
    {
        $round = $match->round;
        $tournament = $match->tournament;

        // Verificar si la ronda está completa
        $pendingInRound = TournamentMatch::where('round_id', $round->id)
            ->where('status', '!=', 'completado')
            ->count();

        if ($pendingInRound === 0) {
            $round->update(['status' => 'completada']);

            // Buscar siguiente ronda
            $nextRound = Round::where('tournament_id', $tournament->id)
                ->where('number', $round->number + 1)
                ->first();

            if (!$nextRound) {
                // Es la final — declarar campeón
                $tournament->update([
                    'status'     => 'finalizado',
                    'champion_id' => $match->winner_id,
                ]);
                return;
            }

            // Colocar ganadores en la siguiente ronda
            $completedMatches = TournamentMatch::where('round_id', $round->id)
                ->orderBy('match_order')
                ->get();

            $nextMatches = TournamentMatch::where('round_id', $nextRound->id)
                ->orderBy('match_order')
                ->get();

            foreach ($nextMatches as $idx => $nextMatch) {
                $winner1 = $completedMatches[$idx * 2]->winner_id ?? null;
                $winner2 = $completedMatches[$idx * 2 + 1]->winner_id ?? null;

                $isBye = $winner1 !== null && $winner2 === null;

                $nextMatch->update([
                    'team1_id' => $winner1,
                    'team2_id' => $winner2,
                    'winner_id' => $isBye ? $winner1 : null,
                    'status'   => $isBye ? 'completado' : 'pendiente',
                    'is_bye'   => $isBye,
                ]);
            }

            $nextRound->update(['status' => 'en_curso']);
            $tournament->update(['current_round' => $nextRound->number]);

            // Recursivo: avanzar byes en la nueva ronda
            $this->advanceByes($tournament, $nextRound);
        }
    }

    /**
     * Avanza automáticamente los byes de una ronda.
     */
    private function advanceByes(Tournament $tournament, Round $round): void
    {
        $byes = TournamentMatch::where('round_id', $round->id)
            ->where('is_bye', true)
            ->where('status', 'completado')
            ->get();

        foreach ($byes as $bye) {
            $this->advanceWinner($bye);
        }
    }

    private function nextPowerOfTwo(int $n): int
    {
        $power = 1;
        while ($power < $n) $power *= 2;
        return $power;
    }

    private function roundName(int $round, int $total): string
    {
        $fromEnd = $total - $round;
        return match ($fromEnd) {
            0 => 'Final',
            1 => 'Semifinal',
            2 => 'Cuartos de Final',
            3 => 'Octavos de Final',
            default => "Ronda {$round}",
        };
    }
}
