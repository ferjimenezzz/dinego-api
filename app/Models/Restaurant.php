<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Restaurant extends Model
{
    use HasFactory;

    // Esto da permiso para guardar el nombre y la dirección
    protected $fillable = ['name', 'address', 'lat', 'lng'];

    // Esto trae las reseñas de cada lugar
    public function reviews()
    {
        return $this->hasMany(Review::class);
    }
}