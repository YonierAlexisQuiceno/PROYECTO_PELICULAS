const Tipo = require("../models/Tipo");

// GET todos los tipos
const getTipos = async (req, res) => {
  try {
    const tipos = await Tipo.find().sort({ fechaCreacion: -1 });
    res.json({ ok: true, data: tipos });
  } catch (error) {
    res.status(500).json({ ok: false, mensaje: error.message });
  }
};

// GET tipo por ID
const getTipoById = async (req, res) => {
  try {
    const tipo = await Tipo.findById(req.params.id);
    if (!tipo) {
      return res.status(404).json({ ok: false, mensaje: "Tipo no encontrado" });
    }
    res.json({ ok: true, data: tipo });
  } catch (error) {
    res.status(500).json({ ok: false, mensaje: error.message });
  }
};

// POST crear tipo
const createTipo = async (req, res) => {
  try {
    const { nombre, descripcion } = req.body;
    const tipo = new Tipo({ nombre, descripcion });
    const tipoGuardado = await tipo.save();
    res.status(201).json({ ok: true, data: tipoGuardado });
  } catch (error) {
    res.status(400).json({ ok: false, mensaje: error.message });
  }
};

// PUT actualizar tipo
const updateTipo = async (req, res) => {
  try {
    const { nombre, descripcion } = req.body;
    const tipo = await Tipo.findByIdAndUpdate(
      req.params.id,
      { nombre, descripcion },
      { new: true, runValidators: true },
    );
    if (!tipo) {
      return res.status(404).json({ ok: false, mensaje: "Tipo no encontrado" });
    }
    res.json({ ok: true, data: tipo });
  } catch (error) {
    res.status(400).json({ ok: false, mensaje: error.message });
  }
};

// DELETE tipo
const deleteTipo = async (req, res) => {
  try {
    const tipo = await Tipo.findByIdAndDelete(req.params.id);
    if (!tipo) {
      return res.status(404).json({ ok: false, mensaje: "Tipo no encontrado" });
    }
    res.json({ ok: true, mensaje: "Tipo eliminado correctamente", data: tipo });
  } catch (error) {
    res.status(500).json({ ok: false, mensaje: error.message });
  }
};

module.exports = {
  getTipos,
  getTipoById,
  createTipo,
  updateTipo,
  deleteTipo,
};
