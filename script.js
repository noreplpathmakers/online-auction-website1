// Initialize Lucide Icons
console.log("AuctionWave Script: Initializing...");
lucide.createIcons();

// Theme-aware chart colors helper
window.auctionCharts = []; // Registry for active charts

const getChartColors = () => {
    const isLightMode = document.body.classList.contains('light-mode');
    return {
        axisColor: isLightMode ? '#1e293b' : 'rgba(203, 213, 225, 0.9)',
        gridColor: isLightMode ? 'rgba(0, 0, 0, 0.1)' : 'rgba(255, 255, 255, 0.05)',
        tooltipBg: isLightMode ? 'rgba(255, 255, 255, 0.95)' : 'rgba(26, 11, 46, 0.95)',
        tooltipText: isLightMode ? '#1e293b' : '#fff',
        tooltipBorder: isLightMode ? 'rgba(99, 102, 241, 0.3)' : 'rgba(168, 85, 247, 0.2)',
        legendColor: isLightMode ? '#334155' : '#cbd5e1'
    };
};

// Live Growth Chart
let liveChart;
const chartCanvas = document.getElementById('liveChart');

if (chartCanvas) {
    const ctx = chartCanvas.getContext('2d');

    // Create gradient for the line
    const gradient = ctx.createLinearGradient(0, 0, 0, 400);
    gradient.addColorStop(0, 'rgba(168, 85, 247, 0.8)');
    gradient.addColorStop(0.5, 'rgba(6, 182, 212, 0.6)');
    gradient.addColorStop(1, 'rgba(59, 130, 246, 0.4)');

    // Create gradient for the fill
    const fillGradient = ctx.createLinearGradient(0, 0, 0, 400);
    fillGradient.addColorStop(0, 'rgba(168, 85, 247, 0.3)');
    fillGradient.addColorStop(0.5, 'rgba(6, 182, 212, 0.2)');
    fillGradient.addColorStop(1, 'rgba(59, 130, 246, 0.05)');

    // Initial data
    const labels = [];
    const data = [];
    const now = new Date();

    // Generate initial 20 data points
    for (let i = 19; i >= 0; i--) {
        const time = new Date(now - i * 3000); // 3 seconds apart
        labels.push(time.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
        data.push(Math.floor(Math.random() * 30) + 70); // Random values between 70-100
    }

    liveChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                label: 'Active Bids',
                data: data,
                borderColor: gradient,
                backgroundColor: fillGradient,
                borderWidth: 3,
                fill: true,
                tension: 0.4,
                pointRadius: 0,
                pointHoverRadius: 6,
                pointHoverBackgroundColor: '#06b6d4',
                pointHoverBorderColor: '#fff',
                pointHoverBorderWidth: 2
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            animation: {
                duration: 750,
                easing: 'easeInOutQuart'
            },
            interaction: {
                intersect: false,
                mode: 'index'
            },
            plugins: {
                legend: {
                    display: false
                },
                tooltip: {
                    backgroundColor: 'rgba(26, 11, 46, 0.95)',
                    titleColor: '#06b6d4',
                    bodyColor: '#fff',
                    borderColor: 'rgba(168, 85, 247, 0.5)',
                    borderWidth: 1,
                    padding: 12,
                    displayColors: false,
                    callbacks: {
                        label: function (context) {
                            return 'Bids: ' + context.parsed.y;
                        }
                    }
                }
            },
            scales: {
                x: {
                    display: true,
                    grid: {
                        color: document.body.classList.contains('light-mode') ? 'rgba(99, 102, 241, 0.15)' : 'rgba(168, 85, 247, 0.1)',
                        drawBorder: false
                    },
                    ticks: {
                        color: document.body.classList.contains('light-mode') ? '#1e293b' : 'rgba(148, 163, 184, 0.8)',
                        maxRotation: 0,
                        autoSkipPadding: 20,
                        font: {
                            size: 11,
                            weight: '500'
                        }
                    }
                },
                y: {
                    display: true,
                    grid: {
                        color: document.body.classList.contains('light-mode') ? 'rgba(99, 102, 241, 0.15)' : 'rgba(168, 85, 247, 0.1)',
                        drawBorder: false
                    },
                    ticks: {
                        color: document.body.classList.contains('light-mode') ? '#1e293b' : 'rgba(148, 163, 184, 0.8)',
                        font: {
                            size: 11,
                            weight: '500'
                        },
                        callback: function (value) {
                            return value;
                        }
                    },
                    beginAtZero: false,
                    min: 50,
                    max: 120
                }
            }
        }
    });

    // Update chart data every 2 seconds
    setInterval(() => {
        const now = new Date();
        const newLabel = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
        const newValue = Math.floor(Math.random() * 30) + 70; // Random value between 70-100

        // Add new data
        liveChart.data.labels.push(newLabel);
        liveChart.data.datasets[0].data.push(newValue);

        // Remove old data (keep only last 20 points)
        if (liveChart.data.labels.length > 20) {
            liveChart.data.labels.shift();
            liveChart.data.datasets[0].data.shift();
        }

        // Update chart
        liveChart.update('none'); // 'none' for smooth animation
    }, 2000);
}

// Initialize Lenis Smooth Scroll
if (typeof Lenis !== 'undefined') {
    const lenis = new Lenis({
        duration: 1.2,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        smoothWheel: true
    });

    function raf(time) {
        lenis.raf(time);
        requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);
} else {
    console.warn("AuctionWave Script: Lenis library not detected.");
}

// Mobile Menu Logic
const mobileMenuBtn = document.getElementById('mobile-menu-btn');
const closeMenuBtn = document.getElementById('close-menu-btn');
const mobileMenu = document.getElementById('mobile-menu');
const mobileLinks = document.querySelectorAll('.mobile-link');

function openMenu() {
    mobileMenu.classList.remove('translate-x-full', 'opacity-0', 'invisible');
    document.body.style.overflow = 'hidden';
    mobileMenuBtn.classList.add('active');
}

function closeMenu() {
    mobileMenu.classList.add('translate-x-full', 'opacity-0', 'invisible');
    document.body.style.overflow = 'auto';
    mobileMenuBtn.classList.remove('active');
}

if (mobileMenuBtn) {
    mobileMenuBtn.addEventListener('click', () => {
        if (mobileMenu.classList.contains('translate-x-full')) {
            openMenu();
        } else {
            closeMenu();
        }
    });

    mobileLinks.forEach(link => {
        link.addEventListener('click', closeMenu);
    });
}

// Intersection Observer for Reveal Animations
const revealElements = document.querySelectorAll('.reveal, .counter');

const animateCounters = (element) => {
    let counters = [];
    if (element.classList.contains('counter')) {
        counters = [element];
    } else {
        counters = Array.from(element.querySelectorAll('.counter'));
    }
    counters.forEach(counter => {
        if (counter.classList.contains('animated')) return;

        const targetStr = counter.getAttribute('data-target') || counter.innerText.replace(/[^0-9.]/g, '');
        const target = parseFloat(targetStr);
        if (isNaN(target)) return;

        const prefix = counter.getAttribute('data-prefix') || '';
        const suffix = counter.getAttribute('data-suffix') || '';
        const duration = parseInt(counter.getAttribute('data-duration')) || 2000;
        const decimals = (targetStr.split('.')[1] || []).length;

        let startTimestamp = null;
        const step = (timestamp) => {
            if (!startTimestamp) startTimestamp = timestamp;
            const progress = Math.min((timestamp - startTimestamp) / duration, 1);
            const current = progress * target;

            counter.innerText = prefix + current.toLocaleString(undefined, {
                minimumFractionDigits: decimals,
                maximumFractionDigits: decimals
            }) + suffix;

            if (progress < 1) {
                window.requestAnimationFrame(step);
            } else {
                counter.innerText = prefix + target.toLocaleString(undefined, {
                    minimumFractionDigits: decimals,
                    maximumFractionDigits: decimals
                }) + suffix;
                counter.classList.add('animated');
            }
        };
        window.requestAnimationFrame(step);
    });
};

