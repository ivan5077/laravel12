<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

/**
 * @OA\Schema(
 *      schema="Category",
 *      required={"id", "name"},
 *      @OA\Property(property="id", type="integer", example=1),
 *      @OA\Property(property="name", type="string", example="Electronics")
 * )
 */
class Category extends Model
{
    use HasFactory;

    protected $fillable = ['name'];

    // Define the relationship with Product
    public function products()
    {
        return $this->hasMany(Product::class);
    }
}