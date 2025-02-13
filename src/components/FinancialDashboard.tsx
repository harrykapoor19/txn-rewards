import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  Container,
  Typography,
  Tabs,
  Tab,
  Grid,
  Select,
  MenuItem,
  LinearProgress,
  List,
  ListItem,
  ListItemText,
  Chip,
  Avatar,
  IconButton,
} from '@mui/material';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';

interface Transaction {
  id: string;
  date: Date;
  amount: number;
  description: string;
  category: string;
  type: 'credit' | 'debit';
  source: 'upi' | 'credit_card' | 'bank';
}

interface BankAccount {
  id: string;
  balance: number;
  accountType: string;
  bankName: string;
}

interface CreditCard {
  id: string;
  bank: string;
  lastFourDigits: string;
  totalLimit: number;
  availableLimit: number;
  dueDate: Date;
  outstandingAmount: number;
}

interface UpcomingPayment {
  id: string;
  amount: number;
  dueDate: Date;
  description: string;
  type: 'bank' | 'credit_card';
}

const FinancialDashboard: React.FC = () => {
  const [selectedAccount, setSelectedAccount] = useState('all');
  const [activeTab, setActiveTab] = useState(0);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [bankAccounts, setBankAccounts] = useState<BankAccount[]>([]);
  const [creditCards, setCreditCards] = useState<CreditCard[]>([]);
  const [upcomingPayments, setUpcomingPayments] = useState<UpcomingPayment[]>([]);
  const [netCashflow, setNetCashflow] = useState<number>(0);

  const handleAccountChange = (event: any) => {
    setSelectedAccount(event.target.value);
  };

  // Mock data for demonstration
  useEffect(() => {
    // Mock Transactions
    const mockTransactions: Transaction[] = [
      {
        id: '1',
        date: new Date('2024-02-02'),
        amount: 100000,
        description: 'Salary',
        category: 'Income',
        type: 'credit',
        source: 'bank'
      },
      {
        id: '2',
        date: new Date('2024-02-10'),
        amount: 15000,
        description: 'Rent Payment',
        category: 'Housing',
        type: 'debit',
        source: 'bank'
      },
      {
        id: '3',
        date: new Date('2024-02-12'),
        amount: 10000,
        description: 'Grocery Shopping',
        category: 'Groceries',
        type: 'debit',
        source: 'credit_card'
      },
      {
        id: '4',
        date: new Date('2024-02-15'),
        amount: 2500,
        description: 'Restaurant Dinner',
        category: 'Food',
        type: 'debit',
        source: 'credit_card'
      },
      {
        id: '5',
        date: new Date('2024-02-18'),
        amount: 5000,
        description: 'Shopping Mall',
        category: 'Shopping',
        type: 'debit',
        source: 'credit_card'
      },
      {
        id: '6',
        date: new Date('2024-02-20'),
        amount: 2500,
        description: 'Fuel',
        category: 'Transportation',
        type: 'debit',
        source: 'credit_card'
      },
      {
        id: '7',
        date: new Date('2024-02-22'),
        amount: 10000,
        description: 'Maid Payment',
        category: 'Services',
        type: 'debit',
        source: 'upi'
      }
    ];

    // Mock Bank Accounts
    const mockBankAccounts: BankAccount[] = [
      {
        id: '1',
        balance: 75000,
        accountType: 'Savings',
        bankName: 'HDFC Bank'
      }
    ];

    // Mock Credit Cards
    const mockCreditCards: CreditCard[] = [
      {
        id: '1',
        bank: 'HDFC Bank',
        lastFourDigits: '4567',
        totalLimit: 200000,
        availableLimit: 155000,
        dueDate: new Date('2024-03-05'),
        outstandingAmount: 45000
      }
    ];

    // Mock Upcoming Payments
    const mockUpcomingPayments: UpcomingPayment[] = [
      {
        id: '1',
        amount: 15000,
        dueDate: new Date('2024-03-10'),
        description: 'Rent Payment',
        type: 'bank'
      },
      {
        id: '2',
        amount: 45000,
        dueDate: new Date('2024-03-05'),
        description: 'Credit Card Bill',
        type: 'credit_card'
      }
    ];

    setTransactions(mockTransactions);
    setBankAccounts(mockBankAccounts);
    setCreditCards(mockCreditCards);
    setUpcomingPayments(mockUpcomingPayments);
    
    // Calculate net cashflow
    const totalIncome = mockTransactions
      .filter(t => t.type === 'credit')
      .reduce((sum, t) => sum + t.amount, 0);
    
    const totalExpenses = mockTransactions
      .filter(t => t.type === 'debit')
      .reduce((sum, t) => sum + t.amount, 0);
    
    setNetCashflow(totalIncome - totalExpenses);
  }, []);

  // Helper function to format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount);
  };

  // Helper function to format date
  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    }).format(date);
  };

  return (
    <Container maxWidth="lg">
      <Box sx={{ py: 4 }}>
        {/* Header Section */}
        <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h4" fontWeight="bold">
            Financial Overview
          </Typography>
          <Select
            value={selectedAccount}
            onChange={handleAccountChange}
            sx={{ minWidth: 200 }}
          >
            <MenuItem value="all">All Accounts</MenuItem>
            {bankAccounts.map(account => (
              <MenuItem key={account.id} value={account.id}>
                {account.bankName} - {account.accountType}
              </MenuItem>
            ))}
            {creditCards.map(card => (
              <MenuItem key={card.id} value={card.id}>
                {card.bank} Card (*{card.lastFourDigits})
              </MenuItem>
            ))}
          </Select>
        </Box>

        {/* Quick Stats */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} md={4}>
            <Card sx={{ p: 3 }}>
              <Typography color="textSecondary" gutterBottom>
                Net Balance
              </Typography>
              <Typography variant="h4" color={netCashflow >= 0 ? 'success.main' : 'error.main'}>
                {formatCurrency(netCashflow)}
              </Typography>
              <LinearProgress 
                variant="determinate" 
                value={70} 
                sx={{ mt: 2 }}
                color={netCashflow >= 0 ? 'success' : 'error'}
              />
            </Card>
          </Grid>
          <Grid item xs={12} md={4}>
            <Card sx={{ p: 3 }}>
              <Typography color="textSecondary" gutterBottom>
                Bank Balance
              </Typography>
              <Typography variant="h4">
                {formatCurrency(bankAccounts[0]?.balance || 0)}
              </Typography>
              <LinearProgress 
                variant="determinate" 
                value={85} 
                sx={{ mt: 2 }}
                color="primary"
              />
            </Card>
          </Grid>
          <Grid item xs={12} md={4}>
            <Card sx={{ p: 3 }}>
              <Typography color="textSecondary" gutterBottom>
                Credit Card Usage
              </Typography>
              <Typography variant="h4">
                {formatCurrency(creditCards[0]?.outstandingAmount || 0)}
              </Typography>
              <LinearProgress 
                variant="determinate" 
                value={(creditCards[0]?.outstandingAmount || 0) / (creditCards[0]?.totalLimit || 1) * 100} 
                sx={{ mt: 2 }}
                color="warning"
              />
              <Typography variant="caption" color="textSecondary">
                Available: {formatCurrency(creditCards[0]?.availableLimit || 0)}
              </Typography>
            </Card>
          </Grid>
        </Grid>

        {/* Main Content Tabs */}
        <Box sx={{ width: '100%' }}>
          <Tabs
            value={activeTab}
            onChange={(_, newValue) => setActiveTab(newValue)}
            sx={{ mb: 3 }}
          >
            <Tab label="Transactions" />
            <Tab label="Cashflow" />
            <Tab label="Upcoming Payments" />
          </Tabs>

          {/* Transactions Tab */}
          {activeTab === 0 && (
            <Card sx={{ p: 3 }}>
              <List>
                {transactions.map((transaction) => (
                  <ListItem
                    key={transaction.id}
                    divider
                    secondaryAction={
                      <Typography
                        variant="h6"
                        color={transaction.type === 'credit' ? 'success.main' : 'error.main'}
                      >
                        {transaction.type === 'credit' ? '+' : '-'}
                        {formatCurrency(transaction.amount)}
                      </Typography>
                    }
                  >
                    <ListItemText
                      primary={transaction.description}
                      secondary={
                        <>
                          {formatDate(transaction.date)}
                          <Chip
                            size="small"
                            label={transaction.source.toUpperCase()}
                            sx={{ ml: 1 }}
                            color={
                              transaction.source === 'credit_card'
                                ? 'warning'
                                : transaction.source === 'upi'
                                ? 'info'
                                : 'default'
                            }
                          />
                        </>
                      }
                    />
                  </ListItem>
                ))}
              </List>
            </Card>
          )}

          {/* Cashflow Tab */}
          {activeTab === 1 && (
            <Card sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>
                Spending by Category
              </Typography>
              <Box sx={{ height: 400 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={transactions
                        .filter(t => t.type === 'debit')
                        .reduce((acc: any[], t) => {
                          const existing = acc.find(item => item.name === t.category);
                          if (existing) {
                            existing.value += t.amount;
                          } else {
                            acc.push({ name: t.category, value: t.amount });
                          }
                          return acc;
                        }, [])}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      outerRadius={150}
                      label={({ name, value }) => `${name}: ${formatCurrency(value)}`}
                    >
                      {transactions
                        .filter(t => t.type === 'debit')
                        .reduce((acc: any[], t) => {
                          if (!acc.find(item => item.name === t.category)) {
                            acc.push({ name: t.category });
                          }
                          return acc;
                        }, [])
                        .map((_, index) => (
                          <Cell key={`cell-${index}`} fill={`hsl(${index * 45}, 70%, 50%)`} />
                        ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </Box>
            </Card>
          )}

          {/* Upcoming Payments Tab */}
          {activeTab === 2 && (
            <Card sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>
                Scheduled Payments
              </Typography>
              <List>
                {upcomingPayments.map((payment) => (
                  <ListItem
                    key={payment.id}
                    divider
                    secondaryAction={
                      <Typography variant="h6" color="error.main">
                        -{formatCurrency(payment.amount)}
                      </Typography>
                    }
                  >
                    <ListItemText
                      primary={payment.description}
                      secondary={
                        <>
                          Due on {formatDate(payment.dueDate)}
                          <Chip
                            size="small"
                            label={payment.type === 'bank' ? 'BANK' : 'CREDIT CARD'}
                            sx={{ ml: 1 }}
                            color={payment.type === 'bank' ? 'primary' : 'warning'}
                          />
                        </>
                      }
                    />
                  </ListItem>
                ))}
              </List>

              {/* Recommendations */}
              <Box sx={{ mt: 4 }}>
                <Typography variant="h6" gutterBottom>
                  Smart Recommendations
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={12} md={6}>
                    <Card sx={{ p: 2, bgcolor: 'primary.light', color: 'primary.contrastText' }}>
                      <Typography variant="subtitle1" gutterBottom>
                        💡 Optimize Credit Card Usage
                      </Typography>
                      <Typography variant="body2">
                        Use your credit card for grocery purchases to earn 5% cashback
                      </Typography>
                    </Card>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <Card sx={{ p: 2, bgcolor: 'secondary.light', color: 'secondary.contrastText' }}>
                      <Typography variant="subtitle1" gutterBottom>
                        💰 Better Cashflow Management
                      </Typography>
                      <Typography variant="body2">
                        Consider paying rent via credit card to better manage monthly cashflow
                      </Typography>
                    </Card>
                  </Grid>
                </Grid>
              </Box>
            </Card>
          )}
        </Box>
      </Box>
    </Container>
  );
};

export default FinancialDashboard; 