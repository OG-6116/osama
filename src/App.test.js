import React from 'react';
import { render, screen } from '@testing-library/react';

jest.mock('react-router-dom', () => ({
  BrowserRouter: ({ children }) => <div data-testid="browser-router">{children}</div>,
  Routes: ({ children }) => <div data-testid="routes">{children}</div>,
  Route: ({ element }) => <div data-testid="route">{element}</div>,
  Navigate: () => <div>Navigate</div>,
  NavLink: ({ children, to }) => <a href={to}>{children}</a>,
}));

import App from './App.js';

test('renders App and navbar navigation', () => {
  render(<App />);
  const brand = screen.getByText('OSAMA');
  expect(brand).toBeInTheDocument();
  const simulatorNav = screen.getByText('Simulator');
  expect(simulatorNav).toBeInTheDocument();
  expect(screen.queryByText('Compare Algorithms')).not.toBeInTheDocument();
  const guideNav = screen.getByText('Theory & Guide');
  expect(guideNav).toBeInTheDocument();
});
