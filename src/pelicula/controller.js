import { ObjectId } from "mongodb";
import { connectDB } from "../common/db.js";
import { Pelicula } from "./pelicula.js";

const DB_NAME = process.env.DB_NAME || "cine-db";
const COLLECTION_NAME = "peliculas";
export let peliculaCollection;

// Inicia
(async () => {
  const db = await connectDB();
  peliculaCollection = db.collection(COLLECTION_NAME);
})();
// Crear
export function handleInsertPeliculaRequest(req, res) {
  const { nombre, generos, anioEstreno } = req.body;
  if (!nombre || !Array.isArray(generos) || !Number.isInteger(anioEstreno)) {
    return res.status(400).json({ error: "Datos inválidos" });
  }

  const nuevaPelicula = new Pelicula({ nombre, generos, anioEstreno });

  peliculaCollection.insertOne(nuevaPelicula)
    .then(() => res.status(201).json(nuevaPelicula))
    .catch(error => res.status(500).json({ error: error.message }));
}
// Listar
export function handleGetPeliculasRequest(req, res) {
  peliculaCollection.find({}).toArray()
    .then(peliculas => res.status(200).json(peliculas))
    .catch(error => res.status(500).json({ error: error.message }));
}
// Buscar
export function handleGetPeliculaByIdRequest(req, res) {
  const { id } = req.params;
  if (!ObjectId.isValid(id)) {
    return res.status(400).json({ error: "Id mal formado" });
  }

  peliculaCollection.findOne({ _id: new ObjectId(id) })
    .then(pelicula => {
      if (!pelicula) return res.status(404).json({ error: "No encontrada" });
      res.status(200).json(pelicula);
    })
    .catch(error => res.status(500).json({ error: error.message }));
}
// Actualizar
export function handleUpdatePeliculaByIdRequest(req, res) {
  const { id } = req.params;
  if (!ObjectId.isValid(id)) {
    return res.status(400).json({ error: "Id mal formado" });
  }

  const { nombre, generos, anioEstreno } = req.body;
  const updateDoc = { $set: {} };
  if (nombre) updateDoc.$set.nombre = nombre;
  if (generos) updateDoc.$set.generos = generos;
  if (anioEstreno) updateDoc.$set.anioEstreno = anioEstreno;

  peliculaCollection.updateOne({ _id: new ObjectId(id) }, updateDoc)
    .then(result => {
      if (result.matchedCount === 0) return res.status(404).json({ error: "No encontrada" });
      res.status(200).json({ mensaje: "Película actualizada" });
    })
    .catch(error => res.status(500).json({ error: error.message }));
}
// Eliminar
export function handleDeletePeliculaByIdRequest(req, res) {
  const { id } = req.params;
  if (!ObjectId.isValid(id)) {
    return res.status(400).json({ error: "Id mal formado" });
  }

  peliculaCollection.deleteOne({ _id: new ObjectId(id) })
    .then(result => {
      if (result.deletedCount === 0) return res.status(404).json({ error: "No encontrada" });
      res.status(200).json({ mensaje: "Película eliminada" });
    })
    .catch(error => res.status(500).json({ error: error.message }));
}
