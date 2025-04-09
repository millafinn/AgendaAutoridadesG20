import React from "react";
import "./CountryList.css";

const CountryList = ({
  countries,
  loading,
  onCountryClick,
  selectedCountry,
}) => {
  return (
    <div className="container">
      <h2>Países do G20</h2>
      {loading ? (
        <p className="loading">Carregando...</p>
      ) : (
        <ul className="country-list">
          {countries.map((country) => (
            <li
              key={country.name}
              onClick={() => onCountryClick(country)}
              className={`country-item ${
                selectedCountry && selectedCountry.name === country.name
                  ? "selected"
                  : ""
              }`}
            >
              {country.name}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default CountryList;
