const { getContainerClient } = require("./utils/storage")
const { v1: uid } = require("uuid")

async function streamToText(readable) {
  readable.setEncoding("utf8")
  let data = ""
  for await (const chunk of readable) {
    data += chunk
  }
  return data
}

class Librarian {
  static train_data_container = "train-data"
  static test_data_container = "test-data"

  constructor() {}

  // data - JSON serializable object
  // container - string, name of container
  async put_data(data, container = Librarian.train_data_container) {
    try {
      const containerClient = getContainerClient(container)

      const blobName = uid() + ".json"
      const blockBlobClient = containerClient.getBlockBlobClient(blobName)

      const dataString = JSON.stringify(data)
      await blockBlobClient.upload(dataString, dataString.length)

      return blobName
    } catch (e) {
      console.error(e)
      return null
    }
  }

  // blobName - name of blob
  // container - string, name of container
  async get_data(blobName, container = Librarian.train_data_container) {
    try {
      const containerClient = getContainerClient(container)

      const blockBlobClient = containerClient.getBlockBlobClient(blobName)

      const downloadBlockBlobResponse = await blockBlobClient.download(0)
      const dataString = await streamToText(downloadBlockBlobResponse.readableStreamBody)
      return JSON.parse(dataString)
    } catch (e) {
      console.error(e)
      return null
    }
  }
}

module.exports = { Librarian }
