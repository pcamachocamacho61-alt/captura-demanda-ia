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
    color: "#0f172a",
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
    background: "#0f172a",
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
    color: "#0f172a",
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
    color: "#0f172a",
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
  label: { display: "block", fontSize: 14, fontWeight: 600, marginBottom: 8, color: "#334155" },
  labelLeft: {
    display: "block",
    fontSize: 14,
    fontWeight: 600,
    color: "#334155",
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
    background: "#fff",
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
    color: "#334155",
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
    color: "#334155",
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
    color: "#334155",
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
    color: "#334155",
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
    color: "#0f172a",
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
  const lineas = limpio
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean);

  const obtenerValorLinea = (etiqueta) => {
    const linea = lineas.find((l) => l.toUpperCase().startsWith(etiqueta.toUpperCase()));
    if (!linea) return "";
    return linea.substring(etiqueta.length).replace(/^[:.\-\s]+/, "").trim();
  };

  let actor =
    obtenerValorLinea("ACTOR") ||
    (() => {
      const m = limpio.match(/([A-ZÁÉÍÓÚÑ0-9\s.,&-]+S\.?\s*A\.?\s*DE\s*C\.?\s*V\.?)\s*-+\s*VS/i);
      return m?.[1]?.trim() || "";
    })();

  if (!actor) {
    const empresa = lineas.find((l) => /S\.?\s*A\.?\s*DE\s*C\.?\s*V\.?/i.test(l));
    actor = empresa || "";
  }

  actor = actor.replace(/\s+-+\s*VS[\s\S]*$/i, "").replace(/,?\s*empresa fusionante[\s\S]*$/i, "").trim();

  let representanteLegal =
    obtenerValorLinea("REPRESENTANTE LEGAL") ||
    (() => {
      const m =
        limpio.match(/C\.\s*([A-ZÁÉÍÓÚÑ][A-Za-zÁÉÍÓÚÑáéíóúñ\s]+?),\s*me identifico/i) ||
        limpio.match(/C\.\s*([A-ZÁÉÍÓÚÑ][A-Za-zÁÉÍÓÚÑáéíóúñ\s]+?),\s*comparezco/i) ||
        limpio.match(/C\.\s*([A-ZÁÉÍÓÚÑ][A-Za-zÁÉÍÓÚÑáéíóúñ\s]+?),[\s\S]{0,180}?en mi carácter de Apoderado/i);

      return m?.[1]?.trim() || "";
    })();

  representanteLegal = String(representanteLegal || "")
    .replace(/^C\.\s*/i, "")
    .replace(/^LIC\.\s*/i, "")
    .trim();

  const cuantia = obtenerValorLinea("CUANTÍA") || obtenerValorLinea("CUANTIA");
  const fechaPresentacion =
    obtenerValorLinea("FECHA DE PRESENTACIÓN") ||
    obtenerValorLinea("FECHA DE PRESENTACION") ||
    (() => {
      const m = limpio.match(/Ciudad de M[eé]xico,?\s+a\s+(?:los\s+)?(\d{1,2}\s+de\s+[A-Za-záéíóúñ]+\s+de\s+\d{4})/i);
      return m?.[1] || "";
    })();

  const fechaRecepcion =
    obtenerValorLinea("FECHA DE RECEPCIÓN") || obtenerValorLinea("FECHA DE RECEPCION");

  let resolucionImpugnada =
    obtenerValorLinea("RESOLUCIÓN IMPUGNADA") ||
    obtenerValorLinea("RESOLUCION IMPUGNADA") ||
    (() => {
      const m = limpio.match(/RESOLUCI[ÓO]N\s+QUE\s+SE\s+IMPUGNA\s*:\s*([\s\S]{20,500}?)(?:ASUNTO:|H\.\s*SALA|C\.)/i);
      return m?.[1]?.replace(/\s{2,}/g, " ").trim() || "";
    })();

  const ley = obtenerValorLinea("LEY") || "LFPCA";
  const materia = obtenerValorLinea("MATERIA") || (limpio.toLowerCase().includes("consumidor") ? "Administrativa" : "Fiscal");
  const tipoMateria = obtenerValorLinea("TIPO MATERIA") || (/multa/i.test(limpio) ? "Multa" : "Resolución Administrativa");
  const tipoResolucion = inferirTipoResolucion(limpio);

  return {
    actor,
    fechaPresentacion,
    cuantia,
    representanteLegal,
    tipoResolucion,
    resolucionImpugnada,
    fechaRecepcion,
    ley,
    materia,
    tipoMateria,
    confianza: {
      actor: actor ? 0.98 : 0.2,
      fechaPresentacion: fechaPresentacion ? 0.98 : 0.2,
      cuantia: cuantia ? 0.98 : 0.2,
      representanteLegal: representanteLegal ? 0.98 : 0.2,
      tipoResolucion: 0.85,
      resolucionImpugnada: resolucionImpugnada ? 0.95 : 0.2,
      ley: ley ? 0.95 : 0.2,
      materia: materia ? 0.95 : 0.2,
      tipoMateria: tipoMateria ? 0.95 : 0.2,
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
  const dataConsulta = params.get("data");

  let informacionConsulta = null;
  if (esModoConsulta && dataConsulta) {
    try {
      informacionConsulta = JSON.parse(
        decodeURIComponent(escape(atob(decodeURIComponent(dataConsulta))))
      );
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
    resolucionImpugnada: resultado.resolucionImpugnada,
    fechaRecepcion: resultado.fechaRecepcion,
    ley: resultado.ley,
    materia: resultado.materia,
    tipoMateria: resultado.tipoMateria,
    correoDestino,
    fechaGeneracion: new Date().toISOString(),
  });

  const construirUrlConsulta = (payload) => {
    const json = JSON.stringify(payload);
    const encoded = btoa(unescape(encodeURIComponent(json)));
    return `${window.location.origin}${window.location.pathname}?modo=consulta&data=${encodeURIComponent(encoded)}`;
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
      ["Correo destino", payload.correoDestino],
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
      "Este código QR permite visualizar la información capturada en modo consulta para que el litigante pueda revisarla y copiarla.",
      120
    );
    doc.text(nota, 60, y + 8);

    doc.save("captura-demanda.pdf");
  };

  const enviarCaptura = async () => {
    if (!camposValidados || !correoDestino.trim()) return;

    const payload = construirPayloadCaptura();
    const urlConsulta = construirUrlConsulta(payload);
    const qr = await QRCode.toDataURL(urlConsulta, { width: 260, margin: 1 });

    setEnlaceConsulta(urlConsulta);
    setQrDataUrl(qr);
    setMostrarModalQR(true);

    await generarPdfConQR(payload, urlConsulta);
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
    color: copiado === id ? "#166534" : "#334155",
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
                    Mini sistema web para cargar una demanda en PDF, digitalizarla con OCR e IA, extraer automáticamente los campos del formulario y generar una salida estructurada en JSON para validación del Oficial Jurisdiccional.
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
                        ? "2px dashed #0f172a"
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
                        color: dragActivo || hoverCarga ? "#1d4ed8" : "#334155",
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

                  <div style={{ marginTop: 16 }}>
                    <label style={styles.label}>
                      Correo de la persona a la que se le enviará la información que se capturó
                    </label>
                    <input
                      type="email"
                      style={styles.input}
                      value={correoDestino}
                      onChange={(e) => setCorreoDestino(e.target.value)}
                      placeholder="ejemplo@correo.com"
                    />
                    <div style={styles.helperText}>
                      Este correo se habilita para envío cuando los campos hayan sido validados.
                    </div>
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
                      {camposValidados && (
                        <button
                          type="button"
                          style={correoDestino.trim() ? styles.primaryBtn : styles.sendBtnDisabled}
                          disabled={!correoDestino.trim()}
                          onClick={enviarCaptura}
                        >
                          Enviar
                        </button>
                      )}

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

                    <div>
                      <div style={styles.fieldHeader}>
                        <label style={styles.labelLeft}>Fecha de presentación</label>
                        <button type="button" style={copyStyle("fechaPresentacion")} onClick={() => copiarTexto(resultado.fechaPresentacion, "fechaPresentacion")}>
                          {copiado === "fechaPresentacion" ? <Check size={14} /> : <Copy size={14} />}
                        </button>
                      </div>
                      <input style={styles.input} value={resultado.fechaPresentacion} onChange={(e) => setResultado({ ...resultado, fechaPresentacion: e.target.value })} />
                    </div>

                    <div>
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
                        <label style={styles.labelLeft}>Fecha de recepción</label>
                        <button type="button" style={copyStyle("fechaRecepcion")} onClick={() => copiarTexto(resultado.fechaRecepcion, "fechaRecepcion")}>
                          {copiado === "fechaRecepcion" ? <Check size={14} /> : <Copy size={14} />}
                        </button>
                      </div>
                      <input style={styles.input} value={resultado.fechaRecepcion} onChange={(e) => setResultado({ ...resultado, fechaRecepcion: e.target.value })} />
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