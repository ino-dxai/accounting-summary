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