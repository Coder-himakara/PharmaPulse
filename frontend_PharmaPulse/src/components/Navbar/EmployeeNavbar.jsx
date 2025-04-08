/* eslint-disable prettier/prettier */
import { useState, useContext } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import PropTypes from "prop-types";

import { FaUser, FaSignOutAlt, FaSun, FaMoon } from "react-icons/fa";

import logo from "../../assets/Logo.jpg";
import { ThemeContext } from "../../ThemeContext";
import { MegaMenu } from "primereact/megamenu";
import { useAuth } from '../../security/UseAuth';



const DropdownLink = ({ to, icon: Icon, children, onClick }) => (
  <li>
    <NavLink
      to={to}
      className={({ isActive }) =>
        `flex items-center p-2 text-sm rounded-md transition-all duration-300 ${
          isActive
            ? "bg-teal-700 text-white"
            : "bg-transparent text-gray-700 dark:text-gray-300 hover:bg-teal-700 hover:text-teal-300"
        }`
      }
      onClick={onClick}
    >
      {Icon && <Icon className="w-5 h-5 mr-2" />}
      {children}
    </NavLink>
  </li>
);

DropdownLink.propTypes = {
  to: PropTypes.string.isRequired,
  icon: PropTypes.elementType,
  children: PropTypes.node.isRequired,
  onClick: PropTypes.func,
};

