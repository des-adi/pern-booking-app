import React, { useEffect } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import DetailsSection from './DetailsSection';
import TypesSection from './TypesSection';
import FacilitiesSection from './FacilitiesSection';
import GuestsSection from './GuestsSection';
import ImagesSection from './ImagesSection';

const ManageHotelForm = ({onSave, isLoading, hotel}) => {
    const formMethods = useForm();
    const {handleSubmit, reset} = formMethods;
    useEffect(() => {
      if (hotel && hotel.length > 0) {
          reset(hotel[0]);
      } else {
          reset(); // Reset to default if hotel is undefined or empty
      }
  }, [hotel, reset]);

    const onSubmit = handleSubmit((formDataJson) => {
        //create new formData and call our API
        const formData = new FormData();
        
       if(hotel){
        formData.append("id", hotel[0].id);
       }
        formData.append("name", formDataJson.name);
        formData.append("city", formDataJson.city);
        formData.append("country", formDataJson.country);
        formData.append("description", formDataJson.description);
        formData.append("type", formDataJson.type);
        formData.append("pricepernight", formDataJson.pricepernight.toString());
        formData.append("starrating", formDataJson.starrating.toString());    
        formData.append("adultcount", formDataJson.adultcount.toString());  
        formData.append("childcount", formDataJson.childcount.toString());
        formDataJson.facilities.forEach((facility, index) => {
            formData.append(`facilities[${index}]`, facility);
        });

        //[im1.png, im2.png, im3.png]
        //imageurls = [im1.png]
        if(formDataJson.imageurls){
          formDataJson.imageurls.forEach((url, index) => {
            formData.append(`imageurls[${index}]`, url);
          });
        };
        Array.from(formDataJson.imageFiles).forEach((imageFile) => {
            formData.append(`imageFiles`, imageFile);
        });

        onSave(formData);
    });
  return (
    <FormProvider {...formMethods}>
      <form className='flex flex-col gap-10' onSubmit={onSubmit} >
        <DetailsSection />
        <TypesSection />
        <FacilitiesSection />
        <GuestsSection />
        <ImagesSection />
        <span className='flex justfy-end'>
            <button type='submit' className='bg-blue-600 text-white p-2 font-bold hover:bg-blue-500 text-xl disabled:bg-gray-500' disabled={isLoading}>{isLoading ? "Saving..." : "Save"}</button>
        </span>
      </form>
    </FormProvider>
  );
};

export default ManageHotelForm;
