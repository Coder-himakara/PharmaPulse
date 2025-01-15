import "./Sidebar.css";

const Sidebar = () => {
  return (
    <aside className="sidebar">
      <div className="sidebar-section">
        <h2>Products</h2>
        <ul>
          <li>
            <a href="">Add Products</a>
          </li>
          <li>
            <a href="">Products Info</a>
          </li>
        </ul>
      </div>
      <div className="sidebar-section">
        <h2>Suppliers</h2>
        <ul>
          <li>
            <a href="">Add Suppliers</a>
          </li>
          <li>
            <a href="">Suppliers Info</a>
          </li>
        </ul>
      </div>
      <div className="sidebar-section">
        <h2>Customers</h2>
        <ul>
          <li>
            <a href="">Add Customers</a>
          </li>
          <li>
            <a href="">Customers Info</a>
          </li>
        </ul>
      </div>
    </aside>
  );
};

export default Sidebar;