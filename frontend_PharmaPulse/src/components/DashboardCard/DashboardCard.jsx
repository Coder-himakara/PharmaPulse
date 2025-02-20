// DashboardCard.jsx
import PropTypes from "prop-types";

const DashboardCard = ({ content }) => {
  return (
    <div className="bg-[var(--card-bg-color)] absolute top-[100px] bottom-[70px] left-0 right-0 p-5 box-border overflow-y-auto">
      <h1 className="mb-4 text-4xl font-bold text-[var(--card-text-color)]">
        Welcome to PharmaPulse!
      </h1>
      <div className="text-[var(--text-color)]">{content}</div>
    </div>
  );
};

DashboardCard.propTypes = {
  content: PropTypes.string.isRequired,
};

export default DashboardCard;
