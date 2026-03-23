import React, { useMemo, useRef, useState } from "react";
import * as pdfjsLib from "pdfjs-dist/legacy/build/pdf";
import { motion } from "framer-motion";
import { Upload, FileJson, Sparkles, ClipboardList, CheckCircle2, RefreshCcw } from "lucide-react";

const ejemploTexto = `SALA REGIONAL

ACTOR: COMERCIALIZADORA DEL CENTRO S.A. DE C.V.
REPRESENTANTE LEGAL: LIC. MARÍA ELENA TORRES GARCÍA
CUANTÍA: $245,000.00
FECHA DE PRESENTACIÓN: 13/03/2026
FECHA DE RECEPCIÓN: 13/03/2026

SE PROMUEVE DEMANDA DE NULIDAD CONTRA RESOLUCIÓN EXPRESA EMITIDA POR LA AUTORIDAD DEMANDADA.
RESOLUCIÓN IMPUGNADA: Oficio 500-42-00-00-00-2026-145 de fecha 01/03/2026 mediante el cual se determina crédito fiscal.

LEY: LEY FEDERAL DE PROCEDIMIENTO CONTENCIOSO ADMINISTRATIVO
MATERIA: FISCAL
TIPO MATERIA: CRÉDITO FISCAL`;

const opcionesResolucion = [
  "Resolución Expresa",
  "Resolución Ficta",
  "Juicio de Lesividad",
  "Decretos y Acuerdos",
];

const opcionesLey = ["LFPCA", "CFF", "Ley Aduanera", "Ley del IVA", "Ley del ISR", "Otra"];
const opcionesMateria = ["Fiscal", "Administrativa", "Aduanera", "Seguridad Social", "Responsabilidad Patrimonial"];
const opcionesTipoMateria = ["Crédito Fiscal", "Multa", "Determinación", "Negativa", "Resolución Administrativa"];

pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

