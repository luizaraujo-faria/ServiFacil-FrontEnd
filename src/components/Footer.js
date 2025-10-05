import React from "react";
import { Link } from "react-router-dom";
import "./Footer.css";

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-top">
        <div className="footer-logo">ServiFácil</div>
        <div className="footer-links">
          <Link to="/">Ajuda</Link>
          <Link to="/">Termos</Link>
          <Link to="/">Privacidade</Link>
          <Link to="/">Contato</Link>
        </div>
      </div>
      <div className="footer-social">
        <Link to="/">
          <i className="fab fa-facebook"></i>
        </Link>
        <Link to="/">
          <i className="fab fa-instagram"></i>
        </Link>
        <Link to="/">
          <i className="fab fa-twitter"></i>
        </Link>
      </div>
      <div className="footer-copy">
        © 2023 ServiFácil. Todos os direitos reservados.
      </div>
    </footer>
  );
};

export default Footer;
