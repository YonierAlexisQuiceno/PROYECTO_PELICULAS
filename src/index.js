// Forzar Google DNS para resolver los hostnames de MongoDB Atlas
require("dns").setServers(["8.8.8.8", "1.1.1.1"]);

// Cargar variables de entorno
require("dotenv").config();

const app = require("./app");
const connectDB = require("./database/connection");

const PORT = process.env.PORT || 3000;

// Conectar a la base de datos y luego iniciar el servidor
connectDB().then(() => {
  const server = app.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto ${PORT}`);
    console.log(`Entorno: ${process.env.NODE_ENV || "development"}`);
  });

  // Graceful shutdown: cerrar conexiones al recibir señal de apagado
  const gracefulShutdown = (signal) => {
    console.log(`\n${signal} recibido. Cerrando servidor...`);
    server.close(() => {
      console.log("Servidor HTTP cerrado.");
      require("mongoose").connection.close(false, () => {
        console.log("Conexión a MongoDB cerrada.");
        process.exit(0);
      });
    });
  };

  process.on("SIGTERM", () => gracefulShutdown("SIGTERM"));
  process.on("SIGINT", () => gracefulShutdown("SIGINT"));
}).catch((err) => {
  console.error("No se pudo iniciar el servidor:", err.message);
  process.exit(1);
});
