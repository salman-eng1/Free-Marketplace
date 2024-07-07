import { winstonLogger } from '@salman-eng1/marketplace-shared';
import { Logger } from 'winston';
import { config } from '@chat/config';
import { Channel } from 'amqplib';
import { createConnection } from '@chat/queues/connection';

const log: Logger = winstonLogger(`${config.ELASTIC_SEARCH_URL}`, 'ChatElasticSearchServer', 'debug');

const publishDirectMessage = async (
  channel: Channel,
  exchangeName: string,
  routingKey: string,
  message: string,
  logMessage: string
): Promise<void> => {
  try {
    if (!channel) {
      channel = (await createConnection()) as Channel;
    }
    await channel.assertExchange(exchangeName, 'direct');
    channel.publish(exchangeName, routingKey, Buffer.from(message));

    log.info(logMessage);
  } catch (error) {
    log.log('error', 'ChatService publishDirectMessage() method error:', error);
  }
};

export { publishDirectMessage };
