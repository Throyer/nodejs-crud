import 'reflect-metadata';

import express from 'express';
import cors from 'cors';

import { SERVER_PORT } from './config';

import { routes } from './routes';
import { started } from './utils/started';
import { home } from './utils/home';

import './database';

const app = express();

app.use(cors());
app.use(express.json());

routes(app);

app.get('/', home);

app.listen(SERVER_PORT, () => started(SERVER_PORT));