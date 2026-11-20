const SPREADSHEET_ID = "1HhSGfCj4GYk2plcvaT_GyVToeDVo8k9Z3bH-UM5jiJ0";
const TARGET_SHEET_ID = 0;
const SHEET_NAME = "Ficha";
const SELLERS_SPREADSHEET_ID = "1gmvf8m1c68RnAleHpylar_9MELeLHVAX_VlU40nNAms";
const SELLERS_SHEET_ID = 0;
const FOLLOW_UP_FIELDS = [
  { header: "NOTA DE AUTORIZACIÓN", parameter: "notaAutorizacion" },
  { header: "RELEVAMIENTO TÉCNICA", parameter: "relevamientoTecnica" },
  { header: "INSTALACIÓN DE CAJA", parameter: "instalacionCaja" },
  { header: "PERMISOS ACCIONES", parameter: "permisosAcciones" },
  { header: "ACCIONES COMERCIALES", parameter: "accionesComerciales" },
  { header: "VENTAS", parameter: "ventas" }
];
const FOLLOW_UP_HEADERS = FOLLOW_UP_FIELDS.map(function (field) {
  return field.header;
});
const FOLLOW_UP_DATE_HEADERS = FOLLOW_UP_FIELDS.map(function (field) {
  return field.header + " - FECHA MODIFICACION";
});
const VISIT_COUNT_HEADER = "CANT VISITAS";
const EDIT_EXTRA_HEADERS = ["ACRONIMO", "TEXTO ACRONIMO", "FECHA PROXIMA VISITA"];
const MANAGEMENT_HEADER = "GESTION REALIZADA";
const EDIT_OBSERVATIONS_HEADER = "OBSERVACIONES EDICION";
const MANAGEMENT_OPTIONS = [
  "Relevamiento inicial",
  "Se habló con encargado/ administración",
  "Se dejó información comercial",
  "Se verificó infraestructura",
  "Se verificó competencia",
  "Se coordinó próxima reunión",
  "No se pudo contactar a nadie",
  "Se solicitó datos de contacto"
];
const PROJECT_TYPES = [
  "Edificio premium pendiente de acometimiento",
  "Edificio sin acometer",
  "Edificio acometido con puertos libres",
  "Edificio pequeño sin administración",
  "Edificio nuevo/ en construcción",
  "Proyecto especial",
  "Barrio privado",
  "Country",
  "Condominio"
];
const COMPETITION_PROMOTIONS = [
  "Sin bonificación",
  "200 MB por 100.000 guaranies mensuales",
  "200 MB por 110.000 guaranies mensuales",
  "Sin especificar"
];
const PROJECT_HEADERS = ["TIPO DE PROYECTO", "PROMOCION DE LA COMPETENCIA"];
const HEADERS = [
  "FECHA",
  "VENDEDOR",
  "NOMBRE EDIFICIO",
  "TIPO DE PROYECTO",
  "CALLE",
  "ALTURA",
  "GOOGLE MAPS",
  "LATITUD",
  "LONGITUD",
  "TORRES",
  "PISOS",
  "DEPTOS",
  "ADMINISTRADOR",
  "CARGO",
  "TELEFONO",
  "CORREO",
  "PRESENCIA DE COMPETENCIA",
  "EMPRESA",
  "PROMOCION DE LA COMPETENCIA",
  "OBSERVACIONES",
  "CABLEADO",
  "PUNTO BONIFICADO?",
  "PISO CAJA",
  "PUERTOS LIBRES",
  ...EDIT_EXTRA_HEADERS,
  ...FOLLOW_UP_HEADERS,
  ...FOLLOW_UP_DATE_HEADERS,
  VISIT_COUNT_HEADER,
  "ID",
  MANAGEMENT_HEADER,
  EDIT_OBSERVATIONS_HEADER
];
const HEADERS_WITHOUT_EDIT_OBSERVATIONS = HEADERS.filter(function (header) {
  return header !== EDIT_OBSERVATIONS_HEADER;
});
const HEADERS_WITHOUT_MANAGEMENT = HEADERS_WITHOUT_EDIT_OBSERVATIONS.filter(function (header) {
  return header !== MANAGEMENT_HEADER;
});
const HEADERS_WITHOUT_FOLLOW_UP_DATES = HEADERS_WITHOUT_MANAGEMENT.filter(function (header) {
  return FOLLOW_UP_DATE_HEADERS.indexOf(header) === -1;
});
const HEADERS_WITHOUT_PROJECT_FIELDS = HEADERS_WITHOUT_FOLLOW_UP_DATES.filter(function (header) {
  return PROJECT_HEADERS.indexOf(header) === -1;
});
const HEADERS_WITHOUT_EDIT_EXTRAS = HEADERS_WITHOUT_PROJECT_FIELDS.filter(function (header) {
  return EDIT_EXTRA_HEADERS.indexOf(header) === -1;
});
const HEADERS_WITHOUT_VISIT_COUNT = HEADERS_WITHOUT_EDIT_EXTRAS.filter(function (header) {
  return header !== VISIT_COUNT_HEADER;
});
const HEADERS_WITHOUT_FOLLOW_UP = HEADERS_WITHOUT_VISIT_COUNT.filter(function (header) {
  return FOLLOW_UP_HEADERS.indexOf(header) === -1;
});
const HEADERS_WITHOUT_BONUS = HEADERS_WITHOUT_FOLLOW_UP.filter(function (header) {
  return header !== "PUNTO BONIFICADO?";
});
const PREVIOUS_HEADERS = HEADERS_WITHOUT_BONUS.filter(function (header) {
  return header !== "CARGO";
});
const LEGACY_SCHEMAS = [
  [
    "FECHA",
    "VENDEDOR",
    "NOMBRE EDIFICIO",
    "CALLE",
    "ALTURA",
    "GOOGLE MAPS",
    "LATITUD",
    "LONGITUD",
    "TORRES",
    "PISOS",
    "DEPTOS",
    "ADMINISTRADOR",
    "TELEFONO",
    "CORREO",
    "PRESENCIA DE COMPETENCIA",
    "EMPRESA",
    "OBSERVACIONES",
    "ID"
  ],
  [
    "FECHA",
    "VENDEDOR",
    "CALLE",
    "ALTURA",
    "GOOGLE MAPS",
    "LATITUD",
    "LONGITUD",
    "TORRES",
    "PISOS",
    "DEPTOS",
    "ADMINISTRADOR",
    "TELEFONO",
    "CORREO",
    "PRESENCIA DE COMPETENCIA",
    "OBSERVACIONES",
    "ID"
  ],
  [
    "FECHA",
    "VENDEDOR",
    "NOMBRE",
    "CALLE",
    "ALTURA",
    "LATITUD",
    "LONGITUD",
    "TORRES",
    "PISOS",
    "DPTOS",
    "ADMINISTRADOR",
    "TELEFONO",
    "CORREO",
    "PRESENCIA DE COMPETENCIA",
    "EMPRESA",
    "CABLEADO",
    "EN QUÉ PISO LA CAJA",
    "PUERTOS LIBRES?",
    "CANT VISITAS",
    "ULTIMO REGISTRO",
    "OBSERVACIONES"
  ],
  ["FECHA", "VENDEDOR", "NOMBRE", "DIRECCION"],
  ["FECHA", "VENDEDOR", "NOMBRE", "DIRECCION", "ID"]
];

