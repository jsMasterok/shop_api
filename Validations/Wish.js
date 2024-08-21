import { body } from "express-validator";

export const wishCreateValidation = [
  body("name", "").isLength({ min: 3 }).isString(),
  body("images", "").isArray(),
  body("type", "").isLength({ min: 3 }).isString(),
  body("description", "").isLength({ min: 3 }).isString(),
  body("price", "").isFloat().isNumeric(),
  body("total_count", "").isFloat().isNumeric(),
  body("method", "").isLength({ min: 3 }).isString(),
  body("compound", "").isLength({ min: 3 }).isString(),
  body("result", "").isLength({ min: 3 }).isString(),
];
