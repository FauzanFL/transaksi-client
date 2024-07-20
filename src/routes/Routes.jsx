import { createBrowserRouter } from 'react-router-dom';
import NotFound from '../pages/NotFound';
import Home from '../pages/Home';
import Dashboard from '../pages/Dashboard';
import Transaction from '../pages/Transaction';
import CreateTransaction from '../pages/CreateTransaction';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Home />,
  },
  {
    path: '/dashboard',
    element: <Dashboard />,
  },
  {
    path: '/transactions',
    element: <Transaction />,
  },
  {
    path: '/transactions/add',
    element: <CreateTransaction />,
  },
  {
    path: '*',
    element: <NotFound />,
  },
]);

export default router;
