import { PrismaClient } from '../prisma';

export function getPrismaClient() {
    return new PrismaClient();
}
