import { Frame } from '../frame';
import { carType, Methods, SpeedType, FinishType, WinnerType } from '../../types';
import './car.css';
import { Garage } from './garage';
import loader from '../loader/loader';

export class Car extends Frame {
  car: carType;
  carDOM!: HTMLElement;
  parent: Garage;
  startBtnDOM!: HTMLElement;
  toStartBtnDOM!: HTMLElement;
  winnerDOM!: HTMLElement;
  carImgDOM!: HTMLElement;
  selectDOM!: HTMLElement;
  carAnimation: Animation | null = null;
  isWinnerShow = true;
  currentWins = 0;
  winnerOptions: WinnerType;
  constructor(selector: string, car: carType, parent: Garage) {
    super(selector);
    this.car = car;
    this.parent = parent;
    this.winnerOptions = {
      id: Number(this.car.id),
      wins: 0,
      time: 0,
    };
    this.render(getHTML(this.car));
    this.assignVariablesToSelectors();
    this.coloredCar();
    this.addEventHandler();
    this.checkWinnerOnServ();
  }
  coloredCar() {
    this.carDOM.style.color = this.car.color;
  }
  setWinnerOpions(data: WinnerType) {
    this.winnerOptions.time = data.time;
    this.winnerOptions.wins = data.wins;
  }
  async checkWinnerOnServ() {
    const data: WinnerType[] = await loader.getData(Methods.GET, '/winners', null);
    if (data.some((e) => e.id == Number(this.car.id)))
      loader.load(Methods.GET, `/winners/${this.car.id}`, null, (data) => this.setWinnerOpions(data as WinnerType));
  }
  assignVariablesToSelectors() {
    if (this.car.id) this.carDOM = document.getElementById(this.car.id)!;
    this.startBtnDOM = this.carDOM.querySelector('.car__info__start')!;
    this.carImgDOM = this.carDOM.querySelector('.car__race__img')!;
    this.toStartBtnDOM = this.carDOM.querySelector('.car__info__to-start')!;
    this.winnerDOM = this.carDOM.querySelector('.car__winner')!;
    this.selectDOM = this.carDOM.querySelector('.car__info__select')!;
  }
  addEventHandler() {
    this.startBtnDOM.addEventListener('click', () => {
      this.startEventHandler();
    });
    this.toStartBtnDOM.addEventListener('click', async () => {
      this.cancelAnimation();
    });
    this.selectDOM.addEventListener('click', async () => {
      this.parent.removeActiveClass();
      this.selectDOM.classList.add('isActive');
      this.parent.currentCar = this;
    });
  }
  async startEventHandler(): Promise<FinishType | undefined> {
    this.startBtnDOM.classList.add('isBlocked');
    this.startBtnDOM.classList.add('disabled-color');
    const data = (await loader.getData(Methods.PATCH, '/engine', {
      id: this.car.id,
      status: 'started',
    })) as SpeedType;
    const time = data.distance / data.velocity;
    const timeK = 1.1;
    this.animationRules(time * timeK);
    console.log(time);
    this.carAnimation?.play();
    const res: FinishType | undefined = await loader.patch(
      Methods.PATCH,
      '/engine',
      {
        id: this.car.id,
        status: 'drive',
      },
      () => this.carAnimation?.pause()
    );
    res!.instance = this;
    res!.time = Math.round(time / 10) / 100;
    return res;
  }
  animationRules(time: number) {
    const carKeyframes = new KeyframeEffect(
      this.carImgDOM, // element to animate
      [
        { transform: `translateX(${this.rootDOM.offsetWidth - this.carImgDOM.offsetWidth}px)` }, // keyframe
      ],
      { duration: time, fill: 'forwards', iterations: 1 } // keyframe options
    );
    this.carAnimation = new Animation(carKeyframes);
  }
  async cancelAnimation() {
    if (this.carAnimation) this.carAnimation.cancel();
    await loader.getData(Methods.PATCH, '/engine', {
      id: this.car.id,
      status: 'stopped',
    });
    this.startBtnDOM.classList.remove('isBlocked');
    this.startBtnDOM.classList.remove('disabled-color');
  }
  showWinner() {
    if (this.isWinnerShow) {
      this.winnerDOM.style.display = 'block';
      setTimeout(() => {
        this.winnerDOM.style.display = 'none';
      }, 5000);
    }
  }
  winHandler(time: number) {
    this.showWinner();
    this.sendWinnerToServer(time);
  }
  sendWinnerToServer(time: number) {
    if (!this.winnerOptions.time || this.winnerOptions.time > time) {
      this.winnerOptions.time = time;
    }
    if (!this.winnerOptions.wins) {
      this.winnerOptions.wins += 1;
      console.log(this.winnerOptions, 'на сервак');
      loader.upload(Methods.POST, '/winners', this.winnerOptions, null);
    } else {
      this.winnerOptions.wins += 1;
      loader.upload(Methods.PUT, `/winners/${this.car.id}`, this.winnerOptions, null);
    }
  }
}

function getHTML(car: carType) {
  return `
    <li class="car" id="${car.id}">
      <p class="car__winner">Winner is ${car.name}</p>
      <div class="car__info">
        <i class="fa-solid fa-circle-check car__info__select"></i>
        <i class="fa-solid fa-play car__info__start"></i>
        <i class="fa-solid fa-backward-step car__info__to-start"></i>
        <span class="car__info__model">${car.name}</span>
      </div>
      <div class="car__race">
        <i class="fa-solid fa-car-side car__race__img"></i>
        <i class="fa-solid fa-flag-checkered car__race__flag"></i>
      </div>
    </li>
  `;
}