function doPost(event) {
  const parameters = event && event.parameter ? event.parameter : {};
  if (parameters.action === "consulta") {
    return saveConsulta(parameters);
  }
  if (parameters.action === "editarEdificio") {
    return updateEdificio(parameters);
  }
  return saveEdificioNuevo(parameters);
}

function doGet(event) {
  const parameters = event && event.parameter ? event.parameter : {};
  if (parameters.action === "obtenerVendedores") {
    return getSellers();
  }
  if (parameters.action === "buscarEdificios") {
    return searchBuildings(parameters);
  }
  if (parameters.action === "obtenerEdificio") {
    return getBuildingForEdit(parameters);
  }
  if (parameters.action === "obtenerFichaTecnica") {
    return getBuildingTechnicalSheet(parameters);
  }
  return submitResponse(false, "Acción GET no válida.", "consulta-search", []);
}

function readSellers() {
  const spreadsheet = SpreadsheetApp.openById(SELLERS_SPREADSHEET_ID);
  const sheet = spreadsheet.getSheets().find(function (candidate) {
    return candidate.getSheetId() === SELLERS_SHEET_ID;
  });
  if (!sheet || sheet.getLastRow() < 2) {
    throw new Error("No hay vendedores disponibles en la planilla.");
  }
  if (sheet.getRange(1, 1).getDisplayValue().trim().toLowerCase() !== "vendedor") {
    throw new Error("La columna A debe tener el encabezado Vendedor.");
  }
  const sellers = sheet.getRange(2, 1, sheet.getLastRow() - 1, 1).getDisplayValues()
    .map(function (row) { return row[0].trim(); })
    .filter(Boolean);
  const uniqueSellers = Array.from(new Set(sellers));
  if (!uniqueSellers.length) {
    throw new Error("No hay vendedores disponibles en la planilla.");
  }
  return uniqueSellers;
}

function getSellers() {
  try {
    return submitResponse(true, "Vendedores cargados.", "edificio-sellers", readSellers());
  } catch (error) {
    console.error(error);
    return submitResponse(false, "No se pudieron cargar los vendedores. Revisá los permisos de la planilla.", "edificio-sellers", []);
  }
}

function findBuildingRow(sheet, id) {
  const lastRow = sheet.getLastRow();
  if (lastRow < 2) {
    return -1;
  }

  const idColumn = HEADERS.indexOf("ID") + 1;
  return sheet.getRange(2, idColumn, lastRow - 1, 1).getDisplayValues()
    .map(function (row) { return row[0].trim(); })
    .indexOf(id);
}

function normalizeVisitSearchDate(value, timeZone) {
  if (value instanceof Date) {
    return Number.isFinite(value.getTime())
      ? Utilities.formatDate(value, timeZone, "yyyy-MM-dd") : "";
  }
  const text = String(value || "").trim();
  const localDate = /^(\d{1,2})\/(\d{1,2})\/(\d{4})$/.exec(text);
  const isoDate = localDate
    ? localDate[3] + "-" + localDate[2].padStart(2, "0") + "-" + localDate[1].padStart(2, "0")
    : text;
  if (!/^\d{4}-\d{2}-\d{2}$/.test(isoDate)) return "";
  const date = new Date(isoDate + "T00:00:00Z");
  return Number.isFinite(date.getTime()) && date.toISOString().slice(0, 10) === isoDate
    ? isoDate : "";
}

