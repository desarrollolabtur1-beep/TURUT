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
  tinderImg?: ImageSourcePropType;
  wa: string;
  maps?: string;
  extraInfo?: string;
  gallery?: ImageSourcePropType[];
  imperdiblesGallery?: ImageSourcePropType[];
  rating: number;
  /** Short tagline for hero/carousel display */
  tagline?: string;
  /** Whether this is a featured/highlighted destination */
  featured?: boolean;
  /** Number of reviews (displayed next to rating) */
  reviewCount?: number;
  /** GPS coordinates for interactive map */
  latitude: number;
  longitude: number;
}

/** Image assets mapped by require() for bundling */
const images = {
  villa_leones: {
    tinder: require('../../assets/images/villa_leones/villa_leones_tinder.jpg'),
    imperdible: require('../../assets/images/villa_leones/villa_leones_imperdible.jpg'),
    gallery: [
      require('../../assets/images/villa_leones/villa_leones_gal1.jpg'),
      require('../../assets/images/villa_leones/villa_leones_gal2.jpg'),
      require('../../assets/images/villa_leones/villa_leones_gal3.jpg'),
      require('../../assets/images/villa_leones/villa_leones_gal4.jpg'),
      require('../../assets/images/villa_leones/villa_leones_gal5.jpg'),
      require('../../assets/images/villa_leones/villa_leones_gal6.jpg'),
      require('../../assets/images/villa_leones/villa_leones_gal7.jpg'),
    ],
    imperdiblesGallery: [
      require('../../assets/images/villa_leones/villa_leones_imperdible1.jpg'),
      require('../../assets/images/villa_leones/villa_leones_imperdible2.jpg'),
      require('../../assets/images/villa_leones/villa_leones_imperdible3.jpg'),
      require('../../assets/images/villa_leones/villa_leones_imperdible4.jpg'),
      require('../../assets/images/villa_leones/villa_leones_imperdible5.jpg'),
      require('../../assets/images/villa_leones/villa_leones_imperdible6.jpg'),
      require('../../assets/images/villa_leones/villa_leones_imperdible7.jpg'),
      require('../../assets/images/villa_leones/villa_leones_imperdible8.jpg'),
      require('../../assets/images/villa_leones/villa_leones_imperdible9.jpg'),
      require('../../assets/images/villa_leones/villa_leones_imperdible10.jpg'),
      require('../../assets/images/villa_leones/villa_leones_imperdible11.jpg'),
      require('../../assets/images/villa_leones/villa_leones_imperdible12.jpg'),
      require('../../assets/images/villa_leones/villa_leones_imperdible13.jpg'),
      require('../../assets/images/villa_leones/villa_leones_imperdible14.jpg'),
      require('../../assets/images/villa_leones/villa_leones_imperdible15.jpg'),
      require('../../assets/images/villa_leones/villa_leones_imperdible16.jpg'),
    ],
  },
  kajol: {
    tinder: require('../../assets/images/kajol/kajol_tinder.jpg'),
    imperdible: require('../../assets/images/kajol/kajol_imperdibles.jpg'),
    gallery: [
      require('../../assets/images/kajol/kajol_gal1.jpg'),
      require('../../assets/images/kajol/kajol_gal2.jpg'),
      require('../../assets/images/kajol/kajol_gal3.jpg'),
      require('../../assets/images/kajol/kajol_gal4.jpg'),
      require('../../assets/images/kajol/kajol_gal5.jpg'),
      require('../../assets/images/kajol/kajol_gal6.jpg'),
      require('../../assets/images/kajol/kajol_gal7.jpg'),
      require('../../assets/images/kajol/kajol_gal8.jpg'),
      require('../../assets/images/kajol/kajol_gal9.jpg'),
      require('../../assets/images/kajol/kajol_gal10.jpg'),
      require('../../assets/images/kajol/kajol_gal11.jpg'),
      require('../../assets/images/kajol/kajol_gal12.jpg'),
    ],
    imperdiblesGallery: [
      require('../../assets/images/kajol/kajol_imperdibles.jpg'),
      require('../../assets/images/kajol/kajol_imperdibles2.jpg'),
      require('../../assets/images/kajol/kajol_imperdible3.jpg'),
      require('../../assets/images/kajol/kajol_imperdibles4.jpg'),
      require('../../assets/images/kajol/kajol_imperdibles5.jpg'),
      require('../../assets/images/kajol/kajol_imperdibles6.jpg'),
      require('../../assets/images/kajol/kajol_imperdibles7.jpg'),
      require('../../assets/images/kajol/kajol_imperdibles8.jpg'),
      require('../../assets/images/kajol/kajol_imperdibles9.jpg'),
      require('../../assets/images/kajol/kajol_imperdibles10.jpg'),
    ],
  },
  casa_flores: {
    tinder: require('../../assets/images/casa_flores/casa_flores_tinder.jpg'),
    imperdible: require('../../assets/images/casa_flores/casa_flores_imperdible.jpg'),
    gallery: [
      require('../../assets/images/casa_flores/casa_flores_gal1.jpg'),
      require('../../assets/images/casa_flores/casa_flores_gal2.jpg'),
      require('../../assets/images/casa_flores/casa_flores_gal3.jpg'),
      require('../../assets/images/casa_flores/casa_flores_gal4.jpg'),
    ],
    imperdiblesGallery: [
      require('../../assets/images/casa_flores/casa_flores_imperdible1.jpg'),
      require('../../assets/images/casa_flores/casa_flores_imperdible2.jpg'),
      require('../../assets/images/casa_flores/casa_flores_imperdible3.jpg'),
      require('../../assets/images/casa_flores/casa_flores_imperdible4.jpg'),
      require('../../assets/images/casa_flores/casa_flores_imperdible5.jpg'),
      require('../../assets/images/casa_flores/casa_flores_imperdible6.jpg'),
    ],
  },
  la_florida: {
    tinder: require('../../assets/images/la_florida/la_florida_tinder.jpg'),
    imperdible: require('../../assets/images/la_florida/la_florida_imperdible.jpg'),
    gallery: [
      require('../../assets/images/la_florida/la_florida_gal1.jpg'),
      require('../../assets/images/la_florida/la_florida_gal2.jpg'),
      require('../../assets/images/la_florida/la_florida_gal3.jpg'),
    ],
    imperdiblesGallery: [
      require('../../assets/images/la_florida/la_florida_imperdible1.jpg'),
      require('../../assets/images/la_florida/la_florida_imperdible2.jpg'),
      require('../../assets/images/la_florida/la_florida_imperdible3.jpg'),
      require('../../assets/images/la_florida/la_florida_imperdible4.jpg'),
      require('../../assets/images/la_florida/la_florida_imperdible5.jpg'),
      require('../../assets/images/la_florida/la_florida_imperdible6.jpg'),
    ],
  },
  los_pinos: {
    tinder: require('../../assets/images/los_pinos/lospinos_tinder.jpg'),
    imperdible: require('../../assets/images/los_pinos/lospinos_imperdible.jpg'),
    gallery: [
      require('../../assets/images/los_pinos/lospinos_gal1.jpg'),
      require('../../assets/images/los_pinos/lospinos_gal2.jpg'),
      require('../../assets/images/los_pinos/lospinos_gal3.jpg'),
      require('../../assets/images/los_pinos/lospinos_gal4.jpg'),
      require('../../assets/images/los_pinos/lospinos_gal5.jpg'),
      require('../../assets/images/los_pinos/lospinos_gal6.jpg'),
    ],
    imperdiblesGallery: [
      require('../../assets/images/los_pinos/lospinos_imperdible1.jpg'),
      require('../../assets/images/los_pinos/lospinos_imperdible2.jpg'),
      require('../../assets/images/los_pinos/lospinos_imperdible3.jpg'),
      require('../../assets/images/los_pinos/lospinos_imperdible4.jpg'),
      require('../../assets/images/los_pinos/lospinos_imperdible5.jpg'),
      require('../../assets/images/los_pinos/lospinos_imperdible6.jpg'),
      require('../../assets/images/los_pinos/lospinos_imperdible7.jpg'),
      require('../../assets/images/los_pinos/lospinos_imperdible8.jpg'),
      require('../../assets/images/los_pinos/lospinos_imperdible9.jpg'),
      require('../../assets/images/los_pinos/lospinos_imperdible10.jpg'),
      require('../../assets/images/los_pinos/lospinos_imperdible11.jpg'),
      require('../../assets/images/los_pinos/lospinos_imperdible12.jpg'),
      require('../../assets/images/los_pinos/lospinos_imperdible13.jpg'),
    ],
  },
};

