import dotenv from 'dotenv';

dotenv.config();

export const PORT = Number(process.env.PORT) || 3000;
export const PREFIX_API = process.env.PREFIX_API || '/api/v1';

export const URL_FRONTEND = [process.env.URL_FRONTEND as string];
export const URL_SERVER_TWO = [process.env.URL_SERVER_TWO as string];

export const CORS_OPTIONS = {
  origin: [...URL_FRONTEND, ...URL_SERVER_TWO],
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  allowedHeaders:
    'Origin, X-Requested-With, Content-Type, Accept, Authorization, Document-Type',
  credentials: true,
};
