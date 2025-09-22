// El conector con el .env
import { MongoClient, ServerApiVersion } from "mongodb";
import dotenv from "dotenv";

dotenv.config();

const uri = process.env.MONGODB_URI;
const dbName = process.env.DB_NAME || "cine-db";

if (!uri) {
  throw new Error("Falta MONGODB_URI en el archivo .env");
}

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true
  }
});

let dbInstance = null;

export async function connectDB() {
  if (dbInstance) return dbInstance;
  await client.connect();
  dbInstance = client.db(dbName);
  return dbInstance;
}
