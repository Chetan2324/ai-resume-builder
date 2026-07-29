import { render, screen } from '@testing-library/react';

jest.mock('axios', () => ({
  get: jest.fn(),
  post: jest.fn(),
  put: jest.fn(),
}));

jest.mock('html2canvas', () => jest.fn());

jest.mock('jspdf', () =>
  jest.fn().mockImplementation(() => ({
    internal: { pageSize: { getWidth: () => 210 } },
    addImage: jest.fn(),
    save: jest.fn(),
  }))
);

import App from './App';

test('renders app heading', () => {
  render(<App />);
  expect(screen.getByText(/smart resume builder/i)).toBeInTheDocument();
});
