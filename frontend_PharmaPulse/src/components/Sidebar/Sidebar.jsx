import "./Sidebar.css";

const Sidebar = ({ onSelect, activeLink }) => {
  return (
    <aside className="sidebar">
      <div className="sidebar-section">
        <h2>Products</h2>
        <ul>
          <li>
            <a
              href="#"
              onClick={() => onSelect("addProduct")}
              className={
                activeLink === "addProduct"
                  ? "sidebar-link active"
                  : "sidebar-link"
              }
            >
              Add Products
            </a>
          </li>
          <li>
            <a
              href="#"
              onClick={() => onSelect("productsInfo")}
              className={
                activeLink === "productsInfo"
                  ? "sidebar-link active"
                  : "sidebar-link"
              }
            >
              Products Info
            </a>
          </li>
        </ul>
      </div>
      <div className="sidebar-section">
        <h2>Suppliers</h2>
        <ul>
          <li>
            <a
              href="#"
              onClick={() => onSelect("addSupplier")}
              className={
                activeLink === "addSupplier"
                  ? "sidebar-link active"
                  : "sidebar-link"
              }
            >
              Add Suppliers
            </a>
          </li>
          <li>
            <a
              href="#"
              onClick={() => onSelect("suppliersInfo")}
              className={
                activeLink === "suppliersInfo"
                  ? "sidebar-link active"
                  : "sidebar-link"
              }
            >
              Suppliers Info
            </a>
          </li>
        </ul>
      </div>
      <div className="sidebar-section">
        <h2>Customers</h2>
        <ul>
          <li>
            <a
              href="#"
              onClick={() => onSelect("addCustomer")}
              className={
                activeLink === "addCustomer"
                  ? "sidebar-link active"
                  : "sidebar-link"
              }
            >
              Add Customers
            </a>
          </li>
          <li>
            <a
              href="#"
              onClick={() => onSelect("customersInfo")}
              className={
                activeLink === "customersInfo"
                  ? "sidebar-link active"
                  : "sidebar-link"
              }
            >
              Customers Info
            </a>
          </li>
        </ul>
      </div>
    </aside>
  );
};

export default Sidebar;
