// ------------------ Firebase Setup ------------------
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-app.js";
import { getDatabase, ref, set, get, child, push, update } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-database.js";

const firebaseConfig = {
  apiKey: "AIzaSyDBir_gV5d5Re-XSDHNJjhoO8dcuIpr92s",
  authDomain: "smartlife-expense.firebaseapp.com",
  databaseURL: "https://smartlife-expense-default-rtdb.firebaseio.com",
  projectId: "smartlife-expense",
  storageBucket: "smartlife-expense.firebasestorage.app",
  messagingSenderId: "881601399971",
  appId: "1:881601399971:web:71d5ef67b5f16dffbe4316",
  measurementId: "G-FPGF8GDHLT"
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);
// ------------------ Helpers ------------------
window.closeModal = function(modalId){
  document.getElementById(modalId).classList.add('hidden');
};
window.toggleSettingsDropdown = function(){
  document.getElementById("settingsDropdown").classList.toggle("hidden");
};
window.closeSettingsDropdown = function(){
  document.getElementById("settingsDropdown").classList.add("hidden");
};
window.logout = function(){
  sessionStorage.removeItem("userEmail");
  window.location.href="index.html";
};

// ------------------ Loading Screen ------------------
window.addEventListener("load", () => {
  const loader = document.getElementById("loading-screen");
  if(loader) setTimeout(()=>{ loader.style.display="none"; }, 2000);
});

// ------------------ Toggle Password Visibility ------------------
window.togglePassword = function(fieldId, iconId){
  const field = document.getElementById(fieldId);
  const icon = document.getElementById(iconId);
  if(field.type === "password"){
    field.type = "text"; icon.textContent = "🙈";
  } else { field.type = "password"; icon.textContent = "👁️"; }
};

// ------------------ Signup ------------------
window.signup = function(){
  const email = document.getElementById("signupEmail").value.trim();
  const pw = document.getElementById("signupPassword").value.trim();
  const confirm = document.getElementById("signupConfirm").value.trim();
  if(!email || !pw || !confirm){ alert("Fill all fields"); return; }
  if(pw!==confirm){ alert("Passwords do not match"); return; }

  set(ref(db, 'users/' + email.replace('.',',')), { email, password: pw })
    .then(()=>{
      sessionStorage.setItem("userEmail", email);
      window.location.href="otp.html";
    })
    .catch(err=>alert(err));
};

// ------------------ Login ------------------
window.login = function(){
  const email = document.getElementById("loginEmail").value.trim();
  const pw = document.getElementById("loginPassword").value.trim();
  if(!email || !pw){ alert("Fill all fields"); return; }

  get(child(ref(db), 'users/' + email.replace('.',',')))
    .then(snapshot=>{
      if(snapshot.exists() && snapshot.val().password===pw){
        sessionStorage.setItem("userEmail", email);
        window.location.href="otp.html";
      } else alert("Invalid credentials");
    })
    .catch(err=>alert(err));
};

// ------------------ OTP Verification ------------------
window.verifyOtp = function(){
  const otp = document.getElementById("otpInput").value.trim();
  if(otp==="123456"){
    const email = sessionStorage.getItem("userEmail");
    get(child(ref(db), 'users/' + email.replace('.',',')))
      .then(snapshot=>{
        if(snapshot.exists() && snapshot.val().setupDone){
          window.location.href = "dashboard.html";
        } else {
          window.location.href = "setup.html";
        }
      })
      .catch(err=>alert(err));
  } else alert("Invalid OTP");
};

// ------------------ Profile Setup ------------------
window.saveSetup = function(){
  const name = document.getElementById("fullName").value.trim();
  const age = document.getElementById("age").value.trim();
  const budget = document.getElementById("budget").value.trim();
  if(!name || !age || !budget){ alert("Fill all required fields"); return; }

  const email = sessionStorage.getItem("userEmail");
  const userRef = ref(db, 'users/' + email.replace('.',','));
  get(userRef).then(snapshot=>{
    const existingData = snapshot.exists() ? snapshot.val() : {};
    const updatedData = { ...existingData, fullName: name, age: age, budget: budget, setupDone: true };
    set(userRef, updatedData)
      .then(()=>{ window.location.href="dashboard.html"; })
      .catch(err=>alert(err));
  }).catch(err=>alert(err));
};

