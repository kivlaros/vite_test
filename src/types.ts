import { Car } from './components/garage/car';

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

type FinishType = {
  success: boolean;
  time: number;
  instance?: Car;
};

type WinnerType = {
  id: number;
  wins: number;
  time: number;
};

type WinnerOpitons = {
  _page: string;

  _limit: string;

  _sort: 'id' | 'wins' | 'time';

  _order: 'ASC' | 'DESC';
};

export { Methods, callbackType, queryParams, carType, SpeedType, errorCallback, FinishType, WinnerType, WinnerOpitons };
