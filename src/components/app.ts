import { Race } from './race/race';
import { Garage } from './garage/garage';

export class App {
  race: Race;
  garage: Garage;
  constructor() {
    this.race = new Race();
    this.garage = new Garage();
    console.log('test app');
  }
}
