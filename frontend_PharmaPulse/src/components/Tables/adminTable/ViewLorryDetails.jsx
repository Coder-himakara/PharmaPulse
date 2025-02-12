import { useLocation, useNavigate } from "react-router-dom";

const ViewLorryDetails = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const lorry = location.state?.lorry;

  return (
    <div className="max-w-md p-6 mx-auto mt-10 bg-[#e6eef3] rounded-lg shadow-md">
      <h2 className="mb-4 text-xl font-bold text-center text-[var(--card-text-color)]">
        Lorry Details
      </h2>

      <ul className="text-left ">
        <li>
          <strong>Lorry Id:</strong> {lorry.lorryId}
        </li>
        <li>
          <strong>Number Plate:</strong> {lorry.numberPlate}
        </li>
        <li>
          <strong>Representative Id:</strong> {lorry.representativeId}
        </li>
        <li>
          <strong>Capacity:</strong> {lorry.capacity}
        </li>
        <li>
          <strong>Date Of Added:</strong> {lorry.dateOfAdded}
        </li>
        <li>
          <strong>Status:</strong> {lorry.status}
        </li>
      </ul>
      <div className="flex justify-center mt-4">
        <button
          className="px-5 py-2 bg-[#2a4d69] text-white border-none rounded-md text-[16px] cursor-pointer transition-all duration-300 hover:bg-[#00796b]"
          onClick={() => navigate("/lorry-info")}
        >
          Back
        </button>
      </div>
    </div>
  );
};

export default ViewLorryDetails;
