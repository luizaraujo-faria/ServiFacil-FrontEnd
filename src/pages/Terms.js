import React from 'react';
import { Link } from 'react-router-dom';

function Terms() {
  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-2xl p-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Termos e Condições</h1>
        
        <div className="space-y-6 text-gray-700">
          <section>
            <h2 className="text-xl font-semibold mb-3">1. Aceitação dos Termos</h2>
            <p>
              Ao acessar e usar o ServiFácil, você concorda em cumprir e estar vinculado aos seguintes 
              termos e condições de uso. Se você não concordar com qualquer parte destes termos, 
              não deverá usar nossos serviços.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">2. Descrição do Serviço</h2>
            <p>
              O ServiFácil é uma plataforma que conecta usuários a profissionais qualificados para 
              diversos tipos de serviços. Atuamos como intermediários, facilitando o contato entre 
              clientes e prestadores de serviços.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">3. Cadastro e Conta</h2>
            <p>
              Para utilizar nossos serviços, você deve criar uma conta fornecendo informações precisas 
              e completas. Você é responsável por manter a confidencialidade de sua senha e por todas 
              as atividades que ocorram em sua conta.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">4. Responsabilidades do Usuário</h2>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>Fornecer informações verdadeiras e atualizadas</li>
              <li>Usar a plataforma de forma ética e legal</li>
              <li>Respeitar os profissionais e outros usuários</li>
              <li>Não compartilhar sua conta com terceiros</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">5. Responsabilidades dos Profissionais</h2>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>Prestar serviços com qualidade e profissionalismo</li>
              <li>Manter informações de perfil atualizadas</li>
              <li>Cumprir com os acordos estabelecidos com os clientes</li>
              <li>Possuir qualificações adequadas para os serviços oferecidos</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">6. Pagamentos e Taxas</h2>
            <p>
              Os pagamentos são processados através de nossa plataforma. O ServiFácil pode cobrar 
              taxas de serviço tanto de clientes quanto de profissionais. Todas as taxas serão 
              claramente informadas antes da conclusão de qualquer transação.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">7. Privacidade</h2>
            <p>
              Sua privacidade é importante para nós. Coletamos e usamos suas informações pessoais 
              de acordo com nossa Política de Privacidade. Ao usar o ServiFácil, você concorda 
              com a coleta e uso de informações conforme descrito.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">8. Limitação de Responsabilidade</h2>
            <p>
              O ServiFácil não se responsabiliza por danos diretos, indiretos, incidentais ou 
              consequenciais resultantes do uso ou incapacidade de usar nossos serviços. Atuamos 
              apenas como intermediários entre clientes e profissionais.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">9. Modificações dos Termos</h2>
            <p>
              Reservamos o direito de modificar estes termos a qualquer momento. As alterações 
              entrarão em vigor imediatamente após sua publicação na plataforma. É sua 
              responsabilidade revisar periodicamente estes termos.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">10. Contato</h2>
            <p>
              Para questões sobre estes termos, entre em contato conosco através do e-mail: 
              <span className="text-teal-500 font-medium"> contato@servifacil.com</span>
            </p>
          </section>
        </div>

        <div className="mt-8 pt-6 border-t border-gray-200 text-center">
          <p className="text-gray-600 mb-4">Última atualização: Janeiro de 2025</p>
          <Link 
            to="/cadastro" 
            className="inline-block bg-teal-400 hover:bg-teal-500 text-white px-6 py-2 rounded-lg font-semibold transition-colors"
          >
            Voltar ao Cadastro
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Terms;
