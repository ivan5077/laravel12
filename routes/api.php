<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\ProductController;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

// Public export route (no authentication required)
Route::get('products/export', [ProductController::class, 'export']);

// Product API routes with authentication
Route::middleware('auth:sanctum')->group(function () {
    Route::apiResource('products', ProductController::class)->except(['show']);
    Route::get('products/{product}', [ProductController::class, 'show']);
    Route::post('products/bulk-delete', [ProductController::class, 'bulkDelete']);
    Route::get('categories', [ProductController::class, 'categories']);
});