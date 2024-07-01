import React from 'react'
import ManageHotelForm from '../forms/ManageHotelForm/ManageHotelForm';
import { useMutation } from 'react-query';
import * as apiClient from '../api-client';
import { useAppContext } from '../contexts/AppContext';
const AddHotel = () => {
  const {showToast} = useAppContext();
  
  const {mutate, isLoading} = useMutation(apiClient.addMyHotel, {
    onSuccess: () => {
      showToast({message: "Hotel Saved", type: "SUCCESS"});
    },
    onError: () => {
      showToast({message: "Error saving hotel", type: "ERROR"});
    },
  });

  const handleSave = (hotelFormData) => {
    mutate(hotelFormData);
  }

  return (
    <div>
      <ManageHotelForm onSave={handleSave} isLoading={isLoading} />    
    </div>
  );
}

export default AddHotel;
