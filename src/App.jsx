import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { publicRoutes } from '~/routes/routes';
import { Fragment, useEffect } from 'react';
import { ToastContainer } from 'react-toastify';
import { DefaultLayout } from './layouts/DefaultLayout';
import AuthGuard from './components/AuthGuard';

function App() {
    return (
        <BrowserRouter>
            <div className="App">
                <Routes>
                    {publicRoutes.map((route, index) => {
                        const Page = route.component;
                        let Layout = DefaultLayout;
                        if (route.layout) {
                            Layout = route.layout;
                        } else if (route.layout === null) {
                            Layout = Fragment;
                        }
                        
                        // Check if this route requires staff role
                        const requireStaff = route.path === '/staff';
                        
                        return (
                            <Route
                                key={index}
                                path={route.path}
                                element={
                                    <AuthGuard requireStaff={requireStaff}>
                                        <Layout>
                                            <Page />
                                        </Layout>
                                    </AuthGuard>
                                }
                            />
                        );
                    })}
                </Routes>
                <ToastContainer autoClose={1500} />
            </div>
        </BrowserRouter>
    );
}

export default App;