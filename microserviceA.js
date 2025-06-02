import express from 'express'
import cors from 'cors'

const app = express()
app.use(cors())
app.use(express.json())

app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] [${req.method}] ${req.originalUrl}`);
  next();
});

const PORT = 54253

let budget = 0
const expenses = {}
let expenseID = 1
let spending = 0
let over = false

app.get("/", handleGetBudgetAndExpenses)
app.get("/budget", handleGetBudget)
app.get("/expenses", handleGetExpenses)
app.post("/newbudget", handleNewBudget)
app.post("/newspend", handleNewSpend)
app.post("/updateSpend", updateSpend)

function handleGetBudgetAndExpenses(req, res) {
  const response = { budget, expenses, over }
  return res.status(200).json(response)
}

function handleGetBudget(req, res) {
  return res.status(200).json({ budget })
}

function handleGetExpenses(req, res) {
  return res.status(200).json({ expenses })
}

function handleNewBudget(req, res) {
  const newBudget = Number(req.body.amount)
  if (!isNaN(newBudget)) {
    budget = newBudget
    over = spending > budget
    return res.sendStatus(200)
  } else {
    return res.status(400).json({ error: "Invalid budget." })
  }
}

function handleNewSpend(req, res) {
  const amount = Number(req.query.amount)
  if (!req.query.amount || isNaN(amount)) {
    return res.status(400).json({ error: "Invalid amount." })
  }
  const thisID = expenseID++
  expenses[thisID] = amount
  spending += amount
  over = spending > budget
  return res.status(201).json({ id: thisID, over })
}

function updateSpend(req, res) {
  const id = Number(req.query.id)
  const newAmount = Number(req.query.amount)
  if (!expenses[id] || isNaN(newAmount)) {
    return res.status(400).json({ error: "Invalid expense ID or new amount" })
  }
  spending -= expenses[id]
  expenses[id] = newAmount
  spending += newAmount
  over = spending > budget
  return res.status(200).json({ over })
}

app.listen(PORT, () => {
  console.log(`Budget microservice running on port ${PORT}...`)
})
