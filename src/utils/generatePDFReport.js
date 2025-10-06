import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

// Función para generar el PDF
export const generatePDFReport = async (sesionData, estadisticas) => {
  const pdf = new jsPDF('p', 'mm', 'a4');
  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();
  let yPosition = 20;

  // Título del reporte
  pdf.setFontSize(18);
  pdf.text('Reporte de Sesión', pageWidth / 2, yPosition, { align: 'center' });
  yPosition += 15;

  // Información de la sesión
  pdf.setFontSize(12);
  pdf.text(`Patente: ${sesionData[0]?.patente || 'N/A'}`, 20, yPosition);
  yPosition += 8;
  pdf.text(`Ubicación: ${sesionData[0]?.ubicacion_corto || 'N/A'}`, 20, yPosition);
  yPosition += 8;
  pdf.text(`Inicio: ${sesionData[0]?.timestamp_inicial || 'N/A'}`, 20, yPosition);
  yPosition += 8;
  pdf.text(`Fin: ${sesionData[0]?.timestamp_final || 'N/A'}`, 20, yPosition);
  yPosition += 15;

  // Resumen estadístico
  pdf.setFontSize(14);
  pdf.text('Resumen Estadístico', 20, yPosition);
  yPosition += 10;

  pdf.setFontSize(10);
  

  estadisticas.forEach(stat => {
    pdf.text(stat[0], 20, yPosition);
    pdf.text(stat[1], 80, yPosition);
    pdf.text(stat[2], 140, yPosition);
    yPosition += 6;
  });

  // Capturar gráficos
  const graficos = [
    { key: 'flujoVolumen', titulo: 'Flujo / Volumen' },
    { key: 'temperatura', titulo: 'Temperatura' },
    { key: 'humedad', titulo: 'Humedad' },
    { key: 'presion', titulo: 'Presión' },
    { key: 'pm2_5', titulo: 'MP 2.5' },
    { key: 'pm10', titulo: 'MP 10' }
  ];

  for (const grafico of graficos) {
    // Cambiar al gráfico
    setSelectedChart(grafico.key);
    
    // Esperar un momento para que se renderice
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Buscar el elemento del gráfico
    const chartElement = document.querySelector('.recharts-wrapper') || 
                        document.querySelector('canvas') || 
                        document.querySelector('.card:not([style*="display: none"])');
    
    if (chartElement) {
      try {
        const canvas = await html2canvas(chartElement, {
          scale: 1,
          useCORS: true,
          allowTaint: true
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
  pdf.save(`reporte_sesion_${idSesion || 'datos'}.pdf`);
  
  // Volver al gráfico original
  setSelectedChart("mapa");
};