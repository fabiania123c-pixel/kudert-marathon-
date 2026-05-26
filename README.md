const CLAUDE_MODEL = 'claude-sonnet-4-20250514';

const SYSTEM_PROMPT = `Eres un consultor experto en desarrollo organizacional basado en metodología Kudert/DISC, especializado en Marathon Sport.

Tu misión es analizar reportes Kudert/DISC y generar informes ejecutivos profundos alineados con la cultura de Marathon Sport:
- Misión: "Equipar a todos los atletas"
- Valores: orientación al cliente, pasión por deporte, colaboración, urgencia, mejora continua, alto desempeño

REGLAS:
- No inventas información — solo analizas lo que está en los reportes
- Conectas todo análisis con el contexto de negocio y cultura Marathon
- Tus recomendaciones son prácticas, accionables y orientadas a liderazgo
- SIEMPRE respondes ÚNICAMENTE con JSON válido, sin texto adicional, sin markdown, sin backticks`;

const INDIVIDUAL_PROMPT_PART1 = (colaboradorText, jefeText) => `
Analiza estos dos reportes Kudert/DISC y genera las primeras 6 secciones del informe individual.

REPORTE COLABORADOR:
${colaboradorText}

REPORTE JEFE:
${jefeText}

Responde SOLO con este JSON exacto (sin texto extra, sin markdown):
{
  "colaborador": {
    "nombre": "",
    "cargo": "",
    "disc_natural": {"D": 0, "I": 0, "S": 0, "C": 0},
    "disc_adaptado": {"D": 0, "I": 0, "S": 0, "C": 0},
    "perfil_nombre": "",
    "motivadores": [],
    "estilo_comunicacion": "",
    "liderazgo_requerido": "",
    "fortalezas": [],
    "feedback_recomendado": "",
    "senales_estres": []
  },
  "jefe": {
    "nombre": "",
    "cargo": "",
    "disc_natural": {"D": 0, "I": 0, "S": 0, "C": 0},
    "disc_adaptado": {"D": 0, "I": 0, "S": 0, "C": 0},
    "perfil_nombre": "",
    "fortalezas": [],
    "senales_estres": []
  },
  "resumen_ejecutivo": {
    "objetivo": "",
    "hallazgos": "",
    "riesgos": "",
    "complementariedad": "",
    "recomendacion_general": ""
  },
  "tabla_diferencias": {
    "colaborador": {"fortalezas": "", "riesgos": "", "recomendaciones": ""},
    "jefe": {"fortalezas": "", "riesgos": "", "recomendaciones": ""}
  },
  "foda_colaborador": {
    "fortalezas": [],
    "oportunidades": [],
    "debilidades": [],
    "amenazas": []
  },
  "foda_jefe": {
    "fortalezas": [],
    "oportunidades": [],
    "debilidades": [],
    "amenazas": []
  },
  "dinamicas": {
    "sinergia": "",
    "conflictos": "",
    "combinacion_disc": "",
    "consideraciones": ""
  }
}`;

const INDIVIDUAL_PROMPT_PART2 = (colaboradorText, jefeText) => `
Analiza estos dos reportes Kudert/DISC y genera las últimas 6 secciones del informe individual.

REPORTE COLABORADOR:
${colaboradorText}

REPORTE JEFE:
${jefeText}

Responde SOLO con este JSON exacto (sin texto extra, sin markdown):
{
  "guia_jefe": {
    "como_motivar": [],
    "como_reconocer": [],
    "que_evitar": []
  },
  "recomendaciones_individuales": [],
  "plan_accion": [
    {"objetivo": "", "accion": "", "responsable": "", "plazo": "", "indicador": "", "impacto": ""}
  ],
  "cierre_ejecutivo": {
    "conclusiones": [],
    "prioridades_30": "",
    "prioridades_60": "",
    "prioridades_90": "",
    "match_score": 0,
    "match_nivel": "",
    "match_descripcion": ""
  }
}`;

