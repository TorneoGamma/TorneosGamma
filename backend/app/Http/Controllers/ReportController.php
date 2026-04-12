<?php

namespace App\Http\Controllers;

use App\Models\Tournament;
use App\Models\TournamentMatch;
use App\Models\Team;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class ReportController extends Controller
{
    /**
     * Reporte general: estadísticas agregadas del sistema.
     */
    public function general()
    {
        $stats = [
            'total_torneos'      => Tournament::count(),
            'torneos_activos'    => Tournament::where('status', 'en_curso')->count(),
            'torneos_finalizados'=> Tournament::where('status', 'finalizado')->count(),
            'total_equipos'      => Team::count(),
            'total_partidos'     => TournamentMatch::where('is_bye', false)->count(),
            'partidos_jugados'   => TournamentMatch::where('status', 'completado')->where('is_bye', false)->count(),
            'por_disciplina'     => Tournament::select('discipline', DB::raw('count(*) as total'))
                ->groupBy('discipline')
                ->orderByDesc('total')
                ->get(),
        ];

        return response()->json($stats);
    }

    /**
     * Reporte de un torneo específico: estadísticas detalladas.
     */
    public function tournament(Tournament $tournament)
    {
        $matches = TournamentMatch::where('tournament_id', $tournament->id)
            ->where('is_bye', false)
            ->where('status', 'completado')
            ->get();

        // Victorias por equipo
        $wins = $matches->groupBy('winner_id')->map->count();

        // Goles/puntos por equipo
        $teamStats = [];
        foreach ($matches as $match) {
            if ($match->team1_id) {
                $teamStats[$match->team1_id]['scored']   = ($teamStats[$match->team1_id]['scored'] ?? 0) + $match->score_team1;
                $teamStats[$match->team1_id]['conceded'] = ($teamStats[$match->team1_id]['conceded'] ?? 0) + $match->score_team2;
            }
            if ($match->team2_id) {
                $teamStats[$match->team2_id]['scored']   = ($teamStats[$match->team2_id]['scored'] ?? 0) + $match->score_team2;
                $teamStats[$match->team2_id]['conceded'] = ($teamStats[$match->team2_id]['conceded'] ?? 0) + $match->score_team1;
            }
        }

        $teams = $tournament->teams()->get(['id', 'name', 'logo'])->map(function ($team) use ($wins, $teamStats) {
            return [
                'id'       => $team->id,
                'name'     => $team->name,
                'logo'     => $team->logo,
                'wins'     => $wins[$team->id] ?? 0,
                'scored'   => $teamStats[$team->id]['scored'] ?? 0,
                'conceded' => $teamStats[$team->id]['conceded'] ?? 0,
            ];
        })->sortByDesc('wins')->values();

        return response()->json([
            'tournament'      => $tournament->only('id', 'name', 'discipline', 'status', 'current_round'),
            'total_equipos'   => $tournament->teams()->count(),
            'total_rondas'    => $tournament->rounds()->count(),
            'partidos_jugados'=> $matches->count(),
            'champion'        => $tournament->champion?->only('id', 'name'),
            'team_stats'      => $teams,
        ]);
    }
}
