import { Response, Request, NextFunction } from 'express';
import Cliente, { Client } from '../schemas/Cliente';
import RedisService from "../service/redisService";

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

export async function getClients(req: Request, res: Response, next: NextFunction) {
    try {
        console.log('Getting all clients');
        const clients = await Cliente.find();
        res.status(200).json(clients);
        console.log('All clients found');
    } catch (error: any) {
        console.error('Error getting clients:', error);
        res.status(500).json({ error: `Internal Server Error: ${error.message}` });
        next(error);
    }
}

export async function getClientPhoneByName(req: Request, res: Response, next: NextFunction) {
    try {
        const { nombre , apellido} = req.params;
        console.log(`Getting client with 'nombre' ${nombre} and 'apellido' ${apellido}`);

        const client = await Cliente.findOne({ nombre, apellido },{nro_cliente:1, telefonos:1, _id:0});
        if (!client) {
            res.status(404).json({ error: 'Client not found' });
            console.log(`Client with 'nombre' ${nombre} and 'apellido' ${apellido} not found`);
        } else {
            res.status(200).json(client);
            console.log(`Client with 'nombre' ${nombre} and 'apellido' ${apellido} found`);
        }
    } catch (error: any) {
        console.error('Error getting client:', error);
        res.status(500).json({ error: `Internal Server Error: ${error.message}` });
        next(error);
    }
}

export async function getPhones(req: Request, res: Response, next: NextFunction) {
    try {
        console.log('Getting all phones with client information');
        const phones = await Cliente.aggregate([
            { $unwind: '$telefonos' },
            { $project: { _id: 0, nro_cliente: 1, nombre:1, apellido:1, direccion:1, activo:1,  'telefonos.codigo_area': 1, 'telefonos.nro_telefono': 1, 'telefonos.tipo': 1 } }
        ]);
        res.status(200).json(phones);
        console.log('All phones found');
    } catch (error: any) {
        console.error('Error getting phones:', error);
        res.status(500).json({ error: `Internal Server Error: ${error.message}` });
        next(error);
    }
}

export async function getClientsWithBill(req:Request, res:Response, next:NextFunction){
    try {
        console.log('Getting all clients with bill');
        const clients = await Cliente.aggregate([
            {
                $lookup:{
                    from: 'facturas',
                    localField: 'nro_cliente',
                    foreignField: 'nro_cliente',
                    as: 'facturas'
                }
            },
            {
                $match: {
                    $expr: { $gt: [{ $size: "$facturas" }, 0] } 
                  }
            },
            {
                $project: { nro_cliente: 1, nombre:1, apellido:1, direccion:1, activo:1}
            }
        ]);
        res.status(200).json(clients);
        console.log('All clients with bill found');
    } catch(error:any){
        console.error('Error getting clients with bill:', error);
        res.status(500).json({ error: `Internal Server Error: ${error.message}` });
        next(error);
    }
}

export async function getClientsWithNoBill(req:Request, res:Response, next:NextFunction){
    try {
        console.log('Getting all clients with no bill');
        const clients = await Cliente.aggregate([
            {
                $lookup:{
                    from: 'facturas',
                    localField: 'nro_cliente',
                    foreignField: 'nro_cliente',
                    as: 'facturas'
                }
            },
            {
                $match: {
                    $expr: { $eq: [{ $size: "$facturas" }, 0] } 
                  }
            },
            {
                $project: { nro_cliente: 1, nombre:1, apellido:1, direccion:1, activo:1}
            }
        ]);
        res.status(200).json(clients);
        console.log('All clients with no bill found');
    } catch(error:any){
        console.error('Error getting clients with no bill:', error);
        res.status(500).json({ error: `Internal Server Error: ${error.message}` });
        next(error);
    }
}

export async function getClientsWithBillCount(req: Request, res:Response,next:NextFunction){
    try {
        console.log('Getting all clients with bill count');
        const clients = await Cliente.aggregate([
            {
                $lookup:{
                    from: 'facturas',
                    localField: 'nro_cliente',
                    foreignField: 'nro_cliente',
                    as: 'facturas'
                }
            },
            {
                $project: { _id:0, nro_cliente: 1, nombre:1, apellido:1, facturas: { $size: "$facturas" } }
            }
        ]);
        res.status(200).json(clients);
        console.log('All clients with bill count found');
    } catch(error:any){
        console.error('Error getting clients with bill count:', error);
        res.status(500).json({ error: `Internal Server Error: ${error.message}` });
        next(error);
    }
}

export async function getClientExpenses(req: Request, res:Response,next:NextFunction){
    try {
        const clients = await Cliente.find({}, { _id: 0, nombre: 1, apellido: 1, nro_cliente: 1 });
        const result = await Promise.all(clients.map(async (client) => {
            const gasto_total_iva = await RedisService.getClientExpenses(client.nro_cliente);
            return { nombre: client.nombre, apellido: client.apellido, gasto_total_iva };
        }));
        res.status(200).json(result);
    } catch(error : any) {
        console.error('Error getting clients expenses:', error);
        res.status(500).json({ error: `Internal Server Error: ${error.message}` });
        next(error);
    }
}