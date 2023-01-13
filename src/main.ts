import './style.css'
import '../node_modules/@fortawesome/fontawesome-free/css/all.css'
import { App } from './components/app'
import loader from './components/loader/loader'
import {Methods} from './types'

new App()

function print(data:any){
  console.log(data)
}

loader.load(Methods.GET,'/garage',(data)=>{print(data)},{
  _page:'1',
  _limit:'2'
})