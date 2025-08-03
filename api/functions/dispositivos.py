from flask import Blueprint, request, jsonify
import pymysql
import os
import json


# Configuración del directorio para guardar los archivos
UPLOAD_FOLDER = os.getenv("UPLOAD_FOLDER")
ALLOWED_EXTENSIONS = {'xls', 'xlsx'}
JSON_FILES_ROOT = os.getenv("JSON_FILES_ROOT")
JSON_FILES_API_SENSORES_ROOT = os.getenv("JSON_FILES_API_SENSORES_ROOT")
JSON_FILES_USER_ROOT = os.getenv("JSON_FILES_USER_ROOT")
JSON_FILES_SESIONES_JSON = os.getenv("JSON_FILES_SESIONES_JSON")



dispositivos_bp = Blueprint('dispositivos', __name__)

# Endpoint GET para leer los datos de 'dispositivos.json'
@dispositivos_bp.route('/dispositivos', methods=['GET'])
def get_devices():
    print(JSON_FILES_API_SENSORES_ROOT+"/dispositivos.json")
    if os.path.exists(JSON_FILES_API_SENSORES_ROOT+"/dispositivos.json"):
        with open(JSON_FILES_API_SENSORES_ROOT+"/dispositivos.json", 'r', encoding='utf-8') as file:
            data = json.load(file)  # Leer el archivo JSON
        return jsonify(data), 200  # Devolver los datos como JSON
    else:
        return jsonify({"error": "El archivo sesiones.json no existe"}), 404

# Endpoint GET para leer los datos de 'dispositivos.json'
@dispositivos_bp.route('/mis-dispositivos', methods=['GET'])
def get_my_devices():
    # print(JSON_FILES_USER_ROOT+"/dispositivos_usuario.json")
    id_usuario= request.args.get('usuario')
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
            sql = "SELECT * FROM dispositivo_en_usuario WHERE usuario = %s"
            cursor.execute(sql, (id_usuario))
            dispositivos = cursor.fetchall()

        # connection.close()
        return jsonify(dispositivos), 200
    except Exception as e:
        return jsonify({"error": f"Error al obtener dispositivos: {str(e)}"}), 500


# Endpoint GET para obtener un dispositivo por patente
@dispositivos_bp.route('/dispositivo', methods=['GET'])
def get_device():
    # Obtener la patente desde los parámetros de la URL
    patente = request.args.get('patente')

    # Verificar si se proporcionó la patente
    if not patente:
        return jsonify({"error": "Falta el parámetro 'patente'"}), 400

    # # Verificar si el archivo JSON existe
    # if os.path.exists(JSON_FILES_API_SENSORES_ROOT + "/dispositivos.json"):
    #     with open(JSON_FILES_API_SENSORES_ROOT + "/dispositivos.json", 'r', encoding='utf-8') as file:
    #         data = json.load(file)  # Leer el archivo JSON

    #     # Buscar el dispositivo que tenga la patente proporcionada
    #     device = next((device for device in data if device['patente'] == patente), None)

    #     # Si encontramos el dispositivo, devolverlo, de lo contrario, enviar un error
    #     if device:
    #         return jsonify(device), 200
    #     else:
    #         return jsonify({"error": "Dispositivo no encontrado"}), 404
    # Verificar si el archivo JSON existe
    if os.path.exists(JSON_FILES_API_SENSORES_ROOT + "/dispositivos.json"):
        with open(JSON_FILES_API_SENSORES_ROOT + "/dispositivos.json", 'r', encoding='utf-8') as file:
            data = json.load(file)  # Leer el archivo JSON

        # Buscar el dispositivo que tenga la patente proporcionada
        device = next((device for device in data["data"]["tableData"] if device['codigo_interno'] == patente), None)

        device["modelo"] = "Eolo MP Express"

        # Si encontramos el dispositivo, devolverlo, de lo contrario, enviar un error
        if device:
            return jsonify(device), 200
        else:
            return jsonify({"error": "Dispositivo no encontrado"}), 404        

    else:
        return jsonify({"error": "El archivo dispositivos.json no existe", "url": JSON_FILES_API_SENSORES_ROOT + "/dispositivos.json"}), 404


# Endpoint GET para obtener un dispositivo por patente
@dispositivos_bp.route('/mi-dispositivo', methods=['GET'])
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
@dispositivos_bp.route('/add-device', methods=['POST'])
def add_device():
    try:
        id_usuario = request.args.get('usuario')
        # Obtener los datos del nuevo dispositivo desde la solicitud JSON
        new_device = request.get_json()
        print(new_device)

        # Verificar que los campos necesarios estén en el JSON
        if 'patente' not in new_device or 'modelo' not in new_device:
            return jsonify({"error": "Faltan campos 'patente' o 'modelo'"}), 400

        # --- INICIO MYSQL ---
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
                # Verificar si ya existe la patente asociada al id_usuario
                check_sql = "SELECT COUNT(*) AS count FROM dispositivo_en_usuario WHERE patente_dispositivo = %s AND usuario = %s"
                cursor.execute(check_sql, (new_device['patente'], id_usuario))
                result = cursor.fetchone()

                if result['count'] > 0:
                    return jsonify({"error": "La patente ya está asociada a este usuario"}), 400

                # Si no existe, insertamos el nuevo dispositivo
                sql = "INSERT INTO dispositivo_en_usuario (patente_dispositivo, usuario, modelo) VALUES (%s, %s, %s)"
                cursor.execute(sql, (new_device['patente'], id_usuario, new_device['modelo']))  
            connection.commit()

        except Exception as db_err:
            print("Error al guardar en MySQL:", db_err)
            return jsonify({"error": "Error al interactuar con la base de datos"}), 500
        # --- FIN MYSQL ---

        return jsonify({"message": "Dispositivo agregado exitosamente"}), 201

    except Exception as e:
        return jsonify({"error": f"Hubo un problema al agregar el dispositivo: {str(e)}"}), 500
