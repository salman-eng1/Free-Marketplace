import { winstonLogger } from '@salman-eng1/marketplace-shared';
import { Logger } from 'winston';
import { config } from '@order/config';
import { Channel } from 'amqplib';
import { createConnection } from '@order/queues/connection';

const log: Logger = winstonLogger(`${config.ELASTIC_SEARCH_URL}`, 'orderElasticSearchServer', 'debug');

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
    log.log('error', 'OrderService publishDirectMessage() method error:', error);
  }
};

export { publishDirectMessage };
