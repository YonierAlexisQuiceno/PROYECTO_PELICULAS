const express = require("express");
const router = express.Router();
const {
  getProductoras,
  getProductorasActivas,
  getProductoraById,
  createProductora,
  updateProductora,
  deleteProductora,
} = require("../controllers/productoraController");

router.get("/", getProductoras);
router.get("/activas", getProductorasActivas);
router.get("/:id", getProductoraById);
router.post("/", createProductora);
router.put("/:id", updateProductora);
router.delete("/:id", deleteProductora);

module.exports = router;
