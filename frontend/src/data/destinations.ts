/**
 * TURUT — Local destination data
 * Mirrors the hardcoded data from the PWA's scripts.js
 */
import { ImageSourcePropType } from 'react-native';

export interface Destination {
  id: number;
  name: string;
  category: string;
  distance: string;
  discount: number;
  desc: string;
  img: ImageSourcePropType;
  wa: string;
  maps?: string;
  extraInfo?: string;
  gallery?: ImageSourcePropType[];
}

/** Image assets mapped by require() for bundling */
const images = {
  ecorefugio: require('../../assets/images/ecorefugio.png'),
  lamesa: require('../../assets/images/lamesa.png'),
  lostunjos: require('../../assets/images/lostunjos.png'),
  rutaguardian: require('../../assets/images/rutaguardian.png'),
  terrazatotumo: require('../../assets/images/terrazatotumo.png'),
  kajol_1: require('../../assets/images/kajol_1.jpg'),
  kajol_2: require('../../assets/images/kajol_2.jpg'),
  kajol_3: require('../../assets/images/kajol_3.jpg'),
  kajol_4: require('../../assets/images/kajol_4.jpg'),
  kajol_5: require('../../assets/images/kajol_5.jpg'),
  kajol_6: require('../../assets/images/kajol_6.jpg'),
  kajol_7: require('../../assets/images/kajol_7.jpg'),
};

export const destinations: Destination[] = [
  {
    id: 1,
    name: 'Eco-Refugio',
    category: 'Aventura',
    distance: '15km',
    discount: 20,
    desc: 'Un escape total. Senderos de selva, puentes colgantes y naturaleza pura. Desconéctate en este refugio ecológico.',
    img: images.ecorefugio,
    wa: 'https://wa.me/573001234567?text=Hola%20quiero%20info%20de%20Eco-Refugio',
    rating: 4.8,
  },
  {
    id: 2,
    name: 'JARDINES DE BERLÍN KAJOL',
    category: 'Coffee',
    distance: '8km',
    discount: 15,
    desc: 'En Jardines de Berlín Kajol, un alojamiento rural sostenible, la armonía con la naturaleza es el corazón de cada experiencia. Reconocido por Cortolima como Negocio Verde, este lugar ofrece un refugio donde el respeto por el medio ambiente se combina con la calidez de la hospitalidad rural. Aquí, cada detalle refleja un compromiso con la sostenibilidad, invitándote a disfrutar de la serenidad del entorno mientras formas parte de un modelo de turismo responsable.',
    extraInfo: 'Alojamiento, cuenta con un café para experiencias de café, cowork, planes pasadía donde los usuarios pueden disfrutar de la zona bienestar que incluye piscina-jacuzzi, juegos tradicionales y una mini cancha funcional, entre otros.',
    img: images.lamesa,
    gallery: [images.kajol_4, images.kajol_5, images.kajol_6, images.kajol_7],
    wa: 'https://wa.me/573001234567?text=Hola%20quiero%20info%20de%20JARDINES%20DE%20BERL%C3%8DN%20KAJOL',
    rating: 4.8,
  },
  {
    id: 3,
    name: 'Los Tunjos',
    category: 'Cultura',
    distance: '5km',
    discount: 25,
    desc: 'Templo del arte y herencia indígena. Exposiciones en vivo, música tradicional y una atmósfera mágica e histórica.',
    img: images.lostunjos,
    wa: 'https://wa.me/573001234567?text=Hola%20quiero%20info%20de%20Los%20Tunjos',
    rating: 4.8,
  },
  {
    id: 4,
    name: 'Ruta del Guardián',
    category: 'Aventura',
    distance: '12km',
    discount: 10,
    desc: 'Senderismo extremo con vistas impresionantes. Reta tus límites subiendo hasta el pico de la montaña guardiana.',
    img: images.rutaguardian,
    wa: 'https://wa.me/573001234567?text=Hola%20quiero%20info%20de%20Ruta%20del%20Guardián',
    rating: 4.8,
  },
  {
    id: 5,
    name: 'Terraza del Totumo',
    category: 'Gastronomía',
    distance: '4km',
    discount: 20,
    desc: 'La mejor gastronomía local en un rooftop con vista panorámica a la ciudad. Atardeceres inolvidables y coctelería.',
    img: images.terrazatotumo,
    wa: 'https://wa.me/573001234567?text=Hola%20quiero%20info%20de%20Terraza%20del%20Totumo',
    rating: 4.8,
  },
];

/** All unique categories for filter chips */
export const categories = ['Aventura', 'Relax', 'Gastronomía', 'Cultura', 'Coffee'] as const;
