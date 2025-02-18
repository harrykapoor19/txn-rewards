import React, { useState, useEffect, useRef } from 'react';
import {
  Box,
  Card,
  Typography,
  Tabs,
  Tab,
  Grid,
  List,
  ListItem,
  ListItemText,
  Chip,
  Avatar,
  TextField,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Slide,
  BottomNavigation,
  BottomNavigationAction,
  ListItemIcon,
  Menu,
  MenuItem,
  AvatarGroup,
} from '@mui/material';
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
} from 'recharts';
import SearchIcon from '@mui/icons-material/Search';
import HomeIcon from '@mui/icons-material/Home';
import ReceiptIcon from '@mui/icons-material/Receipt';
import QrCodeScannerIcon from '@mui/icons-material/QrCodeScanner';
import CardGiftcardIcon from '@mui/icons-material/CardGiftcard';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import HomeWorkIcon from '@mui/icons-material/HomeWork';
import SupportIcon from '@mui/icons-material/Support';
import { TransitionProps } from '@mui/material/transitions';

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

interface Reward {
  id: string;
  transactionId: string;
  type: 'cashback' | 'voucher';
  amount: number;
  merchant: string;
  claimed: boolean;
}

interface Friend {
  id: string;
  name: string;
  photoUrl: string;
  phone: string;
}

