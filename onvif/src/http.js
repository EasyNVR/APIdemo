import axios from 'axios'
import { Message, Loading } from 'element-ui';

let loading        

function startLoading() {    
    loading = Loading.service({
        lock: true,
        text: '加载中...',
        background: 'rgba(0, 0, 0, 0.7)'
    })
}
function endLoading() {    
    loading.close()
}

axios.interceptors.request.use(config => {
    startLoading()
    return config
}, error => {
    return Promise.reject(error)
})

axios.interceptors.response.use(response => {
		endLoading()
    return response
}, error => {

    endLoading()
    Message.error(error.response.data)
    const { status } = error.response
    if (status == 401) {
        Message.error('token值无效，请重新登录')
    }
    return Promise.reject(error)
})

export default axios