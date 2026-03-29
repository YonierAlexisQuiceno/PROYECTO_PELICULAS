const Media = require("../models/Media");
const Genero = require("../models/Genero");
const Director = require("../models/Director");
const Productora = require("../models/Productora");
const Tipo = require("../models/Tipo");

// GET todos los media (populated)
const getMedias = async (req, res) => {
  try {
    const medias = await Media.find()
      .populate("genero", "nombre estado")
      .populate("director", "nombres estado")
      .populate("productora", "nombre estado")
      .populate("tipo", "nombre")
      .sort({ fechaCreacion: -1 }); // Ordenar por fecha de creación
    res.json({ ok: true, data: medias });
  } catch (error) {
    res.status(500).json({ ok: false, mensaje: error.message });
  }
};

// GET media por ID (populated)
const getMediaById = async (req, res) => {
  try {
    const media = await Media.findById(req.params.id)
      .populate("genero", "nombre estado")
      .populate("director", "nombres estado")
      .populate("productora", "nombre estado")
      .populate("tipo", "nombre");
    if (!media) {
      return res
        .status(404)
        .json({ ok: false, mensaje: "Media no encontrada" });
    }
    res.json({ ok: true, data: media });
  } catch (error) {
    res.status(500).json({ ok: false, mensaje: error.message });
  }
};

// POST crear media (valida que el género, director y productora estén Activos)
// Acepta nombres en lugar de ObjectIds para genero, director, productora y tipo
const createMedia = async (req, res) => {
  try {
    const {
      serial,
      titulo,
      sinopsis,
      url,
      imagenPortada,
      anioEstreno,
      genero,
      director,
      productora,
      tipo,
    } = req.body;

    // Validar que el género esté Activo (buscar por nombre)
    const generoDoc = await Genero.findOne({ nombre: genero });
    if (!generoDoc)
      return res
        .status(404)
        .json({ ok: false, mensaje: `Género "${genero}" no encontrado` });
    if (generoDoc.estado !== "Activo")
      return res
        .status(400)
        .json({ ok: false, mensaje: "El género seleccionado no está Activo" });

    // Validar que el director esté Activo (buscar por nombres)
    const directorDoc = await Director.findOne({ nombres: director });
    if (!directorDoc)
      return res
        .status(404)
        .json({ ok: false, mensaje: `Director "${director}" no encontrado` });
    if (directorDoc.estado !== "Activo")
      return res.status(400).json({
        ok: false,
        mensaje: "El director seleccionado no está Activo",
      });

    // Validar que la productora esté Activa (buscar por nombre)
    const productoraDoc = await Productora.findOne({ nombre: productora });
    if (!productoraDoc)
      return res.status(404).json({
        ok: false,
        mensaje: `Productora "${productora}" no encontrada`,
      });
    if (productoraDoc.estado !== "Activo")
      return res.status(400).json({
        ok: false,
        mensaje: "La productora seleccionada no está Activa",
      });

    // Validar que el tipo exista (buscar por nombre)
    const tipoDoc = await Tipo.findOne({ nombre: tipo });
    if (!tipoDoc)
      return res
        .status(404)
        .json({ ok: false, mensaje: `Tipo "${tipo}" no encontrado` });

    const media = new Media({
      serial,
      titulo,
      sinopsis,
      url,
      imagenPortada,
      anioEstreno,
      genero: generoDoc._id,
      director: directorDoc._id,
      productora: productoraDoc._id,
      tipo: tipoDoc._id,
    });
    const mediaGuardada = await media.save();

    const mediaPopulada = await mediaGuardada.populate([
      { path: "genero", select: "nombre estado" },
      { path: "director", select: "nombres estado" },
      { path: "productora", select: "nombre estado" },
      { path: "tipo", select: "nombre" },
    ]);

    res.status(201).json({ ok: true, data: mediaPopulada });
  } catch (error) {
    res.status(400).json({ ok: false, mensaje: error.message });
  }
};

// PUT actualizar media (valida que el género, director y productora estén Activos)
// Acepta nombres en lugar de ObjectIds para genero, director, productora y tipo
const updateMedia = async (req, res) => {
  try {
    const {
      serial,
      titulo,
      sinopsis,
      url,
      imagenPortada,
      anioEstreno,
      genero,
      director,
      productora,
      tipo,
    } = req.body;

    const updateData = {
      serial,
      titulo,
      sinopsis,
      url,
      imagenPortada,
      anioEstreno,
    };

    // Validar que el género esté Activo (si se proporciona)
    if (genero) {
      const generoDoc = await Genero.findOne({ nombre: genero });
      if (!generoDoc)
        return res
          .status(404)
          .json({ ok: false, mensaje: `Género "${genero}" no encontrado` });
      if (generoDoc.estado !== "Activo")
        return res.status(400).json({
          ok: false,
          mensaje: "El género seleccionado no está Activo",
        });
      updateData.genero = generoDoc._id;
    }

    // Validar que el director esté Activo (si se proporciona)
    if (director) {
      const directorDoc = await Director.findOne({ nombres: director });
      if (!directorDoc)
        return res
          .status(404)
          .json({ ok: false, mensaje: `Director "${director}" no encontrado` });
      if (directorDoc.estado !== "Activo")
        return res.status(400).json({
          ok: false,
          mensaje: "El director seleccionado no está Activo",
        });
      updateData.director = directorDoc._id;
    }

    // Validar que la productora esté Activa (si se proporciona)
    if (productora) {
      const productoraDoc = await Productora.findOne({ nombre: productora });
      if (!productoraDoc)
        return res.status(404).json({
          ok: false,
          mensaje: `Productora "${productora}" no encontrada`,
        });
      if (productoraDoc.estado !== "Activo")
        return res.status(400).json({
          ok: false,
          mensaje: "La productora seleccionada no está Activa",
        });
      updateData.productora = productoraDoc._id;
    }

    // Validar que el tipo exista (si se proporciona)
    if (tipo) {
      const tipoDoc = await Tipo.findOne({ nombre: tipo });
      if (!tipoDoc)
        return res
          .status(404)
          .json({ ok: false, mensaje: `Tipo "${tipo}" no encontrado` });
      updateData.tipo = tipoDoc._id;
    }

    const media = await Media.findByIdAndUpdate(req.params.id, updateData, {
      new: true, // Devuelve la media o documento actualizado
      runValidators: true, // Valida los campos antes de guardar
    })
      .populate("genero", "nombre estado")
      .populate("director", "nombres estado")
      .populate("productora", "nombre estado")
      .populate("tipo", "nombre");

    if (!media) {
      return res
        .status(404)
        .json({ ok: false, mensaje: "Media no encontrada" });
    }

    res.json({ ok: true, data: media });
  } catch (error) {
    res.status(400).json({ ok: false, mensaje: error.message });
  }
};

// DELETE media por ID
const deleteMedia = async (req, res) => {
  try {
    const media = await Media.findByIdAndDelete(req.params.id);
    if (!media) {
      return res
        .status(404)
        .json({ ok: false, mensaje: "Media no encontrada" });
    }
    res.json({
      ok: true,
      mensaje: "Media eliminada correctamente",
      data: media,
    });
  } catch (error) {
    res.status(500).json({ ok: false, mensaje: error.message });
  }
};

module.exports = {
  getMedias,
  getMediaById,
  createMedia,
  updateMedia,
  deleteMedia,
};
