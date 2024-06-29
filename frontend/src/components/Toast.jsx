import React, { useEffect } from 'react'

const Toast = ({message, type, onClose}) => {

    useEffect(() => {
        const timer = setTimeout(() => {
            onClose();
        }, 5000);

        //resets the timer whenever the component closes
        return () => {
            clearTimeout(timer);
        };
    },[onClose]);

    //conditionally styling the toast
    const styles = type === "SUCCESS" ? "fixed top-4 right-4 z-50 p-4 rounded-md bg-green-600 text-white max-w-md" : "fixed top-4 right-4 z-50 p-4 rounded-md bg-red-600 text-white max-w-md"
  return (
    <div className={styles}>
      <div className="flex justify-center items-center">
        <span className="text-lg font-semibold">{message}</span>
      </div>
    </div>
  );
};

export default Toast;
