import { Link } from 'react-router-dom';
import { Heart } from 'lucide-react';
import { Button } from '@/components/ui';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center gap-4 text-center px-4">
      <div className="flex items-center gap-2 text-primary mb-4">
        <Heart className="w-8 h-8 fill-primary text-primary" />
        <span className="text-2xl font-bold">MediCare+</span>
      </div>
      <h1 className="text-8xl font-extrabold text-primary">404</h1>
      <h2 className="text-2xl font-semibold text-gray-800 dark:text-white">Page Not Found</h2>
      <p className="text-gray-500 dark:text-gray-400 max-w-sm">
        The page you're looking for doesn't exist or has been moved. Let's get you back on track.
      </p>
      <Link to="/" className="mt-4">
        <Button variant="primary" size="lg">Back to Home</Button>
      </Link>
    </div>
  );
}
