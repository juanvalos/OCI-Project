/** Reporte Mostrar KPI Horas trabajadas  y Tareas completadas 
 * por PERSONA por semana/sprint */


import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { SprintContext } from '../Contexts/SprintContext';
import SprintProductivity from '../Components/SprintProductivity';
 
beforeEach(() => {
global.fetch = jest.fn();
});

afterEach(() => {
jest.clearAllMocks();
});

describe('SprintProductivity', () => {
    test('carga y muestra la lista de sprints', async () => {
        fetch.mockResolvedValueOnce({
        json: async () => [{ id: 1, name: 'Sprint 1' }, { id: 2, name: 'Sprint 2' }]
        });

        render(
        <SprintContext.Provider value={{ sprintId: null, setSprintId: jest.fn() }}>
            <SprintProductivity />
        </SprintContext.Provider>
        );

        expect(fetch).toHaveBeenCalledWith('/sprints');
        await waitFor(() => {
        expect(screen.getByText('Sprint 1')).toBeInTheDocument();
        expect(screen.getByText('Sprint 2')).toBeInTheDocument();
        });
    });

    test('seleccionar un sprint carga la productividad', async () => {
        fetch
        .mockResolvedValueOnce({
            json: async () => [{ id: 1, name: 'Sprint 1' }],
        })
        .mockResolvedValueOnce({
            json: async () => ({'Karime Munoz':90.5 }),
        });

        render(
        <SprintContext.Provider value={{ sprintId: null, setSprintId: jest.fn() }}>
            <SprintProductivity />
        </SprintContext.Provider>
        );

        const select = await screen.findByRole('combobox');
        fireEvent.click(select);
        fireEvent.change(select, { target: { value: '1' } });

        await waitFor(() => {
        expect(fetch).toHaveBeenNthCalledWith(2, '/sprint//productivity');
        expect(screen.getByText('Karime Munoz')).toBeInTheDocument();
        expect(screen.getByText('90.50%')).toBeInTheDocument();
        });
    });

    test('muestra mensaje si no hay datos', async () => {
        fetch
        .mockResolvedValueOnce({
            json: async () => [{ id: 1, name: 'Sprint 1' }],
        })
        .mockResolvedValueOnce({
            json: async () => null,
        });

        render(
        <SprintContext.Provider value={{ sprintId: null, setSprintId: jest.fn() }}>
            <SprintProductivity />
        </SprintContext.Provider>
        );

        const select = await screen.findByRole('combobox');
        fireEvent.change(select, { target: { value: '1' } });

        await waitFor(() => {
        expect(screen.getByText('No hay datos disponibles para este sprint.')).toBeInTheDocument();
        });
    });
});
 