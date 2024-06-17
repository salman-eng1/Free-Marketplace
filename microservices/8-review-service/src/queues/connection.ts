import { config } from '@review/config';
import { winstonLogger } from '@salman-eng1/marketplace-shared';
import client, { Channel, Connection } from 'amqplib';
import { Logger } from 'winston';

const log: Logger = winstonLogger(`${config.ELASTIC_SEARCH_URL}`, 'reviewlasticSearchServer', 'debug');

export async function createConnection(): Promise<Channel | undefined> {
  try {
    const connection: Connection = await client.connect(`${config.RABBITMQ_ENDPOINT}`);
    const channel: Channel = await connection.createChannel();

    log.info('Review server connected to queue successfully...');
    closeConnection(channel, connection);
   return channel;
  } catch (error) {
    log.log('error', 'ReviewService error createConnection() method:', error);
  }
}

function closeConnection(channel: Channel, connection: Connection): void {
  process.once('SIGINT', async () => {
    await channel.close();
    await connection.close();
  });
}
