document.getElementById("login-form").addEventListener("submit", function (event) {
    event.preventDefault();

    const username = document.getElementById("username").value.trim();
    const password = document.getElementById("password").value.trim();
    const errorMessage = document.getElementById("error-message");

    if (username === "testuser" && password === "password123") {
        window.location.href = "home.html";
    } else {
        errorMessage.innerText = "Invalid username or password. Please try again.";
        errorMessage.style.display = "block";
    }
});


const transactionForm = document.getElementById("transaction-form");

if (transactionForm) {
  transactionForm.addEventListener("submit", function (event) {
    event.preventDefault();

    const amount = document.getElementById("amount").value;
    const type = document.getElementById("type").value;
    const category = document.getElementById("category").value.trim();
    const date = document.getElementById("date").value;
    const message = document.getElementById("transaction-message");

    if (!amount || !type || !category || !date) {
      alert("Please fill in all fields.");
      return;
    }

    const transaction = {
      amount: parseFloat(amount),
      type,
      category,
      date
    };

    let transactions = JSON.parse(localStorage.getItem("transactions")) || [];
    transactions.push(transaction);
    localStorage.setItem("transactions", JSON.stringify(transactions));

    message.style.display = "block";
    transactionForm.reset();
  });
}


const transactionTable = document.getElementById("transaction-table");
const totalIncome = document.getElementById("total-income");
const totalExpense = document.getElementById("total-expense");
const balance = document.getElementById("balance");

if (transactionTable) {
  const transactions = JSON.parse(localStorage.getItem("transactions")) || [];

  let incomeSum = 0;
  let expenseSum = 0;

  transactions.forEach(t => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>$${t.amount.toFixed(2)}</td>
      <td>${t.type}</td>
      <td>${t.category}</td>
      <td>${t.date}</td>
    `;
    transactionTable.appendChild(row);

    if (t.type === "income") {
      incomeSum += t.amount;
    } else if (t.type === "expense") {
      expenseSum += t.amount;
    }
  });

  totalIncome.textContent = incomeSum.toFixed(2);
  totalExpense.textContent = expenseSum.toFixed(2);
  balance.textContent = (incomeSum - expenseSum).toFixed(2);
}
