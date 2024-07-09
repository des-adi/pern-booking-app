import React, { useContext, useState } from 'react';

const SearchContext = React.createContext(undefined);

export const SearchContextProvider = ({children}) => {
    const [destination, setDestination] = useState('');
    const [checkIn, setCheckIn] = useState(new Date());
    const [checkOut, setCheckOut] = useState(new Date());
    const [adultcount, setadultcount] = useState(1);
    const [childcount, setchildcount] = useState(0);
    const [hotelId, setHotelId] = useState('');

    const saveSearchValues = (destination, checkIn, checkOut, adultcount, childcount) => {
        setDestination(destination);
        setCheckIn(checkIn);
        setCheckOut(checkOut);
        setadultcount(adultcount);
        setchildcount(childcount);
        if(hotelId){
            setHotelId(hotelId);
        }
    };
    return(
        <SearchContext.Provider value={{destination, checkIn, checkOut, adultcount, childcount, hotelId, saveSearchValues}}>
            {children}
        </SearchContext.Provider>
    );
};

export const useSearchContext = () => {
    const context = useContext(SearchContext);
    return context;
};