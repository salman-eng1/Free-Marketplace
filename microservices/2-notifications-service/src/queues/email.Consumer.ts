import { config } from '@notifications/config';
import { createConnection } from '@notifications/queues/connection';
import { winstonLogger } from '@salman-eng1/marketplace-shared';
import  { Channel, ConsumeMessage } from 'amqplib';
import { Logger } from 'winston';

const log: Logger = winstonLogger(`${config.ELASTIC_SEARCH_URL}`, 'notificationElasticSearchServer', 'debug');


async function conusumeAuthEmailMessages(channel: Channel): Promise<void> {
    try{
        if (!channel){
             await createConnection()
        }
        const exchangeName=`${config.RABBITMQ_EXCHANGE_AUTH_NAME}`
        const routingKey=`${config.RABBITMQ_ROUTING_AUTH_KEY}`
        const queueName=`${config.RABBITMQ_QUEUE_AUTH_NAME}`

        await channel.assertExchange(exchangeName, 'direct')
        const emailQueue= await channel.assertQueue(queueName, {durable: true, autoDelete: true})
        await channel.bindQueue(emailQueue.queue, exchangeName,routingKey)

        channel.consume(emailQueue.queue, async (msg: ConsumeMessage | null) => {
            console.log(JSON.parse(msg!.content.toString()))

channel.ack(msg!)
        })
    }catch(error){
        log.log('error', 'NotificationService error conusumeAuthEmailMessages() method:', error);

    }
}




async function conusumeOrderEmailMessages(channel: Channel): Promise<void> {
    try{
        if (!channel){
             await createConnection()
        }
        const exchangeName=`${config.RABBITMQ_EXCHANGE_ORDER_NAME}`
        const routingKey=`${config.RABBITMQ_ROUTING_ORDER_KEY}`
        const queueName=`${config.RABBITMQ_QUEUE_ORDER_NAME}`

        await channel.assertExchange(exchangeName, 'direct')
        const emailQueue= await channel.assertQueue(queueName, {durable: true, autoDelete: true})
        await channel.bindQueue(emailQueue.queue, exchangeName,routingKey)

        channel.consume(emailQueue.queue, async (msg: ConsumeMessage | null) => {
            console.log(JSON.parse(msg!.content.toString()))

channel.ack(msg!)
        })
    }catch(error){
        log.log('error', 'NotificationService error conusumeOrderEmailMessages() method:', error);

    }
}
export {conusumeAuthEmailMessages, conusumeOrderEmailMessages}