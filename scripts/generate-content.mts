#!/usr/bin/env node
import Anthropic from "@anthropic-ai/sdk";
import * as fs from "fs";
import * as path from "path";

// Cargar variables de entorno desde .env.local
let apiKey = process.env.ANTHROPIC_API_KEY;
const envPath = path.join(process.cwd(), ".env.local");
if (!apiKey && fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, "utf-8");
  const match = envContent.match(/ANTHROPIC_API_KEY="?([^"]+)"?/);
  if (match) {
    apiKey = match[1];
  }
}

if (!apiKey) {
  console.error("❌ ANTHROPIC_API_KEY no está configurada");
  process.exit(1);
}

const client = new Anthropic({
  apiKey,
});

interface ContentRecord {
  slug: string;
  title: string;
  content: string;
  generatedAt: string;
}

const OUTPUT_DIR = path.join(process.cwd(), "src", "data", "generated-content");

async function ensureDir(dir: string) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

async function generateGuideContent(
  slug: string,
  title: string,
  profession: string,
  description: string
): Promise<string> {
  const systemPrompt = `Eres un experto en marketing de contenido para profesionales independientes.
Tu tarea es escribir guías SEO-optimizadas que conviertan lectores en creadores de contenido.
Usa un tono cálido, empoderador y profesional. Incluye:
- Una introducción que valide el problema
- Secciones con headings HTML (h2, h3)
- Datos y hechos reales sobre el mercado de contenido en LATAM
- Ejemplos prácticos y tangibles
- Párrafos de 2-3 oraciones máximo
- Un call-to-action claro al final
Escribe entre 1200-1500 palabras. Incluye HTML semántico (p, h2, h3, strong, em, ul, li).
No incluyas el título ni el frontmatter.`;

  const userPrompt = `Genera una guía completa sobre: "${title}"

Contexto:
- Profesión objetivo: ${profession}
- Descripción breve: ${description}
- Objetivo: Convencer a ${profession}s potenciales de publicar contenido en Nebbuler
- Plataforma: Nebbuler (0% comisión, tarifa fija $29.990 CLP/mes)
- Mercado: América Latina (18 países, múltiples monedas)

Estructura sugerida:
1. Introduce el problema: ¿por qué ${profession}s deberían monetizar su conocimiento?
2. ¿Qué pueden publicar? (tipos de contenido específicos para esta profesión)
3. El mercado: oportunidad en LATAM, demanda real, benchmarks
4. Por qué Nebbuler: diferenciadores clave vs Substack/Beehiiv
5. Cómo empezar: paso a paso, sin fricción
6. FAQ: 2-3 preguntas frecuentes

Usa datos reales y cita benchmarks si es posible (ej: "según XYZ...").
Mantén un tono de profesional empoderador, no de marketing agresivo.`;

  const response = await client.messages.create({
    model: "claude-haiku-4-5-20251001",
    max_tokens: 1800,
    system: systemPrompt,
    messages: [{ role: "user", content: userPrompt }],
  });

  const content =
    response.content[0].type === "text" ? response.content[0].text : "";
  return content;
}

async function generateAnalysisContent(
  topicSlug: string,
  topicLabel: string,
  marketLabel: string,
  discipline: string,
  description: string
): Promise<string> {
  const systemPrompt = `Eres un editor especialista en análisis profesionales.
Tu tarea es escribir análisis de experto sobre temas específicos en mercados de LATAM.
Usa un tono riguroso pero accesible. Estructura con headings claros (h2, h3).
Incluye:
- Una introducción que contextualiza el tema en el país específico
- Análisis en profundidad de 2-3 puntos clave
- Datos y cifras relevantes
- Implicaciones prácticas
- Perspectiva hacia el futuro

Escribe entre 1000-1300 palabras. Usa HTML semántico (p, h2, h3, strong, em, ul, li).
No incluyas el título.`;

  const userPrompt = `Genera un análisis profundo sobre:

TEMA: ${topicLabel}
PAÍS: ${marketLabel}
DISCIPLINA: ${discipline}
DESCRIPCIÓN: ${description}

Este análisis será publicado por expertos verificados en la plataforma Nebbuler.
Dirigido a profesionales y tomadores de decisiones en ${marketLabel}.

Estructura:
1. Contexto actual en ${marketLabel}
2. Análisis técnico del tema (2-3 subtemas)
3. Implicaciones para empresas, profesionales y ciudadanos
4. Perspectiva a 12 meses
5. Recursos/referencias recomendadas

Mantén rigor académico pero sé accesible. Usa datos reales cuando sea posible.
Evita jerga innecesaria. Este es contenido premium que genera suscriptores de pago.`;

  const response = await client.messages.create({
    model: "claude-haiku-4-5-20251001",
    max_tokens: 1600,
    system: systemPrompt,
    messages: [{ role: "user", content: userPrompt }],
  });

  const content =
    response.content[0].type === "text" ? response.content[0].text : "";
  return content;
}

async function saveContent(
  category: string,
  slug: string,
  title: string,
  content: string
) {
  const categoryDir = path.join(OUTPUT_DIR, category);
  await ensureDir(categoryDir);

  const record: ContentRecord = {
    slug,
    title,
    content,
    generatedAt: new Date().toISOString(),
  };

  const filePath = path.join(categoryDir, `${slug}.json`);
  fs.writeFileSync(filePath, JSON.stringify(record, null, 2));
  console.log(`✓ Guardado: ${category}/${slug}`);
}

