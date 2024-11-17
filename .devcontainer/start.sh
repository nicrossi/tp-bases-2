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

curl -X GET --location "http://localhost:3000/productos/1" \
    -H "Content-Type: application/json" \
    -H "Accept: application/json"


tail -f app.log