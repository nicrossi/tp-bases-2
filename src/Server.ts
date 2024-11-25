import express, { NextFunction, Request, Response } from 'express';
import { connectToMongoDB } from './mongoConnection';
import clienteRouter from './api/Cliente.router';
import productoRouter from './api/Producto.router';
import facturaRouter from './api/Factura.router';
import { connectToRedis } from "./redisConnection";
import CsvService from "./service/CsvService";

const port = 3000;

export class Server {

    private app = express();

    constructor() {
        this.initializeDataSources();
    }

    private async initializeDataSources() {
        await connectToMongoDB();
        await connectToRedis();
    }

    startServer() {
        this.app.use(express.json());
        // port
        this.app.listen(port, () => {
            console.log('Listening on port ' + port)
        })

        // healthcheck
        this.app.use('/healthcheck', (req: Request, res: Response) => {
            res.send('OK');
        })

        this.app.use('/clientes', clienteRouter)

        this.app.use('/productos', productoRouter); 

        this.app.use('/facturas', facturaRouter);

        this.app.use('/data', async (req: Request, res: Response) => {
            const rsp = await CsvService.loadData();
            res.status(rsp.status).send(rsp.message);
        });

        // this prints the error in the console, rather than in the response!
        this.app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
            console.error(err.stack)
            res.send(err.message)
            next();
        })

        this.app.use('/', (req: Request, res: Response) => {
            res.send('OK');
        })
    }

}

new Server().startServer()
