import { Router } from "express";

const router = Router();

router.get("/login", (req, res) => {
  res.json({
    "hello": "world"
  });
});

export default router;
