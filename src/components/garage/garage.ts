import { Frame } from '../frame';
import loader from '../loader/loader';
import { carType, Methods } from '../../types';
import { getRandomCarsArr } from '../car_generator/car_generator';
import { Car } from './car';
import './garage.css';
import { AddEditCar } from './addEditCar';

export class Garage extends Frame {
  carsListDOM!: HTMLElement;
  pagesListDOM!: HTMLElement;
  colorsListDOM!: HTMLElement;
  addBtn!: HTMLElement;
  editBtn!: HTMLElement;
  deleteBtn!: HTMLElement;
  add100DOM!: HTMLElement;
  currentCar: Car | null = null;
  currentPage = '1';
  addEdit: AddEditCar | null = null;
  carsArr: Car[] = [];
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
  }
  async asyncHandler() {
    await loader.load(Methods.GET, '/garage', null, (data) => this.renderPagesList(data as carType[]));
    await this.pagesListHandler();
    this.coloredCurrentPage();
  }
  renderPagesList(data: carType[]) {
    this.pagesListDOM.innerHTML = '';
    const pageCount = Math.ceil(data.length / 7);
    for (let i = 0; i < pageCount; i++) {
      this.pagesListDOM.insertAdjacentHTML('beforeend', `<li>${i + 1}</li>`);
    }
  }
  renderCarsOnPage(data: carType[]) {
    this.carsArr = [];
    data.forEach((e, i) => {
      const car = new Car('cars', e, this);
      this.carsArr.push(car);
      if (i == 0) {
        car.carDOM.classList.add('isActive');
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
    this.asyncHandler();
  }
  async add100BtnHandler() {
    getRandomCarsArr(100).forEach(async (e, i) => {
      await loader.upload(Methods.POST, '/garage', e, null);
      this.carsListDOM.innerHTML = `<span>${i}</span>`;
    });
  }
  removeActiveClass() {
    this.carsArr.forEach((e) => {
      e.carDOM.classList.remove('isActive');
    });
  }
  coloredCurrentPage() {
    const pagesDOM = this.pagesListDOM.children;
    const pagesArr = Array.from(pagesDOM) as HTMLElement[];
    pagesArr.forEach((e) => {
      e.style.color = '#fff';
      if (e.innerText == this.currentPage) e.style.color = 'rgb(5,170,236)';
    });
  }
}

function getHTML() {
  return `
    <div class="garage__form-container" id="form-container"></div>
    <div class="garage__current-car">
      <button class="garage__current-car__add">Add</button>
      <button class="garage__current-car__delete">delete</button>
      <button class="garage__current-car__edit">Edit</button>
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
