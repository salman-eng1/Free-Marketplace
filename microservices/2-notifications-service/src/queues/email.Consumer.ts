import { config } from '@notifications/config';
import { createConnection } from '@notifications/queues/connection';
import { IEmailLocals, winstonLogger } from '@salman-eng1/marketplace-shared';
import { Channel, ConsumeMessage } from 'amqplib';
import { Logger } from 'winston';
import { sendEmail } from '@notifications/queues/mailer.transport';

const log: Logger = winstonLogger(`${config.ELASTIC_SEARCH_URL}`, 'notificationElasticSearchServer', 'debug');


async function consumeAuthEmailMessages(channel: Channel): Promise<void> {
    try {
        if (!channel) {
            await createConnection()
        }
        const exchangeName = `marketplace-auth-notification`
        const routingKey = `auth-email`
        const queueName = `auth-email-queue`

        await channel.assertExchange(exchangeName, 'direct')
        const emailQueue = await channel.assertQueue(queueName, { durable: true, autoDelete: true })
        await channel.bindQueue(emailQueue.queue, exchangeName, routingKey)

       await channel.consume(emailQueue.queue, async (msg: ConsumeMessage | null) => {
            const { receiverEmail, username, verifyLink, resetLink, template } = JSON.parse(msg!.content.toString())
            const locals: IEmailLocals = {
                appLink: `${config.CLIENT_URL}`,
                appIcon: 'https://public.newsdirect.com/953186729/fc1INsb2.jpg',
                username,
                verifyLink,
                resetLink
            }
            await sendEmail(
                template, receiverEmail, locals
            )
            channel.ack(msg!)
        })
    } catch (error) {
        log.log('error', 'NotificationService error consumeAuthEmailMessages() method:', error);

    }
}




async function consumeOrderEmailMessages(channel: Channel): Promise<void> {
    try {
        if (!channel) {
           channel= await createConnection() as Channel
        }
        const exchangeName = `marketplace-order-notification`
        const routingKey = `order-email`
        const queueName = `order-email-queue`

        await channel.assertExchange(exchangeName, 'direct')
        const emailQueue = await channel.assertQueue(queueName, { durable: true, autoDelete: true })
        await channel.bindQueue(emailQueue.queue, exchangeName, routingKey)

       await  channel.consume(emailQueue.queue, async (msg: ConsumeMessage | null) => {
const {
    receiverEmail,
    username,
    template,
    sender,
    offerLink,
    amount,
    buyerUsername,
    sellerUsername,
    title,
    description,
    deliveryDays,
    orderId,
    orderDue,
    requirements,
    orderUrl,
    originalDate,
    newDate,
    reason,
    subject,
    header,
    type,
    message,
    serviceFee,
    total
}= JSON.parse(msg!.content.toString())

const locals: IEmailLocals={
    appLink: `${config.CLIENT_URL}`,
    appIcon: 'https://public.newsdirect.com/953186729/fc1INsb2.jpg',
    username,
    sender,
    offerLink,
    amount,
    buyerUsername,
    sellerUsername,
    title,
    description,
    deliveryDays,
    orderId,
    orderDue,
    requirements,
    orderUrl,
    originalDate,
    newDate,
    reason,
    subject,
    header,
    type,
    message,
    serviceFee,
    total
}
if (template === 'orderPlaced'){
    await sendEmail('orderPlaced', receiverEmail, locals)
    await sendEmail('orderReceipt', receiverEmail, locals)

}else{
    await sendEmail(template, receiverEmail, locals)

}

            channel.ack(msg!)
        })
    } catch (error) {
        log.log('error', 'NotificationService error conusumeOrderEmailMessages() method:', error);

    }
}
export { consumeAuthEmailMessages, consumeOrderEmailMessages }