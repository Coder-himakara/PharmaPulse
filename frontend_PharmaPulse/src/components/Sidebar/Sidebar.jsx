import { NavLink } from 'react-router-dom';

const Sidebar = () => {
  return (
    <aside className='fixed top-[100px] bottom-[70px] left-0 w-[250px] bg-[#c1d4e0] text-[#494949] overflow-y-auto shadow-md p-5 z-[999] box-border'>
      <div className='mb-5'>
        <h2 className='text-[20px] mb-2 mt-4 border-b border-[#2d6a6c] pb-1 font-bold'>
          Products
        </h2>
        <ul className='list-none p-0'>
          <li className='mb-[10px]'>
            <NavLink
              to='/add-products'
              className={({ isActive }) =>
                `block text-[17px] p-[10px] px-[15px] rounded transition-all duration-300 ${
                  isActive
                    ? 'bg-[#2d6a6c] text-white'
                    : 'text-[#494949] hover:bg-[#2d6a6c] hover:text-[#1abc9c]'
                }`
              }
            >
              Add Products
            </NavLink>
          </li>
          <li>
            <NavLink
              to='/products-info'
              className={({ isActive }) =>
                `block text-[17px] p-[10px] px-[15px] rounded transition-all duration-300 ${
                  isActive
                    ? 'bg-[#2d6a6c] text-white'
                    : 'text-[#494949] hover:bg-[#2d6a6c] hover:text-[#1abc9c]'
                }`
              }
            >
              Products Info
            </NavLink>
          </li>
        </ul>
      </div>
      <div className='mb-5'>
        <h2 className='text-[20px] mb-2 mt-4 border-b border-[#2d6a6c] pb-1 font-bold'>
          Suppliers
        </h2>
        <ul className='list-none p-0'>
          <li className='mb-[10px]'>
            <NavLink
              to='/add-suppliers'
              className={({ isActive }) =>
                `block text-[17px] p-[10px] px-[15px] rounded transition-all duration-300 ${
                  isActive
                    ? 'bg-[#2d6a6c] text-white'
                    : 'text-[#494949] hover:bg-[#2d6a6c] hover:text-[#1abc9c]'
                }`
              }
            >
              Add Suppliers
            </NavLink>
          </li>
          <li>
            <NavLink
              to='/suppliers-info'
              className={({ isActive }) =>
                `block text-[17px] p-[10px] px-[15px] rounded transition-all duration-300 ${
                  isActive
                    ? 'bg-[#2d6a6c] text-white'
                    : 'text-[#494949] hover:bg-[#2d6a6c] hover:text-[#1abc9c]'
                }`
              }
            >
              Suppliers Info
            </NavLink>
          </li>
        </ul>
      </div>
      <div>
        <h2 className='text-[20px] mb-2 mt-4 border-b border-[#2d6a6c] pb-1 font-bold'>
          Customers
        </h2>
        <ul className='list-none p-0'>
          <li className='mb-[10px]'>
            <NavLink
              to='/add-customers'
              className={({ isActive }) =>
                `block text-[17px] p-[10px] px-[15px] rounded transition-all duration-300 ${
                  isActive
                    ? 'bg-[#2d6a6c] text-white'
                    : 'text-[#494949] hover:bg-[#2d6a6c] hover:text-[#1abc9c]'
                }`
              }
            >
              Add Customers
            </NavLink>
          </li>
          <li>
            <NavLink
              to='/customers-info'
              className={({ isActive }) =>
                `block text-[17px] p-[10px] px-[15px] rounded transition-all duration-300 ${
                  isActive
                    ? 'bg-[#2d6a6c] text-white'
                    : 'text-[#494949] hover:bg-[#2d6a6c] hover:text-[#1abc9c]'
                }`
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
