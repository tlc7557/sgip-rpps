import { getDatabase } from './database';

async function main() {
  try {
    const db = await getDatabase();
    console.log(`Conectado ao banco de dados. Modo SQLite: ${db.isSqlite}`);
    let querySql = "";
    if (db.isSqlite) {
      querySql = "SELECT name FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%';";
    } else {
      querySql = "SELECT table_name as name FROM information_schema.tables WHERE table_schema='public' ORDER BY table_name;";
    }
    
    const tables = await db.query(querySql);
    console.log("\n=== LISTA DE TABELAS ATIVAS NO BANCO DE DADOS ===");
    tables.forEach((t, i) => {
      console.log(`[${i + 1}] ${t.name}`);
    });
    
    await db.close();
  } catch (e) {
    console.error("Erro ao listar tabelas do banco:", e);
  }
}

main();
