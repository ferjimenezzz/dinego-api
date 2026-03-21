<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Restaurant extends Model
{
    protected $fillable = ['google_place_id', 'name', 'address', 'lat', 'lng'];

    public function reviews() {
        return $this->hasMany(Review::class);
    }
}