# TP-Base de Datos 2

## Requisitos

Antes de ejecutar el proyecto, asegúrate de tener instalados los siguientes elementos:

- **Node.js**: Asegúrate de tener una versión reciente de Node.js instalada en tu máquina.
- **npm**: Node Package Manager (que se instala junto con Node.js).
- **MongoDB**: MongoDB debe estar corriendo, ya sea localmente o a través de Docker.

### Dependencias del proyecto

Este proyecto depende de los siguientes paquetes de npm:

- **express**: Framework para Node.js.
- **mongoose**: Librería para interactuar con MongoDB.
- **mongodb**: Driver de MongoDB para Node.js.
- **docker** (si se usa MongoDB en contenedor).

## Pasos para ejecutar el proyecto

### 1. Configurar y ejecutar MongoDB

Si estás utilizando **Docker** para ejecutar MongoDB, primero debes iniciar el contenedor con la base de datos.

1. **Ejecuta MongoDB en Docker**:
    Levantar el contenedor
     ```
     docker run --name expensesTracking_db -p 27017:27017 -d mongo  
     ```

    Levantar un Shell bash dentro del contenedor
     ```bash
     docker exec -it expensesTracking_db mongosh
     ```

### 2. Clonar el proyecto y configurar las dependencias

1. **Clona el repositorio**:
   ```bash
   git clone https://github.com/nicrossi/tp-bases-2
   ```

### 3. Correr la aplicación
   ```
    npm run start
   ```
