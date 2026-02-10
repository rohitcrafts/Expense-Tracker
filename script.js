const balance = document.getElementById("balance");
const income = document.getElementById("income");
const expense = document.getElementById("expense");
const list = document.getElementById("list");
const form = document.getElementById("form");
const text = document.getElementById("text");
const amount = document.getElementById("amount");
const search = document.getElementById("search");
const clearBtn = document.getElementById("clear");
const chartCanvas = document.getElementById("chart");
const revenueEl = document.getElementById("revenue");
const profitEl = document.getElementById("profit");

let transactions = JSON.parse(localStorage.getItem("transactions")) || [];
let chart;

// save
function saveData() {
  localStorage.setItem("transactions", JSON.stringify(transactions));
}

// add
form.addEventListener("submit", (e) => {
  e.preventDefault();

  const transaction = {
    id: Date.now(),
    text: text.value,
    amount: +amount.value
  };

  transactions.push(transaction);

  text.value = "";
  amount.value = "";

  updateUI();
});

// delete
function removeTransaction(id) {
  const item = document.querySelector(`button[onclick="removeTransaction(${id})"]`).parentElement;

  item.style.opacity = "0";
  item.style.transform = "translateX(40px)";

  setTimeout(() => {
    transactions = transactions.filter(t => t.id !== id);
    updateUI();
  }, 300);
}


// UI update
function updateUI() {
  list.innerHTML = "";

  let revenue = 0;
  let expenseTotal = 0;

  transactions.forEach(t => {

    if (t.amount > 0) revenue += t.amount;
    else expenseTotal += Math.abs(t.amount);

    const li = document.createElement("li");
    li.className = t.amount > 0 ? "plus" : "minus";

    li.innerHTML = `
      ${t.text} ₹${t.amount}
      <button onclick="removeTransaction(${t.id})">❌</button>
    `;

    list.appendChild(li);
  });

  const profit = revenue - expenseTotal;

  revenueEl.innerText = revenue;
  expense.innerText = expenseTotal;
  profitEl.innerText = profit;

  profitEl.style.color = profit >= 0 ? "green" : "red";

  saveData();
  updateChart();
}

// search
search.addEventListener("input", () => {
  const val = search.value.toLowerCase();

  document.querySelectorAll("li").forEach(li => {
    li.style.display =
      li.innerText.toLowerCase().includes(val) ? "flex" : "none";
  });
});

// clear
clearBtn.addEventListener("click", () => {
  transactions = [];
  updateUI();
});

// 📊 chart
function updateChart() {
  const months = new Array(12).fill(0);

  transactions.forEach(t => {
    const month = new Date(t.id).getMonth();
    months[month] += t.amount;
  });

  if (chart) chart.destroy();

  chart = new Chart(chartCanvas, {
    type: "bar",
    data: {
      labels: ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"],
      datasets: [{
        label: "Monthly Balance",
        data: months
      }]
    }
  });
}

updateUI();

/* ================= CALCULATOR LOGIC ================= */

const calcBtn = document.getElementById("calcBtn");
const calculator = document.getElementById("calculator");
const closeCalc = document.getElementById("closeCalc");
const display = document.getElementById("calcDisplay");
const buttons = document.querySelectorAll(".calc-grid button");

calcBtn.onclick = () => calculator.classList.add("active");
closeCalc.onclick = () => calculator.classList.remove("active");

buttons.forEach(btn => {
  btn.addEventListener("click", () => {

    const value = btn.innerText;

    // ✅ clear
    if (btn.classList.contains("clear")) {
      display.value = "";
      return;
    }

    // ✅ equal
    if (value === "=") {
      try {
        display.value = eval(display.value);
      } catch {
        display.value = "Error";
      }
      return;
    }

    // ✅ numbers/operators
    display.value += value;
  });
});
