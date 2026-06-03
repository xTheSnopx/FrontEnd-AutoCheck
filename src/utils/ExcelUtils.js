import * as XLSX from 'xlsx';

export const exportToExcel = (data, fileName = 'datos-exportados') => {
  // Crear libro de trabajo
  const worksheet = XLSX.utils.json_to_sheet(data);

  // Ajustar ancho de columnas
  const columnWidths = [
    { wch: 20 }, // nombre
    { wch: 25 }, // email
    { wch: 15 }, // telefono
    { wch: 20 }, // empresa
    { wch: 25 }, // asunto
    { wch: 40 }, // mensaje
    { wch: 15 }, // fecha
  ];
  worksheet['!cols'] = columnWidths;

  // Crear estilos para el encabezado
  const headerStyle = {
    font: { bold: true, color: { rgb: 'FFFFFF' } },
    fill: { fgColor: { rgb: '4472C4' } },
    alignment: { horizontal: 'center', vertical: 'center' },
    border: {
      top: { style: 'thin', color: { rgb: '000000' } },
      bottom: { style: 'thin', color: { rgb: '000000' } },
      left: { style: 'thin', color: { rgb: '000000' } },
      right: { style: 'thin', color: { rgb: '000000' } },
    },
  };

  // Aplicar estilos al encabezado
  for (let col = 0; col < 7; col++) {
    const cellAddress = XLSX.utils.encode_cell({ r: 0, c: col });
    if (worksheet[cellAddress]) {
      worksheet[cellAddress].s = headerStyle;
    }
  }

  // Crear libro
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Formularios');

  // Generar nombre de archivo con fecha
  const timestamp = new Date().toISOString().slice(0, 10);
  const finalFileName = `${fileName}_${timestamp}.xlsx`;

  // Descargar archivo
  XLSX.writeFile(workbook, finalFileName);
};

export const importFromExcel = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { type: 'array' });
        const worksheet = workbook.Sheets[workbook.SheetNames[0]];
        const jsonData = XLSX.utils.sheet_to_json(worksheet);
        resolve(jsonData);
      } catch (error) {
        reject(new Error('Error al leer el archivo: ' + error.message));
      }
    };

    reader.onerror = (error) => {
      reject(new Error('Error al procesar el archivo: ' + error));
    };

    reader.readAsArrayBuffer(file);
  });
};
