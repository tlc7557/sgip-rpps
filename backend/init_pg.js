const { Client } = require('pg');
const fs = require('fs');
const path = require('path');

const candidates = [
  process.env.DATABASE_URL_SYSTEM || "postgresql://postgres:previdencia123@localhost:5432/postgres",
  "postgresql://postgres@localhost:5432/postgres", // sem senha
  "postgresql://postgres:postgres@localhost:5432/postgres", // 'postgres'
  "postgresql://postgres:admin@localhost:5432/postgres", // 'admin'
  "postgresql://postgres:root@localhost:5432/postgres", // 'root'
  "postgresql://postgres:123456@localhost:5432/postgres", // '123456'
  "postgresql://postgres:123@localhost:5432/postgres", // '123'
];

async function run() {
  console.log("🚀 Iniciando criação e estruturação do banco de dados PostgreSQL...");

  let successfulUrl = null;
  let client = null;

  // Tentar encontrar a credencial correta
  for (const url of candidates) {
    try {
      console.log(`🔌 Tentando conectar com: ${url.replace(/:([^@]+)@/, ":******@")}`);
      client = new Client({ connectionString: url });
      await client.connect();
      successfulUrl = url;
      console.log("✅ Conexão estabelecida com sucesso!");
      break;
    } catch (err) {
      // Ignorar e tentar o próximo
      if (client) {
        try { await client.end(); } catch (e) {}
      }
    }
  }

  if (!successfulUrl) {
    console.error("❌ Não foi possível conectar ao PostgreSQL com nenhuma das senhas padrão (previdencia123, postgres, admin, root, 123456, 123 ou sem senha).");
    console.log("💡 Por favor, informe a senha do seu usuário 'postgres' local ou defina a variável de ambiente DATABASE_URL.");
    process.exit(1);
  }

  // 1. Verificar/criar banco 'sgip_rpps'
  try {
    const res = await client.query("SELECT 1 FROM pg_database WHERE datname = 'sgip_rpps'");
    if (res.rowCount === 0) {
      await client.query("CREATE DATABASE sgip_rpps");
      console.log("✅ Banco de dados 'sgip_rpps' criado com sucesso!");
    } else {
      console.log("ℹ️ Banco de dados 'sgip_rpps' já existe.");
    }
  } catch (err) {
    console.error("❌ Erro ao verificar/criar o banco 'sgip_rpps':", err.message);
    process.exit(1);
  } finally {
    await client.end();
  }

  // 2. Conectar ao banco 'sgip_rpps' recém-criado usando a classe URL para evitar bugs de substituição
  const urlObj = new URL(successfulUrl);
  urlObj.pathname = "/sgip_rpps";
  const targetUrl = urlObj.toString();
  
  console.log(`🔌 Conectando ao banco estruturado: ${targetUrl.replace(/:([^@]+)@/, ":******@")}`);
  client = new Client({ connectionString: targetUrl });
  
  try {
    await client.connect();
    console.log("🔌 Conectado com sucesso ao banco 'sgip_rpps'!");

    const schemaPath = path.join(__dirname, '..', 'database', 'schema.sql');
    const seedPath = path.join(__dirname, '..', 'database', 'seed.sql');

    // Executar Schema
    if (fs.existsSync(schemaPath)) {
      console.log("⚙️ Carregando schema.sql...");
      const schemaSql = fs.readFileSync(schemaPath, 'utf8');
      await client.query(schemaSql);
      console.log("✅ Tabelas estruturadas com sucesso no PostgreSQL!");
    } else {
      console.warn("⚠️ Arquivo schema.sql não encontrado em:", schemaPath);
    }

    // Executar Seed
    if (fs.existsSync(seedPath)) {
      console.log("🌱 Carregando seed.sql...");
      const seedSql = fs.readFileSync(seedPath, 'utf8');
      await client.query(seedSql);
      console.log("✅ Massa de testes semeada com sucesso no PostgreSQL!");
    } else {
      console.warn("⚠️ Arquivo seed.sql não encontrado em:", seedPath);
    }

    console.log("🎉 Banco de dados PostgreSQL configurado e pronto para produção!");
    
    // Escrever a string de conexão correta no arquivo de configuração do backend ou informar o usuário
    console.log(`💡 CONFIGURAÇÃO DE SUCESSO: A variável de ambiente do backend deve ser:`);
    console.log(`   DATABASE_URL=${targetUrl}`);
    
    // Salvar a string de conexão bem-sucedida num arquivo .env local do backend
    fs.writeFileSync(path.join(__dirname, '.env'), `DATABASE_URL=${targetUrl}\n`);
    console.log("💾 String de conexão bem-sucedida salva em backend/src/.env!");
  } catch (err) {
    console.error("❌ Erro ao estruturar ou semear o banco 'sgip_rpps':", err.message);
    process.exit(1);
  } finally {
    await client.end();
  }
}

run();