const EmployeeNavbar = () => {
  const { isDarkMode, toggleTheme } = useContext(ThemeContext);
  const [isDropdownVisible, setIsDropdownVisible] = useState(false);
  const navigate = useNavigate();
  const { logout } = useAuth();
 

  const toggleDropdown = () => {
    setIsDropdownVisible((prev) => !prev);
  };

  const closeDropdown = () => {
    setIsDropdownVisible(false);
  };

  const logoutEmployee = () => {
    setIsDropdownVisible(false);
    logout();
  };

  const EmployeeNavbarSections = [
    {
      label: "Partners",
      icon: "pi pi-users text-white",
      items: [
        [
          {
            label: "Customer Groups",
            items: [
              { label: "Add Customer Group", command: () => navigate("/employee-dashboard/add-customer-group") },
              { label: "Customer Group Info", command: () => navigate("/employee-dashboard/customer-group-info") },
            ],
          },
        ],
        [
          {
            label: "Customers",
            items: [
              { label: "Add Customer", command: () => navigate("/employee-dashboard/add-customers") },
              { label: "Customer Info", command: () => navigate("/employee-dashboard/customers-info") },
            ],
          },
        ],
        [
          {
            label: "Purchase Group",
            items: [
              { label: "Add Purchase Group", command: () => navigate("/employee-dashboard/add-purchase-group") },
              { label: "Purchase Group Info", command: () => navigate("/employee-dashboard/purchase-group-info") },
            ],
          },
        ],
        [
          {
            label: "Suppliers",
            items: [
              { label: "Add Supplier", command: () => navigate("/employee-dashboard/add-suppliers") },
              { label: "Supplier Info", command: () => navigate("/employee-dashboard/suppliers-info") },
            ],
          },
        ],
      ],
    },
    {
      label: "Products",
      icon: "pi pi-shopping-cart text-white",
      items: [
        [
          {
            label: "Products",
            items: [
              { label: "Add Product", command: () => navigate("/employee-dashboard/add-products") },
              { label: "Product Info", command: () => navigate("/employee-dashboard/products-info") },
            ],
          },
        ],
        [
          {
            label: "Product Price Info",
            items: [{ label: "Wholesale Price Info",command: () => navigate("/employee-dashboard/retail-price-info") }],
          },
        ],
      ],
    },
    {
      label: "Invoicing",
      icon: "pi pi-file-edit text-white",
      items: [
        [
          {
            label: "Purchase",
            items: [
              { label: "Add Invoice", command: () => navigate("/employee-dashboard/add-purchase-invoice") },
              { label: "Invoice Info", command: () => navigate("/employee-dashboard/purchase-invoice-info") },
            ],
          },
        ],
        [
          {
            label: "Sale",
            items: [
              { label: "Orders", command: () => navigate("/employee-dashboard/orders") },
              { label: "Invoice Info", command: () => navigate("/employee-dashboard/sales-invoice-info") },
            ],
          },
        ],
        [
          {
            label: "Purchase Return",
            items: [
              { label: "Return Invoice", command: () => navigate("/employee-dashboard/purchase-return-invoice") },
              { label: "Invoice Info", command: () => navigate("/employee-dashboard/purchase-invoice-info") },
            ],
          },
        ],
        [
          {
            label: "Sales Return",
            items: [
              { label: "Return Invoice" },
              { label: "Invoice Info" },
            ],
          },
        ],
      ],
    },
    {
      label: "Inventory",
      icon: "pi pi-warehouse text-white",
      items: [
        [
          {
            label: "Inventory Details",
            items: [{ label: "Stock Register" ,command: () => navigate("/employee-dashboard/stock-register") },
                    { label: "Expiry Distribution",command: () => navigate("/employee-dashboard/expiry-distribution")  },
                    { label: "Inventory Location",command: () => navigate("/employee-dashboard/inventory-location")  }
            ],
          },
        ],
        [
          {
            label: "Inventory Tasks",
            items: [
              { label: "Stock Transfer", command: () => navigate("/employee-dashboard/stock-transfer") },
              { label: "Stock Adjustment" },
            ],
          },
        ],
      ],
    },
    {
      label: "Payment",
      icon: "pi pi-credit-card text-white",
      items: [
        [
          {
            label: "Receipt Generate",
            items: [
              { label: "Customer Receipt", command: () => navigate("/employee-dashboard/customer-receipt-generate") },
              { label: "Supplier Receipt", command: () => navigate("/employee-dashboard/supplier-receipt-generate") },
            ],
          },
        ],
      ]
    },
    {
      label: "Reports",
      icon: "pi pi-chart-line text-white",
      items: [
        [
          {
            label: "Report Genarate",
            items: [
              { label: "Stock Balance Report", command: () => navigate("/employee-dashboard/stock-balance-report-generate") },
              { label: "Outstanding Report", command: () => navigate("/employee-dashboard/monthly-report-generate") },
             
            ],
          },
        ],
      ]
      
    },
  ];

  return (
    <div
      className={`flex justify-between items-center px-6 py-4 fixed top-0 left-0 w-full z-10 h-[100px] transition-colors duration-300 ${
        isDarkMode ? "bg-gray-900 text-white" : "bg-teal-800 text-white"
      }`}
    >
      <div className="flex items-center gap-6">
        <img src={logo} alt="Logo" className="h-10 mr-4" />

        <button
          onClick={() => navigate("/employee-dashboard")

          }
          className="text-lg font-bold bg-transparent border-none cursor-pointer hover:text-teal-300"
        >
          Dashboard
        </button>
      </div>

      {/* Mega Menu centered dropdown */}
      <div className="justify-center hidden w-full md:flex">
        <MegaMenu
          model={EmployeeNavbarSections}
          breakpoint="960px"
          pt={{
            root: { className: `${isDarkMode ? "bg-gray-900 text-white" : "bg-teal-800 text-black"} border-none` },
            menu: { className: "bg-transparent gap-2 border-none shadow-md flex justify-right w-full" },
            panel: { className: "absolute bg-white shadow-lg rounded-md" },
            submenu: { className: `${isDarkMode ? "text-white" : "text-black"} border-none` },
            content: { className: `${isDarkMode ? "hover:bg-gray-700" : "hover:bg-teal-700"} border-none` },
            label: {
              className: `${isDarkMode ? "text-gray-400 hover:bg-gray-700 hover:text-white" : "text-gray-400 hover:bg-teal-700 hover:text-white"} border-none`,
            },
            icon: { className: "text-white font-bold" },
            menuitem: { className: "hover:bg-transparent text-black text-left" },
            action: { className: "hover:bg-transparent text-black" },
            link: { className: "hover:bg-transparent text-black" },
            submenuitem: { className: "hover:bg-transparent text-black text-left" },
          }}
        />
      </div>

      <div className="relative flex items-center gap-4">
        <div>
          <span className="text-sm font-bold">Amali</span>
          <br />
          <span className="text-xs italic">Employee</span>
        </div>
        <div className="relative">
          <button
            onClick={toggleDropdown}
            className="flex items-center text-base text-white bg-transparent border-none cursor-pointer hover:text-teal-300"
          >
            ▼
          </button>
          {isDropdownVisible && (
            <ul
              className={`absolute top-full right-0 mt-2 border rounded-md min-w-[150px] shadow-lg z-10 list-none ${
                isDarkMode ? "bg-gray-800 text-white border-gray-600" : "bg-white text-black border-gray-300"
              }`}
            >
              <DropdownLink to="/update-profile" icon={FaUser} onClick={closeDropdown}>
                Profile
              </DropdownLink>
              <DropdownLink to="/" icon={FaSignOutAlt} onClick={logoutEmployee}>
                Log Out
              </DropdownLink>
            </ul>
          )}
        </div>

        <button
          className="flex items-center justify-center w-8 h-8 rounded-full focus:outline-none"
          onClick={toggleTheme}
        >
          {isDarkMode ? (
            <FaSun className="w-5 h-5 text-yellow-400" />
          ) : (
            <FaMoon className="w-5 h-5 text-teal-300" />
          )}
        </button>
      </div>
    </div>
  );
};

export default EmployeeNavbar;