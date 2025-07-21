// ArcgisMap.jsx
import React, { useEffect } from "react";

const ArcgisMap = () => {
  useEffect(() => {
    // Set portal URL trước khi SDK load
    window.esriConfig = {
      portalUrl: "https://iotplatform.intelli.com.vn/portal",
    };

    // Tải ArcGIS JS SDK (nên là đầu tiên)
    const arcgisScript = document.createElement("script");
    arcgisScript.src = "https://js.arcgis.com/4.33/";
    arcgisScript.async = true;
    document.body.appendChild(arcgisScript);

    // Tải Calcite Components
    const calciteScript = document.createElement("script");
    calciteScript.type = "module";
    calciteScript.src = "https://js.arcgis.com/calcite-components/3.2.1/calcite.esm.js";
    document.body.appendChild(calciteScript);

    // CSS cho bản đồ
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = "https://js.arcgis.com/4.33/esri/themes/light/main.css";
    document.head.appendChild(link);
  }, []);

  return (
    <div style={{ width: "100%", height: "100vh" }}>
      <arcgis-map
        item-id="d59152f99b2e4369b6b0bacad0397a74"
        basemap="arcgis/topographic"
        center="-118.805, 34.027"
        zoom="13"
        style={{ width: "100%", height: "100%", display: "block" }}
      >
        <arcgis-zoom position="top-left"></arcgis-zoom>
        <arcgis-legend position="bottom-right"></arcgis-legend>
      </arcgis-map>
    </div>
  );
};

export default ArcgisMap;
