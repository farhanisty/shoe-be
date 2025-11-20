import { CardService } from "../services/card.service.js";

export const CardController = {
  async getCards(req, res) {
    const cards = await CardService.getAllCard();
    return res.json({
      total: cards.length,
      data: cards
    });
  },

  async postCard(req, res) {
    try {
      if (!req.body || typeof req.body !== "object") {
        return res.status(400).json({ error: "BAD REQUEST" });
      }

      const { id, name } = req.body;

      const messages = []

      if (!id) {
        messages.push("Id must filled")
      }

      if (!name) {
        messages.push("Name must filled")
      }

      if (messages.length > 0) {
        return res.json({
          error: "BAD REQUEST",
          messages
        })
      }

      const card = await CardService.createCard(id, name);

      return res.status(201).json({
        id: card.id,
        name: card.name,
        createdAt: card.createdAt
      })

    } catch (error) {
      return res.status(500).json({
        error: "INTERNAL SERVER ERRROR"
      })
    }
  }
}
