<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Tournament extends Model
{
    use HasFactory;

    protected $fillable = [
        'created_by', 'name', 'discipline', 'description',
        'max_teams', 'status', 'current_round', 'champion_id', 'starts_at',
    ];

    protected $casts = [
        'starts_at' => 'datetime',
    ];

    public function creator()
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    public function teams()
    {
        return $this->hasMany(Team::class);
    }

    public function rounds()
    {
        return $this->hasMany(Round::class)->orderBy('number');
    }

    public function matches()
    {
        return $this->hasMany(TournamentMatch::class);
    }

    public function registrations()
    {
        return $this->hasMany(TournamentRegistration::class);
    }

    public function champion()
    {
        return $this->belongsTo(Team::class, 'champion_id');
    }
}
