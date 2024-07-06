import React from 'react'
import {useParams} from 'react-router-dom';
import {useMutation, useQuery} from 'react-query';
import * as apiClient from '../api-client';
import ManageHotelForm from '../forms/ManageHotelForm/ManageHotelForm';
import {useAppContext} from '../contexts/AppContext';
const EditHotel = () => {
  const {showToast} = useAppContext();
    const {hotelId} = useParams();
    const {data: hotel} = useQuery("fetchMyHotelsById",() => apiClient.fetchMyHotelById(hotelId), {
        enabled: !!hotelId,
    });
    const {mutate, isLoading} = useMutation(apiClient.updateMyHotelById, {
      onSuccess: () => {
        showToast({message: "Hotel Updated", type: "SUCCESS"});
      }, 
      onError: () => {
        showToast({message: "Error updating the hotel", type: "ERROR"});
      },
    });

    const handleSave = (hotelFormData) => {
      mutate(hotelFormData);
    };
  return (
    <ManageHotelForm hotel={hotel} onSave={handleSave} isLoading={isLoading}  />
  );
};

export default EditHotel;
