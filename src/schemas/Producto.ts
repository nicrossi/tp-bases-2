import mongoose, { Schema, Document } from 'mongoose';

export interface Product extends Document {
  codigo_producto: number;
  nombre: string;
  marca: string;
  descripcion: string;
  precio: number;
}

const ProductSchema: Schema = new Schema({
  codigo_producto: { type: Number, unique: true },
  nombre: { type: String, required: true },
  marca: { type: String, required: true },
  descripcion: { type: String, required: true },
  precio: { type: Number, required: true },
});

const AutoIncrement = require('mongoose-sequence')(mongoose);
ProductSchema.plugin(AutoIncrement, { inc_field: 'codigo_producto' });

const Producto = mongoose.model<Product>('Producto', ProductSchema);

export default Producto;