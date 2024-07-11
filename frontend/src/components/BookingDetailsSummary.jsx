import React from 'react';

const BookingDetailsSummary = ({checkIn, checkOut, adultcount, childcount, numberOfNights, hotel}) => {
  return (
    <div className='grid gap-4 border border-slate-300 p-5 h-fit'>
      <h2 className='text-xl font-bold'>Your Booking Details</h2>
      <div className='border-b py-2'>
        Location:
        <span className='font-bold '>{` ${hotel.name}, ${hotel.city}, ${hotel.country}`}</span>
      </div>
      <div className='flex justify-between'>
        <div>
            Check-in
            <div className='font-bold'>
                {checkIn.toDateString()}
            </div>
        </div>
        <div>
            Check-out
            <div className='font-bold'>
                {checkOut.toDateString()}
            </div>
        </div>
      </div>
      <div className='border-t border-b py-2'>
            Total length of stay:
            <div className='font-bold'>
                {numberOfNights} nights
            </div>
        </div>
      <div>
        Guests <div className='font-bold'>{adultcount} adults and {childcount} children</div>
       </div>
    </div>
  );
};

export default BookingDetailsSummary;
