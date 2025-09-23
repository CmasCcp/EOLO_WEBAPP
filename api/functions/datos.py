from flask import Blueprint, request, jsonify
import pymysql
import os
from datetime import datetime
import io
import pandas as pd
from flask import send_file
# from dotenv import load_dotenv

# load_dotenv(dotenv_path="/var/www/api-eolo/.env")

datos_bp = Blueprint('datos', __name__)

@datos_bp.route('/datos', methods=['GET'])
def get_datos():
    id_sesion = request.args.get('id_sesion')
    patente = request.args.get('patente')
    formato = request.args.get('formato')
    if not id_sesion and not patente:
        return jsonify({"error": "Falta el id_sesion o patente"}), 400
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
            if id_sesion:
                sql = "SELECT * FROM datos WHERE id_sesion = %s"
                cursor.execute(sql, (id_sesion,))
            else:
                sql = "SELECT * FROM datos WHERE patente = %s"
                cursor.execute(sql, (patente,))
            datos = cursor.fetchall()
        connection.close()

        if not datos:
            return jsonify({"error": "No se encontraron datos para el criterio proporcionado"}), 404

        # Si el formato es xlsx, devolver archivo Excel
        if formato and formato.lower() == "xlsx":
            df = pd.DataFrame(datos)
            output = io.BytesIO()
            with pd.ExcelWriter(output, engine='openpyxl') as writer:
                df.to_excel(writer, index=False)
            output.seek(0)
            filename = f"datos_{id_sesion or patente}.xlsx"
            return send_file(
                output,
                mimetype='application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
                as_attachment=True,
                download_name=filename
            )

        # Si no, devolver JSON
        return jsonify(datos), 200

    except Exception as e:
        return jsonify({"error": f"Error al obtener los datos: {str(e)}"}), 500
    
@datos_bp.route('/datos', methods=['POST'])
def insert_datos():
    data = request.get_json()
    mediciones = data.get('mediciones')
    id_sesion = data.get('id_sesion')

    if not mediciones or not id_sesion:
        return jsonify({"error": "Faltan mediciones o id_sesion"}), 400

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
            sql = """
                INSERT INTO datos 
                (patente, id_sesion, 
                timestamp, temperatura, 
                humedad, presion, 
                pm2_5, pm10, bateria, 
                velocidad, direccion, 
                flujo, volumen)
                VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
            """
            for row in mediciones:
                timestamp = datetime.utcfromtimestamp(row.get('timestamp')).strftime('%Y-%m-%dT%H:%M:%S')
                cursor.execute(sql, (
                    row.get('patente'),
                    str(id_sesion),
                    str(timestamp),
                    row.get('temperatura_valor'),
                    row.get('humedad_valor'),
                    row.get('presion_valor'),
                    row.get('pm2.5_valor'),
                    row.get('pm10_valor'),
                    row.get('bateria_valor'),
                    row.get('velocidad_valor'),
                    row.get('direccion_valor'),
                    row.get('flujo_valor'),
                    row.get('volumen_valor')
                ))
        connection.commit()
        connection.close()
        return jsonify({"message": "Mediciones guardadas correctamente"}), 201
    except Exception as e:
        return jsonify({"error": f"Error al guardar las mediciones: {str(e)}"}), 500

@datos_bp.route('/datos/insert', methods=['GET'])
def insert_datos_get():
    patente = request.args.get('patente')
    id_sesion = request.args.get('id_sesion')
    timestamp = request.args.get('timestamp')
    temperatura = request.args.get('temperatura_valor')
    humedad = request.args.get('humedad_valor')
    presion = request.args.get('presion_valor')
    pm2_5 = request.args.get('pm2.5_valor')
    pm10 = request.args.get('pm10_valor')
    bateria = request.args.get('bateria_valor')
    velocidad = request.args.get('velocidad_valor')
    direccion = request.args.get('direccion_valor')
    flujo = request.args.get('flujo_valor')
    volumen = request.args.get('volumen_valor')

    required_params = [patente, id_sesion, timestamp, temperatura, humedad, presion, pm2_5, pm10, bateria, velocidad, direccion, flujo, volumen]
    if not all(required_params):
        return jsonify({"error": "Faltan parámetros en la URL"}), 400

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
            sql = """
                INSERT INTO datos 
                (patente, id_sesion, 
                timestamp, temperatura, 
                humedad, presion, 
                pm2_5, pm10, bateria, 
                velocidad, direccion, 
                flujo, volumen)
                VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
            """
            # Convert timestamp to correct format
            try:
                formatted_timestamp = datetime.utcfromtimestamp(float(timestamp)).strftime('%Y-%m-%dT%H:%M:%S')
            except Exception:
                formatted_timestamp = timestamp  # fallback if already formatted

            cursor.execute(sql, (
                patente,
                str(id_sesion),
                str(formatted_timestamp),
                temperatura,
                humedad,
                presion,
                pm2_5,
                pm10,
                bateria,
                velocidad,
                direccion,
                flujo,
                volumen
            ))
        connection.commit()
        connection.close()
        return jsonify({"message": "Medición guardada correctamente"}), 201
    except Exception as e:
        return jsonify({"error": f"Error al guardar la medición: {str(e)}"}), 500