function searchBuildings(parameters) {
  const criterion = String(parameters.criterio || "").trim();
  const query = String(parameters.busqueda || "").trim().toLowerCase();
  const isVisitSearch = criterion === "fechaProximaVisita";
  if (!["nombre", "direccion", "fechaProximaVisita"].includes(criterion) || !query) {
    return submitResponse(false, "Sin visitas programadas.", "consulta-search", []);
  }
  if (isVisitSearch && (!/^\d{4}-\d{2}-\d{2}$/.test(query) || normalizeVisitSearchDate(query) !== query)) {
    return submitResponse(false, "Seleccioná una fecha válida para buscar próximas visitas.", "consulta-search", []);
  }

  const lock = LockService.getScriptLock();
  try {
    lock.waitLock(30000);
    const spreadsheet = SpreadsheetApp.openById(SPREADSHEET_ID);
    const sheet = ensureSheetSchema(spreadsheet);
    const lastRow = sheet.getLastRow();
    const rows = lastRow >= 2
      ? sheet.getRange(2, 1, lastRow - 1, HEADERS.length).getDisplayValues()
      : [];
    const nameColumn = HEADERS.indexOf("NOMBRE EDIFICIO");
    const streetColumn = HEADERS.indexOf("CALLE");
    const heightColumn = HEADERS.indexOf("ALTURA");
    const towersColumn = HEADERS.indexOf("TORRES");
    const floorsColumn = HEADERS.indexOf("PISOS");
    const lotsColumn = HEADERS.indexOf("DEPTOS");
    const idColumn = HEADERS.indexOf("ID");
    const visitColumn = HEADERS.indexOf("FECHA PROXIMA VISITA");
    const visitDates = isVisitSearch && rows.length
      ? sheet.getRange(2, visitColumn + 1, rows.length, 1).getValues() : [];
    const timeZone = isVisitSearch ? spreadsheet.getSpreadsheetTimeZone() : "";
    const matches = rows.reduce(function (results, row, rowIndex) {
      const nombre = row[nameColumn].trim();
      const direccion = [row[streetColumn].trim(), row[heightColumn].trim()]
        .filter(Boolean)
        .join(" ");
      const id = row[idColumn].trim();
      const value = criterion === "nombre" ? nombre : direccion;
      const matchesQuery = isVisitSearch
        ? normalizeVisitSearchDate(visitDates[rowIndex][0], timeZone) === query
        : value.toLowerCase().includes(query);
      if (id && matchesQuery) {
        const result = {
          id: id,
          nombre: nombre,
          direccion: direccion,
          torres: row[towersColumn].trim(),
          pisos: row[floorsColumn].trim(),
          deptos: row[lotsColumn].trim(),
          lotes: row[lotsColumn].trim(),
          fechaProximaVisita: row[HEADERS.indexOf("FECHA PROXIMA VISITA")].trim()
        };
        const contactColumns = ["ADMINISTRADOR", "CARGO", "TELEFONO", "CORREO"].map(function (header) {
          return getContactValues(row[HEADERS.indexOf(header)]);
        });
        result.contactos = Array.from({ length: Math.max.apply(null, contactColumns.map(function (values) {
          return values.length;
        })) }, function (_, index) {
          return {
            nombre: contactColumns[0][index] || "",
            cargo: contactColumns[1][index] || "",
            telefono: contactColumns[2][index] || "",
            correo: contactColumns[3][index] || ""
          };
        }).filter(function (contact) {
          return contact.nombre || contact.cargo || contact.telefono || contact.correo;
        });
        FOLLOW_UP_FIELDS.forEach(function (field) {
          result[field.parameter] = row[HEADERS.indexOf(field.header)].trim();
        });
        results.push(result);
      }
      return results;
    }, []);
    const message = matches.length
      ? "Se encontraron " + matches.length + " coincidencias."
      : (isVisitSearch ? "Sin visitas programadas." : "No se encontraron edificios.");

    return submitResponse(true, message, "consulta-search", matches);
  } catch (error) {
    console.error(error);
    return submitResponse(false, "No se pudo buscar en la planilla.", "consulta-search", []);
  } finally {
    if (lock.hasLock()) {
      lock.releaseLock();
    }
  }
}

function getBuildingForEdit(parameters) {
  const id = String(parameters.idEdificio || "").trim();
  if (!id) {
    return submitResponse(false, "Falta el ID del edificio.", "edificio-edit-load", [], null);
  }

  const lock = LockService.getScriptLock();
  try {
    lock.waitLock(30000);
    const spreadsheet = SpreadsheetApp.openById(SPREADSHEET_ID);
    const sheet = ensureSheetSchema(spreadsheet);
    const matchingIndex = findBuildingRow(sheet, id);
    if (matchingIndex === -1) {
      return submitResponse(false, "No se encontró un edificio con ese ID.", "edificio-edit-load", [], null);
    }

    const rowNumber = matchingIndex + 2;
    const row = sheet.getRange(rowNumber, 1, 1, HEADERS.length).getDisplayValues()[0];
    function getValue(header) {
      return row[HEADERS.indexOf(header)].trim();
    }
    const nextVisitDate = sheet.getRange(rowNumber, HEADERS.indexOf("FECHA PROXIMA VISITA") + 1).getValue();
    const record = {
      id: id,
      nombreEdificio: getValue("NOMBRE EDIFICIO"),
      tipoProyecto: getValue("TIPO DE PROYECTO"),
      observacionesEdicion: getValue(EDIT_OBSERVATIONS_HEADER),
      cableado: getValue("CABLEADO"),
      puntoBonificado: getValue("PUNTO BONIFICADO?"),
      gestionRealizada: getValue(MANAGEMENT_HEADER),
      pisoCaja: getValue("PISO CAJA"),
      puertosLibres: getValue("PUERTOS LIBRES"),
      acronimo: getValue("ACRONIMO") || "Sin Verificar",
      acronimoTexto: getValue("TEXTO ACRONIMO"),
      fechaProximaVisita: nextVisitDate instanceof Date
        ? Utilities.formatDate(nextVisitDate, spreadsheet.getSpreadsheetTimeZone(), "yyyy-MM-dd")
        : getValue("FECHA PROXIMA VISITA")
    };

    return submitResponse(true, "Edificio cargado.", "edificio-edit-load", [], record);
  } catch (error) {
    console.error(error);
    return submitResponse(false, "No se pudo cargar el edificio.", "edificio-edit-load", [], null);
  } finally {
    if (lock.hasLock()) {
      lock.releaseLock();
    }
  }
}