// ------------------ Open Profile Modal ------------------
window.openProfile = function() {
  const email = sessionStorage.getItem("userEmail");
  if(!email){ alert("User not logged in"); return; }

  const userRef = ref(db, 'users/' + email.replace('.',','));
  get(userRef).then(snapshot=>{
    if(snapshot.exists()){
      const data = snapshot.val();
      document.getElementById('editEmail').value = data.email || '';
      document.getElementById('editName').value = data.fullName || '';
      document.getElementById('editAge').value = data.age || '';
      document.getElementById('editBudget').value = data.budget || '';
    } else alert("User data not found");
  }).catch(err=>alert(err));
  document.getElementById('profileModal').classList.remove('hidden');
};

// ------------------ Save Profile Changes ------------------
window.saveProfile = function() {
  const name = document.getElementById('editName').value.trim();
  const age = document.getElementById('editAge').value.trim();
  const budget = document.getElementById('editBudget').value.trim();
  if(!name || !age || !budget){ alert("Fill all fields"); return; }

  const email = sessionStorage.getItem("userEmail");
  const userRef = ref(db, 'users/' + email.replace('.',','));
  get(userRef).then(snapshot=>{
    const existingData = snapshot.exists() ? snapshot.val() : {};
    const updatedData = { ...existingData, fullName: name, age: age, budget: budget };
    set(userRef, updatedData)
      .then(()=>{ alert("Profile updated successfully!"); closeModal('profileModal'); })
      .catch(err=>alert(err));
  }).catch(err=>alert(err));
};

// ------------------ Change Password ------------------
window.savePassword = function() {
  const email = sessionStorage.getItem("userEmail");
  const oldPw = document.getElementById("oldPassword").value.trim();
  const newPw = document.getElementById("newPassword").value.trim();
  if(!oldPw || !newPw){ alert("Fill both fields"); return; }

  const userRef = ref(db, 'users/' + email.replace('.',','));
  get(userRef).then(snapshot=>{
    if(snapshot.exists()){
      const data = snapshot.val();
      if(data.password === oldPw){
        set(userRef, {...data, password: newPw})
          .then(()=>{ alert("Password updated!"); closeModal('passwordModal'); })
          .catch(err=>alert(err));
      } else alert("Old password is incorrect!");
    } else alert("User data not found!");
  }).catch(err=>alert(err));
};

// ------------------ Expense Management ------------------
window.openExpenseModal = function(){
  document.getElementById("expenseModal").classList.remove("hidden");
};

window.saveExpense = function(){
  const note = document.getElementById("expenseNote").value.trim();
  const amount = parseFloat(document.getElementById("expenseAmount").value);
  const category = document.getElementById("expenseCategory").value;
  const email = sessionStorage.getItem("userEmail");

  if(!note || !amount || !category){ alert("Fill all fields"); return; }

  const expenseRef = ref(db, 'users/' + email.replace('.',',') + '/expenses');
  const expenseData = { note, amount, category, timestamp: Date.now() };

  push(expenseRef, expenseData)
    .then(()=>{
      alert("Expense Added!");
      closeModal("expenseModal");
      document.getElementById("expenseNote").value = "";
      document.getElementById("expenseAmount").value = "";
      updateDashboard();
    })
    .catch(err => alert(err));
};

// ------------------ Dashboard Stats ------------------
window.updateDashboard = function(){
  const email = sessionStorage.getItem("userEmail");
  if(!email) return;

  const userRef = ref(db, 'users/' + email.replace('.',','));
  get(userRef).then(snapshot=>{
    if(snapshot.exists()){
      const data = snapshot.val();
      const budget = parseFloat(data.budget) || 0;
      const expenses = data.expenses ? Object.values(data.expenses) : [];

      const now = new Date();
      const thisMonth = now.getMonth();
      const thisYear = now.getFullYear();

      let thisMonthSpent = 0;
      let prevMonthSpent = 0;
      let categoryTotals = {};

      expenses.forEach(exp=>{
        const d = new Date(exp.timestamp);
        if(d.getFullYear() === thisYear && d.getMonth() === thisMonth) thisMonthSpent += exp.amount;
        else if(d.getFullYear() === thisYear && d.getMonth() === thisMonth-1) prevMonthSpent += exp.amount;

        categoryTotals[exp.category] = (categoryTotals[exp.category] || 0) + exp.amount;
      });

      const remaining = budget - thisMonthSpent;

      document.getElementById("remainingBalance").innerText = `Remaining Balance: Rs. ${remaining}`;
      document.getElementById("thisMonthSpent").innerText = `This Month Spent: Rs. ${thisMonthSpent}`;
      document.getElementById("prevMonthSpent").innerText = `Previous Month Spent: Rs. ${prevMonthSpent}`;

      updatePieChart(categoryTotals);
    }
  }).catch(err=>console.log(err));
};

