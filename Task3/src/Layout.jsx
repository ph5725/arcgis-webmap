import React from "react";
import { Link, Outlet } from "react-router-dom";

const Layout = () => {
  return (
    <div>
      {/* Menu / Navigation */}
      <div style={{ padding: "10px", backgroundColor: "#f0f0f0" }}>
        <Link to="/" style={{ marginRight: "10px" }}>
          <button>Bản đồ</button>
        </Link>
        <Link to="/page1" style={{ marginRight: "10px" }}>
          <button>Trang 1</button>
        </Link>
        <Link to="/page2">
          <button>Trang 2</button>
        </Link>
      </div>

      {/* Nội dung từng trang sẽ hiển thị tại đây */}
      <Outlet />
    </div>
  );
};

export default Layout;
