import React from 'react';
import { useParams, useLocation, Link } from 'react-router-dom';
import styles from './QuizResult.module.scss';
import classNames from 'classnames/bind';
import config from '~/config';

const cx = classNames.bind(styles);

const skinTypeData = {
  oily: {
    title: 'Da Dầu',
    description: 'Làn da của bạn có xu hướng tiết nhiều dầu, đặc biệt là ở vùng chữ T (trán, mũi, cằm). Các lỗ chân lông có thể to và dễ bị tắc nghẽn, gây ra mụn đầu đen và mụn trứng cá.',
    recommendations: [
      'Sử dụng sữa rửa mặt dịu nhẹ, có khả năng kiểm soát dầu',
      'Tránh các sản phẩm chứa dầu và chọn các sản phẩm ghi "không gây bít lỗ chân lông" (non-comedogenic)',
      'Sử dụng toner không cồn để cân bằng độ pH',
      'Dùng kem dưỡng ẩm dạng gel hoặc dạng nước nhẹ',
      'Đắp mặt nạ đất sét 1-2 lần/tuần'
    ],
    products: [
      {
        name: 'Sữa Rửa Mặt Làm Sạch Sâu',
        description: 'Giúp loại bỏ bã nhờn và tạp chất mà không làm khô da'
      },
      {
        name: 'Toner Cân Bằng Dầu',
        description: 'Kiểm soát dầu và se khít lỗ chân lông'
      },
      {
        name: 'Serum Kiểm Soát Dầu',
        description: 'Giảm tiết dầu và ngăn ngừa mụn'
      }
    ]
  },
  combination: {
    title: 'Da Hỗn Hợp',
    description: 'Da của bạn có những vùng dầu (thường là vùng chữ T) và những vùng thường hoặc khô (má và viền mặt). Đây là loại da phổ biến nhất.',
    recommendations: [
      'Sử dụng các sản phẩm làm sạch dịu nhẹ cho toàn bộ khuôn mặt',
      'Áp dụng các sản phẩm kiểm soát dầu chỉ ở vùng chữ T',
      'Dưỡng ẩm nhiều hơn ở các vùng khô',
      'Sử dụng các sản phẩm khác nhau cho các vùng da khác nhau',
      'Đắp mặt nạ đất sét ở vùng chữ T và mặt nạ dưỡng ẩm ở vùng má'
    ],
    products: [
      {
        name: 'Sữa Rửa Mặt Cân Bằng',
        description: 'Làm sạch nhẹ nhàng mà không làm mất cân bằng độ ẩm'
      },
      {
        name: 'Toner Không Cồn',
        description: 'Cân bằng và làm dịu da sau khi rửa mặt'
      },
      {
        name: 'Kem Dưỡng Ẩm Da Hỗn Hợp',
        description: 'Cung cấp độ ẩm phù hợp cho cả vùng dầu và vùng khô'
      }
    ]
  },
  normal: {
    title: 'Da Thường',
    description: 'Bạn có làn da cân bằng, không quá dầu cũng không quá khô. Lỗ chân lông nhỏ, và da của bạn có vẻ khỏe mạnh với ít khuyết điểm.',
    recommendations: [
      'Duy trì thói quen chăm sóc da đơn giản và nhất quán',
      'Sử dụng sữa rửa mặt dịu nhẹ hai lần mỗi ngày',
      'Áp dụng kem dưỡng ẩm phù hợp với mùa',
      'Không quên chống nắng mỗi ngày',
      'Sử dụng mặt nạ dưỡng ẩm hoặc làm sáng da 1-2 lần/tuần'
    ],
    products: [
      {
        name: 'Sữa Rửa Mặt Dịu Nhẹ',
        description: 'Làm sạch nhẹ nhàng mà không làm mất cân bằng da'
      },
      {
        name: 'Serum Dưỡng Ẩm',
        description: 'Duy trì độ ẩm và giúp da luôn tươi trẻ'
      },
      {
        name: 'Kem Chống Nắng SPF 50',
        description: 'Bảo vệ da khỏi tác hại của tia UV'
      }
    ]
  },
  dry: {
    title: 'Da Khô',
    description: 'Da của bạn thường cảm thấy căng, thô ráp hoặc bong tróc. Bạn có thể thấy những vết nhăn mịn xuất hiện sớm hơn những người có loại da khác.',
    recommendations: [
      'Sử dụng sữa rửa mặt không có xà phòng, không có chất tẩy rửa mạnh',
      'Tránh tắm nước nóng vì nó có thể làm mất đi dầu tự nhiên của da',
      'Dùng kem dưỡng ẩm giàu dưỡng chất ngay sau khi rửa mặt',
      'Sử dụng serum chứa Hyaluronic Acid để giữ nước',
      'Đắp mặt nạ dưỡng ẩm 2-3 lần/tuần'
    ],
    products: [
      {
        name: 'Sữa Rửa Mặt Dưỡng Ẩm',
        description: 'Làm sạch mà không làm mất đi dầu tự nhiên của da'
      },
      {
        name: 'Serum Hyaluronic Acid',
        description: 'Cung cấp và khóa ẩm sâu'
      },
      {
        name: 'Kem Dưỡng Giàu Dưỡng Chất',
        description: 'Nuôi dưỡng và khôi phục hàng rào bảo vệ da'
      }
    ]
  }
};

const QuizResult = () => {
  const { skinType } = useParams();
  const location = useLocation();
  const { points, answers } = location.state || { points: 0, answers: {} };
  
  const skinData = skinTypeData[skinType] || skinTypeData.normal;

  return (
    <div className={cx('result-container')}>
      <div className={cx('result-header')}>
        <h1>Kết Quả Kiểm Tra Da Của Bạn</h1>
        <div className={cx('score-container')}>
          <span className={cx('score')}>Tổng điểm: {points}</span>
        </div>
      </div>

      <div className={cx('skin-type-section')}>
        <h2>Loại da của bạn: <span className={cx('skin-type')}>{skinData.title}</span></h2>
        <p className={cx('description')}>{skinData.description}</p>
      </div>

      <div className={cx('recommendations-section')}>
        <h3>Khuyến nghị chăm sóc da:</h3>
        <ul className={cx('recommendations-list')}>
          {skinData.recommendations.map((rec, index) => (
            <li key={index}>{rec}</li>
          ))}
        </ul>
      </div>

      <div className={cx('products-section')}>
        <h3>Các sản phẩm phù hợp:</h3>
        <div className={cx('products-list')}>
          {skinData.products.map((product, index) => (
            <div key={index} className={cx('product-card')}>
              <h4>{product.name}</h4>
              <p>{product.description}</p>
            </div>
          ))}
        </div>
      </div>

      <div className={cx('actions')}>
        <Link to={config.routes.skinQuiz} className={cx('retry-button')}>
          Làm lại bài kiểm tra
        </Link>
      </div>
    </div>
  );
};

export default QuizResult;