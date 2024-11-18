import redis from "../redisConnection";

const RedisService = {
    // Set stock level for a product
    async setProductStock(codigo_producto: string, stock: number): Promise<void> {
        if (stock) {
            const key = `stock:${codigo_producto}`;
            await redis.set(key, stock);
            console.log(`Stock level for 'codigo_producto' ${codigo_producto} set to ${stock}`);
        }
    },

    // Get current stock level for a product
    async getProductStock(codigo_producto: string): Promise<number | undefined> {
        const key = `stock:${codigo_producto}`;
        const stock = await redis.get(key);
        if (stock) {
            return parseInt(stock, 10);
        }
        const errorMessage = `No stock was registered for product 'codigo_producto' ${codigo_producto}`;
        console.log(errorMessage);
        throw new Error(errorMessage);
    },

    // Update increase/decrease stock level for a product
    async updateProductStock(codigo_producto: string, change: number): Promise<number | undefined> {
        if (change) {
            const key = `stock:${codigo_producto}`;
            const stock = await redis.incrby(key, change);
            console.log(`Stock level for 'codigo_producto' ${codigo_producto} updated by ${change}`);
            return stock;
        }
    },

    // Delete stock product
    async deleteProductStock(codigo_producto: string): Promise<void> {
        const key = `stock:${codigo_producto}`;
        const wasDeleted : boolean = Boolean(await redis.del(key));
        wasDeleted
            ? console.log(`Stock level for 'codigo_producto' was deleted`)
            : console.log(`Stock level for 'codigo_producto' was not found`);
    },

    async isProductInStock(codigo_producto: string, quantity: number) {
        try {
            const stock = await this.getProductStock(codigo_producto);
            return stock ? stock >= quantity : false;
        } catch (error) {
            console.log(error)
            return false;
        }
    },

    async validateProductsInStock(items: Array<{ nro_item: number, cantidad: number, codigo_producto: string }>) {
        await Promise.all(items.map(async (item : any) => {
            if (!await this.isProductInStock(item.codigo_producto, item.cantidad)) {
                throw new Error(`Product 'codigo_producto' ${item.codigo_producto} is not in stock for #${item.cantidad} items`);
            }
        }));
    },

    // Update total expenses for a client
    async updateClientExpenses(nro_cliente: number, change: number): Promise<void> {
        if (change) {
            const key = `total_expended:${nro_cliente}`;
            await redis.incrbyfloat(key, change);
            console.log(`Total expended for 'nro_cliente' ${nro_cliente} updated by $${change}`);
        }
    },

    // Get total expenses for a client
    async getClientExpenses(nro_cliente: number): Promise<number> {
        const key = `total_expended:${nro_cliente}`;
        const totalExpended = await redis.get(key);
        if (totalExpended) {
            const total = parseFloat(totalExpended);
            return parseFloat(total.toFixed(2));
        }
        const errorMessage = `No expenses were registered for client 'nro_cliente' ${nro_cliente}`;
        console.log(errorMessage);
        throw new Error(errorMessage);
    },
}

export default RedisService;