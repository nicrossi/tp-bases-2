import { Response, Request, NextFunction } from 'express';
import Producto, { Product } from '../schemas/Producto';

export async function createProduct(req: Request, res: Response, next: NextFunction) {
    try {
        const product = new Producto(req.body as Product);
        const savedProduct = await product.save();
        console.log(`Product created with 'codigo_producto' ${savedProduct.codigo_producto}`);
        res.status(201).json(savedProduct);
    } catch (error: any) {
        console.error('Error creating product:', error);
        res.status(500).json({error: `Internal Server Error: ${error.message}`});
        next(error);
    }
}

export async function updateProduct(req: Request, res: Response, next: NextFunction) {
    try {
        const { codigo_producto } = req.params;
        console.log(`Updating product with 'codigo_producto' ${codigo_producto}`);
        const productData = req.body as Partial<Product>;
        const updatedProduct = await Producto.findOneAndUpdate(
            { codigo_producto },
            { $set: productData },
            { new: true }
        );

        if (!updatedProduct) {
            res.status(404).json({ error: 'Product not found' });
            console.log(`Product with 'codigo_producto' ${codigo_producto} not found`);
        } else {
            res.status(200).json(updatedProduct);
            console.log(`Product with 'codigo_producto' ${codigo_producto} updated`);
        }
    } catch (error: any) {
        console.error('Error updating product:', error);
        res.status(500).json({ error: `Internal Server Error: ${error.message}` });
        next(error);
    }
}

export async function deleteProduct(req: Request, res: Response, next: NextFunction) {
    try {
        const { codigo_producto } = req.params;
        console.log(`Deleting product with 'codigo_producto' ${codigo_producto}`);

        await Producto.findOneAndDelete({ codigo_producto });
        console.log(`Product with 'codigo_producto' ${codigo_producto} deleted`);
        res.status(204).send();
    } catch (error: any) {
        console.error('Error deleting product:', error);
        res.status(500).json({ error: `Internal Server Error: ${error.message}` });
        next(error);
    }
}

export async function getProduct(req: Request, res: Response, next: NextFunction) {
    try {
        const { codigo_producto } = req.params;
        console.log(`Getting product with 'codigo_producto' ${codigo_producto}`);

        const product = await Producto.findOne({ codigo_producto });
        if (!product) {
            res.status(404).json({ error: 'Product not found' });
            console.log(`Product with 'codigo_producto' ${codigo_producto} not found`);
        } else {
            res.status(200).json(product);
            console.log(`Product with 'codigo_producto' ${codigo_producto} found`);
        }
    } catch (error: any) {
        console.error('Error getting product:', error);
        res.status(500).json({ error: `Internal Server Error: ${error.message}` });
        next(error);
    }
}

export async function getAllProducts(req: Request, res: Response, next: NextFunction) {
    try {
        console.log('Getting all products');

        const products = await Producto.find(); 
        if (products.length === 0) {
            res.status(404).json({ error: 'No products found' });
            console.log('No products found');
        } else {
            res.status(200).json(products);
            console.log('Products found');
        }
    } catch (error: any) {
        console.error('Error getting products:', error);
        res.status(500).json({ error: `Internal Server Error: ${error.message}` });
        next(error);
    }
}
