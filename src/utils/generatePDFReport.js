import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

export const generatePDFReport = async ({
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
}) => {
  const pdf = new jsPDF('p', 'mm', 'a4');
  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();
  let yPosition = 20;

  pdf.setFontSize(18);
  pdf.text('Reporte Histórico EOLO', pageWidth / 2, yPosition, { align: 'center' });
  yPosition += 15;

  pdf.setFontSize(12);
  pdf.text(`Dispositivo: ${patente || 'N/A'}`, 20, yPosition);
  yPosition += 8;
  pdf.text(`Tipo de reporte: Dashboard Histórico (Todas las sesiones)`, 20, yPosition);
  yPosition += 8;
  pdf.text(`Total de mediciones: ${datos?.length || 0}`, 20, yPosition);
  yPosition += 15;

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
  setSelectedChart(grafico.key);
  await new Promise(resolve => setTimeout(resolve, 2000));
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

  pdf.save(`reporte_historico_${patente || 'datos'}.pdf`);
  setSelectedChart("flujoVolumen");
};