#!/bin/bash

# Script para corrigir permissões no servidor
# Execute este script no servidor via SSH

echo "🔧 Corrigindo permissões do diretório /var/www/frontend/..."

# Criar diretório se não existir
sudo mkdir -p /var/www/frontend

# Ajustar permissões
sudo chown -R anderson:anderson /var/www/frontend/
sudo chmod -R 755 /var/www/frontend/

echo "✅ Permissões corrigidas!"
echo "Agora você pode fazer o deploy normalmente."