function incrementBuildingVisit(sheet, rowNumber) {
  const visitCountColumn = HEADERS.indexOf(VISIT_COUNT_HEADER) + 1;
  const visitCountCell = sheet.getRange(rowNumber, visitCountColumn);
  const currentVisitCountValue = visitCountCell.getValue();
  const currentVisitCount = currentVisitCountValue === "" ? 0 : Number(currentVisitCountValue);
  if (!Number.isSafeInteger(currentVisitCount) ||
      currentVisitCount < 0 ||
      !Number.isSafeInteger(currentVisitCount + 1)) {
    throw new Error("El contador de visitas del edificio no es un entero no negativo válido.");
  }
  visitCountCell.setValue(currentVisitCount + 1);
}

function getBuildingTechnicalSheet(parameters) {
  const id = String(parameters.idEdificio || "").trim();
  if (!id) {
    return submitResponse(false, "Falta el ID del edificio.", "edificio-technical-sheet", [], null);
  }

  const lock = LockService.getScriptLock();
  try {
    lock.waitLock(30000);
    const spreadsheet = SpreadsheetApp.openById(SPREADSHEET_ID);
    const sheet = ensureSheetSchema(spreadsheet);
    const matchingIndex = findBuildingRow(sheet, id);
    if (matchingIndex === -1) {
      return submitResponse(false, "No se encontró un edificio con ese ID.", "edificio-technical-sheet", [], null);
    }

    const rowNumber = matchingIndex + 2;

    const row = sheet.getRange(rowNumber, 1, 1, HEADERS.length).getDisplayValues()[0];
    function getValue(header) {
      return row[HEADERS.indexOf(header)].trim();
    }
    const latitude = getValue("LATITUD");
    const longitude = getValue("LONGITUD");
    const record = {
      fecha: getValue("FECHA"),
      vendedor: getValue("VENDEDOR"),
      nombreEdificio: getValue("NOMBRE EDIFICIO"),
      tipoProyecto: getValue("TIPO DE PROYECTO"),
      direccion: [getValue("CALLE"), getValue("ALTURA")].filter(Boolean).join(" "),
      coordenadas: latitude && longitude ? latitude + ", " + longitude : "",
      googleMaps: getValue("GOOGLE MAPS"),
      torres: getValue("TORRES"),
      pisos: getValue("PISOS"),
      lotes: getValue("DEPTOS"),
      cantidadVisitas: getValue(VISIT_COUNT_HEADER) || "0",
      administrador: getValue("ADMINISTRADOR"),
      cargo: getValue("CARGO"),
      telefono: getValue("TELEFONO"),
      correo: getValue("CORREO"),
      presenciaCompetencia: getValue("PRESENCIA DE COMPETENCIA"),
      empresa: getValue("EMPRESA"),
      promocionCompetencia: getValue("PROMOCION DE LA COMPETENCIA"),
      cableado: getValue("CABLEADO"),
      puntoBonificado: getValue("PUNTO BONIFICADO?"),
      gestionRealizada: getValue(MANAGEMENT_HEADER),
      pisoCaja: getValue("PISO CAJA"),
      puertosLibres: getValue("PUERTOS LIBRES"),
      observaciones: getValue("OBSERVACIONES"),
      acronimo: getValue("ACRONIMO") || "Sin Verificar",
      acronimoTexto: getValue("TEXTO ACRONIMO"),
      observacionesEdicion: getValue(EDIT_OBSERVATIONS_HEADER)
    };
    const modificationDates = sheet.getRange(rowNumber, HEADERS.indexOf(FOLLOW_UP_DATE_HEADERS[0]) + 1,
      1, FOLLOW_UP_DATE_HEADERS.length).getValues()[0];
    FOLLOW_UP_FIELDS.forEach(function (field, index) {
      record[field.parameter] = getValue(field.header);
      const modifiedAt = modificationDates[index];
      record[field.parameter + "Modificado"] = modifiedAt instanceof Date
        ? Utilities.formatDate(modifiedAt, spreadsheet.getSpreadsheetTimeZone(), "dd/MM/yyyy HH:mm:ss")
        : String(modifiedAt || "");
    });

    return submitResponse(true, "Ficha técnica cargada.", "edificio-technical-sheet", [], record);
  } catch (error) {
    console.error(error);
    return submitResponse(false, "No se pudo cargar la ficha técnica.", "edificio-technical-sheet", [], null);
  } finally {
    if (lock.hasLock()) {
      lock.releaseLock();
    }
  }
}

function getBuildingData(parameters) {
  const vendedor = String(parameters.vendedor || "").trim();
  const nombreEdificio = String(parameters.nombreEdificio || "").trim();
  const calle = String(parameters.calle || "").trim();
  const altura = String(parameters.altura || "").trim();
  const googleMaps = String(parameters.googleMaps || "").trim();
  const coordinates = parseCoordinatePair(parameters.coordenadas);
  const latitud = coordinates.latitud;
  const longitud = coordinates.longitud;
  const torres = parseNonNegativeInteger(parameters.torres);
  const pisos = parseNonNegativeInteger(parameters.pisos);
  const deptos = parseNonNegativeInteger(parameters.deptos);
  const administrators = getContactValues(parameters.administrador);
  const cargos = getContactValues(parameters.cargo);
  const telephones = getContactValues(parameters.telefono);
  const emails = getContactValues(parameters.correo);
  const contactCount = Math.max(administrators.length, cargos.length, telephones.length, emails.length);
  [administrators, cargos, telephones, emails].forEach(function (values) {
    while (values.length < contactCount) {
      values.push("");
    }
  });
  const presenciaCompetencia = String(parameters.presenciaCompetencia || "").trim();
  const empresa = String(parameters.empresa || "").trim();
  const observaciones = String(parameters.observaciones || "").trim();

  return {
    vendedor: vendedor,
    nombreEdificio: nombreEdificio,
    tipoProyecto: String(parameters.tipoProyecto || "").trim(),
    calle: calle,
    altura: altura,
    googleMaps: googleMaps,
    latitud: latitud,
    longitud: longitud,
    torres: torres,
    pisos: pisos,
    deptos: deptos,
    administrador: administrators.join("\n"),
    cargo: cargos.join("\n"),
    telefono: telephones.join("\n"),
    correo: emails.join("\n"),
    cargos: cargos,
    emails: emails,
    presenciaCompetencia: presenciaCompetencia,
    empresa: empresa,
    promocionCompetencia: presenciaCompetencia === "Si" && empresa
      ? String(parameters.promocionCompetencia || "").trim() : "",
    observaciones: observaciones
  };
}

