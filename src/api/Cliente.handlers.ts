import { Response, Request, NextFunction } from 'express';
import Cliente, { Client } from '../schemas/Cliente';

export async function createClient(req: Request, res: Response, next: NextFunction) {
    try {
        const client = new Cliente(req.body as Client);
        const savedClient = await client.save();
        console.log(`Client with created with 'nro_cliente' ${savedClient.nro_cliente}`);
        res.status(201).json(savedClient);
    } catch (error: any) {
        console.error('Error creating cliente:', error);
        res.status(500).json({error: `Internal Server Error: ${error.message}`});
        next(error);
    }
}

export async function updateClient(req: Request, res: Response, next: NextFunction) {
    try {
        const { nro_cliente } = req.params;
        console.log(`Updating client with 'nro_cliente' ${nro_cliente}`);
        const clientData = req.body as Partial<Client>;
        const updatedClient = await Cliente.findOneAndUpdate(
            { nro_cliente },
            { $set: clientData },
            { new: true }
        );

        if (!updatedClient) {
            res.status(404).json({ error: 'Client not found' });
            console.log(`Client with 'nro_cliente' ${nro_cliente} not found`);
        } else {
            res.status(200).json(updatedClient);
            console.log(`Client with 'nro_cliente' ${nro_cliente} updated`);
        }
    } catch (error: any) {
        console.error('Error updating client:', error);
        res.status(500).json({ error: `Internal Server Error: ${error.message}` });
        next(error);
    }
}

export async function deleteClient(req: Request, res: Response, next: NextFunction) {
    try {
        const { nro_cliente } = req.params;
        console.log(`Deleting client with 'nro_cliente' ${nro_cliente}`);

        await Cliente.findOneAndDelete({ nro_cliente });
        console.log(`Client with 'nro_cliente' ${nro_cliente} deleted`);
        res.status(204).send();
    } catch (error: any) {
        console.error('Error deleting client:', error);
        res.status(500).json({ error: `Internal Server Error: ${error.message}` });
        next(error);
    }
}

export async function getClient(req: Request, res: Response, next: NextFunction) {
    try {
        const { nro_cliente } = req.params;
        console.log(`Getting client with 'nro_cliente' ${nro_cliente}`);

        const client = await Cliente.findOne({ nro_cliente });
        if (!client) {
            res.status(404).json({ error: 'Client not found' });
            console.log(`Client with 'nro_cliente' ${nro_cliente} not found`);
        } else {
            res.status(200).json(client);
            console.log(`Client with 'nro_cliente' ${nro_cliente} found`);
        }
    } catch (error: any) {
        console.error('Error getting client:', error);
        res.status(500).json({ error: `Internal Server Error: ${error.message}` });
        next(error);
    }
}