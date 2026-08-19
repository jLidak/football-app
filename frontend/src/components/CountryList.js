import React, { useEffect, useState } from "react";
import axios from "axios";
import "./CountryList.css"; // Optional: CSS for styling

const CountryList = () => {
  const [countries, setCountries] = useState([]);
  const [error, setError] = useState(null); // for handling errors

  // Fetch the list of countries from the backend
  useEffect(() => {
    const fetchCountries = async () => {
      try {
        const response = await axios.get("http://localhost:8080/api/countries");
        setCountries(response.data);
      } catch (error) {
        console.error(
          "Error fetching countries:",
          error.response ? error.response.data : error.message,
        );
        setError(error);
      }
    };

    fetchCountries();
  }, []);

  return (
    <div className="country-list">
      <h2>List of Countries</h2>
      <ul>
        {countries.map((country) => (
          <li key={country.id} className="country-item">
            <img
              src={`/assets/flags/${country.code}.svg`} // Path to the flag image relative to the public folder
              alt={`${country.name} flag`}
              className="flag-icon"
            />
            <span>{country.name}</span>
            <span>{country.code}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CountryList;
