import './index.css'
import { createBrowserRouter } from "react-router";
import { RouterProvider } from "react-router/dom";
import ReactDOM from "react-dom/client";

import SignInPage from './pages/SignIn/SignInPage.tsx'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthContextProvider } from './providers/AuthProvider.tsx';
import Home from './pages/Home/Home.tsx';
import Clients from './pages/Clients/Clients.tsx';
import { Client } from './pages/Clients/Client.tsx';
import AppLayout from './components/layout/AppLayout.tsx';
import CreateClient from './pages/Clients/CreateClient.tsx';
import UpdateClient from './pages/Clients/UpdateClient.tsx';
import CreateActivity from './pages/Clients/CreateActivity.tsx';
import UpdateActivity from './pages/Clients/UpdateActivity.tsx';
import Raports from './pages/Raports/Raports.tsx';
import ProtectedRoute from './components/layout/ProtectedRoute.tsx';

const queryClient = new QueryClient()

const router = createBrowserRouter([
  {
    path: "/",
    Component: SignInPage,
  },
  {
    Component: ProtectedRoute,
    children: [
      {
        Component: AppLayout,
        children: [
          {
            path: '/home',
            Component: Home
          },
          {
            path: '/clients',
            children: [
              {
                index: true,
                Component: Clients
              },
              {
                path: 'client/:id',
                Component: Client
              },
              {
                path: 'create',
                Component: CreateClient
              },
              {
                path: 'update/:id',
                Component: UpdateClient
              },
              {
                path: 'client/:id/activity/create',
                Component: CreateActivity
              },
              {
                path: 'client/:idClient/activity/:idActivity/update',
                Component: UpdateActivity
              }
            ]
          },
          {
            path: '/raports',
            Component: Raports
          }
        ]
      }
    ]
  }

]);

const root = document.getElementById("root")!;

ReactDOM.createRoot(root).render(
  <QueryClientProvider client={queryClient}>
    <AuthContextProvider>
      <RouterProvider router={router} />
    </AuthContextProvider>
  </QueryClientProvider>
);
