import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import { MongoClient, ServerApiVersion } from "mongodb";
import { peliculaRoutes } from "./src/pelicula/routes.js";
import { actorRoutes } from "./src/actor/routes.js";

dotenv.config();

const PORT = process.env.PORT || 3000;
const uri = process.env.MONGODB_URI;

if (!uri) {
  console.error("No se encontró MONGODB_URI en el archivo .env");
  process.exit(1);
}

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true
  }
});

const app = express();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Servir archivos estáticos desde el public para el maravilloso front end
app.use(express.static(path.join(__dirname, "public")));

// Rutas de API solicitadas por el trabajo perse
app.use("/api", peliculaRoutes);
app.use("/api", actorRoutes);

// Ruta raíz voy a poner index.html
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// Manejamos la conexión con el servidor
async function startServer() {
  try {
    await client.connect();
    console.log("enchufe funciona");

    app.listen(PORT, () => {
      console.log(`Servidor Express escuchando en http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("Error con el enchufe de atlas", error.message);
    process.exit(1);
  }
}

startServer();
