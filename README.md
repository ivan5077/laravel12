# Laravel 12 CRUD Application

This is a Laravel 12 application with CRUD operations for products and categories.

## Features

- **Product Management**
  - Create products with name, category, description, price, stock, and status
  - Read products with filtering and pagination
  - Update product information
  - Delete products (soft delete) with bulk delete functionality
  - Export products to Excel

- **Category Management**
  - Create and manage product categories
  - One-to-many relationship between categories and products

## Requirements

- PHP 8.0 or higher
- MySQL/MariaDB
- Composer

## Installation

1. Clone the repository
2. Run `composer install`
3. Copy `.env.example` to `.env` and configure your database settings
4. Run `php artisan key:generate`
5. Run `php artisan migrate`
6. Run `php artisan db:seed` to seed categories
7. Install Excel export package: `composer require maatwebsite/excel`
8. Install Swagger documentation package: `composer require darkaonline/l5-swagger`
9. Publish Swagger configuration: `php artisan vendor:publish --provider "L5Swagger\L5SwaggerServiceProvider"`
10. Start the development server with `php artisan serve`

## Database Configuration

Make sure to enable the following PHP extensions in your `php.ini`:
- `extension=pdo_mysql`
- `extension=mysqli`
- `extension=gd`

### MySQL Environment Setup

Update your `.env` file with the following database configuration:

```env
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=assigment
DB_USERNAME=root
DB_PASSWORD=
```

## Testing
The application includes feature and unit tests (e.g., ProductApiTest.php) to ensure core functionality works correctly. All feature tests utilize the RefreshDatabase trait, ensuring a clean state for every test run.

To execute the complete test suite, use the following Artisan command:
```
php artisan test
```
## API Documentation

API documentation is available through Swagger UI. After starting the application, visit:
```
http://localhost:8000/api/documentation
```

## API Usage

All API endpoints are prefixed with `/api/` and require proper authentication using Laravel Sanctum.

### Authentication
To use the API, you need to generate an API token using Sanctum:

1. First, make sure you have a user in your database. If not, create one:
```bash
php artisan tinker
```
```php
$user = new App\Models\User;
$user->name = 'Admin User';
$user->email = 'admin@example.com';
$user->password = bcrypt('password');
$user->save();
```

2. Create a token for the user:
```bash
php artisan tinker
```
```php
$user = App\Models\User::where('email', 'admin@example.com')->first();
$token = $user->createToken('api-token');
echo $token->plainTextToken;
```

Include the token in your requests:
```
Authorization: Bearer YOUR_API_TOKEN
```

### API Endpoints

#### Products
- `GET /api/products` - List all products with pagination and filtering
  - Query Parameters:
    - `category_id` - Filter by category
    - `status` - Filter by status (enabled/disabled)
    - `search` - Search by product name
    - `per_page` - Number of items per page (default: 10)
- `POST /api/products` - Create a new product
  - Body: `name`, `category_id`, `description`, `price`, `stock`, `enabled`
- `GET /api/products/{id}` - Get a specific product
- `PUT/PATCH /api/products/{id}` - Update a product
- `DELETE /api/products/{id}` - Delete a product (soft delete)
- `POST /api/products/bulk-delete` - Bulk delete products
  - Body: `ids` (array of product IDs)
- `GET /api/products/export` - Export products to Excel
  - Query Parameters:
    - `category_id` - Filter by category
    - `status` - Filter by status (enabled/disabled)
    - `search` - Search by product name

#### Categories
- `GET /api/categories` - List all categories

### Example Requests

#### Get Products
```bash
curl -H "Authorization: Bearer YOUR_API_TOKEN" \
http://localhost:8000/api/products
```

#### Create Product
```bash
curl -X POST \
-H "Authorization: Bearer YOUR_API_TOKEN" \
-H "Content-Type: application/json" \
-d '{
  "name": "Sample Product",
  "category_id": 1,
  "description": "This is a sample product",
  "price": 29.99,
  "stock": 100,
  "enabled": true
}' \
http://localhost:8000/api/products
```

#### Filter Products
```bash
curl -H "Authorization: Bearer YOUR_API_TOKEN" \
http://localhost:8000/api/products?category_id=1&status=enabled&per_page=5
```

#### Export Products to Excel
```bash
curl -H "Authorization: Bearer YOUR_API_TOKEN" \
http://localhost:8000/api/products/export?category_id=1 \
-o products_export.xlsx
```

## Seeded Categories

The following categories are pre-seeded:
- Electronics
- Clothing
- Books
- Home & Kitchen
- Sports & Outdoors
- Beauty & Personal Care
- Toys & Games
- Automotive
- Health & Wellness
- Food & Grocery

## License

This project is open-sourced software licensed under the [MIT license](https://opensource.org/licenses/MIT).