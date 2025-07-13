import { initializeApp } from "https://www.gstatic.com/firebasejs/11.10.0/firebase-app.js";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/11.10.0/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyBbiAIBN6Ko0aD-xK4DalqxCIK9xJXtdUg",
  authDomain: "todo-list-6032c.firebaseapp.com",
  projectId: "todo-list-6032c",
  storageBucket: "todo-list-6032c.appspot.com",
  messagingSenderId: "511174999556",
  appId: "1:511174999556:web:2a3766a6cfdd6299323f51",
  measurementId: "G-7Q7M2CM7EC"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

document.addEventListener("DOMContentLoaded", () => {
  const loginBtn = document.getElementById("loginBtn");
  const signupBtn = document.getElementById("signupBtn");
  const logoutBtn = document.getElementById("logoutBtn");
  const taskInput = document.getElementById("taskInput");
  const addTaskBtn = document.getElementById("addTaskButton");
  const taskList = document.getElementById("taskList");

  let currentUser = null;

  function loadTasks() {
    const key = currentUser?.uid || "guestTasks";
    const tasks = JSON.parse(localStorage.getItem(key)) || [];
    taskList.innerHTML = "";

    tasks.forEach((task, index) => {
      const li = document.createElement("li");
      li.textContent = `${task.text} (${task.priority})`;
      li.style.textDecoration = task.completed ? "line-through" : "none";

      li.addEventListener("click", () => {
        tasks[index].completed = !tasks[index].completed;
        localStorage.setItem(key, JSON.stringify(tasks));
        loadTasks();
      });

      const delBtn = document.createElement("button");
      delBtn.textContent = "❌";
      delBtn.onclick = () => {
        tasks.splice(index, 1);
        localStorage.setItem(key, JSON.stringify(tasks));
        loadTasks();
      };

      li.appendChild(delBtn);
      taskList.appendChild(li);
    });
  }

  addTaskBtn.addEventListener("click", () => {
    const text = taskInput.value.trim();
    const priority = document.getElementById("taskPriority").value;
    if (!text) return;
    const key = currentUser?.uid || "guestTasks";
    const tasks = JSON.parse(localStorage.getItem(key)) || [];
    tasks.push({ text, completed: false, priority });
    localStorage.setItem(key, JSON.stringify(tasks));
    taskInput.value = "";
    loadTasks();
  });

  signupBtn.addEventListener("click", async () => {
    const email = prompt("Enter email:");
    const password = prompt("Enter password:");
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      alert("Signup successful");
    } catch (e) {
      alert(e.message);
    }
  });

  loginBtn.addEventListener("click", async () => {
    const email = prompt("Enter email:");
    const password = prompt("Enter password:");
    try {
      await signInWithEmailAndPassword(auth, email, password);
      alert("Login successful");
    } catch (e) {
      alert(e.message);
    }
  });

  logoutBtn.addEventListener("click", async () => {
    await signOut(auth);
    alert("Logged out");
  });

  onAuthStateChanged(auth, (user) => {
    currentUser = user || null;
    loginBtn.style.display = currentUser ? "none" : "inline";
    signupBtn.style.display = currentUser ? "none" : "inline";
    logoutBtn.style.display = currentUser ? "inline" : "none";
    document.getElementById("taskInputSection").style.display = currentUser ? "block" : "none";

    if (currentUser) {
      loadTasks();
    } else {
      taskList.innerHTML = "";
    }
  });
});
