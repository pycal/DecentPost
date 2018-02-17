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
    const start = [-104.9895834, 39.7323209];
    const end = [74.0060, 40.7128];
    const map = new mapboxgl.Map({
      container: 'map',
      style: 'mapbox://styles/jdjkelly2/cjdrq9j3q2mom2sonct9s96m0',
      center: start,
      zoom: 12
    }).flyTo({
      // These options control the ending camera position: centered at
      // the target, at zoom level 9, and north up.
      center: end,
      zoom: 12,
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