async function generateGuidesContent() {
  console.log("\n📝 Generando contenido para GUÍAS...\n");

  const guides = [
    {
      slug: "como-monetizar-conocimiento-economista",
      title: "Cómo monetizar tu conocimiento como economista",
      profession: "economista",
      description:
        "Guía para economistas que quieren publicar análisis y cobrar directamente",
    },
    {
      slug: "como-monetizar-conocimiento-abogado",
      title: "Cómo monetizar tu conocimiento como abogado",
      profession: "abogado",
      description:
        "Guía para abogados que quieren publicar análisis legales de pago",
    },
    {
      slug: "como-monetizar-conocimiento-medico",
      title: "Cómo monetizar tu conocimiento como médico",
      profession: "médico",
      description: "Guía para médicos que quieren publicar análisis clínicos",
    },
    {
      slug: "como-monetizar-conocimiento-contador",
      title: "Cómo monetizar tu conocimiento como contador",
      profession: "contador",
      description:
        "Guía para contadores que quieren publicar análisis financiero",
    },
    {
      slug: "como-monetizar-conocimiento-analista-financiero",
      title: "Cómo monetizar tu análisis financiero",
      profession: "analista financiero",
      description:
        "Guía para analistas que quieren cobrar por sus perspectivas",
    },
    {
      slug: "como-crear-newsletter-profesional",
      title: "Cómo crear una newsletter profesional de pago",
      profession: "cualquier profesional",
      description:
        "Guía completa sobre cómo estructurar y monetizar contenido profesional",
    },
    {
      slug: "nebbuler-vs-substack",
      title: "Nebbuler vs Substack: Comparativa 2026",
      profession: "creador de contenido profesional",
      description:
        "Análisis detallado de diferencias, precios y funcionalidades",
    },
    {
      slug: "nebbuler-vs-beehiiv",
      title: "Nebbuler vs Beehiiv: Cuál plataforma elegir",
      profession: "creador de contenido profesional",
      description:
        "Comparativa entre plataformas para creadores independientes",
    },
  ];

  for (const guide of guides) {
    try {
      const content = await generateGuideContent(
        guide.slug,
        guide.title,
        guide.profession,
        guide.description
      );
      await saveContent("guides", guide.slug, guide.title, content);
      await new Promise((r) => setTimeout(r, 1000)); // Rate limit: 1 segundo entre requests
    } catch (error) {
      console.error(`✗ Error generando ${guide.slug}:`, error);
    }
  }
}

async function generateTopicsContent() {
  console.log("\n📊 Generando contenido para TEMAS PRINCIPALES...\n");

  // Top 10 temas por volumen de búsqueda
  const topics = [
    {
      slug: "politica-monetaria",
      label: "Política Monetaria",
      discipline: "economia",
      description:
        "Análisis de tasas de interés, inflación y decisiones de bancos centrales",
    },
    {
      slug: "reforma-tributaria",
      label: "Reforma Tributaria",
      discipline: "derecho",
      description:
        "Análisis de cambios en legislación fiscal y su impacto en empresas",
    },
    {
      slug: "mercado-inmobiliario",
      label: "Mercado Inmobiliario",
      discipline: "finanzas",
      description:
        "Tendencias de precios, inversión y regulación del mercado de vivienda",
    },
    {
      slug: "sistema-de-salud",
      label: "Sistema de Salud",
      discipline: "medicina",
      description:
        "Análisis del sistema sanitario, políticas de salud pública y cobertura",
    },
    {
      slug: "mercado-laboral",
      label: "Mercado Laboral",
      discipline: "economia",
      description:
        "Análisis de empleo, salarios, tendencias de contratación y regulación",
    },
  ];

  const markets = ["chile", "colombia", "mexico", "argentina", "peru"];

  for (const topic of topics) {
    for (const market of markets) {
      try {
        const content = await generateAnalysisContent(
          `${topic.slug}-${market}`,
          topic.label,
          market.charAt(0).toUpperCase() + market.slice(1),
          topic.discipline,
          topic.description
        );
        await saveContent(
          "analysis",
          `${topic.slug}--${market}`,
          `${topic.label} en ${market}`,
          content
        );
        await new Promise((r) => setTimeout(r, 1000)); // Rate limit
      } catch (error) {
        console.error(
          `✗ Error generando ${topic.slug}--${market}:`,
          error
        );
      }
    }
  }
}

async function main() {
  console.log("🚀 Iniciando generación de contenido masivo con IA\n");
  console.log("PLAN:");
  console.log("  1. Guías (8 artículos) — Convertir creadores");
  console.log("  2. Análisis (50 artículos) — Top 10 temas × 5 países");
  console.log(
    "  3. Newsletter (próxima fase) — Resto de combinaciones\n"
  );

  await ensureDir(OUTPUT_DIR);

  try {
    await generateGuidesContent();
    console.log("\n✅ Guías completadas");

    await generateTopicsContent();
    console.log("\n✅ Análisis principales completados");

    console.log("\n🎉 Generación completada. Archivos guardados en:", OUTPUT_DIR);
    console.log("\nProximos pasos:");
    console.log(
      "  1. Actualizar src/app/guia/[slug]/page.tsx para consumir contenido generado"
    );
    console.log(
      "  2. Actualizar src/app/analisis/[tema]/[pais]/page.tsx para consumir contenido"
    );
    console.log("  3. Deploy a producción");
  } catch (error) {
    console.error("Error crítico:", error);
    process.exit(1);
  }
}

main();
