import { Router, Request, Response } from 'express';
import * as handlers from './Producto.handlers';

const productoRouter = Router();

productoRouter.get('/', handlers.getAllProducts);

productoRouter.post('/', handlers.createProduct);

productoRouter.put('/:codigo_producto', handlers.updateProduct);

productoRouter.delete('/:codigo_producto', handlers.deleteProduct);

productoRouter.get('/:codigo_producto', handlers.getProduct);

export default productoRouter;