// ------------------ Pie Chart ------------------
let expenseChart;
function updatePieChart(categoryTotals){
  const ctx = document.getElementById('expenseChart')?.getContext('2d');
  if(!ctx) return;
  const labels = Object.keys(categoryTotals);
  const data = Object.values(categoryTotals);

  if(expenseChart){
    expenseChart.data.labels = labels;
    expenseChart.data.datasets[0].data = data;
    expenseChart.update();
  } else {
    expenseChart = new Chart(ctx, {
      type: 'pie',
      data: { labels, datasets:[{ data, backgroundColor:['#6a5acd','#483d8b','#8ec5fc','#e0c3fc','#ff6b6b'] }] },
      options:{ plugins:{ legend:{ position:'bottom', labels:{ color:'#fff' } } } }
    });
  }
}

// ------------------ Load Dashboard on Page Load ------------------
window.addEventListener("load", ()=>{
  updateDashboard();
});
// ------------------ Open Change Password ------------------
window.openChangePassword = function() {
  document.getElementById("passwordModal").classList.remove("hidden");
  closeSettingsDropdown();
};

// ------------------ Load Expense History ------------------
window.loadExpenseHistory = function () {
  const email = sessionStorage.getItem("userEmail");
  if (!email) return;

  const userRef = ref(db, "users/" + email.replace(".", ",") + "/expenses");
  get(userRef)
    .then((snapshot) => {
      const container = document.getElementById("expenseList");
      container.innerHTML = "";

      if (!snapshot.exists()) {
        container.innerHTML = "<p>No expenses added yet.</p>";
        return;
      }

      const expensesObj = snapshot.val();
      const expenses = Object.entries(expensesObj).sort((a, b) => b[1].timestamp - a[1].timestamp);

      expenses.forEach(([id, exp]) => {
        const date = new Date(exp.timestamp).toLocaleString();
        const div = document.createElement("div");
        div.className = "card";
        div.innerHTML = `
          <strong>${exp.category}</strong> - Rs. ${exp.amount}<br>
          <small>${exp.note}</small><br>
          <small>${date}</small><br>
          <button class="edit-expense-btn">✏️ Edit</button>
          <button class="delete-expense-btn">🗑️ Delete</button>
        `;

        // Edit Button
        div.querySelector(".edit-expense-btn").addEventListener("click", () => {
          const newNote = prompt("Edit Note:", exp.note);
          if (newNote === null) return;
          const newAmountStr = prompt("Edit Amount:", exp.amount);
          if (newAmountStr === null) return;
          const newAmount = parseFloat(newAmountStr);
          if (isNaN(newAmount)) { alert("Invalid amount"); return; }
          const newCategory = prompt("Edit Category (Food, Rent, Entertainment, Transport, Other):", exp.category);
          if (!newCategory) return;

          const expenseRef = ref(db, "users/" + email.replace(".", ",") + "/expenses/" + id);
          set(expenseRef, { ...exp, note: newNote, amount: newAmount, category: newCategory })
            .then(() => {
              alert("Expense updated!");
              loadExpenseHistory();
              updateDashboard();
            })
            .catch(err => console.log(err));
        });

        // Delete Button
        div.querySelector(".delete-expense-btn").addEventListener("click", () => {
          if (!confirm("Are you sure you want to delete this expense?")) return;
          const expenseRef = ref(db, "users/" + email.replace(".", ",") + "/expenses/" + id);
          set(expenseRef, null)
            .then(() => {
              alert("Expense deleted!");
              loadExpenseHistory();
              updateDashboard();
            })
            .catch(err => console.log(err));
        });

        container.appendChild(div);
      });
    })
    .catch((err) => console.log(err));
};

// ------------------ Fix Settings Dropdown ------------------
window.toggleSettingsDropdown = function () {
  const dropdown = document.getElementById("settingsDropdown");
  dropdown.classList.toggle("hidden");
};

