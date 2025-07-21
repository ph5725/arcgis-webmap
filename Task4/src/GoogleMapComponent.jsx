// GoogleMapComponent.jsx
import React, { useEffect } from 'react';

const GoogleMapComponent = () => {
  useEffect(() => {
    const script = document.createElement('script');
    script.src =
      'https://maps.googleapis.com/maps/api/js?key=AIzaSyA_sXNtLTVAQE4MoPGsw0OHuEygS_Tlb0k&callback=initMap';
    script.async = true;
    script.defer = true;
    document.head.appendChild(script);

    window.initMap = function () {
      const center = { lat: 34.027, lng: -118.805 };
      const map = new window.google.maps.Map(document.getElementById('map'), {
        zoom: 13,
        center: center,
      });

      // Tạo popup (InfoWindow)
      const infoWindow = new window.google.maps.InfoWindow();

      // Marker trung tâm
      const centerMarker = new window.google.maps.Marker({
        position: center,
        map,
        title: 'Vị trí trung tâm',
      });

      // Gắn popup khi click
      centerMarker.addListener('click', () => {
        infoWindow.setContent('<strong>Vị trí trung tâm</strong><br>Lat: 34.027, Lng: -118.805');
        infoWindow.open(map, centerMarker);
      });

      // Marker phụ
      const marker2 = new window.google.maps.Marker({
        position: { lat: 34.03, lng: -118.81 },
        map,
        title: 'Marker phụ',
      });

      marker2.addListener('click', () => {
        infoWindow.setContent('Đây là marker phụ');
        infoWindow.open(map, marker2);
      });

      // Đường
      const linePath = [
        { lat: 34.027, lng: -118.805 },
        { lat: 34.03, lng: -118.81 },
        { lat: 34.035, lng: -118.79 },
      ];
      new window.google.maps.Polyline({
        path: linePath,
        geodesic: true,
        strokeColor: '#FF6600',
        strokeOpacity: 1.0,
        strokeWeight: 2,
        map,
      });

      // Vùng (polygon)
      const polygonCoords = [
        { lat: 34.02, lng: -118.81 },
        { lat: 34.02, lng: -118.79 },
        { lat: 34.04, lng: -118.79 },
        { lat: 34.04, lng: -118.81 },
      ];
      const polygon = new window.google.maps.Polygon({
        paths: polygonCoords,
        strokeColor: '#00897B',
        strokeOpacity: 0.8,
        strokeWeight: 2,
        fillColor: '#4DB6AC',
        fillOpacity: 0.5,
        map,
      });

      // Gắn popup cho polygon khi click
      polygon.addListener('click', (e) => {
        infoWindow.setContent('Đây là vùng polygon');
        infoWindow.setPosition(e.latLng); // Hiển thị tại vị trí click
        infoWindow.open(map);
      });
    };

    return () => {
      delete window.initMap;
    };
  }, []);

  return <div id="map" style={{ height: '100vh', width: '100%' }}></div>;
};

export default GoogleMapComponent;
