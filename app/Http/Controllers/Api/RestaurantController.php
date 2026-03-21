<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Restaurant;
use Illuminate\Http\Request;

class RestaurantController extends Controller
{
    public function index()
    {
        $restaurants = Restaurant::all();
        return response()->json(['data' => $restaurants], 200);
    }

    public function show($id)
    {
        $restaurant = Restaurant::with('reviews')->find($id);
        if (!$restaurant) {
            return response()->json(['error' => 'Restaurante no encontrado'], 404);
        }
        return response()->json(['data' => $restaurant], 200);
    }
}