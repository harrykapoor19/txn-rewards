document.addEventListener('DOMContentLoaded', () => {
    const getStartedBtn = document.getElementById('get-started');
    const giveawayList = document.getElementById('giveaway-list');

    getStartedBtn.addEventListener('click', () => {
        alert('Sign up feature coming soon!');
    });

    // Sample giveaway data
    const giveaways = [
        { influencer: 'Farah Khan', brand: 'Swiggy', prize: '₹30L worth of gifts' },
        { influencer: 'John Doe', brand: 'TechGadget', prize: 'Latest smartphone' },
        { influencer: 'Jane Smith', brand: 'FashionHub', prize: 'Shopping spree' },
    ];

    // Populate giveaway list
    giveaways.forEach(giveaway => {
        const card = document.createElement('div');
        card.classList.add('giveaway-card');
        card.innerHTML = `
            <h3>${giveaway.influencer} x ${giveaway.brand}</h3>
            <p>Prize: ${giveaway.prize}</p>
            <button>Enter Giveaway</button>
        `;
        giveawayList.appendChild(card);
    });

    // Add enter giveaway functionality
    giveawayList.addEventListener('click', (e) => {
        if (e.target.tagName === 'BUTTON') {
            alert('Giveaway entry feature coming soon!');
        }
    });
});

// Sample data - In a real app, this would come from an API
const sampleData = {
    accounts: {
        bank: [
            { id: 'bank1', name: 'Primary Checking', balance: 75000 },
            { id: 'bank2', name: 'Savings', balance: 50000 }
        ],
        credit: [
            { id: 'cc1', name: 'Credit Card 1', balance: -20000 },
            { id: 'cc2', name: 'Credit Card 2', balance: -5000 }
        ]
    },
    transactions: [
        {
            id: 1,
            title: 'Salary Deposit',
            amount: 100000,
            type: 'income',
            date: '2024-03-02',
            account: 'bank1'
        },
        {
            id: 2,
            title: 'Rent Payment',
            amount: -15000,
            type: 'expense',
            date: '2024-03-10',
            account: 'bank1'
        },
        {
            id: 3,
            title: 'Grocery Shopping',
            amount: -10000,
            type: 'expense',
            date: '2024-03-15',
            account: 'cc1'
        }
    ],
    upcomingPayments: [
        {
            id: 1,
            title: 'Credit Card Bill',
            amount: 20000,
            dueDate: '2024-03-25',
            account: 'cc1'
        },
        {
            id: 2,
            title: 'Utility Bill',
            amount: 3000,
            dueDate: '2024-03-28',
            account: 'bank1'
        }
    ]
};

// Initialize the dashboard
document.addEventListener('DOMContentLoaded', () => {
    initializeDashboard();
    setupEventListeners();
    updateCashflowChart();
});

// Set up event listeners
function setupEventListeners() {
    const monthPicker = document.getElementById('monthPicker');
    const accountFilter = document.getElementById('accountFilter');

    monthPicker.value = new Date().toISOString().slice(0, 7);
    monthPicker.addEventListener('change', updateDashboard);
    accountFilter.addEventListener('change', updateDashboard);
}

// Initialize dashboard with data
function initializeDashboard() {
    updateBalanceCards();
    updateTransactionsList();
    updateUpcomingPayments();
}

// Update all dashboard components
function updateDashboard() {
    updateBalanceCards();
    updateTransactionsList();
    updateUpcomingPayments();
    updateCashflowChart();
}

// Update balance cards
function updateBalanceCards() {
    const totalBalance = calculateTotalBalance();
    const monthlyInflow = calculateMonthlyInflow();
    const monthlyOutflow = calculateMonthlyOutflow();

    document.querySelector('.total-balance .amount').textContent = formatCurrency(totalBalance);
    document.querySelector('.monthly-inflow .amount').textContent = formatCurrency(monthlyInflow);
    document.querySelector('.monthly-outflow .amount').textContent = formatCurrency(Math.abs(monthlyOutflow));
}

// Update transactions list
function updateTransactionsList() {
    const transactionsList = document.getElementById('transactionsList');
    transactionsList.innerHTML = '';

    const filteredTransactions = filterTransactionsByAccount(sampleData.transactions);
    
    filteredTransactions.forEach(transaction => {
        const transactionElement = createTransactionElement(transaction);
        transactionsList.appendChild(transactionElement);
    });
}

