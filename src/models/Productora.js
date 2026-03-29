const mongoose = require("mongoose");

const productoraSchema = new mongoose.Schema(
  {
    nombre: {
      type: String,
      required: [true, "El nombre de la productora es obligatorio"],
      trim: true,
    },
    estado: {
      type: String,
      enum: ["Activo", "Inactivo"],
      default: "Activo",
    },
    slogan: {
      type: String,
      trim: true,
    },
    descripcion: {
      type: String,
      trim: true,
    },
    fechaActualizacion: {
      type: Date,
    },
  },
  {
    timestamps: { createdAt: "fechaCreacion", updatedAt: "fechaActualizacion" },
  },
);

module.exports = mongoose.model("Productora", productoraSchema);
