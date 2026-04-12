<?php

namespace App\Http\Controllers;

use App\Models\Team;
use App\Models\Tournament;
use App\Models\TournamentRegistration;
use Illuminate\Http\Request;

class TeamController extends Controller
{
    // Inscribir equipo a torneo (usuario autenticado)
    public function store(Request $request, Tournament $tournament)
    {
        if ($tournament->status !== 'inscripciones') {
            return response()->json(['message' => 'Las inscripciones están cerradas.'], 422);
        }

        if ($tournament->teams()->count() >= $tournament->max_teams) {
            return response()->json(['message' => 'El torneo está lleno.'], 422);
        }

        // Verificar que el usuario no tenga ya un equipo en este torneo
        $exists = Team::where('tournament_id', $tournament->id)
            ->where('user_id', $request->user()->id)
            ->exists();

        if ($exists) {
            return response()->json(['message' => 'Ya tienes un equipo inscrito en este torneo.'], 422);
        }

        $data = $request->validate([
            'name' => 'required|string|max:255',
            'logo' => 'nullable|string|url',
        ]);

        $team = Team::create([
            'tournament_id' => $tournament->id,
            'user_id'       => $request->user()->id,
            'name'          => $data['name'],
            'logo'          => $data['logo'] ?? null,
        ]);

        TournamentRegistration::create([
            'tournament_id' => $tournament->id,
            'user_id'       => $request->user()->id,
            'team_id'       => $team->id,
            'status'        => 'aprobada',
        ]);

        return response()->json($team->load('user:id,name'), 201);
    }

    // Admin: actualizar equipo
    public function update(Request $request, Team $team)
    {
        $data = $request->validate([
            'name' => 'sometimes|string|max:255',
            'logo' => 'nullable|string|url',
            'seed' => 'nullable|integer',
        ]);

        $team->update($data);
        return response()->json($team);
    }

    // Admin: eliminar equipo
    public function destroy(Team $team)
    {
        $team->delete();
        return response()->json(['message' => 'Equipo eliminado.']);
    }
}
