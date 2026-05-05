import express from "express";
import {
  listPublishedBlogs,
  getBlogBySlug,
  listAllBlogs,
  getBlogById,
  createBlog,
  updateBlog,
  deleteBlog,
} from "../controllers/blogController.js";
import { protect, isInventory } from "../middleware/authMiddleware.js";

const router = express.Router();

/* public */
router.get("/", listPublishedBlogs);
router.get("/slug/:slug", getBlogBySlug);

/* admin (Admin/Manager/Inventory) */
router.get("/admin/list", protect, isInventory, listAllBlogs);
router.get("/admin/:id", protect, isInventory, getBlogById);
router.post("/", protect, isInventory, createBlog);
router.put("/:id", protect, isInventory, updateBlog);
router.delete("/:id", protect, isInventory, deleteBlog);

export default router;
