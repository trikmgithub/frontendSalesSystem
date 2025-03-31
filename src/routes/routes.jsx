import config from '~/config';
import { HeaderOnly } from '~/layouts/HeaderOnly';
import Home from '~/pages/Home/Home';
import Profile from '~/pages/Profile/ProfilePage';
import Support from '~/pages/Support/SupportPage';
import SupportLayout from '~/layouts/SupportLayout/SupportLayout';
import Cart from '~/pages/Cart/Cart';
import Payment from '~/pages/Payment/Payment';
import SkinQuizPage from '~/pages/Quiz/SkinQuizPage';
import QuizResultPage from '~/pages/QuizResult/QuizResultPage';
import PasswordChangePage from '~/pages/Profile/PasswordChangePage';
import OrdersPage from '~/pages/Profile/OrdersPage';
import ItemDetail from '~/pages/ItemDetail/ItemDetail';
import BrandPage from '~/pages/Brand/BrandPage'; 
import StaffPage from '~/pages/Staff/Staff';
import Favorites from '~/pages/Profile/Favorites';
import AdminDashboard from '~/pages/Admin/AdminDashboard';
import SearchResults from '~/pages/SearchResults/SearchResults';
import BrandMenu from '~/pages/BrandMenu/BrandMenu';
import ComparePage from '~/pages/Compare/ComparePage';
import GoogleLoginError from '~/pages/Auth/GoogleLoginError';

const publicRoutes = [
    { path: config.routes.home, component: Home, layout: HeaderOnly },
    { path: config.routes.profile, component: Profile, layout: HeaderOnly },
    { path: config.routes.support, component: Support, layout: SupportLayout },
    { path: config.routes.cart, component: Cart, layout: HeaderOnly },
    { path: config.routes.payment, component: Payment, layout: Payment },
    { path: config.routes.skinQuiz, component: SkinQuizPage, layout: HeaderOnly },
    { path: config.routes.skinQuizResult, component: QuizResultPage, layout: HeaderOnly },
    { path: config.routes.passwordChangePage, component: PasswordChangePage, layout: HeaderOnly },
    { path: config.routes.ordersPage, component: OrdersPage, layout: HeaderOnly },
    { path: config.routes.favorites, component: Favorites, layout: HeaderOnly },
    { path: config.routes.itemDetail, component: ItemDetail, layout: HeaderOnly },
    { path: config.routes.brand, component: BrandPage, layout: HeaderOnly }, 
    { path: config.routes.brandMenu, component: BrandMenu, layout: HeaderOnly }, 
    { path: config.routes.staff, component: StaffPage, layout: null },
    { path: config.routes.admin, component: AdminDashboard, layout: null },
    { path: config.routes.search, component: SearchResults, layout: HeaderOnly },
    { path: config.routes.compare, component: ComparePage, layout: HeaderOnly },
    { path: config.routes.googleLoginError, component: GoogleLoginError, layout: HeaderOnly },
];

const privateRoutes = [];

export { publicRoutes, privateRoutes };