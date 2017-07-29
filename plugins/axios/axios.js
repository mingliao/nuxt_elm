/**
 * Created by think on 2017/7/29.
 */
import axios from 'axios'

export default axios.create({
  baseURL: process.env.NODE_ENV === 'development' ? process.env.proxyUrl : process.env.baseUrl
})
