import { Facebook, Instagram, Twitter, Mail, Phone, MapPin } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="w-full bg-gray-900 text-gray-200 mt-auto">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          
          <div>
            <h3 className="text-lg font-bold text-white mb-4">
              <span className="text-violet-400">Servi</span>Facil
            </h3>
            <p className="text-sm text-gray-400 mb-4">
              A plataforma líder em conectar clientes com profissionais verificados e de confiança. Qualidade, segurança e excelência em cada serviço.
            </p>
            <div className="flex gap-3">
              <a href="#" className="hover:text-violet-400 transition-colors">
                <Facebook size={20} />
              </a>
              <a href="#" className="hover:text-violet-400 transition-colors">
                <Instagram size={20} />
              </a>
              <a href="#" className="hover:text-violet-400 transition-colors">
                <Twitter size={20} />
              </a>
            </div>
          </div>

          <div>
            <h4 className="text-base font-semibold text-white mb-4">Links Rápidos</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/home" className="text-gray-400 hover:text-violet-400 transition-colors">
                  Início
                </Link>
              </li>
              <li>
                <Link to="/categorias" className="text-gray-400 hover:text-violet-400 transition-colors">
                  Categorias
                </Link>
              </li>
              <li>
                <Link to="/favoritos" className="text-gray-400 hover:text-violet-400 transition-colors">
                  Favoritos
                </Link>
              </li>
              <li>
                <Link to="/login" className="text-gray-400 hover:text-violet-400 transition-colors">
                  Login
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-base font-semibold text-white mb-4">Para Profissionais</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/profissional" className="text-gray-400 hover:text-violet-400 transition-colors">
                  Cadastre-se
                </Link>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-violet-400 transition-colors">
                  Centro de Ajuda
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-violet-400 transition-colors">
                  Política de Privacidade
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-violet-400 transition-colors">
                  Termos de Uso
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-base font-semibold text-white mb-4">Contato</h4>
            <ul className="space-y-3 text-sm">
              <li className="flex items-center gap-2 text-gray-400">
                <Phone size={16} />
                <a href="tel:+55119999999" className="hover:text-violet-400 transition-colors">
                  (21) 9999-9999
                </a>
              </li>
              <li className="flex items-center gap-2 text-gray-400">
                <Mail size={16} />
                <a href="mailto:contato@servifacil.com" className="hover:text-violet-400 transition-colors">
                  contato@servifacil.com
                </a>
              </li>
              <li className="flex items-start gap-2 text-gray-400">
                <MapPin size={16} className="mt-0.5 flex-shrink-0" />
                <span>Rio de Janeiro, RJ - Brasil</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mb-8"></div>

        <div className="flex flex-col sm:flex-row justify-between items-center text-sm text-gray-400">
          <p>&copy; 2025 ServiFacil. Todos os direitos reservados.</p>
          <div className="flex gap-6 mt-4 sm:mt-0">
            <a href="#" className="hover:text-violet-400 transition-colors">
              Privacidade
            </a>
            <a href="#" className="hover:text-violet-400 transition-colors">
              Termos
            </a>
            <a href="#" className="hover:text-violet-400 transition-colors">
              Cookies
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}