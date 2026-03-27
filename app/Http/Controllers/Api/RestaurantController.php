<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Restaurant;

class RestaurantController extends Controller
{
    // Esta función devuelve la lista a React
    public function index()
    {
        $restaurants = Restaurant::with('reviews')->get();
        return response()->json(['data' => $restaurants], 200);
    }

    // Esta función guarda el nuevo restaurante
    public function store(Request $request)
    {
        try {
            $request->validate([
                'name' => 'required|string',
                'address' => 'required|string',
            ]);

            $restaurant = Restaurant::create([
                'name' => $request->name,
                'address' => $request->address,
                'lat' => 20.5931,
                'lng' => -100.3875
            ]);

            return response()->json([
                'message' => 'Restaurante creado con éxito',
                'data' => $restaurant
            ], 201);
            
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Error: ' . $e->getMessage()
            ], 500);
        }
    }
}