import { ObjectId } from "mongodb";
import { connectDB } from "../common/db.js";
import { Actor } from "./actor.js";

const DB_NAME = process.env.DB_NAME || "cine-db";
const COLLECTION_NAME = "actores";
export let actorCollection;

// Inicia
(async () => {
  const db = await connectDB();
  actorCollection = db.collection(COLLECTION_NAME);
})();

// Crear
export function handleInsertActorRequest(req, res) {
  const { nombrePelicula, nombre, edad, estaRetirado, premios } = req.body;
  if (!nombrePelicula || !nombre || typeof edad !== "number" || typeof estaRetirado !== "boolean" || !Array.isArray(premios)) {
    return res.status(400).json({ error: "Datos inválidos" });
  }

  connectDB()
    .then(db => db.collection("peliculas").findOne({ nombre: nombrePelicula }))
    .then(pelicula => {
      if (!pelicula) return res.status(404).json({ error: "Película no encontrada" });

      const nuevoActor = new Actor({
        idPelicula: pelicula._id.toString(),
        nombre,
        edad,
        estaRetirado,
        premios
      });

      actorCollection.insertOne(nuevoActor)
        .then(() => res.status(201).json(nuevoActor))
        .catch(error => res.status(500).json({ error: error.message }));
    })
    .catch(error => res.status(500).json({ error: error.message }));
}

// Listar
export function handleGetActoresRequest(req, res) {
  actorCollection.find({}).toArray()
    .then(actores => res.status(200).json(actores))
    .catch(error => res.status(500).json({ error: error.message }));
}

// Buscar
export function handleGetActorByIdRequest(req, res) {
  const { id } = req.params;
  if (!ObjectId.isValid(id)) {
    return res.status(400).json({ error: "Id mal formado" });
  }

  actorCollection.findOne({ _id: new ObjectId(id) })
    .then(actor => {
      if (!actor) return res.status(404).json({ error: "No encontrado" });
      res.status(200).json(actor);
    })
    .catch(error => res.status(500).json({ error: error.message }));
}

// Filtrar
export function handleGetActoresByPeliculaIdRequest(req, res) {
  const { pelicula } = req.params;
  if (!ObjectId.isValid(pelicula)) {
    return res.status(400).json({ error: "Id de película mal formado" });
  }

  actorCollection.find({ idPelicula: pelicula }).toArray()
    .then(actores => res.status(200).json(actores))
    .catch(error => res.status(500).json({ error: error.message }));
}

// Eliminar
export function handleDeleteActorRequest(req, res) {
  const { id } = req.params;
  if (!ObjectId.isValid(id)) {
    return res.status(400).json({ error: "Id mal formado" });
  }

  actorCollection.deleteOne({ _id: new ObjectId(id) })
    .then(resultado => {
      if (resultado.deletedCount === 0) {
        return res.status(404).json({ error: "Actor no encontrado" });
      }
      res.status(200).json({ mensaje: "Actor eliminado correctamente" });
    })
    .catch(error => res.status(500).json({ error: error.message }));
}
