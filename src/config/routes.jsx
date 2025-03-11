const routes = {
    home: '/',
    profile: '/profile',
    support: '/support',
    cart: '/cart',
    payment: '/payment',
    skinQuiz: '/skin-quiz',
    skinQuizResult: '/skin-quiz/results/:skinType',
    passwordChangePage: '/profile/password-change',
    ordersPage: '/profile/orders',
    googleAuthCallback: '/auth/google/callback',
    itemDetail: '/product/:id',
    brand: '/brand/:id',  // Add this line for the brand page route
};

export default routes;