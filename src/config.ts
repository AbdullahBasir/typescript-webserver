import type { MigrationConfig } from "drizzle-orm/migrator";

type Config = {
  api: APIConfig;
  db: DBConfig;
};

type APIConfig = {
  fileserverHits: number;
  port: number;
};

type DBConfig = {
  url: string;
  migrationConfig: MigrationConfig;
}

process.loadEnvFile();

const envOrThrow = (key: string) => {
  const value = process.env[key];
  if (!value) {
    throw new Error(`environment variable ${key} not set`);
  }
  return value;
}

const parsedPort = parseInt(envOrThrow("PORT"), 10);
const migrationConfig: MigrationConfig = {
  migrationsFolder: "./src/db/migrations",
}

export const config: Config = {
  api: {
    fileserverHits: 0,
    port: parsedPort,
  },
  db: {
    url: envOrThrow("DB_URL"),
    migrationConfig: migrationConfig,
  },
};
