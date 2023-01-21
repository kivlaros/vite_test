enum Methods {
  GET = 'GET',
  POST = 'POST',
  PUT = 'PUT',
  PATCH = 'PATCH',
  DELETE = 'DELETE',
}

type callbackType<T> = (data?: T) => void;
type errorCallback = () => void;

type queryParams = {
  _page?: string;
  _limit?: string;
  id?: string;
  status?: 'started' | 'stopped' | 'drive';
};

type carType = {
  name: string;
  color: string;
  id?: string;
};

type SpeedType = {
  velocity: number;
  distance: number;
};

export { Methods, callbackType, queryParams, carType, SpeedType, errorCallback };
