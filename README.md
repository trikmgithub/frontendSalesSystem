# Beauty Skin - E-commerce Platform

A comprehensive e-commerce platform for skincare and beauty products with multiple user roles, quiz functionality for skincare recommendations, and full e-commerce capabilities.

## 🌟 Features

### Customer Features

-   **Product Browsing & Searching**: View, search, and filter products by categories, brands, and more
-   **Personal Skin Quiz**: Take skin type quizzes to get personalized product recommendations
-   **User Accounts**: Register, login, manage personal information, and view order history
-   **Shopping Functionality**: Add products to cart, favorites, and compare products
-   **Checkout Process**: Multiple payment methods including MoMo and bank transfer
-   **Product Comparison**: Compare different products side by side

### Admin & Staff Features

-   **Dashboard**: Overview of site activity and core metrics
-   **User Management**: Create, update, and manage user accounts and roles
-   **Product Management**: Add, edit, and delete products in the catalog
-   **Brand Management**: Maintain brand information and catalog organization
-   **Order Management**: Process orders and update status
-   **Quiz Management**: Create and manage skin type quizzes and product recommendations

## 🔧 Technology Stack

-   **Frontend**: React.js with Vite for build optimization
-   **State Management**: Context API (Auth, Cart, Favorites, Compare)
-   **Styling**: CSS Modules with classnames
-   **API Communication**: Axios with custom service modules
-   **Routing**: React Router with route protection
-   **Deployments**: Vercel configuration for production

## 📁 Project Structure

```
src/
├── assets/              # Static assets and images
├── components/          # Reusable UI components
│   ├── AddressSelector/
│   ├── Auth/
│   ├── Compare/
│   ├── FilterBar/
│   └── ...
├── config/              # Application configuration
├── context/             # React context providers
│   ├── AuthContext.jsx
│   ├── CartContext.jsx
│   ├── CompareContext.jsx
│   └── FavoritesContext.jsx
├── hooks/               # Custom React hooks
├── layouts/             # Page layout components
│   ├── HeaderOnly/
│   ├── QuizLayout/
│   └── SupportLayout/
├── pages/               # Application pages
│   ├── Admin/
│   ├── Auth/
│   ├── Brand/
│   ├── Cart/
│   └── ...
├── routes/              # Route definitions
├── services/            # API service modules
│   ├── authAxios.js
│   ├── brandAxios.js
│   ├── cartAxios.js
│   └── ...
└── utils/               # Utility functions
```

## 🚀 Key Components

### Frontend Modules

-   **Navigation & Header**: Category navigation with brand menus and search functionality
-   **Product Display**: Flexible product cards with quick-view options
-   **Shopping Cart**: Full cart management with quantity controls
-   **Comparison Tool**: Side-by-side product comparison
-   **Skin Quiz System**: Interactive quiz with personalized product recommendations
-   **User Authentication**: Login, registration, and profile management
-   **Address Selection**: Multi-level location selection for shipping

### Management Interfaces

-   **Admin Dashboard**: Analytics and overview of system activity
-   **Product Management**: CRUD operations for products catalog
-   **Order Management**: Processing workflow with status updates
-   **Brand Management**: Brand category organization
-   **User Management**: User account administration

## 🔒 Authentication & Authorization

-   **User Roles**: Role-based access (user, staff, admin)
-   **Protected Routes**: Routes secured by user role and authentication status
-   **JWT Authentication**: Token-based authentication with refresh capabilities
-   **Social Login**: Google authentication integration
-   **Profile Management**: User profile editing and settings

## 📱 Responsive Design

The application is fully responsive across desktop, tablet, and mobile devices using CSS modules with media queries.

## 🛠️ Getting Started

### Prerequisites

-   Node.js (v16+)
-   npm or yarn

### Installation

1. Clone the repository

```bash
git clone [repository-url]
cd frontendSalesSystem
```

2. Install dependencies

```bash
npm install
# or
yarn install
```

3. Create a `.env` file in the root directory

```
VITE_API_URL=http://localhost:8080/api
VITE_GOOGLE_CLIENT_ID=your-google-client-id

```

4. Start the development server

```bash
npm run dev
# or
yarn dev
```

The application will be available at http://localhost:5173

### Production Build

```bash
npm run build
# or
yarn build
```

The production-ready files will be available in the `dist` directory.

## 🔄 API Integration

The application communicates with a backend API for data operations. Key API services include:

-   Authentication (login, register, user profile management)
-   Product catalog (browsing, filtering, searching)
-   Shopping cart operations
-   Order processing
-   Favorites management
-   Product comparison
-   Quiz functionality for skincare recommendations

## 💼 Business Features

-   **Multi-user Roles**: Different access levels for customers, staff, and administrators
-   **E-commerce Functionality**: Complete shopping experience from browsing to checkout
-   **Personalization**: Skincare quiz for product recommendations based on skin type
-   **User Engagement**: Favorites system to save preferred products

## 🧪 Testing

Run the test suite with:

```bash
npm run test
# or
yarn test
```

## 📝 Documentation

For additional documentation:

-   User Guide
-   Admin Guide
-   API Documentation
-   Development Guide

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 👥 Team

-   Project Manager: [trikmgithub]
-   Frontend Developers: [Hans2374, sonntse184319, trikmgithub]
-   Backend Developers: [trikmgithub]
-   UI/UX Designers: [trikmgithub]

## 📝 Backend

-   Azure: https://mybeautyskinapp.azurewebsites.net/api
-   Local: https://github.com/trikmgithub/backendSalesSystem

## 🙏 Acknowledgments

-   React.js community
-   Vite build tool
-   All open source libraries used in this project
-   Beauty Skin stakeholders for project requirements and feedback
