import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './SkinQuiz.module.scss';
import classNames from 'classnames/bind';
import config from '~/config';

const cx = classNames.bind(styles);

const SkinQuiz = () => {
  const navigate = useNavigate();
  const [currentAnswers, setCurrentAnswers] = useState({});

  const questions = [
    {
      id: 'q1',
      question: 'Da của bạn thường trông ra sao vào buổi chiều?',
      description: 'Hãy có nhớ lại làn da của bạn có cảm giác ra sao sau thời gian nghỉ trưa. Bạn có phải dặm lại phấn phủ ít nhất một lần trong ngày để làm giảm tối thiểu sự bóng nhờn? Bạn có cần sử dụng kem dưỡng ẩm trên những vùng da khô? Hay bạn có cần dùng tới cây che khuyết điểm hay gel trị mụn để làm giảm những tì vết trên da?',
      options: [
        { value: 'q1_1', label: 'Trán, mũi và cằm bị bóng dầu nhưng phần còn lại trên mặt lại bình thường hoặc khô', points: 1 },
        { value: 'q1_2', label: 'Da của tôi không bị bóng, khá khô và có cảm giác căng ở một số khu vực.', points: 5 },
        { value: 'q1_3', label: 'Toàn bộ khuôn mặt tôi bị bóng, có cảm giác nhờn dầu và dễ bị mụn đầu đen và mụn trứng cá', points: 2 },
        { value: 'q1_4', label: 'Da của tôi mềm mại và thấy dễ chịu khi chạm vào', points: 3 },
        { value: 'q1_5', label: 'Da của tôi bị khô và tôi có thể nhận thấy một số nếp nhăn', points: 4 }
      ]
    },
    {
      id: 'q2',
      question: 'Vùng trán của bạn trông như thế nào?',
      description: 'Hãy nhìn vào gương và chỉ nhận xét riêng về khu vực này trên khuôn mặt.',
      options: [
        { value: 'q2_1', label: 'Da khá phẳng mịn, với một vài nếp nhăn nhẹ.', points: 4 },
        { value: 'q2_2', label: 'Tôi nhận thấy một vài vết bong tróc dọc theo đường chân tóc, lông mày và giữa hai bên lông mày.', points: 2 },
        { value: 'q2_3', label: 'Da bóng nhờn và không được mịn. Có những nốt mụn nhỏ và một số mụn đầu đen.', points: 1 },
        { value: 'q2_4', label: 'Da mịn và láng mượt. Không có dấu hiệu bong tróc.', points: 3 },
        { value: 'q2_5', label: 'Điều đầu tiên tôi nhận thấy là các nếp nhăn', points: 5 }
      ]
    },
    {
      id: 'q3',
      question: 'Hãy mô tả phần má và vùng dưới mắt của bạn.',
      description: 'Hãy nhìn vào gương và chỉ nhận xét riêng về khu vực này trên khuôn mặt.',
      options: [
        { value: 'q3_1', label: 'Hầu như không có vết nhăn dễ thấy nào. Chỉ có một số vùng da khô có thể nhìn ra.', points: 2 },
        { value: 'q3_2', label: 'Da bị kích ứng và khô. Có cảm giác da bị căng.', points: 5 },
        { value: 'q3_3', label: 'Lỗ chân lông nở rộng và có khuyết điểm dưới dạng mụn đầu đen hay đốm mụn trắng.', points: 1 },
        { value: 'q3_4', label: 'Da nhẵn mịn với lỗ chân lông se khít', points: 3 },
        { value: 'q3_5', label: 'Có các nếp nhăn rõ rệt. Da khá khô.', points: 4 }
      ]
    },
    {
      id: 'q4',
      question: 'Da của bạn có dễ gặp phải các vấn đề về thẩm, hay đỏ rát không?',
      description: '',
      options: [
        { value: 'q4_1', label: 'Có, nhưng chỉ ở vùng chữ T (trán, mũi và cằm)', points: 2 },
        { value: 'q4_2', label: 'Da tôi hơi đỏ, có chút tấy, và có chỗ không đồng đều về độ ẩm.', points: 5 },
        { value: 'q4_3', label: 'Có. Tôi thường gặp phải các vấn đề trên.', points: 1 },
        { value: 'q4_4', label: 'Đôi khi.', points: 4 },
        { value: 'q4_5', label: 'Hầu như không bao giờ.', points: 3 }
      ]
    },
    {
      id: 'q5',
      question: 'Hiện giờ điều gì là quan trọng nhất với bạn khi lựa chọn một sản phẩm chăm sóc da?',
      description: '',
      options: [
        { value: 'q5_1', label: 'Giúp làm sạch sâu và kiểm soát dầu nhờn', points: 2 },
        { value: 'q5_2', label: 'Cung cấp độ ẩm sâu và làm dịu da', points: 5 },
        { value: 'q5_3', label: 'Điều trị mụn và ngăn ngừa mụn mới', points: 1 },
        { value: 'q5_4', label: 'Duy trì độ ẩm cân bằng và bảo vệ da', points: 3 },
        { value: 'q5_5', label: 'Chống lão hóa và làm mờ nếp nhăn', points: 4 }
      ]
    },
    {
      id: 'q6',
      question: 'Da của bạn có dễ hình thành các vết hằn và nếp nhăn?',
      description: '',
      options: [
        { value: 'q6_1', label: 'Tôi bị một vài vết hằn do da khô.', points: 4 },
        { value: 'q6_2', label: 'Có. Tôi bị các nếp nhăn quanh vùng mắt và/hoặc ở khóe miệng.', points: 2 },
        { value: 'q6_3', label: 'Không, tôi hầu như không có nếp nhăn.', points: 1 },
        { value: 'q6_4', label: 'Không hằn, da của tôi lão hóa tương đối chậm', points: 3 }
      ]
    },
    {
      id: 'q7',
      question: 'Da mặt bạn đã thay đổi ra sao trong 5 năm trở lại đây?',
      description: '',
      options: [
        { value: 'q7_1', label: 'Da tôi bị bóng dầu nhiều hơn ở vùng chữ T (trán, mũi và cằm).', points: 2 },
        { value: 'q7_2', label: 'Da tôi dễ bong tróc hơn và thường cảm thấy căng.', points: 5 },
        { value: 'q7_3', label: 'Da có nhiều khuyết điểm hơn so với trước đây.', points: 1 },
        { value: 'q7_4', label: 'Da tôi vẫn ở tình trạng tốt và dễ dàng chăm sóc.', points: 3 },
        { value: 'q7_5', label: 'Da tôi có vẻ mỏng đi và kém đàn hồi hơn, và thêm các nếp nhăn và vết hằn.', points: 4 }
      ]
    },
    {
      id: 'q8',
      question: 'Giới tính của bạn là',
      description: '',
      options: [
        { value: 'q8_1', label: 'Nam', points: 3 },
        { value: 'q8_2', label: 'Nữ', points: 3 }
      ]
    },
    {
      id: 'q9',
      question: 'Độ tuổi của bạn là',
      description: '',
      options: [
        { value: 'q9_1', label: 'Dưới 25', points: 1 },
        { value: 'q9_2', label: 'Từ 25 tới 40', points: 3 },
        { value: 'q9_3', label: 'Từ 40 tới 50', points: 4 },
        { value: 'q9_4', label: 'Trên 50', points: 5 }
      ]
    }
  ];

  const handleOptionSelect = (questionId, option) => {
    setCurrentAnswers({
      ...currentAnswers,
      [questionId]: option.value
    });
  };

  const calculateResult = () => {
    let points = 0;
    
    // Calculate points from all answers
    Object.keys(currentAnswers).forEach(questionId => {
      const question = questions.find(q => q.id === questionId);
      const selectedOption = question.options.find(opt => opt.value === currentAnswers[questionId]);
      if (selectedOption) {
        points += selectedOption.points;
      }
    });
    
    // Determine skin type based on total points
    let skinType = '';
    if (points <= 18) {
      skinType = 'oily';
    } else if (points <= 27) {
      skinType = 'combination';
    } else if (points <= 36) {
      skinType = 'normal';
    } else {
      skinType = 'dry';
    }
    
    // Navigate to results page with state data
    const resultPath = config.routes.skinQuizResult.replace(':skinType', skinType);
    navigate(resultPath, { state: { points, answers: currentAnswers } });
  };

  const allQuestionsAnswered = questions.length === Object.keys(currentAnswers).length;

  return (
    <div className={cx('quiz-container')}>
      <div className={cx('quiz-header')}>
        <h1>BÀI KIỂM TRA LOẠI DA & CÁCH CHĂM SÓC</h1>
        <p>
          Mỗi người chúng ta đều có một cơ địa và làn da khác nhau. Để có cách chăm sóc da đúng đắn, 
          điều quan trọng là bạn cần phải thấu hiểu làn da. Grace Skincare Clinic hân hạnh mang đến bài trắc nghiệm nhỏ để 
          bạn có thể tự kiểm tra loại da và tình trạng da của mình.
        </p>
        <p>
          Hãy trả lời 9 câu hỏi trong bài trắc nghiệm dưới đây để hiểu hơn về làn da của mình, 
          từ đó biết được cách thức chăm da nào sẽ phù hợp với bạn.
        </p>
        <p className={cx('author')}>
          Tác giả: <a href="https://www.graceskinclinic.com/skin_guru/bac-si-hun-kim-thao-bac-si-da-lieu-gioi-tai-tp-hcm" target="_blank" rel="noopener noreferrer">Bác sĩ Da liễu Hun Kim Thảo</a>
        </p>
      </div>

      <div className={cx('quiz-questions')}>
        {questions.map((question, index) => (
          <div key={question.id} className={cx('question-container')}>
            <h3 className={cx('question-title')}>
              Q{index + 1}: {question.question}
            </h3>
            {question.description && (
              <p className={cx('question-description')}>{question.description}</p>
            )}
            <div className={cx('options-container')}>
              {question.options.map((option) => (
                <div key={option.value} className={cx('option-row')}>
                  <label className={cx('option-label')}>
                    <input
                      type="radio"
                      name={question.id}
                      value={option.value}
                      checked={currentAnswers[question.id] === option.value}
                      onChange={() => handleOptionSelect(question.id, option)}
                      className={cx('option-input')}
                    />
                    <div className={cx('radio-custom')}></div>
                    <span className={cx('option-text')}>{option.label}</span>
                  </label>
                  <span className={cx('option-points')}>{option.points} point</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className={cx('submit-container')}>
        <button
          className={cx('submit-button', { disabled: !allQuestionsAnswered })}
          disabled={!allQuestionsAnswered}
          onClick={calculateResult}
        >
          SUBMIT AND SEE YOUR RESULT
        </button>
      </div>
    </div>
  );
};

export default SkinQuiz;