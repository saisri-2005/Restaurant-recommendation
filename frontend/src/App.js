import React, { useEffect, useState } from 'react';
import MapComponent from './components/MapComponent';
import './App.css';

const API_URL =
  'https://restaurant-recommendation-hcpc.onrender.com/api/restaurants';

function App() {
  const [selectedRestaurant, setSelectedRestaurant] = useState(null);

  const [filters, setFilters] = useState({
    location: '',
    cuisine: '',
    minRating: ''
  });

  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const isFilterApplied =
    filters.location.trim() ||
    filters.cuisine.trim() ||
    filters.minRating !== '';

  useEffect(() => {
    if (!isFilterApplied) {
      setRestaurants([]);
      setSelectedRestaurant(null);
      setError('');
      return;
    }

    const fetchRestaurants = async () => {
      setLoading(true);
      setError('');

      try {
        const params = new URLSearchParams();

        if (filters.location.trim()) {
          params.append('city', filters.location.trim());
        }

        if (filters.cuisine.trim()) {
          params.append('cuisine', filters.cuisine.trim());
        }

        if (filters.minRating !== '') {
          params.append('minRating', filters.minRating);
        }

        const response = await fetch(
          `${API_URL}?${params.toString()}`
        );

        if (!response.ok) {
          throw new Error('Failed to fetch restaurants');
        }

        const data = await response.json();

        setRestaurants(data);
        setSelectedRestaurant(null);

      } catch (err) {
        console.error('Error fetching restaurants:', err);

        setRestaurants([]);
        setSelectedRestaurant(null);

        setError(
          'Unable to fetch restaurants. Please try again.'
        );

      } finally {
        setLoading(false);
      }
    };

    fetchRestaurants();

  }, [
    filters.location,
    filters.cuisine,
    filters.minRating,
    isFilterApplied
  ]);

  const handleLocationChange = (e) => {
    setFilters({
      ...filters,
      location: e.target.value
    });
  };

  const handleCuisineChange = (e) => {
    setFilters({
      ...filters,
      cuisine: e.target.value
    });
  };

  const handleRatingChange = (e) => {
    setFilters({
      ...filters,
      minRating: e.target.value
    });
  };

  return (
    <div className="app-container">

      {/* ================= LEFT PANEL ================= */}

      <div className="panel filters-panel">

        <h1 className="heading">
          Restaurant Recommendation
        </h1>

        {/* Filters */}

        <div className="filters">

          <input
            type="text"
            placeholder="Enter location"
            value={filters.location}
            onChange={handleLocationChange}
          />

          <input
            type="text"
            placeholder="Enter cuisine"
            value={filters.cuisine}
            onChange={handleCuisineChange}
          />

          <input
            type="number"
            min="0"
            max="5"
            step="0.1"
            placeholder="Min Rating e.g. 3"
            value={filters.minRating}
            onChange={handleRatingChange}
          />

        </div>

        {/* ================= LOADING ================= */}

        {loading && (
          <p className="no-results">
            Loading restaurants...
          </p>
        )}

        {/* ================= ERROR ================= */}

        {!loading && error && (
          <p className="no-results">
            {error}
          </p>
        )}

        {/* ================= NO FILTER ================= */}

        {!loading &&
          !error &&
          !isFilterApplied && (
            <p className="no-results">
              Apply filters to see restaurants
            </p>
          )}

        {/* ================= NO RESULTS ================= */}

        {!loading &&
          !error &&
          isFilterApplied &&
          restaurants.length === 0 && (
            <p className="no-results">
              No restaurants found for your filters.
            </p>
          )}

        {/* ================= RESTAURANT CARDS ================= */}

        {!loading &&
          !error &&
          restaurants.length > 0 && (

            <div className="restaurant-list">

              {restaurants.map((restaurant) => (

                <div
                  key={restaurant._id}
                  className={`restaurant-card ${
                    selectedRestaurant?._id === restaurant._id
                      ? 'selected'
                      : ''
                  }`}
                  onClick={() =>
                    setSelectedRestaurant(restaurant)
                  }
                >

                  {/* Restaurant Name */}

                  <strong>
                    {restaurant.name}
                  </strong>

                  {/* Cuisine */}

                  <div className="cuisine-badges">

                    {restaurant.cuisine?.map(
                      (cuisine, index) => (

                        <span
                          key={`${cuisine}-${index}`}
                        >
                          {cuisine}
                        </span>

                      )
                    )}

                  </div>

                  {/* Rating */}

                  <div>
                    ⭐ {restaurant.rating}
                  </div>

                  {/* Location */}

                  <div>
                    {restaurant.location}
                  </div>

                </div>

              ))}

            </div>

          )}

      </div>

      {/* ================= RIGHT PANEL ================= */}

      <div className="panel map-panel">

        <MapComponent
          restaurants={restaurants}
          selectedRestaurant={selectedRestaurant}
          setSelectedRestaurant={setSelectedRestaurant}
        />

      </div>

    </div>
  );
}

export default App;