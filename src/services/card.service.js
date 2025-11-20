import prisma from "./../lib/prisma.js";

export const CardService = {
  async createCard(id, name) {
    return prisma.card.create({
      data: {
        id, name
      }
    });
  },
  async getAllCard() {
    return prisma.card.findMany();
  }
}
