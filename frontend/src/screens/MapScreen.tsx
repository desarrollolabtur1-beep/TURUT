/**
 * MapScreen — Interactive Leaflet.js map of TURUT destinations
 *
 * Uses CartoDB.DarkMatter tiles for Andina Neón consistency.
 * Renders category-colored markers with interactive popups.
 * Web-only via dangerouslySetInnerHTML (Leaflet CDN).
 *
 * Coordinates in destinations.ts — update TODO markers with real GPS.
 */
import React, { useCallback, useMemo, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Platform,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import Svg, { Path, Circle } from 'react-native-svg';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { destinations, type Destination } from '../data/destinations';
import { categoryColors } from '../theme/colors';
import { colors, textStyles, layout, radii, shadows, spacing } from '../theme';

// ── Center coordinates (Ibagué, Tolima) ──
const MAP_CENTER = { lat: 4.445, lng: -75.20 };
const MAP_ZOOM = 13;

// ── Category color map for markers (hex) ──
const MARKER_COLORS: Record<string, string> = {
  Aventura: '#3B82F6',
  Relax: '#EC4899',
  Gastronomía: '#F59E0B',
  Cultura: '#A855F7',
  Coffee: '#D97706',
};

// ── Generate Leaflet HTML ──
const generateMapHTML = (dests: Destination[]): string => {
  const markersJS = dests.map((d, i) => {
    const markerColor = MARKER_COLORS[d.category] || '#A020F0';
    const escapedName = d.name.replace(/'/g, "\\'");
    const escapedDesc = (d.tagline || d.desc.slice(0, 60) + '...').replace(/'/g, "\\'");
    return `
      (function() {
        var markerIcon = L.divIcon({
          className: 'turut-marker',
          html: '<div style="background:${markerColor};width:28px;height:28px;border-radius:50%;border:3px solid rgba(255,255,255,0.9);box-shadow:0 0 12px ${markerColor}80,0 2px 8px rgba(0,0,0,0.4);display:flex;align-items:center;justify-content:center;"><div style="width:8px;height:8px;border-radius:50%;background:white;"></div></div>',
          iconSize: [28, 28],
          iconAnchor: [14, 14],
          popupAnchor: [0, -18]
        });

        var marker = L.marker([${d.latitude}, ${d.longitude}], { icon: markerIcon }).addTo(map);
        marker.bindPopup(
          '<div style="font-family:Inter,system-ui,sans-serif;min-width:200px;background:#121212;border-radius:12px;overflow:hidden;border:1px solid rgba(255,255,255,0.08);margin:-1px;">' +
            '<div style="padding:14px 16px;">' +
              '<div style="display:flex;align-items:center;gap:6px;margin-bottom:6px;">' +
                '<span style="background:${markerColor}25;color:${markerColor};font-size:10px;font-weight:700;padding:2px 8px;border-radius:20px;letter-spacing:0.5px;">${d.category.toUpperCase()}</span>' +
                '<span style="color:#FFD700;font-size:11px;font-weight:600;">★ ${d.rating}</span>' +
              '</div>' +
              '<div style="color:#fff;font-size:14px;font-weight:700;margin-bottom:4px;line-height:1.3;">${escapedName}</div>' +
              '<div style="color:#9CA3AF;font-size:11px;line-height:1.4;margin-bottom:10px;">${escapedDesc}</div>' +
              '<div style="display:flex;align-items:center;justify-content:space-between;">' +
                '<span style="color:#9CA3AF;font-size:11px;">📍 ${d.distance}</span>' +
                '${d.discount > 0 ? '<span style="color:#FFD700;font-size:11px;font-weight:700;">-' + d.discount + '% BONO</span>' : ''}' +
              '</div>' +
              '<button onclick="window.ReactNativeWebView?window.ReactNativeWebView.postMessage(JSON.stringify({type:\\'navigate\\',destIndex:${i}})):window.parent.postMessage(JSON.stringify({type:\\'navigate\\',destIndex:${i}}),\\'*\\')" style="width:100%;margin-top:12px;padding:10px;background:#A020F0;color:white;border:none;border-radius:20px;font-size:13px;font-weight:700;cursor:pointer;letter-spacing:0.3px;">Ver destino →</button>' +
            '</div>' +
          '</div>',
          {
            className: 'turut-popup',
            maxWidth: 260,
            minWidth: 220,
            closeButton: true,
            offset: [0, -4]
          }
        );
      })();
    `;
  }).join('\n');

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
      <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
      <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
      <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        html, body, #map { width: 100%; height: 100%; background: #050505; }
        
        /* Custom popup styling */
        .leaflet-popup-content-wrapper {
          background: transparent !important;
          box-shadow: none !important;
          border-radius: 12px !important;
          padding: 0 !important;
        }
        .leaflet-popup-content {
          margin: 0 !important;
          line-height: 1.4 !important;
        }
        .leaflet-popup-tip {
          background: #121212 !important;
          border: 1px solid rgba(255,255,255,0.08) !important;
          box-shadow: none !important;
        }
        .leaflet-popup-close-button {
          color: #9CA3AF !important;
          font-size: 18px !important;
          padding: 6px 8px !important;
          z-index: 10 !important;
        }
        .leaflet-popup-close-button:hover {
          color: #fff !important;
        }
        
        /* Attribution */
        .leaflet-control-attribution {
          background: rgba(5,5,5,0.7) !important;
          color: #4a4a4a !important;
          font-size: 9px !important;
        }
        .leaflet-control-attribution a {
          color: #6a6a6a !important;
        }
        
        /* Zoom controls */
        .leaflet-control-zoom {
          border: 1px solid rgba(255,255,255,0.08) !important;
          border-radius: 12px !important;
          overflow: hidden;
        }
        .leaflet-control-zoom a {
          background: #121212 !important;
          color: #fff !important;
          border-color: rgba(255,255,255,0.08) !important;
          width: 36px !important;
          height: 36px !important;
          line-height: 36px !important;
          font-size: 16px !important;
        }
        .leaflet-control-zoom a:hover {
          background: #1a1a1a !important;
        }

        /* Remove marker shadows */
        .leaflet-marker-shadow { display: none !important; }
      </style>
    </head>
    <body>
      <div id="map"></div>
      <script>
        var map = L.map('map', {
          center: [${MAP_CENTER.lat}, ${MAP_CENTER.lng}],
          zoom: ${MAP_ZOOM},
          zoomControl: true,
          attributionControl: true,
        });

        // CartoDB DarkMatter — dark tiles
        L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
          attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a> &copy; <a href="https://carto.com/attributions">CARTO</a>',
          subdomains: 'abcd',
          maxZoom: 19,
        }).addTo(map);

        // Add markers
        ${markersJS}
      </script>
    </body>
    </html>
  `;
};

// ── Legend Item ──
const LegendItem: React.FC<{ label: string; color: string }> = ({ label, color }) => (
  <View style={styles.legendItem}>
    <View style={[styles.legendDot, { backgroundColor: color, shadowColor: color }]} />
    <Text style={styles.legendText}>{label}</Text>
  </View>
);

// ── MapScreen Component ──
const MapScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  const iframeRef = useRef<HTMLIFrameElement | null>(null);

  const mapHTML = useMemo(() => generateMapHTML(destinations), []);

  // Handle messages from the Leaflet popup buttons
  const handleMessage = useCallback((event: MessageEvent) => {
    try {
      const data = JSON.parse(event.data);
      if (data.type === 'navigate' && typeof data.destIndex === 'number') {
        navigation.navigate('Landing', { destIndex: data.destIndex });
      }
    } catch {
      // Ignore non-JSON messages
    }
  }, [navigation]);

  // Register message listener
  React.useEffect(() => {
    if (Platform.OS === 'web') {
      window.addEventListener('message', handleMessage);
      return () => window.removeEventListener('message', handleMessage);
    }
  }, [handleMessage]);

  if (Platform.OS !== 'web') {
    // Fallback for native (would need react-native-webview)
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <View style={styles.nativeUnsupported}>
          <Text style={styles.nativeText}>
            El mapa interactivo está disponible en la versión web
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      {/* Map title bar */}
      <Animated.View entering={FadeInDown.duration(400)} style={styles.titleBar}>
        <Svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke={colors.primary} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
          <Path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" />
          <Circle cx={12} cy={10} r={3} />
        </Svg>
        <Text style={styles.titleText}>Explora el mapa</Text>
        <Text style={styles.countBadge}>{destinations.length}</Text>
      </Animated.View>

      {/* Legend */}
      <Animated.View entering={FadeInDown.delay(100).duration(400)} style={styles.legend}>
        {Object.entries(MARKER_COLORS).map(([cat, color]) => (
          <LegendItem key={cat} label={cat} color={color} />
        ))}
      </Animated.View>

      {/* Leaflet iframe */}
      <View style={styles.mapContainer}>
        <iframe
          ref={iframeRef as any}
          srcDoc={mapHTML}
          style={{
            width: '100%',
            height: '100%',
            border: 'none',
            borderRadius: 0,
          }}
          title="TURUT Map"
          sandbox="allow-scripts allow-same-origin"
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  titleBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: layout.screenPadding,
    paddingVertical: 14,
    gap: 10,
    borderBottomWidth: 1,
    borderBottomColor: colors.outlineVariant,
  },
  titleText: {
    ...textStyles.headlineSmall,
    color: colors.textPrimary,
    flex: 1,
    fontSize: 17,
  },
  countBadge: {
    ...textStyles.meta,
    color: colors.primary,
    backgroundColor: colors.primarySoft,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: radii.pill,
    overflow: 'hidden',
    fontSize: 12,
    fontWeight: '700',
  },
  legend: {
    flexDirection: 'row',
    paddingHorizontal: layout.screenPadding,
    paddingVertical: 10,
    gap: 14,
    borderBottomWidth: 1,
    borderBottomColor: colors.outlineVariant,
    flexWrap: 'wrap',
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  legendDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 4,
  },
  legendText: {
    color: colors.textMuted,
    fontSize: 11,
    fontWeight: '500',
  },
  mapContainer: {
    flex: 1,
    overflow: 'hidden',
  },
  nativeUnsupported: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
  },
  nativeText: {
    ...textStyles.body,
    color: colors.textMuted,
    textAlign: 'center',
  },
});

export default MapScreen;
