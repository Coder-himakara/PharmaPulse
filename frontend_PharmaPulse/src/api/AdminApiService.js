import apiClient from './ApiClient';

export const registerUsers = (formData) =>
  apiClient.post('/users/register', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });

export const getUserDetails = () =>
  apiClient.get('/users/details', {
    headers: { 'Content-Type': 'application/json' },
  });


export const updateUserDetails = async (userId, formData) => {
  try {
    const response = await  apiClient.put(
      `/users/update/${userId}`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      }
    );
    return response;
  } catch (error) {
    console.error("Error updating user:", error);
    throw error;
  }
};