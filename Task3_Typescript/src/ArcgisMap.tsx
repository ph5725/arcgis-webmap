import React, { useEffect, useRef, useState } from 'react';
import { LuMonitor, LuMinimize } from 'react-icons/lu';
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import '@arcgis/core/assets/esri/themes/light/main.css';

const PrivatePortalMap: React.FC = () => {
  const mapRef = useRef<HTMLDivElement | null>(null);
  const viewRef = useRef<__esri.MapView | null>(null);
  const [showInterface, setShowInterface] = useState<boolean>(true);
  const [mapLoaded, setMapLoaded] = useState<boolean>(false);

  useEffect(() => {
    const loadMap = async () => {
      const [
        WebMap,
        MapView,
        Portal,
        esriConfig,
        //Legend,
        BasemapGallery,
        BasemapToggle,
        // Home,
        Basemap,
        TileLayer,
        LocalBasemapsSource,
      ] = await Promise.all([
        import('@arcgis/core/WebMap'),
        import('@arcgis/core/views/MapView'),
        import('@arcgis/core/portal/Portal'),
        import('@arcgis/core/config'),
        import('@arcgis/core/widgets/Legend'),
        import('@arcgis/core/widgets/BasemapGallery'),
        import('@arcgis/core/widgets/BasemapToggle'),
        import('@arcgis/core/widgets/Home'),
        import('@arcgis/core/Basemap'),
        import('@arcgis/core/layers/TileLayer'),
        import('@arcgis/core/widgets/BasemapGallery/support/LocalBasemapsSource'),
      ]);

      esriConfig.default.portalUrl = 'https://iotplatform.intelli.com.vn/portal';

      const portal = new Portal.default({
        url: 'https://iotplatform.intelli.com.vn/portal',
        authMode: 'auto',
      });

      try {
        await portal.load();
        console.log('Portal loaded');

        const webmap = new WebMap.default({
          portalItem: {
            id: 'd59152f99b2e4369b6b0bacad0397a74',
            portal,
          },
        });

        await webmap.load();

        const view = new MapView.default({
          container: mapRef.current as HTMLDivElement,
          map: webmap,
        });

        viewRef.current = view;

        await view.when();
        console.log('Map loaded');
        setMapLoaded(true);

        // Local basemaps
        const basemaps = [
          'topographic',
          'streets',
          'imagery',
          'community',
          'navigation',
        ].map((style) => new Basemap.default({
          title: style.charAt(0).toUpperCase() + style.slice(1),
          baseLayers: [new TileLayer.default({
            url: `https://basemapstyles-api.arcgis.com/arcgis/rest/services/styles/v2/webmaps/arcgis/${style}`,
          })],
        }));

        const basemapGallery = new BasemapGallery.default({
          view,
          container: document.createElement('div'),
          source: new LocalBasemapsSource.default({ basemaps }),
        });

        view.ui.add(basemapGallery, 'bottom-right');
        (basemapGallery.container as HTMLElement).style.padding = '10px';
        (basemapGallery.container as HTMLElement).style.maxHeight = '400px';
        (basemapGallery.container as HTMLElement).style.overflowY = 'auto';
        (basemapGallery.container as HTMLElement).classList.add('toggleable-ui');

        const basemapToggle = new BasemapToggle.default({
          view,
          nextBasemap: 'hybrid',
        });
        view.ui.add(basemapToggle, 'top-left');
        (basemapToggle.container as HTMLElement).style.display = 'flex';
        (basemapToggle.container as HTMLElement).style.flexDirection = 'column';
        (basemapToggle.container as HTMLElement).style.alignItems = 'center';
        (basemapToggle.container as HTMLElement).style.maxWidth = '200px';

        // const homeWidget = new Home.default({ view });
        // view.ui.add(homeWidget, 'top-right');
      } catch (error) {
        console.error('Failed to load map or portal:', error);
      }
    };

    loadMap();

    return () => {
      if (viewRef.current) {
        viewRef.current.destroy();
        viewRef.current = null;
      }
      if (mapRef.current) {
        mapRef.current.innerHTML = '';
      }
    };
  }, []);

  const toggleInterface = () => {
    const newState = !showInterface;
    setShowInterface(newState);

    const widgets = document.querySelectorAll<HTMLElement>('.toggleable-ui');
    widgets.forEach((widget) => {
      widget.style.display = newState ? 'block' : 'none';
    });

    const header = document.querySelector<HTMLElement>('.map-header');
    if (header) {
      header.style.display = newState ? 'flex' : 'none';
    }

    if (mapRef.current) {
      mapRef.current.style.height = newState ? 'calc(100vh - 60px)' : '100vh';
    }
  };

  return (
    <div style={{ height: '100vh', width: '100%' }}>
      <div
        className="map-header"
        style={{
          padding: '10px',
          background: '#f5f5f5',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          borderBottom: '1px solid #ddd',
          height: '60px',
        }}
      >
        <h2 style={{ margin: 0 }}>WM Mạng lưới cấp nước Data WareHouse </h2>
      </div>

      {mapLoaded && (
        <button
          onClick={toggleInterface}
          style={{
            padding: '10px',
            background: 'rgba(255,255,255,0.9)',
            color: '#333',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            position: 'fixed',
            left: '20px',
            bottom: '20px',
            zIndex: 1000,
            boxShadow: '0 1px 4px rgba(0,0,0,0.2)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '40px',
            height: '40px',
          }}
          title={showInterface ? 'Ẩn giao diện' : 'Hiện giao diện'}
        >
          {showInterface ? (
            <LuMonitor size={20} color="#333" />
          ) : (
            <LuMinimize size={20} color="#333" />
          )}
        </button>
      )}

      <div
        ref={mapRef}
        style={{
          height: showInterface ? 'calc(100vh - 60px)' : '100vh',
          width: '100%',
          transition: 'height 0.3s ease',
        }}
      />
    </div>
  );
};

export default PrivatePortalMap;
