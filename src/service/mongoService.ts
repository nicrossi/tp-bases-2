import Producto, {Product} from "../schemas/Producto";

const mongoService = {
    async getProduct(codigo_producto: string) {
        const product : Product | null = await Producto.findOne({ codigo_producto });
        if (!product) {
            throw new Error(`Product with 'codigo_producto' ${codigo_producto} not found`);
        }
        return product;
    }
}

export default mongoService;