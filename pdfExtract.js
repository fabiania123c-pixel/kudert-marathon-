import React, { useState, useCallback } from 'react';
import { extractTextFromPDF } from './utils/pdfExtract';
import { analyzeIndividual, analyzeEquipo } from './utils/claudeApi';
import { generateIndividualPDF, generateEquipoPDF } from './utils/pdfGenerator';

const NAVY = '#0d1b3e';
const BLUE = '#1B4B8A';

const styles = {
  app: {
    minHeight: '100vh',
    background: '#f5f6fa',
    fontFamily: '"DM Sans", sans-serif',
    color: '#1f2937'
  },
  header: {
    background: NAVY,
    padding: '16px 32px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    boxShadow: '0 2px 12px rgba(13,27,62,0.15)'
  },
  headerTitle: {
    color: '#fff',
    fontSize: '18px',
    fontWeight: '600',
    margin: 0
  },
  headerSub: {
    color: '#93c5fd',
    fontSize: '12px',
    marginTop: '2px'
  },
  badge: {
    background: 'rgba(255,255,255,0.1)',
    color: '#93c5fd',
    padding: '4px 12px',
    borderRadius: '20px',
    fontSize: '12px',
    border: '1px solid rgba(255,255,255,0.15)'
  },
  main: {
    maxWidth: '860px',
    margin: '0 auto',
    padding: '40px 24px'
  },
  card: {
    background: '#fff',
    borderRadius: '16px',
    padding: '32px',
    boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
    border: '1px solid #e5e7eb',
    marginBottom: '20px'
  },
  sectionTitle: {
    fontSize: '13px',
    fontWeight: '600',
    color: NAVY,
    marginBottom: '16px',
    textTransform: 'uppercase',
    letterSpacing: '0.05em'
  },
  typeGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '16px',
    marginBottom: '24px'
  },
  typeCard: (active) => ({
    border: active ? `2px solid ${NAVY}` : '1.5px solid #e5e7eb',
    borderRadius: '12px',
    padding: '20px',
    cursor: 'pointer',
    background: active ? '#f0f4ff' : '#fff',
    transition: 'all 0.15s',
    textAlign: 'left'
  }),
  typeIcon: {
    width: '40px',
    height: '40px',
    borderRadius: '10px',
    background: NAVY,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: '12px',
    fontSize: '18px'
  },
  typeTitle: {
    fontSize: '15px',
    fontWeight: '600',
    color: NAVY,
    marginBottom: '4px'
  },
  typeDesc: {
    fontSize: '12px',
    color: '#6b7280'
  },
  uploadZone: (active) => ({
    border: `2px dashed ${active ? BLUE : '#d1d5db'}`,
    borderRadius: '12px',
    padding: '28px',
    textAlign: 'center',
    background: active ? '#eff6ff' : '#fafafa',
    cursor: 'pointer',
    transition: 'all 0.2s',
    marginBottom: '12px'
  }),
  uploadIcon: {
    fontSize: '28px',
    marginBottom: '8px'
  },
  uploadTitle: {
    fontSize: '14px',
    fontWeight: '500',
    color: '#374151',
    marginBottom: '4px'
  },
  uploadSub: {
    fontSize: '12px',
    color: '#9ca3af'
  },
  fileChip: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '6px',
    background: '#eff6ff',
    border: '1px solid #bfdbfe',
    borderRadius: '8px',
    padding: '6px 12px',
    fontSize: '12px',
    color: BLUE,
    fontWeight: '500',
    margin: '4px'
  },
  removeBtn: {
    background: 'none',
    border: 'none',
    color: '#9ca3af',
    cursor: 'pointer',
    fontSize: '14px',
    lineHeight: 1,
    padding: '0 0 0 4px'
  },
  input: {
    width: '100%',
    padding: '10px 14px',
    borderRadius: '8px',
    border: '1.5px solid #e5e7eb',
    fontSize: '13px',
    fontFamily: '"DM Sans", sans-serif',
    outline: 'none',
    boxSizing: 'border-box',
    background: '#fafafa'
  },
  label: {
    fontSize: '12px',
    fontWeight: '600',
    color: '#374151',
    marginBottom: '6px',
    display: 'block'
  },
  btnPrimary: (disabled) => ({
    background: disabled ? '#9ca3af' : NAVY,
    color: '#fff',
    border: 'none',
    borderRadius: '10px',
    padding: '13px 28px',
    fontSize: '14px',
    fontWeight: '600',
    cursor: disabled ? 'not-allowed' : 'pointer',
    width: '100%',
    transition: 'all 0.15s',
    fontFamily: '"DM Sans", sans-serif'
  }),
  progress: {
    background: '#fff',
    borderRadius: '16px',
    padding: '40px 32px',
    boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
    border: '1px solid #e5e7eb',
    textAlign: 'center'
  },
  spinner: {
    width: '48px',
    height: '48px',
    border: `4px solid #e5e7eb`,
    borderTop: `4px solid ${NAVY}`,
    borderRadius: '50%',
    animation: 'spin 0.8s linear infinite',
    margin: '0 auto 20px'
  },
  progressTitle: {
    fontSize: '16px',
    fontWeight: '600',
    color: NAVY,
    marginBottom: '8px'
  },
  progressStep: {
    fontSize: '13px',
    color: '#6b7280'
  },
  progressBar: {
    height: '4px',
    background: '#e5e7eb',
    borderRadius: '4px',
    margin: '20px 0 0',
    overflow: 'hidden'
  },
  progressFill: (pct) => ({
    height: '100%',
    background: `linear-gradient(90deg, ${NAVY}, ${BLUE})`,
    width: `${pct}%`,
    borderRadius: '4px',
    transition: 'width 0.5s ease'
  }),
  successCard: {
    background: '#fff',
    borderRadius: '16px',
    padding: '40px 32px',
    boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
    border: '1px solid #e5e7eb',
    textAlign: 'center'
  },
  successIcon: {
    width: '64px',
    height: '64px',
    background: '#f0f9ff',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    margin: '0 auto 16px',
    fontSize: '28px'
  },
  successTitle: {
    fontSize: '20px',
    fontWeight: '700',
    color: NAVY,
    marginBottom: '8px'
  },
  successSub: {
    fontSize: '13px',
    color: '#6b7280',
    marginBottom: '28px'
  },
  downloadBtn: {
    background: NAVY,
    color: '#fff',
    border: 'none',
    borderRadius: '10px',
    padding: '13px 32px',
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'pointer',
    display: 'inline-flex',
    alignItems: 'center',
    gap: '8px',
    fontFamily: '"DM Sans", sans-serif',
    marginBottom: '12px'
  },
  newBtn: {
    background: 'none',
    color: NAVY,
    border: `1.5px solid ${NAVY}`,
    borderRadius: '10px',
    padding: '12px 28px',
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'pointer',
    fontFamily: '"DM Sans", sans-serif',
    marginLeft: '12px'
  },
  errorBox: {
    background: '#fef2f2',
    border: '1px solid #fecaca',
    borderRadius: '10px',
    padding: '14px 16px',
    color: '#b91c1c',
    fontSize: '13px',
    marginBottom: '16px'
  }
};

