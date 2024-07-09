import React, { useState } from 'react';
import { useSearchContext } from '../contexts/SearchContext';
import {MdTravelExplore} from 'react-icons/md';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { useNavigate } from 'react-router-dom';

const SearchBar = () => {
    const search = useSearchContext();
    const [destination, setDestination] = useState(search.destination);
    const [checkIn, setCheckIn] = useState(search.checkIn);
    const [checkOut, setCheckOut] = useState(search.checkOut);
    const [adultcount, setadultcount] = useState(search.adultcount);
    const [childcount, setchildcount] = useState(search.childcount);
    const navigate = useNavigate();
    
    const minDate = new Date();
    const maxDate = new Date();
    maxDate.setFullYear(maxDate.getFullYear() + 1);

    const handleSubmit = (event) => {
        event.preventDefault();
        search.saveSearchValues(destination, checkIn, checkOut, adultcount, childcount);
        navigate("/search");
    };

  return (
    <form onSubmit={handleSubmit} className='-mt-8 p-3 bg-orange-400 rounded shadow-md grid grid-cols-2 lg:grid-cols-3 2xl:grid-cols-5 items-center gap-4'>
        <div className='flex flex-row items-center flex-1 bg-white p-2'>
            <MdTravelExplore size={25} className='mr-2' />
            <input placeholder='Where are you going ?' className='text-md w-full focus:outline-none' value={destination} onChange={(event) => setDestination(event.target.value)} />
        </div>
        <div className='flex bg-white px-2 py-1 gap-2'>
          <label className='items-center flex'>
            Adults:
            <input className='w-full p-1 focus:outline-none font-bold' type='number' min={1} max={20} value={adultcount} onChange={(event) => setadultcount(parseInt(event.target.value))} />
          </label>
          <label className='items-center flex'>
            Children:
            <input className='w-full p-1 focus:outline-none font-bold' type='number' min={0} max={20} value={childcount} onChange={(event) => setchildcount(parseInt(event.target.value))} />
          </label>
        </div>
        <div>
          <DatePicker 
          selected={checkIn} 
          onChange={(date) => setCheckIn(date)} 
          selectsStart 
          startDate={checkIn} 
          endDate={checkOut} 
          minDate={minDate} 
          maxDate={maxDate}
          className='min-w-full bg-white p-2 focus:outline-none'
          wrapperClassName='min-w-full' />
        </div>
        <div>
          <DatePicker 
          selected={checkOut} 
          onChange={(date) => setCheckOut(date)} 
          selectsStart 
          startDate={checkIn} 
          endDate={checkOut} 
          minDate={minDate} 
          maxDate={maxDate}
          className='min-w-full bg-white p-2 focus:outline-none'
          wrapperClassName='min-w-full' />
        </div>
        <div className='flex gap-1'>
          <button className='w-2/3 bg-blue-600 text-white h-full p-2 font-bold text-xl hover:bg-blue-500'>
            Search
          </button>
          <button className='w-1/3 bg-red-600 text-white h-full p-2 font-bold text-xl hover:bg-red-500'>
            Clear
          </button>
        </div>
    </form>
  );
};

export default SearchBar;