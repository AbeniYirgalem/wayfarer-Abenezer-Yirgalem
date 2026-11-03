import prisma from '../lib/prisma';

export interface UserSummary {
  id: string;
  name: string;
  createdAt: Date;
}

export class UserService {
  static async getUsers(): Promise<UserSummary[]> {
    return prisma.user.findMany({
      select: {
        id: true,
        name: true,
        createdAt: true,
      },
      orderBy: {
        name: 'asc',
      },
    });
  }

  static async getUserById(id: string) {
    return prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        createdAt: true,
      },
    });
  }
}

export default UserService;
