import 'express-async-errors';
import http from 'http';

import { IEmailMessageDetails, winstonLogger } from '@salman-eng1/marketplace-shared';
import { Logger } from 'winston';
import { config } from '@notifications/config';
import { Application } from 'express';
import { healthRoutes } from '@notifications/routes';
import { checkConnection } from '@notifications/elasticsearch';
import { createConnection } from '@notifications/queues/connection';
import { Channel } from 'amqplib';
import { consumeAuthEmailMessages, consumeOrderEmailMessages } from './queues/email.Consumer';


const SERVER_PORT = 4001;
const log: Logger = winstonLogger(`${config.ELASTIC_SEARCH_URL}`, 'notificationServer', 'debug');


export function start(app: Application): void {
  startServer(app);
  //http://localhost:4001//notification-routes]
  app.use('', healthRoutes);
  startQueues();
  startElasticSearch();
}


async function startQueues(): Promise<void> {
  const verificationLink=`${config.CLIENT_URL}/confirm/v_token=dsf54654sdf654sdf65fd4`
const messageDetails: IEmailMessageDetails= {
  receiverEmail: 'salman@zeour.co.uk',
  verifyLink: verificationLink,
  template: 'verifyEmail'
}
  const message1=JSON.stringify(messageDetails)


  const emailChannel: Channel = await createConnection() as Channel;
  await consumeAuthEmailMessages(emailChannel)
  await emailChannel.assertExchange(`${config.RABBITMQ_EXCHANGE_AUTH_NAME}`, 'direct')


  await consumeOrderEmailMessages(emailChannel)
  await emailChannel.assertExchange(`${config.RABBITMQ_EXCHANGE_ORDER_NAME}`, 'direct')


  // emailChannel.publish(`${config.RABBITMQ_EXCHANGE_AUTH_NAME}`, `${config.RABBITMQ_ROUTING_AUTH_KEY}`, Buffer.from(message1))

// await  emailChannel.publish(`${config.RABBITMQ_EXCHANGE_ORDER_NAME}`, `${config.RABBITMQ_ROUTING_ORDER_KEY}`, Buffer.from(message1))


}

function startElasticSearch(): void {
  checkConnection()
}

function startServer(app: Application): void {
  try {
    const httpServer: http.Server = new http.Server(app);
    log.info(`Worker with process id of ${process.pid} on notification server has started`);
    httpServer.listen(SERVER_PORT, () => {
      log.info(`Notification server running on port ${SERVER_PORT}`);
    });
  } catch (error) {
    log.log('error', 'NotificationService startServer() method:', error);
  }
}