import { Router } from 'express';
import * as handlers from './Producto.handlers';

const productoRouter = Router();

productoRouter.get('/', handlers.getAllProducts);

productoRouter.post('/', handlers.createProduct);

productoRouter.put('/:codigo_producto', handlers.updateProduct);

productoRouter.delete('/:codigo_producto', handlers.deleteProduct);

productoRouter.get('/:codigo_producto', handlers.getProduct);

productoRouter.get('/:codigo_producto/stock', handlers.getStockLevel);

productoRouter.put('/:codigo_producto/stock', handlers.updateStockLevel);

productoRouter.post('/:codigo_producto/stock', handlers.setStockLevel);

productoRouter.get('/query/8', handlers.getProductSoldAtLeastOnce);

productoRouter.get('/query/12', handlers.getProductNotSold);

export default productoRouter;
