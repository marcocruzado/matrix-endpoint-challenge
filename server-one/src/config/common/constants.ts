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

export const SECRET_KEY = String(process.env.SECRET_KEY) || 'secret';
export const EXPIRATION_TIME = String(process.env.EXPIRATION_TIME) || '3600';
export const ALGORITHM = String(process.env.ALGORITHM) || 'HS256';
export const SALT_ROUNDS = Number(process.env.SALT_ROUNDS) || 10;
export const REFRESH_TOKEN_EXPIRATION = String(process.env.REFRESH_TOKEN_EXPIRATION) || '604800';
