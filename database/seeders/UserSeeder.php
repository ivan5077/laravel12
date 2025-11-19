<?php
namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User; // Import the User model
use Illuminate\Support\Facades\Hash; // Import the Hash facade

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        User::create([
            'name' => 'Assigment Admin',
            'email' => 'admin@example.com',
            'password' => Hash::make('password'),
        ]);
        
        // You can add more users here
    }
}