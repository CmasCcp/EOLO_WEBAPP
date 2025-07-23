from flask import Flask, request, jsonify
from flask_cors import CORS  # Importa CORS
import os
import json
from werkzeug.utils import secure_filename
import pandas as pd

app = Flask(__name__)

# Habilitar CORS para permitir cualquier origen
CORS(app)

# Configuración del directorio para guardar los archivos
UPLOAD_FOLDER = 'C:/Users/Alienware/Desktop/Proyectos software/EOLO_WEBAPP/api/db/sesiones/'
ALLOWED_EXTENSIONS = {'xls', 'xlsx'}
JSON_FILE_PATH = 'C:/Users/Alienware/Desktop/Proyectos software/EOLO_WEBAPP/api/db/sesiones.json'  # Ruta al archivo JSON

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

if __name__ == '__main__':
    app.run(debug=True, port=5000)
