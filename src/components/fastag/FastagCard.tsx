import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Fastag } from '@/types';
import { Car } from 'lucide-react';

interface FastagCardProps {
  fastag: Fastag;
  onTopUpClick: (fastag: Fastag) => void;
}

const FastagCard = ({ fastag, onTopUpClick }: FastagCardProps) => {
  const isLowBalance = fastag.balance < 500;

  return (
    <Card className={isLowBalance ? 'border-warning' : ''}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Car className="w-5 h-5" />
          {fastag.vehicle_number}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <p className="text-sm text-muted-foreground mb-1">Current Balance</p>
          <p className={`text-3xl font-bold ${isLowBalance ? 'text-warning' : 'text-foreground'}`}>
            ₹{fastag.balance.toLocaleString('en-IN')}
          </p>
          {isLowBalance && (
            <p className="text-sm text-warning mt-1">Low balance! Please recharge soon.</p>
          )}
        </div>
        <Button 
          className="w-full" 
          onClick={() => onTopUpClick(fastag)}
        >
          Top Up Balance
        </Button>
      </CardContent>
    </Card>
  );
};

export default FastagCard;
