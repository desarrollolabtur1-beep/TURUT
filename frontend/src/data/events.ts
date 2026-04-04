/**
 * TURUT — Local event data
 * Mirrors the hardcoded events from the PWA's scripts.js
 */

export type EventIconName = 'music-note' | 'flame' | 'utensils' | 'coffee' | 'store';
export type EventStatus = 'now' | 'soon' | 'later';

export interface TurutEvent {
  destIndex: number;
  time: string;
  name: string;
  icon: EventIconName;
}

export const events: TurutEvent[] = [
  { destIndex: 3, time: 'Ahora mismo', name: 'Cena a 4 Manos + Coctelería', icon: 'utensils' },
  { destIndex: 1, time: 'Hoy 7:00 PM', name: 'Exposición Indígena & Mapping', icon: 'store' },
  { destIndex: 0, time: 'En curso', name: 'Taller de Tostión Especial', icon: 'coffee' },
  { destIndex: 4, time: 'Sáb 8:00 AM', name: 'Expedición Amanecer en la Selva', icon: 'flame' },
  { destIndex: 2, time: 'Mañana 6 AM', name: 'Ruta de los Valientes', icon: 'music-note' },
];

/** Determine event status from time string */
export function getEventStatus(timeStr: string): EventStatus {
  const lower = timeStr.toLowerCase();
  if (lower.includes('ahora') || lower.includes('en curso')) return 'now';
  if (lower.includes('hoy')) return 'soon';
  return 'later';
}
