import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Bill, BillType } from '@/types';
import { Droplets, Zap, Home, Flame, LucideIcon } from 'lucide-react';
import { format, isPast, parseISO } from 'date-fns';

interface BillCardProps {
  bill: Bill;
  onPayClick: (bill: Bill) => void;
}

const billConfig: Record<BillType, { icon: LucideIcon; color: string; label: string }> = {
  water: { icon: Droplets, color: 'text-blue-500', label: 'Water Bill' },
  electricity: { icon: Zap, color: 'text-yellow-500', label: 'Electricity Bill' },
  property_tax: { icon: Home, color: 'text-green-500', label: 'Property Tax' },
  gas: { icon: Flame, color: 'text-orange-500', label: 'Gas Bill' },
};

const BillCard = ({ bill, onPayClick }: BillCardProps) => {
  const config = billConfig[bill.bill_type];
  const Icon = config.icon;
  const isOverdue = isPast(parseISO(bill.due_date)) && !bill.payment_date;
  const isPaid = !!bill.payment_date;

  return (
    <Card className="hover:shadow-md transition-shadow cursor-pointer">
      <CardContent className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className={`p-3 rounded-full bg-card ${config.color}`}>
              <Icon className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-semibold text-lg">{config.label}</h3>
              <p className="text-sm text-muted-foreground">
                {bill.units_used} units used
              </p>
            </div>
          </div>
          {isPaid ? (
            <Badge className="bg-success">Paid</Badge>
          ) : isOverdue ? (
            <Badge variant="destructive">Overdue</Badge>
          ) : (
            <Badge variant="secondary">Pending</Badge>
          )}
        </div>

        <div className="space-y-3">
          <div className="flex justify-between items-baseline">
            <span className="text-2xl font-bold">₹{bill.amount.toLocaleString('en-IN')}</span>
            <span className="text-sm text-muted-foreground">
              Due: {format(parseISO(bill.due_date), 'MMM dd, yyyy')}
            </span>
          </div>

          {!isPaid && (
            <Button 
              className="w-full" 
              variant={isOverdue ? "destructive" : "default"}
              onClick={() => onPayClick(bill)}
            >
              Pay Now
            </Button>
          )}

          {isPaid && (
            <p className="text-sm text-success text-center">
              Paid on {format(parseISO(bill.payment_date!), 'MMM dd, yyyy')}
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default BillCard;
