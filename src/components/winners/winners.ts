import { Frame } from '../frame';
import { WinnerType, Methods } from '../../types';
import loader from '../loader/loader';

export class Winners extends Frame {
  constructor() {
    super('winners');
    this.render(getHTML());
    this.getWinners();
  }
  printWinners(data: WinnerType[]) {
    console.log(data);
  }
  getWinners() {
    loader.load(Methods.GET, '/winners', null, (data) => this.printWinners(data as WinnerType[]));
  }
}

function getHTML() {
  return `
    <ul class="winners__list">
      <li class="winners__item">
        <span class="winners__item__num">Place</span>
        <span class="winners__item__car">Car</span>
        <span class="winners__item__model">Model</span>
        <span class="winners__item__wins">Wins</span>
        <span class="winners__item__time">Time</span>
      </li>
    </ul>
    <ul class="winners__pages"></ul>
  `;
}
