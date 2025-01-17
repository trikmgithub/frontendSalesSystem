import config from '~/config';
import { HeaderOnly } from '~/layouts/HeaderOnly';
import Home from '~/pages/Home';
import Profile from '~/pages/Profile';

const publicRoutes = [
    { path: config.routes.home, component: Home, layout: HeaderOnly },
    { path: config.routes.profile, component: Profile, layout: HeaderOnly },
];

const privateRoutes = [];

export { publicRoutes, privateRoutes };
