import * as dfd from "danfojs-node";
import Cliente, { Client } from "../schemas/Cliente";
import Producto, { Product } from "../schemas/Producto";
import RedisService from "./redisService";
import { Invoice } from "../schemas/Factura";
import { loadInvoice } from "../api/Factura.handlers";

type Tel = {
    codigo_area: string;
    nro_telefono: string;
    tipo: string;
    nro_cliente: number;
};

type InvoiceItem = {
    nro_item: number;
    cantidad: number;
    codigo_producto: string;
    nr_factura: number;
}

type ProductWithStock = Product & { stock: number };

async function loadClients() {
    const clientesDf = await dfd.readCSV("data/e01_cliente.csv");
    const telefonosDf = await dfd.readCSV("data/e01_telefono.csv");

    const clientesJson = dfd.toJSON(clientesDf) as Client[];
    const telefonosJson = dfd.toJSON(telefonosDf) as Tel[];

    for (let i = 0; i < clientesJson.length; i++) {
        const cliente = clientesJson[i];
        const telefonos = telefonosJson.filter(
            (telefono: any) => telefono.nro_cliente === cliente.nro_cliente
        ).map((telefono: any) => ({
            codigo_area: telefono.codigo_area as string,
            nro_telefono: telefono.nro_telefono as string,
            tipo: telefono.tipo as string
        }));
        cliente.telefonos = telefonos;

        const client = new Cliente(cliente);
        await client.save();
    }
    console.log('Clients loaded successfully');
}

async function loadProducts() {
    const productosDf = await dfd.readCSV("data/e01_producto.csv");
    const productosJson = dfd.toJSON(productosDf) as ProductWithStock[];
    for (let i = 0; i < productosJson.length; i++) {
        const product = new Producto(productosJson[i]);
        try {
            const savedProduct = await product.save();
            console.log(`Product created with 'codigo_producto' ${savedProduct.codigo_producto}`);
            await RedisService.setProductStock(product.codigo_producto.toString(), productosJson[i].stock || 0);
        } catch (error: any) {
            console.error('Error creating product:', error);
        }
    }
}

async function loadInvoices() {
    const facturasDf = await dfd.readCSV("data/e01_factura.csv");
    const itemsDf = await dfd.readCSV("data/e01_detalle_factura.csv");

    const facturasJson = dfd.toJSON(facturasDf) as Invoice[];
    const itemsJson = dfd.toJSON(itemsDf) as InvoiceItem[];

    for (let i = 0; i < facturasJson.length; i++) {
        const factura = facturasJson[i];
        const items = itemsJson.filter(
            (item: any) => item.nro_factura === factura.nro_factura
        ).map((item: any) => ({
            nro_item: item.nro_item,
            cantidad: item.cantidad,
            codigo_producto: item.codigo_producto
        }));
        factura.items = items;
        try {
            await loadInvoice(factura);
        } catch (error: any) {
            console.error('Error creating invoice:', error);
        }
    }
}

const CsvService = {
    async loadData() {
        try {
            await loadClients();
            await loadProducts();
            await loadInvoices();

            console.log('Data loaded successfully');
            return { status: 200, message: 'Data loaded successfully' };
        } catch (error: any) {
            console.error('Error loading data:', error);
            return { status: 500, message: `Internal Server Error: ${error.message}` };
        }
    }
}

export default CsvService;