import React from 'react'
import { useFormContext } from 'react-hook-form';

const DetailsSection = () => {
    const {register, formState: {errors}} = useFormContext();
  return (
    <div className='flex flex-col gap-4'>
      <h1 className="text-3xl font-bold mb-3">Add Hotel</h1>
      <label className="text-gray-700 text-sm font-bold flex-1">
            Name
            <input type="text" className="border rounded w-full py-1 px-2 font-normal " {...register("name",{required: "This field is required"})} />
            {errors.name && (<span className='text-red-500'>{errors.name.message}</span>)}
        </label>
        <div className="flex gap-4">
        <label className="text-gray-700 text-sm font-bold flex-1">
            City
            <input type="text" className="border rounded w-full py-1 px-2 font-normal " {...register("city",{required: "This field is required"})} />
            {errors.city && (<span className='text-red-500'>{errors.city.message}</span>)}
        </label>
        <label className="text-gray-700 text-sm font-bold flex-1">
            Country
            <input type="text" className="border rounded w-full py-1 px-2 font-normal " {...register("country",{required: "This field is required"})} />
            {errors.country && (<span className='text-red-500'>{errors.country.message}</span>)}
        </label>
        </div>
        <label className="text-gray-700 text-sm font-bold flex-1">
            Description
            <textarea rows={10} type="text" className="border rounded w-full py-1 px-2 font-normal " {...register("description",{required: "This field is required"})} />
            {errors.description && (<span className='text-red-500'>{errors.description.message}</span>)}
        </label>
        <label className="text-gray-700 text-sm font-bold max-w-[50%]">
            Price per night
            <input type="number" min={1} className="border rounded w-full py-1 px-2 font-normal " {...register("pricepernight",{required: "This field is required"})} />
            {errors.pricepernight && (<span className='text-red-500'>{errors.pricepernight.message}</span>)}
        </label>
        <label className="text-gray-700 text-sm font-bold max-w-[50%]">
            Star Rating
            <select className='border rounded w-full p-2 text-gray-700 font-normal' {...register("starrating",{required: "This field is required"})}>
                <option value="" className="text-sm font-bold">Select as Rating</option>
                {[1,2,3,4,5].map((number) => {
                    return <option value={number}>{number}</option>;
                })}
            </select>
            {errors.starrating && (<span className='text-red-500'>{errors.starrating.message}</span>)}
        </label>
    </div>
  );
};

export default DetailsSection;
