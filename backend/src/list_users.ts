import { getDatabase } from './database';

async function main() {
  try {
    const db = await getDatabase();
    console.log(`Conectado ao banco de dados. Modo SQLite: ${db.isSqlite}`);
    
    const users = await db.query("SELECT id, nome, cpf, email, senha, perfil, ativo, telefone FROM usuarios ORDER BY id;");
    console.log("\n=== USUÁRIOS E SENHAS (HASH BCRYPT) CADASTRADOS NO BANCO ===");
    users.forEach((u) => {
      console.log(`ID: ${u.id}`);
      console.log(`Nome: ${u.nome}`);
      console.log(`CPF: ${u.cpf}`);
      console.log(`E-mail: ${u.email}`);
      console.log(`Senha (Hash): ${u.senha}`);
      console.log(`Perfil: ${u.perfil}`);
      console.log(`Status: ${u.ativo ? 'ATIVO' : 'INATIVO'}`);
      console.log(`Telefone: ${u.telefone || 'Sem telefone'}`);
      console.log("-------------------------------------------------------------");
    });
    
    await db.close();
  } catch (e) {
    console.error("Erro ao listar usuários:", e);
  }
}

main();
