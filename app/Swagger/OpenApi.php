<?php

/**
 * @OA\Info(
 *      version="1.0.0",
 *      title="Laravel 12 CRUD API",
 *      description="API documentation for the Laravel 12 CRUD application"
 * )
 */

/**
 * @OA\PathItem(path="/api/products")
 */

/**
 * @OA\PathItem(path="/api/products/{id}")
 */

/**
 * @OA\PathItem(path="/api/products/bulk-delete")
 */

/**
 * @OA\PathItem(path="/api/products/export")
 */

/**
 * @OA\PathItem(path="/api/categories")
 */

/**
 * @OA\Server(
 *      url=L5_SWAGGER_CONST_HOST,
 *      description="API Server"
 * )
 */

/**
 * @OA\SecurityScheme(
 *      securityScheme="sanctum",
 *      type="apiKey",
 *      name="Authorization",
 *      in="header",
 *      description="Enter token in format (Bearer <token>)"
 * )
 */