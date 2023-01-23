import { Frame } from '../frame';
import loader from '../loader/loader';
import { carType, Methods, FinishType, WinnerType } from '../../types';
import { getRandomCarsArr } from '../car_generator/car_generator';
import { Car } from './car';
import './garage.css';
import { AddEditCar } from './addEditCar';
import { App } from '../app';

export class Garage extends Frame {
  carsListDOM!: HTMLElement;
  pagesListDOM!: HTMLElement;
  raceBtnDOM!: HTMLElement;
  rebooteBtnDOM!: HTMLElement;
  addBtn!: HTMLElement;
  editBtn!: HTMLElement;
  deleteBtn!: HTMLElement;
  add100DOM!: HTMLElement;
  currentCar: Car | null = null;
  currentPage = '1';
  addEdit: AddEditCar | null = null;
  carsArr: Car[] = [];
  app: App;
  totalCount = 0;
  constructor(app: App) {
    super('garage');
    this.app = app;
    this.render(getHTML());
    this.assignVariablesToSelectors();
    this.addEventsHandlers();
    this.asyncHandler();
  }
  assignVariablesToSelectors() {
    this.carsListDOM = this.rootDOM.querySelector('.garage__cars__list')!;
    this.pagesListDOM = this.rootDOM.querySelector('.garge__pages__list')!;
    this.raceBtnDOM = this.rootDOM.querySelector('.garage__race__start')!;
    this.rebooteBtnDOM = this.rootDOM.querySelector('.garage__race__reboote')!;
    this.add100DOM = this.rootDOM.querySelector('.garage__add100')!;
    this.addBtn = this.rootDOM.querySelector('.garage__current-car__add')!;
    this.deleteBtn = this.rootDOM.querySelector('.garage__current-car__delete')!;
    this.editBtn = this.rootDOM.querySelector('.garage__current-car__edit')!;
  }
  addEventsHandlers() {
    this.add100DOM.addEventListener('click', async () => {
      await this.add100BtnHandler();
      this.asyncHandler();
    });
    this.pagesListDOM.addEventListener('click', (e) => {
      if (e.target instanceof HTMLLIElement) {
        this.pagesListHandler(e);
        this.coloredCurrentPage();
      }
    });
    this.addBtn.addEventListener('click', () => {
      this.addCarHandler();
    });
    this.editBtn.addEventListener('click', async () => {
      this.editeCarHandler();
    });
    this.deleteBtn.addEventListener('click', () => {
      this.deleteCarHandler();
    });
    this.raceBtnDOM.addEventListener('click', () => {
      this.raceHandler();
    });
    this.rebooteBtnDOM.addEventListener('click', () => {
      this.rebootHandler();
    });
  }
  async asyncHandler() {
    await loader.load(Methods.GET, '/garage', null, (data) => this.renderPagesList(data as carType[]));
    await this.pagesListHandler();
    this.coloredCurrentPage();
  }
  renderPagesList(data: carType[]) {
    this.pagesListDOM.innerHTML = '';
    this.totalCount = data.length;
    const countDOM = document.querySelector('.total-count') as HTMLElement;
    countDOM.innerText = `Total count: ${this.totalCount.toString()}`;
    const pageCount = Math.ceil(data.length / 7);
    for (let i = 0; i < pageCount; i++) {
      this.pagesListDOM.insertAdjacentHTML('beforeend', `<li>${i + 1}</li>`);
    }
  }
  renderCarsOnPage(data: carType[]) {
    this.raceBtnDOM.style.pointerEvents = 'auto';
    this.raceBtnDOM.classList.remove('disabled');
    this.carsArr = [];
    data.forEach((e, i) => {
      const car = new Car('cars', e, this);
      this.carsArr.push(car);
      if (i == 0) {
        car.selectDOM.classList.add('isActive');
        this.currentCar = car;
      }
    });
  }
  async pagesListHandler(event?: Event) {
    this.carsListDOM.innerHTML = '';
    if (event) {
      const elem = event.target as HTMLLIElement;
      this.currentPage = elem.innerText;
    }
    await loader.load(
      Methods.GET,
      '/garage',
      {
        _page: this.currentPage,
        _limit: '7',
      },
      (data) => {
        this.renderCarsOnPage(data as carType[]);
      }
    );
  }
  addCarHandler() {
    this.addEdit = new AddEditCar('form-container', null, this);
  }
  editeCarHandler() {
    this.addEdit = new AddEditCar('form-container', this.currentCar, this);
  }
  async deleteCarHandler() {
    await loader.load(Methods.DELETE, `/garage/${this.currentCar?.car.id}`, null);
    const data: WinnerType[] = await loader.getData(Methods.GET, '/winners', null);
    if (data.some((e) => e.id == Number(this.currentCar?.car.id))) {
      await loader.load(Methods.DELETE, `/winners/${this.currentCar?.car.id}`, null);
    }
    this.asyncHandler();
  }
  async add100BtnHandler() {
    getRandomCarsArr(100).forEach(async (e, i) => {
      await loader.upload(Methods.POST, '/garage', e, null);
      this.carsListDOM.innerHTML = `<span class="preload">${i}%</span>`;
    });
  }
  removeActiveClass() {
    this.carsArr.forEach((e) => {
      e.selectDOM.classList.remove('isActive');
    });
  }
  coloredCurrentPage() {
    const pagesDOM = this.pagesListDOM.children;
    const pagesArr = Array.from(pagesDOM) as HTMLElement[];
    pagesArr.forEach((e) => {
      e.style.color = '#7c7c7c';
      if (e.innerText == this.currentPage) e.style.color = 'rgb(5,170,236)';
    });
  }
  raceHandler() {
    this.rootDOM.classList.add('isBlocked');
    this.raceBtnDOM.style.pointerEvents = 'none';
    this.raceBtnDOM.classList.add('disabled');
    this.rebooteBtnDOM.classList.add('disabled');
    const promiseArr: Promise<FinishType>[] = [];
    this.carsArr.forEach((e) => {
      promiseArr.push(
        new Promise((res) => {
          res(e.startEventHandler() as Promise<FinishType>);
        })
      );
    });
    Promise.any(promiseArr).then((value) => {
      value.instance?.winHandler(value.time);
    });
    Promise.allSettled(promiseArr).then(() => {
      this.rootDOM.classList.remove('isBlocked');
      this.app.winners.getWinnersPages();
      this.app.winners.renderWinnersPage();
      this.rebooteBtnDOM.classList.remove('disabled');
    });
  }
  rebootHandler() {
    this.carsArr.forEach((e) => {
      e.cancelAnimation();
    });
    this.raceBtnDOM.style.pointerEvents = 'auto';
    this.raceBtnDOM.classList.remove('disabled');
  }
  getAnyInRace(): boolean {
    return this.carsArr.some((e) => e.inRace);
  }
}

function getHTML() {
  return `
    <div class="garage__form-container" id="form-container"></div>
    <button class="garage__add100 btn-style">Add100</button>
    <div class="garage__current-car">
      <button class="garage__current-car__add btn-style">Add</button>
      <button class="garage__current-car__delete btn-style">Delete</button>
      <button class="garage__current-car__edit btn-style">Edit</button>
    </div>
    <div class="garage__race-btn">
      <button class="garage__race__start btn-style">Race</button>
      <button class="garage__race__reboote btn-style">Reboote</button>
      <span class="total-count"></span>
    </div>
    <div class="garage__cars">
      <ul class="garage__cars__list" id="cars">

      </ul>
    </div>
    <div class="garage__pages">
      <ul class="garge__pages__list">

      </ul>
    </div>
  `;
}
