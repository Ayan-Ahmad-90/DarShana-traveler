import express, { Application } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import swaggerUi from 'swagger-ui-express';
import { environment } from './config/environment.js';
import { apiLimiter } from './config/rateLimiter.js';
import { swaggerSpec } from './config/swagger.js';
import routes from './routes/index.js';
import { apiLogger } from './middlewares/apiLogger.js';
import { notFoundHandler } from './middlewares/notFoundHandler.js';
import { errorHandler } from './middlewares/errorHandler.js';

const app: Application = express();
app.set('trust proxy', 1);

app.use(helmet());
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || environment.corsOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error('CORS not allowed'));
      }
    },
    credentials: true
  })
);
app.use(apiLimiter);
app.use(apiLogger);

app.get('/api/health', (_req, res) => {
  res.json({
    status: 'ok',
    environment: environment.nodeEnv,
    timestamp: new Date().toISOString()
  });
});

app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.use('/api', routes);

app.use(notFoundHandler);
app.use(errorHandler);

export default app;
