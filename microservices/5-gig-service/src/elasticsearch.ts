import { Client } from '@elastic/elasticsearch';
import { ClusterHealthResponse, CountResponse, GetResponse } from '@elastic/elasticsearch/lib/api/types';
import { ISellerGig, winstonLogger } from '@salman-eng1/marketplace-shared';
import { config } from '@gig/config';
import { Logger } from 'winston';

const log: Logger = winstonLogger(`${config.ELASTIC_SEARCH_URL}`, 'gigElasticSearchServer', 'debug');

const elasticsearchClient = new Client({
  node: `${config.ELASTIC_SEARCH_URL}`
});

const checkConnection = async (): Promise<void> => {
  let isConnected = false;
  while (!isConnected) {
    try {
      log.info('GigService Connecting to Elasticseach ...');
      const health: ClusterHealthResponse = await elasticsearchClient.cluster.health();
      log.info(`GigService Elasticsearch health status - ${health.status}`);
      isConnected = true;
    } catch (error) {
      log.error('Connection to Elasticsearch failed. Retrying...');
      log.log('error', 'GigService checkConnection() method:', error);
    }
  }
};

async function checkIfIndexExists(indexName: string): Promise<boolean> {
  const result: boolean = await elasticsearchClient.indices.exists({ index: indexName });
  return result;
}

async function createIndex(indexName: string): Promise<void> {
  try {
    const result: boolean = await checkIfIndexExists(indexName);
    if (result) {
      log.info(`Index ${indexName} already exists`);
    } else {
      await elasticsearchClient.indices.create({ index: indexName });
      // this make the new index available to be used for search
      await elasticsearchClient.indices.refresh({ index: indexName });
      log.info(`Created Index ${indexName}`);
    }
  } catch (error) {
    log.error(`An error ocurred while creating the index ${indexName}`);
    log.log(`error`, 'GigService createIndex() method error', error);
  }
}

const getDocumentCount = async(index: string): Promise<number> => {
try{
const result: CountResponse=await elasticsearchClient.count({index})
return result.count;
}catch(error){
  log.log('error', 'GigService elasticsearch getDocument() method error', error)
return 0
}
}
async function getIndexedData(index: string, itemId: string): Promise<ISellerGig> {
  try {
    const result: GetResponse = await elasticsearchClient.get({
      index,
      id: itemId
    });
    return result._source as ISellerGig;
  } catch (error) {
    log.log(`error`, 'GigService getIndexedData() method error', error);
    return {} as ISellerGig;
  }
}

async function addDataToIndex(index: string, itemId: string, document: unknown): Promise<void> {
    try {
  await elasticsearchClient.index({
    index,
    id: itemId,
    document: document
  })
  
    } catch (error) {
      log.log(`error`, 'GigService addDataToIndex() method error', error);
    }
  }
  

async function updateIndexedData(index: string, itemId: string, document: unknown): Promise<void> {
    try {
  await elasticsearchClient.update({
    index,
    id: itemId,
    doc: document
  })
  
    } catch (error) {
      log.log(`error`, 'GigService updateIndexedData() method error', error);
    }
  }
  

  async function deleteIndexedData(index: string, itemId: string): Promise<void> {
    try {
  await elasticsearchClient.delete({
    index,
    id: itemId,
  })
  
    } catch (error) {
      log.log(`error`, 'GigService deletIendexedData() method error', error);
    }
  }
  

export { elasticsearchClient,getIndexedData, checkConnection, createIndex ,addDataToIndex,updateIndexedData,deleteIndexedData,getDocumentCount};
