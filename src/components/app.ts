import { Garage } from './garage/garage';
import { Winners } from './winners/winners';
import { Frame } from './frame';

export class App extends Frame {
  garage: Garage;
  winners: Winners;
  raceDOM!: HTMLElement;
  winnerDOM!: HTMLElement;
  garageDOM!: HTMLElement;
  winnersTableDOM!: HTMLElement;
  isRace = true;
  constructor() {
    super('app');
    this.render(getHTML());
    this.assignVariablesToSelectors();
    this.winners = new Winners();
    this.garage = new Garage(this);
    this.addEventHandler();
  }
  assignVariablesToSelectors() {
    this.raceDOM = this.rootDOM.querySelector('.app__page__race')!;
    this.winnerDOM = this.rootDOM.querySelector('.app__page__winners')!;
    this.garageDOM = this.rootDOM.querySelector('.garage')!;
    this.winnersTableDOM = this.rootDOM.querySelector('.winners')!;
  }
  addEventHandler() {
    this.raceDOM.addEventListener('click', () => {
      this.garageDOM.style.display = 'flex';
      this.winnersTableDOM.style.display = 'none';
    });
    this.winnerDOM.addEventListener('click', () => {
      this.garageDOM.style.display = 'none';
      this.winnersTableDOM.style.display = 'flex';
    });
  }
}

function getHTML() {
  return `
    <div class="app__page">
      <div class="app__page__race">Garage</div>
      <div class="app__page__winners">Winners</div>
    </div>
    <div class="cover" id="cover"></div>
    <section class="winners" id="winners"></section>
    <section class="garage" id="garage"></section>
  `;
}
