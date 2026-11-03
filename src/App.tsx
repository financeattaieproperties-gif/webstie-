import React from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import HomePage from './pages/HomePage';
import PropertiesPage from './pages/PropertiesPage';
import PropertyDetailPage from './pages/PropertyDetailPage';
import ProjectDetailPage from './pages/ProjectDetailPage';
import ProjectsPage from './pages/ProjectsPage';
import ContactPage from './pages/ContactPage';
import AboutPage from './pages/AboutPage';
import NotFoundPage from './pages/NotFoundPage';
import AgentsPage from './pages/AgentsPage';
import AgentDetailPage from './pages/AgentDetailPage';

const router = createBrowserRouter([
  { path: '/', element: <HomePage /> },
  { path: '/properties', element: <PropertiesPage /> },
  { path: '/properties/:id', element: <PropertyDetailPage /> },
  { path: '/projects', element: <ProjectsPage /> },
  { path: '/projects/:id', element: <ProjectDetailPage /> },
  { path: '/contact', element: <ContactPage /> },
  { path: '/about', element: <AboutPage /> },
  { path: '/agents', element: <AgentsPage /> },
  { path: '/agents/:id', element: <AgentDetailPage /> },
  { path: '*', element: <NotFoundPage /> },
]);

export default function App() {
  return (
    <HelmetProvider>
      <RouterProvider router={router} />
    </HelmetProvider>
  );
}
