@echo off
REM Script de Deploy - ServiFacil Frontend (Windows)
REM Este script faz o build e faz deploy para o servidor

echo 🚀 Iniciando deploy do ServiFacil Frontend...

REM 1. Fazer build do projeto
echo 📦 Executando build...
call npm run build

if %errorlevel% neq 0 (
    echo ❌ Erro ao fazer build!
    exit /b 1
)

echo ✅ Build concluído com sucesso!

REM 2. Fazer deploy via SCP
echo 📤 Enviando arquivos para o servidor...

REM Tentar deploy direto primeiro
scp -r dist/* anderson@216.238.122.65:/var/www/frontend/

if %errorlevel% neq 0 (
    echo ⚠️  Deploy direto falhou. Tentando método alternativo...
    echo.
    echo 📤 Enviando para diretório temporário...
    scp -r dist/* anderson@216.238.122.65:/tmp/frontend-deploy/
    
    if %errorlevel% equ 0 (
        echo 🔄 Movendo arquivos para o diretório final...
        ssh anderson@216.238.122.65 "sudo rm -rf /var/www/frontend/* && sudo cp -r /tmp/frontend-deploy/* /var/www/frontend/ && sudo chown -R www-data:www-data /var/www/frontend/ && sudo chmod -R 755 /var/www/frontend/ && rm -rf /tmp/frontend-deploy/"
        
        if %errorlevel% neq 0 (
            echo ❌ Erro ao mover arquivos!
            echo.
            echo 💡 Solução manual:
            echo 1. SSH no servidor: ssh anderson@216.238.122.65
            echo 2. Execute: sudo chown -R anderson:anderson /var/www/frontend/
            echo 3. Execute: sudo chmod -R 755 /var/www/frontend/
            exit /b 1
        )
    ) else (
        echo ❌ Erro ao fazer deploy!
        echo.
        echo 💡 Solução manual:
        echo 1. SSH no servidor: ssh anderson@216.238.122.65
        echo 2. Execute: sudo chown -R anderson:anderson /var/www/frontend/
        echo 3. Execute: sudo chmod -R 755 /var/www/frontend/
        exit /b 1
    )
)

echo ✅ Deploy concluído com sucesso!
echo 🌐 Frontend disponível em: http://216.238.122.65

pause

