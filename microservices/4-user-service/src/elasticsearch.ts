import { Client } from '@elastic/elasticsearch'
import { ClusterHealthResponse } from '@elastic/elasticsearch/lib/api/types';
import { winstonLogger } from '@salman-eng1/marketplace-shared';
import { config } from '@users/config'
import { Logger } from 'winston';

const log: Logger = winstonLogger(`${config.ELASTIC_SEARCH_URL}`, 'usersElasticSearchServer', 'debug');

const elasticsearchClient = new Client({
    node: `${config.ELASTIC_SEARCH_URL}`
})




const checkConnection=async (): Promise<void>=>{
    let isConnected = false;
    while (!isConnected) {
        try {
            log.info('UsersService Connecting to Elasticseach ...')
            const health: ClusterHealthResponse = await elasticsearchClient.cluster.health();
            log.info(`UsersService Elasticsearch health status - ${health.status}`);
            isConnected = true;
        } catch (error) {
            log.error('Connection to Elasticsearch failed. Retrying...');
            log.log('error', 'UsersService checkConnection() method:', error);

        }
    }
}

export {checkConnection};