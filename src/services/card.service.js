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
  },

  async deleteCardById(id) {
    try {
      await prisma.card.delete({
        where: {
          id: id
        }
      })

      return "success";
    } catch (e) {
      return e.code
    }
  }
}
