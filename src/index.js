// Forzar Google DNS para resolver los hostnames de MongoDB Atlas
require("dns").setServers(["8.8.8.8", "1.1.1.1"]);

// Cargar variables de entorno

require("dotenv").config();
const app = require("./app");
const connectDB = require("./database/connection");

const PORT = process.env.PORT;

// Conectar a la base de datos y luego iniciar el servidor
connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto ${PORT}`);
  });
});
