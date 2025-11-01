import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Feedback as FeedbackType } from '@/types';
import { submitFeedback, fetchFeedback } from '@/utils/api';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Star } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { format, parseISO } from 'date-fns';

const Feedback = () => {
  const { user } = useAuth();
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [comment, setComment] = useState('');
  const [feedbackHistory, setFeedbackHistory] = useState<FeedbackType[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadFeedbackHistory();
  }, [user]);

  const loadFeedbackHistory = async () => {
    if (!user) return;

    setIsLoading(true);
    try {
      const data = await fetchFeedback(user.citizen_id);
      setFeedbackHistory(data);
    } catch (error) {
      console.error('Failed to load feedback history:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user || rating === 0) {
      toast({
        variant: "destructive",
        title: "Invalid Submission",
        description: "Please select a rating before submitting.",
      });
      return;
    }

    setIsSubmitting(true);
    try {
      await submitFeedback(user.citizen_id, rating, comment);
      
      toast({
        title: "Feedback Submitted",
        description: "Thank you for your feedback! We appreciate your input.",
      });

      // Reset form
      setRating(0);
      setComment('');
      
      // Reload feedback history
      loadFeedbackHistory();
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Submission Failed",
        description: "There was an error submitting your feedback. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="text-3xl font-bold mb-2">Feedback</h1>
        <p className="text-muted-foreground">
          Share your experience with CivicPay services
        </p>
      </div>

      {/* Feedback Form */}
      <Card>
        <CardHeader>
          <CardTitle>Submit Feedback</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label>Rating</Label>
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    onMouseEnter={() => setHoveredRating(star)}
                    onMouseLeave={() => setHoveredRating(0)}
                    className="transition-transform hover:scale-110"
                  >
                    <Star
                      className={`w-10 h-10 ${
                        star <= (hoveredRating || rating)
                          ? 'fill-yellow-400 text-yellow-400'
                          : 'text-gray-300'
                      }`}
                    />
                  </button>
                ))}
              </div>
              {rating > 0 && (
                <p className="text-sm text-muted-foreground">
                  You rated {rating} star{rating > 1 ? 's' : ''}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="comment">Your Comments (Optional)</Label>
              <Textarea
                id="comment"
                placeholder="Share your thoughts about our services..."
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                rows={5}
                maxLength={500}
              />
              <p className="text-xs text-muted-foreground text-right">
                {comment.length}/500 characters
              </p>
            </div>

            <Button type="submit" disabled={isSubmitting || rating === 0} className="w-full">
              {isSubmitting ? 'Submitting...' : 'Submit Feedback'}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Feedback History */}
      <div>
        <h2 className="text-2xl font-bold mb-4">Your Previous Feedback</h2>
        {isLoading ? (
          <Card>
            <CardContent className="py-12">
              <p className="text-center text-muted-foreground">Loading feedback history...</p>
            </CardContent>
          </Card>
        ) : feedbackHistory.length === 0 ? (
          <Card>
            <CardContent className="py-12">
              <p className="text-center text-muted-foreground">
                No feedback submitted yet. Be the first to share your experience!
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {feedbackHistory.map((feedback) => (
              <Card key={feedback.feedback_id}>
                <CardContent className="pt-6">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex gap-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          className={`w-5 h-5 ${
                            star <= feedback.rating
                              ? 'fill-yellow-400 text-yellow-400'
                              : 'text-gray-300'
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-sm text-muted-foreground">
                      {format(parseISO(feedback.feedback_date), 'MMM dd, yyyy')}
                    </span>
                  </div>
                  {feedback.comment && (
                    <p className="text-sm text-foreground">{feedback.comment}</p>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Feedback;
