import './DashboardCard.css';
import PropTypes from 'prop-types';

const DashboardCard = ({ content }) => {
  return (
    <div className='dashboard-card'>
      <div>{content}</div>
    </div>
  );
};

DashboardCard.propTypes = {
  content: PropTypes.string.isRequired, // Ensure 'content' is a string and required
};

export default DashboardCard;
