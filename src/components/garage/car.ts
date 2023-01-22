import { Frame } from '../frame';
import { carType, Methods, SpeedType, FinishType } from '../../types';
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
  carAnimation: Animation | null = null;
  isWinnerShow = true;
  constructor(selector: string, car: carType, parent: Garage) {
    super(selector);
    this.car = car;
    this.parent = parent;
    this.render(getHTML(this.car));
    this.assignVariablesToSelectors();
    this.coloredCar();
    this.addEventHandler();
  }
  coloredCar() {
    this.carDOM.style.color = this.car.color;
  }
  assignVariablesToSelectors() {
    if (this.car.id) this.carDOM = document.getElementById(this.car.id)!;
    this.startBtnDOM = this.carDOM.querySelector('.car__info__start')!;
    this.carImgDOM = this.carDOM.querySelector('.car__race__img')!;
    this.toStartBtnDOM = this.carDOM.querySelector('.car__info__to-start')!;
    this.winnerDOM = this.carDOM.querySelector('.car__winner')!;
  }
  addEventHandler() {
    this.carDOM.addEventListener('click', () => {
      this.parent.removeActiveClass();
      this.carDOM.classList.add('isActive');
      this.parent.currentCar = this;
    });
    this.startBtnDOM.addEventListener('click', () => {
      this.startEventHandler();
    });
    this.toStartBtnDOM.addEventListener('click', async () => {
      this.cancelAnimation();
    });
  }
  async startEventHandler(): Promise<FinishType | undefined> {
    this.startBtnDOM.classList.add('isBlocked');
    const data = (await loader.getData(Methods.PATCH, '/engine', {
      id: this.car.id,
      status: 'started',
    })) as SpeedType;
    this.animationRules(data.distance / data.velocity);
    console.log(data.distance / data.velocity);
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
  }
  showWinner() {
    if (this.isWinnerShow) {
      this.winnerDOM.style.display = 'block';
      setTimeout(() => {
        this.winnerDOM.style.display = 'none';
      }, 5000);
    }
  }
}

function getHTML(car: carType) {
  return `
    <li class="car" id="${car.id}">
      <p class="car__winner">Winner is ${car.name}</p>
      <div class="car__info">
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
