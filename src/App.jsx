import React, { useMemo, useRef, useState } from "react";
import * as pdfjsLib from "pdfjs-dist/legacy/build/pdf";
import { motion } from "framer-motion";
import { jsPDF } from "jspdf";
import QRCode from "qrcode";
import {
  Upload,
  Sparkles,
  ClipboardList,
  CheckCircle2,
  RefreshCcw,
  Copy,
  Check,
  X,
  QrCode,
} from "lucide-react";

import logoIzq from "./assets/tfja_logo.svg";
import logoDer from "./assets/tfja_90.svg";

const ejemploTexto = ``;

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
    background: "#f8fafc",
    padding: 24,
    color: "#1e293b",
    fontFamily: "Inter, system-ui, sans-serif",
  },
  shell: {
    background: "#ffffff",
    borderBottomLeftRadius: 40,
    borderBottomRightRadius: 40,
    paddingBottom: 28,
    boxShadow: "0 8px 24px rgba(0,0,0,0.05)",
    overflow: "hidden",
  },
  container: {
    width: "100%",
    margin: 0,
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
  title: { fontSize: 40, fontWeight: 800, margin: "8px 0 10px", textAlign: "center" },
  subtitle: { color: "#475569", lineHeight: 1.6, maxWidth: 920, textAlign: "center" },
  topRow: { display: "flex", justifyContent: "space-between", gap: 16, flexWrap: "wrap", alignItems: "center" },
  buttonRow: { display: "flex", gap: 12, flexWrap: "wrap", justifyContent: "center" },
  primaryBtn: {
    display: "inline-flex",
    alignItems: "center",
    gap: 8,
    background: "#1e293b",
    color: "#fff",
    border: 0,
    padding: "10px 16px",
    borderRadius: 14,
    cursor: "pointer",
    fontWeight: 600,
  },
  secondaryBtn: {
    display: "inline-flex",
    alignItems: "center",
    gap: 8,
    background: "#fff",
    color: "#1e293b",
    border: "1px solid #cbd5e1",
    padding: "10px 16px",
    borderRadius: 14,
    cursor: "pointer",
    fontWeight: 600,
  },
  sendBtnDisabled: {
    display: "inline-flex",
    alignItems: "center",
    gap: 8,
    background: "#cbd5e1",
    color: "#64748b",
    border: 0,
    padding: "10px 16px",
    borderRadius: 14,
    cursor: "not-allowed",
    fontWeight: 600,
  },
  ghostBtn: {
    display: "inline-flex",
    alignItems: "center",
    gap: 8,
    background: "transparent",
    color: "#1e293b",
    border: 0,
    padding: "10px 12px",
    borderRadius: 14,
    cursor: "pointer",
    fontWeight: 600,
  },
  grid3: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(360px, 1fr))",
    gap: 24,
    alignItems: "start",
  },
  sectionTitle: {
    display: "flex",
    alignItems: "center",
    gap: 10,
    fontSize: 26,
    fontWeight: 700,
    marginBottom: 18,
  },
  label: { display: "block", fontSize: 14, fontWeight: 600, marginBottom: 8, color: "#475569" },
  labelLeft: {
    display: "block",
    fontSize: 14,
    fontWeight: 600,
    color: "#475569",
    textAlign: "left",
  },
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
    minHeight: 260,
    border: "1px solid #cbd5e1",
    borderRadius: 16,
    padding: "12px 14px",
    outline: "none",
    fontSize: 14,
    boxSizing: "border-box",
    resize: "vertical",
    fontFamily: "inherit",
    background: "#f1f5f9",
    color: "#334155",
  },
  infoBox: {
    border: "1px dashed #cbd5e1",
    borderRadius: 18,
    padding: 16,
    background: "#f8fafc",
  },
  formGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
    gap: 16,
  },
  full: { gridColumn: "1 / -1" },
  fieldHeader: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 8,
    marginBottom: 8,
  },
  copyBtn: {
    border: "1px solid #cbd5e1",
    background: "#fff",
    color: "#475569",
    borderRadius: 10,
    padding: "4px 8px",
    fontSize: 12,
    cursor: "pointer",
    display: "inline-flex",
    alignItems: "center",
    gap: 4,
  },
  topActionsRow: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
    marginBottom: 18,
  },
  switchWrap: {
    display: "flex",
    alignItems: "center",
    gap: 10,
  },
  switchLabel: {
    fontSize: 14,
    fontWeight: 600,
    color: "#475569",
  },
  switchTrack: {
    width: 52,
    height: 30,
    borderRadius: 999,
    border: "1px solid #cbd5e1",
    padding: 3,
    display: "flex",
    alignItems: "center",
    cursor: "pointer",
    transition: "all 0.2s ease",
  },
  switchThumb: {
    width: 22,
    height: 22,
    borderRadius: "50%",
    background: "#fff",
    boxShadow: "0 1px 4px rgba(0,0,0,0.18)",
  },
  helperText: {
    marginTop: 8,
    fontSize: 12,
    color: "#64748b",
  },
  modalOverlay: {
    position: "fixed",
    inset: 0,
    background: "rgba(15, 23, 42, 0.45)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 9999,
    padding: 24,
  },
  modalCard: {
    width: "100%",
    maxWidth: 520,
    background: "#fff",
    borderRadius: 24,
    border: "1px solid #e2e8f0",
    boxShadow: "0 20px 60px rgba(0,0,0,0.18)",
    padding: 24,
  },
  modalHeader: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
    marginBottom: 18,
  },
  iconBtn: {
    border: "1px solid #cbd5e1",
    background: "#fff",
    color: "#475569",
    borderRadius: 12,
    padding: "8px 10px",
    cursor: "pointer",
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
  },
  qrBox: {
    border: "1px solid #e2e8f0",
    borderRadius: 20,
    padding: 18,
    background: "#f8fafc",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    margin: "18px 0",
  },
  modalText: {
    fontSize: 15,
    color: "#475569",
    lineHeight: 1.6,
  },
  modalActions: {
    display: "flex",
    gap: 10,
    justifyContent: "flex-end",
    flexWrap: "wrap",
    marginTop: 18,
  },
  secondarySmallBtn: {
    display: "inline-flex",
    alignItems: "center",
    gap: 8,
    background: "#fff",
    color: "#1e293b",
    border: "1px solid #cbd5e1",
    padding: "10px 14px",
    borderRadius: 14,
    cursor: "pointer",
    fontWeight: 600,
  },
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
  if (t.includes("decreto impugnado") || t.includes("decretos y acuerdos") || t.includes("acuerdo impugnado")) {
    return "Decretos y Acuerdos";
  }

  return "Resolución Expresa";
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
  const [dragActivo, setDragActivo] = useState(false);
  const [hoverCarga, setHoverCarga] = useState(false);
  const [copiado, setCopiado] = useState(null);
  const [camposValidados, setCamposValidados] = useState(false);
  const [correoDestino, setCorreoDestino] = useState("");
  const [mostrarModalQR, setMostrarModalQR] = useState(false);
  const [qrDataUrl, setQrDataUrl] = useState("");
  const [enlaceConsulta, setEnlaceConsulta] = useState("");
  const fileRef = useRef(null);

