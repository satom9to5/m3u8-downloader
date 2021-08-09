const message = {
  send: (data: any): Promise<any> => {
    return new Promise(resolve => {
      chrome.runtime.sendMessage(data, (response: any) => {
        resolve(response) 
      })
    })
  }
}

Object.freeze(message)
export default message
