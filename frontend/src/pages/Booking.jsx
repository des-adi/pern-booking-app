import React, { useEffect, useState } from 'react';
import * as apiClient from '../api-client';
import {useQuery} from 'react-query';
import BookingForm from '../forms/BookingForm/BookingForm';

import {useParams} from 'react-router-dom';
import BookingDetailsSummary from '../components/BookingDetailsSummary';
import { useSearchContext } from '../contexts/SearchContext';
import {Elements} from '@stripe/react-stripe-js';
import { useAppContext } from '../contexts/AppContext';

const Booking = () => {
    const {stripePromise} = useAppContext();
    const search = useSearchContext();
    const {hotelId} = useParams();

    const [numberOfNights, setNumberOFNights] = useState(1);
    useEffect(() => {
        if(search.checkIn && search.checkOut){
            const nights = Math.abs(search.checkOut.getTime() - search.checkIn.getTime())/(1000*60*60*24);
            setNumberOFNights(Math.ceil(nights));
        }
    }, [search.checkIn, search.checkOut]);

    const {data: paymentIntentData} = useQuery("createPaymentIntent", () => apiClient.createPaymentIntent(hotelId, numberOfNights.toString(), {
        enabled: !!hotelId && numberOfNights > 0,

    }))

    const {data: hotel} = useQuery("fetchHotelById", () => apiClient.fetchHotelById(hotelId), {
        enabled: !!hotelId,
    });
    const {data: currentUser} = useQuery("fetchCurrentUser", apiClient.fetchCurrentUser);
    if(!hotel){
        return <></>;
    }
  return (
    <div className='grid md:grid-cols-[1fr_2fr]'>

      <BookingDetailsSummary
       checkIn={search.checkIn} 
       checkOut={search.checkOut} 
       adultcount={search.adultcount} 
       childcount={search.childcount} 
       numberOfNights={numberOfNights} 
       hotel={hotel} />
      {currentUser && paymentIntentData && (
        <Elements stripe={stripePromise} options={{
            clientSecret: paymentIntentData.clientSecret,
        }}><BookingForm currentUser={currentUser} paymentIntent={paymentIntentData} /></Elements>
       )}
    </div>
  );
};

export default Booking;
