import { IEmailLocals, winstonLogger } from "@salman-eng1/marketplace-shared";
import { Logger } from "winston";
import { config } from "./config";
import nodemailer, { Transporter } from "nodemailer";
import Email from 'email-templates'
import path from 'path';


const log: Logger = winstonLogger(`${config.ELASTIC_SEARCH_URL}`, 'notificationServer', 'debug');

async function emailTemplates(template: string, receiver: string, locals: IEmailLocals): Promise<void> {
  try {
    const smtpTransport: Transporter = nodemailer.createTransport({
      host: `${config.EMAIL_HOST}`,
      port: 465,
      secure: true,
      auth: {
        // TODO: replace `user` and `pass` values from <https://forwardemail.net>
        user: `${config.SENDER_EMAIL}`,
        pass: `${config.SENDER_PASSWORD}`,
      }
    })

    const email: Email = new Email({
      message: {
        from: `Marketplace App <${config.SENDER_EMAIL}>`
      },
      // uncomment below to send emails in development/test env:
      send: true,
      // preview: false,
      transport: smtpTransport,
      views: {
        options: {
          extension: 'ejs',
        }
      },
      juice: true,
      juiceResources: {
        preserveImportant: true,
        webResources: {
          relativeTo: path.join(__dirname, '../build')
        }
      }

    });

    await email.send({
      template: path.join(__dirname, '..', 'src/emails', template),
      message: {
        to: receiver
      },
      locals
    })

  } catch (error) {
    log.log('error', 'NotificationService email.send() mehod', error)
  }
}


export { emailTemplates }