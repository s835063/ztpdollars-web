// top30.js

async function fetchTop30() {
  try {
    const res = await fetch('/api/points');
    const data = await res.json();

    // 計算每位學生總分
    const totals = {};
    data.forEach(d => {
      const key = `${d.class}-${d.name}-${d.seat_no}`;
      if (!totals[key]) totals[key] = { ...d, score: 0 };
      totals[key].score += d.score;
    });

    // 排序取前30
    const sorted = Object.values(totals)
      .sort((a, b) => b.score - a.score)
      .slice(0, 30);

    const table = document.getElementById("top30Table");

    // 讀取 localStorage 保存的 HOT 資料
    let hotData = JSON.parse(localStorage.getItem("hotTop30")) || {};
    const now = Date.now();

    sorted.forEach((s, i) => {
      let rowClass = '';
      let medal = '';
      if (i === 0) { rowClass = 'gold'; medal = '🥇'; }
      else if (i === 1) { rowClass = 'silver'; medal = '🥈'; }
      else if (i === 2) { rowClass = 'bronze'; medal = '🥉'; }

      const key = `${s.class}-${s.name}-${s.seat_no}`;
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

      const tr = document.createElement("tr");
      tr.className = rowClass;
      tr.innerHTML = `
        <td>${medal || i + 1}</td>
        <td>${s.class}</td>
        <td>${s.seat_no}</td>
        <td>${s.name} ${hotMark}</td>
        <td>${s.score}</td>
      `;
      table.appendChild(tr);
    });

    // 更新 HOT 資料
    localStorage.setItem("hotTop30", JSON.stringify(hotData));

  } catch (err) {
    console.error("載入失敗", err);
  }
}

fetchTop30();
