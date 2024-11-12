import { Router, Request, Response } from 'express';
import * as handlers from './Cliente.handlers'

const clienteRouter = Router();

clienteRouter.get('/', (req: Request, res: Response) => {
    res.send('Hello from Cliente');
})

clienteRouter.post('/', handlers.createClient);

clienteRouter.put('/:nro_cliente', handlers.updateClient);

clienteRouter.delete('/:nro_cliente', handlers.deleteClient);

clienteRouter.get('/:nro_cliente', handlers.getClient);

export default clienteRouter;