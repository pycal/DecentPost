import React, { Component } from 'react';

import logo from '../logo.svg';
import mapboxgl from 'mapbox-gl/dist/mapbox-gl';

const style = {
  position: 'absolute',
  top: 0,
  bottom: 0,
  width: '100%'
}

class Map extends Component {
  componentDidMount() {
    mapboxgl.accessToken = 'pk.eyJ1IjoiamRqa2VsbHkyIiwiYSI6ImNqZHJwMzE2ZjJjcmozM2w3MGs2YnM0emIifQ.9tqBPA4_jEs8ZNZCi_YZWw';
    const end = [-104.9896020, 39.7323460];
    const start = [-104.9896020, 39.7323460];
    const map = new mapboxgl.Map({
      container: 'map',
      style: 'mapbox://styles/mapbox/outdoors-v9',
      center: start,
      zoom: 22,
      bearing: 270,
      pitch: 20
    })

    map.on('load', function() {
      // Insert the layer beneath any symbol layer.
      var layers = map.getStyle().layers;

      var labelLayerId;
      for (var i = 0; i < layers.length; i++) {
          if (layers[i].type === 'symbol' && layers[i].layout['text-field']) {
              labelLayerId = layers[i].id;
              break;
          }
      }

      map.addLayer({
          'id': '3d-buildings',
          'source': 'composite',
          'source-layer': 'building',
          'filter': ['==', 'extrude', 'true'],
          'type': 'fill-extrusion',
          'minzoom': 15,
          'paint': {
              'fill-extrusion-color': '#aaa',

              // use an 'interpolate' expression to add a smooth transition effect to the
              // buildings as the user zooms in
              'fill-extrusion-height': [
                  "interpolate", ["linear"], ["zoom"],
                  15, 0,
                  15.05, ["get", "height"]
              ],
              'fill-extrusion-base': [
                  "interpolate", ["linear"], ["zoom"],
                  15, 0,
                  15.05, ["get", "min_height"]
              ],
              'fill-extrusion-opacity': .6
          }
      }, labelLayerId);

      map.loadImage('https://upload.wikimedia.org/wikipedia/commons/thumb/0/05/Ethereum_logo_2014.svg/200px-Ethereum_logo_2014.svg.png', function(error, image) {
        if (error) throw error;
        map.addImage('ethereum', image);
        map.addLayer({
            "id": "points",
            "type": "symbol",
            "source": {
                "type": "geojson",
                "data": {
                    "type": "FeatureCollection",
                    "features": [{
                        "type": "Feature",
                        "geometry": {
                            "type": "Point",
                            "coordinates": [-104.9896020, 39.7323460]
                        }
                    }]
                }
            },
            "layout": {
                "icon-image": "ethereum",
                "icon-size": 0.35
            }
        });
    });
    });

    map.flyTo({
      // These options control the ending camera position: centered at
      // the target, at zoom level 9, and north up.
      center: end,
      zoom: 11,
      bearing: 90,
      pitch: 45,
      // pitch: 72,
      // bearing: 180,

      // These options control the flight curve, making it move
      // slowly and zoom out almost completely before starting
      // to pan.
      speed: 0.7, // make the flying slow
      curve: 0.4, // change the speed at which it zooms out

      // This can be any easing function: it takes a number between
      // 0 and 1 and returns another number between 0 and 1.
      easing: (t) => t
    })
  }

  render() {
    return (
      <div id="map" style={style}></div>
    )
  }
}

export default Map;
