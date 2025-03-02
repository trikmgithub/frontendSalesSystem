import config from '~/config';
import { HeaderOnly } from '~/layouts/HeaderOnly';
import Home from '~/pages/Home';
import Profile from '~/pages/Profile';
import Support from '~/pages/Support/SupportPage';
import SupportLayout from '~/layouts/SupportLayout/SupportLayout';
import Cart from '~/pages/Cart/Cart';
import Payment from '~/pages/Payment/Payment';
import SkinQuizPage from '~/pages/Quiz/SkinQuizPage';
import QuizResultPage from '~/pages/QuizResult/QuizResultPage';

const publicRoutes = [
    { path: config.routes.home, component: Home, layout: HeaderOnly },
    { path: config.routes.profile, component: Profile, layout: HeaderOnly },
    { path: config.routes.support, component: Support, layout: SupportLayout },
    { path: config.routes.cart, component: Cart, layout: HeaderOnly },
    { path: config.routes.payment, component: Payment, layout: Payment },
    { path: config.routes.skinQuiz, component: SkinQuizPage, layout: HeaderOnly },
    { path: config.routes.skinQuizResult, component: QuizResultPage, layout: HeaderOnly },
];

const privateRoutes = [];

export { publicRoutes, privateRoutes };