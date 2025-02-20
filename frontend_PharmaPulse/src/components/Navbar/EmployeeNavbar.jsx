/* eslint-disable prettier/prettier */
import { useState, useContext } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import PropTypes from "prop-types";
import { FaUser, FaSignOutAlt,FaSun, FaMoon } from "react-icons/fa";
import logo from "../../assets/Logo.jpg";
import { ThemeContext } from "../../ThemeContext";
import { MegaMenu } from "primereact/megamenu";

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

const Navbar = () => {
  const { isDarkMode, toggleTheme } = useContext(ThemeContext);
  const [isDropdownVisible, setIsDropdownVisible] = useState(false);
  const navigate = useNavigate();

  const toggleDropdown = () => {
    setIsDropdownVisible((prev) => !prev);
  };

  const closeDropdown = () => {
    setIsDropdownVisible(false);
  };

  const handleMenuClick = (event) => {
    if (event.item.url) {
      navigate(event.item.url);
    }
  };

  const EmployeeNavbarSections=
  [
    
    {
      "label": "Partners",
      "icon": "pi pi-users text-white",
      "items": [
        [
          {
            "label": "Customers Group",
            "items": [
              { "label": "Add Customer Group", "url": "employee-dashboard/add-customer-group" },
              { "label": "Customer Group Info", "url": "customer-group-info" }
            ]
          }
        ],
        [
          {
            "label": "Customer",
            "items": [
              { "label": "Add Customer", "url": "add-customers" },
              { "label": "Customer Info", "url": "customers-info" }
            ]
          }
        ],
        [
          {
            "label": "Purchase Group",
            "items": [
              { "label": "Add Purchase Group", "url": "add-purchase-group" },
              { "label": "Purchase Group Info", "url": "purchase-group-info" }
            ]
          }
        ],
        [
          {
            "label": "Supplier",
            "items": [
              { "label": "Add Supplier", "url": "add-suppliers" },
              { "label": "Supplier Info", "url": "suppliers-info" }
            ]
          }
        ]
      ]
    },
    {
      "label": "Products",
      "icon": "pi pi-shopping-cart text-white",
      "items": [
        [
          {
            "label": "Products",
            "items": [
              { "label": "Add Products", "url": "add-products" },
              { "label": "Products Info", "url": "products-info" }
            ]
          }
        ],
        [
          {
            "label": "Product Retail Price",
            "items": [{ "label": "Retail Price Info" }]
          }
        ]
      ]
    },
    {
      "label": "Invoicing",
      "icon": "pi pi-file-edit text-white",
      "items": [
        [
          {
            "label": "Purchase",
            "items": [
              { "label": "Add Invoice", "url": "add-purchase-invoice" },
              { "label": "Invoice Info", "url": "purchase-invoice-info" }
            ]
          }
        ],
        [{ "label": "Sale ",
           "items": [
            { "label": "Orders", "url": "orders" },
            { "label": "Invoice Info", "url": "purchase-invoice-info" }
          ]
         }
        ],
        [{ "label": "Purchase Return",
            "items": [
              { "label": "Return Invoice", "url": "purchase-return-invoice" },
              { "label": "Invoice Info", "url": "purchase-invoice-info" }
            ]
         }
        ],
        
        [{ "label": "Sales Return",
          "items": [
            { "label": "Return Invoice", "url": "sales-return-invoice" },
            { "label": "Invoice Info", "url": "sales-invoice-info" }
          ]
         }]
      ]
    },
    {
      "label": "Inventory",
      "icon": "pi pi-warehouse  text-white",
      "items": [
        [
          {
            "label": "Batch Wise",
            "items": [{ "label": "Batch Inventory" }]
          }
        ],
        [
          { "label": "Inventory Wise",
            "items": [
              { "label": "Warehouse Inventory" },
              { "label": "Truck Transfer" },
              { "label": "Stock Adjustment" }
            ]
          }
          ],
        [
          {
            "label": "Product Wise",
            "items": [{ "label": "Stock Register" }]
          }
        ]
      ]
    },
    {
      "label": "Payment",
      "icon": "pi pi-credit-card text-white"
    },
    {
      "label": "Report",
      "icon": "pi pi-chart-line text-white"
    }
  ]
  

  return (
    <div className={`flex justify-between items-center px-6 py-4 fixed top-0 left-0 w-full z-10 h-[100px] transition-colors duration-300 ${isDarkMode ? "bg-gray-900 text-white" : "bg-teal-800 text-white"}`}>
      <div className="flex items-right">
        <img src={logo} alt="Logo" className="h-10 mr-4" />
        <span className="text-lg font-bold">Home</span>
      </div>

      {/* Mega Menu centered dropdown */}
      <div className="justify-center hidden w-full md:flex">
      <MegaMenu
          model={EmployeeNavbarSections}
          MenuItemClick={handleMenuClick}
          breakpoint="960px"
          pt={{
            root: {
              className: `${isDarkMode ? "bg-gray-900 text-white" : "bg-teal-800 text-black"} border-none`,
            },
            menu: {
              className: "bg-transparent gap-2 border-none shadow-md flex justify-right w-full",
            },
            panel:{
              className: "absolute bg-white shadow-lg rounded-md",
            },
            submenu: {
              className: `${isDarkMode ? "text-white" : "text-black"} border-none`,
            },
            content: {
              className: `${isDarkMode ? "hover:bg-gray-700" : "hover:bg-teal-700"} border-none`,
            },

            // Make only navbar main items (Partners, Products, etc.) white
            label: {
              className: `${isDarkMode ? "text-gray-400 hover:bg-gray-700 hover:text-white active:bg-gray-700 active:text-white " : "text-gray-400 hover:bg-teal-700 hover:text-white active:bg-teal-700 active:text-white"} border-none`,
            },
            icon: { className: "text-white font-bold" },

            // Keep dropdown menu text black
            menuitem: {
              className: "hover:bg-transparent text-black text-left",
            },
            action: {
              className: "hover:bg-transparent text-black",
            },
            link: {
              className: "hover:bg-transparent text-black",
            },
            submenuitem: {
              className: "hover:bg-transparent text-black text-left",
            }
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
            <ul className={`absolute top-full right-0 mt-2 border rounded-md min-w-[150px] shadow-lg z-10 list-none ${isDarkMode ? "bg-gray-800 text-white border-gray-600" : "bg-white text-black border-gray-300"}`}>
              <DropdownLink to="/update-profile" icon={FaUser} onClick={closeDropdown}>Profile</DropdownLink>
              <DropdownLink to="/" icon={FaSignOutAlt} onClick={closeDropdown}>Log Out</DropdownLink>
            </ul>
          )}
        </div>

        <button
          className="flex items-center justify-center w-8 h-8 rounded-full focus:outline-none"
          onClick={toggleTheme}
        >
          {isDarkMode ? <FaSun className="w-5 h-5 text-yellow-400" /> : <FaMoon className="w-5 h-5 text-teal-300" />}
        </button>
      </div>
    </div>
  );
};

export default Navbar;
