from flask import Flask, request, jsonify
from Crypto.Cipher import AES
from Crypto.Util.Padding import pad, unpad
import base64
import hashlib

app = Flask(__name__)

# Clave secreta (aseguramos que tenga 16, 24 o 32 bytes de longitud)
SECRET_KEY = "my-secret-key-123"  # Clave original de longitud 17

# Aseguramos que la longitud de la clave sea de 16 bytes (AES-128)
SECRET_KEY = SECRET_KEY[:16].ljust(16, '\0')  # Truncamos o rellenamos para que tenga 16 bytes

# Función para generar el PIN a partir de la patente
def generate_pin(patente):
    # Usar hash SHA-256 para obtener un valor único basado en la patente
    hashed_patente = hashlib.sha256(patente.encode('utf-8')).hexdigest()
    
    # Tomamos los primeros 5 caracteres del hash y convertimos a un número
    numeric_value = int(hashed_patente[:5], 16)  # Convertir los primeros 5 caracteres del hash a un valor numérico
    
    # Modificamos el número para asegurarnos de que sea un PIN de 5 dígitos
    pin = numeric_value % 100000  # Garantiza que el número estará en el rango de 5 dígitos
    
    return pin

# Función para desencriptar el texto
def decrypt_text(encrypted_text):
    # Separar IV y ciphertext
    iv, ct = encrypted_text.split(":")
    iv = base64.b64decode(iv)
    ct = base64.b64decode(ct)
    
    # Desencriptar el texto
    cipher = AES.new(SECRET_KEY.encode('utf-8'), AES.MODE_CBC, iv=iv)
    pt = unpad(cipher.decrypt(ct), AES.block_size).decode('utf-8')
    return pt
