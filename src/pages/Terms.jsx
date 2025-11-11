import React, { useEffect } from 'react';

export default function Terms() {
  useEffect(() => {
    // Exemplo: rolar para o topo ao abrir a página
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-white px-6 py-12">
      <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-2xl p-8">
        <h1 className="text-3xl font-bold text-purple-700 mb-4 text-center">🟣 Termos e Condições de Uso — ServiFácil</h1>
        <p className="text-sm text-gray-500 text-center mb-10">Documento gerado como exemplo inicial. Pode ser adaptado conforme as políticas oficiais da empresa.</p>

        <section className="space-y-8 text-gray-800 leading-relaxed">
          <div>
            <h2 className="text-xl font-semibold text-purple-600 mb-2">🏠 1. Sobre a ServiFácil</h2>
            <p>
              A <strong>ServiFácil</strong> é uma plataforma digital que conecta <strong>clientes</strong> e <strong>profissionais autônomos</strong> — como babás, encanadores, eletricistas, pedreiros e outros. Nosso objetivo é facilitar o encontro entre quem precisa de um
              serviço e quem está pronto para executá-lo com qualidade.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-purple-600 mb-2">👤 2. Cadastro e Conta de Usuário</h2>
            <p>O usuário deve fornecer informações verdadeiras no cadastro e manter sua senha em segurança. O uso indevido ou fraudulento da conta pode levar à suspensão temporária ou definitiva.</p>
            <ul className="list-disc pl-6 mt-2">
              <li>Proibido uso de dados falsos ou de terceiros.</li>
              <li>Contas suspeitas podem ser revisadas.</li>
              <li>O usuário pode excluir sua conta a qualquer momento.</li>
            </ul>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-purple-600 mb-2">🤝 3. Funcionamento da Plataforma</h2>
            <p>A ServiFácil atua apenas como intermediária entre contratantes e prestadores, não sendo responsável pela execução dos serviços.</p>
            <ul className="list-disc pl-6 mt-2">
              <li>O contratante escolhe o profissional disponível.</li>
              <li>O prestador define preços e horários.</li>
              <li>A comunicação deve ser respeitosa e transparente.</li>
            </ul>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-purple-600 mb-2">💬 4. Responsabilidades dos Usuários</h2>
            <p>Ambos os usuários devem agir com respeito, profissionalismo e boa-fé durante toda a interação na plataforma.</p>
            <p className="font-medium mt-3">Contratante:</p>
            <ul className="list-disc pl-6 mb-3">
              <li>Descrever claramente o serviço desejado.</li>
              <li>Confirmar as informações antes da contratação.</li>
            </ul>
            <p className="font-medium">Prestador de Serviço:</p>
            <ul className="list-disc pl-6">
              <li>Cumprir os acordos de forma ética e pontual.</li>
              <li>Garantir a veracidade das informações do perfil.</li>
            </ul>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-purple-600 mb-2">🔒 5. Privacidade e Proteção de Dados (LGPD)</h2>
            <p>
              A ServiFácil respeita a <strong>Lei Geral de Proteção de Dados (Lei nº 13.709/2018)</strong>, garantindo que as informações coletadas sejam utilizadas apenas para fins operacionais e com o consentimento do usuário.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-purple-600 mb-2">⚠️ 6. Limitação de Responsabilidade</h2>
            <p>A ServiFácil não se responsabiliza por prejuízos causados por:</p>
            <ul className="list-disc pl-6 mt-2">
              <li>Erros de comunicação entre usuários.</li>
              <li>Serviços realizados fora da plataforma.</li>
              <li>Informações falsas prestadas por terceiros.</li>
            </ul>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-purple-600 mb-2">📧 7. Contato e Suporte</h2>
            <p>
              Dúvidas ou sugestões podem ser enviadas para{' '}
              <a href="mailto:suporte@servifacil.com.br" className="text-purple-700 font-medium hover:underline">
                suporte@servifacil.com.br
              </a>
            </p>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-purple-600 mb-2">📅 8. Atualizações do Termo</h2>
            <p>Este documento pode ser atualizado periodicamente. O uso contínuo da plataforma indica a aceitação das novas versões.</p>
          </div>
        </section>

        <footer className="text-center mt-10 border-t border-gray-200 pt-6 text-gray-700 font-medium">✨ ServiFácil — Conectando quem precisa com quem sabe fazer.</footer>
      </div>
    </div>
  );
}
