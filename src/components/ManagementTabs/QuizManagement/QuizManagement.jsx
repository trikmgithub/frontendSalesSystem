// src/components/ManagementTabs/QuizManagement/QuizManagement.jsx
import React, { useState, useEffect } from 'react';
import classNames from 'classnames/bind';
import styles from './QuizManagement.module.scss';
import { FaQuestion, FaSpa, FaPlus } from 'react-icons/fa';
import QuestionsTab from './QuestionsTab';
import SkinTypesTab from './SkinTypesTab';
import { getSkinTypesAxios } from '~/services/quizAxios';

const cx = classNames.bind(styles);

const QUIZ_ACTIVE_TAB_KEY = 'quiz_active_tab';

function QuizManagement() {
  const [activeTab, setActiveTab] = useState(() => {
    const savedTab = localStorage.getItem(QUIZ_ACTIVE_TAB_KEY);
    return savedTab || 'questions';
  });

  // Save active tab to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem(QUIZ_ACTIVE_TAB_KEY, activeTab);
  }, [activeTab]);

  // State for skin types (needed for questions tab)
  const [skinTypes, setSkinTypes] = useState([]);
  const [loadingSkinTypes, setLoadingSkinTypes] = useState(true);

  // Fetch skin types when component mounts (needed for both tabs)
  useEffect(() => {
    fetchSkinTypes();
  }, []);

  // Fetch all skin types
  const fetchSkinTypes = async () => {
    try {
      setLoadingSkinTypes(true);

      const response = await getSkinTypesAxios();

      if (response.error) {
        console.error('Error fetching skin types:', response.message);
      } else if (response.data) {
        setSkinTypes(Array.isArray(response.data) ? response.data : []);
      } else {
        setSkinTypes([]);
      }
    } catch (err) {
      console.error('Error fetching skin types:', err);
    } finally {
      setLoadingSkinTypes(false);
    }
  };

  // Function to switch between tabs
  const switchTab = (tab) => {
    setActiveTab(tab);
  };

  return (
    <div className={cx('quiz-management')}>
      <div className={cx('header')}>
        <h2 className={cx('title')}>Skin Quiz Management</h2>
        <div className={cx('tab-buttons')}>
          <button
            className={cx('tab-button', { active: activeTab === 'questions' })}
            onClick={() => switchTab('questions')}
          >
            <FaQuestion /> Questions
          </button>
          <button
            className={cx('tab-button', { active: activeTab === 'skinTypes' })}
            onClick={() => switchTab('skinTypes')}
          >
            <FaSpa /> Skin Types
          </button>
        </div>
        {activeTab === 'questions' && (
          <button
            className={cx('create-button')}
            onClick={() => document.querySelector('#create-question-btn')?.click()}
          >
            <FaPlus /> Add New Question
          </button>
        )}
        {activeTab === 'skinTypes' && (
          <button
            className={cx('create-button')}
            onClick={() => document.querySelector('#create-skin-type-btn')?.click()}
          >
            <FaPlus /> Add New Skin Type
          </button>
        )}
      </div>

      {/* QUESTIONS TAB */}
      {activeTab === 'questions' && (
        <QuestionsTab skinTypes={skinTypes} />
      )}

      {/* SKIN TYPES TAB */}
      {activeTab === 'skinTypes' && (
        <SkinTypesTab />
      )}
    </div>
  );
}

export default QuizManagement;