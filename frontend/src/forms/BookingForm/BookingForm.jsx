import React from 'react';
import {useSearchContext} from '../../contexts/SearchContext';
import {useAppContext} from '../../contexts/AppContext';
import {useForm} from 'react-hook-form';
import {useParams} from 'react-router-dom';
import {useMutation} from 'react-query';
import * as apiClient from '../../api-client';
import { CardElement, useElements, useStripe } from '@stripe/react-stripe-js';

const BookingForm = ({currentUser, paymentIntent}) => {
  const stripe = useStripe();
  const elements = useElements();
  const {hotelId} = useParams();
  const search = useSearchContext();
  const {showToast} = useAppContext();
  const {mutate: bookRoom, isLoading} = useMutation(apiClient.createRoomBooking, {
    onSuccess: () => {
      showToast({message: "Booking saved", type: "SUCCESS"});
    },
    onError: () => {
      showToast({message: "Error saving booking", type: "ERROR"});
    }
  });
    const {handleSubmit, register} = useForm({
        defaultValues: {
            firstname: currentUser.firstname,
            lastname: currentUser.lastname,
            email: currentUser.email,
            adultcount: search.adultcount,
            childcount: search.childcount,
            checkin: search.checkIn.toISOString(),
            checkout: search.checkOut.toISOString(),
            hotelid: hotelId,
            totalcost: paymentIntent.totalcost,
            paymentIntentId: paymentIntent.paymentIntentId,
        },
    });

   const onSubmit = async (formData) => {
    if(!stripe || !elements){
      return;
    }

    const result = await stripe.confirmCardPayment(paymentIntent.clientSecret, {
      payment_method: {
        card: elements.getElement(CardElement),
      },
    });

    if(result.paymentIntent.status === 'succeeded'){
      console.log(formData);
      //book the room
      bookRoom({...formData, paymentIntentId: result.paymentIntent.id});
    }
   }
  return (
    <form onSubmit={handleSubmit(onSubmit)} className='grid grid-cols-1 gap-5 rounded-lg border border-slate-300 p-5'>
      <span className='text-3xl font-bold'>
        Confirm your details
      </span>
      <div className='grid grid-cols-2 gap-6'>
        <label className='text-gray-700 text-sm font-bold flex-1'>
            First Name
            <input
             className='mt-1 border rounded w-full py-2 px-3 text-gray-700 bg-gray-200 font-normal' 
             type='text' 
             readOnly 
             disabled
             {...register("firstname")} />
        </label>
        <label className='text-gray-700 text-sm font-bold flex-1'>
            Last Name
            <input
             className='mt-1 border rounded w-full py-2 px-3 text-gray-700 bg-gray-200 font-normal' 
             type='text' 
             readOnly 
             disabled
             {...register("lastname")} />
        </label>
        <label className='text-gray-700 text-sm font-bold flex-1'>
            Email
            <input
             className='mt-1 border rounded w-full py-2 px-3 text-gray-700 bg-gray-200 font-normal' 
             type='email' 
             readOnly 
             disabled
             {...register("email")} />
        </label>
      </div>
      <div className='space-y-2'>
        <h2 className='text-xl font-semibold'>Your Price Summary</h2>
      <div className='bg-blue-200 p-4 rounded-md'>
        <div className='font-semibold text-lg'>
            Total Cost: Rs. {paymentIntent.totalcost.toFixed(2)}
        </div>
        <div className='text-xs'>
            Includes taxes and charges
        </div>
      </div>
      </div>
      <div className='space-y-2'>
        <h3 className='text-xl font-semibold'>Payment Details</h3>
        <CardElement id='payment-element' className='border rounded-md p-2 text-sm' />
      </div>
      <div className='flex justify-end'>
        <button type='submit' disabled={isLoading} className='bg-blue-600 text-white p-2 font-bold hover:bg-blue-500 text-md disabled:bg-gray-500'>
          {isLoading ? "Saving..." : "Confirm Booking"}
        </button>
      </div>
    </form>
  );
};

export default BookingForm;
