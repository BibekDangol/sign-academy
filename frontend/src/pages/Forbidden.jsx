import PageLayout from '../components/layout/PageLayout';
import { Link } from 'react-router-dom';

export default function Forbidden() {
  return <><PageLayout><main className="mx-auto max-w-xl px-6 py-20 text-center text-base">
    <h1>Access denied</h1>
    <p className="my-6">Your account does not have permission to open this page.</p>
    <Link to="/dashboard" className="text-brand">Return to your dashboard</Link>
  </main></PageLayout></>;
}
