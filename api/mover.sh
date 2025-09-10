#!/bin/bash

DEST="/var/www/api-sensores"
DEST="C:/Users/Alienware/Desktop/Proyectos software/EOLO_API"

# Crear el directorio de destino si no existe
mkdir -p "$DEST"

# Copiar app.py, reemplazando si existe
cp -f app.py "$DEST/"

# Copiar requirements.txt, reemplazando si existe
cp -f requirements.txt "$DEST/"

# Copiar la carpeta functions, reemplazando si existe
cp -rf functions "$DEST/"

# Copiar la carpeta db, reemplazando si existe
cp -rf db "$DEST/"