const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('active');
            entry.target.classList.remove('opacity-0');

            // Trigger counters if this element contains counters
            if (entry.target.querySelector('.counter') || entry.target.classList.contains('counter')) {
                animateCounters(entry.target);
            }

            // If it's a section, trigger child reveals if any
            const children = entry.target.querySelectorAll('.reveal-child');
            children.forEach((child, index) => {
                setTimeout(() => {
                    child.classList.add('active');
                }, index * 100);
            });
        }
    });
}, {
    threshold: 0.1,
    rootMargin: '0px'
});

revealElements.forEach(el => revealObserver.observe(el));
console.log(`AuctionWave Script: Observing ${revealElements.length} reveal elements.`);

// Creations Grid Logic (Auto-sliding and Hover)
const creativeItems = document.querySelectorAll('.creative-item');
let activeIndex = 0;
let isHovered = false;

const auctionData = [
    { title: "Exotic Automobiles", description: "Rare vintage classics and limited-edition modern hypercars from history's most iconic manufacturers." },
    { title: "Fine Horology", description: "Precision timekeeping and artisanal craftsmanship from the world's most elite Swiss watchmakers." },
    { title: "Elite Real Estate", description: "Extraordinary architectural masterpieces and private islands located in the world's most desirable locales." }
];

function updateCreationsGrid() {
    if (isHovered) return;

    creativeItems.forEach((item, index) => {
        const contentDiv = item.querySelector('div');
        const h1 = item.querySelector('h1');
        const p = item.querySelector('p');

        if (index === activeIndex) {
            item.classList.add('active', 'w-full');
            item.classList.remove('w-56');
            contentDiv.classList.add('opacity-100');
            contentDiv.classList.remove('opacity-0');
            h1.innerText = auctionData[index].title;
            p.innerText = auctionData[index].description;
        } else {
            item.classList.remove('active', 'w-full');
            item.classList.add('w-56');
            contentDiv.classList.remove('opacity-100');
            contentDiv.classList.add('opacity-0');
        }
    });

    activeIndex = (activeIndex + 1) % creativeItems.length;
}

const creationInterval = setInterval(updateCreationsGrid, 3000);

creativeItems.forEach((item, index) => {
    item.addEventListener('mouseenter', () => {
        isHovered = true;
        creativeItems.forEach((i, idx) => {
            i.classList.remove('active', 'w-full');
            i.classList.add('w-56');
            const cDiv = i.querySelector('div');
            cDiv.classList.remove('opacity-100');
            cDiv.classList.add('opacity-0');
        });
        item.classList.add('w-full');
        item.classList.remove('w-56');
        const contentDiv = item.querySelector('div');
        contentDiv.classList.add('opacity-100');
        contentDiv.classList.remove('opacity-0');
        item.querySelector('h1').innerText = auctionData[index].title;
        item.querySelector('p').innerText = auctionData[index].description;
    });

    item.addEventListener('mouseleave', () => {
        isHovered = false;
    });
});

// Tilted Image Mouse Follow Effect
const tiltContainer = document.getElementById('tilted-image-container');
if (tiltContainer) {
    const img = tiltContainer.querySelector('img');

    tiltContainer.addEventListener('mousemove', (e) => {
        const { left, top, width, height } = tiltContainer.getBoundingClientRect();
        const x = (e.clientX - left) / width;
        const y = (e.clientY - top) / height;

        const rotateX = (y - 0.5) * 10; // Degrees
        const rotateY = (x - 0.5) * -10;

        img.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.05, 1.05, 1.05)`;
        img.style.transition = 'none';
    });

    tiltContainer.addEventListener('mouseleave', () => {
        img.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)`;
        img.style.transition = 'transform 0.5s ease';
    });
}

// Form Submission Simulation
const contactForm = document.getElementById('contact-form');
if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const btn = e.target.querySelector('button');
        const originalText = btn.innerHTML;

        btn.innerText = 'Sending...';
        btn.disabled = true;

        setTimeout(() => {
            btn.innerText = 'Success!';
            btn.classList.replace('bg-indigo-600', 'bg-green-600');
            e.target.reset();

            setTimeout(() => {
                btn.innerHTML = originalText;
                btn.classList.replace('bg-green-600', 'bg-indigo-600');
                btn.disabled = false;
            }, 3000);
        }, 1500);
    });
}

