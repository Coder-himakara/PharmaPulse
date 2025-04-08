import PropTypes from 'prop-types';


const DashboardCard = ({ content }) => {
  return (
    <div className='bg-[var(--card-bg-color)] absolute top-[100px] left-0 right-0 bottom-0 p-5 md:p-8 box-border overflow-y-auto flex flex-col '>
      {/* Header */}
      <h1 className='mb-4 text-3xl md:text-4xl font-bold text-[var(--card-text-color)] text-center md:text-center'>
        Welcome to PharmaPulse!
      </h1>
      {/* Content Section */}
      <div className='flex-grow mb-8 '>{content}</div>
      
    </div>
  );
};

DashboardCard.propTypes = {
  content: PropTypes.oneOfType([PropTypes.string, PropTypes.node]).isRequired, // Allows string or JSX
};

export default DashboardCard;
