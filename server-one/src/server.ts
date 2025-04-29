import express, { Application } from 'express';
import helmet from 'helmet';
import cors from 'cors';
import { CORS_OPTIONS, PORT, PREFIX_API } from './config/common/constants';
import router from './routes';
import succesResponseHandler from './middlewares/succesResponseHandler';
import notFoundResponseHandler from './middlewares/notFoundResponseHandler';
import { errorHandler } from './middlewares/errorHandler';

const app: Application = express();

app.set('port', PORT);

app.use(express.json());
app.use(helmet());
app.use(express.urlencoded({ extended: false }));
app.use(cors(CORS_OPTIONS));

app.use(`${PREFIX_API}`, router);
app.use(succesResponseHandler);
app.use(notFoundResponseHandler);
app.use(errorHandler);

export default app;
