import dotenv from 'dotenv';

dotenv.config({path: '.env'})

class Config {
    NODE_ENV: string | undefined;
    CLIENT_URL: string | undefined;
    ELASTIC_SEARCH_URL: string | undefined;

    RABBITMQ_ENDPOINT: string | undefined;
    RABBITMQ_EXCHANGE_AUTH_NAME: string | undefined;
    RABBITMQ_ROUTING_AUTH_KEY: string | undefined;
    RABBITMQ_QUEUE_AUTH_NAME: string | undefined;
    
    RABBITMQ_EXCHANGE_ORDER_NAME: string | undefined;
    RABBITMQ_ROUTING_ORDER_KEY: string | undefined;
    RABBITMQ_QUEUE_ORDER_NAME: string | undefined;


    EMAIL_HOST: string | undefined;
    EMAIL_PORT: string | undefined;
    SENDER_EMAIL: string | undefined;
    SENDER_PASSWORD: string | undefined

    constructor() {
        this.NODE_ENV = process.env.NODE_ENV || ''
        this.CLIENT_URL = process.env.CLIENT_URL || ''
        this.ELASTIC_SEARCH_URL = process.env.ELASTIC_SEARCH_URL || ''
        this.RABBITMQ_ENDPOINT = process.env.RABBITMQ_ENDPOINT || ''
        this.RABBITMQ_EXCHANGE_AUTH_NAME = process.env.RABBITMQ_EXCHANGE_AUTH_NAME || '';
        this.RABBITMQ_ROUTING_AUTH_KEY = process.env.RABBITMQ_ROUTING_AUTH_KEY || ''
        this.RABBITMQ_QUEUE_AUTH_NAME = process.env.RABBITMQ_QUEUE_AUTH_NAME || ''
        this.RABBITMQ_EXCHANGE_ORDER_NAME = process.env.RABBITMQ_EXCHANGE_ORDER_NAME || '';
        this.RABBITMQ_ROUTING_ORDER_KEY = process.env.RABBITMQ_ROUTING_ORDER_KEY || ''
        this.RABBITMQ_QUEUE_ORDER_NAME = process.env.RABBITMQ_QUEUE_ORDER_NAME || ''


        this.EMAIL_HOST=process.env.EMAIL_HOST || '';
        this.EMAIL_PORT=process.env.EMAIL_PORT || '';
        this.SENDER_EMAIL=process.env.SENDER_EMAIL || '';
        this.SENDER_PASSWORD=process.env.SENDER_PASSWORD || ''
    }
} 

export const config: Config = new Config();