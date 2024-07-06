import React from 'react'
import { useFormContext } from 'react-hook-form'

const GuestsSection = () => {
    const {register, formState: {errors}} = useFormContext();
  return (
    <div>
      <h2 className="text-2xl font-bold mb-3">Guests</h2>
      <div className="grid grid-cols-2 p-6 gap-5 bg-gray-300">
        <label className='text-gray-700 text-sm font-semibold'>
            Adults
            <input type="number" className='border rounded-full py-2 px-3 font-normal' min={1}
            {...register("adultcount", {
                required: "This field is required"
            })} />
            {errors.adultcount?.message && (
            <span className='text-red-500 tex-sm font-bold'>{errors.adultcount?.message}</span>
            )}
        </label>
        <label className='text-gray-700 text-sm font-semibold'>
            Children
            <input type="number" className='border rounded-full py-2 px-3 font-normal' min={0}
            {...register("childcount", {
                required: "This field is required"
            })} />
            {errors.childcount?.message && (
            <span className='text-red-500 tex-sm font-bold'>{errors.childcount?.message}</span>
            )}
        </label>
      </div>
    </div>
  );
};

export default GuestsSection;
