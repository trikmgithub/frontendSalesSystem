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
    googleAuthCallback: '/auth/google/callback',  // Add this line for Google Auth Callback
};

export default routes;