function validateBuildingData(building) {
  try {
    if (!readSellers().includes(building.vendedor)) {
      return "Seleccioná un vendedor vigente de la planilla.";
    }
  } catch (error) {
    console.error(error);
    return "No se pudo validar el vendedor. Revisá los permisos de la planilla e intentá nuevamente.";
  }
  if (!building.nombreEdificio ||
      !PROJECT_TYPES.includes(building.tipoProyecto) ||
      !building.calle ||
      !building.altura ||
      !["Si", "No"].includes(building.presenciaCompetencia) ||
      (building.presenciaCompetencia === "Si" && !["TIGO", "PERSONAL", "TIGO/PERSONAL"].includes(building.empresa)) ||
      (building.presenciaCompetencia === "Si" && !COMPETITION_PROMOTIONS.includes(building.promocionCompetencia)) ||
      (building.presenciaCompetencia === "No" && building.empresa) ||
      building.torres === null ||
      building.pisos === null ||
      building.deptos === null ||
      building.cargos.some(function (value) {
        return value && !["Encargado", "Portero", "Dueño", "Administrador", "Mantenimiento"].includes(value);
      }) ||
      Number.isNaN(building.latitud) ||
      Number.isNaN(building.longitud) ||
      (building.latitud === null) !== (building.longitud === null) ||
      (building.googleMaps && !/^https:\/\/www\.google\.com\/maps\//.test(building.googleMaps))) {
    return "Revisá los campos obligatorios y los valores numéricos.";
  }

  if (building.emails.some(function (value) {
    return value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
  })) {
    return "El correo electrónico no tiene un formato válido.";
  }

  return "";
}

function getTrackingData(parameters) {
  const cableado = String(parameters.cableado || "").trim();
  const puntoBonificado = String(parameters.puntoBonificado || "").trim();
  const pisoCaja = String(parameters.pisoCaja || "").trim();
  const puertosLibresInput = String(parameters.puertosLibres || "").trim();

  return {
    cableado: cableado,
    puntoBonificado: puntoBonificado,
    gestionRealizada: Array.from(new Set(String(parameters.gestionRealizada || "").split(/\r?\n/)
      .map(function (value) { return value.trim(); }).filter(Boolean))).join("\n"),
    pisoCaja: pisoCaja,
    puertosLibresInput: puertosLibresInput,
    acronimo: cableado === "Si" ? String(parameters.acronimo || "Sin Verificar").trim() : "Sin Verificar",
    acronimoTexto: cableado === "Si" && parameters.acronimo === "Si"
      ? String(parameters.acronimoTexto || "").trim() : "",
    fechaProximaVisita: String(parameters.fechaProximaVisita || "").trim(),
    puertosLibres: cableado === "Si" ? parseNonNegativeInteger(puertosLibresInput) : null
  };
}

function validateTrackingData(tracking) {
  if (tracking.gestionRealizada.split("\n").some(function (value) {
    return value && !MANAGEMENT_OPTIONS.includes(value);
  })) {
    return "Revisá las opciones de gestión realizada.";
  }
  if (!["Sin Verificar", "Si"].includes(tracking.acronimo) ||
      (tracking.acronimo === "Si" && !tracking.acronimoTexto)) {
    return "Revisá el acrónimo de la caja.";
  }
  if (tracking.acronimoTexto.length > 15) {
    return "El acrónimo de la caja debe tener como máximo 15 caracteres.";
  }
  if (tracking.fechaProximaVisita) {
    const date = new Date(tracking.fechaProximaVisita + "T00:00:00Z");
    if (!/^\d{4}-\d{2}-\d{2}$/.test(tracking.fechaProximaVisita) ||
        !Number.isFinite(date.getTime()) || date.toISOString().slice(0, 10) !== tracking.fechaProximaVisita) {
      return "Revisá la fecha de próxima visita.";
    }
  }
  if (!["Si", "No"].includes(tracking.cableado) ||
      !["Si", "No"].includes(tracking.puntoBonificado) ||
      (tracking.cableado === "Si" && (!tracking.pisoCaja || tracking.puertosLibres === null)) ||
      (tracking.cableado === "No" && (tracking.pisoCaja || tracking.puertosLibresInput))) {
    return "Revisá los datos de seguimiento.";
  }

  return "";
}

function saveEdificioNuevo(parameters) {
  const building = getBuildingData(parameters);
  const validationMessage = validateBuildingData(building);
  if (validationMessage) {
    return submitResponse(false, validationMessage);
  }

  const lock = LockService.getScriptLock();
  try {
    lock.waitLock(30000);
    const spreadsheet = SpreadsheetApp.openById(SPREADSHEET_ID);
    const sheet = ensureSheetSchema(spreadsheet);
    const id = createUniqueId(sheet);

    sheet.appendRow([
      new Date(),
      safeSheetText(building.vendedor),
      safeSheetText(building.nombreEdificio),
      building.tipoProyecto,
      safeSheetText(building.calle),
      safeSheetText(building.altura),
      safeSheetText(building.googleMaps),
      building.latitud === null ? "" : building.latitud,
      building.longitud === null ? "" : building.longitud,
      building.torres,
      building.pisos,
      building.deptos,
      safeSheetText(building.administrador),
      safeSheetText(building.cargo),
      safeSheetText(building.telefono),
      safeSheetText(building.correo),
      building.presenciaCompetencia,
      building.empresa,
      building.promocionCompetencia,
      safeSheetText(building.observaciones),
      "",
      "",
      "",
      "",
      "Sin Verificar",
      "",
      "",
      ...FOLLOW_UP_HEADERS.map(function () { return ""; }),
      ...FOLLOW_UP_DATE_HEADERS.map(function () { return ""; }),
      0,
      id,
      "",
      ""
    ]);

    return submitResponse(true, "Registro guardado. ID asignado: " + id);
  } catch (error) {
    console.error(error);
    return submitResponse(false, "No se pudo guardar el registro. Revisá los permisos y la configuración.");
  } finally {
    if (lock.hasLock()) {
      lock.releaseLock();
    }
  }
}

function updateEdificio(parameters) {
  const id = String(parameters.idEdificio || "").trim();
  const tracking = getTrackingData(parameters);
  const trackingValidationMessage = validateTrackingData(tracking);
  const observaciones = String(parameters.observacionesEdicion || "").trim();
  if (!id) {
    return submitResponse(false, "Falta el ID del edificio.");
  }
  if (trackingValidationMessage) {
    return submitResponse(false, trackingValidationMessage);
  }

  const lock = LockService.getScriptLock();
  try {
    lock.waitLock(30000);
    const spreadsheet = SpreadsheetApp.openById(SPREADSHEET_ID);
    const sheet = ensureSheetSchema(spreadsheet);
    const matchingIndex = findBuildingRow(sheet, id);
    if (matchingIndex === -1) {
      return submitResponse(false, "No se encontró un edificio con ese ID.");
    }

    const rowNumber = matchingIndex + 2;
    const observationsColumn = HEADERS.indexOf(EDIT_OBSERVATIONS_HEADER) + 1;
    const trackingColumn = HEADERS.indexOf("CABLEADO") + 1;
    const currentObservations = sheet.getRange(rowNumber, observationsColumn).getDisplayValue().trim();
    const managementColumn = HEADERS.indexOf(MANAGEMENT_HEADER) + 1;
    const currentManagement = sheet.getRange(rowNumber, managementColumn).getDisplayValue().trim();
    const currentTrackingValues = sheet.getRange(rowNumber, trackingColumn, 1, 7)
      .getDisplayValues()[0]
      .map(function (value) { return value.trim(); });
    const updatedTrackingValues = [
      tracking.cableado,
      tracking.puntoBonificado,
      tracking.pisoCaja,
      tracking.puertosLibres,
      tracking.acronimo,
      tracking.acronimoTexto,
      tracking.fechaProximaVisita
    ];
    const hasChanges = currentObservations !== observaciones || currentManagement !== tracking.gestionRealizada ||
      currentTrackingValues.some(function (value, index) {
        return value !== String(updatedTrackingValues[index] === null ? "" : updatedTrackingValues[index]).trim();
      });

    sheet.getRange(rowNumber, observationsColumn).setValue(safeSheetText(observaciones));
    sheet.getRange(rowNumber, managementColumn).setValue(safeSheetText(tracking.gestionRealizada));
    sheet.getRange(rowNumber, HEADERS.indexOf("FECHA PROXIMA VISITA") + 1).setNumberFormat("@");
    sheet.getRange(rowNumber, trackingColumn, 1, 7).setValues([[
      tracking.cableado,
      tracking.puntoBonificado,
      safeSheetText(tracking.pisoCaja),
      tracking.puertosLibres,
      tracking.acronimo,
      safeSheetText(tracking.acronimoTexto),
      tracking.fechaProximaVisita
    ]]);
    if (hasChanges) {
      incrementBuildingVisit(sheet, rowNumber);
    }

    return submitResponse(true, "Edificio actualizado. ID: " + id);
  } catch (error) {
    console.error(error);
    return submitResponse(false, "No se pudo actualizar el edificio.");
  } finally {
    if (lock.hasLock()) {
      lock.releaseLock();
    }
  }
}

function getContactValues(value) {
  return String(value === undefined || value === null ? "" : value)
    .split(/\r?\n/)
    .map(function (contactValue) { return contactValue.trim(); });
}

function saveConsulta(parameters) {
  const id = String(parameters.idEdificio || "").trim();
  const followUpValues = FOLLOW_UP_FIELDS.map(function (field) {
    return String(parameters[field.parameter] || "").trim();
  });

  if (!id || !followUpValues[0] ||
      followUpValues.some(function (value, index) {
        return !["", "Si", "No"].includes(value) ||
          (value !== "" && index > 0 && followUpValues[index - 1] === "");
      })) {
    return submitResponse(false, "Respondé la primera etapa y completá las siguientes en orden, sin saltar etapas.", "consulta-submit");
  }

  const lock = LockService.getScriptLock();
  try {
    lock.waitLock(30000);
    const spreadsheet = SpreadsheetApp.openById(SPREADSHEET_ID);
    const sheet = ensureSheetSchema(spreadsheet);
    const matchingIndex = findBuildingRow(sheet, id);
    if (matchingIndex === -1) {
      return submitResponse(false, "No se encontró un edificio con ese ID.", "consulta-submit");
    }

    const rowNumber = matchingIndex + 2;
    const firstFollowUpColumn = HEADERS.indexOf(FOLLOW_UP_HEADERS[0]) + 1;
    const currentFollowUpValues = sheet.getRange(rowNumber, firstFollowUpColumn, 1, followUpValues.length)
      .getDisplayValues()[0]
      .map(function (value) { return value.trim(); });
    const hasChanges = currentFollowUpValues.some(function (value, index) {
      return value !== followUpValues[index];
    });
    sheet.getRange(rowNumber, firstFollowUpColumn, 1, followUpValues.length)
      .setValues([followUpValues]);
    if (hasChanges) {
      const modifiedAt = new Date();
      currentFollowUpValues.forEach(function (value, index) {
        if (value !== followUpValues[index]) {
          sheet.getRange(rowNumber, HEADERS.indexOf(FOLLOW_UP_DATE_HEADERS[index]) + 1)
            .setValue(modifiedAt)
            .setNumberFormat("dd/MM/yyyy HH:mm:ss");
        }
      });
      incrementBuildingVisit(sheet, rowNumber);
    }

    return submitResponse(true, "Consulta guardada para el edificio " + id + ".", "consulta-submit");
  } catch (error) {
    console.error(error);
    return submitResponse(false, "No se pudo guardar la consulta. Revisá los permisos y la configuración.", "consulta-submit");
  } finally {
    if (lock.hasLock()) {
      lock.releaseLock();
    }
  }
}

function ensureSheetSchema(spreadsheet) {
  const sheet = spreadsheet.getSheets().find(function (candidate) {
    return candidate.getSheetId() === TARGET_SHEET_ID;
  });
  if (!sheet) {
    throw new Error("No se encontró la pestaña de destino gid=0.");
  }

  if (sheet.getName() !== SHEET_NAME) {
    const conflictingSheet = spreadsheet.getSheetByName(SHEET_NAME);
    if (conflictingSheet && conflictingSheet.getSheetId() !== TARGET_SHEET_ID) {
      conflictingSheet.setName(getArchiveSheetName(spreadsheet));
    }
    sheet.setName(SHEET_NAME);
  }

  const columnCount = sheet.getLastColumn();
  const currentHeaders = columnCount
    ? sheet.getRange(1, 1, 1, columnCount).getDisplayValues()[0]
      .map(function (header) { return header.trim().toUpperCase(); })
    : [];

  if (sameHeaders(currentHeaders, HEADERS)) {
    return sheet;
  }

  if (sameHeaders(currentHeaders, HEADERS_WITHOUT_EDIT_OBSERVATIONS)) {
    sheet.insertColumnAfter(currentHeaders.length);
    sheet.getRange(1, currentHeaders.length + 1).setValue(EDIT_OBSERVATIONS_HEADER);
    return sheet;
  }

  if (sameHeaders(currentHeaders, HEADERS_WITHOUT_MANAGEMENT)) {
    sheet.insertColumnAfter(currentHeaders.length);
    sheet.getRange(1, currentHeaders.length + 1).setValue(MANAGEMENT_HEADER);
    return ensureSheetSchema(spreadsheet);
  }

  if (!currentHeaders.length && sheet.getLastRow() === 0) {
    sheet.getRange(1, 1, 1, HEADERS.length).setValues([HEADERS]);
    return sheet;
  }

  if (sameHeaders(currentHeaders, HEADERS_WITHOUT_FOLLOW_UP_DATES)) {
    let insertionColumn = currentHeaders.indexOf(VISIT_COUNT_HEADER);
    FOLLOW_UP_DATE_HEADERS.forEach(function (header) {
      sheet.insertColumnAfter(insertionColumn);
      insertionColumn += 1;
      sheet.getRange(1, insertionColumn).setValue(header);
    });
    return ensureSheetSchema(spreadsheet);
  }

  if (sameHeaders(currentHeaders, HEADERS_WITHOUT_PROJECT_FIELDS)) {
    [
      { after: "NOMBRE EDIFICIO", header: "TIPO DE PROYECTO" },
      { after: "EMPRESA", header: "PROMOCION DE LA COMPETENCIA" }
    ].forEach(function (field) {
      const afterColumn = currentHeaders.indexOf(field.after) + 1;
      sheet.insertColumnAfter(afterColumn);
      sheet.getRange(1, afterColumn + 1).setValue(field.header);
      currentHeaders.splice(afterColumn, 0, field.header);
    });
    return ensureSheetSchema(spreadsheet);
  }

  if (sameHeaders(currentHeaders, HEADERS_WITHOUT_EDIT_EXTRAS)) {
    let insertionColumn = currentHeaders.indexOf("PUERTOS LIBRES") + 1;
    EDIT_EXTRA_HEADERS.forEach(function (header) {
      sheet.insertColumnAfter(insertionColumn);
      insertionColumn += 1;
      sheet.getRange(1, insertionColumn).setValue(header);
    });
    if (sheet.getLastRow() > 1) {
      sheet.getRange(2, HEADERS_WITHOUT_PROJECT_FIELDS.indexOf("ACRONIMO") + 1, sheet.getLastRow() - 1, 1)
        .setValue("Sin Verificar");
      sheet.getRange(2, HEADERS_WITHOUT_PROJECT_FIELDS.indexOf("FECHA PROXIMA VISITA") + 1, sheet.getLastRow() - 1, 1)
        .setNumberFormat("@");
    }
    return ensureSheetSchema(spreadsheet);
  }

  if (sameHeaders(currentHeaders, HEADERS_WITHOUT_VISIT_COUNT)) {
    const idColumn = currentHeaders.indexOf("ID") + 1;
    sheet.insertColumnBefore(idColumn);
    sheet.getRange(1, idColumn).setValue(VISIT_COUNT_HEADER);
    if (sheet.getLastRow() > 1) {
      sheet.getRange(2, idColumn, sheet.getLastRow() - 1, 1).setValue(0);
    }
    return ensureSheetSchema(spreadsheet);
  }

  if (sameHeaders(currentHeaders, PREVIOUS_HEADERS)) {
    const administratorColumn = currentHeaders.indexOf("ADMINISTRADOR") + 1;
    sheet.insertColumnAfter(administratorColumn);
    sheet.getRange(1, administratorColumn + 1).setValue("CARGO");
    currentHeaders.splice(administratorColumn, 0, "CARGO");
  }

  if (sameHeaders(currentHeaders, HEADERS_WITHOUT_BONUS)) {
    const cableadoColumn = currentHeaders.indexOf("CABLEADO") + 1;
    sheet.insertColumnAfter(cableadoColumn);
    sheet.getRange(1, cableadoColumn + 1).setValue("PUNTO BONIFICADO?");
    currentHeaders.splice(cableadoColumn, 0, "PUNTO BONIFICADO?");
  }

  if (sameHeaders(currentHeaders, HEADERS_WITHOUT_FOLLOW_UP)) {
    let idColumn = currentHeaders.indexOf("ID");
    FOLLOW_UP_HEADERS.forEach(function (header) {
      sheet.insertColumnAfter(idColumn);
      sheet.getRange(1, idColumn + 1).setValue(header);
      currentHeaders.splice(idColumn, 0, header);
      idColumn += 1;
    });
    sheet.insertColumnAfter(idColumn);
    sheet.getRange(1, idColumn + 1).setValue(VISIT_COUNT_HEADER);
    return ensureSheetSchema(spreadsheet);
  }

  const isLegacySchema = LEGACY_SCHEMAS.some(function (legacyHeaders) {
    return sameHeaders(currentHeaders, legacyHeaders);
  });
  if (!isLegacySchema) {
    throw new Error("La estructura actual de Ficha no coincide con la estructura anterior esperada.");
  }

  const archive = sheet.copyTo(spreadsheet);
  archive.setName(getArchiveSheetName(spreadsheet));
  sheet.clearContents();
  sheet.getRange(1, 1, 1, HEADERS.length).setValues([HEADERS]);
  spreadsheet.setActiveSheet(sheet);
  return sheet;
}

function getArchiveSheetName(spreadsheet) {
  const baseName = "Ficha_Anterior";
  let name = baseName;
  let suffix = 2;
  while (spreadsheet.getSheetByName(name)) {
    name = baseName + "_" + suffix;
    suffix += 1;
  }
  return name;
}

function sameHeaders(actual, expected) {
  return actual.length === expected.length &&
    actual.every(function (header, index) {
      return header === expected[index];
    });
}

function createUniqueId(sheet) {
  const lastRow = sheet.getLastRow();
  const existingIds = lastRow >= 2
    ? sheet.getRange(2, HEADERS.length, lastRow - 1, 1).getDisplayValues()
      .map(function (row) { return row[0].trim(); })
    : [];
  const numericIds = existingIds
    .filter(function (value) { return /^\d+$/.test(value); })
    .map(function (value) { return Number(value); })
    .filter(function (value) { return Number.isSafeInteger(value); });
  const maxId = numericIds.reduce(function (currentMax, value) {
    return Math.max(currentMax, value);
  }, 0);
  const nextId = maxId + 1;

  if (!Number.isSafeInteger(nextId)) {
    throw new Error("No se pudo asignar el siguiente ID numérico.");
  }

  return nextId;
}

function parseNonNegativeInteger(value) {
  const text = String(value === undefined || value === null ? "" : value).trim();
  if (!/^\d+$/.test(text)) {
    return null;
  }

  const number = Number(text);
  return Number.isSafeInteger(number) ? number : null;
}

function parseCoordinatePair(value) {
  const text = String(value === undefined || value === null ? "" : value).trim();
  if (!text) {
    return { latitud: null, longitud: null };
  }

  const matches = [
    text.match(/^([+-]?\d+(?:\.\d+)?)\s*,\s*([+-]?\d+(?:\.\d+)?)$/),
    text.match(/@([+-]?\d+(?:\.\d+)?),([+-]?\d+(?:\.\d+)?)/),
    text.match(/!3d([+-]?\d+(?:\.\d+)?)!4d([+-]?\d+(?:\.\d+)?)/i),
    text.match(/[?&](?:q|query|ll)=([+-]?\d+(?:\.\d+)?)(?:,|%2c)([+-]?\d+(?:\.\d+)?)/i)
  ];
  const match = matches.find(function (result) { return result !== null; });
  if (!match) {
    return { latitud: NaN, longitud: NaN };
  }

  const latitud = Number(match[1]);
  const longitud = Number(match[2]);
  if (!Number.isFinite(latitud) ||
      !Number.isFinite(longitud) ||
      latitud < -90 ||
      latitud > 90 ||
      longitud < -180 ||
      longitud > 180) {
    return { latitud: NaN, longitud: NaN };
  }

  return { latitud: latitud, longitud: longitud };
}

function safeSheetText(value) {
  return /^[=+\-@]/.test(value) ? "'" + value : value;
}

function submitResponse(success, message, responseType, results, record) {
  const response = JSON.stringify({
    type: responseType || "edificio-nuevo-submit",
    success: success,
    message: message,
    results: results,
    record: record
  }).replace(/</g, "\\u003c");
  const html = "<!doctype html><html><body><script>window.top.postMessage(" +
    response +
    ", '*');</script></body></html>";

  return HtmlService.createHtmlOutput(html)
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
}
