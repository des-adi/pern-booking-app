
import React from 'react';
import { AiFillStar } from 'react-icons/ai';
import { Link } from 'react-router-dom';

const SearchResultsCard = ({ hotel }) => {
  return (
    <div className='flex flex-col md:flex-row border border-slate-300 rounded-lg p-8 gap-8'>
      <div className='w-full md:w-1/2 xl:w-1/3'>
        <img src={hotel.imageurls[0]} className='w-full h-full object-cover object-center' />
      </div>
      <div className='flex flex-col justify-between md:w-1/2 xl:w-2/3'>
        <div>
          <div className='flex items-center mb-2'>
            <span className="flex">
              {Array.from({ length: hotel.starrating }).map(() => {
                return <AiFillStar className='fill-yellow-400' />
              })}
            </span>
            <span className="ml-1 text-sm">
              {hotel.type}
            </span>
          </div>
          <Link to={`/detail/${hotel.id}`} className='text-2xl font-bold cursor-pointer'>{hotel.name}</Link>
        </div>
        <div className='line-clamp-4 mb-4'>
          {hotel.description}
        </div>
        <div className='flex justify-between mb-4'>
          <div className='flex gap-1 items-center'>
            {hotel.facilities.slice(0, 3).map((facility) => {
              return <span className='bg-slate-300 p-2 rounded-lg font-bold text-xs whitespace-wrap'>
                {facility}
              </span>;
            })}
            {hotel.facilities.length > 3 && (
              <span className='text-sm'>+ {hotel.facilities.length - 3} more</span>
            )}
          </div>
          <div className='flex flex-col items-end gap-1'>
            <span className='font-bold'>Rs. {hotel.pricepernight} per night</span>
            <Link to={`/detail/${hotel.id}`} className='bg-blue-600 text-white h-full p-2 font-bold text-xl max-w-fit'>View More</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchResultsCard;
