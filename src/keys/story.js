function loadTree() {
  const key = "forest_tree_lit_branches";
  const arr = JSON.parse(localStorage.getItem(key) || "[]");
  const countEl = document.getElementById("branch-count");

  let count = 0;

  arr.forEach(lv => {
    const b = document.getElementById("b" + lv);
    const bl = document.getElementById("bl" + lv);
    if (b) b.classList.add("awakened");
    if (bl) bl.classList.add("awakened");
    count++;
  });

  countEl.textContent = count;
}

window.addEventListener("DOMContentLoaded", loadTree);
