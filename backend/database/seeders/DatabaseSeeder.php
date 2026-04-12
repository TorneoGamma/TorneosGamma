<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        // Administrador
        User::create([
            'name'     => 'Administrador',
            'email'    => 'admin@torneos.com',
            'password' => Hash::make('password'),
            'role'     => 'admin',
        ]);

        // Usuario de prueba
        User::create([
            'name'     => 'Usuario Demo',
            'email'    => 'user@torneos.com',
            'password' => Hash::make('password'),
            'role'     => 'user',
        ]);
    }
}
