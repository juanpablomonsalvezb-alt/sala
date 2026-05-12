import Anthropic from "@anthropic-ai/sdk";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

const TOPICS = [
  {
    slug: "politica-monetaria",
    label: "Política Monetaria",
    description: "Análisis de tasas de interés, inflación y decisiones de bancos centrales",
  },
  {
    slug: "reforma-tributaria",
    label: "Reforma Tributaria",
    description: "Análisis de cambios en legislación fiscal y su impacto en empresas y personas",
  },
  {
    slug: "mercado-inmobiliario",
    label: "Mercado Inmobiliario",
    description: "Tendencias de precios, inversión y regulación del mercado de vivienda",
  },
  {
    slug: "sistema-de-salud",
    label: "Sistema de Salud",
    description: "Análisis del sistema sanitario, políticas de salud pública y cobertura médica",
  },
  {
    slug: "mercado-laboral",
    label: "Mercado Laboral",
    description: "Análisis del empleo, salarios, desempleo y tendencias del trabajo",
  },
  {
    slug: "finanzas-personales",
    label: "Finanzas Personales",
    description: "Guías de ahorro, inversión, deuda y planificación financiera personal",
  },
  {
    slug: "derecho-laboral",
    label: "Derecho Laboral",
    description: "Análisis de normativa laboral, contratos, despidos y derechos del trabajador",
  },
  {
    slug: "inversiones",
    label: "Inversiones",
    description: "Análisis de instrumentos de inversión, bolsa, fondos y activos alternativos",
  },
  {
    slug: "pensiones",
    label: "Sistema de Pensiones",
    description: "Análisis de AFP, pensiones y reforma previsional",
  },
  {
    slug: "derecho-corporativo",
    label: "Derecho Corporativo",
    description: "Análisis de regulación empresarial, contratos y estructuras societarias",
  },
  {
    slug: "macroeconomia",
    label: "Macroeconomía",
    description: "Análisis del crecimiento económico, PIB, inflación y ciclos económicos",
  },
  {
    slug: "salud-publica",
    label: "Salud Pública",
    description: "Epidemiología, políticas sanitarias y prevención de enfermedades",
  },
  {
    slug: "emprendimiento",
    label: "Emprendimiento",
    description: "Análisis del ecosistema emprendedor, financiamiento y estrategia de startups",
  },
  {
    slug: "comercio-exterior",
    label: "Comercio Exterior",
    description: "Análisis de exportaciones, importaciones, aranceles y tratados comerciales",
  },
  {
    slug: "nutricion-clinica",
    label: "Nutrición Clínica",
    description: "Análisis nutricional basado en evidencia, dietas y salud metabólica",
  },
];

async function generatePillarContent(topic) {
  const prompt = `Eres un experto especialista en ${topic.label}.

Escribe una guía de referencia exhaustiva (pillar page) sobre ${topic.label}.

Estructura la guía en las siguientes secciones:

1. INTRODUCCIÓN (100-150 palabras)
   - Definir claramente el concepto
   - Importancia actual en Latinoamérica

2. CONCEPTOS FUNDAMENTALES (200-250 palabras)
   - 3-4 conceptos clave explicados en detalle
   - Relaciones entre conceptos

3. TENDENCIAS Y CONTEXTO ACTUAL (200-250 palabras)
   - Situación actual en 2025/2026
   - Cambios recientes relevantes
   - Impacto regional

4. ANÁLISIS POR PERSPECTIVA (250-300 palabras)
   - Perspectiva empresarial
   - Perspectiva personal/individual
   - Perspectiva regulatoria/gobierno

5. CASOS DE APLICACIÓN PRÁCTICA (200-250 palabras)
   - 2-3 ejemplos concretos
   - Cómo aplicar en la realidad

6. ERRORES COMUNES (150-200 palabras)
   - Los 3 errores más frecuentes
   - Por qué ocurren
   - Cómo evitarlos

7. RECURSOS Y PROFUNDIZACIÓN (100-150 palabras)
   - Cómo aprender más
   - Dónde encontrar expertos

Usa HTML simple para formato (solo <p>, <strong>, <ul>, <li>, <h3>).
Tono: profesional pero accesible, dirigido a tomadores de decisión.
Idioma: español latinoamericano (neutro, sin argentinismos).`;

  console.log(`Generando contenido para: ${topic.label}...`);

  const message = await client.messages.create({
    model: "claude-opus-4-7",
    max_tokens: 2048,
    messages: [
      {
        role: "user",
        content: prompt,
      },
    ],
  });

  return message.content[0].type === "text" ? message.content[0].text : "";
}

async function generateAllPillars() {
  const pillars = {};

  for (const topic of TOPICS) {
    try {
      const content = await generatePillarContent(topic);
      pillars[topic.slug] = {
        slug: topic.slug,
        title: topic.label,
        content: content,
        generatedAt: new Date().toISOString(),
      };
      console.log(`✓ ${topic.label}`);
    } catch (error) {
      console.error(`✗ Error generando ${topic.label}:`, error.message);
    }
  }

  const outputPath = path.join(__dirname, "../src/data/generated-content/pillars.json");
  fs.writeFileSync(outputPath, JSON.stringify(pillars, null, 2));
  console.log(`\n✅ Contenido pillar guardado en: ${outputPath}`);
  console.log(`📊 Total de pillar pages generadas: ${Object.keys(pillars).length}`);
}

generateAllPillars().catch(console.error);
