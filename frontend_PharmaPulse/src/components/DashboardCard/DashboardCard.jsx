import "./DashboardCard.css";

const DashboardCard = ({ content }) => {
  return (
    <div className="dashboard-card">
      <div>{content}</div>
    </div>
  );
};

export default DashboardCard;
