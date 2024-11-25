import mongoose, { Schema, Document } from 'mongoose';

export interface Client extends Document {
  nro_cliente: number;
  nombre: string;
  apellido: string;
  direccion: string;
  activo: number;
  telefonos: {
    codigo_area: string;
    nro_telefono: string;
    tipo: string;
  }[];
}

// Schema for the clients collection
const ClientSchema: Schema = new Schema({
  nro_cliente: { type: Number, unique: true },
  nombre: { type: String, required: true },
  apellido: { type: String, required: true },
  direccion: { type: String, required: true },
  activo: { type: Number, required: true },
  telefonos: [{
    codigo_area: { type: String, required: true },
    nro_telefono: { type: String, required: true },
    tipo: { type: String, required: true },
  }],
});

const AutoIncrement = require('mongoose-sequence')(mongoose);
ClientSchema.plugin(AutoIncrement, { inc_field: 'nro_cliente' });

const Cliente = mongoose.model<Client>('Cliente', ClientSchema);

export default Cliente;