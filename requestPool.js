// 请求池： 控制最大请求并发数
//思路1： 未超过并发数则直接执行。  超过了存到任务队列中， 请求完一个后再从任务队列中取一个执行
export class RequestPool {
  constructor(maxConcurrent) {
    this.maxConcurrent = maxConcurrent // 最大并发数
    this.currentConcurrent = 0 // 当前并发数
    this.queue = [] // 超过并发数的存到任务队列, 存的是 pool.request
  }

  // 执行请求
  async request(promiseFactory) {
    if (this.currentConcurrent >= this.maxConcurrent) {
      // 如果达到最大并发请求数，将请求加入队列
      return new Promise((resolve, reject) => {
        this.queue.push(() => promiseFactory().then(resolve).catch(reject))
      })
    }

    // 执行请求
    this.currentConcurrent++
    try {
      const result = await promiseFactory()
      return result
    } finally {
      // 当前并发数减一
      this.currentConcurrent--
      // 处理队列中的下一个请求
      if (this.queue.length > 0) {
        const next = this.queue.shift()
        next()
      }
    }
  }
}

// 使用示例
const pool = new RequestPool(5) // 最大并发请求数为 5

const fetchData = (url) => () => fetch(url).then((res) => res.json())

const urls = ['url1', 'url2', 'url3', 'url4', 'url5', 'url6']

const fetchAll = async () => {
  const promises = urls.map((url) => pool.request(fetchData(url)))
  return Promise.all(promises)
}

fetchAll().then((results) => {
  console.log(results)
})

// 思路2： 设置请求池存放最大并发数个， 只执行池子中的请求， 请求完一个后再往池子中放一个
