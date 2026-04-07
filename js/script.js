// ---- カレンダー・時計 ----
let calYear, calMonth;

function getWareki(year, month) {
    if (year > 2019 || (year === 2019 && month >= 5)) {
        const n = year - 2018;
        return `令和${n === 1 ? '元' : n}年`;
    }
    // 令和以前は表示しない（前月ボタンで制限済み）
    return `${year}年`;
}

function renderCalendar(year, month) {
    const wareki = getWareki(year, month);
    const firstDay = new Date(year, month - 1, 1).getDay(); // 0=日曜
    const lastDate = new Date(year, month, 0).getDate();
    const today = new Date();

    let html = `<div class="cal-header">
        <button id="calPrev">◀</button>
        <span>${wareki}${month}月</span>
        <button id="calNext">▶</button>
    </div>
    <table class="cal-table">
        <thead><tr>
            <th class="sun">日</th><th>月</th><th>火</th><th>水</th><th>木</th><th>金</th><th class="sat">土</th>
        </tr></thead>
        <tbody>`;

    let day = 1;
    for (let row = 0; row < 6; row++) {
        html += '<tr>';
        for (let col = 0; col < 7; col++) {
            const cellIndex = row * 7 + col;
            if (cellIndex < firstDay || day > lastDate) {
                html += '<td></td>';
            } else {
                const isToday = today.getFullYear() === year &&
                                today.getMonth() + 1 === month &&
                                today.getDate() === day;
                let cls = '';
                if (isToday) cls = 'today';
                else if (col === 0) cls = 'sun';
                else if (col === 6) cls = 'sat';
                html += `<td${cls ? ` class="${cls}"` : ''}>${day}</td>`;
                day++;
            }
        }
        html += '</tr>';
        if (day > lastDate) break;
    }
    html += '</tbody></table>';

    document.getElementById('calendar').innerHTML = html;

    document.getElementById('calPrev').addEventListener('click', () => {
        calMonth--;
        if (calMonth < 1) { calMonth = 12; calYear--; }
        // 令和元年5月より前には戻らない
        if (calYear < 2019 || (calYear === 2019 && calMonth < 5)) {
            calYear = 2019; calMonth = 5;
        }
        renderCalendar(calYear, calMonth);
    });

    document.getElementById('calNext').addEventListener('click', () => {
        calMonth++;
        if (calMonth > 12) { calMonth = 1; calYear++; }
        renderCalendar(calYear, calMonth);
    });
}

function updateClock() {
    const now = new Date();
    const h = String(now.getHours()).padStart(2, '0');
    const m = String(now.getMinutes()).padStart(2, '0');
    const s = String(now.getSeconds()).padStart(2, '0');
    const el = document.getElementById('clock');
    if (el) el.textContent = `${h}:${m}:${s}`;
}
// ---- ここまで ----

const sampleData = {
    lastUpdated: new Date().toLocaleString('ja-JP'),
    stats: {
        totalCount: 2847,
        todayCount: 42,
        categories: {
            agree: 1203,
            disagree: 892,
            neutral: 752
        }
    },
    opinions: [
        {
            id: 1,
            text: "freeeを使ってから経理業務が楽になった。",
            category: "agree",
            source: "X",
            date: "2024-01-20",
            software: "freee"
        }
    ]
};

document.addEventListener('DOMContentLoaded', async () => {
    // カレンダー初期化
    const now = new Date();
    calYear = now.getFullYear();
    calMonth = now.getMonth() + 1;
    renderCalendar(calYear, calMonth);

    // 時計起動
    updateClock();
    setInterval(updateClock, 1000);

    try {
        let data = sampleData;
        
        try {
            const response = await fetch('data/processed.json');
            if (response.ok) {
                data = await response.json();
            }
        } catch (error) {
            console.log('processed.json が見つかりません');
        }
        
        document.getElementById('lastUpdate').textContent = data.lastUpdated;
        document.getElementById('totalCount').textContent = data.stats.totalCount.toLocaleString();
        
    } catch (error) {
        console.error('エラー:', error);
    }
});