from flask import Flask, request, jsonify
from flask_cors import CORS  # Importa CORS
import os
import json
from werkzeug.utils import secure_filename
import pandas as pd
import requests
from functions.cript import generate_pin

app = Flask(__name__)

# Habilitar CORS para permitir cualquier origen
CORS(app)

# Configuración del directorio para guardar los archivos
UPLOAD_FOLDER = 'C:/Users/DREAMFYRE 5/Desktop/Proyectos/EOLO_WEBAPP/api/db/sesiones/'
ALLOWED_EXTENSIONS = {'xls', 'xlsx'}
JSON_FILE_PATH = 'C:/Users/DREAMFYRE 5/Desktop/Proyectos/EOLO_WEBAPP/api/db/sesiones.json'  # Ruta al archivo JSON
JSON_FILES_ROOT = 'C:/Users/DREAMFYRE 5/Desktop/Proyectos/EOLO_WEBAPP/api/db'  # Ruta al archivo JSON
# JSON_FILE_PATH = 'C:/Users/Alienware/Desktop/Proyectos software/EOLO_WEBAPP/api/db/sesiones.json'  # Ruta al archivo JSON

# Asegúrate de que el directorio existe
if not os.path.exists(UPLOAD_FOLDER):
    os.makedirs(UPLOAD_FOLDER)

app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER


# Endpoint GET para leer los datos de 'sesiones.json'
@app.route('/sesiones', methods=['GET'])
def get_sessions():
    print(JSON_FILE_PATH)
    if os.path.exists(JSON_FILE_PATH):
        with open(JSON_FILE_PATH, 'r', encoding='utf-8') as file:
            data = json.load(file)  # Leer el archivo JSON
        return jsonify(data), 200  # Devolver los datos como JSON
    else:
        return jsonify({"error": "El archivo sesiones.json no existe"}), 404

# Endpoint GET para leer los datos de 'dispositivos.json'
@app.route('/dispositivos', methods=['GET'])
def get_devices():
    print(JSON_FILES_ROOT+"/dispositivos.json")
    if os.path.exists(JSON_FILES_ROOT+"/dispositivos.json"):
        with open(JSON_FILES_ROOT+"/dispositivos.json", 'r', encoding='utf-8') as file:
            data = json.load(file)  # Leer el archivo JSON
        return jsonify(data), 200  # Devolver los datos como JSON
    else:
        return jsonify({"error": "El archivo sesiones.json no existe"}), 404

# Endpoint GET para obtener un dispositivo por patente
@app.route('/dispositivo', methods=['GET'])
def get_device():
    # Obtener la patente desde los parámetros de la URL
    patente = request.args.get('patente')

    # Verificar si se proporcionó la patente
    if not patente:
        return jsonify({"error": "Falta el parámetro 'patente'"}), 400

    # Verificar si el archivo JSON existe
    if os.path.exists(JSON_FILES_ROOT + "/dispositivos.json"):
        with open(JSON_FILES_ROOT + "/dispositivos.json", 'r', encoding='utf-8') as file:
            data = json.load(file)  # Leer el archivo JSON

        # Buscar el dispositivo que tenga la patente proporcionada
        device = next((device for device in data if device['patente'] == patente), None)

        # Si encontramos el dispositivo, devolverlo, de lo contrario, enviar un error
        if device:
            return jsonify(device), 200
        else:
            return jsonify({"error": "Dispositivo no encontrado"}), 404
    else:
        return jsonify({"error": "El archivo dispositivos.json no existe", "url": JSON_FILES_ROOT + "/dispositivos.json"}), 404
    
