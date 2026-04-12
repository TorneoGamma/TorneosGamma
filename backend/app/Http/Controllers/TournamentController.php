<?php

namespace App\Http\Controllers;

use App\Models\Tournament;
use Illuminate\Http\Request;

class TournamentController extends Controller
{
    // Público: listar torneos
    public function index(Request $request)
    {
        $query = Tournament::with(['creator:id,name', 'champion:id,name'])
            ->withCount('teams');

        if ($request->has('discipline')) {
            $query->where('discipline', $request->discipline);
        }
        if ($request->has('status')) {
            $query->where('status', $request->status);
        }

        return response()->json($query->latest()->paginate(12));
    }

    // Público: ver torneo
    public function show(Tournament $tournament)
    {
        $tournament->load([
            'creator:id,name',
            'champion:id,name',
            'teams:id,tournament_id,name,logo,seed',
            'rounds.matches.team1:id,name,logo',
            'rounds.matches.team2:id,name,logo',
            'rounds.matches.winner:id,name',
        ]);

        return response()->json($tournament);
    }

    // Admin: crear torneo
    public function store(Request $request)
    {
        $data = $request->validate([
            'name'        => 'required|string|max:255',
            'discipline'  => 'required|string|max:100',
            'description' => 'nullable|string',
            'max_teams'   => 'required|integer|min:2|max:128',
            'starts_at'   => 'nullable|date',
        ]);

        $tournament = Tournament::create([
            ...$data,
            'created_by' => $request->user()->id,
            'max_teams'  => $this->nextPowerOfTwo($data['max_teams']),
        ]);

        return response()->json($tournament, 201);
    }

    // Admin: actualizar torneo
    public function update(Request $request, Tournament $tournament)
    {
        $data = $request->validate([
            'name'        => 'sometimes|string|max:255',
            'discipline'  => 'sometimes|string|max:100',
            'description' => 'nullable|string',
            'starts_at'   => 'nullable|date',
        ]);

        $tournament->update($data);

        return response()->json($tournament);
    }

    // Admin: eliminar torneo
    public function destroy(Tournament $tournament)
    {
        $tournament->delete();
        return response()->json(['message' => 'Torneo eliminado.']);
    }

    private function nextPowerOfTwo(int $n): int
    {
        $power = 1;
        while ($power < $n) {
            $power *= 2;
        }
        return $power;
    }
}
