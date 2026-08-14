import { useContext } from 'react';
import { RestaurantContext } from './RestaurantContext';

export const useRestaurant = () => useContext(RestaurantContext);