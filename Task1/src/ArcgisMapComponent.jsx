import React, { useEffect } from 'react';

function ArcGISMapComponent() {
  useEffect(() => {
    // Tải script từ CDN
    const loadScript = (src, type = 'text/javascript') => {
      return new Promise((resolve, reject) => {
        const script = document.createElement('script');
        script.src = src;
        script.type = type;
        script.onload = resolve;
        script.onerror = reject;
        document.head.appendChild(script);
      });
    };

    const loadStylesheet = (href) => {
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = href;
      document.head.appendChild(link);
    };

    loadStylesheet('https://js.arcgis.com/4.33/esri/themes/light/main.css');
    loadScript('https://js.arcgis.com/4.33/')
      .then(() => loadScript('https://js.arcgis.com/4.33/map-components/', 'module'))
      .then(() => loadScript('https://js.arcgis.com/calcite-components/3.2.1/calcite.esm.js', 'module'));
  }, []);

  return (
    <div style={{ height: '100vh', width: '100%' }}>
      <arcgis-map item-id="237b9584339446a0b56317b5962a4971">
        <arcgis-zoom position="top-left"></arcgis-zoom>
        <arcgis-legend position="bottom-right"></arcgis-legend>
      </arcgis-map>
    </div>
  );
}

export default ArcGISMapComponent;