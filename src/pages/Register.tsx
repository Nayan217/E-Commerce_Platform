import { useState, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/hooks/use-toast';

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [terms, setTerms] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { signUp } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const strength = useMemo(() => {
    if (password.length < 4) return { label: '', color: '', width: '0%' };
    if (password.length < 6) return { label: 'Weak', color: 'bg-destructive', width: '33%' };
    if (password.length < 10 || !/[A-Z]/.test(password) || !/[0-9]/.test(password)) return { label: 'Medium', color: 'bg-secondary', width: '66%' };
    return { label: 'Strong', color: 'bg-success', width: '100%' };
  }, [password]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!name || !email || !password || !confirm) { setError('All fields are required'); return; }
    if (password !== confirm) { setError('Passwords do not match'); return; }
    if (password.length < 6) { setError('Password must be at least 6 characters'); return; }
    if (!terms) { setError('Please accept the terms'); return; }

    setLoading(true);
    const { error: err } = await signUp(email, password, name);
    setLoading(false);
    if (err) { setError(err); return; }
    toast({
      title: 'Account created! 🎉',
      description: 'Use code WELCOME30 for 30% off your first order!',
    });
    navigate('/');
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="flex-1 flex items-center justify-center py-12 px-4">
        <div className="w-full max-w-sm">
          <h1 className="text-2xl font-bold text-center mb-2">Create Account</h1>
          <p className="text-muted-foreground text-center text-sm mb-8">Join ShopFlow today</p>

          <form onSubmit={handleSubmit} className="space-y-4">
            {error && <p className="text-sm text-destructive bg-destructive/10 px-3 py-2 rounded-md">{error}</p>}
            <div><Label>Full Name</Label><Input value={name} onChange={e => setName(e.target.value)} required /></div>
            <div><Label>Email</Label><Input type="email" value={email} onChange={e => setEmail(e.target.value)} required /></div>
            <div>
              <Label>Password</Label>
              <Input type="password" value={password} onChange={e => setPassword(e.target.value)} required />
              {password && (
                <div className="mt-2">
                  <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                    <div className={`h-full ${strength.color} rounded-full transition-all`} style={{ width: strength.width }} />
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">{strength.label}</p>
                </div>
              )}
            </div>
            <div><Label>Confirm Password</Label><Input type="password" value={confirm} onChange={e => setConfirm(e.target.value)} required /></div>
            <label className="flex items-start gap-2 text-sm">
              <Checkbox checked={terms} onCheckedChange={v => setTerms(v as boolean)} className="mt-0.5" />
              I agree to the <a href="#" className="text-primary hover:underline">Terms of Service</a> and <a href="#" className="text-primary hover:underline">Privacy Policy</a>
            </label>
            <Button type="submit" className="w-full" disabled={loading}>{loading ? 'Creating...' : 'Create Account'}</Button>
          </form>

          {/* Welcome coupon banner */}
          <div className="mt-6 p-4 rounded-lg bg-success/10 border border-success/20 text-center">
            <p className="text-sm font-medium text-success">🎁 New user? Get 30% off!</p>
            <p className="text-xs text-muted-foreground mt-1">Use code <span className="font-mono font-bold text-foreground">WELCOME30</span> at checkout</p>
          </div>

          <p className="text-center text-sm text-muted-foreground mt-6">
            Already have an account? <Link to="/login" className="text-primary font-medium hover:underline">Login</Link>
          </p>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Register;
