from flask import Blueprint, request, jsonify
import pymysql
import os

datos_bp = Blueprint('datos', __name__)

@datos_bp.route('/datos', methods=['GET'])
def get_datos():
    # Aquí iría la lógica para obtener los datos
    id_sesion = request.args.get('id_sesion')
    if not id_sesion:
        return jsonify({"error": "Falta el id_sesion"}), 400
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
            sql = "SELECT * FROM datos WHERE id_sesion = %s"
            cursor.execute(sql, (id_sesion,))
            datos = cursor.fetchall()
        connection.close()

        if datos:
            return jsonify(datos), 200
        else:
            return jsonify({"error": "No se encontraron datos para el id_sesion proporcionado"}), 404
    except Exception as e:
        return jsonify({"error": f"Error al obtener los datos: {str(e)}"}), 500
    