// Tilted Hero Parallax Effect
const tiltedGrid = document.getElementById('tilted-hero-grid');
if (tiltedGrid) {
    window.addEventListener('mousemove', (e) => {
        const x = (e.clientX / window.innerWidth - 0.5) * 80; // Max 40px movement
        const y = (e.clientY / window.innerHeight - 0.5) * 80;
        const isRTL = document.documentElement.getAttribute('dir') === 'rtl';
        const baseTranslateX = isRTL ? '25%' : '-25%';
        const rotation = isRTL ? '12deg' : '-12deg';
        const moveX = isRTL ? -x : x; // Flip mouse movement for naturally feeling parallax in RTL

        tiltedGrid.style.transform = `translate(calc(${baseTranslateX} + ${moveX}px), calc(-50% + ${y}px)) rotate(${rotation})`;
    });
}
// User Dashboard Charts Initialization
const initDashboardCharts = () => {
    const colors = getChartColors();
    const chartDefaults = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                display: false
            },
            tooltip: {
                backgroundColor: colors.tooltipBg,
                titleColor: '#a855f7',
                bodyColor: colors.tooltipText,
                borderColor: colors.tooltipBorder,
                borderWidth: 1,
                padding: 12,
                displayColors: false,
                cornerRadius: 12
            }
        },
        scales: {
            x: {
                grid: {
                    display: true,
                    drawOnChartArea: false,
                    drawBorder: true,
                    borderColor: colors.axisColor,
                    color: colors.gridColor
                },
                ticks: { color: colors.axisColor, font: { size: 12, weight: '500' } }
            },
            y: {
                grid: {
                    display: true,
                    drawBorder: true,
                    borderColor: colors.axisColor,
                    color: colors.gridColor
                },
                ticks: { color: colors.axisColor, font: { size: 12, weight: '500' } }
            }
        }
    };

    // 1. Line Chart: Bidding Activity
    const lineCtx = document.getElementById('lineChart');
    if (lineCtx) {
        const chart = new Chart(lineCtx, {
            type: 'line',
            data: {
                labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
                datasets: [{
                    label: 'Bids',
                    data: [12, 19, 15, 25, 22, 30, 28],
                    borderColor: '#06b6d4',
                    borderWidth: 3,
                    tension: 0.4,
                    pointRadius: 0,
                    pointHoverRadius: 6,
                    fill: false
                }]
            },
            options: chartDefaults
        });
        window.auctionCharts.push(chart);
    }

    // 2. Area Chart: Portfolio Value
    const areaCtx = document.getElementById('areaChart');
    if (areaCtx) {
        const gradient = areaCtx.getContext('2d').createLinearGradient(0, 0, 0, 300);
        gradient.addColorStop(0, 'rgba(168, 85, 247, 0.4)');
        gradient.addColorStop(1, 'rgba(168, 85, 247, 0)');

        const chart = new Chart(areaCtx, {
            type: 'line',
            data: {
                labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
                datasets: [{
                    label: 'Value',
                    data: [0.2, 0.5, 0.4, 0.8, 1.1, 1.2],
                    borderColor: '#a855f7',
                    backgroundColor: gradient,
                    fill: true,
                    tension: 0.4,
                    pointRadius: 0
                }]
            },
            options: {
                ...chartDefaults,
                scales: {
                    ...chartDefaults.scales,
                    y: { ...chartDefaults.scales.y, ticks: { ...chartDefaults.scales.y.ticks, callback: (v) => '$' + v + 'M' } }
                }
            }
        });
        window.auctionCharts.push(chart);
    }

    // 3. Column Chart: Bid Frequency
    const columnCtx = document.getElementById('columnChart');
    if (columnCtx) {
        const chart = new Chart(columnCtx, {
            type: 'bar',
            data: {
                labels: ['Auto', 'Watch', 'Art', 'Estate', 'Jewelry'],
                datasets: [{
                    data: [45, 30, 60, 20, 35],
                    backgroundColor: ['#3b82f6', '#06b6d4', '#a855f7', '#ec4899', '#f59e0b'],
                    borderRadius: 8
                }]
            },
            options: chartDefaults
        });
        window.auctionCharts.push(chart);
    }

    // 4. Radar Chart: Category Interests
    const barCtx = document.getElementById('barChart');
    if (barCtx) {
        const chart = new Chart(barCtx, {
            type: 'radar',
            data: {
                labels: ['Luxury', 'Vintage', 'Modern', 'Rare', 'Limited', 'Exotic'],
                datasets: [{
                    label: 'Interest Level',
                    data: [85, 70, 90, 65, 80, 75],
                    backgroundColor: 'rgba(245, 158, 11, 0.2)',
                    borderColor: '#f59e0b',
                    borderWidth: 2,
                    pointBackgroundColor: '#f59e0b'
                }]
            },
            options: {
                ...chartDefaults,
                scales: {
                    r: {
                        grid: { color: colors.gridColor },
                        angleLines: { color: colors.gridColor },
                        pointLabels: { color: colors.axisColor, font: { size: 10, weight: '600' } },
                        ticks: { display: false }
                    }
                }
            }
        });
        window.auctionCharts.push(chart);
    }

    // 5. Pie Chart: Spending Distribution
    const pieCtx = document.getElementById('pieChart');
    if (pieCtx) {
        const chart = new Chart(pieCtx, {
            type: 'pie',
            data: {
                labels: ['Cars', 'Watches', 'Art', 'Estates'],
                datasets: [{
                    data: [40, 20, 25, 15],
                    backgroundColor: ['#3b82f6', '#06b6d4', '#a855f7', '#ec4899'],
                    borderWidth: 0
                }]
            },
            options: {
                ...chartDefaults,
                plugins: {
                    ...chartDefaults.plugins,
                    legend: { display: true, position: 'bottom', labels: { color: '#cbd5e1', font: { size: 12, weight: '500' }, boxWidth: 10, padding: 20 } }
                }
            }
        });
        window.auctionCharts.push(chart);
    }

    // 6. Column Chart: Price Correlative Analysis
    const scatterCtx = document.getElementById('scatterChart');
    if (scatterCtx) {
        const chart = new Chart(scatterCtx, {
            type: 'bubble',
            data: {
                datasets: [{
                    label: 'Valuation Correlation',
                    data: [
                        { x: 10, y: 20, r: 15 }, // Age, Multiplier, Volume
                        { x: 15, y: 10, r: 10 },
                        { x: 20, y: 30, r: 20 },
                        { x: 25, y: 45, r: 25 },
                        { x: 30, y: 40, r: 18 },
                        { x: 35, y: 60, r: 30 },
                        { x: 40, y: 80, r: 35 },
                        { x: 45, y: 70, r: 22 },
                        { x: 50, y: 95, r: 40 }
                    ],
                    backgroundColor: 'rgba(6, 182, 212, 0.6)',
                    borderColor: '#06b6d4',
                    borderWidth: 1,
                    hoverBackgroundColor: '#06b6d4',
                    hoverBorderColor: '#fff',
                    hoverBorderWidth: 2
                }]
            },
            options: {
                ...chartDefaults,
                scales: {
                    x: {
                        ...chartDefaults.scales.x,
                        display: true,
                        title: { display: true, text: 'Item Age (Years)', color: colors.axisColor },
                        ticks: { color: colors.axisColor }
                    },
                    y: {
                        ...chartDefaults.scales.y,
                        display: true,
                        title: { display: true, text: 'Price Multiplier', color: colors.axisColor },
                        ticks: { color: colors.axisColor }
                    }
                },
                plugins: {
                    ...chartDefaults.plugins,
                    tooltip: {
                        ...chartDefaults.plugins.tooltip,
                        callbacks: {
                            label: function (context) {
                                return `Age: ${context.raw.x}yr, Val: ${context.raw.y}x, Vol: ${context.raw.r}`;
                            }
                        }
                    }
                }
            }
        });
        window.auctionCharts.push(chart);
    }
}

// Listen for theme changes to update charts
window.addEventListener('themeChanged', () => {
    console.log("AuctionWave: Theme changed, updating charts...");
    const newColors = getChartColors();

    window.auctionCharts.forEach(chart => {
        // Update scales if they exist
        if (chart.options.scales) {
            ['x', 'y', 'r'].forEach(axis => {
                if (chart.options.scales[axis]) {
                    // Update grid colors
                    if (chart.options.scales[axis].grid) {
                        chart.options.scales[axis].grid.color = newColors.gridColor;
                        chart.options.scales[axis].grid.borderColor = newColors.axisColor;
                    }
                    // Update ticks colors
                    if (chart.options.scales[axis].ticks) {
                        chart.options.scales[axis].ticks.color = newColors.axisColor;
                    }
                    // Update axis title color
                    if (chart.options.scales[axis].title) {
                        chart.options.scales[axis].title.color = newColors.axisColor;
                    }
                    // Update point labels (for radar charts)
                    if (chart.options.scales[axis].pointLabels) {
                        chart.options.scales[axis].pointLabels.color = newColors.axisColor;
                    }
                }
            });
        }

        // Update plugins
        if (chart.options.plugins) {
            // Legend
            if (chart.options.plugins.legend && chart.options.plugins.legend.labels) {
                chart.options.plugins.legend.labels.color = newColors.legendColor;
            }
            // Tooltip
            if (chart.options.plugins.tooltip) {
                chart.options.plugins.tooltip.backgroundColor = newColors.tooltipBg;
                chart.options.plugins.tooltip.bodyColor = newColors.tooltipText;
                chart.options.plugins.tooltip.titleColor = '#a855f7'; // Keep purple title
                chart.options.plugins.tooltip.borderColor = newColors.tooltipBorder;
            }
        }

        chart.update();
    });
});;

