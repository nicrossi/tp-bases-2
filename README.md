# TP-Base de Datos 2

### Dependencias del proyecto
Este proyecto depende de los siguientes paquetes de npm:

- **express**: Framework para Node.js.
- **mongoose**: Librería para interactuar con MongoDB.
- **mongodb**: Driver de MongoDB para Node.js.
- **docker** (si se usa MongoDB en contenedor).
- **redis**: Cliente de Redis para Node.js.

## Ejecutar el proyecto localmente

### 1. Ejecutar y conectar ol contenedor de MongoDB
Asegurate de ejecutar `MongoDB` localmente, por ejemplo con `Docker`, para tener acceso a la base de datos.
Que se llamará `expensesTracking_db`.

```bash
  > docker run --name expensesTracking_db -p 27017:27017 -d mongo
  > docker exec -it expensesTracking_db mongosh
```

### 2. Redis
Asegurate de tener instalado `Redis` en tu máquina localmente. 
La aplicación se conecta a un servidor de `Redis` localmente al puerto `6379`.

Ejemplo de como verificar la conexión a redis utilizando `redis-cli`:

```bash
  > redis-cli -u redis://localhost:6379
```

### 3. Correr la aplicación
Instala las dependencias del proyecto y corre la aplicación:
   ```bash
   > npm install
   > npm run start
   ```

### 4. Probar la aplicación
El servidor responderá en `http://localhost:3000`. Puedes probar la aplicación con `Postman` o `curl`.
También dentro de los archivos `requests.http` y `requerimientos_del_tp.http` se encuentran ejemplos de 
requests para probar la aplicación utilizando alguno de los clientes http integrados en el IDE de Visual Studio Code.

## Sobre Github Codespaces
El proyecto también cuenta con una configuración de prueba para ejecutarlo dentro de `Github Codespaces` con todas sus
dependencias ya configuradas. **(Ver [.devcontainer](.devcontainer))**

Los archivos de configuración son simplemente una configuración de `Docker` y `docker-compose` para ejecutar el entorno,
y un archivo bash [start.sh](.devcontainer/start.sh) que es usado como entrypoint para el estado inicial de la aplicación.

Dado que este contenedor está pensado para pruebas, al iniciar se reinicia el estado de la capa de persistencia.
Esto es, se borran todas las bases de datos de `MongoDB` y se limpia la base de datos de `Redis`. Para luego recrear las
bases a un estado conocido.

### Al Ejecutar el contenedor dentro Codespaces
- Se instalan las dependencias del proyecto.
- Se ejecuta el script de inicialización de la base de datos.
- Se inicia la aplicación y se monitorean los logs de aplicación en un archivo `app.log`.

### Estado inicial de la capa de persistencia
- Se crean 3 clientes: "Jacob Cooper", "Kai Bullock" y "Buzz Lightyear" con sus respectivos datos.
- Se crean 4 productos de la marca Ipsum.
- Se crean 2 productos de otras marcas.
- Se crean 3 facturas:
  - Jacob Cooper con 2 productos Ipsum.
  - Kai Bullock con 2 productos: Ipsum + otro.
  - Jakob Cooper con 1 producto: otro.

### Requerimientos del trabajo práctico obligatorio
Los requerimientos del trabajo práctico se encuentran en el archivo [requerimientos_del_sistema.http](requerimientos_del_sistema.http)
y pueden ser probados a partir del estado inicial de la capa de persistencia.