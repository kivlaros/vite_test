import './style.css'
import '../node_modules/@fortawesome/fontawesome-free/css/all.css'
import { App } from './components/app'
import loader from './components/loader/loader'
import {Methods, carType} from './types'

new App()

function print(data:any){
  console.log(data)
}

loader.load(Methods.GET,'/garage',{
  _page:'1',
  _limit:'7'
},(data)=>{print(data)})

const car:carType =  {
  name: 'Mazda RX8',
  color: '#fff'
}

const car2:carType =  {
  name: 'Mazda 9',
  color: '#fff'
}

//loader.upload(Methods.POST,'/garage',car,null)

//loader.upload(Methods.PUT,'/garage/7',car2,null)

async function name() {
  await loader.load(Methods.PATCH,'/engine',{
    id:'7',
    status:'started'
  })
  await loader.load(Methods.PATCH,'/engine',{
    id:'7',
    status:'drive'
  })
}
name()