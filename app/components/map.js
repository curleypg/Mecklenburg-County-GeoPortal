import mapboxgl from 'mapbox-gl';
import directions from '../js/directions';
import fetchNearest from '../js/nearest';
import {setHash} from '../js/history';
import AerialToggle from '../js/aerialtogglecontrol';
import PitchToggle from '../js/pitchtogglecontrol.js';
import mapStyle from '../style/osm-liberty.json';

let template = `
  <div class="map-container card nopadding">
    <div id="map" />
  </div>
`;

function isIEorEDGE() {
  return (
    navigator.appName == 'Netscape' &&
    (navigator.appVersion.indexOf('Edge') > -1 ||
      navigator.appVersion.indexOf('Trident') > -1)
  );
}

export default {
  name: 'themap',
  template: template,
  mounted: function() {
    this.initMap();
  },
  watch: {
    'sharedState.selected.lnglat': 'addMarker',
    'sharedState.show': 'mapOverlay',
    'sharedState.poi': 'addPOI'
  },
  methods: {
    initMap: function() {
      let _this = this;
      let mapOptions = {
        container: 'map',
        style: mapStyle,
        attributionControl: false,
        center: [-80.84, 35.26],
        zoom: 8.5,
        minZoom: 8,
        maxBounds: [[-82.641, 34.115], [-79.008, 36.762]],
        preserveDrawingBuffer: true
      };

      _this.privateState.map = new mapboxgl.Map(mapOptions);
      let map = _this.privateState.map;

      // hack for IE/Edge not loading map every other load
      if (isIEorEDGE()) {
        console.log('Kicking map for Microsoft bugs...');
        map.setStyle(mapStyle);
      }

      map.on('load', function() {
        // get map overlays
        _this.mapOverlay();
        // do marker if available
        if (_this.sharedState.selected.lnglat) {
          _this.addMarker();
        }
        // add controls
        map.addControl(new mapboxgl.FullscreenControl(), 'bottom-right');
        map.addControl(new PitchToggle({}), 'bottom-right');
        map.addControl(new AerialToggle({}), 'bottom-right');
      });

      map.on('click', function(e) {
        if (map.getZoom() >= 14 && !_this.privateState.markerClicked) {
          fetchNearest(e.lngLat.lat, e.lngLat.lng, _this.sharedState);
        }
        _this.privateState.markerClicked = false;
      });
    },
    mapPitch: function() {
      this.privateState.map.getPitch() === 0
        ? this.privateState.map.easeTo({
            pitch: 90
          })
        : this.privateState.map.easeTo({
            pitch: 0,
            bearing: 0
          });
    },
    mapOverlay: function() {
      let map = this.privateState.map;
      let _this = this;

      // remove any overlays
      if (map.getLayer('overlay')) {
        map.removeLayer('overlay');
        map.removeSource('overlay');
      }

      // add overlays for tabs
      switch (_this.sharedState.show) {
        case 'impervious':
          map.addLayer({
            id: 'overlay',
            type: 'raster',
            source: {
              type: 'raster',
              tiles: [
                `https://mcmap.org/geoserver/postgis/wms?bbox={bbox-epsg-3857}&format=image/png&service=WMS&version=1.1.1&request=GetMap&srs=EPSG:3857&width=256&height=256&layers=postgis:impervious_surface&transparent=true`
              ],
              tileSize: 256,
              maxzoom: 18
            },
            minzoom: 15,
            maxzoom: 22,
            paint: {
              'raster-opacity': 1
            }
          });
          break;
        case 'environment':
          map.addLayer(
            {
              id: 'overlay',
              type: 'raster',
              source: {
                type: 'raster',
                tiles: [
                  `https://mcmap.org/geoserver/postgis/wms?bbox={bbox-epsg-3857}&format=image/png&service=WMS&version=1.1.1&request=GetMap&srs=EPSG:3857&width=256&height=256&layers=postgis:view_regulated_floodplains&transparent=true`
                ],
                tileSize: 256,
                maxzoom: 18
              },
              minzoom: 14,
              maxzoom: 22,
              paint: {
                'raster-opacity': 1
              }
            },
            'waterway_river'
          );
          break;
      }
    },
    addPOI: function() {
      let map = this.privateState.map;
      let selected = this.sharedState.selected;
      let poi = this.sharedState.poi;
      let _this = this;
      // zoom to selected and poi
      let bounds = new mapboxgl.LngLatBounds();
      bounds.extend(poi.lnglat);
      bounds.extend(selected.lnglat);
      map.fitBounds(bounds, {
        padding: 40
      });
      // remove old markers if they exist
      if (this.privateState.poiMarker) {
        this.privateState.poiMarker.remove();
      }
      // create the popup
      let popup = new mapboxgl.Popup({
        offset: [2, -23]
      }).setHTML(
        `<strong>${poi.label}</strong><br>${
          poi.address
        }<br><a href="${directions(
          selected.lnglat,
          poi.lnglat
        )}" target="_blank"  rel="noopener" title="directions">Directions</a>`
      );
      // create DOM element for the marker
      var el = document.createElement('div');
      el.classList.add('poiMarker');
      // create the marker
      this.privateState.poiMarker = new mapboxgl.Marker(el, {
        offset: [-20, -20]
      })
        .setLngLat(poi.lnglat)
        .setPopup(popup) // sets a popup on this marker
        .addTo(map);
      document
        .querySelector('.poiMarker')
        .addEventListener('click', function(e) {
          _this.privateState.markerClicked = true;
        });
    },
    addMarker: function() {
      let map = this.privateState.map;
      let selected = this.sharedState.selected;
      let _this = this;
      map.flyTo({
        center: selected.lnglat,
        zoom: 17
      });
      // push state
      setHash(selected.lnglat, _this.sharedState.show);
      // create the popup
      let popup = new mapboxgl.Popup({
        offset: [2, -23]
      }).setHTML(`<strong>${selected.label}</strong><br>${selected.address}`);
      // create DOM element for the marker
      var el = document.createElement('div');
      el.classList.add('locationMarker');
      // remove old markers if they exist
      if (this.privateState.locationMarker) {
        this.privateState.locationMarker.remove();
      }
      if (this.privateState.poiMarker) {
        this.privateState.poiMarker.remove();
      }
      // create the marker
      this.privateState.locationMarker = new mapboxgl.Marker(el, {
        offset: [-20, -20]
      })
        .setLngLat(selected.lnglat)
        .setPopup(popup) // sets a popup on this marker
        .addTo(map);
      document
        .querySelector('.locationMarker')
        .addEventListener('click', function(e) {
          _this.privateState.markerClicked = true;
        });
    }
  }
};
