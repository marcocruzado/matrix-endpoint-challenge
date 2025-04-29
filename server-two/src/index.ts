import app from './server';
import { CORS_OPTIONS, PORT, PREFIX_API } from './config/common/constants';
import { $log } from 'ts-log-debug';
import prismaClient from './config/db';
import { checkDatabaseConnection } from './config/db';

const initializeServer = async (): Promise<void> => {
  try {
    checkDatabaseConnection(prismaClient);
    app.listen(app.get('port'), () => {
      $log.info(`=================================`);
      $log.info(`Server is running PORT ${PORT}`);
      $log.info(`Server is running on http://localhost:${PORT}${PREFIX_API}`);
      $log.info(`CORS:\n`, JSON.stringify(CORS_OPTIONS, null, 2));
      $log.info(`=================================`);
    });
  } catch (error) {
    $log.error(`Could not connect to the database: ${error}`);
    process.exit(1);
  }
};

initializeServer();
