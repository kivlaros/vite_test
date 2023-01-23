import { Garage } from './garage/garage';
import { Winners } from './winners/winners';

export class App {
  garage: Garage;
  winners: Winners;
  constructor() {
    this.winners = new Winners();
    this.garage = new Garage(this);
    console.log('test app');
  }
}