const Transition = React.forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement;
  },
  ref: React.Ref<unknown>,
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const FinancialDashboard: React.FC = () => {
  const [selectedAccount, setSelectedAccount] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [creditCards, setCreditCards] = useState<CreditCard[]>([]);
  const [upcomingPayments, setUpcomingPayments] = useState<UpcomingPayment[]>([]);
  const [rewards, setRewards] = useState<Reward[]>([]);
  const [isRewardDialogOpen, setIsRewardDialogOpen] = useState(false);
  const [currentReward, setCurrentReward] = useState<Reward | null>(null);
  const [isJackpotSpinning, setIsJackpotSpinning] = useState(false);
  const [bankBalance, setBankBalance] = useState(75000);
  const [isBalanceAnimating, setIsBalanceAnimating] = useState(false);
  const [bottomTab, setBottomTab] = useState(0);
  const [transactionTab, setTransactionTab] = useState(0);
  const [moreMenuAnchor, setMoreMenuAnchor] = useState<null | HTMLElement>(null);
  const [showReferralDialog, setShowReferralDialog] = useState(false);
  const [friends] = useState<Friend[]>([
    {
      id: '1',
      name: 'Rahul Sharma',
      photoUrl: 'https://i.pravatar.cc/150?img=11',
      phone: '+91987654321'
    },
    {
      id: '2',
      name: 'Priya Patel',
      photoUrl: 'https://i.pravatar.cc/150?img=44',
      phone: '+91987654322'
    },
    {
      id: '3',
      name: 'Amit Kumar',
      photoUrl: 'https://i.pravatar.cc/150?img=67',
      phone: '+91987654323'
    },
    {
      id: '4',
      name: 'Neha Singh',
      photoUrl: 'https://i.pravatar.cc/150?img=47',
      phone: '+91987654324'
    },
    {
      id: '5',
      name: 'Raj Malhotra',
      photoUrl: 'https://i.pravatar.cc/150?img=12',
      phone: '+91987654325'
    }
  ]);

  const animationFrameRef = useRef<number>();

  const handleAccountFilter = (accountType: string) => {
    setSelectedAccount(accountType);
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
  };

  const filteredTransactions = transactions.filter(transaction => {
    const matchesSearch = transaction.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesAccount = selectedAccount === 'all' || 
      (selectedAccount === 'bank' && (transaction.source === 'bank' || transaction.source === 'upi')) ||
      (selectedAccount === 'credit_card' && transaction.source === 'credit_card');
    return matchesSearch && matchesAccount;
  });

  const handleClaimReward = (reward: Reward) => {
    setCurrentReward(reward);
    setIsRewardDialogOpen(true);
  };

  const handleSpinJackpot = () => {
    setIsJackpotSpinning(true);
    
    // Simulate jackpot game
    setTimeout(() => {
      setIsJackpotSpinning(false);
      if (currentReward?.type === 'cashback') {
        // Animate bank balance increase
        animateBankBalance(bankBalance, bankBalance + 10);
      }
      // Mark reward as claimed after spin
      setCurrentReward(prev => prev ? { ...prev, claimed: true } : null);
      
      // Show referral dialog after Uber cashback is claimed
      if (currentReward?.merchant === 'Uber') {
        setTimeout(() => {
          setIsRewardDialogOpen(false);
          setShowReferralDialog(true);
        }, 2000);
      }
    }, 3000);
  };

  const animateBankBalance = (start: number, end: number) => {
    setIsBalanceAnimating(true);
    const duration = 2000; // 2 seconds
    const startTime = performance.now();
    
    const animate = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      const currentBalance = start + (end - start) * progress;
      setBankBalance(Math.round(currentBalance));
      
      if (progress < 1) {
        animationFrameRef.current = requestAnimationFrame(animate);
      } else {
        setIsBalanceAnimating(false);
      }
    };
    
    animationFrameRef.current = requestAnimationFrame(animate);
  };

  const handleMoreClick = (event: React.MouseEvent<HTMLElement>) => {
    setMoreMenuAnchor(event.currentTarget);
  };

  const handleMoreClose = () => {
    setMoreMenuAnchor(null);
  };

  const handlePayNow = (payment: UpcomingPayment) => {
    // Here you would integrate with a payment gateway
    alert(`Initiating payment of ${formatCurrency(payment.amount)} for ${payment.description}`);
  };

  const handleRewardNotificationClick = () => {
    setBottomTab(1); // Switch to transactions tab
    setTransactionTab(0); // Ensure we're on the "All Transactions" sub-tab
  };

  const handleInviteAll = () => {
    // Here you would implement the actual invite functionality
    alert('Invites sent to all friends!');
    setShowReferralDialog(false);
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
      },
      {
        id: '8',
        date: new Date('2024-02-24'),
        amount: 500,
        description: 'Uber Ride',
        category: 'Transportation',
        type: 'debit',
        source: 'credit_card'
      },
      {
        id: '9',
        date: new Date('2024-02-23'),
        amount: 800,
        description: 'Zomato Order',
        category: 'Food',
        type: 'debit',
        source: 'credit_card'
      },
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
      },
      {
        id: '3',
        amount: 10000,
        dueDate: new Date('2024-03-15'),
        description: 'SIP Investment - HDFC Mid Cap Fund',
        type: 'bank'
      },
      {
        id: '4',
        amount: 15000,
        dueDate: new Date('2024-03-20'),
        description: 'iPhone EMI Payment',
        type: 'credit_card'
      },
    ];

    const mockRewards: Reward[] = [
      {
        id: '1',
        transactionId: '8',
        type: 'cashback',
        amount: 100,
        merchant: 'Uber',
        claimed: false
      },
      {
        id: '2',
        transactionId: '9',
        type: 'voucher',
        amount: 200,
        merchant: 'Zomato',
        claimed: false
      },
    ];

    setTransactions(mockTransactions);
    setCreditCards(mockCreditCards);
    setUpcomingPayments(mockUpcomingPayments);
    setRewards(mockRewards);
    
    // Calculate net cashflow
    const totalIncome = mockTransactions
      .filter(t => t.type === 'credit')
      .reduce((sum, t) => sum + t.amount, 0);
    
    const totalExpenses = mockTransactions
      .filter(t => t.type === 'debit')
      .reduce((sum, t) => sum + t.amount, 0);
    
    setBankBalance(mockBankAccounts[0]?.balance || 0);
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

  // Helper function to check if payment is due within 7 days
  const isPaymentSoon = (dueDate: Date) => {
    const today = new Date();
    const sevenDaysFromNow = new Date(today);
    sevenDaysFromNow.setDate(today.getDate() + 7);
    return dueDate <= sevenDaysFromNow;
  };

  // Helper function to check if payment is the closest upcoming payment within 7 days
  const isClosestUpcomingPayment = (payment: UpcomingPayment, allPayments: UpcomingPayment[]) => {
    const today = new Date();
    const sevenDaysFromNow = new Date(today);
    sevenDaysFromNow.setDate(today.getDate() + 7);

    // First check if this payment is within 7 days
    if (payment.dueDate > sevenDaysFromNow) return false;

    // Then check if it's the closest one
    const closestPayment = [...allPayments]
      .filter(p => p.dueDate <= sevenDaysFromNow)
      .sort((a, b) => a.dueDate.getTime() - b.dueDate.getTime())[0];

    return closestPayment?.id === payment.id;
  };

  return (
    <Box sx={{ 
      height: '100vh',
      backgroundColor: '#f5f6fa',
      position: 'relative'
    }}>
      {/* Main Content Area */}
      <Box sx={{ 
        pb: 7, // Space for bottom navigation
        height: '100%',
        overflow: 'auto'
      }}>
        {/* Home Tab */}
        {bottomTab === 0 && (
          <Box sx={{ p: 2 }}>
            {/* Quick Stats */}
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <Card sx={{ 
                  p: 3, 
                  borderRadius: 3,
                  background: 'linear-gradient(45deg, #1a237e 30%, #283593 90%)',
                  color: 'white'
                }}>
                  <Typography 
                    variant="subtitle2" 
                    sx={{ mb: 1, opacity: 0.8 }}
                  >
                    Bank Balance
                  </Typography>
                  <Typography 
                    variant="h4"
                    sx={{
                      transition: 'all 0.3s ease',
                      color: isBalanceAnimating ? '#4caf50' : 'white',
                      fontWeight: 'bold'
                    }}
                  >
                    {formatCurrency(bankBalance)}
                  </Typography>
                </Card>
              </Grid>
              <Grid item xs={12}>
                <Card sx={{ 
                  p: 3, 
                  borderRadius: 3,
                  background: 'linear-gradient(45deg, #c2185b 30%, #d81b60 90%)',
                  color: 'white'
                }}>
                  <Typography 
                    variant="subtitle2" 
                    sx={{ mb: 1, opacity: 0.8 }}
                  >
                    Credit Card Usage
                  </Typography>
                  <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                    {formatCurrency(creditCards[0]?.outstandingAmount || 0)}
                  </Typography>
                  <Typography 
                    variant="body2" 
                    sx={{ mt: 1, opacity: 0.8 }}
                  >
                    Available: {formatCurrency(creditCards[0]?.availableLimit || 0)}
                  </Typography>
                </Card>
              </Grid>
            </Grid>

            {/* Reward Notification Card */}
            {rewards.some(r => !r.claimed) && (
              <Card 
                sx={{ 
                  mt: 3,
                  p: 3, 
                  borderRadius: 3,
                  background: 'white',
                  color: '#6a1b9a',
                  cursor: 'pointer',
                  border: '2px solid #8e24aa',
                  transition: 'transform 0.2s',
                  '&:hover': {
                    transform: 'scale(1.02)'
                  }
                }}
                onClick={handleRewardNotificationClick}
              >
                <Box sx={{ 
                  display: 'flex', 
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}>
                  <Box>
                    <Typography variant="subtitle1" sx={{ mb: 1, fontWeight: 'bold' }}>
                      Your last transaction on Uber unlocked a reward
                    </Typography>
                    <Button
                      variant="outlined"
                      size="small"
                      sx={{ 
                        color: '#6a1b9a',
                        borderColor: '#8e24aa',
                        '&:hover': {
                          borderColor: '#6a1b9a',
                          backgroundColor: 'rgba(106, 27, 154, 0.1)'
                        },
                        textTransform: 'none',
                        borderRadius: 2
                      }}
                    >
                      Claim Now
                    </Button>
                  </Box>
                  <CardGiftcardIcon sx={{ fontSize: 32, color: '#8e24aa' }} />
                </Box>
              </Card>
            )}

            {/* Upcoming Payments Section */}
            <Box sx={{ mt: 3 }}>
              <Typography variant="h6" sx={{ mb: 2, px: 1 }}>
                Upcoming Payments
              </Typography>
              <Card sx={{ borderRadius: 3 }}>
                <List>
                  {[...upcomingPayments]
                    .sort((a, b) => a.dueDate.getTime() - b.dueDate.getTime())
                    .map((payment) => {
                      const isClosest = isClosestUpcomingPayment(payment, upcomingPayments);
                      return (
                        <ListItem
                          key={payment.id}
                          divider
                          sx={{ 
                            py: 2,
                            display: 'flex',
                            flexDirection: { xs: 'column', sm: 'row' },
                            alignItems: { xs: 'flex-start', sm: 'center' },
                            gap: { xs: 1, sm: 0 }
                          }}
                        >
                          <ListItemText
                            primary={
                              <Typography variant="subtitle1" sx={{ fontWeight: 'medium' }}>
                                {payment.description}
                              </Typography>
                            }
                            secondary={
                              <Box sx={{ mt: 0.5 }}>
                                <Typography 
                                  variant="body2" 
                                  sx={{ 
                                    color: isClosest ? 'error.main' : 'text.secondary',
                                    fontWeight: isClosest ? 'medium' : 'normal'
                                  }}
                                >
                                  Due on {formatDate(payment.dueDate)}
                                  {isClosest && ' (Coming up soon!)'}
                                </Typography>
                                <Chip
                                  size="small"
                                  label={payment.type === 'bank' ? 'BANK' : 'CREDIT CARD'}
                                  sx={{ mt: 1 }}
                                  color={payment.type === 'bank' ? 'primary' : 'warning'}
                                />
                              </Box>
                            }
                          />
                          <Box sx={{ 
                            display: 'flex',
                            flexDirection: { xs: 'row', sm: 'column' },
                            alignItems: { xs: 'center', sm: 'flex-end' },
                            gap: 2,
                            width: { xs: '100%', sm: 'auto' },
                            justifyContent: { xs: 'space-between', sm: 'flex-end' }
                          }}>
                            <Typography 
                              variant="subtitle1" 
                              color="error"
                              sx={{ fontWeight: 'medium' }}
                            >
                              {formatCurrency(payment.amount)}
                            </Typography>
                            <Button
                              variant="contained"
                              color="primary"
                              size="small"
                              onClick={() => handlePayNow(payment)}
                              sx={{ 
                                borderRadius: 2,
                                textTransform: 'none',
                                fontWeight: 'medium',
                                minWidth: 100
                              }}
                            >
                              Pay Now
                            </Button>
                          </Box>
                        </ListItem>
                      );
                    })}
                </List>
              </Card>
            </Box>
          </Box>
        )}

        {/* Transactions Tab */}
        {bottomTab === 1 && (
          <Box>
          <Tabs
              value={transactionTab}
              onChange={(_, newValue) => setTransactionTab(newValue)}
              sx={{ 
                borderBottom: 1,
                borderColor: 'divider',
                '& .MuiTab-root': {
                  fontSize: '0.9rem',
                  textTransform: 'none'
                }
              }}
            >
              <Tab label="All Transactions" />
            <Tab label="Cashflow" />
          </Tabs>

            {transactionTab === 0 && (
              <Box sx={{ p: 2 }}>
                {/* Bank Balance Card */}
                <Card sx={{ 
                  p: 3, 
                  borderRadius: 3,
                  background: 'linear-gradient(45deg, #1a237e 30%, #283593 90%)',
                  color: 'white',
                  mb: 2
                }}>
                  <Typography 
                    variant="subtitle2" 
                    sx={{ mb: 1, opacity: 0.8 }}
                  >
                    Bank Balance
                  </Typography>
                  <Typography 
                    variant="h4"
                    sx={{
                      transition: 'all 0.3s ease',
                      color: isBalanceAnimating ? '#4caf50' : 'white',
                      fontWeight: 'bold'
                    }}
                  >
                    {formatCurrency(bankBalance)}
                  </Typography>
                </Card>

                <TextField
                  fullWidth
                  variant="outlined"
                  placeholder="Search transactions..."
                  value={searchQuery}
                  onChange={handleSearchChange}
                  InputProps={{
                    startAdornment: <SearchIcon sx={{ mr: 1, color: 'text.secondary' }} />,
                  }}
                  sx={{
                    mb: 2,
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 3,
                      backgroundColor: 'white'
                    }
                  }}
                />

                <Card sx={{ borderRadius: 3 }}>
                  <List>
                    {[...filteredTransactions]
                      .sort((a, b) => b.date.getTime() - a.date.getTime())
                      .sort((a, b) => {
                        const isASpecial = a.description.includes('Uber') || a.description.includes('Zomato');
                        const isBSpecial = b.description.includes('Uber') || b.description.includes('Zomato');
                        if (isASpecial && !isBSpecial) return -1;
                        if (!isASpecial && isBSpecial) return 1;
                        return 0;
                      })
                      .map((transaction) => (
                        <ListItem
                          key={transaction.id}
                          divider
                          sx={{ py: 2 }}
                        >
                          <ListItemText
                            primary={
                              <Typography variant="subtitle1" sx={{ fontWeight: 'medium' }}>
                                {transaction.description}
                              </Typography>
                            }
                            secondary={
                              <Box sx={{ mt: 0.5 }}>
                                <Typography variant="body2" color="text.secondary">
                                  {formatDate(transaction.date)}
                                </Typography>
                                <Chip
                                  size="small"
                                  label={transaction.source === 'credit_card' ? 'CREDIT CARD' : 'BANK'}
                                  sx={{ mt: 1 }}
                                  color={transaction.source === 'credit_card' ? 'warning' : 'primary'}
                                />
                              </Box>
                            }
                          />
                          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 1 }}>
                            <Typography
                              variant="subtitle1"
                              sx={{ 
                                color: transaction.type === 'credit' ? 'success.main' : 'error.main',
                                fontWeight: 'medium'
                              }}
                            >
                              {transaction.type === 'credit' ? '+' : ''}
                              {formatCurrency(transaction.amount)}
                            </Typography>
                            {rewards.find(r => r.transactionId === transaction.id && !r.claimed) && (
                              <Button
                                variant="contained"
                                color="secondary"
                                size="small"
                                sx={{ 
                                  borderRadius: 2,
                                  textTransform: 'none',
                                  fontWeight: 'medium'
                                }}
                                onClick={() => handleClaimReward(rewards.find(r => r.transactionId === transaction.id)!)}
                              >
                                Claim Reward
                              </Button>
                            )}
                          </Box>
                        </ListItem>
                      ))}
                  </List>
                </Card>
              </Box>
            )}

            {transactionTab === 1 && (
              <Box sx={{ p: 2 }}>
                <Card sx={{ p: 3, borderRadius: 3 }}>
                  <Typography variant="h6" gutterBottom>
                    Spending by Category
                  </Typography>
                  <Box sx={{ height: 300 }}>
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
                          outerRadius={100}
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
              </Box>
            )}
          </Box>
        )}

        {/* Scanner Tab */}
        {bottomTab === 2 && (
          <Box sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            height: 'calc(100vh - 56px)' // Subtract bottom nav height
          }}>
            <Typography variant="h6" color="text.secondary">
              Scanner Coming Soon
            </Typography>
          </Box>
        )}

        {/* Rewards Tab */}
        {bottomTab === 3 && (
          <Box sx={{ p: 2 }}>
            <Typography variant="h6" sx={{ mb: 2, px: 1 }}>
              Available Rewards
            </Typography>
            <Card sx={{ borderRadius: 3 }}>
              <List>
                {rewards
                  .filter(r => !r.claimed)
                  .map((reward) => (
                    <ListItem
                      key={reward.id}
                      divider
                      sx={{ py: 2 }}
                    >
                      <ListItemText
                        primary={
                          <Typography variant="subtitle1" sx={{ fontWeight: 'medium' }}>
                            {reward.merchant} Reward
                          </Typography>
                        }
                        secondary={
                          <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                            {reward.type === 'cashback' ? 'Cashback' : 'Voucher'} available
              </Typography>
                        }
                      />
                      <Button
                        variant="contained"
                        color="secondary"
                        size="small"
                        sx={{ 
                          borderRadius: 2,
                          textTransform: 'none',
                          fontWeight: 'medium'
                        }}
                        onClick={() => handleClaimReward(reward)}
                      >
                        Claim Now
                      </Button>
                    </ListItem>
                  ))}
              </List>
            </Card>
          </Box>
        )}
      </Box>

      {/* Bottom Navigation */}
      <BottomNavigation
        value={bottomTab}
        onChange={(_, newValue) => setBottomTab(newValue)}
        sx={{ 
          width: '100%',
          position: 'fixed',
          bottom: 0,
          borderTop: 1,
          borderColor: 'divider',
          backgroundColor: 'white'
        }}
      >
        <BottomNavigationAction label="Home" icon={<HomeIcon />} />
        <BottomNavigationAction label="Transactions" icon={<ReceiptIcon />} />
        <BottomNavigationAction 
          label="Scan" 
          icon={
            <Box sx={{ 
              bgcolor: 'secondary.main',
              borderRadius: '50%',
              p: 1,
              transform: 'translateY(-12px)'
            }}>
              <QrCodeScannerIcon sx={{ color: 'white' }} />
            </Box>
          }
        />
        <BottomNavigationAction label="Rewards" icon={<CardGiftcardIcon />} />
        <BottomNavigationAction 
          label="More" 
          icon={<MoreHorizIcon />}
          onClick={handleMoreClick}
        />
      </BottomNavigation>

      {/* More Menu */}
      <Menu
        anchorEl={moreMenuAnchor}
        open={Boolean(moreMenuAnchor)}
        onClose={handleMoreClose}
        PaperProps={{
          sx: { width: 200, maxWidth: '100%' }
        }}
      >
        <MenuItem onClick={handleMoreClose}>
          <ListItemIcon>
            <DirectionsCarIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Garage</ListItemText>
        </MenuItem>
        <MenuItem onClick={handleMoreClose}>
          <ListItemIcon>
            <HomeWorkIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Rent</ListItemText>
        </MenuItem>
        <MenuItem onClick={handleMoreClose}>
          <ListItemIcon>
            <SupportIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Support</ListItemText>
        </MenuItem>
      </Menu>

      {/* Reward Claim Dialog */}
      <Dialog
        open={isRewardDialogOpen}
        TransitionComponent={Transition}
        keepMounted
        onClose={() => !isJackpotSpinning && setIsRewardDialogOpen(false)}
        PaperProps={{
          sx: {
            borderRadius: 2,
            minWidth: 320
          }
        }}
      >
        <DialogTitle sx={{ textAlign: 'center', pt: 3 }}>
          {isJackpotSpinning ? "Spinning the Jackpot! 🎰" : currentReward?.claimed ? "Congratulations! 🎉" : "Surprise Reward! 🎁"}
        </DialogTitle>
        <DialogContent>
          {isJackpotSpinning ? (
            <Box sx={{ textAlign: 'center', py: 4 }}>
              <Typography variant="h5" sx={{ mb: 2 }}>
                🎰 Spinning...
              </Typography>
            </Box>
          ) : (
            <Box sx={{ textAlign: 'center', py: 4 }}>
              {!currentReward?.claimed && (
                <>
                  <Typography variant="h6" sx={{ mb: 3 }}>
                    You've found a surprise reward on your {currentReward?.merchant} transaction!
                  </Typography>
                  <Button
                    variant="contained"
                    color="secondary"
                    size="large"
                    onClick={handleSpinJackpot}
                    sx={{ 
                      px: 4, 
                      py: 1.5,
                      borderRadius: 2,
                      textTransform: 'none',
                      fontSize: '1.1rem'
                    }}
                  >
                    Spin to Reveal
                  </Button>
                </>
              )}
              {currentReward?.claimed && (
                <>
                  <Typography variant="h5" sx={{ mb: 3, color: 'success.main' }}>
                    {currentReward?.type === 'cashback' 
                      ? `You've won ₹10 cashback!` 
                      : `You've won ₹${currentReward?.amount} ${currentReward?.merchant} voucher!`}
                  </Typography>
                  <Typography color="text.secondary">
                    {currentReward?.type === 'cashback' 
                      ? "The cashback has been credited to your bank account." 
                      : "You can use this voucher on your next order."}
                  </Typography>
                </>
              )}
            </Box>
          )}
        </DialogContent>
        <DialogActions sx={{ justifyContent: 'center', pb: 3 }}>
          <Button 
            onClick={() => setIsRewardDialogOpen(false)}
            color="primary"
            disabled={isJackpotSpinning}
            sx={{ 
              textTransform: 'none',
              fontSize: '1rem'
            }}
          >
            {currentReward?.claimed ? 'Done' : 'Close'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Referral Dialog */}
      <Dialog
        open={showReferralDialog}
        TransitionComponent={Transition}
        keepMounted
        onClose={() => setShowReferralDialog(false)}
        PaperProps={{
          sx: {
            borderRadius: 2,
            minWidth: 320,
            maxWidth: 400
          }
        }}
      >
        <DialogTitle sx={{ textAlign: 'center', pt: 3 }}>
          Unlock More Rewards! 🎁
        </DialogTitle>
        <DialogContent>
          <Box sx={{ textAlign: 'center', py: 2 }}>
            <Typography variant="h6" sx={{ mb: 2, fontWeight: 'medium' }}>
              Get Cashback on Every Transaction
            </Typography>
            <Typography color="text.secondary" sx={{ mb: 3 }}>
              Invite friends to check their spends and both of you will earn cashback on every transaction for 1 month!
            </Typography>
            
            {/* Friends List */}
            <Box sx={{ mb: 3 }}>
              <AvatarGroup 
                max={5}
                sx={{ 
                  justifyContent: 'center',
                  '.MuiAvatar-root': { width: 56, height: 56, border: 2 }
                }}
              >
                {friends.map((friend) => (
                  <Avatar
                    key={friend.id}
                    src={friend.photoUrl}
                    alt={friend.name}
                    sx={{ width: 56, height: 56 }}
                  />
                ))}
              </AvatarGroup>
            </Box>

            <List sx={{ mb: 3 }}>
              {friends.map((friend) => (
                <ListItem
                  key={friend.id}
                  sx={{
                    py: 1,
                    px: 2,
                    borderRadius: 2,
                    mb: 1,
                    bgcolor: 'background.paper',
                    boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
                  }}
                >
                  <ListItemIcon>
                    <Avatar src={friend.photoUrl} />
                  </ListItemIcon>
                  <ListItemText 
                    primary={friend.name}
                    secondary={friend.phone}
                  />
                </ListItem>
              ))}
            </List>

            <Button
              variant="contained"
              color="secondary"
              fullWidth
              size="large"
              onClick={handleInviteAll}
              sx={{ 
                borderRadius: 2,
                py: 1.5,
                textTransform: 'none',
                fontSize: '1.1rem',
                fontWeight: 'medium'
              }}
            >
              Invite All Friends
            </Button>
          </Box>
        </DialogContent>
        <DialogActions sx={{ justifyContent: 'center', pb: 3 }}>
          <Button 
            onClick={() => setShowReferralDialog(false)}
            color="primary"
            sx={{ 
              textTransform: 'none',
              fontSize: '1rem'
            }}
          >
            Maybe Later
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default FinancialDashboard; 