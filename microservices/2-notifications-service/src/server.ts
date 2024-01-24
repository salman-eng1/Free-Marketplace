import 'express-async-errors';
import http from 'http';

import { winstonLogger } from '@salman-eng1/marketplace-shared';
import { Logger } from 'winston';
import { config } from '@notifications/config';
import { Application } from 'express';
import { healthRoutes } from '@notifications/routes';
import { checkConnection } from '@notifications/elasticsearch';
import { createConnection } from '@notifications/queues/connection';
import { Channel } from 'amqplib';
import { conusumeAuthEmailMessages, conusumeOrderEmailMessages } from './queues/email.Consumer';


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
  const message1=JSON.stringify({name: 'auth', description: 'helklo frodsfsdfsm the other side',he: 'sadas'})
  const message2=JSON.stringify({name: 'order', description: 'helklo frodsfsdfsm the other side',he: 'sadas'})


  const emailChannel: Channel = await createConnection() as Channel;
  await conusumeAuthEmailMessages(emailChannel)
  await emailChannel.assertExchange(`${config.RABBITMQ_EXCHANGE_AUTH_NAME}`, 'direct')


  await conusumeOrderEmailMessages(emailChannel)
  await emailChannel.assertExchange(`${config.RABBITMQ_EXCHANGE_ORDER_NAME}`, 'direct')


await  emailChannel.publish(`${config.RABBITMQ_EXCHANGE_AUTH_NAME}`, `${config.RABBITMQ_ROUTING_AUTH_KEY}`, Buffer.from(message1))

await  emailChannel.publish(`${config.RABBITMQ_EXCHANGE_ORDER_NAME}`, `${config.RABBITMQ_ROUTING_ORDER_KEY}`, Buffer.from(message2))


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