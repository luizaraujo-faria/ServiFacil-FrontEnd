# Front End - ServiFácil 

    Projeto para a equipe de desenvolvimento Front-End da plataforma ServiFácil.
    Cabe a cada um ler este arquivo antes de iniciar o desenvolvimento.
    Em caso de dúvidas recorra ao restante do grupo ou aos líderes.

# Ferramentas

- React.js (JavaScript) - Biblioteca e linguagem padrão do projeto.
- CSS3 - Ferramenta de estilização do projeto.
- Vite - Bundler para aprimorar e simplificar o desenvolvimento.
- ESLint - Para padronização e detecção de erros no código.
- Prettier - Para padronizar e formatar o código junto com o ESLint.
- Git - Para controle de versão e colaboração

# Pastas/Arquivos

- public/ - Pasta para recursos públicos e estáticos da aplicação.
- src/ - Pasta principal da aplicação

    ├── assets/ - Pasta de recursos da aplicação.
            
            ├── icons/ - Icones, simbolos etc.
            ├── images/ - Imagens, banner etc.
    
    components/ - Componentes JSX utilizados na aplicação.

            ├── layout/ - Componentes de layout (que se repetem na estrutura de design).
            ├── ui/ - Compoentes genéricos reutilizáveis.
    
    pages/ - Páginas JSX para navegação da aplicação.

    App.jsx - Componente principal a receber as páginas da aplicação.
    index.css - CSS principal da aplicação.
    main.jsx - Componente responsável por renderizar todo o conteúdo.

- .eslintignore - Define arquivos a serem ignorados pelo ESLint.
- .gitignore - Define arquivos a serem ignorados pelo Git.
- .prettierignore - Define arquivos a serem ignorados pelo Prettier.
- .prettierrc - Configurações do Prettier.
- eslint.config.js - Configurações do ESLint.
- index.html - HTML principal da aplicação.
- vite.config.js - Configurações do Vite.

# Branches

- main - Branch principal ou Branch de produção.
- dev - Branch para desenvolvimento.
- feature/nome-da-feature - Para criar novas features e depois mescla-la com a dev.

# Instalação

- git clone <URL DO REPOSITORIO> - Clonará o repositório remoto na sua máquina.
- cd SF-FrontEnd - Entrará na pasta do projeto.
- npm install - Instalará todas as dependencias do projeto.

# Uso

- cd SF-FrontEnd - Para entrar na pasta do projeto.
- npm run dev - Para executar a aplicação.
- npm run lint - Para "Varrer" o código com o ESLint.
- npm run format - Para formatar o código com o Prettier.