from flask import Flask, request, jsonify
from flask_cors import CORS  # Importa CORS
import os
import json
from werkzeug.utils import secure_filename
import pandas as pd
import requests
from functions.cript import generate_pin
from dotenv import load_dotenv
import pymysql
from datetime import datetime
# Importar los blueprints de los módulos correspondientes
from functions.users import users_bp
from functions.dispositivos import dispositivos_bp
from functions.sesiones import sesiones_bp
from functions.datos import datos_bp
from flask import send_from_directory


app = Flask(__name__)

# Habilitar CORS para permitir cualquier origen
CORS(app)

load_dotenv()

# Configuración del directorio para guardar los archivos
UPLOAD_FOLDER = os.getenv("UPLOAD_FOLDER")
ALLOWED_EXTENSIONS = {'xls', 'xlsx'}
JSON_FILES_ROOT = os.getenv("JSON_FILES_ROOT")
JSON_FILES_API_SENSORES_ROOT = os.getenv("JSON_FILES_API_SENSORES_ROOT")
JSON_FILES_USER_ROOT = os.getenv("JSON_FILES_USER_ROOT")
JSON_FILES_SESIONES_JSON = os.getenv("JSON_FILES_SESIONES_JSON")


# --- GUARDAR EN MYSQL ---


# Asegúrate de que el directorio existe
if not os.path.exists(UPLOAD_FOLDER):
    os.makedirs(UPLOAD_FOLDER)

app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

app.register_blueprint(users_bp)

app.register_blueprint(dispositivos_bp)

app.register_blueprint(sesiones_bp)

app.register_blueprint(datos_bp)


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
        patente = request.args.get('patente')

        print("Patente recibida:", patente)
        filename = secure_filename(file.filename)
        filepath = os.path.join(app.config['UPLOAD_FOLDER'], filename)
        file.save(filepath)
        # Leer el archivo Excel usando pandas
        try:
            connection = pymysql.connect(
                host=os.getenv("MYSQL_HOST"),
                user=os.getenv("MYSQL_USER"),
                password=os.getenv("MYSQL_PASSWORD"),
                database=os.getenv("MYSQL_DATABASE"),
                charset='utf8mb4',
                cursorclass=pymysql.cursors.DictCursor
            )
            
            with connection.cursor() as cursor:
                # Verificar si ya existe un registro con ese filename y patente
                check_sql = "SELECT COUNT(*) AS count FROM sesiones WHERE filename = %s AND patente = %s"
                cursor.execute(check_sql, (file.filename, patente))
                result = cursor.fetchone()

                if result['count'] > 0:
                    return jsonify({"error": "Ya existe una sesión con este filename y patente asociada."}), 400
            
            connection.close()

            # Cargar el archivo Excel
            df = pd.read_excel(filepath)
            print("debug")

            # Asegurarse de que las columnas necesarias existen
            required_columns = ['timestamp', 'temperatura_valor', 'humedad_valor', 'presion_valor']
            for column in required_columns:
                if column not in df.columns:
                    return jsonify({"error": f"Falta la columna {column} en el archivo."}), 400

            # Obtener la primera fila y la última fila
            first_row = df.iloc[0]
            last_row = df.iloc[-1]


            # Extraer los datos de la primera fila para el inicio
            timestamp_inicial = datetime.utcfromtimestamp(first_row['timestamp']).strftime('%Y-%m-%dT%H:%M:%S')
            
            # Extraer los datos de la última fila para el final
            timestamp_final = datetime.utcfromtimestamp(last_row['timestamp']).strftime('%Y-%m-%dT%H:%M:%S')

            volumen = str(last_row['volumen_valor'])
            flujo = str((first_row["flujo_valor"] + last_row["flujo_valor"]) / 2)
            bateria = str(last_row['bateria_valor'])
            print("bateria", bateria)

            # Crear el diccionario para las filas que solo contienen la primera y última fila
            session_data = {
                'patente': patente,
                'timestamp_inicial': timestamp_inicial,
                'timestamp_final': timestamp_final,
                'volumen': volumen,
                "flujo": flujo,
                "bateria": bateria,
            }

            
            # Convertir el DataFrame a JSON
            file_json = df.to_dict(orient='records')  # Convertir todo el DataFrame a formato de lista de diccionarios
            print(file_json)

            
            # Necesario para luego guardar los datos en tabla datos. 
            # Guardar el JSON procesado en un archivo
            with open(JSON_FILES_SESIONES_JSON + "/"+ file.filename + ".json", 'w', encoding='utf-8') as json_file:
                json.dump(file_json, json_file, ensure_ascii=False, indent=2)
            
            # Devolver el resultado solo con la primera y última fila
            return jsonify({"message": "Archivo procesado exitosamente", "data": [session_data], "mediciones": file_json}), 200
        
        except Exception as e:
            return jsonify({"error": f"Ocurrió un error al procesar el archivo: {str(e)}"}), 500

    else:
        return jsonify({"error": "Archivo no permitido. Solo se permiten archivos .xls y .xlsx"}), 400