# Endpoint POST para agregar un dispositivo
@app.route('/add-device', methods=['POST'])
def add_device():
    try:
        # Obtener los datos del nuevo dispositivo desde la solicitud JSON
        new_device = request.get_json()
        print(new_device)

        # Verificar que los campos necesarios estén en el JSON
        if 'patente' not in new_device or 'modelo' not in new_device:
            return jsonify({"error": "Faltan campos 'patente' o 'modelo'"}), 400

        # Leer el archivo JSON de dispositivos
        if os.path.exists(JSON_FILES_ROOT + "/dispositivos.json"):
            with open(JSON_FILES_ROOT + "/dispositivos.json", 'r', encoding='utf-8') as file:
                dispositivos_data = json.load(file)
        else:
            dispositivos_data = []  # Si el archivo no existe, se crea una lista vacía

        # Verificar si ya existe un dispositivo con la misma patente
        for device in dispositivos_data:
            if device['patente'] == new_device['patente']:
                return jsonify({"error": "Dispositivo con esta patente ya está asociado a tu cuenta."}), 400

        # Agregar el nuevo dispositivo a la lista de dispositivos
        dispositivos_data.append(new_device)

        # Guardar los datos actualizados en el archivo JSON
        with open(JSON_FILES_ROOT + "/dispositivos.json", 'w', encoding='utf-8') as file:
            json.dump(dispositivos_data, file, ensure_ascii=False, indent=2)

        return jsonify({"message": "Dispositivo agregado exitosamente"}), 201

    except Exception as e:
        return jsonify({"error": f"Hubo un problema al agregar el dispositivo: {str(e)}"}), 500








# Función para verificar la extensión del archivo
def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

@app.route('/upload', methods=['POST'])
def upload_file():
    if 'file' not in request.files:
        return jsonify({"error": "No file part"}), 400
    file = request.files['file']
    
    if file.filename == '':
        return jsonify({"error": "No selected file"}), 400

    if file and allowed_file(file.filename):
        filename = secure_filename(file.filename)
        filepath = os.path.join(app.config['UPLOAD_FOLDER'], filename)
        file.save(filepath)
        
        # Leer el archivo Excel usando pandas
        try:
            # Cargar el archivo Excel
            df = pd.read_excel(filepath)

            # Asegurarse de que las columnas necesarias existen
            required_columns = ['dispositivo', 'sesion_id', 'dia', 'mes', 'año', 'timestamp', 'ubicacion', 'modelo', 'variable', 'valor']
            for column in required_columns:
                if column not in df.columns:
                    return jsonify({"error": f"Falta la columna {column} en el archivo."}), 400

            # Obtener la primera fila y la última fila
            first_row = df.iloc[0]
            last_row = df.iloc[-1]

            
            # Extraer los datos de la primera fila para el inicio
            time_inicial = str(first_row['timestamp'])
            dia_inicial = int(first_row['dia'])
            mes_inicial = int(first_row['mes'])
            año_inicial = int(first_row['año'])
            
            # Extraer los datos de la última fila para el final
            time_final = str(last_row['timestamp'])
            dia_final = int(last_row['dia'])
            mes_final = int(last_row['mes'])
            año_final = int(last_row['año'])


            # Crear el diccionario para las filas que solo contienen la primera y última fila
             # Crear el diccionario para las filas que solo contienen la primera y última fila
            session_data = {
                'dispositivo': str(first_row['dispositivo']),
                'sesion_id': int(first_row['sesion_id']),
                'ubicacion': str(first_row['ubicacion']),
                'modelo': str(first_row['modelo']),
                'hora_inicial': time_inicial,
                'dia_inicial': dia_inicial,
                'mes_inicial': mes_inicial,
                'año_inicial': año_inicial,
                'hora_final': time_final,
                'dia_final': dia_final,
                'mes_final': mes_final,
                'año_final': año_final
            }

            # Devolver el resultado solo con la primera y última fila
            print(session_data)
            return jsonify({"message": "Archivo procesado exitosamente", "data": [session_data]}), 200
        
        except Exception as e:
            return jsonify({"error": f"Ocurrió un error al procesar el archivo: {str(e)}"}), 500

    else:
        return jsonify({"error": "Archivo no permitido. Solo se permiten archivos .xls y .xlsx"}), 400