const styles = {
  page: {
    minHeight: "100vh",
    background: "#f8fafc",
    padding: 24,
    color: "#0f172a",
    fontFamily: "Inter, system-ui, sans-serif",
  },
  container: {
    maxWidth: 1400,
    margin: "0 auto",
    display: "grid",
    gap: 24,
  },
  card: {
    background: "#ffffff",
    border: "1px solid #e2e8f0",
    borderRadius: 24,
    boxShadow: "0 1px 2px rgba(0,0,0,0.04)",
  },
  headerCard: { padding: 28 },
  cardBody: { padding: 22 },
  title: { fontSize: 40, fontWeight: 800, margin: "8px 0 10px" },
  subtitle: { color: "#475569", lineHeight: 1.6, maxWidth: 920 },
  topRow: { display: "flex", justifyContent: "space-between", gap: 16, flexWrap: "wrap", alignItems: "center" },
  buttonRow: { display: "flex", gap: 12, flexWrap: "wrap" },
  primaryBtn: {
    display: "inline-flex",
    alignItems: "center",
    gap: 8,
    background: "#0f172a",
    color: "#fff",
    border: 0,
    padding: "12px 18px",
    borderRadius: 16,
    cursor: "pointer",
    fontWeight: 600,
  },
  secondaryBtn: {
    display: "inline-flex",
    alignItems: "center",
    gap: 8,
    background: "#fff",
    color: "#0f172a",
    border: "1px solid #cbd5e1",
    padding: "12px 18px",
    borderRadius: 16,
    cursor: "pointer",
    fontWeight: 600,
  },
  ghostBtn: {
    display: "inline-flex",
    alignItems: "center",
    gap: 8,
    background: "transparent",
    color: "#0f172a",
    border: 0,
    padding: "12px 6px",
    borderRadius: 16,
    cursor: "pointer",
    fontWeight: 600,
  },
  grid3: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(360px, 1fr))",
    gap: 24,
    alignItems: "start",
  },
  sectionTitle: { display: "flex", alignItems: "center", gap: 10, fontSize: 26, fontWeight: 700, marginBottom: 18 },
  label: { display: "block", fontSize: 14, fontWeight: 600, marginBottom: 8, color: "#334155" },
  input: {
    width: "100%",
    border: "1px solid #cbd5e1",
    borderRadius: 16,
    padding: "12px 14px",
    outline: "none",
    fontSize: 14,
    boxSizing: "border-box",
    background: "#fff",
  },
  textarea: {
    width: "100%",
    border: "1px solid #cbd5e1",
    borderRadius: 16,
    padding: "12px 14px",
    outline: "none",
    fontSize: 14,
    boxSizing: "border-box",
    minHeight: 130,
    resize: "vertical",
    fontFamily: "inherit",
    background: "#fff",
  },
  textAreaBig: {
    width: "100%",
    minHeight: 520,
    border: "1px solid #cbd5e1",
    borderRadius: 16,
    padding: "12px 14px",
    outline: "none",
    fontSize: 14,
    boxSizing: "border-box",
    resize: "vertical",
    fontFamily: "inherit",
    background: "#fff",
  },
  infoBox: {
    border: "1px dashed #cbd5e1",
    borderRadius: 18,
    padding: 16,
    background: "#f8fafc",
  },
  blueBox: {
    borderRadius: 18,
    padding: 16,
    background: "#eff6ff",
    color: "#1e3a8a",
    fontSize: 14,
    lineHeight: 1.5,
  },
  formGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
    gap: 16,
  },
  full: { gridColumn: "1 / -1" },
  checkboxBox: {
    border: "1px solid #cbd5e1",
    borderRadius: 16,
    padding: "14px 12px",
    display: "flex",
    alignItems: "center",
    gap: 10,
    fontSize: 14,
  },
  pre: {
    overflow: "auto",
    borderRadius: 18,
    background: "#020617",
    color: "#e2e8f0",
    padding: 16,
    fontSize: 12,
    lineHeight: 1.7,
    maxHeight: 520,
    whiteSpace: "pre-wrap",
  },
  confidenceItem: {
    border: "1px solid #e2e8f0",
    borderRadius: 18,
    padding: 14,
    background: "rgba(255,255,255,0.8)",
  },
  badge: {
    fontSize: 12,
    padding: "4px 10px",
    borderRadius: 999,
    background: "#e2e8f0",
    color: "#0f172a",
    fontWeight: 700,
  },
  architecture: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
    gap: 16,
  },
  architectureItem: {
    border: "1px solid #e2e8f0",
    borderRadius: 18,
    padding: 16,
    background: "#f8fafc",
  },
  muted: { color: "#64748b" },
};

function normalizarEspacios(texto) {
  return String(texto || "")
    .replace(/\u0000/g, " ")
    .replace(/[\t ]+/g, " ")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

async function leerPDFTexto(file) {
  const buffer = await file.arrayBuffer();
  const pdf = await pdfjsLib.getDocument({ data: buffer }).promise;
  let textoCompleto = "";

  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i);
    const content = await page.getTextContent();
    const lineas = [];
    let ultimaY = null;
    let lineaActual = [];

    for (const item of content.items) {
      const str = item.str || "";
      const y = item.transform?.[5];

      if (ultimaY === null) ultimaY = y;

      if (Math.abs((y ?? 0) - (ultimaY ?? 0)) > 4) {
        if (lineaActual.length) lineas.push(lineaActual.join(" "));
        lineaActual = [];
        ultimaY = y;
      }

      if (str.trim()) lineaActual.push(str);
    }

    if (lineaActual.length) lineas.push(lineaActual.join(" "));

    textoCompleto += `\n\n--- Página ${i} ---\n${lineas.join("\n")}`;
  }

  return normalizarEspacios(textoCompleto);
}

function inferirTipoResolucion(texto) {
  const t = texto.toLowerCase();

  if (t.includes("resolución ficta")) return "Resolución Ficta";
  if (t.includes("lesividad")) return "Juicio de Lesividad";

  if (
    t.includes("decreto impugnado") ||
    t.includes("decretos y acuerdos") ||
    t.includes("acuerdo impugnado")
  ) {
    return "Decretos y Acuerdos";
  }

  return "Resolución Expresa";
}

function limpiarTextoCampo(valor) {
  return String(valor || "")
    .replace(/^[-–•\d.\s]+/, "")
    .replace(/\s{2,}/g, " ")
    .trim();
}

