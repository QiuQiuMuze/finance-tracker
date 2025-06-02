const SERVICES = {
  A: 'http://127.0.0.1:54253',
  B: 'http://localhost:5001',
  C: 'http://localhost:5002',
  D: 'http://localhost:5003'
};

document.addEventListener("DOMContentLoaded", () => {
  const path = window.location.pathname.split("/").pop();

  if (path === "index.html" || path === "") {
    const form = document.getElementById("login-form");
    form.addEventListener("submit", async e => {
      e.preventDefault();
      const u = document.getElementById("username").value.trim();
      const p = document.getElementById("password").value.trim();
      const err = document.getElementById("login-error");
      const res = await fetch(`${SERVICES.C}/login`, {
        method: 'POST',
        headers: {'Content-Type':'application/json'},
        body: JSON.stringify({username:u,password:p})
      });
      if (res.ok) {
        window.location.href = "home.html";
      } else {
        err.textContent = "Invalid username or password. Please try again.";
      }
    });
    return;
  }

  if (path === "register.html") {
    const form = document.getElementById("register-form");
    form.addEventListener("submit", async e => {
      e.preventDefault();
      const u = document.getElementById("reg-username").value.trim();
      const p = document.getElementById("reg-password").value.trim();
      const err = document.getElementById("register-error");
      if (u.length < 3) {
        err.textContent = "Username must be at least 3 characters.";
        return;
      }
      if (p.length < 6) {
        err.textContent = "Password must be at least 6 characters.";
        return;
      }
      const res = await fetch(`${SERVICES.C}/register`, {
        method: 'POST',
        headers: {'Content-Type':'application/json'},
        body: JSON.stringify({username:u,password:p})
      });
      if (res.status === 201) {
        window.location.href = "index.html";
      } else {
        const {error} = await res.json();
        err.textContent = error;
      }
    });
    return;
  }

  if (path === "" || path === "home.html") {
    refreshHome();
    const saveBtn = document.getElementById("budget-save");
    const cancelBtn = document.getElementById("budget-cancel");
    const input = document.getElementById("budget-amount");
    saveBtn.addEventListener("click", async () => {
      const amt = parseFloat(input.value);
      if (isNaN(amt)) {
        alert("Please enter a valid budget amount.");
        return;
      }
      const res = await fetch(`${SERVICES.A}/newbudget`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount: amt })
      });

      if (!res.ok) {
        const err = await res.json();
        alert("Failed to save budget: "+(err.error||res.status));
        return;
      }
      localStorage.setItem("budget", amt);
      await refreshHome();
      alert("Budget updated");
    });
    cancelBtn.addEventListener("click", () => {
      if (confirm("Are you sure you want to cancel?")) {
        input.value = "";
      }
    });
    return;
  }

  if (path === "add_transaction.html") {
    const tf = document.getElementById("transaction-form");
    tf.addEventListener("submit", async e => {
      e.preventDefault();
      const t = {
        amount: parseFloat(tf.amount.value),
        type: tf.type.value,
        category: tf.category.value,
        date: tf.date.value
      };
      await fetch(`${SERVICES.B}/submit_transaction`,{
        method:'POST',
        headers:{'Content-Type':'application/json'},
        body: JSON.stringify(t)
      });
      let arr = JSON.parse(localStorage.getItem("transactions")||"[]");
      arr.push(t);
      localStorage.setItem("transactions",JSON.stringify(arr));
      window.location.href="home.html";
    });
    document.getElementById("txn-cancel").addEventListener("click",e=>{
      e.preventDefault();
      if(confirm("Are you sure you want to cancel? Your input will be lost.")){
        window.location.href="home.html";
      }
    });
    return;
  }

  if (path === "settings.html") {
    document.querySelectorAll('button[data-font]').forEach(btn => {
      btn.addEventListener("click", async () => {
        const sz = btn.dataset.font;
        document.body.className = "font-" + sz;
        await fetch(`${SERVICES.D}/update_setting`,{
          method:'POST',
          headers:{'Content-Type':'application/json'},
          body:JSON.stringify({setting:'fontSize',value:sz})
        });
      });
    });
    document.getElementById("toggle-contrast").addEventListener("click", async () => {
      document.body.classList.toggle("high-contrast");
      const mode = document.body.classList.contains("high-contrast")?"on":"off";
      await fetch(`${SERVICES.D}/update_setting`,{
        method:'POST',
        headers:{'Content-Type':'application/json'},
        body:JSON.stringify({setting:'contrast',value:mode})
      });
    });
    return;
  }
});

async function refreshHome(){
  let b = 0;
  try {
    const res = await fetch(`${SERVICES.A}/budget`);
    if(res.ok){
      const json = await res.json();
      b = parseFloat(json.budget) || 0;
      localStorage.setItem("budget", b);
    } else {
      b = parseFloat(localStorage.getItem("budget") || "0");
    }
  } catch {
    b = parseFloat(localStorage.getItem("budget") || "0");
  }
  const txns = JSON.parse(localStorage.getItem("transactions") || "[]");
  let income = 0, expense = 0;
  txns.forEach(t => {
    if(t.type === "income") income += t.amount;
    else expense += t.amount;
  });
  const balance = income - expense;
  document.getElementById("total-income").textContent = income.toFixed(2);
  document.getElementById("total-expense").textContent = expense.toFixed(2);
  document.getElementById("balance").textContent = balance.toFixed(2);
  updateBudgetUI(b);
  document.getElementById("over-budget-msg").hidden = balance <= b;
  const tbl = document.getElementById("transaction-table");
  tbl.innerHTML = "";
  txns.forEach(t => {
    const r = tbl.insertRow();
    r.insertCell().textContent = `$${t.amount.toFixed(2)}`;
    r.insertCell().textContent = t.type;
    r.insertCell().textContent = t.category;
    r.insertCell().textContent = t.date;
  });
}

function updateBudgetUI(budget){
  document.getElementById("budget-limit").textContent = budget.toFixed(2);
}
