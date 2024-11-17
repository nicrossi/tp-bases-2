import mongoose, { Schema, Document } from 'mongoose';

export interface Invoice extends Document {
    nro_factura: number;
    fecha: Date;
    total_sin_iva: string; // Lo cambié a string porque son números muy grandes y tiraba error
    iva: number;
    total_con_iva: string; // Lo cambié a string porque son números muy grandes y tiraba error
    nro_cliente: number
    items: [{
        nro_item: number;
        cantidad: number;
        codigo_producto: string;
    }];
}

const FacturaSchema = new Schema<Invoice>({
    nro_factura: { type: Number, required: true, unique: true },
    fecha: { type: Date, required: true },
    total_sin_iva: { type: String, required: true },
    iva: { type: Number, required: true },
    total_con_iva: { type: String, required: true },
    nro_cliente: { type: Number, required: true }, 
    items: [
        {
            nro_item: { type: Number, required: true },
            cantidad: { type: Number, required: true },
            codigo_producto: { type: String, required: true }
        }
    ]
});

const AutoIncrement = require('mongoose-sequence')(mongoose);
FacturaSchema.plugin(AutoIncrement, { inc_field: 'nro_factura' });

const Factura = mongoose.model<Invoice>('Factura', FacturaSchema);

export default Factura;
 