const { TableClient, AzureNamedKeyCredential } = require("@azure/data-tables")
const { DefaultAzureCredential } = require("@azure/identity")
const { BlobServiceClient } = require("@azure/storage-blob")

const account = process.env.STORAGE_ACCOUNT
const accountKey = process.env.STORAGE_KEY
if (!account || !accountKey) throw "Storage credentials not found"

const credential = new AzureNamedKeyCredential(account, accountKey)

function getContainerClient(container) {
  const service = new BlobServiceClient(
    `https://${account}.blob.core.windows.net`,
    new DefaultAzureCredential()
  )
  return service.getContainerClient(container)
}

function getTableClient(table) {
  return new TableClient(`https://${account}.table.core.windows.net`, table, credential)
}

module.exports = { getTableClient, getContainerClient }
