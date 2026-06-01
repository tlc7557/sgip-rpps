@echo off
title 🏛️ SGIP-RPPS: Inicializador do Ecossistema Previdenciário
chcp 65001 > nul

echo =========================================================================
echo       🏛️ INICIALIZADOR OPERACIONAL DO SGIP-RPPS (MUNICIPAL)
echo =========================================================================
echo.
echo Este script irá preparar e rodar os servidores da plataforma localmente:
echo  1. Servidor de API Backend (Express/TypeScript) - Porta 5000 (Fallback SQLite)
echo  2. Agente REST Local do Digitalizador (Node.js) - Porta 5050 (Epson L3250 Bridge)
echo  3. Painel Web Frontend React (Vite/TypeScript) - Porta 3000 (Interface Premium)
echo.
echo =========================================================================
echo.

:: 1. Verificar instalação do Node.js
where node >nul 2>nul
if %errorlevel% neq 0 (
    echo [ERROR] O Node.js não foi encontrado no seu sistema.
    echo Por favor, instale o Node.js v18 ou superior (https://nodejs.org) e tente novamente.
    echo.
    pause
    exit /b 1
)

:: 2. Instalar dependências do Backend (se necessário)
if not exist "backend\node_modules\" (
    echo [INFO] Instalando dependências do BACKEND. Por favor, aguarde...
    cd backend
    call npm install
    cd ..
) else (
    echo [OK] Dependências do Backend já estão instaladas.
)

:: 3. Instalar dependências do Frontend (se necessário)
if not exist "frontend\node_modules\" (
    echo [INFO] Instalando dependências do FRONTEND. Por favor, aguarde...
    cd frontend
    call npm install
    cd ..
) else (
    echo [OK] Dependências do Frontend já estão instaladas.
)

echo.
echo =========================================================================
echo [OK] Tudo preparado! Inicializando servidores em janelas dedicadas...
echo =========================================================================
echo.

:: 4. Iniciar Backend Server (Porta 5000)
echo [START] Iniciando Servidor API Backend (Porta 5000)...
start "🏛️ SGIP-RPPS: Backend API Server" cmd /k "cd backend && npm run dev"

:: 5. Iniciar Agente Desktop Scanner Bridge (Porta 5050)
echo [START] Iniciando Agente Local do Scanner (Porta 5050)...
start "🔌 SGIP-RPPS: Scanner Agent" cmd /k "cd backend && npm run agent"

:: 6. Iniciar Frontend Server (Porta 3000)
echo [START] Iniciando Servidor Web Frontend (Porta 3000)...
start "🖥️ SGIP-RPPS: Web Panel" cmd /k "cd frontend && npm run dev"

echo.
echo =========================================================================
echo ✅ PLATAFORMA INICIALIZADA COM SUCESSO!
echo =========================================================================
echo.
echo Em alguns instantes o painel será aberto automaticamente no seu navegador.
echo Se não abrir, acesse manualmente no Google Chrome:
echo 👉 http://localhost:3000
echo.
echo As credenciais de teste e manual detalhado estão em: README.md
echo.
echo Pressione qualquer tecla para abrir o painel no navegador e fechar este console...
pause > nul

start http://localhost:3000
exit
