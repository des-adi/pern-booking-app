import React from 'react';

const PriceFilter = ({selectedPrice, onChange}) => {
  return (
    <div>
      <h4 className='text-md font-semibold mb-2'>Max Price</h4>
      <select className='p-2 border rounded-md w-full' value={selectedPrice} onChange={(event) => onChange(event.target.value ? parseInt(event.target.value) : undefined)}>
        <option value="">Select Max Price</option>
        {[500, 750 ,1000, 2000, 5000, 7500, 10000, 12500, 15000, 17500, 20000, 22500, 25000, 27500, 30000].map((price) => {
            return <option value={price}>{price}</option>;
        })}
      </select>
    </div>
  );
};

export default PriceFilter;
