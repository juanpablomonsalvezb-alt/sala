// Gradients por selección — colores aproximados de cada bandera
// para usar como fondo de las trading cards.

export interface PaletaSeleccion {
  primary: string
  secondary: string
  text: string // 'light' o 'dark' para contraste sobre el primary
}

export const PALETAS: Record<string, PaletaSeleccion> = {
  // LATAM
  Argentina: { primary: '#75AADB', secondary: '#FFD700', text: 'dark' },
  Brasil: { primary: '#FFDF00', secondary: '#009C3B', text: 'dark' },
  México: { primary: '#006847', secondary: '#CE1126', text: 'light' },
  Mexico: { primary: '#006847', secondary: '#CE1126', text: 'light' },
  Colombia: { primary: '#FCD116', secondary: '#003893', text: 'dark' },
  Uruguay: { primary: '#0038A8', secondary: '#FFCC00', text: 'light' },
  Ecuador: { primary: '#FFD700', secondary: '#0038A8', text: 'dark' },
  Chile: { primary: '#0033A0', secondary: '#D52B1E', text: 'light' },
  Perú: { primary: '#D91023', secondary: '#FFFFFF', text: 'light' },
  Peru: { primary: '#D91023', secondary: '#FFFFFF', text: 'light' },
  Paraguay: { primary: '#0038A8', secondary: '#D52B1E', text: 'light' },
  // Europa top
  Francia: { primary: '#0055A4', secondary: '#EF4135', text: 'light' },
  España: { primary: '#AA151B', secondary: '#F1BF00', text: 'light' },
  Inglaterra: { primary: '#FFFFFF', secondary: '#CE1124', text: 'dark' },
  Alemania: { primary: '#000000', secondary: '#DD0000', text: 'light' },
  Portugal: { primary: '#046A38', secondary: '#DA291C', text: 'light' },
  Italia: { primary: '#008C45', secondary: '#0066CC', text: 'light' },
  'Países Bajos': { primary: '#FF5C00', secondary: '#21468B', text: 'light' },
  Holanda: { primary: '#FF5C00', secondary: '#21468B', text: 'light' },
  Croacia: { primary: '#FF0000', secondary: '#FFFFFF', text: 'light' },
  Suiza: { primary: '#DA291C', secondary: '#FFFFFF', text: 'light' },
  Bélgica: { primary: '#000000', secondary: '#FED111', text: 'light' },
  Austria: { primary: '#ED2939', secondary: '#FFFFFF', text: 'light' },
  Noruega: { primary: '#BA0C2F', secondary: '#00205B', text: 'light' },
  'República Checa': { primary: '#11457E', secondary: '#D7141A', text: 'light' },
  // Asia
  'Corea del Sur': { primary: '#003478', secondary: '#C60C30', text: 'light' },
  Japón: { primary: '#BC002D', secondary: '#FFFFFF', text: 'light' },
  'Arabia Saudita': { primary: '#006C35', secondary: '#FFFFFF', text: 'light' },
  Catar: { primary: '#8B1538', secondary: '#FFFFFF', text: 'light' },
  Qatar: { primary: '#8B1538', secondary: '#FFFFFF', text: 'light' },
  Irán: { primary: '#239F40', secondary: '#DA0000', text: 'light' },
  Iran: { primary: '#239F40', secondary: '#DA0000', text: 'light' },
  Irak: { primary: '#CE1126', secondary: '#000000', text: 'light' },
  Uzbekistán: { primary: '#1EB53A', secondary: '#0099B5', text: 'light' },
  Jordania: { primary: '#007A3D', secondary: '#CE1126', text: 'light' },
  Australia: { primary: '#FFCD00', secondary: '#0C2340', text: 'dark' },
  'Nueva Zelanda': { primary: '#012169', secondary: '#C8102E', text: 'light' },
  // África
  Marruecos: { primary: '#C1272D', secondary: '#006233', text: 'light' },
  Senegal: { primary: '#00853F', secondary: '#FDEF42', text: 'light' },
  'Costa de Marfil': { primary: '#FF8200', secondary: '#009E60', text: 'light' },
  Túnez: { primary: '#E70013', secondary: '#FFFFFF', text: 'light' },
  Tunez: { primary: '#E70013', secondary: '#FFFFFF', text: 'light' },
  Egipto: { primary: '#CE1126', secondary: '#000000', text: 'light' },
  Argelia: { primary: '#006233', secondary: '#D21034', text: 'light' },
  Ghana: { primary: '#006B3F', secondary: '#FCD116', text: 'light' },
  'Sudáfrica': { primary: '#007749', secondary: '#FFB915', text: 'light' },
  Sudafrica: { primary: '#007749', secondary: '#FFB915', text: 'light' },
  'Cabo Verde': { primary: '#003893', secondary: '#CF2027', text: 'light' },
  'República Democrática del Congo': { primary: '#007FFF', secondary: '#F7D618', text: 'light' },
  'RD Congo': { primary: '#007FFF', secondary: '#F7D618', text: 'light' },
  // CONCACAF / Caribe
  'Estados Unidos': { primary: '#3C3B6E', secondary: '#B22234', text: 'light' },
  USA: { primary: '#3C3B6E', secondary: '#B22234', text: 'light' },
  Canadá: { primary: '#D52B1E', secondary: '#FFFFFF', text: 'light' },
  Canada: { primary: '#D52B1E', secondary: '#FFFFFF', text: 'light' },
  Panamá: { primary: '#005EB8', secondary: '#DA121A', text: 'light' },
  Panama: { primary: '#005EB8', secondary: '#DA121A', text: 'light' },
  Haití: { primary: '#00209F', secondary: '#D21034', text: 'light' },
  Haiti: { primary: '#00209F', secondary: '#D21034', text: 'light' },
  Curazao: { primary: '#002B7F', secondary: '#FFCD00', text: 'light' },
  // Otros
  Escocia: { primary: '#005EB8', secondary: '#FFFFFF', text: 'light' },
  Turquía: { primary: '#E30A17', secondary: '#FFFFFF', text: 'light' },
  Turquia: { primary: '#E30A17', secondary: '#FFFFFF', text: 'light' },
}

export const PALETA_DEFAULT: PaletaSeleccion = {
  primary: '#1a1a1a',
  secondary: '#C41C1C',
  text: 'light',
}

export function getPaleta(pais: string): PaletaSeleccion {
  return PALETAS[pais] ?? PALETAS[pais.normalize('NFD').replace(/[̀-ͯ]/g, '')] ?? PALETA_DEFAULT
}
