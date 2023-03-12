import axios from "axios";
import {Err, None, Ok, Option, Result, Some} from "ts-results";
import {EndReq, StartRes, TakeShotReq} from "../types";
import {MASTER_ADDRESS} from "./constants";

function tsResults(raw:object):any {
    if(!("val" in raw)){
        return raw
    }
    if("some" in raw&&"none" in raw){
        if(raw.some){
            return new Some(raw.val)
        }else{
            return None
        }
    }
    if("ok" in raw&&"err" in raw){
        if(raw.ok){
            return new Ok(raw.val)
        }else{
            return new Err(raw.val)
        }
    }

    return raw
}

async function get<T>(url:string):Promise<T> {
    const res=await axios.get(url)
    return tsResults(res.data)
}
async function post<T>(url:string,data:unknown):Promise<T> {
    const res=await axios.post(url,data)
    return tsResults(res.data)
}


async function start():Promise<Option<StartRes>> {
    return get(MASTER_ADDRESS+"/start")
}

async function takeShot(req:TakeShotReq):Promise<Result<string, string>> {
    return post(MASTER_ADDRESS+"/takeShot",req)
}

async function end(req:EndReq):Promise<Result<null, string>> {
    return post(MASTER_ADDRESS+"/end",req)
}

export {
    start,
    takeShot,
    end,
}