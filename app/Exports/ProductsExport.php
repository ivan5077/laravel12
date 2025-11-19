<?php

namespace App\Exports;

use App\Models\Product;
use Illuminate\Http\Request;
use Maatwebsite\Excel\Concerns\FromQuery;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithMapping;
use Maatwebsite\Excel\Concerns\Exportable;

class ProductsExport implements FromQuery, WithHeadings, WithMapping
{
    use Exportable;

    /** @var \Illuminate\Http\Request|null */
    protected $request;

    public function __construct(Request $request = null)
    {
        $this->request = $request;
    }

    public function query()
    {
        $query = Product::with('category');
        
        // Apply the same filters as your index method
        if ($this->request && $this->request->filled('category_id')) {
            $query->where('category_id', $this->request->category_id);
        }

        if ($this->request && $this->request->filled('status')) {
            $isEnabled = $this->request->status === 'enabled';
            $query->where('enabled', $isEnabled);
        }

        if ($this->request && $this->request->filled('search')) {
            $query->where('name', 'like', '%' . $this->request->search . '%');
        }
        
        return $query;
    }

    public function headings(): array
    {
        return [
            'ID',
            'Name',
            'Category',
            'Description',
            'Price',
            'Stock',
            'Enabled',
            'Created At',
            'Updated At',
        ];
    }

    /**
     * THIS IS THE CRITICAL PART - Convert each Product model to a plain array
     */
    public function map($product): array
    {
        return [
            $product->id,
            $product->name,
            $product->category ? $product->category->name : '',
            $product->description ?? '',
            $product->price,
            $product->stock,
            $product->enabled ? 'Yes' : 'No',
            $product->created_at->format('Y-m-d H:i:s'),
            $product->updated_at->format('Y-m-d H:i:s'),
        ];
    }
}