import React, { useEffect, useRef, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { LuMonitor, LuMinimize } from 'react-icons/lu';

function PrivatePortalMap() {
  const mapRef = useRef(null);
  const [showInterface, setShowInterface] = useState(true);
  const [mapLoaded, setMapLoaded] = useState(false);
  const viewRef = useRef(null);

  useEffect(() => {
    const loadMap = async () => {
      const [
        WebMap,
        MapView,
        Portal,
        esriConfig,
        Legend,
        BasemapGallery,
        BasemapToggle,
        Home,
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
        import('@arcgis/core/layers/TileLayer'), // Thêm để sử dụng service URL
        import('@arcgis/core/widgets/BasemapGallery/support/LocalBasemapsSource'),
        import('@arcgis/core/assets/esri/themes/light/main.css'),
      ]);

      esriConfig.default.portalUrl = "https://iotplatform.intelli.com.vn/portal";

      const portal = new Portal.default({
        url: "https://iotplatform.intelli.com.vn/portal",
        authMode: "auto",
      });

      try {
        await portal.load();
        console.log("Portal loaded successfully.");

        // Log danh sách basemap từ portal
        console.log("Danh sách Basemap từ Portal:");
        if (portal.basemaps && portal.basemaps.length > 0) {
          portal.basemaps.forEach((basemap, index) => {
            console.log(`  ${index + 1}. Title: ${basemap.title} (ID: ${basemap.id || 'N/A'})`);
            if (basemap.thumbnailUrl) {
              console.log(`     Thumbnail: ${basemap.thumbnailUrl}`);
            }
          });
        } else {
          console.log("  Không tìm thấy basemap nào từ Portal này hoặc không có quyền truy cập.");
        }

        const webmap = new WebMap.default({
          portalItem: {
            id: "d59152f99b2e4369b6b0bacad0397a74",
            portal: portal,
          },
        });

        await webmap.load();

        const view = new MapView.default({
          container: mapRef.current,
          map: webmap,
        });

        viewRef.current = view;

        await view.when();
        console.log("Map loaded successfully");
        setMapLoaded(true);

        // Tạo danh sách basemap với service URL
        const basemaps = [
          new Basemap.default({
            title: "Topographic",
            baseLayers: [new TileLayer.default({
              url: "https://basemapstyles-api.arcgis.com/arcgis/rest/services/styles/v2/webmaps/arcgis/topographic" // Basemap Topographic công khai
            })]
          }),
          new Basemap.default({
            title: "Streets",
            baseLayers: [new TileLayer.default({
              url: "https://basemapstyles-api.arcgis.com/arcgis/rest/services/styles/v2/webmaps/arcgis/streets" // Basemap Streets công khai
            })]
          }),
          new Basemap.default({
            title: "Imagery",
            baseLayers: [new TileLayer.default({
              url: "https://basemapstyles-api.arcgis.com/arcgis/rest/services/styles/v2/webmaps/arcgis/imagery" // Basemap Imagery công khai
            })]
          }),
          new Basemap.default({
            title: "Hybrid",
            baseLayers: [new TileLayer.default({
              url: "https://basemapstyles-api.arcgis.com/arcgis/rest/services/styles/v2/webmaps/arcgis/community" // Basemap community công khai
            })]
          }),
          new Basemap.default({
            title: "Navigation",
            baseLayers: [new TileLayer.default({
              url: "https://basemapstyles-api.arcgis.com/arcgis/rest/services/styles/v2/webmaps/arcgis/navigation" // Basemap Navigation công khai
            })]
          }),
        ];

        // Thêm BasemapGallery với nguồn LocalBasemapsSource
        const basemapGallery = new BasemapGallery.default({
          view: view,
          container: document.createElement("div"),
          source: new LocalBasemapsSource.default({
            basemaps: basemaps
          })
        });
        view.ui.add(basemapGallery, "top-right");
        basemapGallery.container.style.padding = "10px";
        basemapGallery.container.style.maxHeight = "400px";
        basemapGallery.container.style.overflowY = "auto";
        basemapGallery.container.classList.add('toggleable-ui');

        // Log danh sách basemap từ BasemapGallery
        basemapGallery.when(() => {
          console.log("Danh sách Basemap từ BasemapGallery:");
          if (basemapGallery.source.basemaps && basemapGallery.source.basemaps.length > 0) {
            basemapGallery.source.basemaps.forEach((basemap, index) => {
              console.log(`  ${index + 1}. Title: ${basemap.title} (ID: ${basemap.id || 'N/A'})`);
              if (basemap.thumbnailUrl) {
                console.log(`     Thumbnail: ${basemap.thumbnailUrl}`);
              }
            });
          } else {
            console.log("  Không tìm thấy basemap nào trong BasemapGallery.");
          }
        }).catch((err) => {
          console.error("Lỗi khi tải BasemapGallery:", err);
        });

        // Thêm BasemapToggle (luôn hiển thị)
        const basemapToggle = new BasemapToggle.default({
          view: view,
          nextBasemap: "hybrid", // Sử dụng title của basemap
        });
        view.ui.add(basemapToggle, "top-right");

        // Thêm Home widget (luôn hiển thị)
        const homeWidget = new Home.default({
          view: view,
        });
        view.ui.add(homeWidget, "top-left");
      } catch (error) {
        console.error("Failed to load map or portal:", error);
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

    const widgets = document.querySelectorAll('.toggleable-ui');
    widgets.forEach((widget) => {
      widget.style.display = newState ? 'block' : 'none';
    });

    const header = document.querySelector('.map-header');
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
        <h2 style={{ margin: 0 }}>Bản đồ hệ thống IoT</h2>
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
}

export default PrivatePortalMap;