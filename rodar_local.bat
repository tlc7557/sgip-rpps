@echo off
:: Force working directory to be the physical folder of this bat file
cd /d "%~dp0"

title SGIP-RPPS: Inicializador Previdenciario

echo =========================================================================
echo       SGIP-RPPS: INICIALIZADOR OPERACIONAL DO INSTITUTO
echo =========================================================================
echo.
echo Este script ira preparar e rodar os servidores da plataforma localmente:
echo  1. Servidor de API Backend (Express/TypeScript) - Porta 5000 (SQLite)
echo  2. Agente REST Local do Digitalizador (Node.js) - Porta 5050 (Scanner Bridge)
echo  3. Painel Web Frontend React (Vite/TypeScript) - Porta 3000 (Web Panel)
echo.
echo =========================================================================
echo.

:: 1. Verificar instalacao do Node.js
where node >nul 2>nul
if %errorlevel% neq 0 (
    echo [ERROR] O Node.js nao foi encontrado no seu sistema.
    echo.
    echo [RESOLUCAO] Por favor:
    echo  1. Baixe e instale o Node.js v18 ou v20 em: https://nodejs.org
    echo  2. REINICIE o computador ou feche e abra o Windows Explorer.
    echo  3. Tente executar este arquivo .bat novamente.
    echo.
    pause
    exit /b 1
)

:: 2. Instalar dependencias do Backend (se necessario)
if not exist "backend\node_modules\" (
    echo [INFO] Instalando dependencias do BACKEND. Por favor, aguarde...
    cd backend
    call npm install
    if %errorlevel% neq 0 (
        echo [ERROR] Falha ao instalar dependencias do Backend.
        pause
        exit /b 1
    )
    cd ..
) else (
    echo [OK] Dependencias do Backend ja estao instaladas.
)

:: 3. Instalar dependencias do Frontend (se necessario)
if not exist "frontend\node_modules\" (
    echo [INFO] Instalando dependencias do FRONTEND. Por favor, aguarde...
    cd frontend
    call npm install
    if %errorlevel% neq 0 (
        echo [ERROR] Falha ao instalar dependencias do Frontend.
        pause
        exit /b 1
    )
    cd ..
) else (
    echo [OK] Dependencias do Frontend ja estao instaladas.
)

echo.
echo =========================================================================
echo [OK] Tudo preparado! Inicializando servidores em janelas dedicadas...
echo =========================================================================
echo.

:: 4. Iniciar Backend Server (Porta 5000)
echo [START] Iniciando Servidor API Backend (Porta 5000)...
start "SGIP-RPPS: Backend API Server" cmd /k "cd backend && npm run dev"

:: 5. Iniciar Agente Desktop Scanner Bridge (Porta 5050)
echo [START] Iniciando Agente Local do Scanner (Porta 5050)...
start "SGIP-RPPS: Scanner Agent" cmd /k "cd backend && npm run agent"

:: 6. Iniciar Frontend Server (Porta 3000)
echo [START] Iniciando Servidor Web Frontend (Porta 3000)...
start "SGIP-RPPS: Web Panel" cmd /k "cd frontend && npm run dev"

echo.
echo =========================================================================
echo PLATAFORMA INICIALIZADA COM SUCESSO!
echo =========================================================================
echo.
echo Em alguns instantes o painel sera aberto automaticamente no seu navegador.
echo Se nao abrir, acesse manualmente no seu navegador de preferencia:
echo http://localhost:3000
echo.
echo Pressione qualquer tecla para abrir o painel no navegador e fechar este console...
pause > nul

start http://localhost:3000
exit
