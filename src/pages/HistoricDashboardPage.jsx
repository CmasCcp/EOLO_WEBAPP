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
import { generatePDFReport } from "../utils/generatePDFReport";

export const HistoricDashboardPage = () => {
  const [datos, setDatos] = useState(null);
  const [patente, setPatente] = useState(null);
  const [sesionsData, setSesionsData] = useState(null);


  // Arrays separados
  const [flujoArr, setFlujoArr] = useState([]);
  const [volumenArr, setVolumenArr] = useState([]);
  const [flujoVolumenArr, setFlujoVolumenArr] = useState([]);
  const [humedadArr, setHumedadArr] = useState([]);
  const [presionArr, setPresionArr] = useState([]);
  const [temperaturaArr, setTemperaturaArr] = useState([]);
  const [pm25Arr, setPm25Arr] = useState([]);
  const [pm10Arr, setPm10Arr] = useState([]);
  const [bateriaArr, setBateriaArr] = useState([]);
  const [direccionArr, setDireccionArr] = useState([]);
  const [velocidadArr, setVelocidadArr] = useState([]);
  const [generatingPDF, setGeneratingPDF] = useState(false);


  // // Calculados
  // const [humedadArr, setHumedadArr] = useState([]);
  // const [presionArr, setPresionArr] = useState([]);
  // const [temperaturaArr, setTemperaturaArr] = useState([]);

  const location = useLocation();

  // Dividir la ruta actual en segmentos
  const pathSegments = location.pathname.split('/').filter(Boolean);

  useEffect(() => {
    // Obtener patente desde la URL: /dispositivos/MPE-004/historico
    setPatente(pathSegments[1]);

  }, []);

  useEffect(() => {
    fetch(`${import.meta.env.VITE_REACT_APP_API_URL}/mis-sesiones?patente=${patente}`)
      .then(res => res.json())
      .then(data => {
        setSesionsData(data);
      })
      .catch(err => {
        console.error("No se pudo cargar las sesiones de la API:", err);
        setSesionsData(null);
      });
  }, [patente]);

  useEffect(() => {
    if (patente && sesionsData && sesionsData.length > 0) {
      // Obtener todos los filenames y unirlos por coma
      const filenames = sesionsData.map(s => s.filename).join(',');
      fetch(`${import.meta.env.VITE_REACT_APP_API_URL}/datos?patente=${patente}&filename=${filenames}`)
        .then(res => res.json())
        .then(data => {
          setDatos(data);

          // Separar arrays
          setHumedadArr(
            data.map(d => ({
              date: d.timestamp_formated,
              id_dato: d.id_dato,
              porcentaje_humedad: parseFloat(d.humedad_valor)
            }))
          );
          setFlujoArr(
            data.map(d => ({
              date: d.timestamp_formated,
              id_dato: d.id_dato,
              flujo: parseFloat(d.flujo_valor)
            }))
          );
          setVolumenArr(
            data.map(d => ({
              date: d.timestamp_formated,
              id_dato: d.id_dato,
              volumen: parseFloat(d.volumen_valor)
            }))
          );
          setFlujoVolumenArr(
            data.map(d => ({
              date: d.timestamp_formated,
              id_dato: d.id_dato,
              flujo: parseFloat(d.flujo_valor),
              volumen: parseFloat(d.volumen_valor)
            }))
          );
          setPresionArr(
            data.map(d => ({
              date: d.timestamp_formated,
              id_dato: d.id_dato,
              presion: parseFloat(d.presion_valor)
            }))
          );
          setTemperaturaArr(
            data.map(d => ({
              date: d.timestamp_formated,
              id_dato: d.id_dato,
              temperatura: parseFloat(d.temperatura_valor)
            }))
          );
          setPm25Arr(
            data.map(d => ({
              date: d.timestamp_formated,
              id_dato: d.id_dato,
              pm25: parseFloat(d["pm2.5_valor"])
            }))
          );
          setPm10Arr(
            data.map(d => ({
              date: d.timestamp_formated,
              id_dato: d.id_dato,
              pm10: parseFloat(d.pm10_valor)
            }))
          );
          setBateriaArr(
            data.map(d => ({
              date: d.timestamp_formated,
              id_dato: d.id_dato,
              bateria: parseFloat(d.bateria_valor)
            }))
          );
          setVelocidadArr(
            data.map(d => ({
              date: d.timestamp_formated,
              id_dato: d.id_dato,
              velocidad: parseFloat(d.velocidad_valor)
            }))
          );
          setDireccionArr(
            data.map(d => ({
              date: d.timestamp_formated,
              id_dato: d.id_dato,
              grados: parseFloat(d.direccion_valor)
            }))
          );
        })
        .catch(err => {
          console.error("No se pudo cargar los datos de la API:", err);
          setDatos(null);
        });
    }
  }, [sesionsData]);




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

  // Opciones de gráficos
  const chartOptions = [
    { key: "flujoVolumen", label: "Flujo / Volumen", data: flujoVolumenArr },
    { key: "pm2_5", label: "MP 2.5 (µg/m³)", data: pm25Arr },
    { key: "pm10", label: "MP 10 (µg/m³)", data: pm10Arr },
    { key: "temperatura", label: "Temperatura (°C)", data: temperaturaArr },
    { key: "humedad", label: "Humedad (%)", data: humedadArr },
    { key: "presion", label: "Presión (hPa)", data: presionArr },
    { key: "viento", label: "Viento", data: direccionArr },
  ];

  // Encuentra la opción seleccionada
  const selectedOption = chartOptions.find(opt => opt.key === selectedChart);

  // Función wrapper para manejar el estado de loading del PDF
  const handleGeneratePDF = async () => {
    setGeneratingPDF(true);
    try {
      await generatePDFReport({
        patente,
        datos,
        avgFlow,
        minFlow,
        maxFlow,
        lastVolume,
        minVolume,
        maxVolume,
        promedioTemperatura,
        minTemperatura,
        maxTemperatura,
        promedioHumedad,
        minHumedad,
        maxHumedad,
        promedioPresion,
        minPressure,
        maxPressure,
        promedioPM25,
        minPM25,
        maxPM25,
        promedioPM10,
        minPM10,
        maxPM10,
        setSelectedChart
      });
    } catch (error) {
      console.error('Error generando PDF:', error);
      alert('Error al generar el reporte PDF. Por favor, intente nuevamente.');
    } finally {
      setGeneratingPDF(false);
    }
  };

  // Función para generar el PDF
  // const generatePDFReport = async () => {
  //   const pdf = new jsPDF('p', 'mm', 'a4');
  //   const pageWidth = pdf.internal.pageSize.getWidth();
  //   const pageHeight = pdf.internal.pageSize.getHeight();
  //   let yPosition = 20;

  //   // Título del reporte
  //   pdf.setFontSize(18);
  //   pdf.text('Reporte Histórico EOLO', pageWidth / 2, yPosition, { align: 'center' });
  //   yPosition += 15;

  //   // Información del dispositivo
  //   pdf.setFontSize(12);
  //   pdf.text(`Dispositivo: ${patente || 'N/A'}`, 20, yPosition);
  //   yPosition += 8;
  //   pdf.text(`Tipo de reporte: Dashboard Histórico (Todas las sesiones)`, 20, yPosition);
  //   yPosition += 8;
  //   pdf.text(`Total de mediciones: ${datos?.length || 0}`, 20, yPosition);
  //   yPosition += 15;

  //   // Resumen estadístico
  //   pdf.setFontSize(14);
  //   pdf.text('Resumen Estadístico General', 20, yPosition);
  //   yPosition += 10;

  //   pdf.setFontSize(10);
  //   const estadisticas = [
  //     [`Flujo Promedio: ${avgFlow || 'N/A'} l/min`, `Min: ${minFlow || 'N/A'}`, `Max: ${maxFlow || 'N/A'}`],
  //     [`Volumen Final: ${lastVolume || 'N/A'} m³`, `Min: ${minVolume || 'N/A'}`, `Max: ${maxVolume || 'N/A'}`],
  //     [`Temperatura Prom.: ${promedioTemperatura || 'N/A'} °C`, `Min: ${minTemperatura || 'N/A'}`, `Max: ${maxTemperatura || 'N/A'}`],
  //     [`Humedad Prom.: ${promedioHumedad || 'N/A'} %`, `Min: ${minHumedad || 'N/A'}`, `Max: ${maxHumedad || 'N/A'}`],
  //     [`Presión Prom.: ${promedioPresion || 'N/A'} hPa`, `Min: ${minPressure || 'N/A'}`, `Max: ${maxPressure || 'N/A'}`],
  //     [`MP 2.5 Prom.: ${promedioPM25 || 'N/A'} µg/m³`, `Min: ${minPM25 || 'N/A'}`, `Max: ${maxPM25 || 'N/A'}`],
  //     [`MP 10 Prom.: ${promedioPM10 || 'N/A'} µg/m³`, `Min: ${minPM10 || 'N/A'}`, `Max: ${maxPM10 || 'N/A'}`]
  //   ];

  //   estadisticas.forEach(stat => {
  //     pdf.text(stat[0], 20, yPosition);
  //     pdf.text(stat[1], 80, yPosition);
  //     pdf.text(stat[2], 140, yPosition);
  //     yPosition += 6;
  //   });

  //   yPosition += 10;

  //   // Capturar gráficos
  //   const graficos = [
  //     { key: 'flujoVolumen', titulo: 'Flujo / Volumen' },
  //     { key: 'temperatura', titulo: 'Temperatura' },
  //     { key: 'humedad', titulo: 'Humedad' },
  //     { key: 'presion', titulo: 'Presión' },
  //     { key: 'pm2_5', titulo: 'MP 2.5' },
  //     { key: 'pm10', titulo: 'MP 10' },
  //     { key: 'viento', titulo: 'Viento' }
  //   ];

  //   for (const grafico of graficos) {
  //     // Cambiar al gráfico
  //     setSelectedChart(grafico.key);

  //     // Esperar un momento para que se renderice
  //     await new Promise(resolve => setTimeout(resolve, 1000));

  //     // Buscar el elemento del gráfico
  //     const chartElement = document.querySelector('.recharts-wrapper') ||
  //       document.querySelector('canvas') ||
  //       document.querySelector('.card:not([style*="display: none"]) .recharts-wrapper');

  //     if (chartElement) {
  //       try {
  //         const canvas = await html2canvas(chartElement, {
  //           scale: 1,
  //           useCORS: true,
  //           allowTaint: true,
  //           backgroundColor: '#ffffff'
  //         });

  //         const imgData = canvas.toDataURL('image/png');
  //         const imgWidth = pageWidth - 40;
  //         const imgHeight = (canvas.height * imgWidth) / canvas.width;

  //         // Nueva página si es necesario
  //         if (yPosition + imgHeight > pageHeight - 20) {
  //           pdf.addPage();
  //           yPosition = 20;
  //         }

  //         pdf.setFontSize(12);
  //         pdf.text(grafico.titulo, 20, yPosition);
  //         yPosition += 10;

  //         pdf.addImage(imgData, 'PNG', 20, yPosition, imgWidth, imgHeight);
  //         yPosition += imgHeight + 15;

  //       } catch (error) {
  //         console.error(`Error capturando gráfico ${grafico.titulo}:`, error);
  //       }
  //     }
  //   }

  //   // Guardar el PDF
  //   pdf.save(`reporte_historico_${patente || 'datos'}.pdf`);

  //   // Volver al gráfico original
  //   setSelectedChart("flujoVolumen");
  // };

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
              <h2 className="mb-0">Dashboard Histórico - {patente}</h2>
              <div>
                <button
                  className="btn btn-dark mx-1"
                  onClick={() => window.open(`${import.meta.env.VITE_REACT_APP_API_URL}/datos?patente=${patente}&formato=xlsx`, '_blank')}
                >
                  <small>Descargar Datos</small>
                </button>
                <button
                  className="btn btn-danger mx-1"
                  onClick={handleGeneratePDF}
                  disabled={generatingPDF}
                >
                  {generatingPDF ? (
                    <>
                      <div className="spinner-border spinner-border-sm me-2" role="status">
                        <span className="visually-hidden">Generando...</span>
                      </div>
                      <small>Generando PDF...</small>
                    </>
                  ) : (
                    <small>Descargar PDF</small>
                  )}
                </button>
              </div>
            </div>
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
                      onClick={() => setSelectedChart(opt.key)}
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
                <div className=" col-12 col-md-12 mb-2">
                  <div className="card" style={{ display: selectedChart === "flujo" ? "block" : "none" }}>
                    <ChartComponent title="Flujo (l/min)" datos={flujoArr} />
                  </div>
                  <div className="card" style={{ display: selectedChart === "volumen" ? "block" : "none" }}>
                    <ChartComponent title="Volumen (m³)" datos={volumenArr} />
                  </div>
                  <div className="card" style={{ display: selectedChart === "flujoVolumen" ? "block" : "none" }}>
                    <BiAxialLineChartComponent datos={flujoVolumenArr} lineDataKeyOne={"flujo"} lineDataKeyTwo={"volumen"} title="Flujo (l/min) / Volumen (m³)" />
                  </div>
                  <div className="card" style={{ display: selectedChart === "pm2_5" ? "block" : "none" }}>
                    <ChartComponent title="MP 2.5 (µg/m³)" datos={pm25Arr} />
                  </div>
                  <div className="card" style={{ display: selectedChart === "pm10" ? "block" : "none" }}>
                    <ChartComponent title="MP 10 (µg/m³)" datos={pm10Arr} />
                  </div>
                  <div className="card" style={{ display: selectedChart === "temperatura" ? "block" : "none" }}>
                    <ChartComponent title="Temperatura (°C)" datos={temperaturaArr} />
                  </div>
                  <div className="card" style={{ display: selectedChart === "humedad" ? "block" : "none" }}>
                    <ChartComponent title="Humedad Ambiental Relativa (%)" datos={humedadArr} />
                  </div>
                  <div className="card" style={{ display: selectedChart === "presion" ? "block" : "none" }}>
                    <ChartComponent title="Presión (hPa)" datos={presionArr} />
                  </div>
                  <div className="" style={{ display: selectedChart === "viento" ? "block" : "none" }}>
                    <Anemografo title="Viento" promedio={promedioDireccion} datosVelocidad={velocidadArr} promedioVelocidad={promedioVelocidad} datos={direccionArr} />
                  </div>
                </div>
              </div>

            </div>
          )}
        </div>


      </div>
    </>
  );
};
