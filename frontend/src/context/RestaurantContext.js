import React, { createContext, useState } from 'react';

export const RestaurantContext = createContext();

export const RestaurantProvider = ({ children }) => {
  const [location, setLocation] = useState('');
  const [cuisine, setCuisine] = useState('');
  const [minRating, setMinRating] = useState(''); // <-- fixed here

  return (
    <RestaurantContext.Provider
      value={{ location, setLocation, cuisine, setCuisine, minRating, setMinRating }}
    >
      {children}
    </RestaurantContext.Provider>
  );
};
