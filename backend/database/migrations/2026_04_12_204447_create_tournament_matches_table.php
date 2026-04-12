<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('tournament_matches', function (Blueprint $table) {
            $table->id();
            $table->foreignId('tournament_id')->constrained()->onDelete('cascade');
            $table->foreignId('round_id')->constrained()->onDelete('cascade');
            $table->foreignId('team1_id')->nullable()->constrained('teams')->nullOnDelete();
            $table->foreignId('team2_id')->nullable()->constrained('teams')->nullOnDelete();
            $table->foreignId('winner_id')->nullable()->constrained('teams')->nullOnDelete();
            $table->integer('score_team1')->nullable();
            $table->integer('score_team2')->nullable();
            $table->integer('match_order'); // posición en el bracket
            $table->boolean('is_bye')->default(false); // pase automático
            $table->enum('status', ['pendiente', 'en_curso', 'completado'])->default('pendiente');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('tournament_matches');
    }
};
