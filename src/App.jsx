import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { publicRoutes } from '~/routes/routes';
import { Fragment } from 'react';
import { ToastContainer } from 'react-toastify';
import { HeaderOnly } from './layouts/HeaderOnly';
import AuthGuard from './components/Auth/AuthGuard';
import AuthModals from './components/Auth/AuthModals';
import ProtectedRoute from './components/Auth/ProtectedRoute';
import routes from '~/config/routes';

function App() {
    return (
        <BrowserRouter>
            <div className="App">
                <Routes>
                    {publicRoutes.map((route, index) => {
                        const Page = route.component;
                        // Use HeaderOnly as the default layout instead of DefaultLayout
                        let Layout = HeaderOnly;
                        if (route.layout) {
                            Layout = route.layout;
                        } else if (route.layout === null) {
                            Layout = Fragment;
                        }
                        
                        // Determine if route requires authentication
                        const isAuthRequired = [routes.cart, routes.payment, routes.profile, routes.favorites, routes.ordersPage].includes(route.path);
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
                                            {isAuthRequired ? (
                                                <ProtectedRoute>
                                                    <Page />
                                                </ProtectedRoute>
                                            ) : (
                                                <Page />
                                            )}
                                        </Layout>
                                    </AuthGuard>
                                }
                            />
                        );
                    })}
                </Routes>
                <AuthModals />
                <ToastContainer autoClose={1500} />
            </div>
        </BrowserRouter>
    );
}

export default App;