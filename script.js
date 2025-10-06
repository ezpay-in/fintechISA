let users = {};
let currentUser = null;
let transactions = {};

function showRegister() {
  document.getElementById("homePage").classList.add("hidden");
  document.getElementById("registerPage").classList.remove("hidden");
}

function showLogin() {
  document.querySelectorAll(".page").forEach(p => p.classList.add("hidden"));
  document.getElementById("loginPage").classList.remove("hidden");
}

// Register
document.getElementById("registerForm").addEventListener("submit", function(e) {
  e.preventDefault();
  let name = document.getElementById("regName").value;
  let email = document.getElementById("regEmail").value;
  let balance = parseFloat(document.getElementById("regBalance").value);
  let password = document.getElementById("regPassword").value;

  users[email] = { name, email, balance, password };
  transactions[email] = [];
  alert("Registration Successful!");
  showLogin();
});

// Login
document.getElementById("loginForm").addEventListener("submit", function(e) {
  e.preventDefault();
  let email = document.getElementById("loginEmail").value;
  let password = document.getElementById("loginPassword").value;

  if(users[email] && users[email].password === password) {
    currentUser = email;
    document.querySelectorAll(".page").forEach(p => p.classList.add("hidden"));
    document.getElementById("dashboardPage").classList.remove("hidden");
    document.getElementById("welcomeMessage").innerText = `Welcome ${users[email].name}`;
  } else {
    alert("Invalid credentials!");
  }
});

// Add Money
function addMoney() {
  let amount = parseFloat(prompt("Enter amount to add:"));
  if(!isNaN(amount) && amount > 0) {
    users[currentUser].balance += amount;
    addTransaction("Self", "credit", amount);
    alert(`₹${amount} added successfully!`);
  }
}

// Send Money
function sendMoney() {
  let recipient = prompt("Enter recipient name:");
  let accNo = prompt("Enter 10-digit Account Number:");
  if(accNo.length !== 10) {
    alert("Account number must be exactly 10 digits!");
    return;
  }
  let bank = prompt("Enter Bank Name:");
  let amount = parseFloat(prompt("Enter amount:"));

  if(amount > users[currentUser].balance) {
    alert("Insufficient Balance");
  } else {
    users[currentUser].balance -= amount;
    let txnId = "TXN" + Math.floor(Math.random() * 1000000);
    addTransaction(recipient, "debit", amount, txnId);
    alert(`Transaction Successful! ID: ${txnId}`);
  }
}

function addTransaction(recipient, type, amount, txnId = "TXN" + Date.now()) {
  let date = new Date().toLocaleString();
  let record = { recipient, date, type, txnId, amount };
  transactions[currentUser].unshift(record);
  if(transactions[currentUser].length > 5) transactions[currentUser].pop();
}

// Show History
function showHistory() {
  let historyTable = document.getElementById("historyTable");
  historyTable.innerHTML = "";
  transactions[currentUser].forEach(t => {
    let row = `<tr>
      <td>${t.recipient}</td>
      <td>${t.date}</td>
      <td>${t.type}</td>
      <td>${t.txnId}</td>
      <td>₹${t.amount}</td>
    </tr>`;
    historyTable.innerHTML += row;
  });
  document.getElementById("transactionHistory").classList.remove("hidden");
}

// EMI Calculator
function showEMI() {
  document.getElementById("emiCalculator").classList.remove("hidden");
}

function calculateEMI() {
  let p = parseFloat(document.getElementById("principal").value);
  let r = parseFloat(document.getElementById("rate").value) / 12 / 100;
  let n = parseInt(document.getElementById("tenure").value);

  if(isNaN(p) || isNaN(r) || isNaN(n) || n <= 0) {
    document.getElementById("emiResult").innerText = "Please enter valid values.";
    return;
  }

  let emi = (p * r * Math.pow(1+r, n)) / (Math.pow(1+r, n) - 1);
  document.getElementById("emiResult").innerText = `Monthly EMI: ₹${emi.toFixed(2)}`;
}