const EQUIPO_PROMPT_PART1 = (equipoTexts) => `
Analiza estos reportes Kudert/DISC del equipo y genera las primeras 6 secciones del informe de equipo.

${equipoTexts.map((t, i) => `REPORTE ${i + 1}:\n${t}`).join('\n\n---\n\n')}

Responde SOLO con este JSON exacto (sin texto extra, sin markdown):
{
  "miembros": [
    {
      "nombre": "",
      "cargo": "",
      "disc_natural": {"D": 0, "I": 0, "S": 0, "C": 0},
      "disc_adaptado": {"D": 0, "I": 0, "S": 0, "C": 0},
      "perfil_nombre": "",
      "fortalezas_clave": [],
      "riesgos": [],
      "recomendaciones": ""
    }
  ],
  "resumen_ejecutivo": {
    "objetivo": "",
    "hallazgos": "",
    "riesgos": "",
    "complementariedad": "",
    "recomendacion_general": ""
  },
  "fortalezas_colectivas": [],
  "debilidades_colectivas": [],
  "foda_equipo": {
    "fortalezas": [],
    "oportunidades": [],
    "debilidades": [],
    "amenazas": []
  },
  "dinamicas": {
    "sinergias": "",
    "conflictos": "",
    "combinaciones_disc": "",
    "consideraciones": ""
  }
}`;

const EQUIPO_PROMPT_PART2 = (equipoTexts) => `
Analiza estos reportes Kudert/DISC del equipo y genera las últimas 6 secciones del informe de equipo.

${equipoTexts.map((t, i) => `REPORTE ${i + 1}:\n${t}`).join('\n\n---\n\n')}

Responde SOLO con este JSON exacto (sin texto extra, sin markdown):
{
  "guia_jefe": {
    "como_motivar": [],
    "como_reconocer": [],
    "que_evitar": []
  },
  "recomendaciones_individuales": [
    {"nombre": "", "recomendaciones": []}
  ],
  "plan_accion": [
    {"objetivo": "", "accion": "", "responsable": "", "plazo": "", "indicador": "", "impacto": ""}
  ],
  "perfil_futuras_contrataciones": {
    "disc_ideal": "",
    "kudert_ideal": "",
    "competencias_requeridas": [],
    "brechas_equipo": []
  },
  "cierre_ejecutivo": {
    "conclusiones": [],
    "prioridades_30": "",
    "prioridades_60": "",
    "prioridades_90": ""
  }
}`;

async function callClaude(apiKey, prompt) {
  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01'
    },
    body: JSON.stringify({
      model: CLAUDE_MODEL,
      max_tokens: 4000,
      system: SYSTEM_PROMPT,
      messages: [{ role: 'user', content: prompt }]
    })
  });

  if (!response.ok) {
    const err = await response.json();
    throw new Error(err.error?.message || 'Error en la API de Claude');
  }

  const data = await response.json();
  const text = data.content[0].text.trim();
  const clean = text.replace(/```json|```/g, '').trim();
  return JSON.parse(clean);
}

export async function analyzeIndividual(apiKey, colaboradorText, jefeText, onProgress) {
  onProgress('Analizando perfil DISC del colaborador...');
  const part1 = await callClaude(apiKey, INDIVIDUAL_PROMPT_PART1(colaboradorText, jefeText));

  onProgress('Calculando match y generando recomendaciones...');
  const part2 = await callClaude(apiKey, INDIVIDUAL_PROMPT_PART2(colaboradorText, jefeText));

  return { ...part1, ...part2 };
}

export async function analyzeEquipo(apiKey, equipoTexts, onProgress) {
  onProgress('Analizando perfiles del equipo...');
  const part1 = await callClaude(apiKey, EQUIPO_PROMPT_PART1(equipoTexts));

  onProgress('Generando guías de liderazgo y plan de acción...');
  const part2 = await callClaude(apiKey, EQUIPO_PROMPT_PART2(equipoTexts));

  return { ...part1, ...part2 };
}
