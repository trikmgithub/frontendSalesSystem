import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './SkinQuiz.module.scss';
import classNames from 'classnames/bind';
import config from '~/config';
import { useAuth } from '~/context/AuthContext';
import { getQuestionsAxios, submitQuizAxios } from '~/services/quizAxios';
import { updateUserSkinTypeAxios } from '~/services/userAxios';

const cx = classNames.bind(styles);

const SkinQuiz = () => {
  const navigate = useNavigate();
  const { isLoggedIn, user } = useAuth();
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  // Skin type mapping
  const skinTypesMap = {
    'da_dau': 'Da Dầu',
    'da_hon_hop': 'Da Hỗn Hợp',
    'da_thuong': 'Da Thường',
    'da_kho': 'Da Khô'
  };

  // English route keys mapping
  const routeKeysMap = {
    'da_dau': 'oily',
    'da_hon_hop': 'combination',
    'da_thuong': 'normal',
    'da_kho': 'dry'
  };

  // Lấy danh sách câu hỏi từ API khi component được mount
  useEffect(() => {
    const fetchQuestions = async () => {
      setLoading(true);
      try {
        const response = await getQuestionsAxios();

        if (response.error) {
          setError(response.message || 'Không thể tải câu hỏi.');
        } else if (response.data && Array.isArray(response.data)) {
          // Sắp xếp câu hỏi theo ID nếu có
          const sortedQuestions = [...response.data].sort((a, b) => {
            // Nếu có trường order thì sắp xếp theo order
            if (a.order !== undefined && b.order !== undefined) {
              return a.order - b.order;
            }
            // Nếu không có order, sắp xếp theo questionId
            return a.questionId.localeCompare(b.questionId);
          });

          // Khởi tạo đối tượng answers rỗng với các questionId
          const initialAnswers = {};
          sortedQuestions.forEach(question => {
            // Mỗi câu trả lời ban đầu là null, đảm bảo luôn có giá trị xác định
            initialAnswers[question.questionId] = {
              value: null,
              index: -1 // -1 có nghĩa là chưa chọn
            };
          });

          setQuestions(sortedQuestions);
          setAnswers(initialAnswers); // Khởi tạo state answers ngay từ đầu
          console.log('Loaded questions:', sortedQuestions);
        } else {
          setError('Định dạng dữ liệu không hợp lệ.');
        }
      } catch (err) {
        console.error('Error fetching questions:', err);
        setError('Đã xảy ra lỗi khi tải câu hỏi.');
      } finally {
        setLoading(false);
      }
    };

    fetchQuestions();
  }, []);

  // Xử lý khi người dùng chọn một tùy chọn
  const handleSelectOption = (questionId, option, optionIndex) => {
    setAnswers(prevAnswers => ({
      ...prevAnswers,
      [questionId]: {
        value: option.skinType || option.value,
        index: optionIndex
      }
    }));

    console.log(`Selected ${option.skinType || option.value} (index: ${optionIndex}) for question ${questionId}`);
  };

  // Kiểm tra xem đã trả lời đủ câu hỏi chưa
  const getUnansweredQuestions = () => {
    return questions.filter(q => {
      // Một câu hỏi chưa được trả lời nếu không có giá trị hoặc index là -1
      return !answers[q.questionId] ||
        answers[q.questionId].value === null ||
        answers[q.questionId].index === -1;
    });
  };

  // Tính toán kết quả và gửi dữ liệu lên server
  const calculateResult = async () => {
    if (submitting) return; // Tránh gửi nhiều lần

    // Kiểm tra đã trả lời tất cả câu hỏi chưa
    const unansweredQuestions = getUnansweredQuestions();

    if (unansweredQuestions.length > 0) {
      const missingQuestionIds = unansweredQuestions.map(q => q.questionId).join(', ');
      alert(`Vui lòng trả lời tất cả các câu hỏi trước khi gửi kết quả. Câu hỏi còn thiếu: ${missingQuestionIds}`);
      return;
    }

    // Kiểm tra đăng nhập
    if (!isLoggedIn()) {
      alert('Bạn cần đăng nhập để gửi kết quả.');
      return;
    }

    setSubmitting(true);

    try {
      // Chuyển đổi định dạng câu trả lời để phù hợp với API
      const apiAnswers = {};
      Object.keys(answers).forEach(questionId => {
        if (answers[questionId].value !== null) {
          // Convert to a numerical index + 1 (since the API expects 1-based indices)
          apiAnswers[questionId] = answers[questionId].index + 1;
        }
      });

      // Lấy userId từ context hoặc localStorage
      const userId = getUserId();
      if (!userId) {
        alert('Không thể xác định ID người dùng. Vui lòng đăng nhập lại.');
        setSubmitting(false);
        return;
      }

      console.log('Submitting quiz with userId:', userId);
      console.log('Answers:', apiAnswers);

      // Gửi dữ liệu lên server với userId đúng định dạng
      const response = await submitQuizAxios({
        userId,
        answers: apiAnswers
      });

      if (response.error) {
        console.error('Failed to submit quiz:', response.message);
        alert(`Đã xảy ra lỗi khi gửi kết quả: ${response.message || 'Vui lòng thử lại sau.'}`);
        setSubmitting(false);
        return;
      }

      // Nếu gửi thành công và có kết quả trả về
      if (response.data && response.data.quizResult) {
        const resultData = response.data;
        const resultSkinType = resultData.quizResult.determinedSkinType;
        console.log('Server determined skin type:', resultSkinType);

        // Cập nhật loại da cho người dùng
        try {
          const updateResponse = await updateUserSkinTypeAxios(resultSkinType);
          if (updateResponse.error) {
            console.error('Failed to update user skin type:', updateResponse.message);
          } else {
            console.log('Successfully updated user skin type:', resultSkinType);
          }
        } catch (error) {
          console.error('Error updating user skin type:', error);
        }

        // Chuyển hướng đến trang kết quả
        const routeKey = routeKeysMap[resultSkinType] || 'normal'; // Fallback to normal
        const resultPath = config.routes.skinQuizResult.replace(':skinType', routeKey);

        navigate(resultPath, {
          state: {
            points: resultData.quizResult.scorePercentage,
            skinType: resultSkinType, // Pass the actual skin type code
            skinTypeInfo: resultData.skinTypeInfo, // Pass the detailed skin type info
            fromQuiz: true, // Flag to indicate this came from quiz
            answers: apiAnswers // Pass the answers for potential display in results
          }
        });
      } else {
        // Nếu không có kết quả rõ ràng từ server
        alert('Không thể xác định loại da từ kết quả. Vui lòng thử lại sau.');
      }
    } catch (error) {
      console.error('Error during quiz submission:', error);
      alert('Đã xảy ra lỗi khi gửi kết quả. Vui lòng thử lại sau.');
    } finally {
      setSubmitting(false);
    }
  };

  const getUserId = () => {
    // 1. Thử lấy từ context
    if (user && user._id) {
      return user._id;
    }

    // 2. Thử lấy từ localStorage
    try {
      const userData = JSON.parse(localStorage.getItem('user') || '{}');
      if (userData && userData._id) {
        return userData._id;
      }
    } catch (e) {
      console.error('Error parsing user data from localStorage:', e);
    }

    // If no userId found, show an error
    alert('Không thể xác định ID người dùng. Vui lòng đăng nhập lại.');
    return null; // Return null instead of empty string to prevent API calls with invalid ID
  };

  // Debug helper
  const debugAnswers = () => {
    const answeredCount = Object.keys(answers).filter(key =>
      answers[key] && answers[key].value !== null && answers[key].index !== -1
    ).length;
    const unansweredQuestions = getUnansweredQuestions();
    const userId = getUserId();

    console.log('Current state:');
    console.log('- User ID:', userId);
    console.log('- Questions:', questions);
    console.log('- Current answers:', answers);
    console.log('- Unanswered questions:', unansweredQuestions);

    // Hiển thị thông tin debug chi tiết
    const debugInfo = Object.entries(answers)
      .filter(([_, answerData]) => answerData.value !== null && answerData.index !== -1)
      .map(([qId, answerData]) => {
        const question = questions.find(q => q.questionId === qId);
        return `${qId}: Option #${answerData.index} (${answerData.value}) - ${question?.options[answerData.index]?.text || 'Unknown'}`;
      }).join('\n');

    alert(`User ID: ${userId || 'Không tìm thấy'}\nĐã trả lời: ${answeredCount}/${questions.length}\n\nChi tiết:\n${debugInfo || 'Chưa có câu trả lời'}\n\nCòn thiếu: ${unansweredQuestions.map(q => q.questionId).join(', ') || 'Không có'}`);
  };

  // Kiểm tra xem một tùy chọn có được chọn không, dựa trên index
  const isOptionSelected = (questionId, optionIndex) => {
    return answers[questionId] && answers[questionId].index === optionIndex;
  };

  // Hiển thị màn hình loading
  if (loading) {
    return (
      <div className={cx('loading-container')}>
        <div className={cx('loading')}>Đang tải câu hỏi...</div>
      </div>
    );
  }

  // Hiển thị màn hình lỗi
  if (error) {
    return (
      <div className={cx('error-container')}>
        <div className={cx('error')}>
          <h2>Đã xảy ra lỗi</h2>
          <p>{error}</p>
          <button
            className={cx('retry-button')}
            onClick={() => window.location.reload()}
          >
            Thử lại
          </button>
        </div>
      </div>
    );
  }

  // Kiểm tra xem đã trả lời tất cả câu hỏi chưa để kích hoạt nút Submit
  const allQuestionsAnswered = questions.length > 0 && getUnansweredQuestions().length === 0;

  return (
    <div className={cx('quiz-container')}>
      {/* Header phần giới thiệu */}
      <div className={cx('quiz-header')}>
        <h1>BÀI KIỂM TRA LOẠI DA & CÁCH CHĂM SÓC</h1>
        <p>
          Mỗi người chúng ta đều có một cơ địa và làn da khác nhau. Để có cách chăm sóc da đúng đắn,
          điều quan trọng là bạn cần phải thấu hiểu làn da. Beauty Skin hân hạnh mang đến bài trắc nghiệm nhỏ để
          bạn có thể tự kiểm tra loại da và tình trạng da của mình.
        </p>
        <p>
          Hãy trả lời {questions.length} câu hỏi trong bài trắc nghiệm dưới đây để hiểu hơn về làn da của mình,
          từ đó biết được cách thức chăm da nào sẽ phù hợp với bạn.
        </p>
        {!isLoggedIn() && (
          <div className={cx('login-warning')}>
            <p>⚠️ Bạn cần đăng nhập để lưu kết quả bài kiểm tra. <a href={config.routes.login}>Đăng nhập ngay</a></p>
          </div>
        )}
      </div>

      {/* Danh sách câu hỏi */}
      <div className={cx('quiz-questions')}>
        {questions.map((question, index) => (
          <div key={question._id || question.questionId} className={cx('question-container')}>
            <h3 className={cx('question-title')}>
              Q{index + 1}: {question.questionText}
            </h3>
            {question.description && (
              <p className={cx('question-description')}>{question.description}</p>
            )}
            <div className={cx('options-container')}>
              {question.options.map((option, optIndex) => {
                // Xác định giá trị cho option
                const optionValue = option.skinType || option.value || `option-${optIndex}`;

                return (
                  <div
                    key={`${question.questionId}-option-${optIndex}`}
                    className={cx('option-row')}
                  >
                    <label className={cx('option-label')}>
                      <input
                        type="radio"
                        name={`question-${question.questionId}`}
                        value={optionValue}
                        checked={isOptionSelected(question.questionId, optIndex)}
                        onChange={() => handleSelectOption(question.questionId, option, optIndex)}
                        className={cx('option-input')}
                      />
                      <div className={cx('radio-custom')}></div>
                      <span className={cx('option-text')}>{option.text}</span>
                    </label>
                    {option.points !== undefined && (
                      <span className={cx('option-points')}>{option.points} point</span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Nút gửi kết quả */}
      <div className={cx('submit-container')}>
        <button
          type="button"
          className={cx('submit-button', { disabled: !allQuestionsAnswered || !isLoggedIn() })}
          disabled={submitting || !allQuestionsAnswered || !isLoggedIn()}
          onClick={calculateResult}
        >
          {submitting ? 'ĐANG GỬI...' : 'GỬI KẾT QUẢ'}
        </button>
      </div>
    </div>
  );
};

export default SkinQuiz;