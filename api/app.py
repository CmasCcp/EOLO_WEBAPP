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
connection = pymysql.connect(
    host=os.getenv("MYSQL_HOST"),
    user=os.getenv("MYSQL_USER"),
    password=os.getenv("MYSQL_PASSWORD"),
    database=os.getenv("MYSQL_DATABASE"),
    charset='utf8mb4',
    cursorclass=pymysql.cursors.DictCursor
)

# Asegúrate de que el directorio existe
if not os.path.exists(UPLOAD_FOLDER):
    os.makedirs(UPLOAD_FOLDER)

app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER


# Endpoint GET para leer los datos de 'sesiones.json'
@app.route('/sesiones', methods=['GET'])
def get_sessions():
    print(JSON_FILES_API_SENSORES_ROOT+"/sesiones.json")
    if os.path.exists(JSON_FILES_API_SENSORES_ROOT+"/sesiones.json"):
        with open(JSON_FILES_API_SENSORES_ROOT+"/sesiones.json", 'r', encoding='utf-8') as file:
            data = json.load(file)  # Leer el archivo JSON
        return jsonify(data), 200  # Devolver los datos como JSON
    else:
        return jsonify({"error": "El archivo sesiones.json no existe"}), 404

# Endpoint GET para leer los datos de 'sesiones.json'
@app.route('/mis-sesiones', methods=['GET'])
def get_my_sessions():
    patente = request.args.get('patente')
    if not patente:
        return jsonify({"error": "Falta el parámetro 'patente'"}), 400
    try:
        with connection.cursor() as cursor:
            sql = "SELECT * FROM sesiones WHERE patente = %s"
            cursor.execute(sql, (patente,))
            sesiones = cursor.fetchall()
        return jsonify(sesiones), 200
    except Exception as e:
        return jsonify({"error": f"Error al obtener sesiones: {str(e)}"}), 500

# Endpoint GET para leer los datos de 'dispositivos.json'
@app.route('/dispositivos', methods=['GET'])
def get_devices():
    print(JSON_FILES_API_SENSORES_ROOT+"/dispositivos.json")
    if os.path.exists(JSON_FILES_API_SENSORES_ROOT+"/dispositivos.json"):
        with open(JSON_FILES_API_SENSORES_ROOT+"/dispositivos.json", 'r', encoding='utf-8') as file:
            data = json.load(file)  # Leer el archivo JSON
        return jsonify(data), 200  # Devolver los datos como JSON
    else:
        return jsonify({"error": "El archivo sesiones.json no existe"}), 404

# Endpoint GET para leer los datos de 'dispositivos.json'
@app.route('/mis-dispositivos', methods=['GET'])
def get_my_devices():
    # print(JSON_FILES_USER_ROOT+"/dispositivos_usuario.json")
    try:
        with connection.cursor() as cursor:
            sql = "SELECT * FROM dispositivo_en_usuario WHERE usuario = %s"
            cursor.execute(sql, (1,))
            dispositivos = cursor.fetchall()
        return jsonify(dispositivos), 200
    except Exception as e:
        return jsonify({"error": f"Error al obtener dispositivos: {str(e)}"}), 500


# Endpoint GET para obtener un dispositivo por patente
@app.route('/dispositivo', methods=['GET'])
def get_device():
    # Obtener la patente desde los parámetros de la URL
    patente = request.args.get('patente')

    # Verificar si se proporcionó la patente
    if not patente:
        return jsonify({"error": "Falta el parámetro 'patente'"}), 400

    # Verificar si el archivo JSON existe
    if os.path.exists(JSON_FILES_API_SENSORES_ROOT + "/dispositivos.json"):
        with open(JSON_FILES_API_SENSORES_ROOT + "/dispositivos.json", 'r', encoding='utf-8') as file:
            data = json.load(file)  # Leer el archivo JSON

        # Buscar el dispositivo que tenga la patente proporcionada
        device = next((device for device in data if device['patente'] == patente), None)

        # Si encontramos el dispositivo, devolverlo, de lo contrario, enviar un error
        if device:
            return jsonify(device), 200
        else:
            return jsonify({"error": "Dispositivo no encontrado"}), 404
    else:
        return jsonify({"error": "El archivo dispositivos.json no existe", "url": JSON_FILES_API_SENSORES_ROOT + "/dispositivos.json"}), 404
    
