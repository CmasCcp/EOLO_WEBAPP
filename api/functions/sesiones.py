from datetime import datetime
from flask import Blueprint, request, jsonify
import pymysql
import os
import json
import requests



# Configuración del directorio para guardar los archivos
UPLOAD_FOLDER = os.getenv("UPLOAD_FOLDER")
ALLOWED_EXTENSIONS = {'xls', 'xlsx'}
JSON_FILES_ROOT = os.getenv("JSON_FILES_ROOT")
JSON_FILES_API_SENSORES_ROOT = os.getenv("JSON_FILES_API_SENSORES_ROOT")
JSON_FILES_USER_ROOT = os.getenv("JSON_FILES_USER_ROOT")
JSON_FILES_SESIONES_JSON = os.getenv("JSON_FILES_SESIONES_JSON")



sesiones_bp = Blueprint('sesiones', __name__)


# Endpoint GET para leer los datos de 'sesiones.json'
@sesiones_bp.route('/sesiones', methods=['GET'])
def get_sessions():
    print(JSON_FILES_API_SENSORES_ROOT+"/sesiones.json")
    if os.path.exists(JSON_FILES_API_SENSORES_ROOT+"/sesiones.json"):
        with open(JSON_FILES_API_SENSORES_ROOT+"/sesiones.json", 'r', encoding='utf-8') as file:
            data = json.load(file)  # Leer el archivo JSON
        return jsonify(data), 200  # Devolver los datos como JSON
    else:
        return jsonify({"error": "El archivo sesiones.json no existe"}), 404

# Endpoint GET para leer los datos de 'sesiones.json'
@sesiones_bp.route('/mis-sesiones', methods=['GET'])
def get_my_sessions():
    patente = request.args.get('patente')
    if not patente:
        return jsonify({"error": "Falta el parámetro 'patente'"}), 400
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
            sql = "SELECT * FROM sesiones WHERE patente = %s"
            cursor.execute(sql, (patente))
            sesiones = cursor.fetchall()

        connection.close()
        return jsonify(sesiones), 200
    except Exception as e:
        return jsonify({"error": f"Error al obtener sesiones: {str(e)}"}), 500




# Endpoint para agregar una nueva sesión
@sesiones_bp.route('/add-session', methods=['POST'])
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
        # print(data_location)
        location_display_name = data_location["display_name"]
        address = data_location["address"]
        new_session["ubicacion"] = location_display_name
        new_session["ubicacion_corto"] = address.get("city", "") or address.get("road", "") or address.get("suburb", "") or address.get("county", "")

        
        required_fields = ['ubicacion', "ubicacion_corto","lat", "lon", 'filename', 'patente', 'fecha_inicial','fecha_final']
        
        
        if not all(field in new_session for field in required_fields):
            return jsonify({"error": "Faltan campos requeridos"}), 400
     
        try:
            # --- GUARDAR sesion EN MYSQL ---
            connection = pymysql.connect(
                host=os.getenv("MYSQL_HOST"),
                user=os.getenv("MYSQL_USER"),
                password=os.getenv("MYSQL_PASSWORD"),
                database=os.getenv("MYSQL_DATABASE"),
                charset='utf8mb4',
                cursorclass=pymysql.cursors.DictCursor
            )
            
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
                    new_session['fecha_inicial'],
                    new_session['fecha_final'],
                ))
            
                cursor.execute("SELECT LAST_INSERT_ID() as id")
                id_sesion = cursor.fetchone()['id']

            connection.commit()
            connection.close()

            # --- NUEVO: Insertar datos del archivo JSON en la tabla datos ---
            json_path = JSON_FILES_SESIONES_JSON + f"/{new_session['filename']}.json"
            print("json_path", json_path)
            if os.path.exists(json_path):
                with open(json_path, 'r', encoding='utf-8') as f:
                    mediciones = json.load(f)
                    print("mediciones cargadas")

                    conn = pymysql.connect(
                        host=os.getenv("MYSQL_HOST"),
                        user=os.getenv("MYSQL_USER"),
                        password=os.getenv("MYSQL_PASSWORD"),
                        database=os.getenv("MYSQL_DATABASE"),
                        charset='utf8mb4',
                        cursorclass=pymysql.cursors.DictCursor
                    )

                    with conn.cursor() as cursor:
                        sql = """
                            INSERT INTO datos (patente, id_sesion, timestamp, temperatura, humedad, presion)
                            VALUES (%s, %s, %s, %s, %s, %s)
                        """
                        for row in mediciones:
                            

                            # Extraer los datos de la primera fila para el inicio
                            timestamp = datetime.utcfromtimestamp(row.get('timestamp')).strftime('%Y-%m-%dT%H:%M:%S')
                            cursor.execute(sql, (
                                row.get('patente'),
                                str(id_sesion),
                                str(timestamp),
                                row.get('temperatura_valor'),
                                row.get('humedad_valor'),
                                row.get('presion_valor')
                            ))

                        print("guardando mediciones")

                    conn.commit()

        except Exception as db_err:
            print("Error al guardar sesión en MySQL:", db_err)


        return jsonify({"message": "Sesión agregada exitosamente"}), 201

    except Exception as e:
        return jsonify({"error": f"Hubo un problema al agregar la sesión: {str(e)}"}), 500



