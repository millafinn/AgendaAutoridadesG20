import React from "react";
import "./CountryDetails.css";

const CountryDetails = ({ selectedCountry, authorities }) => {
  if (!selectedCountry) {
    return <p>Selecione um país para ver os detalhes.</p>;
  }

  return (
    <div className="country-details-container">
      <h2>{selectedCountry.name}</h2>
      <p>
        <strong>Capital:</strong> {selectedCountry.capital}
      </p>
      <p>
        <strong>Região:</strong> {selectedCountry.region}
      </p>
      <p>
        <strong>Idioma:</strong> {selectedCountry.languages}
      </p>
      <p>
        <strong>Domínio:</strong> {selectedCountry.tld}
      </p>

      <h3>Autoridades Cadastradas</h3>
      {authorities.length > 0 ? (
        <ul>
          {authorities.map((auth, index) => (
            <li key={index}>
              <strong>{auth.name}</strong> - {auth.role} ({auth.email})
            </li>
          ))}
        </ul>
      ) : (
        <p>Nenhuma autoridade cadastrada para este país.</p>
      )}
    </div>
  );
};

export default CountryDetails;
