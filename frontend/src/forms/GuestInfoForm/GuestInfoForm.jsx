import React from 'react'
import { useForm } from 'react-hook-form';
import DatePicker from 'react-datepicker';
import { useSearchContext } from '../../contexts/SearchContext';
import { useAppContext } from '../../contexts/AppContext';
import { useLocation, useNavigate } from 'react-router-dom';

const GuestInfoForm = ({hotelId, pricepernight}) => {
    const search = useSearchContext();
    const {isLoggedIn} = useAppContext();
    const navigate = useNavigate();
    const location = useLocation();
    
  const {watch, register, handleSubmit, setValue, formState: {errors}} = useForm({defaultValues: {
    checkIn: search.checkIn,
    checkOut: search.checkOut,
    adultcount: search.adultcount,
    childcount: search.childcount,

  }});
  const checkIn = watch("checkIn");
  const checkOut = watch("checkOut");

  const minDate = new Date();
  const maxDate = new Date();
  maxDate.setFullYear(maxDate.getFullYear() + 1);

  const onSignInClick = (data) => {
    search.saveSearchValues('', data.checkIn, data.checkOut, data.adultcount, data.childcount);
    navigate('/sign-in', {
        state: {
            from: location,
        },
    });
  };

  const onSubmit = (data) => {
    search.saveSearchValues('', data.checkIn, data.checkOut, data.adultcount, data.childcount);
    navigate(`/hotel/${hotelId}/booking`);
  };
    return (
    <div className='flex flex-col p-4 bg-blue-200 gap-4'>
      <h3 className='text-md font-bold'>Rs {pricepernight}</h3>
      <form onSubmit={isLoggedIn ? handleSubmit(onSubmit) : handleSubmit(onSignInClick)} className='grid grid-cols-1 gap-4 items-center'>
        <div>
        <DatePicker
          required 
          selected={checkIn} 
          onChange={(date) => setValue("checkIn", date)} 
          selectsStart 
          startDate={checkIn} 
          endDate={checkOut} 
          minDate={minDate} 
          maxDate={maxDate}
          placeholderText='Check-in Date'
          className='min-w-full bg-white p-2 focus:outline-none'
          wrapperClassName='min-w-full' />
        </div>
        <div>
        <DatePicker
          required 
          selected={checkOut} 
          onChange={(date) => setValue("checkOut", date)} 
          selectsStart 
          startDate={checkIn} 
          endDate={checkOut} 
          minDate={minDate} 
          maxDate={maxDate}
          placeholderText='Check-out Date'
          className='min-w-full bg-white p-2 focus:outline-none'
          wrapperClassName='min-w-full' />
        </div>
        <div className='flex bg-white px-2 py-1 gap-2'>
          <label className='items-center flex'>
            Adults:
            <input
             className='w-full p-1 focus:outline-none font-bold' 
             type='number' 
             min={1} 
             max={20} 
             {...register("adultcount", {
                required: "This field is required",
                min: {
                    value: 1,
                    message: "There must be atleast 1 adult"
                },
                valueAsNumber: true,
                })} />
          </label>
          <label className='items-center flex'>
            Children:
            <input
             className='w-full p-1 focus:outline-none font-bold' 
             type='number' 
             min={0} 
             max={20} 
             {...register("childcount", {
                valueAsNumber: true,
             })}  />
          </label>
          {errors.adultcount && (
            <span className='text-red-500 font-semibold text-sm'>{errors.adultcount.message}</span>
          )}
        </div>
        {isLoggedIn ? (
            <button className='bg-blue-600 text-white h-fill p-2 font-bold hover:bg-blue-500 text-xl'>Book Now</button>
            ) : (
            <button className='bg-blue-600 text-white h-fill p-2 font-bold hover:bg-blue-500 text-xl'>Sign In to Book</button>
            )}
      </form>
    </div>
  );
};

export default GuestInfoForm;
