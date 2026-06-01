import { Client } from 'pg';
import sqlite3 from 'sqlite3';
import fs from 'fs';
import path from 'path';

export interface DatabaseConnection {
  query(sql: string, params?: any[]): Promise<any[]>;
  execute(sql: string, params?: any[]): Promise<void>;
  close(): Promise<void>;
  isSqlite: boolean;
}

let activeDb: DatabaseConnection;

class PostgresConnection implements DatabaseConnection {
  private client: Client;
  isSqlite = false;

  constructor(connectionString: string) {
    this.client = new Client({ connectionString });
  }

  async connect() {
    await this.client.connect();
  }

  async query(sql: string, params?: any[]): Promise<any[]> {
    // Converter queries SQLite '?1, ?2' para PostgreSQL '$1, $2' caso necessário
    let pgSql = sql;
    if (params && params.length > 0) {
      let count = 1;
      pgSql = sql.replace(/\?/g, () => `$${count++}`);
    }
    const res = await this.client.query(pgSql, params);
    return res.rows;
  }

  async execute(sql: string, params?: any[]): Promise<void> {
    await this.query(sql, params);
  }

  async close(): Promise<void> {
    await this.client.end();
  }
}

class SqliteConnection implements DatabaseConnection {
  private db: sqlite3.Database;
  isSqlite = true;

  constructor(filePath: string) {
    this.db = new sqlite3.Database(filePath);
  }

  query(sql: string, params?: any[]): Promise<any[]> {
    return new Promise((resolve, reject) => {
      // Ajustar sintaxe SQL caso contenha tipos do Postgres como SERIAL ou TIMESTAMP
      let cleanSql = sql
        .replace(/SERIAL PRIMARY KEY/gi, "INTEGER PRIMARY KEY AUTOINCREMENT")
        .replace(/TIMESTAMP DEFAULT CURRENT_TIMESTAMP/gi, "DATETIME DEFAULT CURRENT_TIMESTAMP")
        .replace(/CURRENT_DATE/gi, "date('now')")
        .replace(/VARCHAR\(\d+\)/gi, "TEXT")
        .replace(/NUMERIC\(\d+,\s*\d+\)/gi, "REAL")
        .replace(/BOOLEAN DEFAULT TRUE/gi, "INTEGER DEFAULT 1")
        .replace(/BOOLEAN DEFAULT FALSE/gi, "INTEGER DEFAULT 0")
        .replace(/ON DELETE SET NULL/gi, "") // SQLite simplificações
        .replace(/ON DELETE CASCADE/gi, "");

      this.db.all(cleanSql, params || [], (err, rows) => {
        if (err) reject(err);
        else resolve(rows as any[]);
      });
    });
  }

  execute(sql: string, params?: any[]): Promise<void> {
    return new Promise((resolve, reject) => {
      let cleanSql = sql
        .replace(/SERIAL PRIMARY KEY/gi, "INTEGER PRIMARY KEY AUTOINCREMENT")
        .replace(/TIMESTAMP DEFAULT CURRENT_TIMESTAMP/gi, "DATETIME DEFAULT CURRENT_TIMESTAMP")
        .replace(/CURRENT_DATE/gi, "date('now')")
        .replace(/VARCHAR\(\d+\)/gi, "TEXT")
        .replace(/NUMERIC\(\d+,\s*\d+\)/gi, "REAL")
        .replace(/BOOLEAN DEFAULT TRUE/gi, "INTEGER DEFAULT 1")
        .replace(/BOOLEAN DEFAULT FALSE/gi, "INTEGER DEFAULT 0")
        .replace(/ON DELETE SET NULL/gi, "")
        .replace(/ON DELETE CASCADE/gi, "");

      this.db.run(cleanSql, params || [], (err) => {
        if (err) reject(err);
        else resolve();
      });
    });
  }

  close(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.db.close((err) => {
        if (err) reject(err);
        else resolve();
      });
    });
  }

  async runMultipleStatements(sqlFileContent: string) {
    // Remover comentários SQL
    const cleanSql = sqlFileContent
      .split('\n')
      .filter(line => !line.trim().startsWith('--'))
      .join('\n');

    // Separar por comandos individuais terminados em ';'
    const statements = cleanSql.split(';').map(s => s.trim()).filter(s => s.length > 0);
    for (const statement of statements) {
      try {
        await this.execute(statement);
      } catch (e) {
        // Ignorar erros de DROP TABLE na inicialização
        if (!statement.toUpperCase().startsWith("DROP TABLE")) {
          console.error("Erro ao rodar instrução SQLite:", statement, e);
        }
      }
    }
  }
}

export async function getDatabase(): Promise<DatabaseConnection> {
  if (activeDb) return activeDb;

  let pgUrl = process.env.DATABASE_URL;
  if (!pgUrl) {
    const envPath = path.join(__dirname, '..', '.env');
    if (fs.existsSync(envPath)) {
      const envContent = fs.readFileSync(envPath, 'utf8');
      const match = envContent.match(/DATABASE_URL=(.+)/);
      if (match) pgUrl = match[1].trim();
    }
  }
  if (!pgUrl) {
    pgUrl = "postgresql://postgres:postgres@localhost:5432/sgip_rpps";
  }

  try {
    console.log("🔌 Tentando conectar ao banco de dados PostgreSQL...");
    const pgConn = new PostgresConnection(pgUrl);
    await pgConn.connect();
    console.log("✅ Conectado com sucesso ao PostgreSQL!");
    activeDb = pgConn;
    return activeDb;
  } catch (err) {
    console.warn("⚠️ Não foi possível conectar ao PostgreSQL. Ativando fallback resiliente do SQLite...");
    
    const sqlitePath = path.join(__dirname, '..', 'sgip_previdencia.db');
    const isNewDb = !fs.existsSync(sqlitePath);
    
    const sqliteConn = new SqliteConnection(sqlitePath);
    activeDb = sqliteConn;

    if (isNewDb) {
      console.log("⚙️ Banco SQLite limpo detectado. Construindo tabelas e semeando dados iniciais...");
      try {
        const schemaPath = path.join(__dirname, '..', '..', 'database', 'schema.sql');
        const seedPath = path.join(__dirname, '..', '..', 'database', 'seed.sql');

        if (fs.existsSync(schemaPath)) {
          const schemaSql = fs.readFileSync(schemaPath, 'utf8');
          await sqliteConn.runMultipleStatements(schemaSql);
          console.log("📚 Tabelas criadas com sucesso no SQLite!");
        }

        if (fs.existsSync(seedPath)) {
          const seedSql = fs.readFileSync(seedPath, 'utf8');
          await sqliteConn.runMultipleStatements(seedSql);
          console.log("🌱 Massa de testes semeada com sucesso no SQLite!");
        }
      } catch (dbInitErr) {
        console.error("❌ Falha crítica ao inicializar banco de dados SQLite:", dbInitErr);
      }
    } else {
      console.log("📂 Carregando banco SQLite existente:", sqlitePath);
    }

    return activeDb;
  }
}