function obtenerLineas(texto) {
  return String(texto || "")
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean);
}

function esRazonSocialProbable(linea) {
  const l = linea.trim();

  if (l.length < 8 || l.length > 140) return false;
  if (!/[A-ZÁÉÍÓÚÑ]/.test(l)) return false;

  return (
    /S\.?\s*A\.?\s*DE\s*C\.?\s*V\.?/i.test(l) ||
    /SOCIEDAD AN[ÓO]NIMA/i.test(l) ||
    /S\.?\s*DE\s*R\.?\s*L\.?/i.test(l)
  );
}

function esNombrePersonaProbable(linea) {
  const l = linea.trim();

  if (l.length < 10 || l.length > 90) return false;
  if (/\d/.test(l)) return false;
  if (/S\.?\s*A\.?\s*DE\s*C\.?\s*V\.?/i.test(l)) return false;
  if (/TRIBUNAL|SALA|JUICIO|DEMANDA|AUTORIDAD|C[ÓO]DIGO|LEY/i.test(l)) return false;

  const palabras = l.split(/\s+/).filter(Boolean);
  return palabras.length >= 3 && palabras.every((p) => /^[A-ZÁÉÍÓÚÑ][A-ZÁÉÍÓÚÑ'-]*$/i.test(p));
}



function extraerFechaDeLinea(linea) {
  const m1 = linea.match(/\b(\d{1,2}[\/\-]\d{1,2}[\/\-]\d{2,4})\b/);
  if (m1) return m1[1];

  const m2 = linea.match(/\b(\d{1,2}\s+de\s+[A-Za-záéíóúñ]+\s+de\s+\d{4})\b/i);
  if (m2) return m2[1];

  return "";
}

function extraerCampos(texto) {
  const limpio = String(texto || "").replace(/\r/g, "");
  const unaLinea = limpio.replace(/\n/g, " ");
  const lineas = limpio
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean);

  const extraerPorPatrones = (patrones, fuente = limpio) => {
    for (const p of patrones) {
      const m = fuente.match(p);
      if (m?.[1]) return m[1].trim();
    }
    return "";
  };

  let actor = extraerPorPatrones([
    /apoderado legal de\s+([A-ZÁÉÍÓÚÑ0-9\s.,&-]+S\.?\s*A\.?\s*DE\s*C\.?\s*V\.?)/i,
    /en representación de\s+([A-ZÁÉÍÓÚÑ0-9\s.,&-]+S\.?\s*A\.?\s*DE\s*C\.?\s*V\.?)/i,
    /a nombre de\s+([A-ZÁÉÍÓÚÑ0-9\s.,&-]+S\.?\s*A\.?\s*DE\s*C\.?\s*V\.?)/i,
    /ACTOR\s*[:.-]\s*(.+)/i,
    /PROMOVENTE\s*[:.-]\s*(.+)/i,
  ], unaLinea);

  if (!actor) {
    const empresa = lineas.find((l) => /S\.?\s*A\.?\s*DE\s*C\.?\s*V\.?/i.test(l));
    if (empresa) actor = empresa;
  }

  const actorLimpio = actor
    ? actor.replace(/,?\s*empresa fusionante[\s\S]*$/i, "").trim()
    : "";

  let representanteLegal = extraerPorPatrones([
    /([A-ZÁÉÍÓÚÑ][A-ZÁÉÍÓÚÑ\s]+),\s*en mi carácter de apoderado legal/i,
    /([A-ZÁÉÍÓÚÑ][A-ZÁÉÍÓÚÑ\s]+),\s*en mi carácter de representante legal/i,
    /REPRESENTANTE LEGAL\s*[:.-]\s*(.+)/i,
    /APODERADO LEGAL\s*[:.-]\s*(.+)/i,
  ], unaLinea);

  const cuantia = extraerPorPatrones([
    /CUANT[ÍI]A\s*[:.-]\s*(.+)/i,
    /MONTO\s*[:.-]\s*(.+)/i,
    /(?:cantidad de|crédito fiscal por|multa por)\s*(\$\s?[\d,]+(?:\.\d{2})?)/i,
  ], unaLinea);

  let fechaPresentacion = extraerPorPatrones([
    /FECHA DE PRESENTACI[ÓO]N\s*[:.-]\s*(\d{1,2}[\/\-]\d{1,2}[\/\-]\d{2,4})/i,
    /PRESENTADA EL\s+(\d{1,2}[\/\-]\d{1,2}[\/\-]\d{2,4})/i,
    /Ciudad de M[eé]xico,?\s+a\s+(?:los\s+)?(\d{1,2}\s+de\s+[A-Za-záéíóúñ]+\s+de\s+\d{4})/i,
  ], unaLinea);

  let fechaRecepcion = extraerPorPatrones([
    /FECHA DE RECEPCI[ÓO]N\s*[:.-]\s*(\d{1,2}[\/\-]\d{1,2}[\/\-]\d{2,4})/i,
    /acuse de recepci[oó]n.*?(\d{1,2}[\/\-]\d{1,2}[\/\-]\d{2,4})/i,
    /se recibi[oó].*?el\s+(\d{1,2}[\/\-]\d{1,2}[\/\-]\d{2,4})/i,
  ], unaLinea);

  let resolucionImpugnada = "";

  const matchActos = limpio.match(
    /ACTOS IMPUGNADOS[\s\S]{0,20}?:?([\s\S]{40,1000}?)(?:\n(?:IV\.|V\.|VI\.|PRETENSIONES|CONCEPTOS DE IMPUGNACI[ÓO]N|PRUEBAS))/i
  );

  if (matchActos?.[1]) {
    resolucionImpugnada = matchActos[1].trim();
  } else {
    const lineasRelevantes = lineas.filter((l) =>
      /acto impugnado|resoluci[oó]n|oficio|acuerdo de fecha|multa|cr[eé]dito fiscal/i.test(l)
    );

    if (lineasRelevantes.length) {
      resolucionImpugnada = lineasRelevantes.slice(0, 4).join(" ");
    }
  }

  resolucionImpugnada = resolucionImpugnada
    .replace(/\s{2,}/g, " ")
    .trim();

  if (resolucionImpugnada.length > 500) {
    resolucionImpugnada = resolucionImpugnada.slice(0, 500) + "...";
  }

  const leyRaw = extraerPorPatrones([
    /LEY\s*[:.-]\s*(.+)/i,
    /(Ley Federal de Procedimiento Contencioso Administrativo)/i,
  ], unaLinea);

  const t = unaLinea.toLowerCase();

  const tipoResolucion = inferirTipoResolucion(limpio);

  const recepcionPorCorreo =
    /recepci[oó]n por correo|presentad[oa] por correo|remitid[oa] por correo|enviad[oa] por correo/i.test(unaLinea);

  const enviadoPorOtraSala = /otra sala/i.test(unaLinea);

  const materia =
    t.includes("aduaner") ? "Aduanera" :
    t.includes("administrativ") ? "Administrativa" :
    t.includes("seguridad social") ? "Seguridad Social" :
    "Fiscal";

  const tipoMateria =
    /multa/i.test(unaLinea) ? "Multa" :
    /cr[eé]dito fiscal/i.test(unaLinea) ? "Crédito Fiscal" :
    /determinaci[oó]n/i.test(unaLinea) ? "Determinación" :
    /negativa/i.test(unaLinea) ? "Negativa" :
    "Resolución Administrativa";

  return {
    actor: actorLimpio,
    fechaPresentacion,
    cuantia,
    representanteLegal,
    tipoResolucion,
    resolucionImpugnada,
    enviadoPorOtraSala,
    recepcionPorCorreo,
    fechaRecepcion,
    ley: leyRaw || "LFPCA",
    materia,
    tipoMateria,
    confianza: {
      actor: actorLimpio ? 0.94 : 0.22,
      fechaPresentacion: fechaPresentacion ? 0.91 : 0.18,
      cuantia: cuantia ? 0.88 : 0.16,
      representanteLegal: representanteLegal ? 0.90 : 0.2,
      tipoResolucion: 0.83,
      resolucionImpugnada: resolucionImpugnada ? 0.81 : 0.17,
      ley: 0.79,
      materia: 0.78,
      tipoMateria: 0.76,
    },
  };
}

function CampoConfianza({ label, value, confidence }) {
  const nivel = confidence >= 0.85 ? "Alta" : confidence >= 0.65 ? "Media" : "Baja";

  return (
    <div style={styles.confidenceItem}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12 }}>
        <span style={{ fontSize: 14, fontWeight: 600, color: "#334155" }}>{label}</span>
        <span style={styles.badge}>{nivel}</span>
      </div>
      <div style={{ marginTop: 6, fontSize: 14, color: "#0f172a", wordBreak: "break-word" }}>{value || "Sin detectar"}</div>
    </div>
  );
}

