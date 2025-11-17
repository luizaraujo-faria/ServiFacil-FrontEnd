# Guia de Deploy - ServiFacil Frontend

## 📋 Comando de Deploy

O projeto usa **Vite**, que gera os arquivos na pasta `dist/` (não `build/`).

### Comando Correto:

```bash
scp -r dist/* anderson@216.238.122.65:/var/www/frontend/
```

### ⚠️ Diferença Importante:

- ❌ **Errado**: `build/*` (pasta não existe)
- ✅ **Correto**: `dist/*` (pasta gerada pelo Vite)

## 🚀 Opções de Deploy

### Opção 1: Script NPM (Recomendado)

```bash
npm run deploy
```

Este comando:
1. Executa o build (`npm run build`)
2. Faz o deploy automaticamente via SCP

### Opção 2: Script Shell (Linux/Mac)

```bash
chmod +x deploy.sh
./deploy.sh
```

### Opção 3: Script Batch (Windows)

```bash
deploy.bat
```

### Opção 4: Manual

```bash
# 1. Fazer build
npm run build

# 2. Fazer deploy
scp -r dist/* anderson@216.238.122.65:/var/www/frontend/
```

## 📁 Estrutura de Arquivos

Após o build, a pasta `dist/` contém:
```
dist/
├── index.html
└── assets/
    ├── index-[hash].css
    ├── index-[hash].js
    └── image-[hash].png
```

## 🔧 Configurações do Servidor

- **Servidor**: 216.238.122.65
- **Usuário**: anderson
- **Diretório de destino**: /var/www/frontend/
- **Protocolo**: SCP/SSH

## ⚠️ Requisitos

1. Ter acesso SSH ao servidor
2. Ter permissões de escrita em `/var/www/frontend/`
3. Ter `scp` instalado no sistema local

## 🔍 Verificação Pós-Deploy

Após o deploy, verifique:
1. Acesse: http://216.238.122.65
2. Verifique se os arquivos foram copiados corretamente
3. Teste as funcionalidades principais

## 🐛 Troubleshooting

### Erro: "Permission denied"

Este erro ocorre quando o usuário não tem permissão de escrita no diretório `/var/www/frontend/`.

#### Solução 1: Corrigir permissões no servidor (Recomendado)

1. Conecte-se ao servidor via SSH:
```bash
ssh anderson@216.238.122.65
```

2. Execute os seguintes comandos:
```bash
# Criar diretório se não existir
sudo mkdir -p /var/www/frontend

# Ajustar proprietário
sudo chown -R anderson:anderson /var/www/frontend/

# Ajustar permissões
sudo chmod -R 755 /var/www/frontend/
```

3. Tente fazer o deploy novamente.

#### Solução 2: Usar diretório temporário (Automático)

Os scripts `deploy.sh` e `deploy.bat` agora tentam automaticamente:
1. Enviar arquivos para `/tmp/frontend-deploy/`
2. Mover com `sudo` para `/var/www/frontend/`
3. Ajustar permissões automaticamente

#### Solução 3: Script de correção

Execute no servidor:
```bash
# Copiar o script fix-permissions.sh para o servidor
scp fix-permissions.sh anderson@216.238.122.65:/tmp/

# Conectar ao servidor
ssh anderson@216.238.122.65

# Executar o script
chmod +x /tmp/fix-permissions.sh
/tmp/fix-permissions.sh
```

### Erro: "No such file or directory"
- Verifique se a pasta `/var/www/frontend/` existe no servidor
- Crie a pasta se necessário: `mkdir -p /var/www/frontend/`

### Erro: "Connection refused"
- Verifique se o servidor está acessível
- Verifique se a porta SSH (22) está aberta

