import { render } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';

jest.mock('./components/section1', () => ({
  Section1: () => null,
}));

const App = require('./App').default;

test('renders app without crashing', () => {
  render(
    <MemoryRouter>
      <App />
    </MemoryRouter>
  );
});
