import React, { createContext, useState } from 'react';

export const SprintContext = createContext();

export const SprintProvider = ({ children }) => {
    const [sprintId, setSprintId] = useState(null);

    return (
        <SprintContext.Provider value={{ sprintId, setSprintId }}>
            {children}
        </SprintContext.Provider>
    );
};