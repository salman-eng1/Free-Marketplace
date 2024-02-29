import {Client} from '@elastic/elasticsearch'
import {ClusterHealthResponse, GetResponse} from '@elastic/elasticsearch/lib/api/types'
import {config} from '@auth/config'
import { winstonLogger } from '@salman-eng1/marketplace-shared';
import { Logger } from 'winston';

const log: Logger = winstonLogger(`${config.ELASTIC_SEARCH_URL}`, 'authElasticSearchServer', 'debug');


const elasticSearchClient = new Client({
node: `${config.ELASTIC_SEARCH_URL}`
})


export async function checkConnection(): Promise<void> {
    let isConnected = false;
    while (!isConnected) {
        log.info(`AuthService Connecting to Elasticsearch...`);

      try {
        const health: ClusterHealthResponse = await elasticSearchClient.cluster.health({});
        log.info(`AuthService Elasticsearch health status - ${health.status}`);
        isConnected = true;
      } catch (error) {
        log.error('Connection to Elasticsearch failed. Retrying...');
        log.log('error', 'AuthService checkConnection() method:', error);
      }
    }
  }


export async function checkIfIndexExists(indexName: string): Promise<boolean>{
  const result:boolean=await elasticSearchClient.indices.exists({index: indexName});
  return result;
  }


  export async function createIndex(indexName: string): Promise<void>{
    try{
      const result: boolean=await checkIfIndexExists(indexName)
      if (result){
        log.info(`Index ${indexName} already exists`)
      }else{
        await elasticSearchClient.indices.create({index: indexName})
        // this make the new index available to be used for search
        await elasticSearchClient.indices.refresh({index: indexName}) 
        log.info(`Created Index ${indexName}`)
      }

    }catch(error){
      log.error(`An error ocurred while creating the index ${indexName}`)
      log.log(`error`, 'AuthService createIndex() method error',error)
    }
  }



  export async function getDocumentById(index:string, gigId:string) {
    try{

const result: GetResponse= await elasticSearchClient.get({
  index,
   id: gigId
})

return result._source
    }catch(error){
      log.log(`error`, 'AuthService getDocumentById() method error',error)
      return{}
    }
  }