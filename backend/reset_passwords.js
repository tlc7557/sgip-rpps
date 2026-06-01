const { Client } = require('pg');
const bcrypt = require('bcryptjs');
const fs = require('fs');
const path = require('path');
const sqlite3 = require('sqlite3');

async function run() {
  console.log("🚀 Iniciando atualização/sincronização de senhas para 'previdencia123'...");

  // 1. Gerar o hash correto usando o bcryptjs
  const plainPassword = "previdencia123";
  const salt = await bcrypt.genSalt(10);
  const correctHash = await bcrypt.hash(plainPassword, salt);
  console.log(`✅ Hash Bcrypt gerado com sucesso: ${correctHash}`);

  // 2. Obter a string de conexão salva no .env do PostgreSQL
  let pgUrl = null;
  const envPath = path.join(__dirname, '.env');
  if (fs.existsSync(envPath)) {
    const envContent = fs.readFileSync(envPath, 'utf8');
    const match = envContent.match(/DATABASE_URL=(.+)/);
    if (match) pgUrl = match[1].trim();
  }

  if (pgUrl) {
    console.log("🔌 Conectando ao PostgreSQL...");
    const client = new Client({ connectionString: pgUrl });
    try {
      await client.connect();
      
      // Atualizar todos os usuários seeded para a senha 'previdencia123'
      const res = await client.query("UPDATE usuarios SET senha = $1", [correctHash]);
      console.log(`✅ Senhas atualizadas com sucesso no PostgreSQL! Linhas afetadas: ${res.rowCount}`);
    } catch (err) {
      console.error("❌ Erro ao atualizar senhas no PostgreSQL:", err.message);
    } finally {
      await client.end();
    }
  } else {
    console.log("ℹ️ Nenhuma configuração de PostgreSQL encontrada no .env.");
  }

  // 3. Atualizar também no SQLite local para manter a paridade
  const sqlitePath = path.join(__dirname, 'sgip_previdencia.db');
  if (fs.existsSync(sqlitePath)) {
    console.log("🔌 Conectando ao SQLite local...");
    const db = new sqlite3.Database(sqlitePath);
    db.run("UPDATE usuarios SET senha = ?", [correctHash], function(err) {
      if (err) {
        console.error("❌ Erro ao atualizar senhas no SQLite:", err.message);
      } else {
        console.log(`✅ Senhas atualizadas com sucesso no SQLite! Linhas afetadas: ${this.changes}`);
      }
      db.close();
    });
  }
}

run();
