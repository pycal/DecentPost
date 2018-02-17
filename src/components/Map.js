import React, { Component } from 'react';

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
    const start = [-74.50, 40];
    const end = [74.50, 40];
    const map = new mapboxgl.Map({
      container: 'map',
      style: 'mapbox://styles/mapbox/satellite-streets-v10',
      center: start,
      zoom: 9
    }).flyTo({
      // These options control the ending camera position: centered at
      // the target, at zoom level 9, and north up.
      center: end,
      zoom: 9,
      bearing: 0,

      // These options control the flight curve, making it move
      // slowly and zoom out almost completely before starting
      // to pan.
      speed: 0.2, // make the flying slow
      curve: 1, // change the speed at which it zooms out

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
