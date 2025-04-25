import React, { createContext, useState } from 'react';

export const TaskContext = createContext();

export const TaskProvider = ({ children }) => {
    const [taskId, setTaskId] = useState(null);

    return (
        <TaskContext.Provider value={{ taskId, setTaskId }}>
            {children}
        </TaskContext.Provider>
    );
};