import { Frame } from '../frame';
import { carType } from '../../types';
import './car.css';
import { Garage } from './garage';

export class Car extends Frame {
  car: carType;
  carDOM!: HTMLElement;
  parent: Garage;
  constructor(selector: string, car: carType, parent: Garage) {
    super(selector);
    this.car = car;
    this.parent = parent;
    this.render(getHTML(this.car));
    if (car.id) this.carDOM = document.getElementById(car.id)!;
    this.coloredCar();
    this.addEventHandler();
  }
  coloredCar() {
    this.carDOM.style.color = this.car.color;
  }
  addEventHandler() {
    this.carDOM.addEventListener('click', () => {
      console.log(this.car.id);
    });
  }
}

function getHTML(car: carType) {
  return `
    <li class="car" id="${car.id}">
      <div class="car__img">
        <i class="fa-solid fa-car-side"></i>
      </div>
      <div class="car__info">
        <span class="car__info__model">${car.name}</span>
      </div>
    </li>
  `;
}
