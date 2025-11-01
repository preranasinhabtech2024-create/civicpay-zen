import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Fastag as FastagType } from '@/types';
import { fetchFastag, topUpFastag } from '@/utils/api';
import FastagCard from '@/components/fastag/FastagCard';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from '@/hooks/use-toast';
import { AlertCircle } from 'lucide-react';

const Fastag = () => {
  const { user } = useAuth();
  const [fastags, setFastags] = useState<FastagType[]>([]);
  const [selectedFastag, setSelectedFastag] = useState<FastagType | null>(null);
  const [isTopUpModalOpen, setIsTopUpModalOpen] = useState(false);
  const [topUpAmount, setTopUpAmount] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadFastagData();
  }, [user]);

  const loadFastagData = async () => {
    if (!user) return;

    setIsLoading(true);
    try {
      const data = await fetchFastag(user.citizen_id);
      setFastags(data);
    } catch (error) {
      console.error('Failed to load Fastag data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleTopUpClick = (fastag: FastagType) => {
    setSelectedFastag(fastag);
    setIsTopUpModalOpen(true);
  };

  const handleTopUp = async () => {
    if (!selectedFastag || !topUpAmount) return;

    const amount = parseFloat(topUpAmount);
    if (isNaN(amount) || amount <= 0) {
      toast({
        variant: "destructive",
        title: "Invalid Amount",
        description: "Please enter a valid amount greater than 0.",
      });
      return;
    }

    setIsProcessing(true);
    try {
      await topUpFastag(selectedFastag.fastag_id, amount);
      
      toast({
        title: "Top Up Successful",
        description: `₹${amount.toLocaleString('en-IN')} has been added to your Fastag balance.`,
      });

      setIsTopUpModalOpen(false);
      setTopUpAmount('');
      loadFastagData();
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Top Up Failed",
        description: "There was an error processing your top up. Please try again.",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-pulse text-muted-foreground">Loading Fastag details...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">Fastag Management</h1>
        <p className="text-muted-foreground">
          View your linked vehicles and manage Fastag balances
        </p>
      </div>

      {fastags.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 bg-card rounded-lg border">
          <AlertCircle className="w-12 h-12 text-muted-foreground mb-4" />
          <p className="text-lg text-muted-foreground mb-2">No Fastag linked</p>
          <p className="text-sm text-muted-foreground">
            Contact support to link your vehicle Fastag
          </p>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {fastags.map((fastag) => (
            <FastagCard
              key={fastag.fastag_id}
              fastag={fastag}
              onTopUpClick={handleTopUpClick}
            />
          ))}
        </div>
      )}

      {/* Top Up Modal */}
      <Dialog open={isTopUpModalOpen} onOpenChange={setIsTopUpModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Top Up Fastag</DialogTitle>
            <DialogDescription>
              Add balance to your Fastag for {selectedFastag?.vehicle_number}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="p-4 bg-card rounded-lg border">
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Current Balance</span>
                <span className="text-xl font-bold">
                  ₹{selectedFastag?.balance.toLocaleString('en-IN')}
                </span>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="amount">Top Up Amount</Label>
              <Input
                id="amount"
                type="number"
                placeholder="Enter amount"
                value={topUpAmount}
                onChange={(e) => setTopUpAmount(e.target.value)}
                min="1"
                step="1"
              />
            </div>

            <div className="grid grid-cols-3 gap-2">
              {[500, 1000, 2000].map((amount) => (
                <Button
                  key={amount}
                  variant="outline"
                  onClick={() => setTopUpAmount(amount.toString())}
                >
                  ₹{amount}
                </Button>
              ))}
            </div>

            <div className="flex gap-3 pt-2">
              <Button
                variant="outline"
                onClick={() => {
                  setIsTopUpModalOpen(false);
                  setTopUpAmount('');
                }}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                onClick={handleTopUp}
                disabled={isProcessing || !topUpAmount}
                className="flex-1"
              >
                {isProcessing ? 'Processing...' : 'Confirm Top Up'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Fastag;
