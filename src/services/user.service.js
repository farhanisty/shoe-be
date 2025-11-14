import prisma from "./../lib/prisma.js";

export const UserService = {
  async createUser(data) {
    return prisma.user.create({ data });
  },

  async findByEmail(email) {
    return prisma.user.findUnique({
      where: { email }
    });
  }
};

