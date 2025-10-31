// top6.js

const classOrder = [
  "一年忠班","二年忠班","三年忠班","三年孝班",
  "四年忠班","五年忠班","五年孝班","六年忠班","六年孝班"
];

const classColors = {
  "一年忠班": "#7EB426",
  "二年忠班": "#f0e055ff",
  "三年忠班": "#FFF3E0",
  "三年孝班": "#FCE4EC",
  "四年忠班": "#f084cfff",
  "五年忠班": "#f3e86aff",
  "五年孝班": "#66f1d3ff",
  "六年忠班": "#f39d93ff",
  "六年孝班": "#a27ddaff"
};

async function fetchTop6() {
  try {
    const res = await fetch('/api/points');
    const data = await res.json();

    const grouped = {};
    data.forEach(d => {
      if (!grouped[d.class]) grouped[d.class] = {};
      if (!grouped[d.class][d.name]) grouped[d.class][d.name] = 0;
      grouped[d.class][d.name] += d.score;
    });

    const grid = document.getElementById("classGrid");

    // 讀取 localStorage 保存的 HOT 資料
    let hotData = JSON.parse(localStorage.getItem("hotTop6")) || {};
    const now = Date.now();

    classOrder.forEach(cls => {
      const students = Object.entries(grouped[cls] || {})
        .map(([name, score]) => ({ name, score }))
        .sort((a, b) => b.score - a.score)
        .slice(0, 6);

      const card = document.createElement("div");
      card.className = "class-card";

      let rows = students.map((s, i) => {
        let rowClass = '';
        let medal = '';
        if (i === 0) { rowClass = 'gold'; medal = '🥇'; }
        else if (i === 1) { rowClass = 'silver'; medal = '🥈'; }
        else if (i === 2) { rowClass = 'bronze'; medal = '🥉'; }

        const key = `${cls}-${s.name}`;
        let hotMark = "";

        if (!hotData[key]) {
          hotData[key] = now; // 新進榜
          hotMark = '<span class="hot">🔥HOT</span>';
        } else {
          const diffDays = (now - hotData[key]) / (1000 * 60 * 60 * 24);
          if (diffDays <= 7) {
            hotMark = '<span class="hot">🔥HOT</span>';
          }
        }

        return `
          <tr class="${rowClass}">
            <td>${medal || i + 1}</td>
            <td>${s.name} ${hotMark}</td>
            <td>${s.score}</td>
          </tr>
        `;
      }).join("");

      card.innerHTML = `
        <div class="class-title" style="background:${classColors[cls] || '#ddd'}">
          ${cls}
        </div>
        <table>
          <tr><th>名次</th><th>姓名</th><th>總分</th></tr>
          ${rows}
        </table>
      `;
      grid.appendChild(card);
    });

    // 更新 HOT 資料
    localStorage.setItem("hotTop6", JSON.stringify(hotData));

  } catch (err) {
    console.error("載入失敗", err);
  }
}

fetchTop6();
