import { Methods,callbackType,queryParams } from "../../types"

class Loader{
  ulr:string = 'http://127.0.0.1:3000'
  constructor(){

  }
  makeUrl(endpoint:string,options:queryParams|null):string{
    let urlArr:string[]=[]
    urlArr.push(this.ulr,endpoint)
    if(options){
      let optionsStr = Object.entries(options).map(e=>e.join('=')).join('&')
      urlArr.push('?',optionsStr)
    }
    console.log(urlArr.join(''))
    return urlArr.join('')
  }

  async load<T>(method: Methods, endpoint: string,options:queryParams|null,callback?: callbackType<T>){
    try{
     let resp = await fetch(this.makeUrl(endpoint,options), { method })
     let data:T = await resp.json()
     console.log(data)
     if(callback)
     callback(data)
    }catch(e){
      throw console.error(e);
    }
  }
  async upload<T>(method: Methods, endpoint: string, data:T,options:queryParams|null){
    try{
      let resp = await fetch(this.makeUrl(endpoint,options), { 
        method,
        body: JSON.stringify(data),
        headers: {
          'Content-type': 'application/json; charset=UTF-8',
        },
       })
      let sendData = await resp.json() 
      console.log(sendData)
     }catch(e){
       throw console.error(e);
     }
  }
}

const loader = new Loader()

export default loader