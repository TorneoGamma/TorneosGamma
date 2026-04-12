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
            ['name' => 'Carlos Mendoza',    'email' => 'carlos@torneos.com'],
            ['name' => 'Sofía Ramírez',     'email' => 'sofia@torneos.com'],
            ['name' => 'Diego Torres',      'email' => 'diego@torneos.com'],
            ['name' => 'Valentina Cruz',    'email' => 'valentina@torneos.com'],
            ['name' => 'Andrés Herrera',    'email' => 'andres@torneos.com'],
            ['name' => 'Camila Vargas',     'email' => 'camila@torneos.com'],
            ['name' => 'Sebastián López',   'email' => 'sebastian@torneos.com'],
            ['name' => 'Isabella Moreno',   'email' => 'isabella@torneos.com'],
            ['name' => 'Mateo Jiménez',     'email' => 'mateo@torneos.com'],
            ['name' => 'Lucía Fernández',   'email' => 'lucia@torneos.com'],
            ['name' => 'Santiago Gómez',    'email' => 'santiago@torneos.com'],
            ['name' => 'Valeria Castillo',  'email' => 'valeria@torneos.com'],
            ['name' => 'Nicolás Reyes',     'email' => 'nicolas@torneos.com'],
            ['name' => 'Daniela Ortiz',     'email' => 'daniela@torneos.com'],
            ['name' => 'Alejandro Ruiz',    'email' => 'alejandro@torneos.com'],
            ['name' => 'Gabriela Peña',     'email' => 'gabriela@torneos.com'],
        ])->map(fn($u) => User::create([
            'name'     => $u['name'],
            'email'    => $u['email'],
            'password' => Hash::make('password'),
            'role'     => 'user',
        ]));

        // ── Helper: crear equipos + registraciones ────────────────────────────
        $makeTeams = function (Tournament $t, array $names) use ($users) {
            return collect($names)->map(function ($name, $i) use ($t, $users) {
                $user = $users[$i % $users->count()];
                $team = Team::create([
                    'tournament_id' => $t->id,
                    'user_id'       => $user->id,
                    'name'          => $name,
                    'seed'          => $i + 1,
                ]);
                TournamentRegistration::create([
                    'tournament_id' => $t->id,
                    'user_id'       => $user->id,
                    'team_id'       => $team->id,
                    'status'        => 'aprobada',
                ]);
                return $team;
            });
        };

        // ── Helper: bracket completo 8 equipos ───────────────────────────────
        $makeBracket8 = function (Tournament $t, $teams, $champion) use ($admin) {
            $r1 = Round::create(['tournament_id' => $t->id, 'number' => 1, 'name' => 'Cuartos de Final', 'status' => 'completada']);
            $r2 = Round::create(['tournament_id' => $t->id, 'number' => 2, 'name' => 'Semifinal',        'status' => 'completada']);
            $r3 = Round::create(['tournament_id' => $t->id, 'number' => 3, 'name' => 'Final',            'status' => 'completada']);

            $qfWinners = [];
            $qfPairs = [[0,7],[1,6],[2,5],[3,4]];
            foreach ($qfPairs as $i => [$a, $b]) {
                $s1 = rand(1, 4); $s2 = rand(0, $s1 - 1);
                $w = $teams[$a];
                TournamentMatch::create([
                    'tournament_id' => $t->id, 'round_id' => $r1->id,
                    'team1_id' => $teams[$a]->id, 'team2_id' => $teams[$b]->id,
                    'winner_id' => $w->id, 'score_team1' => $s1, 'score_team2' => $s2,
                    'match_order' => $i + 1, 'status' => 'completado',
                ]);
                $qfWinners[] = $w;
            }

            $sfWinners = [];
            foreach ([[0,1],[2,3]] as $i => [$a, $b]) {
                $s1 = rand(1, 3); $s2 = rand(0, $s1 - 1);
                $w = $qfWinners[$a];
                TournamentMatch::create([
                    'tournament_id' => $t->id, 'round_id' => $r2->id,
                    'team1_id' => $qfWinners[$a]->id, 'team2_id' => $qfWinners[$b]->id,
                    'winner_id' => $w->id, 'score_team1' => $s1, 'score_team2' => $s2,
                    'match_order' => $i + 1, 'status' => 'completado',
                ]);
                $sfWinners[] = $w;
            }

            TournamentMatch::create([
                'tournament_id' => $t->id, 'round_id' => $r3->id,
                'team1_id' => $sfWinners[0]->id, 'team2_id' => $sfWinners[1]->id,
                'winner_id' => $champion->id, 'score_team1' => 3, 'score_team2' => 1,
                'match_order' => 1, 'status' => 'completado',
            ]);

            $t->update(['champion_id' => $champion->id, 'status' => 'finalizado', 'current_round' => 3]);
        };

        // ── Helper: bracket en curso 4 equipos ───────────────────────────────
        $makeActiveBracket4 = function (Tournament $t, $teams) {
            $r1 = Round::create(['tournament_id' => $t->id, 'number' => 1, 'name' => 'Semifinal', 'status' => 'en_curso']);
            $r2 = Round::create(['tournament_id' => $t->id, 'number' => 2, 'name' => 'Final',     'status' => 'pendiente']);
            TournamentMatch::create([
                'tournament_id' => $t->id, 'round_id' => $r1->id,
                'team1_id' => $teams[0]->id, 'team2_id' => $teams[3]->id,
                'match_order' => 1, 'status' => 'pendiente',
            ]);
            TournamentMatch::create([
                'tournament_id' => $t->id, 'round_id' => $r1->id,
                'team1_id' => $teams[1]->id, 'team2_id' => $teams[2]->id,
                'match_order' => 2, 'status' => 'pendiente',
            ]);
            TournamentMatch::create([
                'tournament_id' => $t->id, 'round_id' => $r2->id,
                'match_order' => 1, 'status' => 'pendiente',
            ]);
            $t->update(['status' => 'en_curso', 'current_round' => 1]);
        };

        // ════════════════════════════════════════════════════════════════════
        // TORNEOS FINALIZADOS
        // ════════════════════════════════════════════════════════════════════

        // 1. Copa Gamma 2026 — Fútbol
        $t1 = Tournament::create([
            'created_by' => $admin->id, 'name' => 'Copa Gamma 2026',
            'discipline' => 'Fútbol', 'max_teams' => 8, 'current_round' => 3,
            'description' => 'El torneo de fútbol más competitivo de la temporada.',
            'status' => 'finalizado', 'starts_at' => now()->subDays(30),
        ]);
        $t1Teams = $makeTeams($t1, ['Águilas FC','Tigres United','Los Cóndores','Rayos del Sur','Estrellas CF','Dragones SC','Fénix FC','Lobos Negros']);
        $makeBracket8($t1, $t1Teams, $t1Teams[0]);

        // 2. Liga Premier de Videojuegos — Videojuegos
        $t2 = Tournament::create([
            'created_by' => $admin->id, 'name' => 'Liga Premier de Videojuegos',
            'discipline' => 'Videojuegos', 'max_teams' => 8, 'current_round' => 3,
            'description' => 'Torneo de League of Legends. Los mejores equipos compiten por el título.',
            'status' => 'finalizado', 'starts_at' => now()->subDays(45),
        ]);
        $t2Teams = $makeTeams($t2, ['Team Alpha','Team Beta','Team Omega','Team Delta','Team Sigma','Team Zeta','Team Gamma','Team Epsilon']);
        $makeBracket8($t2, $t2Teams, $t2Teams[1]);

        // 3. Torneo Nacional de Ajedrez — Ajedrez
        $t3 = Tournament::create([
            'created_by' => $admin->id, 'name' => 'Torneo Nacional de Ajedrez',
            'discipline' => 'Ajedrez', 'max_teams' => 8, 'current_round' => 3,
            'description' => 'Competencia de ajedrez clásico con los mejores jugadores del país.',
            'status' => 'finalizado', 'starts_at' => now()->subDays(60),
        ]);
        $t3Teams = $makeTeams($t3, ['Rey Blanco','Torre Negra','Caballo de Oro','Alfil Maestro','Peón Valiente','Reina Negra','Enroque FC','Jaque Mate']);
        $makeBracket8($t3, $t3Teams, $t3Teams[2]);

        // 4. Copa Baloncesto 3x3 — Baloncesto
        $t4 = Tournament::create([
            'created_by' => $admin->id, 'name' => 'Copa Baloncesto 3x3',
            'discipline' => 'Baloncesto', 'max_teams' => 8, 'current_round' => 3,
            'description' => 'Liga de baloncesto 3x3. Velocidad, habilidad y trabajo en equipo.',
            'status' => 'finalizado', 'starts_at' => now()->subDays(20),
        ]);
        $t4Teams = $makeTeams($t4, ['Slam Dunk','Air Ballers','Court Kings','Hoop Dreams','Fast Break','Triple Threat','Buzzer Beaters','Full Court']);
        $makeBracket8($t4, $t4Teams, $t4Teams[3]);

        // 5. Torneo de Tenis Dobles — Tenis
        $t5 = Tournament::create([
            'created_by' => $admin->id, 'name' => 'Torneo de Tenis Dobles',
            'discipline' => 'Tenis', 'max_teams' => 8, 'current_round' => 3,
            'description' => 'Torneo de tenis en modalidad dobles. Cuatro sets al mejor de tres.',
            'status' => 'finalizado', 'starts_at' => now()->subDays(15),
        ]);
        $t5Teams = $makeTeams($t5, ['Ace Duo','Net Masters','Baseline Bros','Volley Kings','Smash Pair','Rally Force','Match Point','Grand Slam']);
        $makeBracket8($t5, $t5Teams, $t5Teams[0]);

        // ════════════════════════════════════════════════════════════════════
        // TORNEOS EN CURSO
        // ════════════════════════════════════════════════════════════════════

        // 6. Gamma Gaming Championship — Videojuegos
        $t6 = Tournament::create([
            'created_by' => $admin->id, 'name' => 'Gamma Gaming Championship',
            'discipline' => 'Videojuegos', 'max_teams' => 4,
            'description' => 'Torneo de Valorant. Cuatro equipos disputando la supremacía digital.',
            'status' => 'en_curso', 'current_round' => 1, 'starts_at' => now()->subDays(3),
        ]);
        $t6Teams = $makeTeams($t6, ['Phantom Squad','Vandal Force','Operator Elite','Sheriff Gang']);
        $makeActiveBracket4($t6, $t6Teams);

        // 7. Torneo Relámpago de Fútbol — Fútbol
        $t7 = Tournament::create([
            'created_by' => $admin->id, 'name' => 'Torneo Relámpago de Fútbol',
            'discipline' => 'Fútbol', 'max_teams' => 4,
            'description' => 'Partidos de 20 minutos. Rápido, intenso y sin descanso.',
            'status' => 'en_curso', 'current_round' => 1, 'starts_at' => now()->subDays(1),
        ]);
        $t7Teams = $makeTeams($t7, ['Rayo FC','Trueno SC','Tormenta CF','Vendaval United']);
        $makeActiveBracket4($t7, $t7Teams);

        // 8. Open de Ajedrez Rápido — Ajedrez
        $t8 = Tournament::create([
            'created_by' => $admin->id, 'name' => 'Open de Ajedrez Rápido',
            'discipline' => 'Ajedrez', 'max_teams' => 4,
            'description' => 'Partidas de 10 minutos por jugador. Ajedrez blitz al máximo nivel.',
            'status' => 'en_curso', 'current_round' => 1, 'starts_at' => now()->subDays(2),
        ]);
        $t8Teams = $makeTeams($t8, ['Gambito Real','Defensa Siciliana','Apertura Inglesa','Ataque Indio']);
        $makeActiveBracket4($t8, $t8Teams);

        // ════════════════════════════════════════════════════════════════════
        // TORNEOS CON INSCRIPCIONES ABIERTAS
        // ════════════════════════════════════════════════════════════════════

        // 9. Copa de Verano 2026 — Fútbol
        $t9 = Tournament::create([
            'created_by' => $admin->id, 'name' => 'Copa de Verano 2026',
            'discipline' => 'Fútbol', 'max_teams' => 16,
            'description' => 'El torneo más grande del año. 16 equipos, 4 rondas, un campeón.',
            'status' => 'inscripciones', 'current_round' => 0, 'starts_at' => now()->addDays(14),
        ]);
        $makeTeams($t9, ['Halcones FC','Panteras SC','Leones CF','Tigres del Norte','Osos Polares','Lobos Grises','Zorros Rojos','Águilas Doradas']);

        // 10. Torneo Abierto de Ajedrez — Ajedrez
        $t10 = Tournament::create([
            'created_by' => $admin->id, 'name' => 'Torneo Abierto de Ajedrez',
            'discipline' => 'Ajedrez', 'max_teams' => 8,
            'description' => 'Abierto a todos los niveles. Inscríbete y demuestra tu talento.',
            'status' => 'inscripciones', 'current_round' => 0, 'starts_at' => now()->addDays(7),
        ]);
        $makeTeams($t10, ['Rey Blanco','Torre Negra','Caballo de Oro','Alfil Maestro']);

        // 11. Liga Gamma Basketball — Baloncesto
        $t11 = Tournament::create([
            'created_by' => $admin->id, 'name' => 'Liga Gamma Basketball',
            'discipline' => 'Baloncesto', 'max_teams' => 8,
            'description' => 'Liga de baloncesto 5x5. Inscripciones abiertas, cupos limitados.',
            'status' => 'inscripciones', 'current_round' => 0, 'starts_at' => now()->addDays(10),
        ]);
        $makeTeams($t11, ['Bulls Gamma','Lakers Gamma','Heat Gamma']);

        // 12. Torneo de Tenis Individual — Tenis
        $t12 = Tournament::create([
            'created_by' => $admin->id, 'name' => 'Torneo de Tenis Individual',
            'discipline' => 'Tenis', 'max_teams' => 8,
            'description' => 'Modalidad individual. Tres sets al mejor de cinco.',
            'status' => 'inscripciones', 'current_round' => 0, 'starts_at' => now()->addDays(21),
        ]);
        $makeTeams($t12, ['Federer Fan','Nadal Club','Djokovic Team','Murray Squad']);

        // 13. Torneo de FIFA 25 — Videojuegos
        $t13 = Tournament::create([
            'created_by' => $admin->id, 'name' => 'Torneo de FIFA 25',
            'discipline' => 'Videojuegos', 'max_teams' => 16,
            'description' => 'Torneo de FIFA 25 en PS5. Inscríbete y compite por el título.',
            'status' => 'inscripciones', 'current_round' => 0, 'starts_at' => now()->addDays(5),
        ]);
        $makeTeams($t13, ['Madrid Virtual','Barça Digital','Liverpool FC Pro','Chelsea eSports','PSG Gaming','Bayern Virtual','Juventus Pro','Inter eSports']);

        // 14. Torneo de Ping Pong — Otro
        $t14 = Tournament::create([
            'created_by' => $admin->id, 'name' => 'Torneo de Ping Pong',
            'discipline' => 'Otro', 'max_teams' => 8,
            'description' => 'Torneo de tenis de mesa. Rápido, divertido y muy competitivo.',
            'status' => 'inscripciones', 'current_round' => 0, 'starts_at' => now()->addDays(12),
        ]);
    }
}
