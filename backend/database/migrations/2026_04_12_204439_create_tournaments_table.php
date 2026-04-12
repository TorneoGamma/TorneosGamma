<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('tournaments', function (Blueprint $table) {
            $table->id();
            $table->foreignId('created_by')->constrained('users')->onDelete('cascade');
            $table->string('name');
            $table->string('discipline');
            $table->text('description')->nullable();
            $table->integer('max_teams');
            $table->enum('status', ['inscripciones', 'en_curso', 'finalizado'])->default('inscripciones');
            $table->integer('current_round')->default(0);
            $table->unsignedBigInteger('champion_id')->nullable(); // FK se agrega después de teams
            $table->timestamp('starts_at')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('tournaments');
    }
};