# Endpoint GET para obtener un dispositivo por patente
@app.route('/mi-dispositivo', methods=['GET'])
def get_my_device():
    # Obtener la patente desde los parámetros de la URL
    patente = request.args.get('patente')

    # Verificar si se proporcionó la patente
    if not patente:
        return jsonify({"error": "Falta el parámetro 'patente'"}), 400

    # Verificar si el archivo JSON existe
    if os.path.exists(JSON_FILES_API_SENSORES_ROOT + "/dispositivos.json"):
        with open(JSON_FILES_API_SENSORES_ROOT + "/dispositivos.json", 'r', encoding='utf-8') as file:
            data = json.load(file)  # Leer el archivo JSON

        # Buscar el dispositivo que tenga la patente proporcionada
        device = next((device for device in data if device['patente'] == patente), None)

        # Si encontramos el dispositivo, devolverlo, de lo contrario, enviar un error
        if device:
            return jsonify(device), 200
        else:
            return jsonify({"error": "Dispositivo no encontrado"}), 404
    else:
        return jsonify({"error": "El archivo dispositivos.json no existe", "url": JSON_FILES_API_SENSORES_ROOT + "/dispositivos.json"}), 404
    
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
        # --- INICIO MYSQL ---
        try:
            with connection.cursor() as cursor:
                sql = "INSERT INTO dispositivo_en_usuario (patente_dispositivo, usuario, modelo) VALUES (%s, %s, %s)"
                cursor.execute(sql, (new_device['patente'], 1, new_device['modelo']))  
            connection.commit()
        except Exception as db_err:
            print("Error al guardar en MySQL:", db_err)
        # --- FIN MYSQL ---

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
            print("debug")

            # Asegurarse de que las columnas necesarias existen
            #TODO: en produccion será la base de datos quien asignará el sesion_id
            required_columns = ['patente', 'sesion_id', 'dia', 'mes', 'año', 'timestamp']
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
                'patente': str(first_row['patente']),
                'sesion_id': int(first_row['sesion_id']),
                'hora_inicial': time_inicial,
                'dia_inicial': dia_inicial,
                'mes_inicial': mes_inicial,
                'año_inicial': año_inicial,
                'hora_final': time_final,
                'dia_final': dia_final,
                'mes_final': mes_final,
                'año_final': año_final,
            }

            
            # Convertir el DataFrame a JSON
            file_json = df.to_dict(orient='records')  # Convertir todo el DataFrame a formato de lista de diccionarios
            print(file_json)

            
            # Guardar el JSON procesado en un archivo
            with open(JSON_FILES_SESIONES_JSON + "/sesion_" + str(session_data["sesion_id"]) +".json", 'w', encoding='utf-8') as json_file:
                json.dump(file_json, json_file, ensure_ascii=False, indent=2)
            
            # Devolver el resultado solo con la primera y última fila
            return jsonify({"message": "Archivo procesado exitosamente", "data": [session_data], "mediciones": file_json}), 200
        
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




# Endpoint para agregar una nueva sesión
@app.route('/add-session', methods=['POST'])
def add_session():
    try:
        # Obtener los datos de la nueva sesión desde la solicitud
        new_session = request.get_json()

         # Agregar el encabezado User-Agent para evitar el bloqueo
        headers = {
            'User-Agent': 'EOLO/1.0 (dkressing@udd.cl)'  # Agrega un correo válido o información relevante
        }

        # Solicitar a la API de Nominatim
        response = requests.get(f'https://nominatim.openstreetmap.org/reverse', 
                                params={'lat': new_session["lat"],"lon": new_session["lon"], 'format': 'json'},
                                headers=headers)

        data_location = response.json()
        print(data_location)
        location_display_name = data_location["display_name"]
        address = data_location["address"]
        new_session["ubicacion"] = location_display_name
        new_session["ubicacion_corto"] = address.get("city", "") or address.get("road", "") or address.get("suburb", "") or address.get("county", "")

        required_fields = ['ubicacion', "ubicacion_corto","lat", "lon", 'filename', 'patente', 'dia_inicial', 'mes_inicial', 'año_inicial',"hora_inicio", 'dia_final', 'mes_final', 'hora_fin']
        if not all(field in new_session for field in required_fields):
            return jsonify({"error": "Faltan campos requeridos"}), 400

        # Leer el archivo JSON y agregar la nueva sesión
        # if os.path.exists(JSON_FILES_API_SENSORES_ROOT+"/sesiones.json"):
        #     with open(JSON_FILES_API_SENSORES_ROOT+"/sesiones.json", 'r', encoding='utf-8') as file:
        #         sessions_data = json.load(file)

        
        # --- GUARDAR EN MYSQL ---
        try:
            timestamp_inicial = f"{new_session['año_inicial']}-{new_session['mes_inicial']}-{new_session['dia_inicial']}T{new_session['hora_inicio']}"
            timestamp_final = f"{new_session['año_final']}-{new_session['mes_final']}-{new_session['dia_final']}T{new_session['hora_fin']}"
            with connection.cursor() as cursor:
                sql = """
                    INSERT INTO sesiones (
                        filename, patente, ubicacion_corto, lat, lon,
                        timestamp_inicial,timestamp_final
                    ) VALUES (%s, %s, %s, %s, %s, %s, %s)
                """
                cursor.execute(sql, (
                    new_session['filename'],
                    new_session['patente'],
                    new_session['ubicacion_corto'],
                    new_session['lat'],
                    new_session['lon'],
                    str(timestamp_inicial),
                    str(timestamp_final)
                ))
            connection.commit()
            # connection.close()
        except Exception as db_err:
            print("Error al guardar sesión en MySQL:", db_err)
            # Puedes retornar un error si lo deseas
        # --- FIN MYSQL ---

        
        

        # # Agregar la nueva sesión a la lista de sesiones
        # sessions_data.append(new_session)

        # # Guardar los datos actualizados en el archivo JSON
        # with open(JSON_FILES_API_SENSORES_ROOT+"/sesiones.json", 'w', encoding='utf-8') as file:
        #     json.dump(sessions_data, file, ensure_ascii=False, indent=2)

        # # Leer el archivo JSON y agregar la nueva sesión a la cuenta del usuario
        # if os.path.exists(JSON_FILES_USER_ROOT+"/sesiones_usuario.json"):
        #     with open(JSON_FILES_USER_ROOT+"/sesiones_usuario.json", 'r', encoding='utf-8') as file:
        #         sessions_data = json.load(file)
        # else:
        #     sessions_data = []

        # # Agregar la nueva sesión a la lista de sesiones
        # sessions_data.append(new_session)

        # # Guardar los datos actualizados en el archivo JSON
        # with open(JSON_FILES_USER_ROOT+"/sesiones_usuario.json", 'w', encoding='utf-8') as file:
        #     json.dump(sessions_data, file, ensure_ascii=False, indent=2)



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
