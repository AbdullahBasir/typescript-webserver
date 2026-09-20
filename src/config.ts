type APIConfig = {
  fileserverHits: number;
  dbUrl: string
};

process.loadEnvFile();

const envOrThrow = (key: string) => {
  const value = process.env[key];
  if (!value) {
    throw new Error(`environment variable ${key} not set`);
  }
  return value;
}

export const config: APIConfig = {
    fileserverHits: 0,
    dbUrl: envOrThrow("DB_URL"),
};