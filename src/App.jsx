import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { publicRoutes } from '~/routes/routes';
import { Fragment } from 'react';
import { ToastContainer } from 'react-toastify';
import { DefaultLayout } from './layouts/DefaultLayout';
import AuthGuard from './components/AuthGuard';
import routes from '~/config/routes';

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
                        
                        // Set proper route guards based on path
                        const isAdminRoute = route.path === routes.admin;
                        const isStaffRoute = route.path === routes.staff;
                        
                        return (
                            <Route
                                key={index}
                                path={route.path}
                                element={
                                    <AuthGuard 
                                        requireAdmin={isAdminRoute}
                                        requireStaff={isStaffRoute}
                                    >
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