import config from '~/config';
import { HeaderOnly } from '~/layouts/HeaderOnly';
import Home from '~/pages/Home';
import Profile from '~/pages/Profile';
import Support from '~/pages/Support/SupportPage';
import SupportLayout from '~/layouts/SupportLayout/SupportLayout';

const publicRoutes = [
    { path: config.routes.home, component: Home, layout: HeaderOnly },
    { path: config.routes.profile, component: Profile, layout: HeaderOnly },
    { path: config.routes.support, component: Support, layout: SupportLayout },
];

const privateRoutes = [];

export { publicRoutes, privateRoutes };
