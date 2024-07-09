import React, { useState } from 'react';
import { useSearchContext } from '../contexts/SearchContext';
import { useQuery } from 'react-query';
import * as apiClient from '../api-client';
import SearchResultsCard from '../components/SearchResultsCard';
import Pagination from '../components/Pagination';
import StarRatingFilter from '../components/StarRatingFilter';
import HotelTypesFilter from '../components/HotelTypesFilter';
import FacilitiesFilter from '../components/FacilitiesFilter';
import PriceFilter from '../components/PriceFilter';

const Search = () => {
    const search = useSearchContext();

    const [page, setPage] = useState(1);
    const [selectedStars, setSelectedStars] = useState([]);
    const [selectedHotelTypes, setSelectedHotelTypes] = useState([]);
    const [selectedFacilities, setSelectedFacilities] = useState([]);
    const [selectedPrice, setSelectedPrice] = useState('');
    const [sortOption, setSortOption] = useState('');

    const searchParams = {
        destination: search.destination,
        checkIn: search.checkIn.toISOString(),
        checkOut: search.checkOut.toISOString(),
        adultcount: search.adultcount.toString(),
        childcount: search.childcount.toString(),  
        page: page.toString(),
        stars: selectedStars,
        types: selectedHotelTypes,
        facilities: selectedFacilities,
        maxPrice: selectedPrice.toString(),
        sortOption,
    };

    console.log("searchParams", searchParams);

    const {data: hotelData, isLoading} = useQuery(["searchHotels", searchParams], () => apiClient.searchHotels(searchParams));

    if (isLoading) {
      return <div>Loading...</div>;
    }
    
    const handleStarsChange = (event) => {
      const starRating = event.target.value;
  
      setSelectedStars((prevStars) =>
          event.target.checked
              ? [...prevStars, starRating]
              : prevStars.filter((star) => star !== starRating)
      );
  };

  const handleHotelTypeChange = (event) => {
    const hotelType = event.target.value;

    setSelectedHotelTypes((prevHotelTypes) =>
        event.target.checked
            ? [...prevHotelTypes, hotelType]
            : prevHotelTypes.filter((prevHotelType) => prevHotelType !== hotelType)
    );
};

const handleFacilityChange = (event) => {
  const hotelFacility = event.target.value;

  setSelectedFacilities((prevHotelFacilities) =>
      event.target.checked
          ? [...prevHotelFacilities, hotelFacility]
          : prevHotelFacilities.filter((prevHotelFacility) => prevHotelFacility !== hotelFacility)
  );
};
  console.log(hotelData);

  return (
    <div className='grid grid-cols-1 lg:grid-cols-[250px_1fr] gap-5'>
      <div className='rounded-lg border border-slate-300 p-5 h-fit sticky top-10'>
        <div className='space-y-5'>
            <h3 className='text-lg font-semibold border-b border-slate-300 pb-5'>Filter By</h3>
            {/*TODO Filters*/}
            <StarRatingFilter selectedStars={selectedStars} onChange={handleStarsChange} />
            <HotelTypesFilter selectedHotelTypes={selectedHotelTypes} onChange={handleHotelTypeChange} />
            <FacilitiesFilter selectedFacilities={selectedFacilities} onChange={handleFacilityChange} />
            <PriceFilter selectedPrice={selectedPrice} onChange={(value) => setSelectedPrice(value)} />
            {console.log(selectedStars)}
        </div>
      </div>
      <div className='flex flex-col gap-5'>
        <div className='flex justify-between items-center'>
            <span className='text-xl font-bold'>
                {hotelData?.pagination.total} hotels found
                {search.destination ? ` in ${search.destination}` : ""}
            </span>
            <select className='p-2 border rounded-md' value={sortOption} onChange={(event) => setSortOption(event.target.value)}>
              <option value="starRating">Star Rating</option>
              <option value="pricePerNightAsc">Price Per Night (Low to High)</option>
              <option value="pricePerNightDesc">Price Per Night (High to Low)</option>
            </select>
        </div>
        {hotelData?.data.map((hotel) =>{
            return <SearchResultsCard hotel={hotel} />;
        })}
        <div>
        <Pagination page={hotelData?.pagination.page || 1} pages={hotelData?.pagination.pages || 1} onPageChange={(page) => setPage(page)}  />
      </div>
      </div>

    </div>
  );
};

export default Search;
