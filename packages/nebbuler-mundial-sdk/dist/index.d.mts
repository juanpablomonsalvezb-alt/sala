/**
 * Nebbuler Mundial SDK
 * Open API client for the FIFA World Cup 2026 (Nebbuler's open data, CC-BY 4.0).
 *
 * Docs: https://nebbuler.com/api/mundial/v1/docs
 */
declare const NEBBULER_API_BASE = "https://nebbuler.com/api/mundial/v1";
interface Torneo {
    nombre: string;
    fecha_inicio: string;
    fecha_fin: string;
    sedes: string[];
    selecciones: number;
    partidos: number;
}
interface Grupo {
    id: string;
    cabeza_serie: string;
    selecciones: string[];
    nota?: string;
}
interface Sede {
    ciudad: string;
    pais: string;
    estadio: string;
    capacidad: number;
    rol?: string;
}
interface Seleccion {
    pais: string;
    slug: string;
    apodo: string;
    bandera: string;
    moneda: string;
    moneda_simbolo: string;
    audiencia_estimada: string;
    creadores_potenciales: number;
    urls?: {
        landing: string;
        widget: string;
        og_image: string;
    };
}
interface ProgramaLaSombra {
    nombre: string;
    subtitle: string;
    comision_periodo: string;
    vigencia: string;
    beneficios: string[];
}
interface SdkOptions {
    baseUrl?: string;
    fetch?: typeof fetch;
    cache?: RequestCache;
}
/** Full dataset (meta + endpoints + data + selecciones LATAM + programa). */
declare function getMundialData(opts?: SdkOptions): Promise<{
    meta: Record<string, unknown>;
    endpoints: Record<string, string>;
    data: {
        torneo: Torneo;
        grupos: Grupo[];
        sedes: Sede[];
        mascotas: unknown[];
    };
    selecciones_latam_nebbuler: Seleccion[];
    programa_la_sombra: ProgramaLaSombra;
}>;
/** Just the tournament metadata. */
declare function getTorneo(opts?: SdkOptions): Promise<{
    torneo: Torneo;
    trofeo: unknown;
    campeon_vigente: string;
}>;
/** All 12 groups. */
declare function getGrupos(opts?: SdkOptions): Promise<Grupo[]>;
/** Single group by ID (a..l, case-insensitive). */
declare function getGrupo(id: string, opts?: SdkOptions): Promise<Grupo>;
/** All 16 host venues. */
declare function getSedes(opts?: SdkOptions): Promise<Sede[]>;
/** All Nebbuler-tracked LATAM teams (Argentina, Brasil, Mexico, ...). */
declare function getSelecciones(opts?: SdkOptions): Promise<Seleccion[]>;
/** Single LATAM team by slug (argentina, brasil, mexico, colombia, uruguay, ecuador, chile, peru). */
declare function getSeleccion(slug: string, opts?: SdkOptions): Promise<Seleccion>;
/** Programa La Sombra (Nebbuler's World Cup creator program). */
declare function getProgramaLaSombra(opts?: SdkOptions): Promise<{
    programa: ProgramaLaSombra;
    mundial: {
        dias_restantes: number;
        fecha_inicio: string;
        fecha_fin: string;
    };
    aplicar: {
        whatsapp: string;
        email: string;
        landing: string;
    };
}>;

export { type Grupo, NEBBULER_API_BASE, type ProgramaLaSombra, type SdkOptions, type Sede, type Seleccion, type Torneo, getGrupo, getGrupos, getMundialData, getProgramaLaSombra, getSedes, getSeleccion, getSelecciones, getTorneo };
