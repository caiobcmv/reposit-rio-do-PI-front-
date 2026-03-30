const ls = document.getElementById("ls");
const ps = document.getElementById("ps");
const fab = document.getElementById("fab");
const views = [...document.querySelectorAll(".view")];
const sbBtns = [...document.querySelectorAll(".sb-btn")];
const tabs = [...document.querySelectorAll(".tt")];

function showPanel() {
  ls.classList.remove("on");
  ps.classList.add("on");
  fab.style.display = "flex";
  setV("dv");
}

function showLogin() {
  ps.classList.remove("on");
  ls.classList.add("on");
  fab.style.display = "none";
}

function setV(id) {
  views.forEach((v) => v.classList.toggle("on", v.id === id));
  sbBtns.forEach((b) => b.classList.toggle("on", b.dataset.v === id));
  tabs.forEach((t) => t.classList.toggle("on", t.dataset.v === id));
}

document.getElementById("lf").addEventListener("submit", (e) => {
  e.preventDefault();
  showPanel();
});
document.getElementById("lb").addEventListener("click", showLogin);
document.getElementById("bnp").addEventListener("click", () => setV("pv"));
sbBtns.forEach((b) => b.addEventListener("click", () => setV(b.dataset.v)));
tabs.forEach((t) => t.addEventListener("click", () => setV(t.dataset.v)));
document.querySelectorAll(".tg").forEach((b) => {
  b.addEventListener("click", function () {
    this.closest(".tgg")
      .querySelectorAll(".tg")
      .forEach((x) => x.classList.remove("on"));
    this.classList.add("on");
  });
});
