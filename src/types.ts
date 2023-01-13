enum Methods {
  GET = 'GET',
  POST = 'POST',
}

type callbackType<T> = (data?: T) => void;

type queryParams = {
  _page?:string,
  _limit?:string
}

export {Methods,callbackType,queryParams}