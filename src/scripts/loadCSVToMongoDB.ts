import csv from 'csvtojson';
import mongoose from 'mongoose';
import path from 'path';
import { connectToMongoDB } from '../mongoConnection';

const DATASETS_PATH = './datasets/extracted';

const files = {
  clientes: 'e01_cliente.csv',
  facturas: 'e01_factura.csv',
  detallesFactura: 'e01_detalle_factura.csv',
  productos: 'e01_producto.csv',
  telefonos: 'e01_telefono.csv',
};

async function loadCSVToMongoDB() {
  await connectToMongoDB();

  if (!mongoose.connection.db) {
    console.error('Database connection is undefined.');
    return;
  }

  const db = mongoose.connection.db;
  console.log('Connected to MongoDB');

  try {
    // Procesar clientes
    const clientesFilePath = path.join(DATASETS_PATH, files.clientes);
    const clientes = await csv({ delimiter: ';' }).fromFile(clientesFilePath);
    const clientesFormatted = clientes.map((c) => ({
      nro_cliente: c.nro_cliente,
      nombre: c.nombre,
      apellido: c.apellido,
      direccion: c.direccion,
      activo: c.activo === 'true',
    }));
    await db.collection('clientes').insertMany(clientesFormatted);
    console.log('Clientes insertados:', clientesFormatted.length);

    // Procesar productos
    const productosFilePath = path.join(DATASETS_PATH, files.productos);
    const productos = await csv({ delimiter: ';' }).fromFile(productosFilePath);
    const productosFormatted = productos.map((p) => ({
      codigo_producto: p.codigo_producto,
      marca: p.marca,
      nombre: p.nombre,
      descripcion: p.descripcion,
      precio: parseFloat(p.precio),
      stock: parseInt(p.stock, 10),
    }));
    await db.collection('productos').insertMany(productosFormatted);
    console.log('Productos insertados:', productosFormatted.length);

    // Procesar facturas
    const facturasFilePath = path.join(DATASETS_PATH, files.facturas);
    const facturas = await csv({ delimiter: ';' }).fromFile(facturasFilePath);
    const facturasFormatted = facturas.map((f) => ({
      nro_factura: f.nro_factura,
      fecha: new Date(f.fecha),
      total_sin_iva: parseFloat(f.total_sin_iva),
      total_con_iva: parseFloat(f.total_con_iva),
      nro_cliente: f.nro_cliente,
    }));
    await db.collection('facturas').insertMany(facturasFormatted);
    console.log('Facturas insertadas:', facturasFormatted.length);

    // Procesar detalles de facturas
    const detallesFilePath = path.join(DATASETS_PATH, files.detallesFactura);
    const detalles = await csv({ delimiter: ';' }).fromFile(detallesFilePath);
    const detallesFormatted = detalles.map((d) => ({
      nro_factura: d.nro_factura,
      codigo_producto: d.codigo_producto,
      nro_item: parseInt(d.nro_item, 10),
      cantidad: parseInt(d.cantidad, 10),
    }));
    await db.collection('detalles_factura').insertMany(detallesFormatted);
    console.log('Detalles de facturas insertados:', detallesFormatted.length);

    // Procesar teléfonos
    const telefonosFilePath = path.join(DATASETS_PATH, files.telefonos);
    const telefonos = await csv({ delimiter: ';' }).fromFile(telefonosFilePath);
    const telefonosFormatted = telefonos.map((t) => ({
      codigo_area: t.codigo_area,
      nro_telefono: t.nro_telefono,
      tipo: t.tipo,
      nro_cliente: t.nro_cliente,
    }));
    await db.collection('telefonos').insertMany(telefonosFormatted);
    console.log('Teléfonos insertados:', telefonosFormatted.length);
  } catch (error) {
    console.error('Error loading CSV data:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
}

loadCSVToMongoDB();
