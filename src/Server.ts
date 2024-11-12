import express, { NextFunction, Request, Response } from 'express';
import { connectToMongoDB } from './mongoConnection';

const port = 3000;

export class Server {

    private app = express();

    constructor() {
        this.initializeDataSources();
    }

    private async initializeDataSources() {
        await connectToMongoDB();
    }

    startServer() {
        // port
        this.app.listen(port, () => {
            console.log('Listening on port ' + port)
        })

        // healthcheck
        this.app.use('/healthcheck', (req: Request, res: Response) => {
            res.send('OK');
        })

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
