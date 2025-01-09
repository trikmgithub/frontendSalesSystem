import { BrowserRouter, Routes, Route, Link } from 'react-router';
import { publicRoutes } from '~/routes/routes';
import { Fragment } from 'react';
import { ToastContainer } from 'react-toastify';
import { DefaultLayout } from './layouts/DefaultLayout';
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
                        return (
                            <Route
                                key={index}
                                path={route.path}
                                element={
                                    <Layout>
                                        <Page />
                                    </Layout>
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
