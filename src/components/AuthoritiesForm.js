import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./AuthoritiesForm.css";

const AuthoritiesForm = ({ g20Countries, setAuthorities }) => {
  const [formData, setFormData] = useState({
    name: "",
    country: "",
    role: "",
    email: "",
  });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const validateForm = () => {
    const selectedCountry = g20Countries.find(
      (country) => country.name === formData.country
    );

    if (!selectedCountry) {
      return "Selecione um país válido.";
    }

    if (!formData.name.includes(" ")) {
      return "Informe o nome completo da autoridade.";
    }

    if (!formData.email.endsWith(selectedCountry.tld)) {
      return `O e-mail deve terminar com o domínio ${selectedCountry.tld}.`;
    }

    return "";
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const validationError = validateForm();

    if (validationError) {
      setError(validationError);
      return;
    }

    setAuthorities((prev) => [...prev, formData]);
    navigate(`/countries?country=${formData.country}`);
  };

  return (
    <form onSubmit={handleSubmit} className="authorities-form">
      <h2 className="form-title">Cadastro de Autoridade</h2>

      {error && <p className="form-error">{error}</p>}

      <div className="form-group">
        <label>Nome da Autoridade:</label>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleInputChange}
          required
          className="form-input"
        />
      </div>

      <div className="form-group">
        <label>País Representado:</label>
        <select
          name="country"
          value={formData.country}
          onChange={handleInputChange}
          required
          className="form-select"
        >
          <option value="">Selecione</option>
          {g20Countries.map((country) => (
            <option key={country.name} value={country.name}>
              {country.name}
            </option>
          ))}
        </select>
      </div>

      <div className="form-group">
        <label>Cargo/Função:</label>
        <select
          name="role"
          value={formData.role}
          onChange={handleInputChange}
          required
          className="form-select"
        >
          <option value="">Selecione</option>
          <option value="Chefe de Estado">Chefe de Estado</option>
          <option value="Ministro de Finanças">Ministro de Finanças</option>
          <option value="Presidente de Banco Central">
            Presidente de Banco Central
          </option>
        </select>
      </div>

      <div className="form-group">
        <label>Email:</label>
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleInputChange}
          required
          className="form-input"
        />
      </div>

      <button type="submit" className="form-button">
        Cadastrar
      </button>
    </form>
  );
};

export default AuthoritiesForm;