// 6. Admin Dashboard Charts
const initAdminCharts = () => {
    const colors = getChartColors();
    const chartDefaults = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: { display: false },
            tooltip: {
                backgroundColor: colors.tooltipBg,
                titleColor: '#a855f7',
                bodyColor: colors.tooltipText,
                borderColor: colors.tooltipBorder,
                borderWidth: 1,
                padding: 12,
                cornerRadius: 12
            }
        },
        scales: {
            x: {
                grid: {
                    display: true,
                    drawOnChartArea: false,
                    drawBorder: true,
                    borderColor: colors.axisColor,
                    color: colors.gridColor
                },
                ticks: { color: colors.axisColor }
            },
            y: {
                grid: {
                    display: true,
                    drawBorder: true,
                    borderColor: colors.axisColor,
                    color: colors.gridColor
                },
                ticks: { color: colors.axisColor }
            }
        }
    };

    const userGrowthCtx = document.getElementById('userGrowthChart');
    if (userGrowthCtx) {
        const gradient = userGrowthCtx.getContext('2d').createLinearGradient(0, 0, 0, 300);
        gradient.addColorStop(0, 'rgba(16, 185, 129, 0.4)');
        gradient.addColorStop(1, 'rgba(16, 185, 129, 0)');

        const chart = new Chart(userGrowthCtx, {
            type: 'line',
            data: {
                labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4', 'Week 5', 'Week 6'],
                datasets: [{
                    label: 'Users',
                    data: [450, 680, 890, 1100, 1050, 1240],
                    borderColor: '#10b981',
                    backgroundColor: gradient,
                    borderWidth: 3,
                    tension: 0.4,
                    pointRadius: 4,
                    pointBackgroundColor: '#10b981',
                    fill: true
                }]
            },
            options: chartDefaults
        });
        window.auctionCharts.push(chart);
    }

    const revenueCtx = document.getElementById('revenueSourcesChart');
    if (revenueCtx) {
        const chart = new Chart(revenueCtx, {
            type: 'doughnut',
            data: {
                labels: ['Auction Fees', 'Memberships', 'Private Sales', 'Advertising'],
                datasets: [{
                    data: [45, 25, 20, 10],
                    backgroundColor: ['#6366f1', '#a855f7', '#06b6d4', '#f59e0b'],
                    borderWidth: 0,
                    hoverOffset: 20
                }]
            },
            options: {
                ...chartDefaults,
                plugins: {
                    ...chartDefaults.plugins,
                    legend: { display: true, position: 'bottom', labels: { color: '#cbd5e1', padding: 20, font: { size: 10 } } }
                }
            }
        });
        window.auctionCharts.push(chart);
    }

    // Diverse Admin Charts
    const columnCtx = document.getElementById('adminColumnChart');
    if (columnCtx) {
        const chart = new Chart(columnCtx, {
            type: 'line',
            data: {
                labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
                datasets: [
                    {
                        label: 'Active Bids',
                        data: [120, 190, 300, 500, 200, 300, 450],
                        borderColor: '#6366f1',
                        borderWidth: 3,
                        tension: 0.4,
                        fill: false
                    },
                    {
                        label: 'Completed',
                        data: [80, 150, 220, 400, 150, 250, 380],
                        borderColor: '#ec4899',
                        borderWidth: 2,
                        borderDash: [5, 5],
                        tension: 0.4,
                        fill: false
                    }
                ]
            },
            options: {
                ...chartDefaults,
                plugins: { ...chartDefaults.plugins, legend: { display: true, position: 'bottom', labels: { color: colors.axisColor, boxWidth: 10 } } }
            }
        });
        window.auctionCharts.push(chart);
    }

    const barCtx = document.getElementById('adminBarChart');
    if (barCtx) {
        const chart = new Chart(barCtx, {
            type: 'radar',
            data: {
                labels: ['USA', 'UK', 'EU', 'Asia', 'Middle East', 'Africa'],
                datasets: [{
                    label: 'Market Share',
                    data: [90, 80, 75, 60, 45, 30],
                    backgroundColor: 'rgba(168, 85, 247, 0.2)',
                    borderColor: '#a855f7',
                    borderWidth: 2,
                    pointBackgroundColor: '#a855f7'
                }]
            },
            options: {
                ...chartDefaults,
                scales: {
                    r: {
                        grid: { color: colors.gridColor },
                        angleLines: { color: colors.gridColor },
                        pointLabels: { color: colors.axisColor, font: { size: 10 } },
                        ticks: { display: false }
                    }
                }
            }
        });
        window.auctionCharts.push(chart);
    }

    const pieCtx = document.getElementById('adminPieChart');
    if (pieCtx) {
        const chart = new Chart(pieCtx, {
            type: 'polarArea',
            data: {
                labels: ['Art', 'Cars', 'Watches', 'Real Estate'],
                datasets: [{
                    data: [30, 25, 20, 25],
                    backgroundColor: ['#6366f1', '#a855f7', '#06b6d4', '#4c1d95'],
                    borderWidth: 0
                }]
            },
            options: {
                ...chartDefaults,
                plugins: { ...chartDefaults.plugins, legend: { display: true, position: 'bottom', labels: { color: colors.axisColor, boxWidth: 10 } } },
                scales: {
                    r: {
                        grid: { color: colors.gridColor },
                        ticks: { display: false }
                    }
                }
            }
        });
        window.auctionCharts.push(chart);
    }

    const scatterCtx = document.getElementById('adminScatterChart');
    if (scatterCtx) {
        const chart = new Chart(scatterCtx, {
            type: 'bar',
            data: {
                labels: ['12 AM', '4 AM', '8 AM', '12 PM', '4 PM', '8 PM'],
                datasets: [{
                    label: 'Bid Density',
                    data: [20, 10, 40, 30, 60, 50],
                    backgroundColor: '#06b6d4',
                    borderRadius: 8
                }]
            },
            options: chartDefaults
        });
        window.auctionCharts.push(chart);
    }
};

// 7. Analytics Controls Logic
const initAnalyticsControls = () => {
    // Export Data Button
    const exportBtn = document.getElementById('export-data-btn');
    if (exportBtn) {
        exportBtn.addEventListener('click', () => {
            const originalText = exportBtn.innerText;
            exportBtn.innerText = 'Exporting...';
            exportBtn.classList.add('opacity-75', 'cursor-not-allowed');

            setTimeout(() => {
                exportBtn.innerText = 'Data Exported!';
                exportBtn.classList.remove('opacity-75', 'cursor-not-allowed');
                exportBtn.classList.add('text-emerald-400');

                // Simulate download
                const link = document.createElement('a');
                link.href = 'data:text/csv;charset=utf-8,Date,Bid Amount,Item,Status\n2026-02-01,45000000,Ferrari GTO,Winning\n2026-02-02,125000,AP Royal Oak,Winning';
                link.download = 'luxebid_analytics_export.csv';
                link.click();

                setTimeout(() => {
                    exportBtn.innerText = originalText;
                    exportBtn.classList.remove('text-emerald-400');
                }, 3000);
            }, 1500);
        });
    }

    // Time Range Select
    const timeSelect = document.getElementById('time-range-select');
    if (timeSelect) {
        timeSelect.addEventListener('change', (e) => {
            const range = e.target.value;
            console.log(`AuctionWave: Updating analytics for ${range}...`);

            // Randomize chart data to simulate filtering
            if (window.auctionCharts) {
                window.auctionCharts.forEach(chart => {
                    if (chart.data.datasets) {
                        chart.data.datasets.forEach(dataset => {
                            if (dataset.data) {
                                if (chart.config.type === 'bubble') {
                                    // Special handling for bubble chart
                                    dataset.data = dataset.data.map(p => ({
                                        x: p.x, // Keep age constant
                                        y: p.y * (0.8 + Math.random() * 0.4), // Vary valuation
                                        r: p.r * (0.8 + Math.random() * 0.4)  // Vary volume
                                    }));
                                } else {
                                    // Standard charts
                                    dataset.data = dataset.data.map(val => {
                                        if (typeof val === 'number') {
                                            return val * (0.8 + Math.random() * 0.4);
                                        }
                                        return val;
                                    });
                                }
                            }
                        });
                        chart.update();
                    }
                });
            }
        });
    }
};

