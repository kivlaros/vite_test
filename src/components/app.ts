import { Race } from './race/race';

export class App {
  race: Race;
  constructor() {
    this.race = new Race();
    console.log('test app');
  }
}
