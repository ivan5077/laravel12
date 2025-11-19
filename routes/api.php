<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\AuthController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
*/

Route::post('/login', [AuthController::class, 'login'])->name('api.login');

Route::middleware('auth:sanctum')->group(function () {
    Route::get('/user', fn (Request $request) => $request->user());

    Route::post('/logout', [AuthController::class, 'logout'])->name('api.logout');

    // ----- EXPORT MUST BE BEFORE THE RESOURCE ROUTE -----
    Route::get('/products/export', [ProductController::class, 'export'])->name('products.export');

    // Resource routes (index, show, store, update, destroy, …)
    Route::apiResource('products', ProductController::class);

    Route::post('/products/bulk-delete', [ProductController::class, 'bulkDelete']);
    Route::get('/categories', [ProductController::class, 'categories']);
});
Route::get('/products/export', [ProductController::class, 'export'])->name('products.export');
