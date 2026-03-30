const loginScreen = document.getElementById("loginScreen");
const panelScreen = document.getElementById("panelScreen");
const loginForm = document.getElementById("loginForm");
const logoutBtn = document.getElementById("logoutBtn");

const views = [...document.querySelectorAll(".view")];
const sideButtons = [...document.querySelectorAll(".side-btn")];
const tabs = [...document.querySelectorAll(".tab")];

function showPanel() {
  loginScreen.classList.remove("is-active");
  panelScreen.classList.add("is-active");
}

function showLogin() {
  panelScreen.classList.remove("is-active");
  loginScreen.classList.add("is-active");
}

function setActiveView(viewId) {
  views.forEach((view) => {
    view.classList.toggle("is-active", view.id === viewId);
  });

  sideButtons.forEach((button) => {
    button.classList.toggle("is-active", button.dataset.view === viewId);
  });

  tabs.forEach((tab) => {
    tab.classList.toggle("is-active", tab.dataset.view === viewId);
  });
}

loginForm.addEventListener("submit", (event) => {
  event.preventDefault();
  showPanel();
});

logoutBtn.addEventListener("click", () => {
  showLogin();
});

sideButtons.forEach((button) => {
  button.addEventListener("click", () => setActiveView(button.dataset.view));
});

tabs.forEach((tab) => {
  tab.addEventListener("click", () => setActiveView(tab.dataset.view));
});

setActiveView("dashboardView");
