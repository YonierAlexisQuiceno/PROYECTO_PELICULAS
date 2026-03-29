const mongoose = require("mongoose");

const directorSchema = new mongoose.Schema(
  {
    nombres: {
      type: String,
      required: [true, "El nombre del director es obligatorio"],
      trim: true,
    },
    estado: {
      type: String,
      enum: ["Activo", "Inactivo"],
      default: "Activo",
    },
    fechaActualizacion: {
      type: Date,
    },
  },
  {
    timestamps: { createdAt: "fechaCreacion", updatedAt: "fechaActualizacion" },
  },
);

module.exports = mongoose.model("Director", directorSchema);
