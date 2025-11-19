<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Category;

class CategorySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $categories = [
            ['name' => 'Electronics'],
            ['name' => 'Clothing'],
            ['name' => 'Books'],
            ['name' => 'Home & Kitchen'],
            ['name' => 'Sports & Outdoors'],
            ['name' => 'Beauty & Personal Care'],
            ['name' => 'Toys & Games'],
            ['name' => 'Automotive'],
            ['name' => 'Health & Wellness'],
            ['name' => 'Food & Grocery'],
        ];

        foreach ($categories as $category) {
            Category::create($category);
        }
    }
}