// Create transaction element
function createTransactionElement(transaction) {
    const div = document.createElement('div');
    div.className = 'transaction-item';
    
    div.innerHTML = `
        <div class="transaction-details">
            <span class="transaction-title">${transaction.title}</span>
            <span class="transaction-date">${formatDate(transaction.date)}</span>
        </div>
        <span class="transaction-amount ${transaction.type}">
            ${formatCurrency(transaction.amount)}
        </span>
    `;
    
    return div;
}

// Update upcoming payments
function updateUpcomingPayments() {
    const upcomingList = document.getElementById('upcomingList');
    upcomingList.innerHTML = '';

    const filteredPayments = filterUpcomingPaymentsByAccount(sampleData.upcomingPayments);
    
    filteredPayments.forEach(payment => {
        const paymentElement = createUpcomingPaymentElement(payment);
        upcomingList.appendChild(paymentElement);
    });
}

// Create upcoming payment element
function createUpcomingPaymentElement(payment) {
    const div = document.createElement('div');
    div.className = 'upcoming-item';
    
    div.innerHTML = `
        <div class="upcoming-details">
            <span class="upcoming-title">${payment.title}</span>
            <span class="upcoming-date">Due: ${formatDate(payment.dueDate)}</span>
        </div>
        <span class="transaction-amount expense">
            ${formatCurrency(payment.amount)}
        </span>
    `;
    
    return div;
}

// Update cashflow chart
function updateCashflowChart() {
    const ctx = document.getElementById('cashflowChart').getContext('2d');
    
    // Destroy existing chart if it exists
    if (window.cashflowChart) {
        window.cashflowChart.destroy();
    }

    const chartData = generateCashflowChartData();
    
    window.cashflowChart = new Chart(ctx, {
        type: 'line',
        data: chartData,
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        callback: value => formatCurrency(value)
                    }
                }
            },
            plugins: {
                legend: {
                    position: 'bottom'
                }
            }
        }
    });
}

// Generate chart data
function generateCashflowChartData() {
    // Sample data - In a real app, this would be calculated from actual transactions
    return {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
        datasets: [
            {
                label: 'Income',
                data: [100000, 95000, 100000, 98000, 102000, 100000],
                borderColor: '#48bb78',
                backgroundColor: 'rgba(72, 187, 120, 0.1)',
                fill: true
            },
            {
                label: 'Expenses',
                data: [45000, 48000, 47000, 46000, 45000, 48000],
                borderColor: '#f56565',
                backgroundColor: 'rgba(245, 101, 101, 0.1)',
                fill: true
            }
        ]
    };
}

// Helper functions
function calculateTotalBalance() {
    const bankBalance = sampleData.accounts.bank.reduce((sum, account) => sum + account.balance, 0);
    const creditBalance = sampleData.accounts.credit.reduce((sum, account) => sum + account.balance, 0);
    return bankBalance + creditBalance;
}

function calculateMonthlyInflow() {
    return sampleData.transactions
        .filter(t => t.type === 'income')
        .reduce((sum, t) => sum + t.amount, 0);
}

function calculateMonthlyOutflow() {
    return sampleData.transactions
        .filter(t => t.type === 'expense')
        .reduce((sum, t) => sum + t.amount, 0);
}

function filterTransactionsByAccount(transactions) {
    const accountFilter = document.getElementById('accountFilter').value;
    if (accountFilter === 'all') return transactions;
    
    return transactions.filter(t => {
        const account = sampleData.accounts[accountFilter].find(a => a.id === t.account);
        return account !== undefined;
    });
}

function filterUpcomingPaymentsByAccount(payments) {
    const accountFilter = document.getElementById('accountFilter').value;
    if (accountFilter === 'all') return payments;
    
    return payments.filter(p => {
        const account = sampleData.accounts[accountFilter].find(a => a.id === p.account);
        return account !== undefined;
    });
}

function formatCurrency(amount) {
    return new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
    }).format(amount);
}

function formatDate(dateString) {
    return new Date(dateString).toLocaleDateString('en-IN', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    });
}