// 8. Admin Controls Logic
const initAdminControls = () => {
    // User Search
    const searchInput = document.getElementById('user-search-input');
    const tableBody = document.getElementById('users-table-body');

    if (searchInput && tableBody) {
        searchInput.addEventListener('input', (e) => {
            const term = e.target.value.toLowerCase();
            const rows = tableBody.querySelectorAll('tr');

            rows.forEach(row => {
                const text = row.textContent.toLowerCase();
                row.style.display = text.includes(term) ? '' : 'none';
            });
        });
    }

    // Export Users
    const exportBtn = document.getElementById('export-users-btn');
    if (exportBtn) {
        exportBtn.addEventListener('click', () => {
            const originalText = exportBtn.innerText;
            exportBtn.innerText = 'Exporting...';
            exportBtn.classList.add('opacity-75', 'cursor-not-allowed');

            setTimeout(() => {
                exportBtn.innerText = 'Users Exported!';
                exportBtn.classList.remove('opacity-75', 'cursor-not-allowed');
                exportBtn.classList.add('bg-emerald-600', 'hover:bg-emerald-700');
                exportBtn.classList.remove('bg-indigo-600', 'hover:bg-indigo-700');

                // Simulate download
                const csvContent = "User,Email,Role,Status,Join Date\nAlice V.,alice@luxebid.com,Bidder,Active,2025-11-12\nMarcus T.,marcus@estates.io,Seller,Pending,2026-01-15";
                const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
                const link = document.createElement("a");
                const url = URL.createObjectURL(blob);
                link.setAttribute("href", url);
                link.setAttribute("download", "luxebid_users_export.csv");
                link.style.visibility = 'hidden';
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);

                showToast('User database exported successfully', 'success');

                setTimeout(() => {
                    exportBtn.innerText = originalText;
                    exportBtn.classList.remove('bg-emerald-600', 'hover:bg-emerald-700');
                    exportBtn.classList.add('bg-indigo-600', 'hover:bg-indigo-700');
                }, 3000);
            }, 1500);
        });
    }

    // Pending Listings Badge
    const pendingBadge = document.getElementById('pending-listings-badge');
    if (pendingBadge) {
        pendingBadge.addEventListener('click', () => {
            const queueSection = document.getElementById('auctions-section');
            if (queueSection) {
                queueSection.scrollIntoView({ behavior: 'smooth' });
                // Flash effect on queue items
                const items = queueSection.querySelectorAll('.glass');
                items.forEach(item => {
                    item.classList.add('ring-2', 'ring-indigo-500');
                    setTimeout(() => item.classList.remove('ring-2', 'ring-indigo-500'), 1000);
                });
                showToast('Showing pending moderation queue', 'info');
            }
        });
    }
};

// Initialize charts if containers exist and Chart library is loaded
if (typeof Chart !== 'undefined') {
    if (document.getElementById('lineChart')) {
        initDashboardCharts();
        initAnalyticsControls();
    }
    if (document.getElementById('userGrowthChart')) {
        initAdminCharts();
        initAdminControls();
    }
}

// Dashboard Scroll Spy Logic
const dashboardSections = document.querySelectorAll('.dashboard-section, #active-bids-section, #watchlist-section, #help-section, #overview-section, #users-section, #auctions-section, #analytics-section, #logs-section');
const dashboardSidebarLinks = document.querySelectorAll('.sidebar-link');

if (dashboardSidebarLinks.length > 0 && dashboardSections.length > 0) {
    const observerOptions = {
        root: null,
        rootMargin: '-10% 0px -80% 0px',
        threshold: 0
    };

    const observerCallback = (entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const id = entry.target.getAttribute('id');

                // Update sidebar links
                dashboardSidebarLinks.forEach(link => {
                    link.classList.remove('bg-indigo-600/20', 'text-indigo-400', 'active');
                    link.classList.add('text-slate-400');
                    if (link.getAttribute('href') === `#${id}`) {
                        link.classList.add('bg-indigo-600/20', 'text-indigo-400', 'active');
                        link.classList.remove('text-slate-400');
                    }
                });

                // Update navbar links
                const dashNavLinks = document.querySelectorAll('.dash-nav-link');
                dashNavLinks.forEach(link => {
                    link.classList.remove('text-indigo-400');
                    if (link.getAttribute('href') === `#${id}`) {
                        link.classList.add('text-indigo-400');
                    }
                });
            }
        });
    };

    const observer = new IntersectionObserver(observerCallback, observerOptions);
    dashboardSections.forEach(section => observer.observe(section));

    // Also handle manual clicks to ensure focus
    dashboardSidebarLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            const href = link.getAttribute('href');
            if (href.startsWith('#')) {
                // Let standard anchor behavior or Lenis handle the scroll
                // We just prevent default if we want to customize the scroll behavior
                // But since Lenis is active, better to just let it work.
            }
        });
    });
}

// ========================================
// MODAL SYSTEM & BUTTON HANDLERS
// ========================================

// Toast Notification System
window.showToast = function (message, type = 'success') {
    // Remove existing toast
    const existingToast = document.getElementById('luxebid-toast');
    if (existingToast) existingToast.remove();

    const toast = document.createElement('div');
    toast.id = 'luxebid-toast';
    toast.className = `fixed bottom-6 right-6 z-[9999] px-6 py-4 rounded-2xl shadow-2xl transform transition-all duration-500 translate-y-20 opacity-0 flex items-center gap-3 max-w-md`;

    const colors = {
        success: 'bg-emerald-600 text-white',
        error: 'bg-red-600 text-white',
        info: 'bg-indigo-600 text-white',
        warning: 'bg-amber-500 text-white'
    };

    const icons = {
        success: 'check-circle',
        error: 'x-circle',
        info: 'info',
        warning: 'alert-triangle'
    };

    toast.classList.add(...colors[type].split(' '));
    toast.innerHTML = `
        <i data-lucide="${icons[type]}" class="w-5 h-5 shrink-0"></i>
        <span class="text-sm font-medium">${message}</span>
    `;

    document.body.appendChild(toast);
    lucide.createIcons();

    // Animate in
    requestAnimationFrame(() => {
        toast.classList.remove('translate-y-20', 'opacity-0');
    });

    // Auto remove
    setTimeout(() => {
        toast.classList.add('translate-y-20', 'opacity-0');
        setTimeout(() => toast.remove(), 500);
    }, 4000);
};

// Generic Modal System
window.showModal = function (options) {
    const { title, content, type = 'default', onConfirm, confirmText = 'Confirm', showCancel = true } = options;

    // Remove existing modal
    const existingModal = document.getElementById('luxebid-modal');
    if (existingModal) existingModal.remove();

    const modal = document.createElement('div');
    modal.id = 'luxebid-modal';
    modal.className = 'fixed inset-0 z-[9999] flex items-center justify-center p-4 opacity-0 transition-opacity duration-300';
    modal.innerHTML = `
        <div class="absolute inset-0 bg-black/70 backdrop-blur-sm" onclick="closeModal()"></div>
        <div class="relative w-full max-w-lg glass rounded-3xl border border-white/10 p-8 transform scale-95 transition-transform duration-300 shadow-2xl">
            <button onclick="closeModal()" class="absolute top-4 right-4 p-2 hover:bg-white/10 rounded-lg transition-colors">
                <i data-lucide="x" class="w-5 h-5"></i>
            </button>
            <h2 class="text-2xl font-bold text-white mb-4">${title}</h2>
            <div class="modal-content text-slate-300">${content}</div>
            <div class="flex gap-4 mt-8">
                ${showCancel ? '<button onclick="closeModal()" class="flex-1 px-6 py-3 border border-slate-700 hover:bg-slate-800 rounded-xl transition-all text-slate-300">Cancel</button>' : ''}
                <button id="modal-confirm-btn" class="flex-1 px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl transition-all font-semibold">${confirmText}</button>
            </div>
        </div>
    `;

    document.body.appendChild(modal);
    document.body.style.overflow = 'hidden';
    lucide.createIcons();

    // Animate in
    requestAnimationFrame(() => {
        modal.classList.remove('opacity-0');
        modal.querySelector('.relative').classList.remove('scale-95');
    });

    // Confirm handler
    document.getElementById('modal-confirm-btn').addEventListener('click', () => {
        if (onConfirm) onConfirm();
        closeModal();
    });
};

