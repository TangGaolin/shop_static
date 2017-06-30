import axios from 'axios'
import store from '../store'
import router from '../router'
import {LoadingBar} from 'iview'
axios.defaults.headers.post['Content-Type'] = 'application/json'

export function fetch(options) {
  return new Promise((resolve, reject) => {
    const instance = axios.create({
      timeout: 10000 // 超时
    })
    LoadingBar.start()
    instance(options)
      .then(response => {
        const res = response.data
        LoadingBar.finish()
        resolve(res)
      })
      .catch(error => {
        console.log(error) // for debug
        LoadingBar.finish()
        reject(error)
      })

  });
}




