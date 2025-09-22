// Modelo de datos DB para actores
import { ObjectId } from "mongodb";

export class Actor {
  constructor({ idPelicula, nombre, edad, estaRetirado, premios }) {
    this._id = new ObjectId();
    this.idPelicula = idPelicula;
    this.nombre = nombre;
    this.edad = edad;
    this.estaRetirado = estaRetirado;
    this.premios = premios;
  }
}
