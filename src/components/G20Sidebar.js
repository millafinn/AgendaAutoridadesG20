import React, { useEffect, useState } from "react";
import CountryList from "../CountryList";
import "./G20Sidebar.css";

const G20Sidebar = ({ onCountryClick }) => {
  const [countries, setCountries] = useState([]);
  const [filteredCountries, setFilteredCountries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedRegions, setSelectedRegions] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [error, setError] = useState(null);

  const g20Countries = [
    "África do Sul",
    "Alemanha",
    "Arábia Saudita",
    "Argentina",
    "Austrália",
    "Brasil",
    "Canadá",
    "China",
    "Coreia do Sul",
    "Estados Unidos",
    "França",
    "Índia",
    "Indonésia",
    "Itália",
    "Japão",
    "México",
    "Reino Unido",
    "Rússia",
    "Turquia",
  ];

  useEffect(() => {
    const fetchCountries = async () => {
      try {
        setLoading(true);
        setError(null);

        const cachedData = localStorage.getItem("g20Countries");
        if (cachedData) {
          const parsed = JSON.parse(cachedData);
          setCountries(parsed);
          setFilteredCountries(parsed);
          setLoading(false);
          return;
        }

        const response = await fetch("https://restcountries.com/v3.1/all");
        const data = await response.json();

        const filtered = data
          .filter((country) =>
            g20Countries.includes(country.translations.por.common)
          )
          .map((country) => ({
            name: country.translations.por.common,
            capital: country.capital ? country.capital[0] : "N/A",
            region: country.region,
            languages: country.languages
              ? Object.values(country.languages)[0]
              : "N/A",
            tld: country.tld ? country.tld[0] : "N/A",
          }))
          .sort((a, b) => a.name.localeCompare(b.name));

        setCountries(filtered);
        setFilteredCountries(filtered);
        localStorage.setItem("g20Countries", JSON.stringify(filtered));
      } catch (err) {
        setError("Erro ao carregar os dados. Tente novamente mais tarde.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchCountries();
  }, []);

  useEffect(() => {
    const byRegion =
      selectedRegions.length > 0
        ? countries.filter((country) =>
            selectedRegions.includes(country.region)
          )
        : countries;

    const bySearchTerm = byRegion.filter((country) =>
      country.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    setFilteredCountries(bySearchTerm);
  }, [selectedRegions, searchTerm, countries]);

  return (
    <div className="g20-sidebar">
      <h2>Filtros</h2>

      <div>
        <label htmlFor="search">Filtrar por nome:</label>
        <input
          id="search"
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Digite o nome do país..."
        />
      </div>

      <div>
        <h3>Filtrar por Região</h3>
        {countries.length > 0 &&
          [...new Set(countries.map((c) => c.region))].map((region) => (
            <label key={region}>
              <input
                type="checkbox"
                value={region}
                checked={selectedRegions.includes(region)}
                onChange={() =>
                  setSelectedRegions((prev) =>
                    prev.includes(region)
                      ? prev.filter((r) => r !== region)
                      : [...prev, region]
                  )
                }
              />
              {region}
            </label>
          ))}
      </div>

      {error && <p className="error">{error}</p>}

      <CountryList
        countries={filteredCountries}
        loading={loading}
        onCountryClick={onCountryClick}
      />
    </div>
  );
};

export default G20Sidebar;
