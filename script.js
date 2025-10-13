import { initializeApp } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-app.js";
import { 
  getFirestore, collection, addDoc, getDocs, deleteDoc, updateDoc, doc 
} from "https://www.gstatic.com/firebasejs/10.14.1/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyCXbdwJ317FUeQjYoPtLMxJLjhdbClnT60",
  authDomain: "week-6-24a71.firebaseapp.com",
  projectId: "week-6-24a71",
  storageBucket: "week-6-24a71.firebasestorage.app",
  messagingSenderId: "822076178029",
  appId: "1:822076178029:web:045bc49ebde7e1d85d4964",
  measurementId: "G-1CYH98TSC3"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const form = document.getElementById("contactForm");
const message = document.getElementById("message");
const contactsList = document.getElementById("contactsList");
let editId = null; 

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const firstName = document.getElementById("firstName").value.trim();
  const lastName = document.getElementById("lastName").value.trim();
  const email = document.getElementById("email").value.trim();

  if (!firstName || !lastName || !email) {
    message.textContent = "⚠️ Please fill in all fields!";
    message.style.color = "red";
    return;
  }

  try {
    if (editId) {

      const contactRef = doc(db, "contacts", editId);
      await updateDoc(contactRef, { firstName, lastName, email });
      message.textContent = "✅ Contact updated successfully!";
      editId = null;
    } else {
 
      await addDoc(collection(db, "contacts"), { firstName, lastName, email });
      message.textContent = "✅ Contact added successfully!";
    }

    message.style.color = "green";
    form.reset();
    loadContacts();
  } catch (error) {
    message.textContent = "❌ Error: " + error.message;
    message.style.color = "red";
  }
});

async function loadContacts() {
  contactsList.innerHTML = "";
  const querySnapshot = await getDocs(collection(db, "contacts"));

  querySnapshot.forEach((docSnap) => {
    const contact = docSnap.data();
    const row = document.createElement("tr");

    row.innerHTML = `
      <td>${contact.firstName}</td>
      <td>${contact.lastName}</td>
      <td>${contact.email}</td>
      <td>
        <button onclick="editContact('${docSnap.id}', '${contact.firstName}', '${contact.lastName}', '${contact.email}')">✏️ Edit</button>
        <button onclick="deleteContact('${docSnap.id}')">🗑️ Delete</button>
      </td>
    `;
    contactsList.appendChild(row);
  });
}

window.deleteContact = async (id) => {
  await deleteDoc(doc(db, "contacts", id));
  message.textContent = "🗑️ Contact deleted!";
  message.style.color = "orange";
  loadContacts();
};

window.editContact = (id, firstName, lastName, email) => {
  editId = id;
  document.getElementById("firstName").value = firstName;
  document.getElementById("lastName").value = lastName;
  document.getElementById("email").value = email;
  message.textContent = "✏️ Editing contact. Click Submit to save changes.";
  message.style.color = "blue";
};

loadContacts();
