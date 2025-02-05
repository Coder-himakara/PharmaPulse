import { NavLink } from 'react-router-dom';
import PropTypes from 'prop-types';
import sidebarSections from '../../sidebarSections.json';

// SidebarLink Component
const SidebarLink = ({ to, children }) => (
  <li className='mb-2'>
    <NavLink
      to={to}
      className={({ isActive }) =>
        `block text-base p-2 rounded-md transition-all duration-300 ${
          isActive
            ? 'bg-teal-700 text-white'
            : 'text-gray-700 hover:bg-teal-700 hover:text-teal-200 dark:text-gray-300 dark:hover:text-teal-400'
        }`
      }
    >
      {children}
    </NavLink>
  </li>
);

SidebarLink.propTypes = {
  to: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
};

// SidebarSection Component
const SidebarSection = ({ title, links }) => (
  <div className='mb-6'>
    <h2 className='pb-1 mb-3 text-lg font-semibold border-b border-teal-700 dark:border-teal-400'>
      {title}
    </h2>
    <ul className='p-0 list-none'>
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

// Sidebar Component
const SalesRepSidebar = () => {
  const sections = sidebarSections.salerep || [];

  return (
    <aside className='fixed top-[100px] bottom-[70px] left-0 w-[250px] bg-teal-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 overflow-y-auto shadow-lg p-5 z-[999] box-border'>
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

SalesRepSidebar.propTypes = {
  role: PropTypes.string.isRequired,
};

export default SalesRepSidebar;
