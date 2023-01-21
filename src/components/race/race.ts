import './race.css';
import { Frame } from '../frame';

export class Race extends Frame {
  count: number;
  constructor() {
    super('race');
    this.count = 6;
  }
}