# Endpoint para obtener coordenadas de una ubicación
@app.route('/geocode', methods=['GET'])
def geocode_location():
    location = request.args.get('location')  # Obtener la ubicación desde los parámetros de la URL

    if not location:
        return jsonify({"error": "No location provided"}), 400

    try:

        
        # Agregar el encabezado User-Agent para evitar el bloqueo
        headers = {
            'User-Agent': 'EOLO/1.0 (dkressing@udd.cl)'  # Agrega un correo válido o información relevante
        }

        # Solicitar a la API de Nominatim
        response = requests.get(f'https://nominatim.openstreetmap.org/search', 
                                params={'q': location, 'format': 'json'},
                                headers=headers)

        # response = requests.get('https://nominatim.openstreetmap.org/search?format=json&q=Chile')
        print(response)
        data = response.json()
        if data:
            # Tomar la primera coincidencia
            location_data = data[0]
            lat = location_data['lat']
            lon = location_data['lon']
            return jsonify({"lat": lat, "lon": lon}), 200
        else:
            return jsonify({"error": "Location not found"}), 404

    except Exception as e:
        return jsonify({"error": str(e)}), 500

# Endpoint para agregar una nueva sesión
@app.route('/add-session', methods=['POST'])
def add_session():
    try:
        # Obtener los datos de la nueva sesión desde la solicitud
        new_session = request.get_json()

        # Verificar que los datos de la sesión sean válidos
        required_fields = ['sesion_id', 'dispositivo', 'dia', 'mes', 'año', 'hora_inicio', 'hora_fin', 'descripcion', 'modelo']
        if not all(field in new_session for field in required_fields):
            return jsonify({"error": "Faltan campos requeridos"}), 400

        # Leer el archivo JSON y agregar la nueva sesión
        if os.path.exists(JSON_FILE_PATH):
            with open(JSON_FILE_PATH, 'r', encoding='utf-8') as file:
                sessions_data = json.load(file)
        else:
            sessions_data = []

        # Agregar la nueva sesión a la lista de sesiones
        sessions_data.append(new_session)

        # Guardar los datos actualizados en el archivo JSON
        with open(JSON_FILE_PATH, 'w', encoding='utf-8') as file:
            json.dump(sessions_data, file, ensure_ascii=False, indent=2)

        return jsonify({"message": "Sesión agregada exitosamente"}), 201

    except Exception as e:
        return jsonify({"error": f"Hubo un problema al agregar la sesión: {str(e)}"}), 500


# Ruta para validar el PIN
@app.route('/validate-pin', methods=['GET'])
def validate_pin():
    # Obtener los parámetros 'text' y 'pin' de la URL
    text = request.args.get('text')
    pin = request.args.get('pin')

    # Verificar que ambos parámetros existen
    if not text or not pin:
        return jsonify({"error": "Faltan parámetros 'text' o 'pin'"}), 400

    # Generamos el PIN a partir del texto (patente)
    generated_pin = generate_pin(text)

    print(generated_pin)
    
    # Encriptamos el PIN generado
    
    # Validar si el PIN proporcionado coincide con el PIN generado
    if str(pin) == str(generated_pin):
        return jsonify({"message": "Valid PIN"}), 200
    else:
        print(str(pin) + "-" + str(generated_pin))
        return jsonify({"message": "PIN incorrecto"}), 400
    

# Ruta para generar el PIN
@app.route('/get-pin', methods=['GET'])
def get_pin():
    # Obtener los parámetros 'text' URL
    text = request.args.get('text')

    if not text:
        return jsonify({"error": "Faltan parámetros 'text' o 'pin'"}), 400

    # Generamos el PIN a partir del texto (patente)
    generated_pin = generate_pin(text)

    print(generated_pin)
    
    # Validar si el PIN proporcionado coincide con el PIN generado
    return jsonify({"input": text, "pin": generated_pin}), 200
    



if __name__ == '__main__':
    app.run(debug=True, port=5000)
