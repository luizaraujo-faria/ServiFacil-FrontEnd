#!/bin/bash

# Script de Deploy - ServiFacil Frontend
# Este script faz o build e faz deploy para o servidor

echo "🚀 Iniciando deploy do ServiFacil Frontend..."

# Cores para output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# 1. Fazer build do projeto
echo -e "${YELLOW}📦 Executando build...${NC}"
npm run build

if [ $? -ne 0 ]; then
    echo -e "${RED}❌ Erro ao fazer build!${NC}"
    exit 1
fi

echo -e "${GREEN}✅ Build concluído com sucesso!${NC}"

# 2. Fazer deploy via SCP
echo -e "${YELLOW}📤 Enviando arquivos para o servidor...${NC}"

# Opção 1: Tentar deploy direto
scp -r dist/* anderson@216.238.122.65:/var/www/frontend/ 2>/dev/null

if [ $? -ne 0 ]; then
    echo -e "${YELLOW}⚠️  Deploy direto falhou. Tentando método alternativo...${NC}"
    
    # Opção 2: Enviar para diretório temporário e depois mover com sudo
    echo -e "${YELLOW}📤 Enviando para diretório temporário...${NC}"
    scp -r dist/* anderson@216.238.122.65:/tmp/frontend-deploy/
    
    if [ $? -eq 0 ]; then
        echo -e "${YELLOW}🔄 Movendo arquivos para o diretório final...${NC}"
        ssh anderson@216.238.122.65 "sudo rm -rf /var/www/frontend/* && sudo cp -r /tmp/frontend-deploy/* /var/www/frontend/ && sudo chown -R www-data:www-data /var/www/frontend/ && sudo chmod -R 755 /var/www/frontend/ && rm -rf /tmp/frontend-deploy/"
        
        if [ $? -ne 0 ]; then
            echo -e "${RED}❌ Erro ao mover arquivos!${NC}"
            exit 1
        fi
    else
        echo -e "${RED}❌ Erro ao fazer deploy!${NC}"
        echo -e "${YELLOW}💡 Solução manual:${NC}"
        echo "1. SSH no servidor: ssh anderson@216.238.122.65"
        echo "2. Execute: sudo chown -R anderson:anderson /var/www/frontend/"
        echo "3. Execute: sudo chmod -R 755 /var/www/frontend/"
        exit 1
    fi
fi

echo -e "${GREEN}✅ Deploy concluído com sucesso!${NC}"
echo -e "${GREEN}🌐 Frontend disponível em: http://216.238.122.65${NC}"

