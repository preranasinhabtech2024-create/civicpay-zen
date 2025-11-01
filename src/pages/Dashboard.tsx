import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Bill } from '@/types';
import { fetchBills, fetchFastag } from '@/utils/api';
import BillCard from '@/components/dashboard/BillCard';
import PaymentModal from '@/components/dashboard/PaymentModal';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Car, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [bills, setBills] = useState<Bill[]>([]);
  const [fastagBalance, setFastagBalance] = useState<number>(0);
  const [selectedBill, setSelectedBill] = useState<Bill | null>(null);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, [user]);

  const loadData = async () => {
    if (!user) return;

    setIsLoading(true);
    try {
      const [billsData, fastagData] = await Promise.all([
        fetchBills(user.citizen_id),
        fetchFastag(user.citizen_id),
      ]);

      setBills(billsData);
      if (fastagData.length > 0) {
        setFastagBalance(fastagData[0].balance);
      }
    } catch (error) {
      console.error('Failed to load dashboard data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePayClick = (bill: Bill) => {
    setSelectedBill(bill);
    setIsPaymentModalOpen(true);
  };

  const handlePaymentSuccess = () => {
    loadData();
  };

  const totalOutstanding = bills
    .filter((bill) => !bill.payment_date)
    .reduce((sum, bill) => sum + bill.amount, 0);

  const nextDueBill = bills
    .filter((bill) => !bill.payment_date)
    .sort((a, b) => new Date(a.due_date).getTime() - new Date(b.due_date).getTime())[0];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-pulse text-muted-foreground">Loading your dashboard...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Outstanding
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">₹{totalOutstanding.toLocaleString('en-IN')}</p>
            <p className="text-sm text-muted-foreground mt-1">
              {bills.filter((b) => !b.payment_date).length} pending bills
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Next Due Date
            </CardTitle>
          </CardHeader>
          <CardContent>
            {nextDueBill ? (
              <>
                <p className="text-2xl font-bold">
                  {new Date(nextDueBill.due_date).toLocaleDateString('en-IN', {
                    month: 'short',
                    day: 'numeric',
                  })}
                </p>
                <p className="text-sm text-muted-foreground mt-1 capitalize">
                  {nextDueBill.bill_type.replace('_', ' ')} - ₹{nextDueBill.amount}
                </p>
              </>
            ) : (
              <p className="text-xl text-muted-foreground">No pending bills</p>
            )}
          </CardContent>
        </Card>

        <Card className={fastagBalance < 500 ? 'border-warning' : ''}>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <Car className="w-4 h-4" />
              Fastag Balance
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className={`text-3xl font-bold ${fastagBalance < 500 ? 'text-warning' : ''}`}>
              ₹{fastagBalance.toLocaleString('en-IN')}
            </p>
            {fastagBalance < 500 ? (
              <Button
                variant="link"
                className="p-0 h-auto text-warning hover:text-warning/80 mt-1"
                onClick={() => navigate('/fastag')}
              >
                Top up now →
              </Button>
            ) : (
              <p className="text-sm text-success mt-1">Sufficient balance</p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Bills Section */}
      <div>
        <h2 className="text-2xl font-bold mb-4">Your Bills</h2>
        {bills.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <AlertCircle className="w-12 h-12 text-muted-foreground mb-4" />
              <p className="text-lg text-muted-foreground">No bills found</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {bills.map((bill) => (
              <BillCard key={bill.bill_id} bill={bill} onPayClick={handlePayClick} />
            ))}
          </div>
        )}
      </div>

      {/* Payment Modal */}
      <PaymentModal
        bill={selectedBill}
        isOpen={isPaymentModalOpen}
        onClose={() => setIsPaymentModalOpen(false)}
        onPaymentSuccess={handlePaymentSuccess}
      />
    </div>
  );
};

export default Dashboard;
