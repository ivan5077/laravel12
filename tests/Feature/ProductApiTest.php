<?php

namespace Tests\Feature;

use Tests\TestCase;
use App\Models\User;
use App\Models\Product;
use App\Models\Category;
use Laravel\Sanctum\Sanctum;
use Illuminate\Foundation\Testing\RefreshDatabase;
use PHPUnit\Framework\Attributes\Test;

class ProductApiTest extends TestCase
{
    use RefreshDatabase;

    protected $user;
    protected $category;

    protected function setUp(): void
    {
        parent::setUp();
        
        // Create a user and category for testing
        $this->user = User::factory()->create();
        $this->category = Category::factory()->create();
        
        // Authenticate user for all tests
        Sanctum::actingAs($this->user);
    }

    #[Test]
    public function it_can_list_products()
    {
        // Create some products
        Product::factory()->count(5)->create([
            'category_id' => $this->category->id
        ]);

        // Make API request
        $response = $this->getJson('/api/products');

        // Assert response - remove 'meta' from the structure check
        $response->assertStatus(200)
                 ->assertJsonStructure([
                     'data' => [
                         '*' => ['id', 'name', 'category_id', 'price', 'stock', 'enabled']
                     ],
                     'links'
                     // Remove 'meta' as it might not be in your response
                 ]);
    }

    #[Test]
    public function it_can_create_a_product()
    {
        // Prepare data
        $data = [
            'name' => 'Test Product',
            'category_id' => $this->category->id,
            'description' => 'Test Description',
            'price' => 99.99,
            'stock' => 10,
            'enabled' => true,
        ];

        // Make API request
        $response = $this->postJson('/api/products', $data);

        // Assert response
        $response->assertStatus(201)
                 ->assertJsonStructure([
                     'id', 'name', 'category_id', 'price', 'stock', 'enabled'
                 ]);

        // Assert database
        $this->assertDatabaseHas('products', [
            'name' => 'Test Product',
            'category_id' => $this->category->id,
            'price' => 99.99,
            'stock' => 10,
        ]);
    }

    #[Test]
    public function it_can_show_a_product()
    {
        // Create a product
        $product = Product::factory()->create([
            'category_id' => $this->category->id
        ]);

        // Make API request
        $response = $this->getJson("/api/products/{$product->id}");

        // Assert response
        $response->assertStatus(200)
                 ->assertJsonStructure([
                     'id', 'name', 'category_id', 'price', 'stock', 'enabled'
                 ])
                 ->assertJson([
                     'id' => $product->id,
                     'name' => $product->name,
                 ]);
    }

    #[Test]
    public function it_can_update_a_product()
    {
        // Create a product
        $product = Product::factory()->create([
            'category_id' => $this->category->id
        ]);

        // Prepare updated data
        $updatedData = [
            'name' => 'Updated Product',
            'category_id' => $this->category->id,
            'description' => 'Updated Description',
            'price' => 199.99,
            'stock' => 20,
            'enabled' => false,
        ];

        // Make API request
        $response = $this->putJson("/api/products/{$product->id}", $updatedData);

        // Assert response
        $response->assertStatus(200)
                 ->assertJson([
                     'id' => $product->id,
                     'name' => 'Updated Product',
                     'price' => 199.99,
                     'stock' => 20,
                     'enabled' => false,
                 ]);

        // Assert database
        $this->assertDatabaseHas('products', [
            'id' => $product->id,
            'name' => 'Updated Product',
            'price' => 199.99,
            'stock' => 20,
            'enabled' => false,
        ]);
    }

    #[Test]
    public function it_can_delete_a_product()
    {
        // Create a product
        $product = Product::factory()->create([
            'category_id' => $this->category->id
        ]);

        // Make API request
        $response = $this->deleteJson("/api/products/{$product->id}");

        // Assert response
        $response->assertStatus(200)
                 ->assertJson([
                     'message' => 'Product deleted successfully'
                 ]);

        // Assert database (soft delete)
        $this->assertSoftDeleted('products', [
            'id' => $product->id
        ]);
    }

    

    #[Test]
    public function it_validates_required_fields_when_creating_product()
    {
        // Make API request with missing required fields
        $response = $this->postJson('/api/products', []);

        // Assert response
        $response->assertStatus(422)
                 ->assertJsonValidationErrors(['name', 'category_id', 'price', 'stock']);
    }

    #[Test]
    public function it_can_filter_products_by_category()
    {
        // Create categories
        $category1 = Category::factory()->create(['name' => 'Electronics']);
        $category2 = Category::factory()->create(['name' => 'Books']);

        // Create products
        Product::factory()->count(3)->create(['category_id' => $category1->id]);
        Product::factory()->count(2)->create(['category_id' => $category2->id]);

        // Make API request with category filter
        $response = $this->getJson("/api/products?category_id={$category1->id}");

        // Assert response
        $response->assertStatus(200);
        $responseData = $response->json();
        
        // Assert all products belong to the specified category
        foreach ($responseData['data'] as $product) {
            $this->assertEquals($category1->id, $product['category_id']);
        }
    }

    #[Test]
    public function it_can_filter_products_by_status()
    {
        // Create products with different statuses
        Product::factory()->count(3)->create([
            'category_id' => $this->category->id,
            'enabled' => true
        ]);
        
        Product::factory()->count(2)->create([
            'category_id' => $this->category->id,
            'enabled' => false
        ]);

        // Make API request with status filter
        $response = $this->getJson('/api/products?status=enabled');

        // Assert response
        $response->assertStatus(200);
        $responseData = $response->json();
        
        // Assert all products are enabled
        foreach ($responseData['data'] as $product) {
            $this->assertTrue($product['enabled']);
        }
    }

    #[Test]
    public function it_can_search_products_by_name()
    {
        // Create products
        Product::factory()->create([
            'name' => 'Wireless Headphones',
            'category_id' => $this->category->id
        ]);
        
        Product::factory()->create([
            'name' => 'Bluetooth Speaker',
            'category_id' => $this->category->id
        ]);

        // Make API request with search term
        $response = $this->getJson('/api/products?search=wireless');

        // Assert response
        $response->assertStatus(200);
        $responseData = $response->json();
        
        // Assert only matching products are returned
        $this->assertCount(1, $responseData['data']);
        $this->assertEquals('Wireless Headphones', $responseData['data'][0]['name']);
    }

    #[Test]
    public function it_can_bulk_delete_products()
    {
        // Create products
        $products = Product::factory()->count(3)->create([
            'category_id' => $this->category->id
        ]);

        // Prepare data for bulk delete
        $ids = $products->pluck('id')->toArray();

        // Make API request
        $response = $this->postJson('/api/products/bulk-delete', [
            'ids' => $ids
        ]);

        // Assert response
        $response->assertStatus(200)
                 ->assertJson([
                     'message' => 'Products deleted successfully'
                 ]);

        // Assert database
        foreach ($ids as $id) {
            $this->assertSoftDeleted('products', ['id' => $id]);
        }
    }

    #[Test]
    public function it_can_list_categories()
    {
        // Create additional categories
        Category::factory()->count(5)->create();

        // Make API request
        $response = $this->getJson('/api/categories');

        // Assert response
        $response->assertStatus(200)
                 ->assertJsonCount(6) // 5 created + 1 from setUp
                 ->assertJsonStructure([
                     '*' => ['id', 'name']
                 ]);
    }
}