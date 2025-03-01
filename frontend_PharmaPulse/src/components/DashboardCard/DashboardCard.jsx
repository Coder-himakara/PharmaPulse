import PropTypes from 'prop-types';
import EmployeeDashboardCard from './EmployeeDashboardCard';

const DashboardCard = ({ content }) => {
  return (
    <div className='bg-[var(--card-bg-color)] absolute top-[100px] bottom-[70px] left-0 right-0 p-5 md:p-8 box-border overflow-y-auto flex flex-col '>
      {/* Header */}
      <h1 className='mb-4 text-3xl md:text-4xl font-bold text-[var(--card-text-color)] text-center md:text-center'>
        Welcome to PharmaPulse!
      </h1>

      {/* Content Section */}
      <div className='flex-grow text-[var(--text-color)]'>
        {content}
        <EmployeeDashboardCard />
      </div>
    </div>
  );
};

DashboardCard.propTypes = {
  content: PropTypes.oneOfType([PropTypes.string, PropTypes.node]).isRequired, // Allows string or JSX
};

export default DashboardCard;
