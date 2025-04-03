// LandingPage.jsx
import { useEffect } from 'react';
import classNames from 'classnames/bind';
import styles from './LandingPage.module.scss';
import ProductCard from '~/components/ProductCard/ProductCard';

const cx = classNames.bind(styles);

function LandingPage({ onShowProducts }) {
  // Animation effect for elements to fade in on scroll
  useEffect(() => {
    const observerOptions = {
      root: null,
      rootMargin: '0px',
      threshold: 0.1
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add(cx('visible'));
        }
      });
    }, observerOptions);

    const animatedElements = document.querySelectorAll(`.${cx('animate-on-scroll')}`);
    animatedElements.forEach(el => observer.observe(el));

    return () => {
      animatedElements.forEach(el => observer.unobserve(el));
    };
  }, []);

  return (
    <div className={cx('landing-page')}>
      {/* Hero Section */}
      <div className={cx('hero-section')}>
        <div className={cx('hero-overlay')}></div>
        <div className={cx('hero-content')}>
          <h1 className={cx('hero-title', 'animate-on-scroll')}>
            CHẤT LƯỢNG THẬT - GIÁ TRỊ THẬT
          </h1>
          
          <p className={cx('hero-description', 'animate-on-scroll')}>
            Trải nghiệm làn da khỏe mạnh và rạng rỡ với các sản phẩm chăm sóc da chất lượng cao từ các thương hiệu hàng đầu
          </p>
          
          <div className={cx('hero-buttons', 'animate-on-scroll')}>
            <button className={cx('primary-button')} onClick={onShowProducts}>
              Mua sắm ngay
              <span className={cx('icon-right')}>→</span>
            </button>
          </div>
        </div>
      </div>

      {/* About Us Section */}
      <div className={cx('about-section')}>
        <div className={cx('section-container')}>
          <div className={cx('section-header')}>
            <h2 className={cx('section-title', 'animate-on-scroll')}>
              Về Beauty Skin
            </h2>
            
            <div className={cx('section-divider', 'animate-on-scroll')}></div>
            
            <p className={cx('section-description', 'animate-on-scroll')}>
              Beauty Skin tự hào cung cấp các sản phẩm chăm sóc da cao cấp, uy tín và chính hãng. 
              Chúng tôi cam kết mang đến trải nghiệm mua sắm chất lượng và những giải pháp làm đẹp hiệu quả cho khách hàng.
            </p>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className={cx('features-section')}>
        <div className={cx('section-container')}>
          <div className={cx('section-header')}>
            <h2 className={cx('section-title', 'animate-on-scroll')}>
              Tại sao chọn Beauty Skin?
            </h2>
            
            <div className={cx('section-divider', 'animate-on-scroll')}></div>
          </div>
          
          <div className={cx('features-grid')}>
            {/* Feature 1 */}
            <div className={cx('feature-card', 'animate-on-scroll')}>
              <div className={cx('feature-icon', 'icon-authentic')}></div>
              <h3 className={cx('feature-title')}>Sản phẩm chính hãng</h3>
              <p className={cx('feature-description')}>
                Chúng tôi cam kết cung cấp các sản phẩm chính hãng 100% với nguồn gốc rõ ràng từ các thương hiệu uy tín.
              </p>
            </div>
            
            {/* Feature 2 */}
            <div className={cx('feature-card', 'animate-on-scroll')}>
              <div className={cx('feature-icon', 'icon-quality')}></div>
              <h3 className={cx('feature-title')}>Chất lượng cao</h3>
              <p className={cx('feature-description')}>
                Các sản phẩm được lựa chọn kỹ lưỡng, đảm bảo hiệu quả và an toàn cho mọi loại da.
              </p>
            </div>
            
            {/* Feature 3 */}
            <div className={cx('feature-card', 'animate-on-scroll')}>
              <div className={cx('feature-icon', 'icon-shipping')}></div>
              <h3 className={cx('feature-title')}>Giao hàng nhanh chóng</h3>
              <p className={cx('feature-description')}>
                Đơn hàng của bạn sẽ được xử lý và giao đến tận tay trong thời gian ngắn nhất có thể.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Testimonials */}
      <div className={cx('testimonials-section')}>
        <div className={cx('section-container')}>
          <div className={cx('section-header')}>
            <h2 className={cx('section-title', 'animate-on-scroll')}>
              Khách hàng nói gì về chúng tôi
            </h2>
            
            <div className={cx('section-divider', 'animate-on-scroll')}></div>
          </div>
          
          <div className={cx('testimonials-grid')}>
            {[
              {
                name: "Nguyễn Thị Minh",
                comment: "Các sản phẩm Klairs từ Beauty Skin thực sự đã giúp cải thiện làn da của tôi. Đặc biệt là toner và serum vitamin C, tôi rất hài lòng với kết quả.",
                rating: 5,
                avatar: "src/assets/portrait_left.png" // URL ảnh đại diện
              },
              {
                name: "Trần Văn Hoàng",
                comment: "Giao hàng nhanh, đóng gói cẩn thận. Sản phẩm chính hãng và giá cả phải chăng. Tôi sẽ tiếp tục ủng hộ Beauty Skin.",
                rating: 5,
                avatar: "src/assets/portrait_right.png" // URL ảnh đại diện
              },
              {
                name: "Lê Thị Thanh",
                comment: "Tôi rất tin tưởng vào Beauty Skin vì tất cả sản phẩm đều là chính hãng. Dịch vụ khách hàng tuyệt vời, luôn tư vấn nhiệt tình.",
                rating: 4,
                avatar: "src/assets/portrait_middle.png" // URL ảnh đại diện
              }
            ].map((testimonial, index) => (
              <div 
                key={index} 
                className={cx('testimonial-card', 'animate-on-scroll')}
                style={{ animationDelay: `${300 + (index * 100)}ms` }}
              >
                <div className={cx('testimonial-header')}>
                  <div className={cx('testimonial-avatar')}>
                    <img src={testimonial.avatar} alt={testimonial.name} />
                  </div>
                  
                  <div className={cx('testimonial-info')}>
                    <h3 className={cx('testimonial-name')}>{testimonial.name}</h3>
                    
                    <div className={cx('testimonial-rating')}>
                      {[...Array(5)].map((_, i) => (
                        <span 
                          key={i} 
                          className={cx('star', { 'active': i < testimonial.rating })} 
                        ></span>
                      ))}
                    </div>
                  </div>
                </div>
                
                <p className={cx('testimonial-text')}>"{testimonial.comment}"</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className={cx('cta-section')}>
        <div className={cx('cta-container')}>
          <h2 className={cx('cta-title', 'animate-on-scroll')}>
            Sẵn sàng bắt đầu hành trình chăm sóc da của bạn?
          </h2>
          
          <p className={cx('cta-description', 'animate-on-scroll')}>
            Chúng tôi có các sản phẩm chất lượng cao phù hợp với mọi loại da và nhu cầu chăm sóc
          </p>
          
          <button className={cx('cta-button', 'animate-on-scroll')} onClick={onShowProducts}>
            Mua sắm ngay hôm nay
          </button>
        </div>
      </div>
    </div>
  );
}

export default LandingPage;