import { Router, Request, Response, NextFunction } from 'express';
import * as handlers from './Cliente.handlers'

const clienteRouter = Router();
/*
clienteRouter.get('/', (req: Request, res: Response) => {
    res.send('Hello from Cliente');
})
*/

clienteRouter.get('/', handlers.getClients);

clienteRouter.post('/', handlers.createClient);

clienteRouter.put('/:nro_cliente', handlers.updateClient);

clienteRouter.delete('/:nro_cliente', handlers.deleteClient);

clienteRouter.get('/:nro_cliente', handlers.getClient);

/* Client queries */

clienteRouter.get('/query/1', handlers.getClients);

clienteRouter.get('/query/2', (req:Request, res:Response, next:NextFunction) => {
    req.params.nombre = 'Jacob';
    req.params.apellido = 'Cooper';
    handlers.getClientPhoneByName(req, res, next);
});

clienteRouter.get('/query/3',handlers.getPhones);

clienteRouter.get('/query/4',handlers.getClientsWithBill);

clienteRouter.get('/query/5',handlers.getClientsWithNoBill);

clienteRouter.get('/query/6',handlers.getClientsWithBillCount);

export default clienteRouter;