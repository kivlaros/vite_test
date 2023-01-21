import { Frame } from '../frame';
import loader from '../loader/loader';
import { carType, Methods } from '../../types';
import { getRandomCarsArr } from '../car_generator/car_generator';
import { Car } from './car';
import './garage.css';

export class Garage extends Frame {
  carsListDOM!: HTMLElement;
  pagesListDOM!: HTMLElement;
  colorsListDOM!: HTMLElement;
  add100DOM!: HTMLElement;
  constructor() {
    super('garage');
    this.render(getHTML());
    this.assignVariablesToSelectors();
    this.addEventsHandlers();
    this.asyncHandler();
  }
  assignVariablesToSelectors() {
    this.carsListDOM = this.rootDOM.querySelector('.garage__cars__list')!;
    this.pagesListDOM = this.rootDOM.querySelector('.garge__pages__list')!;
    this.colorsListDOM = this.rootDOM.querySelector('.garage__colors__list')!;
    this.add100DOM = this.rootDOM.querySelector('.garage__add100')!;
  }
  addEventsHandlers() {
    this.add100DOM.addEventListener('click', () => {
      this.add100BtnHandler();
    });
    this.pagesListDOM.addEventListener('click', (e) => {
      if (e.target instanceof HTMLLIElement) {
        this.pagesListHandler(e);
      }
    });
  }
  async asyncHandler() {
    await loader.load(Methods.GET, '/garage', null, (data) => this.renderPagesList(data as carType[]));
    await this.pagesListHandler();
  }
  renderPagesList(data: carType[]) {
    const pageCount = Math.ceil(data.length / 7);
    for (let i = 0; i < pageCount; i++) {
      this.pagesListDOM.insertAdjacentHTML('beforeend', `<li>${i + 1}</li>`);
    }
  }
  renderCarsOnPage(data: carType[]) {
    data.forEach((e) => {
      new Car('cars', e, this);
    });
  }
  async pagesListHandler(event?: Event) {
    this.carsListDOM.innerHTML = '';
    let page = '1';
    if (event) {
      const elem = event.target as HTMLLIElement;
      page = elem.innerText;
    }
    await loader.load(
      Methods.GET,
      '/garage',
      {
        _page: page,
        _limit: '7',
      },
      (data) => {
        this.renderCarsOnPage(data as carType[]);
      }
    );
  }
  add100BtnHandler() {
    getRandomCarsArr(100).forEach((e) => {
      loader.upload(Methods.POST, '/garage', e, null);
    });
  }
}

function getHTML() {
  return `
    <div class="garage__current-car">
      <button class="garage__current-car__delete">delete</button>
      <button class="garage__current-car__change">change</button>
    </div>
    <div class="garage__cars">
      <ul class="garage__cars__list" id="cars">

      </ul>
    </div>
    <div class="garage__pages">
      <ul class="garge__pages__list">

      </ul>
    </div>
    <div class="garage__colors">
      <ul class="garage__colors__list">

      </ul>
    </div>
    <button class="garage__add100">add100</button>
  `;
}
