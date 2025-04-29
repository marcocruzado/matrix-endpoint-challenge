import { PrismaClient } from '@prisma/client';
import { $log } from 'ts-log-debug';
import { NUMBER } from '../common/enums';

const prismaClient = new PrismaClient();

export const checkDatabaseConnection = async (
  client: PrismaClient
): Promise<void> => {
  try {
    await client.$connect();
    $log.debug(`Connection to the database successfully established.`);
    const nowUTC = new Date().toISOString();
    $log.debug(`Current UTC time: ${nowUTC}`);
    const nowLocal = new Date().toLocaleString();
    $log.debug(`Current Local time: ${nowLocal}`);
  } catch (error) {
    $log.error(`Could not connect to the database: ${error}`);
    process.exit(NUMBER.ONE);
  } finally {
    await client.$disconnect();
  }
};

export default prismaClient;
