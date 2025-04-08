// src/pages/Profile/QuizHistoryPage.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import classNames from 'classnames/bind';
import styles from './QuizHistoryPage.module.scss';
import Sidebar from './components/Sidebar/Sidebar';
import { BsArrowRight } from 'react-icons/bs';
import Toast from './components/common/Toast/Toast';
import config from '~/config';
import { getQuizHistoryAxios, getSkinTypesAxios } from '~/services/quizAxios';

const cx = classNames.bind(styles);

const QuizHistoryPage = () => {
  const navigate = useNavigate();
  const [selectedTab, setSelectedTab] = useState('quizHistory');
  const [history, setHistory] = useState([]);
  const [skinTypes, setSkinTypes] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [toast, setToast] = useState({ show: false, message: '', type: '' });
  const [userData, setUserData] = useState({
    fullName: '',
    email: '',
    avatar: null,
    userId: ''
  });
  
  // Load user data from localStorage
  useEffect(() => {
    try {
      const user = JSON.parse(localStorage.getItem('user'));
      if (user) {
        setUserData({
          fullName: user.name || '',
          email: user.email || '',
          avatar: user.avatar || null,
          userId: user._id || ''
        });
      }
    } catch (error) {
      console.error('Lỗi khi tải dữ liệu người dùng:', error);
    }
  }, []);
  
  // Fetch skin types data
  useEffect(() => {
    const fetchSkinTypes = async () => {
      try {
        const response = await getSkinTypesAxios();
        
        if (response.error) {
          console.error('Lỗi khi tải loại da:', response.message);
          return;
        }
        
        // Convert array to object for easier lookup
        const skinTypesObj = {};
        response.data.forEach(type => {
          skinTypesObj[type.skinType] = type.vietnameseSkinType || type.skinType;
        });
        
        setSkinTypes(skinTypesObj);
      } catch (error) {
        console.error('Lỗi khi tải loại da:', error);
      }
    };
    
    fetchSkinTypes();
  }, []);
  
  // Fetch quiz history data
  useEffect(() => {
    const fetchQuizHistory = async () => {
      setIsLoading(true);
      try {
        if (!userData.userId) {
          // If userId is not available yet, wait for it
          return;
        }
        
        const response = await getQuizHistoryAxios(userData.userId);
        
        if (response.error) {
          throw new Error(response.message || 'Không thể tải lịch sử kiểm tra da');
        }
        
        // Set the history data from the API response
        setHistory(response.data || []);
      } catch (error) {
        console.error('Lỗi khi tải lịch sử kiểm tra da:', error);
        showToast('Không thể tải lịch sử kiểm tra da', 'error');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchQuizHistory();
  }, [userData.userId]);
  
  // Show toast notification
  const showToast = (message, type) => {
    setToast({ show: true, message, type });
  };
  
  // Close toast notification
  const closeToast = () => {
    setToast({ show: false, message: '', type: '' });
  };
  
  // Format date string
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };
  
  // Get skin type name based on code
  const getSkinTypeName = (skinTypeCode) => {
    // First try to get the name from the fetched skin types
    if (skinTypes[skinTypeCode]) {
      return skinTypes[skinTypeCode];
    }
    
    // Fallback mapping if API data isn't available
    const fallbackSkinTypes = {
      'dry': 'Da khô',
      'oily': 'Da dầu',
      'combination': 'Da hỗn hợp',
      'normal': 'Da thường',
      'sensitive': 'Da nhạy cảm'
    };
    
    return fallbackSkinTypes[skinTypeCode] || 'Không xác định';
  };
  
  // Handle view result click
  const handleResultClick = (entry) => {
    // Use the skin type code directly in the URL
    const resultPath = config.routes.skinQuizResult.replace(':skinType', entry.determinedSkinType);
    
    navigate(resultPath, {
      state: {
        points: entry.scorePercentage,
        skinType: entry.determinedSkinType,
        fromHistory: true,
        answers: entry.answers
      }
    });
  };
  
  // Log the structure of the history data for debugging
  useEffect(() => {
    if (history && history.length > 0) {
      console.log('History data structure:', history[0]);
    }
  }, [history]);
  
  return (
    <div className={cx('pageContainer')}>
      {/* Toast Notification */}
      {toast.show && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={closeToast}
        />
      )}
      
      {/* Sidebar */}
      <Sidebar 
        selectedTab={selectedTab} 
        userInfo={userData} 
      />
      
      {/* Main Content */}
      <div className={cx('mainContent')}>
        <div className={cx('card')}>
          <div className={cx('cardHeader')}>
            <h2>Lịch Sử Kiểm Tra Da</h2>
          </div>
          
          <div className={cx('cardBody')}>
            {isLoading ? (
              <div className={cx('loadingContainer')}>
                <p>Đang tải...</p>
              </div>
            ) : history.length === 0 ? (
              <p className={cx('emptyState')}>Chưa có lịch sử kiểm tra da.</p>
            ) : (
              <div className={cx('historyList')}>
                {history.map((entry, index) => (
                  <div key={entry._id || index} className={cx('historyItem')}>
                    <div className={cx('historyContent')}>
                      <div className={cx('historyHeader')}>
                        <h3>Kết quả #{history.length - index}</h3>
                        <span className={cx('historyDate')}>
                          {formatDate(entry.createdAt)}
                        </span>
                      </div>
                      <div className={cx('historyDetails')}>
                        <p>
                          <strong>Loại da xác định:</strong>{' '}
                          <span className={cx('skinType')}>
                            {getSkinTypeName(entry.determinedSkinType)}
                          </span>
                        </p>
                        <p>
                          <strong>Điểm số:</strong>{' '}
                          <span className={cx('score')}>
                            {Math.round(entry.scorePercentage)} %
                          </span>
                        </p>
                      </div>
                    </div>
                    <button
                      className={cx('viewResultButton')}
                      onClick={() => handleResultClick(entry)}
                    >
                      Xem chi tiết
                      <BsArrowRight />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuizHistoryPage;