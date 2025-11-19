<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

/**
 * @OA\Schema(
 *      schema="Product",
 *      required={"id", "name", "category_id", "price", "stock", "enabled"},
 *      @OA\Property(property="id", type="integer", example=1),
 *      @OA\Property(property="name", type="string", example="Wireless Headphones"),
 *      @OA\Property(property="category_id", type="integer", example=1),
 *      @OA\Property(property="description", type="string", example="High-quality wireless headphones"),
 *      @OA\Property(property="price", type="number", format="float", example=99.99),
 *      @OA\Property(property="stock", type="integer", example=50),
 *      @OA\Property(property="enabled", type="boolean", example=true),
 *      @OA\Property(property="created_at", type="string", format="date-time"),
 *      @OA\Property(property="updated_at", type="string", format="date-time"),
 *      @OA\Property(property="deleted_at", type="string", format="date-time", nullable=true),
 *      @OA\Property(
 *          property="category",
 *          ref="#/components/schemas/Category"
 *      )
 * )
 */
class Product extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'name',
        'category_id',
        'description',
        'price',
        'stock',
        'enabled',
    ];

    protected $casts = [
        'price' => 'decimal:2',
        'enabled' => 'boolean',
    ];

    // Define the inverse relationship with Category
    public function category()
    {
        return $this->belongsTo(Category::class);
    }

    // Modify the JSON response to include category information
    protected function serializeDate(\DateTimeInterface $date)
    {
        return $date->format('Y-m-d H:i:s');
    }

    // Accessor to include category information in JSON response
    public function toArray()
    {
        $array = parent::toArray();
        $array['category'] = $this->category ? [
            'id' => $this->category->id,
            'name' => $this->category->name,
        ] : null;
        return $array;
    }
}
