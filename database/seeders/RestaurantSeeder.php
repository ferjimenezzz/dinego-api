<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class RestaurantSeeder extends Seeder
{
    public function run(): void
    {
        DB::table('restaurants')->insert([
            [
                'name' => 'La Parrilla Queretana',
                'address' => 'Blvd. Bernardo Quintana 123',
                'lat' => 20.5880,
                'lng' => -100.3890,
            ],
            [
                'name' => 'El Mesón de Chucho el Roto',
                'address' => 'Plaza de Armas, Centro Histórico',
                'lat' => 20.5931,
                'lng' => -100.3915,
            ]
        ]);
    }
}