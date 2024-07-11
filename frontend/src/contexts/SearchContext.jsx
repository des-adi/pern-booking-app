import React, { useContext, useState } from 'react';

const SearchContext = React.createContext(undefined);

export const SearchContextProvider = ({children}) => {
    const [destination, setDestination] = useState(() => sessionStorage.getItem("destination") || '');
    const [checkIn, setCheckIn] = useState(() => new Date(sessionStorage.getItem("checkIn") || new Date().toISOString()));
    const [checkOut, setCheckOut] = useState(() => new Date(sessionStorage.getItem("checkOut") || new Date().toISOString()));
    const [adultcount, setadultcount] = useState(() => parseInt(sessionStorage.getItem("adultcount") || '1'));
    const [childcount, setchildcount] = useState(() => parseInt(sessionStorage.getItem("childcount") || '0'));
    const [hotelId, setHotelId] = useState(() => sessionStorage.getItem("hotelId") || '');

    const saveSearchValues = (destination, checkIn, checkOut, adultcount, childcount) => {
        setDestination(destination);
        setCheckIn(checkIn);
        setCheckOut(checkOut);
        setadultcount(adultcount);
        setchildcount(childcount);
        if(hotelId){
            setHotelId(hotelId);
        }
        sessionStorage.setItem("destination", destination);
        sessionStorage.setItem("checkIn", checkIn.toISOString());
        sessionStorage.setItem("checkOut", checkOut.toISOString());
        sessionStorage.setItem("adultcount", adultcount.toString());
        sessionStorage.setItem("childcount", childcount.toString());

        if(hotelId){
            sessionStorage.setItem("hotelId", hotelId);
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