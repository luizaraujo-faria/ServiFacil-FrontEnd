import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Loggin from './pages/Loggin';
import CreateAccount from './pages/CreateAccount';
import ProfessionalForm from './pages/ProfessionalForm';
import Terms from './pages/Terms';
import Recuperation from './pages/Recuperation';

function App() {
  // Estado do formulário do profissional
  const [formData, setFormData] = useState({
    tipoServico: '',
    habilidades: '',
    experiencia: '',
    preco: '',
    disponibilidade: '',
  });

  // Função para atualizar o estado do formulário
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Loggin />} />
        <Route path="/cadastro" element={<CreateAccount />} />
        <Route path="/cadastroProfissional" element={<ProfessionalForm formData={formData} onChange={handleChange} />} />
        <Route path="/Terms" element={<Terms />} />
        <Route path="/Recuperation" element={<Recuperation />} />
      </Routes>
    </Router>
  );
}

export default App;
