<?php

namespace Database\Seeders;

use App\Models\Round;
use App\Models\Team;
use App\Models\Tournament;
use App\Models\TournamentMatch;
use App\Models\TournamentRegistration;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        // ── Usuarios ──────────────────────────────────────────────────────────
        $admin = User::create([
            'name'     => 'Administrador',
            'email'    => 'admin@torneos.com',
            'password' => Hash::make('password'),
            'role'     => 'admin',
        ]);

        $users = collect([
            ['name' => 'Carlos Mendoza',   'email' => 'carlos@torneos.com'],
            ['name' => 'Sofía Ramírez',    'email' => 'sofia@torneos.com'],
            ['name' => 'Diego Torres',     'email' => 'diego@torneos.com'],
            ['name' => 'Valentina Cruz',   'email' => 'valentina@torneos.com'],
            ['name' => 'Andrés Herrera',   'email' => 'andres@torneos.com'],
            ['name' => 'Camila Vargas',    'email' => 'camila@torneos.com'],
            ['name' => 'Sebastián López',  'email' => 'sebastian@torneos.com'],
            ['name' => 'Isabella Moreno',  'email' => 'isabella@torneos.com'],
        ])->map(fn($u) => User::create([
            'name'     => $u['name'],
            'email'    => $u['email'],
            'password' => Hash::make('password'),
            'role'     => 'user',
        ]));

        // ── Torneo 1: Fútbol — FINALIZADO con bracket completo ────────────────
        $t1 = Tournament::create([
            'created_by'  => $admin->id,
            'name'        => 'Copa Gamma 2026',
            'discipline'  => 'Fútbol',
            'description' => 'El torneo de fútbol más competitivo de la temporada. Ocho equipos se enfrentan en eliminación directa.',
            'max_teams'   => 8,
            'status'      => 'finalizado',
            'current_round' => 3,
            'starts_at'   => now()->subDays(20),
        ]);

        $t1Teams = collect([
            'Águilas FC', 'Tigres United', 'Los Cóndores', 'Rayos del Sur',
            'Estrellas CF', 'Dragones SC', 'Fénix FC', 'Lobos Negros',
        ])->map(fn($name, $i) => Team::create([
            'tournament_id' => $t1->id,
            'user_id'       => $users[$i]->id,
            'name'          => $name,
            'seed'          => $i + 1,
        ]));

        foreach ($t1Teams as $team) {
            TournamentRegistration::create([
                'tournament_id' => $t1->id,
                'user_id'       => $team->user_id,
                'team_id'       => $team->id,
                'status'        => 'aprobada',
            ]);
        }

        // Ronda 1 — Cuartos
        $r1 = Round::create(['tournament_id' => $t1->id, 'number' => 1, 'name' => 'Cuartos de Final', 'status' => 'completada']);
        $qf = [
            [$t1Teams[0], $t1Teams[7], $t1Teams[0], 3, 1],
            [$t1Teams[1], $t1Teams[6], $t1Teams[1], 2, 0],
            [$t1Teams[2], $t1Teams[5], $t1Teams[5], 1, 2],
            [$t1Teams[3], $t1Teams[4], $t1Teams[3], 4, 2],
        ];
        foreach ($qf as $i => [$a, $b, $w, $s1, $s2]) {
            TournamentMatch::create([
                'tournament_id' => $t1->id, 'round_id' => $r1->id,
                'team1_id' => $a->id, 'team2_id' => $b->id, 'winner_id' => $w->id,
                'score_team1' => $s1, 'score_team2' => $s2,
                'match_order' => $i + 1, 'status' => 'completado',
            ]);
        }

        // Ronda 2 — Semifinal
        $r2 = Round::create(['tournament_id' => $t1->id, 'number' => 2, 'name' => 'Semifinal', 'status' => 'completada']);
        $sf = [
            [$t1Teams[0], $t1Teams[1], $t1Teams[0], 1, 0],
            [$t1Teams[5], $t1Teams[3], $t1Teams[3], 0, 2],
        ];
        foreach ($sf as $i => [$a, $b, $w, $s1, $s2]) {
            TournamentMatch::create([
                'tournament_id' => $t1->id, 'round_id' => $r2->id,
                'team1_id' => $a->id, 'team2_id' => $b->id, 'winner_id' => $w->id,
                'score_team1' => $s1, 'score_team2' => $s2,
                'match_order' => $i + 1, 'status' => 'completado',
            ]);
        }

        // Ronda 3 — Final
        $r3 = Round::create(['tournament_id' => $t1->id, 'number' => 3, 'name' => 'Final', 'status' => 'completada']);
        TournamentMatch::create([
            'tournament_id' => $t1->id, 'round_id' => $r3->id,
            'team1_id' => $t1Teams[0]->id, 'team2_id' => $t1Teams[3]->id,
            'winner_id' => $t1Teams[0]->id,
            'score_team1' => 3, 'score_team2' => 2,
            'match_order' => 1, 'status' => 'completado',
        ]);

        $t1->update(['champion_id' => $t1Teams[0]->id]);

        // ── Torneo 2: Videojuegos — EN CURSO ─────────────────────────────────
        $t2 = Tournament::create([
            'created_by'  => $admin->id,
            'name'        => 'Gamma Gaming Championship',
            'discipline'  => 'Videojuegos',
            'description' => 'Torneo de videojuegos competitivo. Cuatro equipos disputando la supremacía digital.',
            'max_teams'   => 4,
            'status'      => 'en_curso',
            'current_round' => 1,
            'starts_at'   => now()->subDays(3),
        ]);

        $t2Teams = collect(['Team Alpha', 'Team Beta', 'Team Omega', 'Team Delta'])
            ->map(fn($name, $i) => Team::create([
                'tournament_id' => $t2->id,
                'user_id'       => $users[$i]->id,
                'name'          => $name,
                'seed'          => $i + 1,
            ]));

        foreach ($t2Teams as $team) {
            TournamentRegistration::create([
                'tournament_id' => $t2->id,
                'user_id'       => $team->user_id,
                'team_id'       => $team->id,
                'status'        => 'aprobada',
            ]);
        }

        $r2_1 = Round::create(['tournament_id' => $t2->id, 'number' => 1, 'name' => 'Semifinal', 'status' => 'en_curso']);
        $r2_2 = Round::create(['tournament_id' => $t2->id, 'number' => 2, 'name' => 'Final', 'status' => 'pendiente']);

        TournamentMatch::create([
            'tournament_id' => $t2->id, 'round_id' => $r2_1->id,
            'team1_id' => $t2Teams[0]->id, 'team2_id' => $t2Teams[3]->id,
            'match_order' => 1, 'status' => 'pendiente',
        ]);
        TournamentMatch::create([
            'tournament_id' => $t2->id, 'round_id' => $r2_1->id,
            'team1_id' => $t2Teams[1]->id, 'team2_id' => $t2Teams[2]->id,
            'match_order' => 2, 'status' => 'pendiente',
        ]);
        TournamentMatch::create([
            'tournament_id' => $t2->id, 'round_id' => $r2_2->id,
            'match_order' => 1, 'status' => 'pendiente',
        ]);

        // ── Torneo 3: Ajedrez — INSCRIPCIONES ABIERTAS ───────────────────────
        $t3 = Tournament::create([
            'created_by'  => $admin->id,
            'name'        => 'Torneo Abierto de Ajedrez',
            'discipline'  => 'Ajedrez',
            'description' => 'Competencia de ajedrez clásico. Inscripciones abiertas para 8 participantes.',
            'max_teams'   => 8,
            'status'      => 'inscripciones',
            'current_round' => 0,
            'starts_at'   => now()->addDays(7),
        ]);

        $chessTeams = collect(['Rey Blanco', 'Torre Negra', 'Caballo de Oro', 'Alfil Maestro'])
            ->map(fn($name, $i) => Team::create([
                'tournament_id' => $t3->id,
                'user_id'       => $users[$i + 4]->id,
                'name'          => $name,
            ]));

        foreach ($chessTeams as $team) {
            TournamentRegistration::create([
                'tournament_id' => $t3->id,
                'user_id'       => $team->user_id,
                'team_id'       => $team->id,
                'status'        => 'aprobada',
            ]);
        }

        // ── Torneo 4: Baloncesto — INSCRIPCIONES ABIERTAS ────────────────────
        Tournament::create([
            'created_by'  => $admin->id,
            'name'        => 'Liga Gamma Basketball',
            'discipline'  => 'Baloncesto',
            'description' => 'Liga de baloncesto 3x3. Inscripciones abiertas, cupos limitados.',
            'max_teams'   => 4,
            'status'      => 'inscripciones',
            'current_round' => 0,
            'starts_at'   => now()->addDays(14),
        ]);
    }
}