const STEPS = [
  'Leyendo reportes Kudert...',
  'Analizando perfiles DISC...',
  'Calculando compatibilidad...',
  'Detectando motivadores y señales de estrés...',
  'Generando guía para el jefe...',
  'Construyendo plan de acción...',
  'Generando PDF...'
];

export default function App() {
  const [type, setType] = useState('individual');
  const [apiKey, setApiKey] = useState('');
  const [colFile, setColFile] = useState(null);
  const [jefeFile, setJefeFile] = useState(null);
  const [equipoFiles, setEquipoFiles] = useState([]);
  const [state, setState] = useState('idle'); // idle | processing | done | error
  const [stepIdx, setStepIdx] = useState(0);
  const [error, setError] = useState('');
  const [pdfBlob, setPdfBlob] = useState(null);
  const [pdfName, setPdfName] = useState('');
  const [drag, setDrag] = useState('');

  const canSubmit = apiKey.trim().length > 10 && (
    type === 'individual' ? (colFile && jefeFile) : equipoFiles.length >= 2
  );

  function handleColDrop(e) {
    e.preventDefault();
    setDrag('');
    const f = e.dataTransfer?.files?.[0] || e.target?.files?.[0];
    if (f && f.type === 'application/pdf') setColFile(f);
  }

  function handleJefeDrop(e) {
    e.preventDefault();
    setDrag('');
    const f = e.dataTransfer?.files?.[0] || e.target?.files?.[0];
    if (f && f.type === 'application/pdf') setJefeFile(f);
  }

  function handleEquipoDrop(e) {
    e.preventDefault();
    setDrag('');
    const files = Array.from(e.dataTransfer?.files || e.target?.files || []).filter(f => f.type === 'application/pdf');
    setEquipoFiles(prev => [...prev, ...files].slice(0, 8));
  }

  async function handleSubmit() {
    if (!canSubmit) return;
    setState('processing');
    setStepIdx(0);
    setError('');

    try {
      let stepCount = 0;
      const onProgress = (msg) => {
        setStepIdx(stepCount++);
      };

      let analysisData;
      if (type === 'individual') {
        setStepIdx(0);
        const colText = await extractTextFromPDF(colFile);
        setStepIdx(1);
        const jefeText = await extractTextFromPDF(jefeFile);
        setStepIdx(2);
        analysisData = await analyzeIndividual(apiKey, colText, jefeText, onProgress);
        setStepIdx(5);
        const blob = await generateIndividualPDF(analysisData);
        setStepIdx(6);
        setPdfBlob(blob);
        setPdfName(`Informe_Individual_${Date.now()}.pdf`);
      } else {
        setStepIdx(0);
        const texts = [];
        for (let i = 0; i < equipoFiles.length; i++) {
          setStepIdx(i + 1);
          texts.push(await extractTextFromPDF(equipoFiles[i]));
        }
        setStepIdx(3);
        analysisData = await analyzeEquipo(apiKey, texts, onProgress);
        setStepIdx(5);
        const blob = await generateEquipoPDF(analysisData);
        setStepIdx(6);
        setPdfBlob(blob);
        setPdfName(`Informe_Equipo_${Date.now()}.pdf`);
      }

      setState('done');
    } catch (err) {
      console.error(err);
      setError(err.message || 'Error al procesar. Verifica tu API key e intenta de nuevo.');
      setState('error');
    }
  }

  function downloadPDF() {
    if (!pdfBlob) return;
    const url = URL.createObjectURL(pdfBlob);
    const a = document.createElement('a');
    a.href = url;
    a.download = pdfName;
    a.click();
    URL.revokeObjectURL(url);
  }

  function reset() {
    setState('idle');
    setColFile(null);
    setJefeFile(null);
    setEquipoFiles([]);
    setPdfBlob(null);
    setError('');
    setStepIdx(0);
  }

  return (
    <div style={styles.app}>
      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        * { box-sizing: border-box; }
        input[type=file] { display: none; }
      `}</style>

      {/* HEADER */}
      <div style={styles.header}>
        <div>
          <div style={styles.headerTitle}>Marathon Sport · People Intelligence</div>
          <div style={styles.headerSub}>Análisis Kudert / DISC — Powered by Claude AI</div>
        </div>
        <div style={styles.badge}>🎽 People Analytics</div>
      </div>

      <div style={styles.main}>

        {/* IDLE STATE */}
        {(state === 'idle' || state === 'error') && (
          <>
            {/* TIPO DE ANÁLISIS */}
            <div style={styles.card}>
              <div style={styles.sectionTitle}>¿Qué quieres analizar?</div>
              <div style={styles.typeGrid}>
                <button style={styles.typeCard(type === 'individual')} onClick={() => setType('individual')}>
                  <div style={styles.typeIcon}>👤</div>
                  <div style={styles.typeTitle}>Informe Individual</div>
                  <div style={styles.typeDesc}>Analiza un colaborador y su match con el jefe. Incluye score de compatibilidad.</div>
                </button>
                <button style={styles.typeCard(type === 'equipo')} onClick={() => setType('equipo')}>
                  <div style={styles.typeIcon}>👥</div>
                  <div style={styles.typeTitle}>Informe de Equipo</div>
                  <div style={styles.typeDesc}>Analiza todo el equipo. Dinámicas, FODA colectivo y plan de acción.</div>
                </button>
              </div>

              {/* UPLOAD INDIVIDUAL */}
              {type === 'individual' && (
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '0' }}>
                  <div>
                    <div style={styles.label}>PDF del Colaborador</div>
                    <label>
                      <input type="file" accept=".pdf" onChange={handleColDrop} />
                      <div
                        style={styles.uploadZone(drag === 'col' || !!colFile)}
                        onDragOver={(e) => { e.preventDefault(); setDrag('col'); }}
                        onDragLeave={() => setDrag('')}
                        onDrop={handleColDrop}
                      >
                        {colFile ? (
                          <>
                            <div style={{ fontSize: '24px', marginBottom: '6px' }}>📄</div>
                            <div style={{ ...styles.uploadTitle, color: BLUE }}>{colFile.name}</div>
                            <div style={styles.uploadSub}>Haz clic para cambiar</div>
                          </>
                        ) : (
                          <>
                            <div style={styles.uploadIcon}>📁</div>
                            <div style={styles.uploadTitle}>Subir PDF colaborador</div>
                            <div style={styles.uploadSub}>Arrastra o haz clic</div>
                          </>
                        )}
                      </div>
                    </label>
                  </div>
                  <div>
                    <div style={styles.label}>PDF del Jefe</div>
                    <label>
                      <input type="file" accept=".pdf" onChange={handleJefeDrop} />
                      <div
                        style={styles.uploadZone(drag === 'jefe' || !!jefeFile)}
                        onDragOver={(e) => { e.preventDefault(); setDrag('jefe'); }}
                        onDragLeave={() => setDrag('')}
                        onDrop={handleJefeDrop}
                      >
                        {jefeFile ? (
                          <>
                            <div style={{ fontSize: '24px', marginBottom: '6px' }}>📄</div>
                            <div style={{ ...styles.uploadTitle, color: BLUE }}>{jefeFile.name}</div>
                            <div style={styles.uploadSub}>Haz clic para cambiar</div>
                          </>
                        ) : (
                          <>
                            <div style={styles.uploadIcon}>📁</div>
                            <div style={styles.uploadTitle}>Subir PDF jefe</div>
                            <div style={styles.uploadSub}>Arrastra o haz clic</div>
                          </>
                        )}
                      </div>
                    </label>
                  </div>
                </div>
              )}

              {/* UPLOAD EQUIPO */}
              {type === 'equipo' && (
                <div>
                  <div style={styles.label}>PDFs del Equipo (mínimo 2, máximo 8)</div>
                  <label>
                    <input type="file" accept=".pdf" multiple onChange={handleEquipoDrop} />
                    <div
                      style={styles.uploadZone(drag === 'equipo')}
                      onDragOver={(e) => { e.preventDefault(); setDrag('equipo'); }}
                      onDragLeave={() => setDrag('')}
                      onDrop={handleEquipoDrop}
                    >
                      <div style={styles.uploadIcon}>📁</div>
                      <div style={styles.uploadTitle}>Subir PDFs del equipo</div>
                      <div style={styles.uploadSub}>Arrastra varios archivos o haz clic · {equipoFiles.length}/8 cargados</div>
                    </div>
                  </label>
                  {equipoFiles.length > 0 && (
                    <div style={{ marginTop: '8px' }}>
                      {equipoFiles.map((f, i) => (
                        <span key={i} style={styles.fileChip}>
                          📄 {f.name}
                          <button style={styles.removeBtn} onClick={() => setEquipoFiles(prev => prev.filter((_, j) => j !== i))}>×</button>
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* API KEY */}
            <div style={styles.card}>
              <div style={styles.sectionTitle}>Configuración</div>
              <div style={styles.label}>API Key de Claude (Anthropic)</div>
              <input
                type="password"
                placeholder="sk-ant-api03-..."
                value={apiKey}
                onChange={e => setApiKey(e.target.value)}
                style={styles.input}
              />
              <div style={{ fontSize: '11px', color: '#9ca3af', marginTop: '6px' }}>
                Tu API key no se guarda. Solo se usa durante esta sesión para generar el informe.
              </div>
            </div>

            {/* ERROR */}
            {state === 'error' && (
              <div style={styles.errorBox}>
                ⚠ {error}
              </div>
            )}

            {/* SUBMIT */}
            <button style={styles.btnPrimary(!canSubmit)} onClick={handleSubmit} disabled={!canSubmit}>
              {canSubmit ? '⚡ Generar Informe Kudert/DISC' : 'Completa todos los campos para continuar'}
            </button>
          </>
        )}

        {/* PROCESSING STATE */}
        {state === 'processing' && (
          <div style={styles.progress}>
            <div style={styles.spinner}></div>
            <div style={styles.progressTitle}>Analizando con Claude AI</div>
            <div style={styles.progressStep}>{STEPS[Math.min(stepIdx, STEPS.length - 1)]}</div>
            <div style={styles.progressBar}>
              <div style={styles.progressFill(Math.round((stepIdx / (STEPS.length - 1)) * 100))}></div>
            </div>
            <div style={{ fontSize: '11px', color: '#9ca3af', marginTop: '12px' }}>
              Esto puede tardar 1-2 minutos. No cierres esta ventana.
            </div>
          </div>
        )}

        {/* DONE STATE */}
        {state === 'done' && (
          <div style={styles.successCard}>
            <div style={styles.successIcon}>✅</div>
            <div style={styles.successTitle}>¡Informe generado con éxito!</div>
            <div style={styles.successSub}>
              Tu informe Kudert/DISC está listo. Descárgalo y compártelo con los líderes.
            </div>
            <button style={styles.downloadBtn} onClick={downloadPDF}>
              ⬇ Descargar PDF
            </button>
            <button style={styles.newBtn} onClick={reset}>
              + Nuevo análisis
            </button>
          </div>
        )}

      </div>
    </div>
  );
}
