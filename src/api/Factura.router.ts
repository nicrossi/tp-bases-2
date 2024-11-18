import e, {Router, Request, Response, NextFunction} from 'express';
import * as handlers from './Factura.handlers';

const facturaRouter = Router();

facturaRouter.get('/', handlers.getFacturas);

facturaRouter.post('/', handlers.createFactura);

facturaRouter.put('/:nro_factura', handlers.updateFactura);

facturaRouter.delete('/:nro_factura', handlers.deleteFactura);

facturaRouter.get('/query/7',(req:Request, res:Response, next:NextFunction) => {
    req.params.nombre = 'Kai';
    req.params.apellido = 'Bullock';
    handlers.getFacturasByClient(req, res, next);
});

facturaRouter.get('/query/9',(req:Request, res:Response, next:NextFunction) => {
    req.query.marca = 'Ipsum';
    handlers.getFacturasByProductBrand(req, res, next);
});

export default facturaRouter;