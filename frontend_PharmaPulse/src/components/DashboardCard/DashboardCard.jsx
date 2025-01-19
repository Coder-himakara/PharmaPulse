import PropTypes from 'prop-types';

const DashboardCard = ({ content }) => {
  return (
    <div className='bg-teal-100 dark:bg-gray-800 absolute top-[100px] bottom-0 left-[250px] right-0 p-5 box-border overflow-y-auto'>
      <h1 className='mb-4 text-4xl font-bold text-teal-800 dark:text-teal-300'>
        Welcome to PharmaPulse!
      </h1>
      <div className='text-gray-700 dark:text-gray-300'>{content}</div>
    </div>
  );
};

DashboardCard.propTypes = {
  content: PropTypes.string.isRequired,
};

export default DashboardCard;
