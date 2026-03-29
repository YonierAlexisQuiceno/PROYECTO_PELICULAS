const express = require("express");
const router = express.Router();
const {
  getGeneros,
  getGenerosActivos,
  getGeneroById,
  createGenero,
  updateGenero,
  deleteGenero,
} = require("../controllers/generoController");

router.get("/", getGeneros);
router.get("/activos", getGenerosActivos);
router.get("/:id", getGeneroById);
router.post("/", createGenero);
router.put("/:id", updateGenero);
router.delete("/:id", deleteGenero);

module.exports = router;
