<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        DB::table('restaurants')->insert([
            [
                'name' => 'La Parrilla Queretana',
                'address' => 'Blvd. Bernardo Quintana 123',
                'lat' => 20.58800000,
                'lng' => -100.38900000
            ],
            [
                'name' => 'Hacienda La Laborcilla',
                'address' => 'Prol. Corregidora Norte 911, Centro Histórico',
                'lat' => 20.60350000,
                'lng' => -100.38420000
            ],
            [
                'name' => 'Tikua Sur Este',
                'address' => 'Calle 5 de Mayo 46, Centro',
                'lat' => 20.59310000,
                'lng' => -100.38750000
            ],
            [
                'name' => 'El Mesón de Chucho el Roto',
                'address' => 'Plaza de Armas, Centro Histórico',
                'lat' => 20.59400000,
                'lng' => -100.39000000
            ],
            [
                'name' => 'Brewer Gastropub',
                'address' => 'Plaza Boulevares, Local 12',
                'lat' => 20.60120000,
                'lng' => -100.39510000
            ],
        ]);
    }
}