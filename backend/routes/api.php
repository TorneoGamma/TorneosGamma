<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\BracketController;
use App\Http\Controllers\MatchController;
use App\Http\Controllers\ReportController;
use App\Http\Controllers\TeamController;
use App\Http\Controllers\TournamentController;
use Illuminate\Support\Facades\Route;

// ─── Autenticación ───────────────────────────────────────────────────────────
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login',    [AuthController::class, 'login']);

Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/me',      [AuthController::class, 'me']);
});

// ─── Rutas públicas (solo lectura) ───────────────────────────────────────────
Route::get('/tournaments',                    [TournamentController::class, 'index']);
Route::get('/tournaments/{tournament}',       [TournamentController::class, 'show']);
Route::get('/tournaments/{tournament}/matches', [MatchController::class, 'index']);
Route::get('/matches/{match}',                [MatchController::class, 'show']);

// ─── Reportes ────────────────────────────────────────────────────────────────
Route::get('/reports/general',                    [ReportController::class, 'general']);
Route::get('/reports/tournament/{tournament}',    [ReportController::class, 'tournament']);

// ─── Rutas de usuario autenticado ────────────────────────────────────────────
Route::middleware('auth:sanctum')->group(function () {
    // Inscribir equipo
    Route::post('/tournaments/{tournament}/teams', [TeamController::class, 'store']);
});

// ─── Rutas de administrador ──────────────────────────────────────────────────
Route::middleware(['auth:sanctum', 'admin'])->group(function () {
    // Torneos
    Route::post('/tournaments',                    [TournamentController::class, 'store']);
    Route::put('/tournaments/{tournament}',        [TournamentController::class, 'update']);
    Route::delete('/tournaments/{tournament}',     [TournamentController::class, 'destroy']);

    // Equipos
    Route::put('/teams/{team}',                    [TeamController::class, 'update']);
    Route::delete('/teams/{team}',                 [TeamController::class, 'destroy']);

    // Bracket
    Route::post('/tournaments/{tournament}/bracket/generate', [BracketController::class, 'generate']);
    Route::post('/matches/{match}/result',                    [BracketController::class, 'recordResult']);
});
