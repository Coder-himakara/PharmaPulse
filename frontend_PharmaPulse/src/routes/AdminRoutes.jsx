import { useState, lazy, Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';

// Lazy load components for better performance
const AddUsersForm = lazy(
  () => import('../components/Forms/adminForms/users/AddUsersForm'),
);
const UsersInfoTable = lazy(
  () => import('../components/Tables/adminTable/users/UsersInfoTable'),
);
const EditUsersForm = lazy(
  () => import('../components/Forms/adminForms/users/EditUsersForm'),
);
const ViewUserDetails = lazy(
  () => import('../components/Tables/adminTable/users/ViewUserDetails'),
);
const AddTruckForm = lazy(
  () => import('../components/Forms/adminForms/trucks/AddTruckForm'),
);
const TruckInfoTable = lazy(
  () => import('../components/Tables/adminTable/truck/TruckInfoTable'),
);
const EditTruckForm = lazy(
  () => import('../components/Forms/adminForms/trucks/EditTruckForm'),
);
const ViewTruckDetails = lazy(
  () => import('../components/Tables/adminTable/truck/ViewTruckDetails'),
);

// Loading screen component (for suspense fallback)
const LoadingScreen = () => (
  <div className='flex items-center justify-center h-screen bg-gray-100'>
    <p className='text-lg font-bold text-gray-600'>Loading...</p>
  </div>
);

const AdminRoutes = () => {
  const [users, setUsers] = useState([]);
  const [trucks, setTrucks] = useState([]);

  // Function to add a new user
  const addUser = (user) => setUsers((prevUsers) => [...prevUsers, user]);

  // Function to add a new truck
  const addTruck = (truck) => setTrucks((prevTrucks) => [...prevTrucks, truck]);

  // Function to update an existing user
  const updateUser = (updatedUser) => {
    setUsers((prevUsers) =>
      prevUsers.map((user) =>
        user.userId === updatedUser.userId ? updatedUser : user,
      ),
    );
  };

  // Function to update an existing truck
  const updateTruck = (updatedTruck) => {
    setTrucks((prevTrucks) =>
      prevTrucks.map((truck) =>
        truck.truckId === updatedTruck.truckId ? updatedTruck : truck,
      ),
    );
  };

  return (
    <Suspense fallback={<LoadingScreen />}>
      <Routes>
        {/* Default route for /admin-dashboard/ */}
        <Route path='/' element={<AddUsersForm onAddUser={addUser} />} />
        <Route
          path='add-users'
          element={<AddUsersForm onAddUser={addUser} />}
        />
        <Route path='users-info' element={<UsersInfoTable users={users} />} />
        <Route
          path='edit-user/:userId'
          element={<EditUsersForm onUpdateUser={updateUser} />}
        />
        <Route path='view-user/:userId' element={<ViewUserDetails />} />

        <Route
          path='add-truck'
          element={<AddTruckForm onAddTruck={addTruck} />}
        />
        <Route path='truck-info' element={<TruckInfoTable trucks={trucks} />} />
        <Route
          path='edit-truck/:truckId'
          element={<EditTruckForm onUpdateTruck={updateTruck} />}
        />
        <Route path='view-truck/:truckId' element={<ViewTruckDetails />} />
      </Routes>
    </Suspense>
  );
};

export default AdminRoutes;
