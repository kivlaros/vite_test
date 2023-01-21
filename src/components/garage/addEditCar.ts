import { Frame } from '../frame';
import { Car } from './car';
import './addEdit.css';
import loader from '../loader/loader';
import { carType, Methods } from '../../types';
import { Garage } from './garage';

export class AddEditCar extends Frame {
  currnetCar: Car | null;
  inputModelDOM!: HTMLInputElement;
  inputColorDOM!: HTMLInputElement;
  confirmBtnDOM!: HTMLButtonElement;
  cover!: HTMLElement;
  parent: Garage;
  constructor(selector: string, currnetCar: Car | null, parent: Garage) {
    super(selector);
    this.cover = document.getElementById('cover')!;
    this.currnetCar = currnetCar;
    this.parent = parent;
    this.render(getHTML());
    this.showElements();
    this.assignVariablesToSelectors();
    this.setInputValue();
    this.addEventHandlers();
  }
  assignVariablesToSelectors() {
    this.inputModelDOM = this.rootDOM.querySelector('.input-model')!;
    this.inputColorDOM = this.rootDOM.querySelector('.input-color')!;
    this.confirmBtnDOM = this.rootDOM.querySelector('.add-edit__confirm')!;
  }
  setInputValue() {
    if (this.currnetCar) {
      this.inputModelDOM.value = this.currnetCar.car.name;
      this.inputColorDOM.value = this.currnetCar.car.color;
    }
  }
  showElements() {
    this.rootDOM.style.display = 'flex';
    this.cover.style.display = 'block';
  }
  addEventHandlers() {
    this.cover.addEventListener('click', () => {
      this.cover.style.display = 'none';
      this.destroy();
    });
    this.confirmBtnDOM.addEventListener('click', (e) => {
      e.preventDefault();
      this.cofirmBtnHandler();
    });
  }
  async cofirmBtnHandler() {
    const sendData: carType = {
      name: this.inputModelDOM.value,
      color: this.inputColorDOM.value,
    };
    if (this.currnetCar) {
      await loader.upload(Methods.PUT, `/garage/${this.currnetCar.car.id}`, sendData, null);
    } else {
      await loader.upload(Methods.POST, '/garage', sendData, null);
    }
    this.parent.asyncHandler();
  }
}

function getHTML() {
  return `
    <form class="add-edit" action="" method="post">
      <p>
        <label for="model">Model:</label>
        <input class="input-model" type="text" name="model" id="model" required>
      </p>
      <p>
        <label for="color">Color:</label>
        <input class="input-color" type="text" name="color" id="color" required>
      </p>
      <button class="add-edit__confirm" type="submit">confirm</button>
    </form>
  `;
}