window.closeModal = function () {
    const modal = document.getElementById('luxebid-modal');
    if (modal) {
        modal.classList.add('opacity-0');
        modal.querySelector('.relative').classList.add('scale-95');
        setTimeout(() => {
            modal.remove();
            document.body.style.overflow = '';
        }, 300);
    }
};

// Bid Modal
window.showBidModal = function (itemName = 'This Item', currentBid = '$0') {
    showModal({
        title: 'Place Your Bid',
        content: `
            <div class="space-y-6">
                <div class="p-4 bg-slate-900/50 rounded-xl border border-white/5">
                    <p class="text-xs text-slate-500 uppercase tracking-wider mb-1">Bidding On</p>
                    <p class="text-white font-semibold">${itemName}</p>
                    <p class="text-sm text-emerald-400 mt-2">Current Bid: ${currentBid}</p>
                </div>
                <div>
                    <label class="block text-sm font-medium text-slate-400 mb-2">Your Maximum Bid</label>
                    <div class="relative">
                        <span class="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500">$</span>
                        <input type="number" id="bid-amount" placeholder="Enter amount" 
                            class="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 pl-8 text-white placeholder-slate-500 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none">
                    </div>
                </div>
                <p class="text-xs text-slate-500">By placing a bid, you agree to our Terms of Service and Bidding Policy.</p>
            </div>
        `,
        confirmText: 'Place Bid',
        onConfirm: () => {
            const amount = document.getElementById('bid-amount')?.value;
            if (amount && parseFloat(amount) > 0) {
                showToast(`Bid of $${parseFloat(amount).toLocaleString()} placed successfully!`, 'success');
            } else {
                showToast('Please enter a valid bid amount', 'error');
            }
        }
    });
};

// Contact/Inquiry Modal
window.showInquiryModal = function (subject = 'General Inquiry') {
    showModal({
        title: subject,
        content: `
            <div class="space-y-4">
                <div>
                    <label class="block text-sm font-medium text-slate-400 mb-2">Your Name</label>
                    <input type="text" id="inquiry-name" placeholder="Full name" 
                        class="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:ring-2 focus:ring-indigo-500 outline-none">
                </div>
                <div>
                    <label class="block text-sm font-medium text-slate-400 mb-2">Email Address</label>
                    <input type="email" id="inquiry-email" placeholder="your@email.com" 
                        class="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:ring-2 focus:ring-indigo-500 outline-none">
                </div>
                <div>
                    <label class="block text-sm font-medium text-slate-400 mb-2">Message</label>
                    <textarea id="inquiry-message" rows="3" placeholder="Your message..." 
                        class="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:ring-2 focus:ring-indigo-500 outline-none resize-none"></textarea>
                </div>
            </div>
        `,
        confirmText: 'Send Inquiry',
        onConfirm: () => {
            const name = document.getElementById('inquiry-name')?.value;
            const email = document.getElementById('inquiry-email')?.value;
            if (name && email) {
                showToast('Your inquiry has been submitted. We\'ll respond within 24 hours.', 'success');
            } else {
                showToast('Please fill in all required fields', 'error');
            }
        }
    });
};

// Membership Application Modal
window.showMembershipModal = function () {
    showModal({
        title: 'Founders\' Circle Application',
        content: `
            <div class="space-y-4">
                <p class="text-sm text-slate-400">Membership is by invitation only. Submit your details for consideration.</p>
                <div>
                    <label class="block text-sm font-medium text-slate-400 mb-2">Full Name</label>
                    <input type="text" id="member-name" placeholder="Your full name" 
                        class="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:ring-2 focus:ring-indigo-500 outline-none">
                </div>
                <div>
                    <label class="block text-sm font-medium text-slate-400 mb-2">Email</label>
                    <input type="email" id="member-email" placeholder="your@email.com" 
                        class="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:ring-2 focus:ring-indigo-500 outline-none">
                </div>
                <div>
                    <label class="block text-sm font-medium text-slate-400 mb-2">Collection Interests</label>
                    <select id="member-interest" class="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-indigo-500 outline-none">
                        <option value="">Select your primary interest</option>
                        <option value="automobiles">Exotic Automobiles</option>
                        <option value="horology">Fine Horology</option>
                        <option value="art">Fine Art</option>
                        <option value="realestate">Elite Real Estate</option>
                        <option value="jewelry">Statement Jewelry</option>
                    </select>
                </div>
            </div>
        `,
        confirmText: 'Submit Application',
        onConfirm: () => {
            showToast('Application submitted! Our team will review and contact you within 48 hours.', 'success');
        }
    });
};

// Newsletter Subscription
window.subscribeNewsletter = function (emailInput) {
    const email = emailInput?.value || document.querySelector('input[type="email"]')?.value;
    if (email && email.includes('@')) {
        showToast('Successfully subscribed to The Intelligence newsletter!', 'success');
        if (emailInput) emailInput.value = '';
    } else {
        showToast('Please enter a valid email address', 'error');
    }
};

// Invoice Actions
window.viewInvoice = function (invoiceId) {
    showModal({
        title: `Invoice #${invoiceId}`,
        content: `
            <div class="space-y-4">
                <div class="grid grid-cols-2 gap-4 text-sm">
                    <div class="p-4 bg-slate-900/50 rounded-xl">
                        <p class="text-slate-500 text-xs uppercase">Invoice Date</p>
                        <p class="text-white font-medium">Jan 15, 2026</p>
                    </div>
                    <div class="p-4 bg-slate-900/50 rounded-xl">
                        <p class="text-slate-500 text-xs uppercase">Due Date</p>
                        <p class="text-white font-medium">Feb 15, 2026</p>
                    </div>
                </div>
                <div class="p-4 bg-slate-900/50 rounded-xl">
                    <p class="text-slate-500 text-xs uppercase mb-2">Items</p>
                    <div class="flex justify-between text-white">
                        <span>Auction Item #${invoiceId}</span>
                        <span class="font-bold">$12,500.00</span>
                    </div>
                    <div class="flex justify-between text-slate-400 text-sm mt-2">
                        <span>Buyer's Premium (15%)</span>
                        <span>$1,875.00</span>
                    </div>
                    <div class="border-t border-white/10 mt-4 pt-4 flex justify-between text-white font-bold">
                        <span>Total</span>
                        <span class="text-emerald-400">$14,375.00</span>
                    </div>
                </div>
            </div>
        `,
        confirmText: 'Download PDF',
        onConfirm: () => {
            showToast('Invoice downloaded successfully!', 'success');
        }
    });
};

window.payInvoice = function (invoiceId) {
    showModal({
        title: 'Secure Payment',
        content: `
            <div class="space-y-4">
                <div class="p-4 bg-emerald-900/20 border border-emerald-500/20 rounded-xl">
                    <p class="text-emerald-400 font-semibold">Invoice #${invoiceId}</p>
                    <p class="text-2xl font-bold text-white mt-1">$14,375.00</p>
                </div>
                <div>
                    <label class="block text-sm font-medium text-slate-400 mb-2">Card Number</label>
                    <input type="text" placeholder="4242 4242 4242 4242" maxlength="19"
                        class="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:ring-2 focus:ring-indigo-500 outline-none">
                </div>
                <div class="grid grid-cols-2 gap-4">
                    <div>
                        <label class="block text-sm font-medium text-slate-400 mb-2">Expiry</label>
                        <input type="text" placeholder="MM/YY" maxlength="5"
                            class="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:ring-2 focus:ring-indigo-500 outline-none">
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-slate-400 mb-2">CVC</label>
                        <input type="text" placeholder="123" maxlength="3"
                            class="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:ring-2 focus:ring-indigo-500 outline-none">
                    </div>
                </div>
                <p class="text-xs text-slate-500 flex items-center gap-2">
                    <i data-lucide="shield-check" class="w-4 h-4 text-emerald-400"></i>
                    256-bit SSL encrypted payment
                </p>
            </div>
        `,
        confirmText: 'Pay Now',
        onConfirm: () => {
            showToast('Payment processed successfully! Receipt sent to your email.', 'success');
        }
    });
    lucide.createIcons();
};

