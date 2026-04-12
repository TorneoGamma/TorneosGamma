<?php

namespace App\Http\Controllers;

use App\Models\TournamentMatch;
use App\Models\Tournament;
use Illuminate\Http\Request;

class MatchController extends Controller
{
    public function index(Tournament $tournament)
    {
        $matches = TournamentMatch::with(['round', 'team1:id,name,logo', 'team2:id,name,logo', 'winner:id,name'])
            ->where('tournament_id', $tournament->id)
            ->orderBy('round_id')
            ->orderBy('match_order')
            ->get();

        return response()->json($matches);
    }

    public function show(TournamentMatch $match)
    {
        return response()->json(
            $match->load(['round', 'team1', 'team2', 'winner'])
        );
    }
}
