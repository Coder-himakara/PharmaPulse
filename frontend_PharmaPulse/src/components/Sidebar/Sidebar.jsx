import "./Sidebar.css";
import { NavLink } from "react-router-dom";

const Sidebar = () => {
  return (
    <aside className="sidebar">
      <div className="sidebar-section">
        <h2>Products</h2>
        <ul>
          <li>
            <NavLink
              to="/add-products"
              className={({ isActive }) =>
                isActive ? "sidebar-link active" : "sidebar-link"
              }
            >
              Add Products
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/products-info"
              className={({ isActive }) =>
                isActive ? "sidebar-link active" : "sidebar-link"
              }
            >
              Products Info
            </NavLink>
          </li>
        </ul>
      </div>
      <div className="sidebar-section">
        <h2>Suppliers</h2>
        <ul>
          <li>
            <NavLink
              to="/add-suppliers"
              className={({ isActive }) =>
                isActive ? "sidebar-link active" : "sidebar-link"
              }
            >
              Add Suppliers
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/suppliers-info"
              className={({ isActive }) =>
                isActive ? "sidebar-link active" : "sidebar-link"
              }
            >
              Suppliers Info
            </NavLink>
          </li>
        </ul>
      </div>
      <div className="sidebar-section">
        <h2>Customers</h2>
        <ul>
          <li>
            <NavLink
              to="/add-customers"
              className={({ isActive }) =>
                isActive ? "sidebar-link active" : "sidebar-link"
              }
            >
              Add Customers
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/customers-info"
              className={({ isActive }) =>
                isActive ? "sidebar-link active" : "sidebar-link"
              }
            >
              Customers Info
            </NavLink>
          </li>
        </ul>
      </div>
    </aside>
  );
};

export default Sidebar;