window.downloadInvoice = function (invoiceId) {
    showToast(`Downloading Invoice #${invoiceId}...`, 'info');
    setTimeout(() => {
        showToast('Invoice downloaded successfully!', 'success');
    }, 1500);
};

// Notification Management
window.dismissNotification = function (element) {
    const notification = element.closest('.notification-item') || element.parentElement;
    notification.style.opacity = '0';
    notification.style.transform = 'translateX(20px)';
    setTimeout(() => {
        notification.remove();
        showToast('Notification dismissed', 'info');
    }, 300);
};

// Quick Action Handlers
window.quickAction = function (action) {
    const actions = {
        'new-listing': () => showInquiryModal('Create New Listing'),
        'view-analytics': () => {
            const analyticsSection = document.getElementById('analytics-section');
            if (analyticsSection) analyticsSection.scrollIntoView({ behavior: 'smooth' });
            else showToast('Navigating to Analytics...', 'info');
        },
        'messages': () => showToast('Opening Messages...', 'info'),
        'settings': () => {
            const settingsSection = document.getElementById('settings-section');
            if (settingsSection) settingsSection.scrollIntoView({ behavior: 'smooth' });
            else showToast('Opening Settings...', 'info');
        }
    };

    if (actions[action]) actions[action]();
    else showToast(`Action: ${action}`, 'info');
};

// Universal Button Handler - Attach to all unhandled buttons
document.addEventListener('DOMContentLoaded', () => {
    // Handle all buttons without existing onclick
    document.querySelectorAll('button:not([onclick])').forEach(btn => {
        const text = btn.textContent.trim().toLowerCase();
        const hasExistingHandler = btn.onclick || btn.hasAttribute('type') === 'submit';

        if (hasExistingHandler) return;

        // Match button text to actions
        if (text.includes('place bid') || text.includes('bid now')) {
            const card = btn.closest('.group') || btn.closest('[class*="card"]');
            const title = card?.querySelector('h3')?.textContent || 'Selected Item';
            const price = card?.querySelector('[class*="emerald"]')?.textContent || card?.querySelector('[class*="font-bold"]:last-child')?.textContent || '$0';
            btn.addEventListener('click', () => showBidModal(title, price));
        }
        else if (text.includes('sell with us') || text.includes('consign')) {
            btn.addEventListener('click', () => showInquiryModal('Sell With Us'));
        }
        else if (text.includes('request') && text.includes('itinerary')) {
            btn.addEventListener('click', () => showInquiryModal('Request Full Itinerary'));
        }
        else if (text.includes('view preview') || text.includes('request entry') || text.includes('inquire')) {
            btn.addEventListener('click', () => showInquiryModal('Event Inquiry'));
        }
        else if (text.includes('apply') && text.includes('membership')) {
            btn.addEventListener('click', () => showMembershipModal());
        }
        else if (text.includes('subscribe')) {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                const form = btn.closest('form');
                const emailInput = form?.querySelector('input[type="email"]');
                subscribeNewsletter(emailInput);
            });
        }
        else if (text.includes('view full history') || text.includes('view all')) {
            btn.addEventListener('click', () => showToast('Loading full history...', 'info'));
        }
        else if (text.includes('manage all')) {
            btn.addEventListener('click', () => showToast('Opening management panel...', 'info'));
        }
        else if (text.includes('valuation') || text.includes('appraisal')) {
            btn.addEventListener('click', () => showInquiryModal('Request Valuation'));
        }
        else if (text.includes('book') || text.includes('schedule')) {
            btn.addEventListener('click', () => showInquiryModal('Book Appointment'));
        }
        else if (text.includes('download')) {
            btn.addEventListener('click', () => {
                showToast('Preparing download...', 'info');
                setTimeout(() => showToast('Download complete!', 'success'), 1500);
            });
        }
        else if (text.includes('save') || text.includes('update')) {
            btn.addEventListener('click', () => showToast('Changes saved successfully!', 'success'));
        }
        else if (text.includes('delete') || text.includes('remove')) {
            btn.addEventListener('click', () => {
                showModal({
                    title: 'Confirm Deletion',
                    content: '<p>Are you sure you want to delete this item? This action cannot be undone.</p>',
                    confirmText: 'Delete',
                    onConfirm: () => showToast('Item deleted successfully', 'success')
                });
            });
        }
        else if (text.includes('private viewing')) {
            btn.addEventListener('click', () => showInquiryModal('Request Private Viewing'));
        }
        else if (text.includes('contact') || text.includes('get in touch')) {
            btn.addEventListener('click', () => showInquiryModal('Contact Us'));
        }
        else if (text.includes('bid now') || text.includes('place bid')) {
            // Already handled by specific logic or quick-bid class, but adding fallback
            if (!btn.classList.contains('js-quick-bid')) {
                btn.addEventListener('click', () => showInquiryModal('Bidding Inquiry'));
            }
        }
        else if (text.includes('top up')) {
            btn.addEventListener('click', () => actions['top-up']());
        }
        else if (text.includes('concierge')) {
            btn.addEventListener('click', () => actions['concierge']());
        }
        else if (text.includes('reports')) {
            btn.addEventListener('click', () => actions['reports']());
        }
        else if (text.includes('audit logs')) {
            btn.addEventListener('click', () => actions['audit-logs']());
        }
        else if (text.includes('new auction')) {
            btn.addEventListener('click', () => actions['new-auction']());
        }
        else if (text.includes('newsletter') && btn.querySelectorAll('button')) {
            // Avoid affecting form buttons inside newsletter
        }
        else if (text.includes('system maintenance')) {
            btn.addEventListener('click', () => actions['maintenance']());
        }
        else if (text.includes('export users')) {
            btn.addEventListener('click', () => actions['export-users']());
        }
        else if (text.includes('approve')) {
            btn.addEventListener('click', (e) => {
                const card = e.target.closest('[class*="glass"]');
                showToast('Item Approved', 'success');
                if (card && !card.classList.contains('dashboard-section')) {
                    card.style.opacity = '0.3';
                    e.target.innerText = 'Approved';
                    e.target.disabled = true;
                }
            });
        }
        else if (text.includes('reject')) {
            btn.addEventListener('click', (e) => {
                const card = e.target.closest('[class*="glass"]');
                if (card && !card.classList.contains('dashboard-section')) {
                    showModal({
                        title: 'Confirm Rejection',
                        content: '<p>Reject this listing? Please specify a reason.</p><textarea class="w-full mt-4 bg-white/5 border border-white/10 rounded-xl p-4 text-xs" placeholder="Reason for rejection..."></textarea>',
                        confirmText: 'Confirm Reject',
                        onConfirm: () => {
                            card.remove();
                            showToast('Listing Rejected', 'success');
                        }
                    });
                }
            });
        }
        // Generic fallback for buttons with icons only
        else if (btn.querySelector('[data-lucide]')) {
            const iconName = btn.querySelector('[data-lucide]').getAttribute('data-lucide');
            const iconActions = {
                'edit': () => showToast('Opening editor...', 'info'),
                'trash': () => showToast('Item removed', 'success'),
                'eye': () => showToast('Viewing details...', 'info'),
                'download': () => showToast('Downloading...', 'info'),
                'share': () => showToast('Share link copied!', 'success'),
                'heart': () => showToast('Added to favorites!', 'success'),
                'bell': () => showToast('Notification preferences updated', 'success'),
                'settings': () => quickAction('settings'),
                'filter': () => showToast('Filter options...', 'info'),
                'search': () => showToast('Search...', 'info'),
                'plus': () => showInquiryModal('Add New Item'),
                'x': () => dismissNotification(btn)
            };
            if (iconActions[iconName]) {
                btn.addEventListener('click', iconActions[iconName]);
            }
        }
    });

    // Handle links styled as buttons
    document.querySelectorAll('a[class*="btn"], a[class*="button"]').forEach(link => {
        if (!link.getAttribute('href') || link.getAttribute('href') === '#!' || link.getAttribute('href') === '#') {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                showToast('Coming soon...', 'info');
            });
        }
    });

    // Newsletter Form Logic
    document.querySelectorAll('form').forEach(form => {
        if (form.querySelector('input[type="email"]') && form.querySelector('button')) {
            form.addEventListener('submit', (e) => {
                e.preventDefault();
                showToast('Success! Your secure subscription is active.', 'success');
                form.reset();
            });
        }
    });

    console.log('AuctionWave: Button handlers initialized');
});

