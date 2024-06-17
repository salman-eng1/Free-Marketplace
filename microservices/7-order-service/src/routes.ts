import { verifyGatewayRequest } from '@salman-eng1/marketplace-shared';
import { Application } from 'express';
import { healthRoutes } from '@order/routes/health';
import { orderRoutes } from './routes/notification';

const BASE_PATH = '/api/v1/order';

const appRoutes = (app: Application): void => {
  app.use('', healthRoutes());
  app.use(BASE_PATH, verifyGatewayRequest, orderRoutes());
};

export { appRoutes };