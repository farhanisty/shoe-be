import { Router } from "express";
import { CardController } from "../controllers/card.controller.js";

const router = Router();

router.get("/", CardController.getCards)
router.post("/", CardController.postCard)
router.delete("/:id", CardController.deleteCard)

export default router;
