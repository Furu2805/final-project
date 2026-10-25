import { render, screen } from '@testing-library/react';
import App from './App';

jest.mock('axios', () => ({
  __esModule: true,
  default: {
    get: jest.fn().mockResolvedValue({ data: [] }),
    post: jest.fn().mockResolvedValue({ data: {} }),
    put: jest.fn().mockResolvedValue({ data: {} }),
    delete: jest.fn().mockResolvedValue({ data: {} }),
    isCancel: jest.fn(() => false),
  },
}));

beforeEach(() => {
  window.sessionStorage.clear();
});

test('shows the login screen when nobody is logged in', () => {
  render(<App />);

  expect(screen.getByText(/please login/i)).toBeInTheDocument();
  expect(screen.getByLabelText(/username/i)).toBeInTheDocument();
});
