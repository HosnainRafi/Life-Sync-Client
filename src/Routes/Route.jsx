import { createBrowserRouter } from 'react-router-dom';
import Root from '../Layout/Root';
import DonationRequest from '../Pages/DonationRequest/DonationRequest';
import Blog from '../Pages/Blog/Blog';
import Funding from '../Pages/Funding/Funding';
import SignIn from '../Pages/SignIn/SignIn';

const router = createBrowserRouter([
  {
    path: '/',
    element:<Root/>,
    errorElement: <h1>Here will be error page</h1>,
    children: [
      {
        path: '/',
        element: <h1>Homepage</h1>
      },
      {
        path: '/donation-request',
        element:<DonationRequest/>
      },
      {
        path: '/blog',
        element:<Blog/>
      },
      {
        path: '/funding',
        element:<Funding/>
      },
      {
        path: '/signin',
        element:<SignIn/>
      },
    ]
  },
]);

export default router;
