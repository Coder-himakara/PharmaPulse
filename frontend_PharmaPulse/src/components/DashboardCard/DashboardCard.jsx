import PropTypes from 'prop-types';

const DashboardCard = ({ content }) => {
  return (
    <div className='bg-[#e6f6f6] absolute top-[100px] bottom-0 left-[250px] right-0 p-5 box-border overflow-y-auto'>
      <h1 className='text-5xl font-bold text-[#2a4d69] mb-4'>
        Welcome to PharmaPulse!
      </h1>
      <div>{content}</div>
    </div>
  );
};

DashboardCard.propTypes = {
  content: PropTypes.string.isRequired,
};

export default DashboardCard;
