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
}

export default RedisService;