// 7. Admin Inbox Logic
document.addEventListener('DOMContentLoaded', () => {
    // Reply Button Logic
    const replyButtons = document.querySelectorAll('.js-reply-btn');
    replyButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            const card = e.target.closest('.message-card');
            const userName = card.querySelector('h4').innerText;

            // Simple prompt simulation
            const replyText = prompt(`Reply to ${userName}:`, "Enter your message here...");

            if (replyText && replyText.trim() !== "") {
                // In a real app, this would send an API request
                console.log(`Reply sent to ${userName}: ${replyText}`);
                alert(`Reply sent successfully to ${userName}!`);

                // Optional: visual feedback on the button
                const originalText = btn.innerText;
                btn.innerText = "Sent!";
                btn.classList.replace('bg-indigo-600', 'bg-green-600');
                btn.disabled = true;

                setTimeout(() => {
                    btn.innerText = originalText;
                    btn.classList.replace('bg-green-600', 'bg-indigo-600');
                    btn.disabled = false;
                }, 2000);
            }
        });
    });

    // Mark as Resolved Logic
    const resolveButtons = document.querySelectorAll('.js-resolve-btn');
    resolveButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            if (confirm("Are you sure you want to mark this thread as resolved?")) {
                const card = e.target.closest('.message-card');

                // Visual removal effect
                card.style.transition = "all 0.5s ease";
                card.style.opacity = "0";
                card.style.transform = "translateX(20px)";

                setTimeout(() => {
                    card.remove();

                    // Update Badge Count
                    const badge = document.getElementById('inbox-badge');
                    if (badge) {
                        let currentCount = parseInt(badge.innerText);
                        if (!isNaN(currentCount) && currentCount > 0) {
                            badge.innerText = currentCount - 1;

                            // Visual pulse on badge update
                            badge.classList.add('animate-ping');
                            setTimeout(() => {
                                badge.classList.remove('animate-ping');
                            }, 500);
                        }
                    }

                    // Show small notification or alert
                    // (Using alert as requested for simplicity, though a toast would be nicer)
                    console.log("Thread resolved");
                }, 500);

            }
        });
    });
});

// International Clocks for Headquarters
const updateInternationalClocks = () => {
    const clockConfigs = [
        { selector: '.clock-london', timezone: 'Europe/London' },
        { selector: '.clock-ny', timezone: 'America/New_York' },
        { selector: '.clock-geneva', timezone: 'Europe/Zurich' },
        { selector: '.clock-hk', timezone: 'Asia/Hong_Kong' }
    ];

    clockConfigs.forEach(config => {
        const elements = document.querySelectorAll(config.selector);
        if (elements.length > 0) {
            try {
                const time = new Date().toLocaleTimeString('en-US', {
                    timeZone: config.timezone,
                    hour: '2-digit',
                    minute: '2-digit',
                    hour12: false
                });
                elements.forEach(el => el.innerText = time);
            } catch (e) {
                console.error(`Error updating clock for ${config.timezone}:`, e);
            }
        }
    });
};

if (document.querySelector('#global-presence')) {
    updateInternationalClocks();
    setInterval(updateInternationalClocks, 60000); // Update every minute
}

// Simple Countdown Logic Simulation (Visual only)
setInterval(() => {
    const countdowns = document.querySelectorAll('#live-arena span.text-\[10px\]');
    countdowns.forEach(span => {
        const text = span.innerText;
        if (text.includes('Remaining')) {
            const timePart = text.split(' ')[0];
            if (timePart.includes(':')) {
                const parts = timePart.split(':');
                let min = parseInt(parts[0]);
                let sec = parseInt(parts[1]);

                if (sec > 0) {
                    sec--;
                } else if (min > 0) {
                    min--;
                    sec = 59;
                }

                const formatted = `${String(min).padStart(2, '0')}:${String(sec).padStart(2, '0')} Remaining`;
                span.innerText = formatted;
            }
        }
    });
}, 1000);

// Quick Bid Functionality for User Dashboard
document.addEventListener('DOMContentLoaded', () => {
    const quickBidButtons = document.querySelectorAll('.js-quick-bid');

    quickBidButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            const card = e.target.closest('.group');
            if (!card) return;

            const itemName = card.querySelector('h4')?.innerText || 'Item';
            const counterEl = card.querySelector('.counter');
            if (!counterEl) return;

            const currentBidStr = counterEl.innerText.replace(/[^0-9.]/g, '');
            const currentBid = parseFloat(currentBidStr);

            if (isNaN(currentBid)) return;

            // Increment by 5%
            const increment = Math.ceil(currentBid * 0.05);
            const newBid = currentBid + increment;
            const formattedBid = new Intl.NumberFormat('en-US', {
                style: 'currency',
                currency: 'USD',
                maximumFractionDigits: 0
            }).format(newBid);

            if (confirm(`Place a Quick Bid for ${formattedBid} on ${itemName}?`)) {
                // Visual feedback: Processing status
                const originalText = btn.innerText;
                btn.innerText = 'Processing...';
                btn.disabled = true;
                btn.classList.add('opacity-50', 'cursor-not-allowed');

                // Simulate network latency
                setTimeout(() => {
                    // Update the UI
                    counterEl.innerText = formattedBid;

                    // Update data-target for future animations if needed
                    counterEl.setAttribute('data-target', newBid.toString());

                    // Trigger success feedback
                    if (window.showToast) {
                        showToast(`Success! Your bid of ${formattedBid} was placed.`, 'success');
                    } else {
                        alert(`Success! Your bid of ${formattedBid} was placed.`);
                    }

                    // Reset button
                    btn.innerText = originalText;
                    btn.disabled = false;
                    btn.classList.remove('opacity-50', 'cursor-not-allowed');
                }, 1500);
            }
        });
    });
});

// Dashboard Sidebar Toggle Logic
document.addEventListener('DOMContentLoaded', () => {
    const openSidebarBtn = document.getElementById('open-sidebar-btn');
    const closeSidebarBtn = document.getElementById('close-sidebar-btn');
    const dashboardSidebar = document.getElementById('dashboard-sidebar');

    if (openSidebarBtn && dashboardSidebar) {
        openSidebarBtn.addEventListener('click', () => {
            dashboardSidebar.classList.remove('-translate-x-full');
            document.body.style.overflow = 'hidden';
        });
    }

    if (closeSidebarBtn && dashboardSidebar) {
        closeSidebarBtn.addEventListener('click', () => {
            dashboardSidebar.classList.add('-translate-x-full');
            document.body.style.overflow = 'auto';
        });
    }

    // Close sidebar when clicking a link (mobile)
    const sidebarLinks = document.querySelectorAll('.sidebar-link');
    sidebarLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (window.innerWidth < 768 && dashboardSidebar) {
                dashboardSidebar.classList.add('-translate-x-full');
                document.body.style.overflow = 'auto';
            }
        });
    });
});
