import { carList } from './car_list';
import { carType } from '../../types';

type CarListType = typeof carList;
type GetCarsType = (count: number) => carType[];

export const getRandomCarsArr = carsGenerator(carList);

function carsGenerator(carList: CarListType): GetCarsType {
  return (count = 100) => {
    const resArr: carType[] = [];
    for (let i = 0; i < count; i++) {
      const random = randomIntFromInterval(0, carList.length - 1);
      const carListElem = carList[random];
      const radomModelNumber = randomIntFromInterval(0, carListElem.models.length - 1);
      const car: carType = {
        name: `${carListElem.brand} ${carListElem.models[radomModelNumber]}`,
        // eslint-disable-next-line prettier/prettier
        color: `rgb(${randomIntFromInterval(0, 255)},${randomIntFromInterval(0, 255)},${randomIntFromInterval(0, 255)})`,
      };
      resArr.push(car);
    }
    return resArr;
  };
}

function randomIntFromInterval(min: number, max: number) {
  // min and max included
  return Math.floor(Math.random() * (max - min + 1) + min);
}
