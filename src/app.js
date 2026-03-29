const express = require("express");
const cors = require("cors");

// Route imports (importaciones de rutas)
const generoRoutes = require("./routes/generoRoutes");
const directorRoutes = require("./routes/directorRoutes");
const productoraRoutes = require("./routes/productoraRoutes");
const tipoRoutes = require("./routes/tipoRoutes");
const mediaRoutes = require("./routes/mediaRoutes");

const app = express();

// Middlewares
app.use(cors()); // Activar Cross-Origin Resource Sharing para las peticiones que vienen del Frontend.
app.use(express.json()); // Parsear archivos JSON del cuerpo de la petición
app.use(express.urlencoded({ extended: true })); // Parsear URL-encoded del cuerpo de la petición a formato JSON.

// Routes (rutas)
app.use("/api/generos", generoRoutes);
app.use("/api/directores", directorRoutes);
app.use("/api/productoras", productoraRoutes);
app.use("/api/tipos", tipoRoutes);
app.use("/api/medias", mediaRoutes);

// Healthcheck para Railway/monitoreo
app.get("/health", (req, res) => {
  res.status(200).json({ status: "ok", uptime: process.uptime() });
});

// Directorio raiz (Root endpoint)
app.get("/", (req, res) => {
  res.json({
    ok: true,
    mensaje: "API REST - Películas y Series",
    version: "1.0.0",
    endpoints: {
      generos: "/api/generos",
      directores: "/api/directores",
      productoras: "/api/productoras",
      tipos: "/api/tipos",
      medias: "/api/medias",
    },
  });
});

// Error handler global
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ ok: false, mensaje: "Error interno del servidor" });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ ok: false, mensaje: "Ruta no encontrada" });
});

module.exports = app;
