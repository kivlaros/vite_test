import { Methods, callbackType, queryParams } from '../../types';

class Loader {
  ulr: string;
  constructor() {
    this.ulr = 'http://127.0.0.1:3000';
  }
  makeUrl(endpoint: string, options: queryParams | null): string {
    const urlArr: string[] = [];
    urlArr.push(this.ulr, endpoint);
    if (options) {
      const optionsStr = Object.entries(options)
        .map((e) => e.join('='))
        .join('&');
      urlArr.push('?', optionsStr);
    }
    console.log(urlArr.join(''));
    return urlArr.join('');
  }

  async load<T>(method: Methods, endpoint: string, options: queryParams | null, callback?: callbackType<T>) {
    try {
      const resp = await fetch(this.makeUrl(endpoint, options), { method });
      const data: T = await resp.json();
      console.log(data);
      if (callback) callback(data);
    } catch (e) {
      throw console.error(e);
    }
  }
  async getData<T>(method: Methods, endpoint: string, options: queryParams | null): Promise<T> {
    try {
      const resp = await fetch(this.makeUrl(endpoint, options), { method });
      const data: T = await resp.json();
      return data;
    } catch (e) {
      throw console.error(e);
    }
  }
  async upload<T>(method: Methods, endpoint: string, data: T, options: queryParams | null) {
    try {
      const resp = await fetch(this.makeUrl(endpoint, options), {
        method,
        body: JSON.stringify(data),
        headers: {
          'Content-type': 'application/json; charset=UTF-8',
        },
      });
      const sendData = await resp.json();
      console.log(sendData);
    } catch (e) {
      throw console.error(e);
    }
  }
}

const loader = new Loader();

export default loader;
