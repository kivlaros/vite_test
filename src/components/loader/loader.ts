enum Methods {
  GET = 'GET',
  POST = 'POST',
}

type callbackType<T> = (data?: T) => void;

type queryParams = {
  _page?:string,
  _limit?:string
}

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

  async load<T>(method: Methods, endpoint: string, callback: callbackType<T>,options:queryParams|null){
    try{
     let resp = await fetch(this.makeUrl(endpoint,options), { method })
     let data:T = await resp.json()
     callback(data)
    }catch(e){
      throw console.error(e);
    }
  }
}

const loader = new Loader()

export default loader