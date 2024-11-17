import { Response, Request, NextFunction } from "express";
import Factura, { Invoice } from "../schemas/Factura";

export async function createFactura(req: Request, res: Response, next: NextFunction) {
    try {
        const invoice = new Factura(req.body as Invoice);
        const savedInvoice = await invoice.save();
        console.log(`Invoice with created with 'nro_factura' ${savedInvoice.nro_factura}`);
        res.status(201).json(savedInvoice);
    } catch (error: any) {
        console.error('Error creating invoice:', error);
        res.status(500).json({error: `Internal Server Error: ${error.message}`});
        next(error);
    }
}

export async function updateFactura(req: Request, res: Response, next: NextFunction) {
    try {
        const { nro_factura } = req.params;
        console.log(`Updating invoice with 'nro_factura' ${nro_factura}`);
        const invoiceData = req.body as Partial<Invoice>;
        const updatedInvoice = await Factura.findOneAndUpdate(
            { nro_factura },
            { $set: invoiceData },
            { new: true }
        );

        if (!updatedInvoice) {
            res.status(404).json({ error: 'Invoice not found' });
            console.log(`Invoice with 'nro_factura' ${nro_factura} not found`);
        } else {
            res.status(200).json(updatedInvoice);
            console.log(`Invoice with 'nro_factura' ${nro_factura} updated`);
        }
    } catch (error: any) {
        console.error('Error updating invoice:', error);
        res.status(500).json({ error: `Internal Server Error: ${error.message}` });
        next(error);
    }
}

export async function deleteFactura(req: Request, res: Response, next: NextFunction) {
    try {
        const { nro_factura } = req.params;
        console.log(`Deleting invoice with 'nro_factura' ${nro_factura}`);

        await Factura.findOneAndDelete({ nro_factura });
        console.log(`Invoice with 'nro_factura' ${nro_factura} deleted`);
        res.status(204).send();
    } catch (error: any) {
        console.error('Error deleting invoice:', error);
        res.status(500).json({ error: `Internal Server Error: ${error.message}` });
        next(error);
    }
}

export async function getFacturas(req: Request, res: Response, next: NextFunction) {
    try {
        const invoices = await Factura.find();
        console.log(`Getting all invoices`);
        res.status(200).json(invoices);
    } catch (error: any) {
        console.error('Error getting invoices:', error);
        res.status(500).json({ error: `Internal Server Error: ${error.message}` });
        next(error);
    }
}

export async function getFacturasByClient(req: Request, res: Response, next: NextFunction) {
    const { nombre, apellido } = req.params;
  
    try {
      const facturas = await Factura.aggregate([
        {
          $lookup: {
            from: "clientes",
            localField: "nro_cliente",
            foreignField: "nro_cliente",
            as: "cliente"
          }
        },
        { $unwind: "$cliente" },
        {
          $match: {
            "cliente.nombre": nombre,
            "cliente.apellido": apellido
          }
        },
        {
          $project: {
            _id: 0,
            nro_factura: 1,
            fecha: 1,
            total_sin_iva: 1,
            iva: 1,
            total_con_iva: 1,
            items: 1,
            "cliente.nombre": 1,
            "cliente.apellido": 1
          }
        }
      ]);
      if (facturas.length === 0) {
        return res.status(200).json({ message: "El cliente no tiene facturas registradas." });
      }
      res.status(200).json(facturas);
    } catch (error: any) {
        console.error('Error getting invoices:', error);
        res.status(500).json({ error: `Internal Server Error: ${error.message}` });
        next(error);
    }
  }
  