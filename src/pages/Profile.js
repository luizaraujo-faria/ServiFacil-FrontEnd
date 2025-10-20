import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Profile = () => {
  const navigate = useNavigate();
  const [profile, setProfile] = useState({
    name: "",
    phone: "",
    address: ""
  });

  useEffect(() => {
    // Carregar dados salvos do EditProfile
    try {
      const savedProfile = localStorage.getItem("profile");
      if (savedProfile) {
        const data = JSON.parse(savedProfile);
        setProfile({
          name: data.name || "",
          phone: data.phone || "",
          address: data.address ? `${data.address.street}, ${data.address.number} - ${data.address.neighborhood}` : ""
        });
      }
    } catch (error) {
      console.error("Erro ao carregar perfil:", error);
    }
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    let processedValue = value;

    // Validações
    if (name === "name") {
      processedValue = value.replace(/[^a-zA-ZÀ-ÿ\s]/g, "").slice(0, 50);
    } else if (name === "phone") {
      const numbers = value.replace(/\D/g, "").slice(0, 11);
      if (numbers.length > 10) {
        processedValue = numbers.replace(/(\d{2})(\d{5})(\d{4})/, "($1) $2-$3");
      } else if (numbers.length > 6) {
        processedValue = numbers.replace(/(\d{2})(\d{4})(\d{0,4})/, "($1) $2-$3");
      } else if (numbers.length > 2) {
        processedValue = numbers.replace(/(\d{2})(\d{0,5})/, "($1) $2");
      } else {
        processedValue = numbers;
      }
    } else if (name === "address") {
      processedValue = value.replace(/[^a-zA-ZÀ-ÿ0-9\s,.-]/g, "").slice(0, 100);
    }

    const newProfile = { ...profile, [name]: processedValue };
    setProfile(newProfile);
    
    // Salvar no localStorage para sincronizar com EditProfile
    try {
      const savedProfile = localStorage.getItem("profile");
      const profileData = savedProfile ? JSON.parse(savedProfile) : {};
      
      if (name === "name") profileData.name = processedValue;
      if (name === "phone") profileData.phone = processedValue;
      if (name === "address") {
        // Manter estrutura de endereço se existir
        if (!profileData.address) profileData.address = {};
        const parts = processedValue.split(',');
        if (parts.length > 0) profileData.address.street = parts[0].trim();
      }
      
      localStorage.setItem("profile", JSON.stringify(profileData));
    } catch (error) {
      console.error("Erro ao salvar:", error);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      const form = e.target.closest(".profile-info");
      const inputs = Array.from(form.querySelectorAll("input"));
      const currentIndex = inputs.indexOf(e.target);
      const nextInput = inputs[currentIndex + 1];
      
      if (nextInput) {
        nextInput.focus();
      }
    }
  };

  const handleEditProfile = () => {
    // Salvar dados atuais antes de navegar para edição
    try {
      const currentData = {
        name: profile.name,
        phone: profile.phone,
        address: profile.address
      };
      localStorage.setItem("profile_current", JSON.stringify(currentData));
    } catch (error) {
      console.error("Erro ao salvar dados atuais:", error);
    }
    navigate("/editar-perfil");
  };

  const handleLogout = () => {
    // Removido o localStorage.removeItem pois não há mais dados salvos automaticamente
    setProfile({
      name: "",
      phone: "",
      address: ""
    });
    alert("Logout realizado com sucesso!");
  };

  return (
    <div className="card">
      <img
        src={`${process.env.PUBLIC_URL || ""}/images/img.png`}
        alt="Foto de perfil"
        onError={(e) => {
          e.currentTarget.src = `${process.env.PUBLIC_URL || ""}/images/img.png`;
        }}
      />
      <h2>{profile.name}</h2>
      <div className="status">
        <i className="fas fa-circle-check"></i> Usuário ativo
      </div>

      <div className="profile-info">
        <div className="info-block">
          <i className="fas fa-user"></i>
          <input
            type="text"
            name="name"
            value={profile.name}
            onChange={handleInputChange}
            onKeyPress={handleKeyPress}
            placeholder="Nome completo"
          />
        </div>
        <div className="info-block">
          <i className="fas fa-phone"></i>
          <input
            type="text"
            name="phone"
            value={profile.phone}
            onChange={handleInputChange}
            onKeyPress={handleKeyPress}
            placeholder="Telefone"
          />
        </div>
        <div className="info-block">
          <i className="fas fa-map-marker-alt"></i>
          <input
            type="text"
            name="address"
            value={profile.address}
            onChange={handleInputChange}
            onKeyPress={handleKeyPress}
            placeholder="Endereço"
          />
        </div>
      </div>

      <div className="button-group">
        <button className="edit-btn" onClick={handleEditProfile}>
          <i className="fas fa-edit"></i> Editar Perfil
        </button>
        <button className="logout-btn" onClick={handleLogout}>
          <i className="fas fa-sign-out-alt"></i> Sair
        </button>
      </div>
    </div>
  );
};

export default Profile;
