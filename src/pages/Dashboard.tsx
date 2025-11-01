import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Bill, Property } from '@/types';
import { fetchBills, fetchFastag, fetchProperties } from '@/utils/api';
import BillCard from '@/components/dashboard/BillCard';
import PaymentModal from '@/components/dashboard/PaymentModal';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Car, AlertCircle, Building2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [bills, setBills] = useState<Bill[]>([]);
  const [properties, setProperties] = useState<Property[]>([]);
  const [selectedPropertyId, setSelectedPropertyId] = useState<string>('');
  const [fastags, setFastags] = useState<any[]>([]);
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
      const [billsData, fastagData, propertiesData] = await Promise.all([
        fetchBills(user.citizen_id),
        fetchFastag(user.citizen_id),
        fetchProperties(user.citizen_id),
      ]);

      setBills(billsData);
      setProperties(propertiesData);
      setFastags(fastagData);
      
      // Set first property as default selected
      if (propertiesData.length > 0 && !selectedPropertyId) {
        setSelectedPropertyId(propertiesData[0].property_id);
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

  // Filter bills by selected property
  const filteredBills = bills.filter((bill) => bill.property_id === selectedPropertyId);

  const totalOutstanding = filteredBills
    .filter((bill) => !bill.payment_date)
    .reduce((sum, bill) => sum + bill.amount, 0);

  const nextDueBill = filteredBills
    .filter((bill) => !bill.payment_date)
    .sort((a, b) => new Date(a.due_date).getTime() - new Date(b.due_date).getTime())[0];

  // Calculate total Fastag balance across all vehicles
  const totalFastagBalance = fastags.reduce((sum, fastag) => sum + fastag.balance, 0);
  const lowBalanceVehicles = fastags.filter((f) => f.balance < 500);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-pulse text-muted-foreground">Loading your dashboard...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Property Selector */}
      {properties.length > 1 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building2 className="w-5 h-5" />
              Your Properties
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs value={selectedPropertyId} onValueChange={setSelectedPropertyId}>
              <TabsList className="grid w-full grid-cols-2">
                {properties.map((property) => (
                  <TabsTrigger key={property.property_id} value={property.property_id}>
                    <div className="text-left">
                      <p className="font-medium">{property.property_type}</p>
                      <p className="text-xs text-muted-foreground">{property.address}</p>
                    </div>
                  </TabsTrigger>
                ))}
              </TabsList>
            </Tabs>
          </CardContent>
        </Card>
      )}

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
              {filteredBills.filter((b) => !b.payment_date).length} pending bills
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

        <Card className={lowBalanceVehicles.length > 0 ? 'border-warning' : ''}>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <Car className="w-4 h-4" />
              Fastag Balance ({fastags.length} {fastags.length === 1 ? 'Vehicle' : 'Vehicles'})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className={`text-3xl font-bold ${lowBalanceVehicles.length > 0 ? 'text-warning' : ''}`}>
              ₹{totalFastagBalance.toLocaleString('en-IN')}
            </p>
            {lowBalanceVehicles.length > 0 ? (
              <div className="mt-2 space-y-1">
                <p className="text-sm text-warning">
                  {lowBalanceVehicles.length} vehicle{lowBalanceVehicles.length > 1 ? 's' : ''} with low balance
                </p>
                <Button
                  variant="link"
                  className="p-0 h-auto text-warning hover:text-warning/80"
                  onClick={() => navigate('/fastag')}
                >
                  Top up now →
                </Button>
              </div>
            ) : (
              <p className="text-sm text-success mt-1">All vehicles have sufficient balance</p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Bills Section */}
      <div>
        <h2 className="text-2xl font-bold mb-4">Your Bills</h2>
        {filteredBills.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <AlertCircle className="w-12 h-12 text-muted-foreground mb-4" />
              <p className="text-lg text-muted-foreground">No bills found for this property</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filteredBills.map((bill) => (
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
