const express = require("express")
const { Librarian } = require("./core/librarian")

const app = express()
app.use(express.json())

const api_endpoint = "/api"

const librarian = new Librarian()

app.get(`${api_endpoint}/health`, function (req, res) {
  res.send("Yeah, I'm fine")
})
app.post(`${api_endpoint}/put_train_data`, async function (req, res) {
  let data = null
  try {
    data = JSON.parse(req.body)
  } catch {
    res.status(400).send("Bad JSON")
  }
  if (!data) res.status(400).send("Body is empty")
  const blobName = await librarian.put_data(data)
  res.send(blobName)
})
app.post(`${api_endpoint}/get_train_data`, async function (req, res) {
  const blobName = req.body.blobName
  if (!blobName) res.status(400).send("`blobName` is empty")

  console.log(`Get ${blobName}`)
  const data = await librarian.get_data(blobName)
  res.send(data)
})

app.listen(3000, function () {
  console.log("The breeder is up and doing something")
})
