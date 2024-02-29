import { getDocumentById } from "@auth/elasticsearch";

export async function gigById(index: string, gigId: string){
const gig=await getDocumentById(index, gigId)
return gig
}