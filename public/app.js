async function cargarPeliculas() {
  const res = await fetch("/api/peliculas");
  const peliculas = await res.json();
  const contenedor = document.getElementById("listaPeliculas");
  contenedor.innerHTML = peliculas.map(p => `
    <div class="card" data-id="${p._id}" data-tipo="pelicula">
      <h3>${p.nombre}</h3>
      <p><strong>Géneros:</strong> ${p.generos.join(", ")}</p>
      <p><strong>Año:</strong> ${p.anioEstreno}</p>
    </div>
  `).join("");
  activarCopiado();
}

async function cargarPeliculasEnFiltro() {
  const res = await fetch("/api/peliculas");
  const peliculas = await res.json();
  const select = document.getElementById("filtroPelicula");

  select.innerHTML = `<option value="">-- Todas --</option>`;

  peliculas.forEach(p => {
    const option = document.createElement("option");
    option.value = p._id;
    option.textContent = p.nombre;
    select.appendChild(option);
  });

  select.addEventListener("change", () => {
    const idPelicula = select.value;
    if (idPelicula) {
      cargarActoresPorPelicula(idPelicula);
    } else {
      cargarActores();
    }
  });
}

async function cargarActores() {
  const res = await fetch("/api/actores");
  const actores = await res.json();
  renderActores(actores);
}

async function cargarActoresPorPelicula(idPelicula) {
  const res = await fetch(`/api/actor/pelicula/${idPelicula}`);
  const actores = await res.json();
  renderActores(actores);
}

function renderActores(actores) {
  const contenedor = document.getElementById("listaActores");
  contenedor.innerHTML = actores.map(a => `
    <div class="card" data-id="${a._id}" data-tipo="actor">
      <h3>${a.nombre}</h3>
      <p><strong>Edad:</strong> ${a.edad}</p>
      <p><strong>Retirado:</strong> ${a.estaRetirado ? "Sí" : "No"}</p>
      <p><strong>Premios:</strong> ${a.premios.join(", ")}</p>
    </div>
  `).join("");
  activarCopiado();
}

function activarCopiado() {
  document.querySelectorAll(".card").forEach(card => {
    card.addEventListener("click", () => {
      const id = card.getAttribute("data-id");
      const tipo = card.getAttribute("data-tipo");
      navigator.clipboard.writeText(id).then(() => {
        mostrarToast(`ID de ${tipo} copiado`);
      }).catch(err => {
        console.error("Error al copiar ID:", err);
      });
    });
  });
}

function mostrarToast(mensaje) {
  const toast = document.createElement("div");
  toast.className = "toast";
  toast.textContent = mensaje;
  document.body.appendChild(toast);
  setTimeout(() => {
    toast.remove();
  }, 2000);
}

cargarPeliculas();
cargarPeliculasEnFiltro();
cargarActores();