const params = new URLSearchParams(window.location.search);
const esModoConsulta = params.get("modo") === "consulta";
const folioConsulta = params.get("folio");

let informacionConsulta = null;
if (esModoConsulta && folioConsulta) {
  try {
    const guardado = localStorage.getItem(folioConsulta);
    informacionConsulta = guardado ? JSON.parse(guardado) : null;
  } catch (e) {
    informacionConsulta = null;
  }
}

  const jsonSalida = useMemo(
    () =>
      JSON.stringify(
        {
          expedienteCapturado: resultado,
          metadata: {
            fuente: documento?.name || "texto_demo.txt",
            fechaProceso: new Date().toISOString(),
            motor: "Prototipo IA + OCR + extracción semántica",
            estatus: "pendiente_validacion_humana",
          },
        },
        null,
        2
      ),
    [resultado, documento]
  );

  const copiarTexto = async (texto, campo) => {
    try {
      await navigator.clipboard.writeText(String(texto || ""));
      setCopiado(campo);
      setTimeout(() => setCopiado(null), 1500);
    } catch (error) {
      console.error("No se pudo copiar:", error);
    }
  };

const construirPayloadCaptura = () => ({
  actor: resultado.actor,
  fechaPresentacion: resultado.fechaPresentacion,
  cuantia: resultado.cuantia,
  representanteLegal: resultado.representanteLegal,
  tipoResolucion: resultado.tipoResolucion,
  resolucionImpugnada: String(resultado.resolucionImpugnada || "").slice(0, 500),
  fechaRecepcion: resultado.fechaRecepcion,
  ley: resultado.ley,
  materia: resultado.materia,
  tipoMateria: resultado.tipoMateria,
  fechaGeneracion: new Date().toISOString(),
});

  const construirUrlConsulta = (payload) => {
  const folio = `cap_${Date.now()}`;
  localStorage.setItem(folio, JSON.stringify(payload));
  return `${window.location.origin}${window.location.pathname}?modo=consulta&folio=${encodeURIComponent(folio)}`;
};

  const generarPdfConQR = async (payload, urlConsulta) => {
    const doc = new jsPDF({ unit: "mm", format: "a4" });
    const qr = await QRCode.toDataURL(urlConsulta, { width: 220, margin: 1 });

    let y = 18;

    doc.setFont("helvetica", "bold");
    doc.setFontSize(16);
    doc.text("Captura de demanda", 14, y);

    y += 10;
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.text(`Fecha de generación: ${new Date().toLocaleString()}`, 14, y);

    y += 12;

const campos = [
  ["Actor", payload.actor],
  ["Fecha de presentación", payload.fechaPresentacion],
  ["Cuantía", payload.cuantia],
  ["Representante legal", payload.representanteLegal],
  ["Tipo de resolución", payload.tipoResolucion],
  ["Resolución impugnada", payload.resolucionImpugnada],
  ["Fecha de recepción", payload.fechaRecepcion],
  ["Ley", payload.ley],
  ["Materia", payload.materia],
  ["Tipo materia", payload.tipoMateria],
];

    campos.forEach(([label, value]) => {
      doc.setFont("helvetica", "bold");
      doc.text(`${label}:`, 14, y);
      doc.setFont("helvetica", "normal");
      const resto = doc.splitTextToSize(String(value || ""), 145);
      doc.text(resto, 55, y);
      y += Math.max(7, resto.length * 5);

      if (y > 240) {
        doc.addPage();
        y = 20;
      }
    });

    y += 6;
    doc.setFont("helvetica", "bold");
    doc.text("Código QR de consulta", 14, y);

    y += 6;
    doc.addImage(qr, "PNG", 14, y, 40, 40);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    const nota = doc.splitTextToSize(
      "Este código QR permite visualizar la información capturada en modo consulta para que el Oficial de partes pueda revisarla y copiarla.",
      120
    );
    doc.text(nota, 60, y + 8);

    doc.save("captura-demanda.pdf");
  };

  const enviarCaptura = async () => {
if (!camposValidados) {
    alert("Primero debe marcar los campos como validados.");
    return;
  }

  try {
    console.log("Iniciando envío...");
    const payload = construirPayloadCaptura();
    const urlConsulta = construirUrlConsulta(payload);

    console.log("URL consulta:", urlConsulta);

    const qr = await QRCode.toDataURL(urlConsulta, {
      width: 260,
      margin: 1,
    });

    setEnlaceConsulta(urlConsulta);
    setQrDataUrl(qr);
    setMostrarModalQR(true);

    await generarPdfConQR(payload, urlConsulta);
  } catch (error) {
    console.error("Error al generar QR o PDF:", error);
    alert("Ocurrió un error al generar el código QR o el PDF.");
  }
  };

  const procesar = async () => {
    setProcesando(true);
    setMensajeCarga("Extrayendo campos del texto digitalizado...");
    await new Promise((r) => setTimeout(r, 400));
    setResultado(extraerCampos(textoOCR));
    setProcesando(false);
    setMensajeCarga("Extracción completada. Revise y corrija si es necesario.");
  };

  const procesarArchivo = async (file) => {
    if (!file) return;

    setDocumento(file);
    setProcesando(true);
    setCamposValidados(false);

    try {
      if (file.type === "application/pdf" || file.name.toLowerCase().endsWith(".pdf")) {
        setMensajeCarga("Leyendo PDF y extrayendo texto...");
        const contenidoPDF = await leerPDFTexto(file);
        setTextoOCR(contenidoPDF || "No se pudo extraer texto del PDF. Si es un PDF escaneado, requerirá OCR.");
        setResultado(extraerCampos(contenidoPDF || ""));
        setMensajeCarga(
          contenidoPDF
            ? "PDF leído correctamente. Ya puede pulsar 'Extraer campos' nuevamente si ajusta el texto."
            : "No se detectó texto seleccionable en el PDF."
        );
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

  const cargarArchivo = async (e) => {
    const file = e.target.files?.[0];
    await procesarArchivo(file);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActivo(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActivo(false);
  };

  const handleDrop = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActivo(false);
    const file = e.dataTransfer?.files?.[0];
    await procesarArchivo(file);
  };

  const reiniciar = () => {
    setDocumento(null);
    setTextoOCR(ejemploTexto);
    setResultado(extraerCampos(ejemploTexto));
    setMensajeCarga("Listo para cargar un PDF o texto.");
    setCamposValidados(false);
    setCorreoDestino("");
    setMostrarModalQR(false);
    setQrDataUrl("");
    setEnlaceConsulta("");
    if (fileRef.current) fileRef.current.value = "";
  };

  if (esModoConsulta) {
    return (
      <div style={styles.page}>
        <div style={styles.shell}>
          <div style={styles.container}>
            <div style={{ ...styles.card, ...styles.cardBody, maxWidth: 900, margin: "0 auto" }}>
              <div style={{ ...styles.topRow, marginBottom: 18 }}>
                <div style={styles.title}>Consulta de captura</div>
              </div>

              {!informacionConsulta ? (
                <div style={styles.modalText}>No fue posible leer la información del código QR.</div>
              ) : (
                <div style={{ display: "grid", gap: 14 }}>
                  {[
                    ["Actor", informacionConsulta.actor],
                    ["Fecha de presentación", informacionConsulta.fechaPresentacion],
                    ["Cuantía", informacionConsulta.cuantia],
                    ["Representante legal", informacionConsulta.representanteLegal],
                    ["Tipo de resolución", informacionConsulta.tipoResolucion],
                    ["Resolución impugnada", informacionConsulta.resolucionImpugnada],
                    ["Fecha de recepción", informacionConsulta.fechaRecepcion],
                    ["Ley", informacionConsulta.ley],
                    ["Materia", informacionConsulta.materia],
                    ["Tipo materia", informacionConsulta.tipoMateria],
                  ].map(([label, value]) => (
                    <div key={label} style={{ ...styles.card, padding: 14 }}>
                      <div style={styles.fieldHeader}>
                        <label style={styles.labelLeft}>{label}</label>
                        <button
                          type="button"
                          style={styles.copyBtn}
                          onClick={() => copiarTexto(value || "", label)}
                        >
                          <Copy size={14} />
                          Copiar
                        </button>
                      </div>
                      <div style={{ ...styles.input, minHeight: 44, display: "flex", alignItems: "center" }}>
                        {String(value || "")}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  const copyStyle = (id) => ({
    ...styles.copyBtn,
    background: copiado === id ? "#dcfce7" : "#fff",
    borderColor: copiado === id ? "#22c55e" : "#cbd5e1",
    color: copiado === id ? "#166534" : "#475569",
    transition: "all 0.2s ease",
  });

  return (
    <div style={styles.page}>
      <div style={styles.shell}>
        <div style={styles.container}>
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
            <div style={{ ...styles.card, ...styles.headerCard }}>
              <div style={{ ...styles.topRow, alignItems: "center" }}>
                <img src={logoIzq} alt="TFJA" style={{ height: 60, objectFit: "contain" }} />

                <div style={{ textAlign: "center", flex: 1 }}>
                  <div style={styles.title}>Captura inteligente de demanda</div>
                  <div style={styles.subtitle}>
                    Sistema que permite cargar una demanda en formato PDF, identificar automáticamente la información relevante del documento y llenar los campos del formulario, para su posterior revisión y validación por el Oficial Jurisdiccional.
                  </div>
                </div>

                <img src={logoDer} alt="TFJA 90 años" style={{ height: 60, objectFit: "contain" }} />
              </div>
            </div>
          </motion.div>

          <div style={styles.grid3}>
            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
              <div style={styles.card}>
                <div style={styles.cardBody}>
                  <SectionTitle icon={ClipboardList}>Entrada del documento</SectionTitle>

                  <motion.div
                    style={{
                      ...styles.infoBox,
                      border: dragActivo
                        ? "2px dashed #1e293b"
                        : hoverCarga
                          ? "2px dashed #1d4ed8"
                          : "1px dashed #cbd5e1",
                      background: dragActivo
                        ? "#dbeafe"
                        : hoverCarga
                          ? "#eff6ff"
                          : "#f8fafc",
                      cursor: "pointer",
                      textAlign: "center",
                      boxShadow: dragActivo
                        ? "0 0 0 4px rgba(37, 99, 235, 0.12)"
                        : hoverCarga
                          ? "0 8px 24px rgba(29, 78, 216, 0.12)"
                          : "0 0 0 rgba(0,0,0,0)",
                    }}
                    animate={{
                      scale: dragActivo ? 1.02 : hoverCarga ? 1.01 : 1,
                      y: dragActivo ? -2 : hoverCarga ? -1 : 0,
                    }}
                    transition={{ duration: 0.2, ease: "easeOut" }}
                    onMouseEnter={() => setHoverCarga(true)}
                    onMouseLeave={() => setHoverCarga(false)}
                    onDragOver={handleDragOver}
                    onDragLeave={(e) => {
                      handleDragLeave(e);
                      setHoverCarga(false);
                    }}
                    onDrop={handleDrop}
                    onClick={() => fileRef.current?.click()}
                  >
                    <div
                      style={{
                        fontSize: 15,
                        fontWeight: 700,
                        color: dragActivo || hoverCarga ? "#1d4ed8" : "#475569",
                      }}
                    >
                      {dragActivo
                        ? "Suelte el archivo aquí"
                        : hoverCarga
                          ? "Haga clic o arrastre su archivo"
                          : "Subir o arrastrar archivo"}
                    </div>

                    <div style={{ marginTop: 6, fontSize: 14, color: "#64748b" }}>
                      {documento ? documento.name : "PDF, TXT, MD o JSON"}
                    </div>

                    <div style={{ marginTop: 10, fontSize: 12, color: "#64748b" }}>
                      {mensajeCarga}
                    </div>
                  </motion.div>

                  <div style={{ marginTop: 16 }}>
                    <label style={styles.label}>Texto OCR / texto digitalizado</label>
                    <textarea
                      style={styles.textAreaBig}
                      value={textoOCR}
                      onChange={(e) => setTextoOCR(e.target.value)}
                      placeholder="Aquí aparecería el texto obtenido por OCR o por lectura del PDF..."
                    />
                  </div>



                  <input
                    ref={fileRef}
                    type="file"
                    style={{ display: "none" }}
                    onChange={cargarArchivo}
                    accept=".pdf,.txt,.md,.json"
                  />
                </div>
              </div>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
              <div style={styles.card}>
                <div style={styles.cardBody}>
                  <SectionTitle icon={CheckCircle2}>Formulario capturado</SectionTitle>

                  <div style={styles.topActionsRow}>
                    <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
                      <button
  type="button"
  style={camposValidados ? styles.primaryBtn : styles.sendBtnDisabled}
  disabled={!camposValidados}
  onClick={enviarCaptura}
>
  Enviar
</button>

                      {documento && (
                        <button type="button" style={styles.secondaryBtn} onClick={reiniciar}>
                          <RefreshCcw size={16} />
                          Reiniciar
                        </button>
                      )}
                    </div>

                    {documento && (
                      <div style={styles.switchWrap}>
                        <span style={styles.switchLabel}>Campos validados</span>

                        <motion.button
                          type="button"
                          onClick={() => setCamposValidados((prev) => !prev)}
                          style={{
                            ...styles.switchTrack,
                            justifyContent: camposValidados ? "flex-end" : "flex-start",
                            background: camposValidados ? "#22c55e" : "#e5e7eb",
                            borderColor: camposValidados ? "#22c55e" : "#cbd5e1",
                            cursor: "pointer"
                          }}
                          animate={{
                            backgroundColor: camposValidados ? "#22c55e" : "#e5e7eb",
                          }}
                          transition={{ duration: 0.2 }}
                        >
                          <motion.div
                            style={styles.switchThumb}
                            layout
                            transition={{ type: "spring", stiffness: 500, damping: 30 }}
                          />
                        </motion.button>
                      </div>
                    )}
                  </div>

                  <div style={styles.formGrid}>
                    <div style={styles.full}>
                      <div style={styles.fieldHeader}>
                        <label style={styles.labelLeft}>Actor</label>
                        <button type="button" style={copyStyle("actor")} onClick={() => copiarTexto(resultado.actor, "actor")}>
                          {copiado === "actor" ? <Check size={14} /> : <Copy size={14} />}
                        </button>
                      </div>
                      <input style={styles.input} value={resultado.actor} onChange={(e) => setResultado({ ...resultado, actor: e.target.value })} />
                    </div>



                    <div style={styles.full}>

                      <div style={styles.fieldHeader}>
                        <label style={styles.labelLeft}>Cuantía</label>
                        <button type="button" style={copyStyle("cuantia")} onClick={() => copiarTexto(resultado.cuantia, "cuantia")}>
                          {copiado === "cuantia" ? <Check size={14} /> : <Copy size={14} />}
                        </button>
                      </div>
                      <input style={styles.input} value={resultado.cuantia} onChange={(e) => setResultado({ ...resultado, cuantia: e.target.value })} />
                    </div>

                    <div style={styles.full}>
                      <div style={styles.fieldHeader}>
                        <label style={styles.labelLeft}>Representante legal</label>
                        <button type="button" style={copyStyle("representanteLegal")} onClick={() => copiarTexto(resultado.representanteLegal, "representanteLegal")}>
                          {copiado === "representanteLegal" ? <Check size={14} /> : <Copy size={14} />}
                        </button>
                      </div>
                      <input style={styles.input} value={resultado.representanteLegal} onChange={(e) => setResultado({ ...resultado, representanteLegal: e.target.value })} />
                    </div>

                    <div style={styles.full}>
                      <div style={styles.fieldHeader}>
                        <label style={styles.labelLeft}>Tipo de resolución</label>
                        <button type="button" style={copyStyle("tipoResolucion")} onClick={() => copiarTexto(resultado.tipoResolucion, "tipoResolucion")}>
                          {copiado === "tipoResolucion" ? <Check size={14} /> : <Copy size={14} />}
                        </button>
                      </div>
                      <select style={styles.input} value={resultado.tipoResolucion} onChange={(e) => setResultado({ ...resultado, tipoResolucion: e.target.value })}>
                        {opcionesResolucion.map((op) => (
                          <option key={op} value={op}>{op}</option>
                        ))}
                      </select>
                    </div>

                    <div style={styles.full}>
                      <div style={styles.fieldHeader}>
                        <label style={styles.labelLeft}>Resolución impugnada</label>
                        <button type="button" style={copyStyle("resolucionImpugnada")} onClick={() => copiarTexto(resultado.resolucionImpugnada, "resolucionImpugnada")}>
                          {copiado === "resolucionImpugnada" ? <Check size={14} /> : <Copy size={14} />}
                        </button>
                      </div>
                      <textarea
                        style={styles.textarea}
                        value={resultado.resolucionImpugnada}
                        onChange={(e) => setResultado({ ...resultado, resolucionImpugnada: e.target.value })}
                      />
                    </div>



                    <div>
                      <div style={styles.fieldHeader}>
                        <label style={styles.labelLeft}>Ley</label>
                        <button type="button" style={copyStyle("ley")} onClick={() => copiarTexto(resultado.ley, "ley")}>
                          {copiado === "ley" ? <Check size={14} /> : <Copy size={14} />}
                        </button>
                      </div>
                      <select style={styles.input} value={resultado.ley} onChange={(e) => setResultado({ ...resultado, ley: e.target.value })}>
                        {opcionesLey.map((op) => (
                          <option key={op} value={op}>{op}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <div style={styles.fieldHeader}>
                        <label style={styles.labelLeft}>Materia</label>
                        <button type="button" style={copyStyle("materia")} onClick={() => copiarTexto(resultado.materia, "materia")}>
                          {copiado === "materia" ? <Check size={14} /> : <Copy size={14} />}
                        </button>
                      </div>
                      <select style={styles.input} value={resultado.materia} onChange={(e) => setResultado({ ...resultado, materia: e.target.value })}>
                        {opcionesMateria.map((op) => (
                          <option key={op} value={op}>{op}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <div style={styles.fieldHeader}>
                        <label style={styles.labelLeft}>Tipo materia</label>
                        <button type="button" style={copyStyle("tipoMateria")} onClick={() => copiarTexto(resultado.tipoMateria, "tipoMateria")}>
                          {copiado === "tipoMateria" ? <Check size={14} /> : <Copy size={14} />}
                        </button>
                      </div>
                      <select style={styles.input} value={resultado.tipoMateria} onChange={(e) => setResultado({ ...resultado, tipoMateria: e.target.value })}>
                        {opcionesTipoMateria.map((op) => (
                          <option key={op} value={op}>{op}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {mostrarModalQR && (
        <div style={styles.modalOverlay}>
          <div style={styles.modalCard}>
            <div style={styles.modalHeader}>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <QrCode size={22} />
                <strong>Código QR generado</strong>
              </div>

              <button type="button" style={styles.iconBtn} onClick={() => setMostrarModalQR(false)}>
                <X size={18} />
              </button>
            </div>

            <div style={styles.modalText}>
              Este código QR debe presentarse al Litigante para continuar con el proceso de demanda.
            </div>

            <div style={styles.qrBox}>
              {qrDataUrl ? (
                <img src={qrDataUrl} alt="QR de consulta" style={{ width: 240, height: 240, objectFit: "contain" }} />
              ) : null}
            </div>

            <div style={styles.modalText}>
              Al escanearlo, se abrirá una vista de solo lectura con la información capturada para que pueda consultarse y copiarse.
            </div>

            <div style={styles.modalActions}>
              <button
                type="button"
                style={styles.secondarySmallBtn}
                onClick={() => copiarTexto(enlaceConsulta, "enlaceQR")}
              >
                <Copy size={16} />
                Copiar enlace
              </button>

              <button
                type="button"
                style={styles.secondarySmallBtn}
                onClick={() => window.open(enlaceConsulta, "_blank")}
              >
                <QrCode size={16} />
                Abrir consulta
              </button>

              <button
                type="button"
                style={styles.primaryBtn}
                onClick={() => setMostrarModalQR(false)}
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}