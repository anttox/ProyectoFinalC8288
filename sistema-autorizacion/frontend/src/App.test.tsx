import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import App from './App';

test('renders dashboard title', () => {
    render(
        <MemoryRouter initialEntries={['/dashboard']}>
            <App />
        </MemoryRouter>
    );
    const titleElement = screen.getByText(/Panel de Control/i);
    expect(titleElement).toBeInTheDocument();
});