@app.route('/descargarCsv', methods=['GET'])
def download_file():
    filename = request.args.get('filename')
    if not filename:
        return jsonify({"error": "No filename provided"}), 400

    folder_path = os.path.join(os.getcwd(), 'db', 'sesiones')
    file_path = os.path.join(folder_path, filename + ".xlsx")
    print(file_path)
    if os.path.isfile(file_path) and filename.lower().endswith('.xlsx'):
        return send_from_directory(folder_path, filename + ".xlsx", as_attachment=True)
    else:
        return jsonify({"message": "no hay archivos"}), 404


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

# Endpoint para obtener coordenadas de una ubicación
@app.route('/geocode-reverse', methods=['GET'])
def geocode_reverse_location():
    lat = request.args.get('lat')  # Obtener la ubicación desde los parámetros de la URL
    lon = request.args.get('lon')  # Obtener la ubicación desde los parámetros de la URL

    if not lat or not lon:
        return jsonify({"error": "No location provided"}), 400

    try:

        
        # Agregar el encabezado User-Agent para evitar el bloqueo
        headers = {
            'User-Agent': 'EOLO/1.0 (dkressing@udd.cl)'  # Agrega un correo válido o información relevante
        }

        # Solicitar a la API de Nominatim
        response = requests.get(f'https://nominatim.openstreetmap.org/reverse', 
                                params={'lat': lat,"lon": lon, 'format': 'json'},
                                headers=headers)

        data = response.json()
        # data_string = json.dumps(data, ensure_ascii=False)
        print(str(data["display_name"]))
        if data:
            # Tomar la primera coincidencia
            location_data = data
            display_name = str(location_data['display_name'])

            # Decodificar cualquier secuencia Unicode en el texto
            return jsonify(data), 200
        else:
            return jsonify({"error": "Location not found"}), 404

    except Exception as e:
        return jsonify({"error": str(e)}), 500


# Ruta para validar el PIN
@app.route('/validate-pin', methods=['GET'])
def validate_pin():
    # Obtener los parámetros 'text' y 'pin' de la URL
    text = request.args.get('text')
    if text and "-" in text:
        text = text.replace("-", "")
        
    pin = request.args.get('pin')

    # Verificar que ambos parámetros existen
    if not text or not pin:
        return jsonify({"error": "Faltan parámetros 'text' o 'pin'"}), 400

    # # Verificar si el archivo JSON existe
    # if os.path.exists(JSON_FILES_API_SENSORES_ROOT + "/dispositivos.json"):
    #     with open(JSON_FILES_API_SENSORES_ROOT + "/dispositivos.json", 'r', encoding='utf-8') as file:
    #         data = json.load(file)  # Leer el archivo JSON

    #     # Buscar el dispositivo que tenga la patente proporcionada
    #     device = next((device for device in data["data"]["tableData"] if device['codigo_interno'] == text), None)

    #     # Si encontramos el dispositivo, devolverlo, de lo contrario, enviar un error
    #     if device:
    #         return jsonify(device), 200
    #     else:
    #         return jsonify({"error": "Dispositivo no encontrado"}), 404

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
    textClean =""
    if text and "-" in text:
        textClean = text.replace("-", "")

    generated_pin = generate_pin(textClean)
    print(generated_pin)
    
    # Validar si el PIN proporcionado coincide con el PIN generado
    return jsonify({"input": textClean, "pin": generated_pin}), 200
    

if __name__ == '__main__':
    app.run(debug=True, port=5000)
