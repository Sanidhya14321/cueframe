import { beatsheetSchema, buildFromBeatsheet } from '@/agent/beatsheet';
import { projectApi } from '@/local/project-api';
export const maxDuration=300;
export const POST=(request:Request,{params}:{params:Promise<{projectId:string}>})=>projectApi(request,async()=>Response.json(await buildFromBeatsheet(beatsheetSchema.parse({...await request.json() as object,projectId:(await params).projectId}),'agent:builder')));
