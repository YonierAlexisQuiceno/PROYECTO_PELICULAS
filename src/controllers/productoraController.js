const Productora = require("../models/Productora");

// GET todas las productoras
const getProductoras = async (req, res) => {
  try {
    const productoras = await Productora.find().sort({ fechaCreacion: -1 });
    res.json({ ok: true, data: productoras });
  } catch (error) {
    res.status(500).json({ ok: false, mensaje: error.message });
  }
};

// GET solo las productoras activas
const getProductorasActivas = async (req, res) => {
  try {
    const productoras = await Productora.find({ estado: "Activo" }).sort({
      nombre: 1,
    });
    res.json({ ok: true, data: productoras });
  } catch (error) {
    res.status(500).json({ ok: false, mensaje: error.message });
  }
};

// GET productora por ID
const getProductoraById = async (req, res) => {
  try {
    const productora = await Productora.findById(req.params.id);
    if (!productora) {
      return res
        .status(404)
        .json({ ok: false, mensaje: "Productora no encontrada" });
    }
    res.json({ ok: true, data: productora });
  } catch (error) {
    res.status(500).json({ ok: false, mensaje: error.message });
  }
};

// POST crear productora
const createProductora = async (req, res) => {
  try {
    const { nombre, estado, slogan, descripcion } = req.body;
    const productora = new Productora({ nombre, estado, slogan, descripcion });
    const productoraGuardada = await productora.save();
    res.status(201).json({ ok: true, data: productoraGuardada });
  } catch (error) {
    res.status(400).json({ ok: false, mensaje: error.message });
  }
};

// PUT actualizar productora
const updateProductora = async (req, res) => {
  try {
    const { nombre, estado, slogan, descripcion } = req.body;
    const productora = await Productora.findByIdAndUpdate(
      req.params.id,
      { nombre, estado, slogan, descripcion },
      { new: true, runValidators: true },
    );
    if (!productora) {
      return res
        .status(404)
        .json({ ok: false, mensaje: "Productora no encontrada" });
    }
    res.json({ ok: true, data: productora });
  } catch (error) {
    res.status(400).json({ ok: false, mensaje: error.message });
  }
};

// DELETE productora
const deleteProductora = async (req, res) => {
  try {
    const productora = await Productora.findByIdAndDelete(req.params.id);
    if (!productora) {
      return res
        .status(404)
        .json({ ok: false, mensaje: "Productora no encontrada" });
    }
    res.json({
      ok: true,
      mensaje: "Productora eliminada correctamente",
      data: productora,
    });
  } catch (error) {
    res.status(500).json({ ok: false, mensaje: error.message });
  }
};

module.exports = {
  getProductoras,
  getProductorasActivas,
  getProductoraById,
  createProductora,
  updateProductora,
  deleteProductora,
};
