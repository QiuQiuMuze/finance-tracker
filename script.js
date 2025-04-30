document.addEventListener("DOMContentLoaded", () => {
    const loginForm = document.getElementById("login-form");
    if (loginForm) {
      loginForm.addEventListener("submit", event => {
        event.preventDefault();
        const username = document.getElementById("username").value.trim();
        const password = document.getElementById("password").value.trim();
        const errorMessage = document.getElementById("error-message");
        const stored = JSON.parse(localStorage.getItem("registeredUser"));
        if (stored && username === stored.username && password === stored.password) {
          window.location.href = "home.html";
        } else {
          errorMessage.innerText = "Invalid username or password. Please try again.";
          errorMessage.style.display = "block";
        }        
      });
    }
  
    const transactionForm = document.getElementById("transaction-form");
    if (transactionForm) {
      transactionForm.addEventListener("submit", event => {
        event.preventDefault();
        const amount = document.getElementById("amount").value;
        const type = document.getElementById("type").value;
        const category = document.getElementById("category").value.trim();
        const date = document.getElementById("date").value;
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
        window.location.href = "home.html";
      });
    }
  
    const transactionTable = document.getElementById("transaction-table");
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
        } else {
          expenseSum += t.amount;
        }
      });
  
      document.getElementById("total-income").textContent  = incomeSum.toFixed(2);
      document.getElementById("total-expense").textContent = expenseSum.toFixed(2);
      document.getElementById("balance").textContent       = (incomeSum - expenseSum).toFixed(2);
    }
  
    const fontSize = localStorage.getItem("fontSize") || "medium";
    document.body.classList.add("font-" + fontSize);
    if (localStorage.getItem("contrast") === "on") {
      document.body.classList.add("high-contrast");
    }
  });
  
  function setFontSize(size) {
    document.body.classList.remove("font-small", "font-medium", "font-large");
    document.body.classList.add("font-" + size);
    localStorage.setItem("fontSize", size);
  }
  function toggleContrast() {
    document.body.classList.toggle("high-contrast");
    localStorage.setItem("contrast",
      document.body.classList.contains("high-contrast") ? "on" : "off"
    );
  }
  

  const registerForm = document.getElementById("register-form");
  if (registerForm) {
    registerForm.addEventListener("submit", event => {
      event.preventDefault();
      const username = document.getElementById("new-username").value.trim();
      const password = document.getElementById("new-password").value.trim();
      if (!username || !password) {
        alert("Please enter both username and password.");
        return;
      }
      localStorage.setItem("registeredUser", JSON.stringify({ username, password }));
      document.getElementById("register-message").style.display = "block";
    });
  }
  

  function confirmCancel() {
    if (confirm("Are you sure you want to cancel? Your input will be lost.")) {
      window.location.href = "home.html";
    }
  }
  