#!/bin/bash
echo "Running post-start script"

cd /workspaces/tp-bases-2
nohup npm run start > app.log 2>&1 &
npm_pid=$!
# Check if the npm process is still running
if ! kill -0 $npm_pid 2>/dev/null; then
    echo "The application failed to start or has already exited."
    exit 1
fi


echo "Initializing..."
sleep 15

# Drop all MongoDB collections
echo "Dropping all MongoDB collections..."
mongosh 'expensesTracking_db' <<EOF
db.getCollectionNames().forEach(function(collection) {
    db[collection].drop();
});
EOF

echo "Flushing redis"
redis-cli -u redis://redis:6379 <<EOF
FLUSHDB
EOF

# Insert client "Jacob Cooper"
curl -X POST --location "http://localhost:3000/clientes/" \
    -H "Content-Type: application/json" \
    -H "Accept: application/json" \
    -d '{
          "nombre": "Jacob",
          "apellido": "Cooper",
          "direccion": "123 Main St",
          "activo": true,
          "telefonos": [
            {
            "codigo_area": "011",
            "nro_telefono": "12345678",
            "tipo": "cel"
            },
            {
              "codigo_area": "011",
              "nro_telefono": "42424659",
              "tipo": "tel"
            }
          ]
        }'

# Insert client "Kai Bullock"
curl -X POST --location "http://localhost:3000/clientes/" \
    -H "Content-Type: application/json" \
    -H "Accept: application/json" \
    -d '{
          "nombre": "Kai",
          "apellido": "Bullock",
          "direccion": "567 Lombard St",
          "activo": true,
          "telefonos": [
            {
            "codigo_area": "532",
            "nro_telefono": "85961854",
            "tipo": "cel"
            },
            {
              "codigo_area": "532",
              "nro_telefono": "42484101",
              "tipo": "tel"
            }
          ]
        }'

# Insert Ipsum porducts
curl -X POST --location "http://localhost:3000/productos/" \
    -H "Content-Type: application/json" \
    -H "Accept: application/json" \
    -d '{
          "nombre": "Salsa Filetto",
          "marca": "Ipsum",
          "descripcion": "Lista para usar",
          "precio": 300.49,
          "stock": 100
        }'

curl -X POST --location "http://localhost:3000/productos/" \
    -H "Content-Type: application/json" \
    -H "Accept: application/json" \
    -d '{
          "nombre": "Salsa de tomate",
          "marca": "Ipsum",
          "descripcion": "Original Italiana",
          "precio": 250.49,
          "stock": 200
        }'

curl -X POST --location "http://localhost:3000/productos/" \
    -H "Content-Type: application/json" \
    -H "Accept: application/json" \
    -d '{
          "nombre": "Salsa Pizza",
          "marca": "Ipsum",
          "descripcion": "Lista para usar",
          "precio": 300.49,
          "stock": 100
        }'

curl -X POST --location "http://localhost:3000/productos/" \
    -H "Content-Type: application/json" \
    -H "Accept: application/json" \
    -d '{
          "nombre": "Salsa Pesto",
          "marca": "Ipsum",
          "descripcion": "Lista para usar",
          "precio": 300.49,
          "stock": 100
        }'

# Insert other porducts
curl -X POST --location "http://localhost:3000/productos/" \
    -H "Content-Type: application/json" \
    -H "Accept: application/json" \
    -d '{
          "nombre": "Atun",
          "marca": "Bulnez",
          "descripcion": "Lomitos al natural",
          "precio": 1900.49,
          "stock": 250
        }'

curl -X POST --location "http://localhost:3000/productos/" \
    -H "Content-Type: application/json" \
    -H "Accept: application/json" \
    -d '{
          "nombre": "Ketchup",
          "marca": "Heinz",
          "descripcion": "Sin azucar",
          "precio": 3000.49,
          "stock": 200
        }'

# Insert factura for Jacob Cooper
curl -X POST --location "http://localhost:3000/facturas/" \
    -H "Content-Type: application/json" \
    -H "Accept: application/json" \
    -d '{
          "nro_cliente": 1,
          "fecha": "2024-11-18",
          "iva": 0.21,
          "items": [
            {
              "codigo_producto": 1,
              "cantidad": 3
            },
            {
              "codigo_producto": 2,
              "cantidad": 2
            }
          ]
        }'

curl -X POST --location "http://localhost:3000/facturas/" \
    -H "Content-Type: application/json" \
    -H "Accept: application/json" \
    -d '{
          "nro_cliente": 2,
          "fecha": "2024-11-18",
          "iva": 0.21,
          "items": [
            {
              "codigo_producto": 6,
              "cantidad": 5
            },
            {
              "codigo_producto": 2,
              "cantidad": 1
            }
          ]
        }'

curl -X POST --location "http://localhost:3000/facturas/" \
    -H "Content-Type: application/json" \
    -H "Accept: application/json" \
    -d '{
          "nro_cliente": 1,
          "fecha": "2024-11-18",
          "iva": 0.21,
          "items": [
            {
              "codigo_producto": 5,
              "cantidad": 20
            }
          ]
        }'


tail -f app.log