export const destinations: Destination[] = [
  {
    id: 1,
    name: 'FINCA ECOTURÍSTICA VILLA LEONES',
    category: 'Aventura',
    distance: '15km',
    discount: 20,
    desc: 'Villa Leones ofrece una experiencia ecoturística completa rodeada de zonas verdes, naturaleza y espacios recreativos, perfecta para desconectarse de la rutina y disfrutar momentos únicos en grupo.',
    img: images.villa_leones.imperdible,
    tinderImg: images.villa_leones.tinder,
    gallery: images.villa_leones.gallery,
    imperdiblesGallery: images.villa_leones.imperdiblesGallery,
    wa: 'https://wa.me/573001234567?text=Hola%20quiero%20info%20de%20Villa%20Leones',
    rating: 4.6,
    reviewCount: 34,
    tagline: 'Vive una experiencia rodeada de naturaleza, diversión and descanso en un espacio exclusivo para compartir.',
    // TODO: Reemplazar con coordenadas GPS reales
    latitude: 4.48,
    longitude: -75.18,
    extraInfo: 'Cancha de voleyplaya · Cancha de microfútbol · Zona de camping · Pet Friendly',
  },
  {
    id: 2,
    name: 'JARDINES DE BERLÍN KAJOL',
    category: 'Coffee',
    distance: '8km',
    discount: 15,
    desc: 'Reconocido por Cortolima como Negocio Verde, este lugar ofrece un refugio donde el respeto por el medio ambiente se combina con la calidez de la hospitalidad rural.',
    extraInfo: 'Piscina y jacuzzi · Juegos tradicionales · Mini cancha funcional · Cowork, café y bienestar',
    img: images.kajol.imperdible,
    tinderImg: images.kajol.tinder,
    gallery: images.kajol.gallery,
    imperdiblesGallery: images.kajol.imperdiblesGallery,
    wa: 'https://wa.me/573001234567?text=Hola%20quiero%20info%20de%20JARDINES%20DE%20BERL%C3%8DN%20KAJOL',
    rating: 4.9,
    reviewCount: 87,
    tagline: 'Café, naturaleza y bienestar en un solo lugar',
    featured: true,
    // TODO: Reemplazar con coordenadas GPS reales
    latitude: 4.43,
    longitude: -75.20,
  },
  {
    id: 3,
    name: 'HOSPEDAJE CAMPESTRE CASA FLORES',
    category: 'Relax',
    distance: '5km',
    discount: 25,
    desc: 'Reconocido por su ambiente natural y relajante, Casa Flores ofrece una experiencia ideal para desconectarse del ruido de la ciudad y disfrutar del aire fresco, el río y el descanso campestre.',
    img: images.casa_flores.imperdible,
    tinderImg: images.casa_flores.tinder,
    gallery: images.casa_flores.gallery,
    imperdiblesGallery: images.casa_flores.imperdiblesGallery,
    wa: 'https://wa.me/573001234567?text=Hola%20quiero%20info%20de%20Hospedaje%20Campestre%20Casa%20Flores',
    rating: 4.5,
    reviewCount: 22,
    tagline: 'Desconecta junto al río, naturaleza y spa',
    extraInfo: 'Jacuzzis privados · Sala de juegos · Restaurante & eventos · Pet Friendly',
    // TODO: Reemplazar con coordenadas GPS reales
    latitude: 4.44,
    longitude: -75.23,
  },
  {
    id: 4,
    name: 'FINCA HOSTAL LA FLORIDA',
    category: 'Relax',
    distance: '12km',
    discount: 10,
    desc: 'Finca Hostal La Florida ofrece una experiencia íntima y relajante en el Cañón del Combeima, ideal para desconectarse del ruido de la ciudad y disfrutar del clima, la quebrada, el paisaje y la tranquilidad natural.',
    img: images.la_florida.imperdible,
    tinderImg: images.la_florida.tinder,
    gallery: images.la_florida.gallery,
    imperdiblesGallery: images.la_florida.imperdiblesGallery,
    wa: 'https://wa.me/573001234567?text=Hola%20quiero%20info%20de%20Finca%20Hostal%20La%20Florida',
    rating: 4.7,
    reviewCount: 45,
    tagline: 'Conecta con la naturaleza and bienestar junto al río',
    extraInfo: 'Jacuzzi & turco · Avistamiento de aves · Productos orgánicos · Pet Friendly',
    // TODO: Reemplazar con coordenadas GPS reales
    latitude: 4.46,
    longitude: -75.15,
  },
  {
    id: 5,
    name: 'LOS PINOS ECOHOTEL',
    category: 'Relax',
    distance: '4km',
    discount: 20,
    desc: 'Los Pinos Ecohotel ofrece una experience exclusiva de relajación en Villarestrepo, combinando río, montaña y servicios wellness premium para desconectarse del ruido de la ciudad y reconectar con el bienestar natural.',
    img: images.los_pinos.imperdible,
    tinderImg: images.los_pinos.tinder,
    gallery: images.los_pinos.gallery,
    imperdiblesGallery: images.los_pinos.imperdiblesGallery,
    wa: 'https://wa.me/573001234567?text=Hola%20quiero%20info%20de%20Los%20Pinos%20Ecohotel',
    rating: 4.8,
    reviewCount: 63,
    tagline: 'Relájate junto al río con experiencias de bienestar, montaña y desconexión total.',
    featured: true,
    // TODO: Reemplazar con coordenadas GPS reales
    latitude: 4.44,
    longitude: -75.22,
    extraInfo: 'Exfoliación volcánica · Mascarilla facial · Cóctel & bebida caliente · Pet Friendly',
  },
];

/** All unique categories for filter chips */
export const categories = ['Aventura', 'Relax', 'Gastronomía', 'Cultura', 'Coffee'] as const;
