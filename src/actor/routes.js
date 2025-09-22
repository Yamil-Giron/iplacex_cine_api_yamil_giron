import { Router } from "express";
import {
  handleInsertActorRequest,
  handleGetActoresRequest,
  handleGetActorByIdRequest,
  handleGetActoresByPeliculaIdRequest,
  handleDeleteActorRequest
} from "./controller.js";

export const actorRoutes = Router();

actorRoutes.post("/actor", handleInsertActorRequest);
actorRoutes.get("/actores", handleGetActoresRequest);
actorRoutes.get("/actor/:id", handleGetActorByIdRequest);
actorRoutes.get("/actor/pelicula/:pelicula", handleGetActoresByPeliculaIdRequest);
actorRoutes.delete("/actor/:id", handleDeleteActorRequest);