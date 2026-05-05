// backend/middleware/authMiddleware.js
import jwt from "jsonwebtoken";
import asyncHandler from "express-async-handler";
import User from "../models/userModel.js";

/* ──────────────────────────────────────────────────────────
   protect - verifies JWT (header OR http-only cookie)
───────────────────────────────────────────────────────────*/
export const protect = asyncHandler(async (req, res, next) => {
  let token = null;

  // 1) Bearer
  if (req.headers.authorization?.startsWith("Bearer ")) {
    token = req.headers.authorization.split(" ")[1];
  }
  // 2) Cookie
  else if (req.cookies?.algomianToken) {
    token = req.cookies.algomianToken;
  }

  if (!token) {
    res.status(401);
    throw new Error("Not authorized, token missing");
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id).select("-password");
    req.perms = decoded.permissions || []; // 👈 permissions embedded in JWT
    next();
  } catch (err) {
    res.status(401);
    throw new Error("Not authorized, token invalid");
  }
});

/* simple role gates */
export const allowRoles =
  (...roles) =>
  (req, _res, next) => {
    if (roles.includes(req.user?.userType)) return next();
    const err = new Error("Forbidden – insufficient role");
    err.statusCode = 403;
    throw err;
  };

export const isAdmin = allowRoles("Admin");
export const isSalesTeam = allowRoles("Admin", "SalesRep", "Manager");
export const isLogistics = allowRoles("Admin", "Logistics");
export const isInventory = allowRoles("Admin", "Manager", "Inventory");
export const isGen = allowRoles("Admin", "Manager", "Inventory", "SalesRep");
export const adminOrManager = allowRoles("Admin", "Manager");
export const canViewOrders = allowRoles(
  "Admin",
  "Manager",
  "SalesRep",
  "Logistics"
);
export const canUpdateSale = allowRoles("Admin", "Manager", "SalesRep");

/* permission gate – checks JWT-scoped permissions.
   Admin always passes — they cannot be locked out by UAC misconfig. */
export const authorize =
  (...requiredPerms) =>
  (req, res, next) => {
    if (req.user?.userType === "Admin") return next();

    const perms = req.perms || [];
    const ok = requiredPerms.every((p) => perms.includes(p));
    if (!ok) {
      return res
        .status(403)
        .json({ message: "Forbidden – insufficient privileges" });
    }
    next();
  };

export const protectSoft = async (req, _res, next) => {
  try {
    const token =
      req.cookies?.algomianToken ||
      (req.headers.authorization || "").replace("Bearer ", "");
    if (!token) return next();
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id).select("-password");
  } catch (_) {
    // ignore invalid token; treat as public
  }
  next();
};
