import { NavLink } from 'react-router-dom';
import PropTypes from 'prop-types';
import sidebarSections from '../../sidebarSections.json';

const SidebarLink = ({ to, children }) => (
  <li className='mb-[10px]'>
    <NavLink
      to={to}
      className={({ isActive }) =>
        `block text-[17px] p-[10px] px-[15px] rounded transition-all duration-300 ${
          isActive
            ? 'bg-[#2d6a6c] text-white'
            : 'text-[#494949] hover:bg-[#2d6a6c] hover:text-[#1abc9c]'
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

const SidebarSection = ({ title, links }) => (
  <div className='mb-5'>
    <h2 className='text-[20px] mb-2 mt-4 border-b border-[#2d6a6c] pb-1 font-bold'>
      {title}
    </h2>
    <ul className='list-none p-0'>
      {links.map((link, index) => (
        <SidebarLink key={index} to={link.to}>
          {link.name}
        </SidebarLink>
      ))}
    </ul>
  </div>
);

SidebarSection.propTypes = {
  title: PropTypes.string.isRequired,
  links: PropTypes.arrayOf(
    PropTypes.shape({
      to: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
    }),
  ).isRequired,
};

const Sidebar = ({ role }) => {
  const sections = sidebarSections[role] || [];

  return (
    <aside className='fixed top-[100px] bottom-[70px] left-0 w-[250px] bg-[#c1d4e0] text-[#494949] overflow-y-auto shadow-md p-5 z-[999] box-border'>
      {sections.map((section, index) => (
        <SidebarSection
          key={index}
          title={section.title}
          links={section.links}
        />
      ))}
    </aside>
  );
};

Sidebar.propTypes = {
  role: PropTypes.string.isRequired, // Role will determine which sections to show
};

export default Sidebar;
