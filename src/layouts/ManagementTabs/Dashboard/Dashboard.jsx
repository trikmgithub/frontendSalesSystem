// src/layouts/ManagementTabs/Dashboard/Dashboard.jsx
import React, { useState, useEffect, useCallback, useRef } from 'react';
import classNames from 'classnames/bind';
import styles from './Dashboard.module.scss';
import { Line, Bar, Pie, Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import { FaShoppingCart, FaUsers, FaBox, FaTag, FaChartLine, FaExclamationTriangle, FaSync } from 'react-icons/fa';

// Import your API services
import { 
  getAllCartsAxios, 
  getPendingOrdersAxios, 
  getCompletedOrdersAxios, 
  getCancelledOrdersAxios 
} from '~/services/cartAxios';
import { getUsersAxios } from '~/services/userAxios';
import { getItemsPaginatedAxios } from '~/services/itemAxios';
import { getAllBrandsAxios } from '~/services/brandAxios';
import { getRoleByIdAxios } from '~/services/roleAxios';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const cx = classNames.bind(styles);

// Default polling interval in milliseconds (30 seconds)
const DEFAULT_POLLING_INTERVAL = 30000;

// Storage keys
const POLLING_ENABLED_KEY = 'dashboard_polling_enabled';
const POLLING_INTERVAL_KEY = 'dashboard_polling_interval';
const ADMIN_COUNT_KEY = 'dashboard_admin_count';
const ADMIN_COUNT_TIMESTAMP_KEY = 'dashboard_admin_count_timestamp';

// Array of admin/staff/manager role names
const ADMIN_ROLES = ['ADMIN', 'STAFF', 'MANAGER'];

// Refresh admin count every 24 hours
const ADMIN_COUNT_TTL = 24 * 60 * 60 * 1000; // 24 hours in milliseconds

function Dashboard() {
  // Load settings from localStorage or use defaults
  const getSavedPollingEnabled = () => {
    const saved = localStorage.getItem(POLLING_ENABLED_KEY);
    return saved === null ? true : saved === 'true';
  };
  
  const getSavedPollingInterval = () => {
    const saved = localStorage.getItem(POLLING_INTERVAL_KEY);
    return saved === null ? DEFAULT_POLLING_INTERVAL : parseInt(saved, 10);
  };

  const getSavedAdminCount = () => {
    const saved = localStorage.getItem(ADMIN_COUNT_KEY);
    return saved === null ? 0 : parseInt(saved, 10);
  };

  // State for various data
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(new Date());
  const [pollingEnabled, setPollingEnabled] = useState(getSavedPollingEnabled());
  const [pollingInterval, setPollingInterval] = useState(getSavedPollingInterval());
  const [adminCount, setAdminCount] = useState(getSavedAdminCount());
  
  // Reference to store polling timer
  const pollingTimerRef = useRef(null);
  
  // Summary metrics
  const [metrics, setMetrics] = useState({
    totalSales: 0,
    totalOrders: 0,
    totalCustomers: 0,
    totalProducts: 0,
    averageOrderValue: 0,
  });
  
  // Data for charts
  const [orderStatusData, setOrderStatusData] = useState({
    labels: ['Pending', 'Completed', 'Cancelled'],
    datasets: [
      {
        data: [0, 0, 0],
        backgroundColor: ['#FFD700', '#4CAF50', '#F44336'],
        hoverBackgroundColor: ['#FFC107', '#388E3C', '#D32F2F'],
      },
    ],
  });
  
  const [salesData, setSalesData] = useState({
    labels: [],
    datasets: [
      {
        label: 'Sales',
        data: [],
        fill: true,
        backgroundColor: 'rgba(53, 110, 78, 0.2)',
        borderColor: '#356E4E',
        tension: 0.4,
      },
    ],
  });
  
  const [productInventoryData, setProductInventoryData] = useState({
    labels: [],
    datasets: [
      {
        label: 'Stock Quantity',
        data: [],
        backgroundColor: '#4A90E2',
        hoverBackgroundColor: '#357ABD',
      },
    ],
  });
  
  const [brandDistributionData, setBrandDistributionData] = useState({
    labels: [],
    datasets: [
      {
        data: [],
        backgroundColor: [
          '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF',
          '#FF9F40', '#8AC249', '#EA80FC', '#607D8B', '#F06292'
        ],
        hoverBackgroundColor: [
          '#FF4C76', '#2D93E0', '#FFBD35', '#3AA8A8', '#8855F0',
          '#FF8522', '#78AD36', '#E452FB', '#546E7A', '#EC407A'
        ],
      },
    ],
  });

  // Chart options
  const doughnutOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'bottom',
      },
      title: {
        display: true,
        text: 'Order Status Distribution',
        font: {
          size: 16,
        },
      },
    },
  };
  
  const lineOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Sales Trend (Last 30 Days)',
        font: {
          size: 16,
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'Revenue (VND)',
        },
      },
      x: {
        title: {
          display: true,
          text: 'Date',
        },
      },
    },
  };
  
  const barOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Top 10 Products by Stock',
        font: {
          size: 16,
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'Stock Quantity',
        },
      },
      x: {
        ticks: {
          maxRotation: 45,
          minRotation: 45,
        },
      },
    },
  };
  
  const pieOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'right',
      },
      title: {
        display: true,
        text: 'Products by Brand',
        font: {
          size: 16,
        },
      },
    },
  };

  // Function to calculate admin count - separate from the main dashboard refresh
  const calculateAdminCount = useCallback(async (forceRefresh = false) => {
    try {
      // Check if we need to recalculate
      if (!forceRefresh) {
        const lastCalculated = parseInt(localStorage.getItem(ADMIN_COUNT_TIMESTAMP_KEY) || '0', 10);
        const now = Date.now();
        
        // If calculation is still fresh, use the cached value
        if (now - lastCalculated < ADMIN_COUNT_TTL && adminCount > 0) {
          console.log('Using cached admin count:', adminCount);
          return adminCount;
        }
      }
      
      // Start the calculation process
      console.log('Calculating admin count from API calls...');
      
      // Step 1: Fetch all users
      const usersResponse = await getUsersAxios(1, 100); // Limit to 100 users
      
      if (!usersResponse?.data?.result || !Array.isArray(usersResponse.data.result)) {
        throw new Error('Failed to fetch users');
      }
      
      const users = usersResponse.data.result;
      
      // Step 2: Get unique role IDs to fetch
      const uniqueRoleIds = [...new Set(users.map(user => user.roleId).filter(Boolean))];
      
      // Step 3: Fetch all roles in parallel
      const rolePromises = uniqueRoleIds.map(roleId => getRoleByIdAxios(roleId));
      const roleResponses = await Promise.allSettled(rolePromises);
      
      // Step 4: Create a map of roleId -> roleName
      const roleMap = {};
      
      roleResponses.forEach((result, index) => {
        if (result.status === 'fulfilled' && result.value?.data?.name) {
          roleMap[uniqueRoleIds[index]] = result.value.data.name.toUpperCase();
        }
      });
      
      // Step 5: Count users with admin roles
      const count = users.filter(user => {
        if (!user.roleId || !roleMap[user.roleId]) return false;
        return ADMIN_ROLES.includes(roleMap[user.roleId]);
      }).length;
      
      // Save the count and timestamp
      localStorage.setItem(ADMIN_COUNT_KEY, count.toString());
      localStorage.setItem(ADMIN_COUNT_TIMESTAMP_KEY, Date.now().toString());
      
      // Update state
      setAdminCount(count);
      console.log('New admin count calculated:', count);
      
      return count;
    } catch (error) {
      console.error('Error calculating admin count:', error);
      return adminCount; // Fall back to current value
    }
  }, [adminCount]);

  // Function to fetch dashboard data
  const fetchDashboardData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Get admin count (uses cached value if available)
      const currentAdminCount = adminCount;
      
      // Fetch all required data in parallel
      const [
        allOrdersResponse,
        pendingOrdersResponse,
        completedOrdersResponse,
        cancelledOrdersResponse,
        usersResponse,
        productsResponse,
        brandsResponse
      ] = await Promise.all([
        getAllCartsAxios(),
        getPendingOrdersAxios(),
        getCompletedOrdersAxios(),
        getCancelledOrdersAxios(),
        getUsersAxios(1, 10), // We only need total count, not all users
        getItemsPaginatedAxios(1, 100),
        getAllBrandsAxios()
      ]);
      
      // Process order status data
      const pendingCount = pendingOrdersResponse?.data?.length || 0;
      const completedCount = completedOrdersResponse?.data?.length || 0;
      const cancelledCount = cancelledOrdersResponse?.data?.length || 0;
      
      setOrderStatusData({
        labels: ['Pending', 'Completed', 'Cancelled'],
        datasets: [
          {
            data: [pendingCount, completedCount, cancelledCount],
            backgroundColor: ['#FFD700', '#4CAF50', '#F44336'],
            hoverBackgroundColor: ['#FFC107', '#388E3C', '#D32F2F'],
          },
        ],
      });
      
      // Process sales data
      if (allOrdersResponse?.data && Array.isArray(allOrdersResponse.data)) {
        const orders1 = allOrdersResponse.data;
        
        // Get date 30 days ago
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        
        // Filter orders from the last 30 days
        const recentOrders = orders1.filter(order => 
          new Date(order.purchaseDate) >= thirtyDaysAgo
        );
        
        // Group orders by date and calculate total sales
        const salesByDate = {};
        
        recentOrders.forEach(order => {
          const dateStr = new Date(order.purchaseDate).toISOString().split('T')[0];
          
          if (!salesByDate[dateStr]) {
            salesByDate[dateStr] = 0;
          }
          
          salesByDate[dateStr] += order.totalAmount || 0;
        });
        
        // Create arrays for chart data
        const dateLabels = Object.keys(salesByDate).sort();
        const salesValues = dateLabels.map(date => salesByDate[date]);
        
        setSalesData({
          labels: dateLabels,
          datasets: [
            {
              label: 'Sales (VND)',
              data: salesValues,
              fill: true,
              backgroundColor: 'rgba(53, 110, 78, 0.2)',
              borderColor: '#356E4E',
              tension: 0.4,
            },
          ],
        });
        
        // Calculate metrics
        const orders = allOrdersResponse?.data || [];
        const totalSales = orders.reduce((sum, order) => sum + (order.totalAmount || 0), 0);
        const totalOrders = orders.length;
        const averageOrderValue = totalOrders > 0 ? totalSales / totalOrders : 0;
        
        // Get total users from response metadata
        const totalUsers = usersResponse?.data?.meta?.numberUsers || 0;
        
        // Calculate customers by subtracting admin count
        const customerCount = Math.max(0, totalUsers - currentAdminCount);
        
        const totalProducts = productsResponse?.data?.paginateItem?.meta?.numberItems || 
                              (productsResponse?.data?.paginateItem?.result 
                                ? productsResponse.data.paginateItem.result.length 
                                : 0);
        
        setMetrics({
          totalSales,
          totalOrders,
          totalCustomers: customerCount,
          totalProducts,
          averageOrderValue,
        });
      }
      
      // Process product data
      if (productsResponse?.data?.paginateItem?.result && Array.isArray(productsResponse.data.paginateItem.result)) {
        const products = productsResponse.data.paginateItem.result;
        
        // Sort products by stock quantity (descending)
        const sortedProducts = [...products].sort((a, b) => b.quantity - a.quantity);
        
        // Take the top 10 products
        const topProducts = sortedProducts.slice(0, 10);
        
        setProductInventoryData({
          labels: topProducts.map(product => product.name),
          datasets: [
            {
              label: 'Stock Quantity',
              data: topProducts.map(product => product.quantity),
              backgroundColor: '#4A90E2',
              hoverBackgroundColor: '#357ABD',
            },
          ],
        });
        
        // Process brand distribution data
        if (brandsResponse?.data && Array.isArray(brandsResponse.data)) {
          const brands = brandsResponse.data;
          
          // Count products by brand
          const productCountByBrand = {};
          
          // Initialize with 0 for all brands
          brands.forEach(brand => {
            productCountByBrand[brand.name] = 0;
          });
          
          // Count products
          products.forEach(product => {
            if (product.brand && product.brand.name) {
              productCountByBrand[product.brand.name] = (productCountByBrand[product.brand.name] || 0) + 1;
            }
          });
          
          // Filter out brands with no products
          const filteredBrands = Object.keys(productCountByBrand)
            .filter(brandName => productCountByBrand[brandName] > 0);
          
          // Create chart data
          setBrandDistributionData({
            labels: filteredBrands,
            datasets: [
              {
                data: filteredBrands.map(brandName => productCountByBrand[brandName]),
                backgroundColor: [
                  '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF',
                  '#FF9F40', '#8AC249', '#EA80FC', '#607D8B', '#F06292'
                ].slice(0, filteredBrands.length),
                hoverBackgroundColor: [
                  '#FF4C76', '#2D93E0', '#FFBD35', '#3AA8A8', '#8855F0',
                  '#FF8522', '#78AD36', '#E452FB', '#546E7A', '#EC407A'
                ].slice(0, filteredBrands.length),
              },
            ],
          });
        }
      }
      
      // Update last updated timestamp
      setLastUpdated(new Date());
      
    } catch (err) {
      console.error('Error fetching dashboard data:', err);
      setError('Failed to load dashboard data. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [adminCount]);
  
  // Persist polling enabled setting
  useEffect(() => {
    localStorage.setItem(POLLING_ENABLED_KEY, pollingEnabled.toString());
  }, [pollingEnabled]);
  
  // Persist polling interval setting
  useEffect(() => {
    localStorage.setItem(POLLING_INTERVAL_KEY, pollingInterval.toString());
  }, [pollingInterval]);
  
  // Toggle polling
  const togglePolling = useCallback(() => {
    setPollingEnabled(prev => !prev);
  }, []);
  
  // Change polling interval
  const changePollingInterval = useCallback((newInterval) => {
    // Clear existing timer
    if (pollingTimerRef.current) {
      clearInterval(pollingTimerRef.current);
    }
    
    setPollingInterval(newInterval);
    
    // Start new timer if polling is enabled
    if (pollingEnabled) {
      pollingTimerRef.current = setInterval(fetchDashboardData, newInterval);
    }
  }, [fetchDashboardData, pollingEnabled]);

  // Initialize admin count on component mount
  useEffect(() => {
    // Check if admin count calculation is needed
    const lastCalculated = parseInt(localStorage.getItem(ADMIN_COUNT_TIMESTAMP_KEY) || '0', 10);
    const now = Date.now();
    
    if (now - lastCalculated > ADMIN_COUNT_TTL || adminCount === 0) {
      // Calculate admin count without blocking initial render
      calculateAdminCount();
    }
  }, [calculateAdminCount, adminCount]);

  // Setup polling when component mounts or polling settings change
  useEffect(() => {
    // Clear existing timer
    if (pollingTimerRef.current) {
      clearInterval(pollingTimerRef.current);
      pollingTimerRef.current = null;
    }
    
    // Fetch initial data
    fetchDashboardData();
    
    // Start polling if enabled
    if (pollingEnabled) {
      pollingTimerRef.current = setInterval(fetchDashboardData, pollingInterval);
    }
    
    // Cleanup when component unmounts
    return () => {
      if (pollingTimerRef.current) {
        clearInterval(pollingTimerRef.current);
      }
    };
  }, [fetchDashboardData, pollingEnabled, pollingInterval]);

  // Format currency for display
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN').format(amount) + ' đ';
  };
  
  // Format date for display
  const formatDateTime = (date) => {
    return new Date(date).toLocaleString('vi-VN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };

  return (
    <div className={cx('dashboard')}>
      <div className={cx('dashboard-header')}>
        <h2 className={cx('dashboard-title')}>Dashboard Overview</h2>
        <div className={cx('dashboard-actions')}>
          <div className={cx('polling-controls')}>
            <label className={cx('polling-toggle')}>
              <input 
                type="checkbox" 
                checked={pollingEnabled} 
                onChange={togglePolling} 
              />
              <span>Auto-refresh</span>
            </label>
            
            <select 
              value={pollingInterval} 
              onChange={(e) => changePollingInterval(Number(e.target.value))}
              className={cx('interval-select')}
              disabled={!pollingEnabled}
            >
              <option value="10000">Every 10 seconds</option>
              <option value="30000">Every 30 seconds</option>
              <option value="60000">Every minute</option>
              <option value="300000">Every 5 minutes</option>
            </select>
          </div>
          
          <div className={cx('last-updated')}>
            Last updated: {formatDateTime(lastUpdated)}
          </div>
          
          <button 
            className={cx('refresh-button')} 
            onClick={fetchDashboardData}
            disabled={loading}
          >
            <FaSync className={loading ? cx('rotate') : ''} /> 
            {loading ? 'Refreshing...' : 'Refresh Now'}
          </button>
        </div>
      </div>
      
      {/* Display error state if there was a problem */}
      {error && (
        <div className={cx('error-message')}>
          <FaExclamationTriangle />
          <p>{error}</p>
          <button onClick={fetchDashboardData} className={cx('retry-button')}>
            Refresh Dashboard
          </button>
        </div>
      )}
      
      {/* Display loading state while data is being fetched */}
      {loading && metrics.totalSales === 0 ? (
        <div className={cx('loading-indicator')}>
          <div className={cx('spinner')}></div>
          <p>Loading dashboard data...</p>
        </div>
      ) : (
        <>
          {/* Metrics Summary */}
          <div className={cx('metrics-grid')}>
            <div className={cx('metric-card')}>
              <div className={cx('metric-icon', 'sales-icon')}>
                <FaChartLine />
              </div>
              <div className={cx('metric-details')}>
                <h3 className={cx('metric-title')}>Total Sales</h3>
                <p className={cx('metric-value')}>{formatCurrency(metrics.totalSales)}</p>
              </div>
            </div>
            
            <div className={cx('metric-card')}>
              <div className={cx('metric-icon', 'orders-icon')}>
                <FaShoppingCart />
              </div>
              <div className={cx('metric-details')}>
                <h3 className={cx('metric-title')}>Total Orders</h3>
                <p className={cx('metric-value')}>{metrics.totalOrders}</p>
              </div>
            </div>
            
            <div className={cx('metric-card')}>
              <div className={cx('metric-icon', 'customers-icon')}>
                <FaUsers />
              </div>
              <div className={cx('metric-details')}>
                <h3 className={cx('metric-title')}>Total Customers</h3>
                <p className={cx('metric-value')}>{metrics.totalCustomers}</p>
              </div>
            </div>
            
            <div className={cx('metric-card')}>
              <div className={cx('metric-icon', 'products-icon')}>
                <FaBox />
              </div>
              <div className={cx('metric-details')}>
                <h3 className={cx('metric-title')}>Total Products</h3>
                <p className={cx('metric-value')}>{metrics.totalProducts}</p>
              </div>
            </div>
            
            <div className={cx('metric-card')}>
              <div className={cx('metric-icon', 'aov-icon')}>
                <FaTag />
              </div>
              <div className={cx('metric-details')}>
                <h3 className={cx('metric-title')}>Average Order Value</h3>
                <p className={cx('metric-value')}>{formatCurrency(metrics.averageOrderValue)}</p>
              </div>
            </div>
          </div>
          
          {/* Charts Grid */}
          <div className={cx('charts-grid')}>
            {/* Order Status Distribution */}
            <div className={cx('chart-card', 'small-chart')}>
              <div className={cx('chart-container')}>
                <Doughnut data={orderStatusData} options={doughnutOptions} />
              </div>
              {loading && <div className={cx('chart-loading-overlay')}><div className={cx('spinner-small')}></div></div>}
            </div>
            
            {/* Sales Trend */}
            <div className={cx('chart-card', 'large-chart')}>
              <div className={cx('chart-container')}>
                <Line data={salesData} options={lineOptions} />
              </div>
              {loading && <div className={cx('chart-loading-overlay')}><div className={cx('spinner-small')}></div></div>}
            </div>
            
            {/* Products by Brand */}
            <div className={cx('chart-card', 'small-chart')}>
              <div className={cx('chart-container')}>
                <Pie data={brandDistributionData} options={pieOptions} />
              </div>
              {loading && <div className={cx('chart-loading-overlay')}><div className={cx('spinner-small')}></div></div>}
            </div>
            
            {/* Product Inventory */}
            <div className={cx('chart-card', 'large-chart')}>
              <div className={cx('chart-container')}>
                <Bar data={productInventoryData} options={barOptions} />
              </div>
              {loading && <div className={cx('chart-loading-overlay')}><div className={cx('spinner-small')}></div></div>}
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default Dashboard;