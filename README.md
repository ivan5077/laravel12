# Laravel 12 CRUD Application with React Admin Dashboard

A full‑stack example that provides a Laravel 12 API for managing **products** and **categories**, and a React (Material‑UI) admin panel for CRUD operations, bulk delete, filtering, pagination, and Excel export.

---

## Table of Contents

- [Features](#features)
- [Requirements](#requirements)
- [Installation](#installation)
  - [Backend (Laravel)](#backend-laravel)
  - [Frontend (React)](#frontend-react)
- [Database Configuration](#database-configuration)
- [Running the Application](#running-the-application)
- [Testing](#testing)
- [API Documentation](#api-documentation)
- [API Usage](#api-usage)
  - [Authentication](#authentication)
  - [Endpoints](#endpoints)
  - [Example Requests](#example-requests)
- [Seeded Data](#seeded-data) <!-- NEW -->
- [License](#license)

---

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

| Tool | Minimum version |
|------|-----------------|
| PHP | 8.0 |
| Composer | latest |
| MySQL / MariaDB | any |
| Node.js | 14+ |
| npm | 6+ |

---

## Installation

1. Clone the repository
2. Run `composer install`
3. Copy `.env.example` to `.env` and configure your database settings
4. Run `php artisan key:generate`
5. Run `php artisan migrate`
6. **Run the seeders** (this will create default categories **and** an admin user)  
   ```bash
   php artisan db:seed --class=CategorySeeder
   php artisan db:seed --class=UserSeeder   # <-- creates admin@example.com / password
   ```
7. Install Excel export package: `composer require maatwebsite/excel`
8. Install Swagger documentation package: `composer require darkaonline/l5-swagger`
9. Publish Swagger configuration: `php artisan vendor:publish --provider "L5Swagger\L5SwaggerServiceProvider"`
10. **Backend (Laravel) – start the API server**  
    ```bash
    php artisan serve
    ```
11. **Frontend (React) – set up the dashboard**  
    ```bash
    # 1️⃣ Change to the dashboard folder
    cd dashboard
    
    # 2️⃣ Install JavaScript dependencies
    npm install
    
    # 3️⃣ Start the React dev server (choose one)
    npm run dev   # Vite (default)
    # or
    npm start     # CRA‑style alias
    ```
12. Open the admin dashboard in your browser (usually `http://localhost:5173`).  
13. **Log in** using the credentials created by the `UserSeeder`:

   ```
   Email:    admin@example.com
   Password: password
   ```

   You can change the password later via the Laravel Tinker console or by updating the user record directly in the database.

---

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

---

## Running the Application

1. **Backend (Laravel)**:
   ```bash
   php artisan serve
   ```
   API base URL: `http://127.0.0.1:8000/api`.

2. **Frontend (React)** – after you have run `npm install` (step 11 above):
   ```bash
   npm run dev   # or npm start
   ```
   Dashboard URL: `http://localhost:5173` (or the port displayed by Vite).

---

## Testing
The application includes feature and unit tests (e.g., `ProductApiTest.php`) to ensure core functionality works correctly. All feature tests utilize the `RefreshDatabase` trait, ensuring a clean state for every test run.

To execute the complete test suite, use the following Artisan command:

```bash
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

1. Make sure a user exists (the `UserSeeder` already created one):
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
- `GET /api/products` – list (filterable, paginated)  
  *Query params*: `category_id`, `status`, `search`, `per_page`
- `POST /api/products` – create a product
- `GET /api/products/{id}` – view a product
- `PUT/PATCH /api/products/{id}` – update a product
- `DELETE /api/products/{id}` – soft‑delete a product
- `POST /api/products/bulk-delete` – delete many (`ids[]`)
- `GET /api/products/export` – export filtered list to **Excel** (`.xlsx`)

#### Categories
- `GET /api/categories` – list all categories

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

## Seeded Data <!-- NEW -->

### Categories
Run the category seeder (already included in the installation steps):

```bash
php artisan db:seed --class=CategorySeeder
```

The following categories are pre‑seeded:

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

### Admin User
The **UserSeeder** creates a single admin account that the React front‑end uses for login:

| Email                | Password |
|----------------------|----------|
| `admin@example.com` | `password` |

You can change the password later via Tinker:

```bash
php artisan tinker
>>> $user = App\Models\User::where('email', 'admin@example.com')->first();
>>> $user->password = Hash::make('new‑strong‑password');
>>> $user->save();
```

---

## License

This project is open‑sourced software licensed under the [MIT license](https://opensource.org/licenses/MIT).