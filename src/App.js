import React, { useState, useEffect } from "react";
import { Routes, Route, Link, Navigate, useLocation } from "react-router-dom";
import G20Sidebar from "./components/G20Sidebar";
import CountryDetails from "./components/CountryDetails";
import AuthoritiesForm from "./components/AuthoritiesForm";
import ScheduleForm from "./components/ScheduleForm";
import SchedulesList from "./components/SchedulesList";
import "./App.css";

const Authorities = ({ authorities }) => (
  <div className="authorities-container">
    <h2>Autoridades</h2>
    {authorities.length > 0 ? (
      <ul className="authorities-list">
        {authorities.map((auth, index) => (
          <li key={index}>
            <strong>{auth.name}</strong> - {auth.role} ({auth.country})
          </li>
        ))}
      </ul>
    ) : (
      <p className="no-authorities-message">Nenhuma autoridade cadastrada.</p>
    )}
  </div>
);

const NotFound = () => (
  <div>
    <h2>404 - Página não encontrada</h2>
    <p>A página que você está procurando não existe.</p>
  </div>
);

const App = () => {
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [g20Countries, setG20Countries] = useState([]);
  const [authorities, setAuthorities] = useState([]);
  const [schedules, setSchedules] = useState([]);
  const [menuOpen, setMenuOpen] = useState(false);

  const location = useLocation();

  useEffect(() => {
    const storedAuthorities = localStorage.getItem("authorities");
    if (storedAuthorities) {
      setAuthorities(JSON.parse(storedAuthorities));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("authorities", JSON.stringify(authorities));
  }, [authorities]);

  useEffect(() => {
    const fetchCountries = async () => {
      try {
        const response = await fetch("https://restcountries.com/v3.1/all");
        const data = await response.json();

        const g20CountriesNames = [
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

        const filteredCountries = data
          .filter((country) =>
            g20CountriesNames.includes(country.translations.por.common)
          )
          .map((country) => ({
            name: country.translations.por.common,
            tld: country.tld ? country.tld[0] : "N/A",
          }));

        setG20Countries(filteredCountries);
      } catch (error) {
        console.error("Erro ao carregar os países do G20:", error);
      }
    };

    fetchCountries();
  }, []);

  const shouldShowSidebar = ![
    "/authorities",
    "/authorities/new",
    "/agendas",
    "/agendas/new",
  ].includes(location.pathname);

  return (
    <div
      style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}
    >
      <nav className="navbar">
        <button
          className="hamburger"
          onClick={() => setMenuOpen((prev) => !prev)}
        >
          &#9776;
        </button>
        <div className={`nav-links ${menuOpen ? "open" : ""}`}>
          <Link to="/countries" onClick={() => setMenuOpen(false)}>
            Países do G20
          </Link>
          <Link to="/authorities" onClick={() => setMenuOpen(false)}>
            Autoridades
          </Link>
          <Link to="/authorities/new" onClick={() => setMenuOpen(false)}>
            Nova Autoridade
          </Link>
          <Link to="/agendas" onClick={() => setMenuOpen(false)}>
            Agendas
          </Link>
          <Link to="/agendas/new" onClick={() => setMenuOpen(false)}>
            Novo Agendamento
          </Link>
        </div>
      </nav>

      <div style={{ display: "flex", flex: 1 }}>
        {shouldShowSidebar && (
          <G20Sidebar onCountryClick={setSelectedCountry} />
        )}

        <div style={{ flexGrow: 1, padding: "20px" }}>
          <Routes>
            <Route path="/" element={<Navigate to="/countries" replace />} />

            <Route
              path="/countries"
              element={
                <CountryDetails
                  selectedCountry={selectedCountry}
                  authorities={authorities.filter(
                    (auth) => auth.country === selectedCountry?.name
                  )}
                />
              }
            />

            <Route
              path="/authorities"
              element={<Authorities authorities={authorities} />}
            />

            <Route
              path="/authorities/new"
              element={
                <AuthoritiesForm
                  g20Countries={g20Countries}
                  setAuthorities={setAuthorities}
                />
              }
            />

            <Route
              path="/agendas"
              element={<SchedulesList schedules={schedules} />}
            />

            <Route
              path="/agendas/new"
              element={
                <ScheduleForm
                  authorities={authorities}
                  schedules={schedules}
                  setSchedules={setSchedules}
                />
              }
            />

            <Route path="*" element={<NotFound />} />
          </Routes>
        </div>
      </div>
    </div>
  );
};

export default App;
