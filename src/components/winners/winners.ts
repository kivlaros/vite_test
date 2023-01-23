import { Frame } from '../frame';
import { WinnerType, Methods, carType, WinnerOpitons } from '../../types';
import loader from '../loader/loader';
import './winners.css';

export class Winners extends Frame {
  winnersDOM!: HTMLElement;
  pagesDOM!: HTMLElement;
  idBtnDOM!: HTMLElement;
  winBtnDOM!: HTMLElement;
  timeBtnDOM!: HTMLElement;
  winnerOptions: WinnerOpitons = {
    _page: '1',
    _limit: '7',
    _order: 'ASC',
    _sort: 'time',
  };
  constructor() {
    super('winners');
    this.render(getHTML());
    this.assignVariablesToSelectors();
    this.getWinnersPages();
    this.addEventHandlers();
    this.renderWinnersPage();
  }
  assignVariablesToSelectors() {
    this.winnersDOM = this.rootDOM.querySelector('.winners__list')!;
    this.pagesDOM = this.rootDOM.querySelector('.winners__pages')!;
    this.idBtnDOM = this.rootDOM.querySelector('.sort-id')!;
    this.winBtnDOM = this.rootDOM.querySelector('.sort-wins')!;
    this.timeBtnDOM = this.rootDOM.querySelector('.sort-time')!;
  }
  addEventHandlers() {
    this.pagesDOM.addEventListener('click', (e) => {
      if (e.target instanceof HTMLLIElement) {
        this.winnerOptions._page = e.target.innerText;
        this.renderWinnersPage();
        this.coloredCurrentPage();
      }
    });
    this.idBtnDOM.addEventListener('click', () => {
      this.upDownHandler(this.idBtnDOM, 'id');
      this.renderWinnersPage();
    });
    this.winBtnDOM.addEventListener('click', () => {
      this.upDownHandler(this.winBtnDOM, 'wins');
      this.renderWinnersPage();
    });
    this.timeBtnDOM.addEventListener('click', () => {
      this.upDownHandler(this.timeBtnDOM, 'time');
      this.renderWinnersPage();
    });
  }
  upDownHandler(elem: HTMLElement, name: typeof this.winnerOptions._sort) {
    const up = `<i class="fa-solid fa-caret-up"></i>`;
    const down = `<i class="fa-solid fa-caret-down"></i>`;
    if (elem.classList.contains('up')) {
      elem.classList.remove('up');
      elem.innerHTML = `${name} ${down}`;
      this.winnerOptions._order = 'ASC';
    } else {
      elem.classList.add('up');
      elem.innerHTML = `${name} ${up}`;
      this.winnerOptions._order = 'DESC';
    }
    this.winnerOptions._sort = name;
  }
  async getWinnersPages() {
    await loader.load(Methods.GET, '/winners', null, (data) => this.renderPages(data as WinnerType[]));
    this.coloredCurrentPage();
  }
  renderPages(data: WinnerType[]) {
    this.pagesDOM.innerHTML = '';
    const pagesCount = Math.ceil(data.length / 7);
    for (let i = 0; i < pagesCount; i++) {
      this.pagesDOM.insertAdjacentHTML('beforeend', `<li>${i + 1}</li>`);
    }
  }
  async renderWinnersPage() {
    this.winnersDOM.innerHTML = '';
    await loader.load(Methods.GET, '/winners', this.winnerOptions, (data) => this.renderWinnersList(data as WinnerType[]));
  }
  async renderWinnersList(data: WinnerType[]) {
    data.forEach(async (e) => {
      const car: carType = await loader.getData(Methods.GET, `/garage/${e.id}`, null);
      this.winnersDOM.insertAdjacentHTML('beforeend', getLiHTML(e, car));
    });
  }
  coloredCurrentPage() {
    const pagesDOM = this.pagesDOM.children;
    const pagesArr = Array.from(pagesDOM) as HTMLElement[];
    pagesArr.forEach((e) => {
      e.style.color = '#fff';
      if (e.innerText == this.winnerOptions._page) e.style.color = 'rgb(5,170,236)';
    });
  }
}

function getHTML() {
  return `
    <div class="winner-container">
      <h3>Winner Table</h3>
      ${getHeadHTML()}
      <ul class="winners__list">
      </ul>
      <ul class="winners__pages"></ul>
    </div>
  `;
}

function getHeadHTML() {
  return `
    <li class="winners__item">
        <p class="winners__item__id sort-id">ID <i class="fa-solid fa-caret-down"></i></p>
        <p class="winners__item__car">Car</p>
        <p class="winners__item__model">Model</i></p>
        <p class="winners__item__wins sort-wins">Wins <i class="fa-solid fa-caret-down"></i></p>
        <p class="winners__item__time sort-time">Time <i class="fa-solid fa-caret-down"></i></p>
    </li>
  `;
}

function getLiHTML(li: WinnerType, car: carType) {
  return `
    <li class="winners__item">
        <p class="winners__item__id">${li.id}</p>
        <p class="winners__item__car" style="color:${car.color}"><i class="fa-solid fa-car-side"></i></p>
        <p class="winners__item__model">${car.name}</p>
        <p class="winners__item__wins">${li.wins}</p>
        <p class="winners__item__time">${li.time}</p>
    </li>
  `;
}
