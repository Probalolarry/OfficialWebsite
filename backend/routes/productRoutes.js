// routes/productRoutes.js
import express from "express";
import multer from "multer";
import {
  createProduct,
  updateProduct,
  deleteProduct,
  getProducts,
  getProduct,
  getBrands,
  getCategories,
  getBaseSpecs,
  bulkCreateProduct,
  getGroupedStock,
  transferProducts
} from "../controllers/productController.js";
import { protect, allowRoles, protectSoft, isInventory } from "../middleware/authMiddleware.js";

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

router
  .route("/")
  .get(protectSoft, getProducts) //  ← LIST
  .post(protect, upload.array("images", 10), createProduct);

router.get("/grouped", protect, getGroupedStock); // 👈 New route

router.get("/brands", getBrands);
router.get("/categories", getCategories);
router.post("/bulk", protect, bulkCreateProduct);
router.post("/transfer", protect, allowRoles("Admin"), transferProducts);

router
  .route("/:id")
  .get(getProduct) //  ← SINGLE
  .put(protect, isInventory, upload.array("images", 10), updateProduct)
  .delete(protect, isInventory, deleteProduct);

router.get("/:id/base-specs", protect, getBaseSpecs);

export default router;
