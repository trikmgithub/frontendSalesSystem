import config from '~/config';
import { HeaderOnly } from '~/layouts/HeaderOnly';
import Home from '~/pages/Home';
import Profile from '~/pages/Profile';
import Support from '~/pages/Support/SupportPage';
import SupportLayout from '~/layouts/SupportLayout/SupportLayout';
import Cart from '~/pages/Cart/Cart';
import Payment from '~/pages/Payment/Payment';
import AdminPage from '~/pages/Admin/Admin';

const publicRoutes = [
    { path: config.routes.home, component: Home, layout: HeaderOnly },
    { path: config.routes.profile, component: Profile, layout: HeaderOnly },
    { path: config.routes.support, component: Support, layout: SupportLayout },
    { path: config.routes.cart, component: Cart, layout: HeaderOnly },
    { path: config.routes.payment, component: Payment, layout: Payment },
    { path: config.routes.admin, component: AdminPage, layout: AdminPage },
];

const privateRoutes = [];

export { publicRoutes, privateRoutes };
