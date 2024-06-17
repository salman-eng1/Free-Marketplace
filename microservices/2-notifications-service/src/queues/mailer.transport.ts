import { config } from "@notifications/config";
import { emailTemplates } from "@notifications/helper";
import { IEmailLocals, winstonLogger } from "@salman-eng1/marketplace-shared";
import { Logger } from "winston";



const log: Logger = winstonLogger(`${config.ELASTIC_SEARCH_URL}`, 'notificationElasticSearchServer', 'debug');


async function sendEmail(template: string, receiverEmail: string, locals: IEmailLocals): Promise<void> {
    try{
        emailTemplates(template, receiverEmail,locals)
 log.info('Email sent successfully NotificationService ')
    }catch(error){
log.log('error', 'NotificationService sendEmail() method', 'error: ',error);
    }

}


export {sendEmail}