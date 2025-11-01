import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Bill } from '@/types';
import { CreditCard, Smartphone, Building2, Wallet } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { payBill } from '@/utils/api';

interface PaymentModalProps {
  bill: Bill | null;
  isOpen: boolean;
  onClose: () => void;
  onPaymentSuccess: () => void;
}

const paymentMethods = [
  { id: 'upi', name: 'UPI', icon: Smartphone },
  { id: 'credit', name: 'Credit Card', icon: CreditCard },
  { id: 'debit', name: 'Debit Card', icon: CreditCard },
  { id: 'netbanking', name: 'Net Banking', icon: Building2 },
  { id: 'wallet', name: 'Digital Wallet', icon: Wallet },
];

const PaymentModal = ({ bill, isOpen, onClose, onPaymentSuccess }: PaymentModalProps) => {
  const [selectedMethod, setSelectedMethod] = useState('upi');
  const [isProcessing, setIsProcessing] = useState(false);

  const handlePayment = async () => {
    if (!bill) return;

    setIsProcessing(true);
    try {
      await payBill(bill.bill_id, selectedMethod);
      
      toast({
        title: "Payment Successful",
        description: `Your ${bill.bill_type} bill of ₹${bill.amount} has been paid successfully.`,
      });

      onPaymentSuccess();
      onClose();
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Payment Failed",
        description: "There was an error processing your payment. Please try again.",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  if (!bill) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Pay Bill</DialogTitle>
          <DialogDescription>
            Choose your preferred payment method to complete the transaction.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Bill Summary */}
          <div className="p-4 bg-card rounded-lg border">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm text-muted-foreground">Bill Type</span>
              <span className="font-medium capitalize">{bill.bill_type.replace('_', ' ')}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Amount</span>
              <span className="text-xl font-bold">₹{bill.amount.toLocaleString('en-IN')}</span>
            </div>
          </div>

          {/* Payment Methods */}
          <div>
            <Label className="text-base mb-3 block">Select Payment Method</Label>
            <RadioGroup value={selectedMethod} onValueChange={setSelectedMethod}>
              <div className="space-y-2">
                {paymentMethods.map((method) => {
                  const Icon = method.icon;
                  return (
                    <div
                      key={method.id}
                      className={`flex items-center space-x-3 p-3 rounded-lg border cursor-pointer transition-colors ${
                        selectedMethod === method.id
                          ? 'border-primary bg-accent'
                          : 'border-border hover:bg-accent/50'
                      }`}
                      onClick={() => setSelectedMethod(method.id)}
                    >
                      <RadioGroupItem value={method.id} id={method.id} />
                      <Icon className="w-5 h-5 text-muted-foreground" />
                      <Label htmlFor={method.id} className="flex-1 cursor-pointer">
                        {method.name}
                      </Label>
                    </div>
                  );
                })}
              </div>
            </RadioGroup>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-2">
            <Button variant="outline" onClick={onClose} className="flex-1">
              Cancel
            </Button>
            <Button 
              onClick={handlePayment} 
              disabled={isProcessing}
              className="flex-1"
            >
              {isProcessing ? 'Processing...' : `Pay ₹${bill.amount.toLocaleString('en-IN')}`}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PaymentModal;