function SectionTitle({ icon: Icon, children }) {
  return (
    <div style={styles.sectionTitle}>
      <Icon size={22} />
      <span>{children}</span>
    </div>
  );
}

export default function PrototipoCapturaDemandaIA() {
  const [documento, setDocumento] = useState(null);
  const [textoOCR, setTextoOCR] = useState(ejemploTexto);
  const [procesando, setProcesando] = useState(false);
  const [mensajeCarga, setMensajeCarga] = useState("Listo para cargar un PDF o texto.");
  const [resultado, setResultado] = useState(() => extraerCampos(ejemploTexto));
  const fileRef = useRef(null);

  const jsonSalida = useMemo(() => JSON.stringify({
    expedienteCapturado: resultado,
    metadata: {
      fuente: documento?.name || "texto_demo.txt",
      fechaProceso: new Date().toISOString(),
      motor: "Prototipo IA + OCR + extracción semántica",
      estatus: "pendiente_validacion_humana",
    },
  }, null, 2), [resultado, documento]);

  const procesar = async () => {
    setProcesando(true);
    setMensajeCarga("Extrayendo campos del texto digitalizado...");
    await new Promise((r) => setTimeout(r, 400));
    setResultado(extraerCampos(textoOCR));
    setProcesando(false);
    setMensajeCarga("Extracción completada. Revise y corrija si es necesario.");
  };

  const cargarArchivo = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setDocumento(file);
    setProcesando(true);

    try {
      if (file.type === "application/pdf" || file.name.toLowerCase().endsWith(".pdf")) {
        setMensajeCarga("Leyendo PDF y extrayendo texto...");
        const contenidoPDF = await leerPDFTexto(file);
        setTextoOCR(contenidoPDF || "No se pudo extraer texto del PDF. Si es un PDF escaneado, requerirá OCR.");
        setResultado(extraerCampos(contenidoPDF || ""));
        setMensajeCarga(contenidoPDF ? "PDF leído correctamente. Ya puede pulsar 'Extraer campos' nuevamente si ajusta el texto." : "No se detectó texto seleccionable en el PDF.");
      } else if (file.type.startsWith("text/") || /\.(txt|md|json)$/i.test(file.name)) {
        setMensajeCarga("Leyendo archivo de texto...");
        const reader = new FileReader();
        reader.onload = (evt) => {
          const contenido = normalizarEspacios(String(evt.target?.result || ""));
          setTextoOCR(contenido);
          setResultado(extraerCampos(contenido));
          setMensajeCarga("Archivo de texto leído correctamente.");
          setProcesando(false);
        };
        reader.onerror = () => {
          setMensajeCarga("No fue posible leer el archivo.");
          setProcesando(false);
        };
        reader.readAsText(file, "utf-8");
        return;
      } else {
        setTextoOCR("Formato no soportado todavía en este prototipo. Use PDF con texto o archivo TXT.");
        setResultado(extraerCampos(""));
        setMensajeCarga("Formato no soportado todavía.");
      }
    } catch (error) {
      console.error(error);
      setTextoOCR("No fue posible leer el archivo. Si el PDF es escaneado, este prototipo necesitará OCR real para interpretarlo.");
      setResultado(extraerCampos(""));
      setMensajeCarga("Ocurrió un error al leer el archivo.");
    } finally {
      setProcesando(false);
    }
  };

  const reiniciar = () => {
    setDocumento(null);
    setTextoOCR(ejemploTexto);
    setResultado(extraerCampos(ejemploTexto));
    setMensajeCarga("Listo para cargar un PDF o texto.");
    if (fileRef.current) fileRef.current.value = "";
  };

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
          <div style={{ ...styles.card, ...styles.headerCard }}>
            <div style={styles.topRow}>
              <div>
              
                <div style={styles.title}>Captura inteligente de demanda</div>
                <div style={styles.subtitle}>
                  Mini sistema web para cargar una demanda en PDF, digitalizarla con OCR e IA, extraer automáticamente los campos del formulario y generar una salida estructurada en JSON para validación del Oficial Jurisdiccional.
                </div>
              </div>
              <div style={styles.buttonRow}>
                <button style={styles.primaryBtn} onClick={() => fileRef.current?.click()}>
                  <Upload size={16} />
                  Cargar documento
                </button>
                <button style={styles.secondaryBtn} onClick={procesar}>
                  <Sparkles size={16} />
                  {procesando ? "Procesando..." : "Extraer campos"}
                </button>
                <button style={styles.ghostBtn} onClick={reiniciar}>
                  <RefreshCcw size={16} />
                  Reiniciar
                </button>
                <input
                  ref={fileRef}
                  type="file"
                  style={{ display: "none" }}
                  onChange={cargarArchivo}
                  accept=".pdf,.txt,.md,.json"
                />
              </div>
            </div>
          </div>
        </motion.div>

        <div style={styles.grid3}>
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
            <div style={styles.card}>
              <div style={styles.cardBody}>
                <SectionTitle icon={ClipboardList}>Entrada del documento</SectionTitle>

                <div style={styles.infoBox}>
                  <div style={{ fontSize: 14, fontWeight: 600, color: "#334155" }}>Archivo cargado</div>
                  <div style={{ marginTop: 4, fontSize: 14, color: "#64748b" }}>{documento ? documento.name : "Usando texto de demostración"}</div>
                  <div style={{ marginTop: 8, fontSize: 12, color: "#64748b" }}>{mensajeCarga}</div>
                </div>

                <div style={{ marginTop: 16 }}>
                  <label style={styles.label}>Texto OCR / texto digitalizado</label>
                  <textarea
                    style={styles.textAreaBig}
                    value={textoOCR}
                    onChange={(e) => setTextoOCR(e.target.value)}
                    placeholder="Aquí aparecería el texto obtenido por OCR o por lectura del PDF..."
                  />
                </div>

                <div style={{ ...styles.blueBox, marginTop: 16 }}>
                  Si el PDF tiene texto seleccionable, este prototipo ya intentará leerlo correctamente. Si el PDF es una imagen escaneada, todavía hará falta integrar OCR real.
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
            <div style={styles.card}>
              <div style={styles.cardBody}>
                <SectionTitle icon={CheckCircle2}>Formulario capturado</SectionTitle>

                <div style={styles.formGrid}>
                  <div style={styles.full}>
                    <label style={styles.label}>Actor</label>
                    <input style={styles.input} value={resultado.actor} onChange={(e) => setResultado({ ...resultado, actor: e.target.value })} />
                  </div>

                  <div>
                    <label style={styles.label}>Fecha de presentación</label>
                    <input style={styles.input} value={resultado.fechaPresentacion} onChange={(e) => setResultado({ ...resultado, fechaPresentacion: e.target.value })} />
                  </div>

                  <div>
                    <label style={styles.label}>Cuantía</label>
                    <input style={styles.input} value={resultado.cuantia} onChange={(e) => setResultado({ ...resultado, cuantia: e.target.value })} />
                  </div>

                  <div style={styles.full}>
                    <label style={styles.label}>Representante legal</label>
                    <input style={styles.input} value={resultado.representanteLegal} onChange={(e) => setResultado({ ...resultado, representanteLegal: e.target.value })} />
                  </div>

                  <div style={styles.full}>
                    <label style={styles.label}>Tipo de resolución</label>
                    <select style={styles.input} value={resultado.tipoResolucion} onChange={(e) => setResultado({ ...resultado, tipoResolucion: e.target.value })}>
                      {opcionesResolucion.map((op) => <option key={op} value={op}>{op}</option>)}
                    </select>
                  </div>

                  <div style={styles.full}>
                    <label style={styles.label}>Resolución impugnada</label>
                    <textarea
                      style={styles.textarea}
                      value={resultado.resolucionImpugnada}
                      onChange={(e) => setResultado({ ...resultado, resolucionImpugnada: e.target.value })}
                    />
                  </div>

                

                  <div>
                    <label style={styles.label}>Fecha de recepción</label>
                    <input style={styles.input} value={resultado.fechaRecepcion} onChange={(e) => setResultado({ ...resultado, fechaRecepcion: e.target.value })} />
                  </div>

                  <div>
                    <label style={styles.label}>Ley</label>
                    <select style={styles.input} value={resultado.ley} onChange={(e) => setResultado({ ...resultado, ley: e.target.value })}>
                      {opcionesLey.map((op) => <option key={op} value={op}>{op}</option>)}
                    </select>
                  </div>

                  <div>
                    <label style={styles.label}>Materia</label>
                    <select style={styles.input} value={resultado.materia} onChange={(e) => setResultado({ ...resultado, materia: e.target.value })}>
                      {opcionesMateria.map((op) => <option key={op} value={op}>{op}</option>)}
                    </select>
                  </div>

                  <div>
                    <label style={styles.label}>Tipo materia</label>
                    <select style={styles.input} value={resultado.tipoMateria} onChange={(e) => setResultado({ ...resultado, tipoMateria: e.target.value })}>
                      {opcionesTipoMateria.map((op) => <option key={op} value={op}>{op}</option>)}
                    </select>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
            <div style={{ display: "grid", gap: 24 }}>
              <div style={styles.card}>
                <div style={styles.cardBody}>
                  <SectionTitle icon={FileJson}>Salida JSON</SectionTitle>
                  <pre style={styles.pre}>{jsonSalida}</pre>
                </div>
              </div>

              <div style={styles.card}>
                <div style={styles.cardBody}>
                  <div style={{ fontSize: 26, fontWeight: 700, marginBottom: 16 }}>Confianza por campo</div>
                  <div style={{ display: "grid", gap: 12 }}>
                    <CampoConfianza label="Actor" value={resultado.actor} confidence={resultado.confianza?.actor ?? 0.2} />
                    <CampoConfianza label="Fecha de presentación" value={resultado.fechaPresentacion} confidence={resultado.confianza?.fechaPresentacion ?? 0.2} />
                    <CampoConfianza label="Cuantía" value={resultado.cuantia} confidence={resultado.confianza?.cuantia ?? 0.2} />
                    <CampoConfianza label="Representante legal" value={resultado.representanteLegal} confidence={resultado.confianza?.representanteLegal ?? 0.2} />
                    <CampoConfianza label="Resolución impugnada" value={resultado.resolucionImpugnada} confidence={resultado.confianza?.resolucionImpugnada ?? 0.2} />
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <div style={styles.card}>
            <div style={styles.cardBody}>
              <div style={{ fontSize: 28, fontWeight: 700, marginBottom: 18 }}>Arquitectura sugerida para evolucionar el prototipo</div>
              <div style={styles.architecture}>
                <div style={styles.architectureItem}>
                  <div style={{ fontWeight: 700, marginBottom: 8 }}>1. Carga</div>
                  <div style={styles.muted}>PDF de demanda, ya sea nativo o escaneado.</div>
                </div>
                <div style={styles.architectureItem}>
                  <div style={{ fontWeight: 700, marginBottom: 8 }}>2. OCR + IA</div>
                  <div style={styles.muted}>Lectura de texto y extracción semántica de campos.</div>
                </div>
                <div style={styles.architectureItem}>
                  <div style={{ fontWeight: 700, marginBottom: 8 }}>3. Validación</div>
                  <div style={styles.muted}>El oficial corrige y confirma antes de guardar.</div>
                </div>
                <div style={styles.architectureItem}>
                  <div style={{ fontWeight: 700, marginBottom: 8 }}>4. Integración</div>
                  <div style={styles.muted}>Exportación JSON o envío al sistema institucional.</div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
