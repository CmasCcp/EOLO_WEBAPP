import { Breadcrumb } from "../components/Breadcrumb";
import { ChartComponent } from "../components/ExcelChart";
import { Navbar } from "../components/Navbar";
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { CardGraphic } from "../components/graphics/CardGraphic";
import { BiAxialLineChartComponent } from "../components/BiAxialLineChartComponent";
import { Anemografo } from "../components/dummys/Anemografo";
import { Statistics } from "../utils/dataFunctions";
import { MovilCardGraphic } from "../components/graphics/MovilCardGraphic";
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { DashboardHeaderComponentMP } from "../components/DashboardHeaderComponentMP";

export const DashboardRemotePage = () => {
    const [datos, setDatos] = useState(null);
    const [patente, setPatente] = useState(null);
    const [fechaInicio, setFechaInicio] = useState(null);
    const [fechaFin, setFechaFin] = useState(null);
    const [bateria, setBateria] = useState(null);
    const [ubicacion, setUbicacion] = useState(null);
    const [isUpdating, setIsUpdating] = useState(false);
    const [lastUpdate, setLastUpdate] = useState(null);

    // Arrays separados
    const [flujoArr, setFlujoArr] = useState([]);
    const [volumenArr, setVolumenArr] = useState([]);
    const [flujoVolumenArr, setFlujoVolumenArr] = useState([]);
    const [humedadArr, setHumedadArr] = useState([]);
    const [presionArr, setPresionArr] = useState([]);
    const [temperaturaArr, setTemperaturaArr] = useState([]);
    const [pm25Arr, setPm25Arr] = useState([]);
    const [pm10Arr, setPm10Arr] = useState([]);
    const [pm1Arr, setPm1Arr] = useState([]);
    const [bateriaArr, setBateriaArr] = useState([]);
    const [direccionArr, setDireccionArr] = useState([]);
    const [velocidadArr, setVelocidadArr] = useState([]);


    const location = useLocation();

    // Dividir la ruta actual en segmentos
    const pathSegments = location.pathname.split('/').filter(Boolean);

    useEffect(() => {
        // Obtener patente desde la URL: /dispositivos/MPE-004/historico
        setPatente(pathSegments[1]);

    }, []);

    // Función para cargar datos desde la API
    const loadData = () => {
        if (patente) {
            setIsUpdating(true);
            console.log(`🔄 Cargando datos para ${patente}...`);
            fetch(`${import.meta.env.VITE_REACT_APP_API_SENSORES_URL}/listarDatosEstructuradosV2?tabla=datos&disp.id_proyecto=21&limite=50&offset=0&disp.codigo_interno=${patente}`)
                .then(res => res.json())
                .then(data => {
                    setDatos(data.data.tableData);
                    setLastUpdate(new Date());
                    console.log(`✅ Datos actualizados: ${data.data.tableData?.length} registros`);
                })
                .catch(err => {
                    console.error("❌ Error al cargar datos de la API:", err);
                    setDatos(null);
                })
                .finally(() => {
                    setIsUpdating(false);
                });
        }
    };

    // Cargar datos inicialmente cuando cambia la patente
    useEffect(() => {
        console.log("cambio patente")
        loadData();
    }, [patente]);

    // Actualizar datos cada 1 minuto
    useEffect(() => {
        if (patente) {
            const interval = setInterval(() => {
                console.log("⏰ Actualizando datos automáticamente...");
                loadData();
            }, 60000); // 60000ms = 1 minuto

            return () => {
                console.log("🛑 Limpiando interval de actualización automática");
                clearInterval(interval);
            };
        }
    }, [patente]);


    useEffect(() => {
        if (datos) {

            // Extraer y transformar datos
            setFechaInicio(datos[datos.length - 1]?.fecha || null);
            setFechaFin(datos[0]?.fecha || null);
            setBateria(datos[0]?.["Divisor de Voltaje [Voltaje (V)]"] || null);

            // const lat= datos[0]?.["SIM7600G [Latitud (°)]"] || "-36.82699";
            // const lon= datos[0]?.["SIM7600G [Longitud (°)]"] || "-73.04977";
            const lat= -36.82699;
            const lon= -73.04977;

            // Obtener ubicación desde el servicio de geocodificación inversa y guardar display_name en el estado 'ubicacion'
            fetch(`https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json`)
                .then(res => {
                    if (!res.ok) throw new Error(`HTTP ${res.status}`);
                    return res.json();
                })
                .then(data => {
                    const displayName = data?.display_name || null;
                    if (typeof setUbicacion === 'function') {
                        setUbicacion(displayName);
                    } else {
                        console.warn('setUbicacion no está definido en este componente.');
                    }
                })
                .catch(err => {
                    console.error('Error al obtener la ubicación:', err);
                    if (typeof setUbicacion === 'function') setUbicacion(null);
                });

            // Separar arrays con validación
            console.log("Datos disponibles para mapear:", datos.length);
            console.log("Primer dato:", datos[0]);
            
            setHumedadArr(
                datos.map(d => ({
                    date: d.fecha,
                    porcentaje_humedad: isNaN(parseFloat(d["BME280 [Humedad (%)]"])) ? 0 : parseFloat(d["BME280 [Humedad (%)]"])
                })).filter(d => d.date && !isNaN(d.porcentaje_humedad))
            );
            setFlujoArr(
                datos.map(d => ({
                    date: d.fecha,
                    flujo: isNaN(parseFloat(d["Control de Aspiración [Flujo de captura observado (L/min)]"])) ? 0 : parseFloat(d["Control de Aspiración [Flujo de captura observado (L/min)]"])
                })).filter(d => d.date && !isNaN(d.flujo))
            );
            setVolumenArr(
                datos.map(d => ({
                    date: d.fecha,
                    volumen: isNaN(parseFloat(d["Control de Aspiración [Volumen capturado (m3)]"])) ? 0 : parseFloat(d["Control de Aspiración [Volumen capturado (m3)]"])
                })).filter(d => d.date && !isNaN(d.volumen))
            );
            setFlujoVolumenArr(
                datos.map(d => ({
                    date: d.fecha,
                    flujo: isNaN(parseFloat(d["Control de Aspiración [Flujo de captura observado (L/min)]"])) ? 0 : parseFloat(d["Control de Aspiración [Flujo de captura observado (L/min)]"]),
                    volumen: isNaN(parseFloat(d["Control de Aspiración [Volumen capturado (m3)]"])) ? 0 : parseFloat(d["Control de Aspiración [Volumen capturado (m3)]"])
                })).filter(d => d.date && (!isNaN(d.flujo) || !isNaN(d.volumen)))
            );
            setPresionArr(
                datos.map(d => ({
                    date: d.fecha,
                    presion: isNaN(parseFloat(d["BME280 [Presión atmosférica (kPa)]"])) ? 0 : parseFloat(d["BME280 [Presión atmosférica (kPa)]"])
                })).filter(d => d.date && !isNaN(d.presion))
            );
            setTemperaturaArr(
                datos.map(d => ({
                    date: d.fecha,
                    temperatura: isNaN(parseFloat(d["BME280 [Grados celcius (°C)]"])) ? 0 : parseFloat(d["BME280 [Grados celcius (°C)]"])
                })).filter(d => d.date && !isNaN(d.temperatura))
            );
            setPm25Arr(
                datos.map(d => ({
                    date: d.fecha,
                    pm25: isNaN(parseFloat(d["PMS5003 [Material particulado PM 2.5 (µg/m³)]"])) ? 0 : parseFloat(d["PMS5003 [Material particulado PM 2.5 (µg/m³)]"])
                })).filter(d => d.date && !isNaN(d.pm25))
            );
            setPm10Arr(
                datos.map(d => ({
                    date: d.fecha,
                    pm10: isNaN(parseFloat(d["PMS5003 [Material particulado PM 10 (µg/m³)]"])) ? 0 : parseFloat(d["PMS5003 [Material particulado PM 10 (µg/m³)]"])
                })).filter(d => d.date && !isNaN(d.pm10))
            );
            setPm1Arr(
                datos.map(d => ({
                    date: d.fecha,
                    pm1: isNaN(parseFloat(d["PMS5003 [Material particulado PM 1.0 (µg/m³)]"])) ? 0 : parseFloat(d["PMS5003 [Material particulado PM 1.0 (µg/m³)]"])
                })).filter(d => d.date && !isNaN(d.pm1))
            );
            setBateriaArr(
                datos.map(d => ({
                    date: d.fecha,
                    bateria: isNaN(parseFloat(d["Divisor de Voltaje [Voltaje (V)]"])) ? 0 : parseFloat(d["Divisor de Voltaje [Voltaje (V)]"])
                })).filter(d => d.date && !isNaN(d.bateria))
            );
            setVelocidadArr(
                datos.map(d => ({
                    date: d.fecha,
                    velocidad: isNaN(parseFloat(d["CWT-UWD-SD [Velocidad del viento (m/s)]"])) ? 0 : parseFloat(d["CWT-UWD-SD [Velocidad del viento (m/s)]"])
                })).filter(d => d.date && !isNaN(d.velocidad))
            );
            setDireccionArr(
                datos.map(d => ({
                    date: d.fecha,
                    grados: isNaN(parseFloat(d["CWT-UWD-SD [Dirección del Viento (Grados)]"])) ? 0 : parseFloat(d["CWT-UWD-SD [Dirección del Viento (Grados)]"])
                })).filter(d => d.date && !isNaN(d.grados))
            );
        }

    }, [datos]);

    // useEffect para console log de todos los arrays de parámetros separados
    useEffect(() => {
        console.log("=== ARRAYS DE PARÁMETROS ===");
        
        console.log("📊 FLUJO ARRAY:", flujoArr);
        console.log("📊 VOLUMEN ARRAY:", volumenArr);
        console.log("📊 FLUJO-VOLUMEN ARRAY:", flujoVolumenArr);
        console.log("💧 HUMEDAD ARRAY:", humedadArr);
        console.log("🌡️ PRESIÓN ARRAY:", presionArr);
        console.log("🌡️ TEMPERATURA ARRAY:", temperaturaArr);
        console.log("💨 PM2.5 ARRAY:", pm25Arr);
        console.log("💨 PM10 ARRAY:", pm10Arr);
        console.log("💨 PM1 ARRAY:", pm1Arr);
        console.log("🔋 BATERÍA ARRAY:", bateriaArr);
        console.log("🧭 DIRECCIÓN VIENTO ARRAY:", direccionArr);
        console.log("💨 VELOCIDAD VIENTO ARRAY:", velocidadArr);
        
        console.log("=== LONGITUDES DE ARRAYS ===");
        console.log("Flujo:", flujoArr.length);
        console.log("Volumen:", volumenArr.length);
        console.log("Flujo-Volumen:", flujoVolumenArr.length);
        console.log("Humedad:", humedadArr.length);
        console.log("Presión:", presionArr.length);
        console.log("Temperatura:", temperaturaArr.length);
        console.log("PM2.5:", pm25Arr.length);
        console.log("PM10:", pm10Arr.length);
        console.log("PM1:", pm1Arr.length);
        console.log("Batería:", bateriaArr.length);
        console.log("Dirección:", direccionArr.length);
        console.log("Velocidad:", velocidadArr.length);
        
    }, [flujoArr, volumenArr, flujoVolumenArr, humedadArr, presionArr, temperaturaArr, pm25Arr, pm10Arr, pm1Arr, bateriaArr, direccionArr, velocidadArr]);





    // Supongamos que ya tienes el arreglo humedadArr con los datos de humedads
    const lastPressure = Statistics.last(presionArr.map(d => d.presion));

    // calculos flujo
    let avgFlow = Statistics.mean(flujoArr.map(d => d.flujo));
    avgFlow = Statistics.round(avgFlow, 1);
    const minFlow = Statistics.min(flujoArr.map(d => d.flujo));
    const maxFlow = Statistics.max(flujoArr.map(d => d.flujo));


    // calculos volumen
    const lastVolume = Statistics.last(volumenArr.map(d => d.volumen));
    const minVolume = Statistics.min(volumenArr.map(d => d.volumen));
    const maxVolume = Statistics.max(volumenArr.map(d => d.volumen));
    console.log("maxVolume", maxVolume)
    // pm2.5 y pm10
    const promedioPM25 = Statistics.round(Statistics.mean(pm25Arr.map(d => d.pm25)));
    const promedioPM10 = Statistics.round(Statistics.mean(pm10Arr.map(d => d.pm10)));
    const minPM25 = Statistics.round(Statistics.min(pm25Arr.map(d => d.pm25)));
    const maxPM25 = Statistics.round(Statistics.max(pm25Arr.map(d => d.pm25)));
    const minPM10 = Statistics.round(Statistics.min(pm10Arr.map(d => d.pm10)));
    const maxPM10 = Statistics.round(Statistics.max(pm10Arr.map(d => d.pm10)));

    // temperatura
    let promedioTemperatura = Statistics.round(Statistics.mean(temperaturaArr.map(d => d.temperatura)));
    let minTemperatura = Statistics.round(Statistics.min(temperaturaArr.map(d => d.temperatura)));
    let maxTemperatura = Statistics.round(Statistics.max(temperaturaArr.map(d => d.temperatura)));

    const promedioHumedad = Statistics.round(Statistics.mean(humedadArr.map(d => d.porcentaje_humedad)));
    const minHumedad = Statistics.round(Statistics.min(humedadArr.map(d => d.porcentaje_humedad)));
    const maxHumedad = Statistics.round(Statistics.max(humedadArr.map(d => d.porcentaje_humedad)));
    const promedioPresion = Statistics.round(Statistics.mean(presionArr.map(d => d.presion)));

    const minPressure = Statistics.round(Statistics.min(presionArr.map(d => d.presion)));
    const maxPressure = Statistics.round(Statistics.max(presionArr.map(d => d.presion)));
    const promedioDireccion = Statistics.round(Statistics.mean(direccionArr.map(d => d.grados)));
    const minDireccion = Statistics.round(Statistics.min(direccionArr.map(d => d.grados)));
    const maxDireccion = Statistics.round(Statistics.max(direccionArr.map(d => d.grados)));
    const promedioVelocidad = Statistics.round(Statistics.mean(velocidadArr.map(d => d.velocidad)));

    const [selectedChart, setSelectedChart] = useState("flujoVolumen");

    // Debug: Log cuando cambia el gráfico seleccionado
    useEffect(() => {
        console.log(`📊 Gráfico seleccionado: ${selectedChart}`);
        console.log('📊 Estados de arrays:', {
            flujoArr: flujoArr.length,
            volumenArr: volumenArr.length,
            flujoVolumenArr: flujoVolumenArr.length,
            pm25Arr: pm25Arr.length,
            pm10Arr: pm10Arr.length,
            temperaturaArr: temperaturaArr.length,
            humedadArr: humedadArr.length,
            presionArr: presionArr.length,
            direccionArr: direccionArr.length,
            velocidadArr: velocidadArr.length
        });
    }, [selectedChart, flujoArr, volumenArr, flujoVolumenArr, pm25Arr, pm10Arr, temperaturaArr, humedadArr, presionArr, direccionArr, velocidadArr]);

    // Opciones de gráficos
    const chartOptions = [
        { key: "flujoVolumen", label: "Flujo / Volumen", data: flujoVolumenArr },
        { key: "flujo", label: "Flujo (l/min)", data: flujoArr },
        { key: "volumen", label: "Volumen (m³)", data: volumenArr },
        { key: "pm2_5", label: "MP 2.5 (µg/m³)", data: pm25Arr },
        { key: "pm10", label: "MP 10 (µg/m³)", data: pm10Arr },
        { key: "temperatura", label: "Temperatura (°C)", data: temperaturaArr },
        { key: "humedad", label: "Humedad (%)", data: humedadArr },
        { key: "presion", label: "Presión (hPa)", data: presionArr },
        { key: "viento", label: "Viento", data: direccionArr },
    ];

    // Encuentra la opción seleccionada
    const selectedOption = chartOptions.find(opt => opt.key === selectedChart);

    // Función para generar el PDF
    const generatePDFReport = async () => {
        const pdf = new jsPDF('p', 'mm', 'a4');
        const pageWidth = pdf.internal.pageSize.getWidth();
        const pageHeight = pdf.internal.pageSize.getHeight();
        let yPosition = 20;

        // Título del reporte
        pdf.setFontSize(18);
        pdf.text('Reporte Histórico EOLO', pageWidth / 2, yPosition, { align: 'center' });
        yPosition += 15;

        // Información del dispositivo
        pdf.setFontSize(12);
        pdf.text(`Dispositivo: ${patente || 'N/A'}`, 20, yPosition);
        yPosition += 8;
        pdf.text(`Tipo de reporte: Dashboard Histórico (Todas las sesiones)`, 20, yPosition);
        yPosition += 8;
        pdf.text(`Total de mediciones: ${datos?.length || 0}`, 20, yPosition);
        yPosition += 15;

        // Resumen estadístico
        pdf.setFontSize(14);
        pdf.text('Resumen Estadístico General', 20, yPosition);
        yPosition += 10;

        pdf.setFontSize(10);
        const estadisticas = [
            [`Flujo Promedio: ${avgFlow || 'N/A'} l/min`, `Min: ${minFlow || 'N/A'}`, `Max: ${maxFlow || 'N/A'}`],
            [`Volumen Final: ${lastVolume || 'N/A'} m³`, `Min: ${minVolume || 'N/A'}`, `Max: ${maxVolume || 'N/A'}`],
            [`Temperatura Prom.: ${promedioTemperatura || 'N/A'} °C`, `Min: ${minTemperatura || 'N/A'}`, `Max: ${maxTemperatura || 'N/A'}`],
            [`Humedad Prom.: ${promedioHumedad || 'N/A'} %`, `Min: ${minHumedad || 'N/A'}`, `Max: ${maxHumedad || 'N/A'}`],
            [`Presión Prom.: ${promedioPresion || 'N/A'} hPa`, `Min: ${minPressure || 'N/A'}`, `Max: ${maxPressure || 'N/A'}`],
            [`MP 2.5 Prom.: ${promedioPM25 || 'N/A'} µg/m³`, `Min: ${minPM25 || 'N/A'}`, `Max: ${maxPM25 || 'N/A'}`],
            [`MP 10 Prom.: ${promedioPM10 || 'N/A'} µg/m³`, `Min: ${minPM10 || 'N/A'}`, `Max: ${maxPM10 || 'N/A'}`]
        ];

        estadisticas.forEach(stat => {
            pdf.text(stat[0], 20, yPosition);
            pdf.text(stat[1], 80, yPosition);
            pdf.text(stat[2], 140, yPosition);
            yPosition += 6;
        });

        yPosition += 10;

        // Capturar gráficos
        const graficos = [
            { key: 'flujoVolumen', titulo: 'Flujo / Volumen' },
            { key: 'temperatura', titulo: 'Temperatura' },
            { key: 'humedad', titulo: 'Humedad' },
            { key: 'presion', titulo: 'Presión' },
            { key: 'pm2_5', titulo: 'MP 2.5' },
            { key: 'pm10', titulo: 'MP 10' },
            { key: 'viento', titulo: 'Viento' }
        ];

        for (const grafico of graficos) {
            // Cambiar al gráfico
            setSelectedChart(grafico.key);

            // Esperar un momento para que se renderice
            await new Promise(resolve => setTimeout(resolve, 1000));

            // Buscar el elemento del gráfico
            const chartElement = document.querySelector('.recharts-wrapper') ||
                document.querySelector('canvas') ||
                document.querySelector('.card:not([style*="display: none"]) .recharts-wrapper');

            if (chartElement) {
                try {
                    const canvas = await html2canvas(chartElement, {
                        scale: 1,
                        useCORS: true,
                        allowTaint: true,
                        backgroundColor: '#ffffff'
                    });

                    const imgData = canvas.toDataURL('image/png');
                    const imgWidth = pageWidth - 40;
                    const imgHeight = (canvas.height * imgWidth) / canvas.width;

                    // Nueva página si es necesario
                    if (yPosition + imgHeight > pageHeight - 20) {
                        pdf.addPage();
                        yPosition = 20;
                    }

                    pdf.setFontSize(12);
                    pdf.text(grafico.titulo, 20, yPosition);
                    yPosition += 10;

                    pdf.addImage(imgData, 'PNG', 20, yPosition, imgWidth, imgHeight);
                    yPosition += imgHeight + 15;

                } catch (error) {
                    console.error(`Error capturando gráfico ${grafico.titulo}:`, error);
                }
            }
        }

        // Guardar el PDF
        pdf.save(`reporte_historico_${patente || 'datos'}.pdf`);

        // Volver al gráfico original
        setSelectedChart("flujoVolumen");
    };

    return (
        <>
            <Navbar />
            <div className="container mt-5">
                <Breadcrumb />
            </div>

            {/* Contenido pagina */}
            <div className="row mx-auto">
                <div className="col-md-10 mx-auto">
                    <div className="container mx-auto m-0">
                        <div className="d-flex flex-row justify-content-between align-items-center">
                            <div className="col-5">

                                <h2 className="mb-0">Dashboard {patente}</h2>
                                <h5 className="mb-0">Monitoreo en vivo</h5>
                            </div>
                            <div className="d-flex align-items-center gap-2">
                                {/* Indicador de actualización */}
                                <div className="d-flex align-items-center me-2">
                                    {isUpdating ? (
                                        <div className="d-flex align-items-center text-primary">
                                            <div className="spinner-border spinner-border-sm me-2" role="status">
                                                <span className="visually-hidden">Actualizando...</span>
                                            </div>
                                            <small>Actualizando...</small>
                                        </div>
                                    ) : lastUpdate && (
                                        <small className="text-muted">
                                            <i className="fas fa-clock me-1"></i>
                                            Actualizado: {lastUpdate.toLocaleTimeString()}
                                        </small>
                                    )}
                                </div>
                                
                                <button
                                    className="btn btn-outline-secondary btn-sm mx-1"
                                    onClick={loadData}
                                    disabled={isUpdating}
                                    title="Actualizar datos manualmente"
                                >
                                    <i className={`fas fa-sync-alt ${isUpdating ? 'fa-spin' : ''}`}></i>
                                </button>
                                
                                <button
                                    className="btn btn-dark mx-1"
                                    onClick={() => window.open(`${import.meta.env.VITE_REACT_APP_API_URL}/datos?patente=${patente}&formato=xlsx`, '_blank')}
                                >
                                    <small>Descargar Datos</small>
                                </button>
                                <button
                                    className="btn btn-danger mx-1"
                                    onClick={generatePDFReport}
                                >
                                    <small>Descargar PDF</small>
                                </button>
                            </div>
                        </div>
                        {console.log("📊 Datos para DashboardHeader:", {
                            pathSegments, 
                            bateria, 
                            fechaInicio, 
                            fechaFin, 
                            ubicacion,
                            datosLength: datos?.length
                        })}
                        <DashboardHeaderComponentMP 
                            pathSegments={pathSegments} 
                            battery={bateria}
                            timestamp_inicial={fechaInicio}
                            timestamp_final={fechaFin}
                            ubicacion_corto={ubicacion}
                            historic={false}
                        />
                        <hr className="col-12 mx-auto" />
                    </div>

                    {!!datos && (
                        <div className="container">
                            {/* Tarjetas de resumen ... */}
                            {/* d-none d-md-block  */}

                            {/* <div className="d-md-block block-inline d-flex flex-row flex-wrap mb-4 justify-content-around"> */}
                            <div className="d-none d-lg-flex flex-row col-12 mb-4 justify-content-between">
                                <CardGraphic onClick={() => setSelectedChart("flujo")} showStats={selectedChart === "flujo"} titulo="Flujo Promediado" min={minFlow} max={maxFlow} valor={avgFlow || "-"} unidad="l/min" />
                                <CardGraphic onClick={() => setSelectedChart("volumen")} showStats={selectedChart === "volumen"} titulo="Volumen Acumulado" min={minVolume} max={maxVolume} valor={lastVolume || "-"} unidad="m³" />
                                <CardGraphic onClick={() => setSelectedChart("pm2_5")} showStats={selectedChart === "pm2_5"} titulo="MP 2.5 Promediado" min={minPM25} max={maxPM25} valor={isNaN(promedioPM25) ? '-' : promedioPM25} unidad="µg/m³" />
                                <CardGraphic onClick={() => setSelectedChart("pm10")} showStats={selectedChart === "pm10"} titulo="MP 10 Promediado" min={minPM10} max={maxPM10} valor={isNaN(promedioPM10) ? '-' : promedioPM10} unidad="µg/m³" />
                                <CardGraphic onClick={() => setSelectedChart("temperatura")} showStats={selectedChart === "temperatura"} titulo="Temperatura Promediada" min={minTemperatura} max={maxTemperatura} valor={isNaN(promedioTemperatura) ? '-' : promedioTemperatura} unidad="°C" />
                                <CardGraphic onClick={() => setSelectedChart("humedad")} showStats={selectedChart === "humedad"} titulo="Humedad Relativa Promediada" min={minHumedad} max={maxHumedad} valor={isNaN(promedioHumedad) ? '-' : promedioHumedad} unidad="%" />
                                <CardGraphic onClick={() => setSelectedChart("presion")} showStats={selectedChart === "presion"} titulo="Presión Atmosférica Final" min={minPressure} max={maxPressure} valor={isNaN(lastPressure) ? '-' : lastPressure} unidad="hPa" />
                            </div>

                            {/* Resumen móvil: visible solo en pantallas pequeñas */}
                            <div className="d-lg-none mb-3">
                                <div className="row text-center">
                                    <MovilCardGraphic titulo="Flujo Promediado" min={minFlow} max={maxFlow} valor={avgFlow || "-"} unidad="l/min" />
                                    <MovilCardGraphic titulo="Volumen Acumulado" min={minVolume} max={maxVolume} valor={lastVolume || "-"} unidad="m³" />
                                    <MovilCardGraphic titulo="MP 2.5 Promediado" min={minPM25} max={maxPM25} valor={isNaN(promedioPM25) ? '-' : promedioPM25} unidad="µg/m³" />
                                    <MovilCardGraphic titulo="MP 10 Promediado" min={minPM10} max={maxPM10} valor={isNaN(promedioPM10) ? '-' : promedioPM10} unidad="µg/m³" />
                                    <MovilCardGraphic titulo="Temperatura Promediada" min={minTemperatura} max={maxTemperatura} valor={isNaN(promedioTemperatura) ? '-' : promedioTemperatura} unidad="°C" />
                                    <MovilCardGraphic titulo="Humedad Promediada" min={minHumedad} max={maxHumedad} valor={isNaN(promedioHumedad) ? '-' : promedioHumedad} unidad="%" />
                                    <MovilCardGraphic titulo="Presión Final" min={minPressure} max={maxPressure} valor={isNaN(lastPressure) ? '-' : lastPressure} unidad="hPa" />
                                </div>
                            </div>
                            {/* <div className="d-flex flex-row justify-content-end">
                <button className="btn btn-dark mx-1"><small> Descargar Reporte</small></button>
                <button className="btn btn-dark mx-0"><small>Descargar Datos</small></button>
              </div> */}
                            <hr className="col-12 mx-auto" />

                            {/* Navegador de gráficos tipo tabs */}
                            <ul
                                className="nav nav-pills fs-6 flex-nowrap justify-content-start mb-3 w-100 overflow-auto custom-tab-scroll"
                                style={{ whiteSpace: "nowrap" }}
                            >
                                {chartOptions.map(opt => (
                                    <li className="nav-item d-inline-block" key={opt.key}>
                                        <button
                                            className={`nav-link ${selectedChart === opt.key ? "active bg-dark text-white" : "text-dark"}`}
                                            style={{ cursor: "pointer", minWidth: 120 }}
                                            onClick={() => {
                                                console.log(`🖱️ Click en pestaña: ${opt.key}`);
                                                setSelectedChart(opt.key);
                                            }}
                                        >
                                            {opt.label}
                                        </button>
                                    </li>
                                ))}
                            </ul>
                            {/* <div className="container-fluid">
                <BiAxialLineChartComponent datos={flujoVolumenArr} lineDataKeyOne={"flujo"} lineDataKeyTwo={"volumen"} title="Flujo / Volumen" />
              </div> */}

                            {/* Gráficos y mapa: solo uno visible según selección */}
                            <div className="col-12">
                                {/* Debug: Mostrar gráfico seleccionado */}
                                <div className="alert alert-info d-flex align-items-center mb-3">
                                    <i className="fas fa-info-circle me-2"></i>
                                    <span>Mostrando: <strong>{selectedChart}</strong></span>
                                    <span className="badge bg-secondary ms-2">
                                        Render ID: {Math.random().toString(36).substr(2, 9)}
                                    </span>
                                    <button 
                                        className="btn btn-sm btn-outline-secondary me-2"
                                        onClick={() => console.log('Estado actual:', { selectedChart, chartOptions })}
                                    >
                                        Debug State
                                    </button>
                                    <button 
                                        className="btn btn-sm btn-warning"
                                        onClick={() => {
                                            const charts = ["flujo", "volumen", "flujoVolumen", "temperatura", "humedad", "presion"];
                                            const randomChart = charts[Math.floor(Math.random() * charts.length)];
                                            console.log(`🎲 Cambiando a: ${randomChart}`);
                                            setSelectedChart(randomChart);
                                        }}
                                    >
                                        Test Random
                                    </button>
                                </div>
                                
                                {/* Test básico de renderizado condicional */}
                                <div className="alert alert-warning mb-3">
                                    <h6>Test de Renderizado:</h6>
                                    {selectedChart === "flujo" && <span className="badge bg-success">✓ Flujo activo</span>}
                                    {selectedChart === "volumen" && <span className="badge bg-success">✓ Volumen activo</span>}
                                    {selectedChart === "flujoVolumen" && <span className="badge bg-success">✓ Flujo/Volumen activo</span>}
                                    {selectedChart === "pm2_5" && <span className="badge bg-success">✓ PM2.5 activo</span>}
                                    {selectedChart === "pm10" && <span className="badge bg-success">✓ PM10 activo</span>}
                                    {selectedChart === "temperatura" && <span className="badge bg-success">✓ Temperatura activo</span>}
                                    {selectedChart === "humedad" && <span className="badge bg-success">✓ Humedad activo</span>}
                                    {selectedChart === "presion" && <span className="badge bg-success">✓ Presión activo</span>}
                                    {selectedChart === "viento" && <span className="badge bg-success">✓ Viento activo</span>}
                                </div>
                                
                                <div className="col-12 col-md-12 mb-2">
                                    {selectedChart === "flujo" && (
                                        <div key="chart-flujo" className="card">
                                            <div className="alert alert-success m-3">Renderizando gráfico de FLUJO</div>
                                            {flujoArr.length > 0 ? (
                                                <ChartComponent key={`flujo-${flujoArr.length}`} title="Flujo (l/min)" datos={[...flujoArr].reverse()} />
                                            ) : (
                                                <div className="card-body text-center">
                                                    <p>No hay datos de flujo disponibles (Array length: {flujoArr.length})</p>
                                                </div>
                                            )}
                                        </div>
                                    )}
                                    
                                    {selectedChart === "volumen" && (
                                        <div key="chart-volumen" className="card">
                                            <div className="alert alert-success m-3">Renderizando gráfico de VOLUMEN</div>
                                            {volumenArr.length > 0 ? (
                                                <ChartComponent key={`volumen-${volumenArr.length}`} title="Volumen (m³)" datos={[...volumenArr].reverse()} />
                                            ) : (
                                                <div className="card-body text-center">
                                                    <p>No hay datos de volumen disponibles (Array length: {volumenArr.length})</p>
                                                </div>
                                            )}
                                        </div>
                                    )}
                                    
                                    {selectedChart === "flujoVolumen" && (
                                        <div key="chart-flujovolumen" className="card">
                                            <div className="alert alert-success m-3">Renderizando gráfico de FLUJO/VOLUMEN</div>
                                            {flujoVolumenArr.length > 0 ? (
                                                <BiAxialLineChartComponent key={`flujovolumen-${flujoVolumenArr.length}`} datos={[...flujoVolumenArr].reverse()} lineDataKeyOne={"flujo"} lineDataKeyTwo={"volumen"} title="Flujo (l/min) / Volumen (m³)" />
                                            ) : (
                                                <div className="card-body text-center">
                                                    <p>No hay datos de flujo/volumen disponibles (Array length: {flujoVolumenArr.length})</p>
                                                </div>
                                            )}
                                        </div>
                                    )}
                                    
                                    {selectedChart === "pm2_5" && (
                                        <div key="chart-pm25" className="card">
                                            <div className="alert alert-success m-3">Renderizando gráfico de PM2.5</div>
                                            {pm25Arr.length > 0 ? (
                                                <ChartComponent key={`pm25-${pm25Arr.length}`} title="MP 2.5 (µg/m³)" datos={[...pm25Arr].reverse()} />
                                            ) : (
                                                <div className="card-body text-center">
                                                    <p>No hay datos de PM 2.5 disponibles (Array length: {pm25Arr.length})</p>
                                                </div>
                                            )}
                                        </div>
                                    )}
                                    
                                    {selectedChart === "pm10" && (
                                        <div key="chart-pm10" className="card">
                                            <div className="alert alert-success m-3">Renderizando gráfico de PM10</div>
                                            {pm10Arr.length > 0 ? (
                                                <ChartComponent key={`pm10-${pm10Arr.length}`} title="MP 10 (µg/m³)" datos={[...pm10Arr].reverse()} />
                                            ) : (
                                                <div className="card-body text-center">
                                                    <p>No hay datos de PM 10 disponibles (Array length: {pm10Arr.length})</p>
                                                </div>
                                            )}
                                        </div>
                                    )}
                                    
                                    {selectedChart === "temperatura" && (
                                        <div key="chart-temperatura" className="card">
                                            <div className="alert alert-success m-3">Renderizando gráfico de TEMPERATURA</div>
                                            {temperaturaArr.length > 0 ? (
                                                <ChartComponent key={`temperatura-${temperaturaArr.length}`} title="Temperatura (°C)" datos={[...temperaturaArr].reverse()} />
                                            ) : (
                                                <div className="card-body text-center">
                                                    <p>No hay datos de temperatura disponibles (Array length: {temperaturaArr.length})</p>
                                                </div>
                                            )}
                                        </div>
                                    )}
                                    
                                    {selectedChart === "humedad" && (
                                        <div key="chart-humedad" className="card">
                                            <div className="alert alert-success m-3">Renderizando gráfico de HUMEDAD</div>
                                            {humedadArr.length > 0 ? (
                                                <ChartComponent key={`humedad-${humedadArr.length}`} title="Humedad Ambiental Relativa (%)" datos={[...humedadArr].reverse()} />
                                            ) : (
                                                <div className="card-body text-center">
                                                    <p>No hay datos de humedad disponibles (Array length: {humedadArr.length})</p>
                                                </div>
                                            )}
                                        </div>
                                    )}
                                    
                                    {selectedChart === "presion" && (
                                        <div key="chart-presion" className="card">
                                            <div className="alert alert-success m-3">Renderizando gráfico de PRESIÓN</div>
                                            {presionArr.length > 0 ? (
                                                <ChartComponent key={`presion-${presionArr.length}`} title="Presión (hPa)" datos={[presionArr].reverse()} />
                                            ) : (
                                                <div className="card-body text-center">
                                                    <p>No hay datos de presión disponibles (Array length: {presionArr.length})</p>
                                                </div>
                                            )}
                                        </div>
                                    )}
                                    
                                    {selectedChart === "viento" && (
                                        <div key="chart-viento" className="card">
                                            <div className="alert alert-success m-3">Renderizando gráfico de VIENTO</div>
                                            {direccionArr.length > 0 && velocidadArr.length > 0 ? (
                                                <Anemografo key={`viento-${direccionArr.length}`} title="Viento" promedio={promedioDireccion} datosVelocidad={[...velocidadArr].reverse()} promedioVelocidad={[...promedioVelocidad].reverse()} datos={direccionArr} />
                                            ) : (
                                                <div className="card-body text-center">
                                                    <p>No hay datos de viento disponibles (Dir: {direccionArr.length}, Vel: {velocidadArr.length})</p>
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>
                            </div>

                        </div>
                    )}
                </div>


            </div>
        </>
    );
};
