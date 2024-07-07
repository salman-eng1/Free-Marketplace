import { config } from '@chat/config';
import { winstonLogger } from '@salman-eng1/marketplace-shared';
import client, { Channel, Connection } from 'amqplib';
import { Logger } from 'winston';

const log: Logger = winstonLogger(`${config.ELASTIC_SEARCH_URL}`, 'chatElasticSearchServer', 'debug');

export async function createConnection(): Promise<Channel | undefined> {
  try {
    const connection: Connection = await client.connect(`${config.RABBITMQ_ENDPOINT}`);
    const channel: Channel = await connection.createChannel();

    log.info('Chat server connected to queue successfully...');
    closeConnection(channel, connection);
   return channel;
  } catch (error) {
    log.log('error', 'ChatService error createConnection() method:', error);
  }
}

function closeConnection(channel: Channel, connection: Connection): void {
  process.once('SIGINT', async () => {
    await channel.close();
    await connection.close();
  });
}
