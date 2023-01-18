enum Methods {
  GET = 'GET',
  POST = 'POST',
  PUT = 'PUT',
  PATCH = 'PATCH',
}

type callbackType<T> = (data?: T) => void;

type queryParams = {
  _page?: string;
  _limit?: string;
  id?: string;
  status?: 'started' | 'stopped' | 'drive';
};

type carType = {
  name: string;
  color: string;
};

export { Methods, callbackType, queryParams, carType };
