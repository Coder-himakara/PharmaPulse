import { useState } from 'react';
import { Routes, Route } from 'react-router-dom';

import AdminSidebar from '../components/Sidebar/AdminSidebar';
import AddUsersForm from '../components/Forms/adminForm/AddUsersForm';
import UsersInfoTable from '../components/Tables/adminTable/UsersInfoTable';
import EditUsersForm from '../components/Forms/adminForm/EditUsersForm';
import ViewUserDetails from '../components/Tables/adminTable/ViewUserDetails';
import AddLorryForm from '../components/Forms/adminForm/AddLorryForm';
import LorryInfoTable from '../components/Tables/adminTable/LorryInfoTable';
import EditLorryForm from '../components/Forms/adminForm/EditLorryForm';
import ViewLorryDetails from '../components/Tables/adminTable/ViewLorryDetails';
const AdminRoutes = () => {
  const [users, setUsers] = useState([]);
  const [lorry, setLorry] = useState([]);

  const addUser = (user) => {
    setUsers((prevUsers) => [...prevUsers, user]);
  };
  const addLorry = (lorry) => {
    setLorry((prevLorry) => [...prevLorry, lorry]);
  };

  const updateuser = (updateduser) => {
    setUsers((prevUsers) =>
      prevUsers.map((user) =>
        user.userId === updateduser.userId ? updateduser : user,
      ),
    );
  };
  const updatelorry = (updatedlorry) => {
    setLorry((prevLorry) =>
      prevLorry.map((lorry) =>
        lorry.lorryId === updatedlorry.lorryId ? updatedlorry : lorry,
      ),
    );
  };

  return (
    <Routes>
      <Route path='/add-users' element={<AddUsersForm onAddUser={addUser} />} />
      <Route path='/users-info' element={<UsersInfoTable users={users} />} />

      <Route
        path='/edit-user/:userId'
        element={<EditUsersForm onUpdateUser={updateuser} />}
      />
      <Route path='/view-user/:userId' element={<ViewUserDetails />} />

      <Route
        path='/add-lorry'
        element={<AddLorryForm onAddLorry={addLorry} />}
      />
      <Route path='/lorry-info' element={<LorryInfoTable lorries={lorry} />} />
      <Route
        path='/edit-lorry/:lorryId'
        element={<EditLorryForm onUpdateLorry={updatelorry} />}
      />
      <Route path='/view-lorry/:lorryId' element={<ViewLorryDetails />} />

      <Route path='/home' element={<AdminSidebar role='admin' />} />
      <Route path='/dashboard' element={<AdminSidebar role='admin' />} />
    </Routes>
  );
};

export default AdminRoutes;
