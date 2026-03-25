// Dashboard Logic for AION Health
import Chart from 'chart.js/auto';

document.addEventListener('DOMContentLoaded', () => {
    initMiniCharts();
    initModalLogic();
});

function initMiniCharts() {
    const ctxHr = document.getElementById('mini-heart-rate-chart')?.getContext('2d');
    const ctxSpo2 = document.getElementById('mini-spo2-chart')?.getContext('2d');

    if (ctxHr) {
        new Chart(ctxHr, {
            type: 'line',
            data: {
                labels: Array(20).fill(''),
                datasets: [{
                    data: [65, 68, 75, 82, 78, 80, 85, 82, 80, 82, 84, 86, 82, 80, 78, 80, 82, 81, 82, 83],
                    borderColor: '#0081ff',
                    borderWidth: 2,
                    pointRadius: 0,
                    tension: 0.4,
                    fill: true,
                    backgroundColor: 'rgba(0, 129, 255, 0.1)'
                }]
            },
            options: chartOptionsMini()
        });
    }

    if (ctxSpo2) {
        new Chart(ctxSpo2, {
            type: 'line',
            data: {
                labels: Array(20).fill(''),
                datasets: [{
                    data: [98, 97, 98, 99, 98, 98, 97, 98, 98, 99, 98, 98, 97, 98, 98, 99, 98, 98, 97, 98],
                    borderColor: '#00cec9',
                    borderWidth: 2,
                    pointRadius: 0,
                    tension: 0.4,
                    fill: true,
                    backgroundColor: 'rgba(0, 206, 201, 0.1)'
                }]
            },
            options: chartOptionsMini()
        });
    }
}

function chartOptionsMini() {
    return {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { display: false } },
        scales: {
            x: { display: false },
            y: { display: false, min: 50 }
        }
    };
}

function initModalLogic() {
    const modal = document.getElementById('graph-modal');
    const wrapper = document.getElementById('dashboard-wrapper');
    const closeBtn = document.getElementById('close-modal');
    const clickableCharts = document.querySelectorAll('.clickable-chart');

    let mainChart = null;
    let scrollChart = null;

    const openModal = () => {
        modal.classList.remove('hidden');
        wrapper.classList.add('modal-active');
        document.body.style.overflow = 'hidden';
        initModalCharts();
    };

    const closeModal = () => {
        modal.classList.add('hidden');
        wrapper.classList.remove('modal-active');
        document.body.style.overflow = '';
        if (mainChart) mainChart.destroy();
        if (scrollChart) scrollChart.destroy();
    };

    clickableCharts.forEach(card => card.addEventListener('click', openModal));
    closeBtn.addEventListener('click', closeModal);
    modal.addEventListener('click', (e) => {
        if (e.target === modal) closeModal();
    });

    function initModalCharts() {
        const ctxMain = document.getElementById('modal-main-chart').getContext('2d');
        const ctxScroll = document.getElementById('modal-scroll-chart').getContext('2d');

        // Synthetic ECG Data
        const ecgData = [];
        for (let i = 0; i < 200; i++) {
            let val = 0.2 + Math.random() * 0.1;
            if (i % 20 === 0) val = 0.8; // Peak
            if (i % 20 === 1) val = -0.1; // Dip
            ecgData.push(val);
        }

        mainChart = new Chart(ctxMain, {
            type: 'line',
            data: {
                labels: ecgData.map((_, i) => `${(i * 0.05).toFixed(1)}s`),
                datasets: [{
                    label: 'ECG',
                    data: ecgData,
                    borderColor: '#0081ff',
                    borderWidth: 1.5,
                    pointRadius: 0,
                    tension: 0.3
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: { legend: { display: false } },
                scales: {
                    x: {
                        grid: { color: 'rgba(0,0,0,0.05)' },
                        ticks: { font: { size: 10 }, maxRotation: 0, autoSkip: true, maxTicksLimit: 12 }
                    },
                    y: {
                        min: -0.3,
                        max: 1.1,
                        grid: { color: 'rgba(0,0,0,0.05)' },
                        ticks: { stepSize: 0.2 }
                    }
                }
            }
        });

        scrollChart = new Chart(ctxScroll, {
            type: 'line',
            data: {
                labels: ecgData.map((_, i) => i),
                datasets: [{
                    data: ecgData,
                    borderColor: 'rgba(0, 129, 255, 0.3)',
                    borderWidth: 1,
                    pointRadius: 0,
                    fill: true,
                    backgroundColor: 'rgba(0, 129, 255, 0.1)',
                    tension: 0.1
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: { legend: { display: false } },
                scales: {
                    x: { display: false },
                    y: { display: false }
                }
            }
        });
    }
}
