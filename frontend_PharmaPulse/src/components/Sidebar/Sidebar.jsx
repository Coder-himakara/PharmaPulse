import { NavLink } from "react-router-dom";
import PropTypes from "prop-types";

const SidebarLink = ({ to, children }) => (
  <li className="mb-[10px]">
    <NavLink
      to={to}
      className={({ isActive }) =>
        `block text-[17px] p-[10px] px-[15px] rounded transition-all duration-300 ${
          isActive
            ? "bg-[#2d6a6c] text-white"
            : "text-[#494949] hover:bg-[#2d6a6c] hover:text-[#1abc9c]"
        }`
      }
    >
      {children}
    </NavLink>
  </li>
);

SidebarLink.propTypes = {
  to: PropTypes.string.isRequired, // Ensuring 'to' is a required string
  children: PropTypes.node.isRequired, // Ensuring 'children' is required and can be any renderable content
};

const Sidebar = () => {
  return (
    <aside className="fixed top-[100px] bottom-[70px] left-0 w-[250px] bg-[#c1d4e0] text-[#494949] overflow-y-auto shadow-md p-5 z-[999] box-border">
      <div className="mb-5">
        <h2 className="text-[20px] mb-2 mt-4 border-b border-[#2d6a6c] pb-1 font-bold">
          Products
        </h2>
        <ul className="list-none p-0">
          <SidebarLink to="/add-products">Add Products</SidebarLink>
          <SidebarLink to="/products-info">Products Info</SidebarLink>
        </ul>
      </div>

      <div className="mb-5">
        <h2 className="text-[20px] mb-2 mt-4 border-b border-[#2d6a6c] pb-1 font-bold">
          Suppliers
        </h2>
        <ul className="list-none p-0">
          <SidebarLink to="/add-suppliers">Add Suppliers</SidebarLink>
          <SidebarLink to="/suppliers-info">Suppliers Info</SidebarLink>
        </ul>
      </div>

      <div>
        <h2 className="text-[20px] mb-2 mt-4 border-b border-[#2d6a6c] pb-1 font-bold">
          Customers
        </h2>
        <ul className="list-none p-0">
          <SidebarLink to="/add-customers">Add Customers</SidebarLink>
          <SidebarLink to="/customers-info">Customers Info</SidebarLink>
        </ul>
      </div>
    </aside>
  );
};

export default Sidebar;