// Close dropdown when clicking outside
document.addEventListener("click", (event) => {
  const dropdown = document.getElementById("settingsDropdown");
  const settingsBtn = document.getElementById("settingsBtn");

  if (!dropdown || !settingsBtn) return;

  const isInside = dropdown.contains(event.target) || settingsBtn.contains(event.target);
  if (!isInside) dropdown.classList.add("hidden");
});

// ------------------ Open Change Password ------------------
window.openChangePassword = function () {
  document.getElementById("passwordModal").classList.remove("hidden");
  closeSettingsDropdown();
};

// ------------------ Open Expense History ------------------
window.openExpenseHistory = function () {
  loadExpenseHistory();
  document.getElementById("historyModal").classList.remove("hidden");
  closeSettingsDropdown();
};

// ------------------ Open Profile (View Mode) ------------------
window.openProfile = function() {
  const email = sessionStorage.getItem("userEmail");
  if (!email) {
    alert("User not logged in");
    return;
  }

  const userRef = ref(db, 'users/' + email.replace('.', ','));
  get(userRef)
    .then(snapshot => {
      if (snapshot.exists()) {
        const data = snapshot.val();
        document.getElementById('displayEmail').textContent = data.email || '-';
        document.getElementById('displayName').textContent = data.fullName || '-';
        document.getElementById('displayAge').textContent = data.age || '-';
        document.getElementById('displayBudget').textContent = data.budget || '-';

        // Hide edit form when opening
        document.getElementById('editProfileForm').classList.add('hidden');
        document.querySelector('.profile-display').classList.remove('hidden');

        document.getElementById('profileModal').classList.remove('hidden');
      } else {
        alert("User data not found");
      }
    })
    .catch(err => alert(err));
};

// ------------------ Switch to Edit Mode ------------------
window.editProfileMode = function() {
  document.querySelector('.profile-display').classList.add('hidden');
  document.getElementById('editProfileForm').classList.remove('hidden');

  // Pre-fill inputs
  document.getElementById('editName').value = document.getElementById('displayName').textContent;
  document.getElementById('editAge').value = document.getElementById('displayAge').textContent;
  document.getElementById('editBudget').value = document.getElementById('displayBudget').textContent;
};

// ------------------ Cancel Edit Mode ------------------
window.cancelEditProfile = function() {
  document.getElementById('editProfileForm').classList.add('hidden');
  document.querySelector('.profile-display').classList.remove('hidden');
};

// ------------------ Save Profile Changes ------------------
window.saveProfile = function() {
  const name = document.getElementById('editName').value.trim();
  const age = document.getElementById('editAge').value.trim();
  const budget = document.getElementById('editBudget').value.trim();

  if (!name || !age || !budget) {
    alert("Fill all fields");
    return;
  }

  const email = sessionStorage.getItem("userEmail");
  const userRef = ref(db, 'users/' + email.replace('.', ','));

  get(userRef)
    .then(snapshot => {
      const existingData = snapshot.exists() ? snapshot.val() : {};
      const updatedData = {
        ...existingData,
        fullName: name,
        age: age,
        budget: budget
      };

      set(userRef, updatedData)
        .then(() => {
          alert("Profile updated successfully!");
          // Refresh displayed values
          document.getElementById('displayName').textContent = name;
          document.getElementById('displayAge').textContent = age;
          document.getElementById('displayBudget').textContent = budget;

          cancelEditProfile();
        })
        .catch(err => alert(err));
    })
    .catch(err => alert(err));
};
// ------------------ SETTINGS DROPDOWN ------------------
window.toggleSettingsDropdown = function () {
  const dropdown = document.getElementById("settingsDropdown");
  dropdown.classList.toggle("show");
};

// Close dropdown when clicking outside
document.addEventListener("click", (event) => {
  const dropdown = document.getElementById("settingsDropdown");
  const settingsBtn = document.getElementById("settingsBtn");

  if (!dropdown || !settingsBtn) return;

  // If click is on settings button, skip closing
  if (settingsBtn.contains(event.target)) return;

  // If click is outside dropdown, close it
  if (!dropdown.contains(event.target)) {
    dropdown.classList.remove("show");
  }
});
// ---- THEME TOGGLE USING CSS VARIABLES ----
if (localStorage.getItem("theme") === "dark") {
  document.body.classList.add("dark-mode");
}

window.toggleTheme = function() {
  document.body.classList.toggle("dark-mode");
  const isDark = document.body.classList.contains("dark-mode");
  localStorage.setItem("theme", isDark ? "dark" : "light");
};


