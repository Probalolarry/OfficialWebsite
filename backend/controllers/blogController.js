import asyncHandler from "express-async-handler";
import Blog from "../models/blogModel.js";

/* PUBLIC: list published posts */
export const listPublishedBlogs = asyncHandler(async (req, res) => {
  const { page = 1, limit = 12, tag = "" } = req.query;
  const q = { status: "published", ...(tag ? { tags: tag } : {}) };
  const skip = (+page - 1) * +limit;
  const total = await Blog.countDocuments(q);
  const blogs = await Blog.find(q)
    .sort("-publishedAt")
    .skip(skip)
    .limit(+limit)
    .populate("author", "firstName lastName profileImage");
  res.json({ blogs, total, page: +page, pages: Math.ceil(total / +limit) });
});

/* PUBLIC: get single published post by slug */
export const getBlogBySlug = asyncHandler(async (req, res) => {
  const blog = await Blog.findOne({
    slug: req.params.slug,
    status: "published",
  }).populate("author", "firstName lastName profileImage");
  if (!blog) {
    res.status(404);
    throw new Error("Post not found");
  }
  res.json(blog);
});

/* ADMIN: list all (incl. drafts) */
export const listAllBlogs = asyncHandler(async (req, res) => {
  const { page = 1, limit = 50, status = "" } = req.query;
  const q = status ? { status } : {};
  const skip = (+page - 1) * +limit;
  const total = await Blog.countDocuments(q);
  const blogs = await Blog.find(q)
    .sort("-createdAt")
    .skip(skip)
    .limit(+limit)
    .populate("author", "firstName lastName");
  res.json({ blogs, total, page: +page, pages: Math.ceil(total / +limit) });
});

/* ADMIN: get any post by id (for editing) */
export const getBlogById = asyncHandler(async (req, res) => {
  const blog = await Blog.findById(req.params.id).populate(
    "author",
    "firstName lastName"
  );
  if (!blog) {
    res.status(404);
    throw new Error("Post not found");
  }
  res.json(blog);
});

/* ADMIN: create */
export const createBlog = asyncHandler(async (req, res) => {
  const { title, excerpt, body, coverImage, tags, status } = req.body;
  if (!title || !title.trim()) {
    res.status(400);
    throw new Error("Title is required");
  }
  const blog = await Blog.create({
    title: title.trim(),
    excerpt: excerpt || "",
    body: body || "",
    coverImage: coverImage || "",
    tags: Array.isArray(tags) ? tags : [],
    status: status === "published" ? "published" : "draft",
    author: req.user._id,
  });
  res.status(201).json(blog);
});

/* ADMIN: update */
export const updateBlog = asyncHandler(async (req, res) => {
  const blog = await Blog.findById(req.params.id);
  if (!blog) {
    res.status(404);
    throw new Error("Post not found");
  }
  const fields = ["title", "excerpt", "body", "coverImage"];
  fields.forEach((f) => {
    if (req.body.hasOwnProperty(f)) blog[f] = req.body[f];
  });
  if (Array.isArray(req.body.tags)) blog.tags = req.body.tags;
  if (req.body.status === "draft" || req.body.status === "published") {
    if (req.body.status === "published" && blog.status !== "published") {
      blog.publishedAt = new Date();
    }
    blog.status = req.body.status;
  }
  const saved = await blog.save();
  res.json(saved);
});

/* ADMIN: delete */
export const deleteBlog = asyncHandler(async (req, res) => {
  const blog = await Blog.findById(req.params.id);
  if (!blog) {
    res.status(404);
    throw new Error("Post not found");
  }
  await blog.deleteOne();
  res.json({ message: "Post removed" });
});
