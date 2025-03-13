import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './Components/Login';

import DashboardUser from './Components/DashboardUser';
import SprintDetails from './Components/SprintDetails';
import DashboardAdmin from './Components/DashboardAdmin';
import SprintsAdmin from './Components/SprintsAdmin';

import { UserProvider } from './Contexts/UserContext';
import { SprintProvider } from './Contexts/SprintContext';
import { TaskProvider } from './Contexts/TaskContext';

const App = () => {
    return (
        <Router>
            <TaskProvider>
                <UserProvider>
                    <SprintProvider>
                        <Routes>
                            <Route path="/" element={<Login />} />
                            <Route path="/dashboard-user" element={<DashboardUser />} />
                            <Route path="/sprintDetails" element={<SprintDetails />} />
                            <Route path="/dashboard-admin" element={<DashboardAdmin />} />
                            <Route path="/sprintsAdmin" element={<SprintsAdmin />} />
                        </Routes>
                    </SprintProvider>
                </UserProvider>
            </TaskProvider>
            
        </Router>
    );
};

export default App;