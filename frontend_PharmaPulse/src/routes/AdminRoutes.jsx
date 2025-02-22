import { useState } from 'react';
import { Routes, Route } from 'react-router-dom';


import AddUsersForm from '../components/Forms/adminForm/AddUsersForm';
import UsersInfoTable from '../components/Tables/adminTable/UsersInfoTable';
import EditUsersForm from '../components/Forms/adminForm/EditUsersForm';
import ViewUserDetails from '../components/Tables/adminTable/ViewUserDetails';
import AddTruckForm from '../components/Forms/adminForm/AddTruckForm';
import TruckInfoTable from '../components/Tables/adminTable/TruckInfoTable';
import EditTruckForm from '../components/Forms/adminForm/EditTruckForm';
import ViewTruckDetails from '../components/Tables/adminTable/ViewTruckDetails';
const AdminRoutes = () => {
  const [users, setUsers] = useState([]);
  const [truck, setTruck] = useState([]);

  const addUser = (user) => {
    setUsers((prevUsers) => [...prevUsers, user]);
  };
  const addTruck = (truck) => {
    setTruck((prevTruck) => [...prevTruck, truck]);
  };

  const updateuser = (updateduser) => {
    setUsers((prevUsers) =>
      prevUsers.map((user) =>
        user.userId === updateduser.userId ? updateduser : user,
      ),
    );
  };
  const updatetruck = (updatedtruck) => {
    setTruck((prevTruck) =>
      prevTruck.map((truck) =>
        truck.truckId === updatedtruck.truckId ? updatedtruck : truck,
      ),
    );
  };

  return (
    <Routes>
      <Route path='add-users' element={<AddUsersForm onAddUser={addUser} />} />
      <Route path='users-info' element={<UsersInfoTable users={users} />} />

      <Route path='edit-user/:userId' element={<EditUsersForm onUpdateUser={updateuser} />} />
      <Route path='view-user/:userId' element={<ViewUserDetails />} />

      <Route path='add-truck' element={<AddTruckForm onAddTruck={addTruck} />}   />
      <Route path='truck-info' element={<TruckInfoTable trucks={truck} />} />

      <Route path='edit-truck/:truckId' element={<EditTruckForm onUpdateTruck={updatetruck} />} />
      <Route path='view-truck/:truckId' element={<ViewTruckDetails />} />

      
    </Routes>
  );
};

export default AdminRoutes;
