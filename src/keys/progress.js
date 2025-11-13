function loadProgress() {
  const KEY = "stroke_therapy_sessions_v1";
  const arr = JSON.parse(localStorage.getItem(KEY) || "[]");
  const body = document.getElementById("progress-body");

  body.innerHTML = "";

  arr.forEach(entry => {
    const row = document.createElement("tr");

    const date = new Date(entry.when).toLocaleString();

    row.innerHTML = `
      <td>${date}</td>
      <td>${entry.score}</td>
      <td>${entry.levelsCompleted}</td>
      <td>${entry.accuracy}%</td>
      <td>${entry.timeSec}</td>
      <td>${entry.correct}</td>
      <td>${entry.wrong}</td>
    `;

    body.appendChild(row);
  });
}

function exportCSV() {
  const KEY = "stroke_therapy_sessions_v1";
  const arr = JSON.parse(localStorage.getItem(KEY) || "[]");

  let csv = "Date,Score,Levels,Accuracy,Time,Correct,Wrong\n";

  arr.forEach(e => {
    const date = new Date(e.when).toLocaleString();
    csv += `${date},${e.score},${e.levelsCompleted},${e.accuracy},${e.timeSec},${e.correct},${e.wrong}\n`;
  });

  const blob = new Blob([csv], { type: "text/csv" });
  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = "therapy_progress.csv";
  a.click();
  URL.revokeObjectURL(url);
}

document.addEventListener("DOMContentLoaded", () => {
  loadProgress();
  document.getElementById("export").addEventListener("click", exportCSV);
});
