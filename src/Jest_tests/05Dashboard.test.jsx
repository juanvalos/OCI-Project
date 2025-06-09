/* Dashboard personalizado, según el rol del trabajador. 
Que si muestre la información requerida si el usuario llega
al dashboard o da click en algún botón del dashboard. */


import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import DashboardUser from '../Components/DashboardUser'; 
import DashboardAdmin from '../Components/DashboardAdmin';
import { UserContext } from '../Contexts/UserContext';
import { SprintContext } from '../Contexts/SprintContext';
import { BrowserRouter } from 'react-router-dom';

// Mock fetch global
global.fetch = jest.fn(() =>
  Promise.resolve({
    json: () => Promise.resolve({}),
  })
);

const renderWithContexts = (userId, Component) => {
    render(
      <BrowserRouter>
        <UserContext.Provider value={{ userId, setUserId: jest.fn() }}>
          <SprintContext.Provider value={{ sprintId: 0, setSprintId: jest.fn() }}>
            <Component />
          </SprintContext.Provider>
        </UserContext.Provider>
      </BrowserRouter>
    );
  };
  

beforeEach(() => {
  fetch.mockClear();
});

describe('Dashboard según el rol', () => {
  it('muestra el Dashboard de Usuario', async () => {
    fetch
      .mockImplementationOnce(() =>
        Promise.resolve({
          json: () => Promise.resolve({
            name: 'Juan Avalos',
            mail: 'juan@example.com',
            role: 'User',
            modality: 'Remoto',
          }),
        })
      )
      .mockImplementationOnce(() =>
        Promise.resolve({ json: () => Promise.resolve([]) })
      );

    renderWithContexts(1, DashboardUser);

    await waitFor(() => {
      expect(screen.getByText('📌 Oracle User Dashboard')).toBeInTheDocument();
      expect(screen.getByText('Perfil')).toBeInTheDocument();
    });
  });

  it('muestra el Dashboard de Manager', async () => {
    fetch
      .mockImplementationOnce(() =>
        Promise.resolve({
          json: () => Promise.resolve({
            name: 'Roxana Aranda',
            mail: 'rox@example.com',
            role: 'Manager',
            modality: 'Presencial',
          }),
        })
      )
      .mockImplementationOnce(() =>
        Promise.resolve({ json: () => Promise.resolve([]) })
      );

    renderWithContexts(2, DashboardAdmin); 

    await waitFor(() => {
      expect(screen.getByText('📌 Oracle Manager Dashboard')).toBeInTheDocument();
      expect(screen.getByText('Perfil')).toBeInTheDocument();
    });
  });
});


