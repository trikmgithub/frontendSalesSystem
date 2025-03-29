// src/layouts/components/Sidebar/Sidebar.jsx
import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import classNames from 'classnames/bind';
import { FaChevronDown, FaChevronUp, FaTag, FaRegStar, FaFilter, FaSort } from 'react-icons/fa';
import { HiOutlineLocationMarker } from 'react-icons/hi';

import styles from './Sidebar.module.scss';
import { getAllBrandsAxios } from '~/services/brandAxios';

const cx = classNames.bind(styles);

// Price range options for filters
const priceRanges = [
    { min: 0, max: 100000, label: 'Dưới 100,000₫' },
    { min: 100000, max: 200000, label: '100,000₫ - 200,000₫' },
    { min: 200000, max: 300000, label: '200,000₫ - 300,000₫' },
    { min: 300000, max: 500000, label: '300,000₫ - 500,000₫' },
    { min: 500000, max: 1000000, label: 'Trên 500,000₫' }
];

// Product categories for beauty e-commerce
const categories = [
    { id: 'skincare', name: 'Chăm Sóc Da Mặt', items: 120 },
    { id: 'makeup', name: 'Trang Điểm', items: 85 },
    { id: 'haircare', name: 'Chăm Sóc Tóc', items: 60 },
    { id: 'bodycare', name: 'Chăm Sóc Cơ Thể', items: 45 },
    { id: 'personal', name: 'Chăm Sóc Cá Nhân', items: 30 },
    { id: 'fragrances', name: 'Nước Hoa', items: 25 },
    { id: 'supplements', name: 'Thực Phẩm Chức Năng', items: 40 }
];

function Sidebar() {
    const location = useLocation();
    const [expandedSections, setExpandedSections] = useState({
        categories: true,
        price: true,
        brands: true,
        deals: true
    });
    const [brands, setBrands] = useState([]);
    const [loading, setLoading] = useState(false);

    // Mobile responsive state
    const [showMobileSidebar, setShowMobileSidebar] = useState(false);

    // Get brands for filters
    useEffect(() => {
        const loadBrands = async () => {
            try {
                setLoading(true);
                const response = await getAllBrandsAxios();
                if (response && response.data) {
                    setBrands(response.data);
                }
            } catch (error) {
                console.error('Failed to load brands:', error);
            } finally {
                setLoading(false);
            }
        };

        loadBrands();
    }, []);

    const toggleSection = (section) => {
        setExpandedSections({
            ...expandedSections,
            [section]: !expandedSections[section]
        });
    };

    const isCategoryActive = (categoryId) => {
        return location.pathname.includes(`/${categoryId}`);
    };

    return (
        <div className={cx('wrapper')}>
            <div className={cx('mobileToggle')} onClick={() => setShowMobileSidebar(!showMobileSidebar)}>
                <FaFilter /> Lọc sản phẩm
                {showMobileSidebar ? <FaChevronUp /> : <FaChevronDown />}
            </div>

            <div className={cx('sidebar', { mobileSidebarVisible: showMobileSidebar })}>
                {/* Categories Section */}
                <div className={cx('sidebarSection')}>
                    <div 
                        className={cx('sectionHeader')} 
                        onClick={() => toggleSection('categories')}
                    >
                        <h3>Danh Mục Sản Phẩm</h3>
                        {expandedSections.categories ? <FaChevronUp /> : <FaChevronDown />}
                    </div>
                    
                    {expandedSections.categories && (
                        <ul className={cx('categoryList')}>
                            {categories.map(category => (
                                <li 
                                    key={category.id} 
                                    className={cx('categoryItem', { active: isCategoryActive(category.id) })}
                                >
                                    <Link to={`/${category.id}`}>
                                        {category.name}
                                        <span className={cx('itemCount')}>{category.items}</span>
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>

                {/* Price Range Section */}
                <div className={cx('sidebarSection')}>
                    <div 
                        className={cx('sectionHeader')} 
                        onClick={() => toggleSection('price')}
                    >
                        <h3>Giá Sản Phẩm</h3>
                        {expandedSections.price ? <FaChevronUp /> : <FaChevronDown />}
                    </div>
                    
                    {expandedSections.price && (
                        <ul className={cx('priceList')}>
                            {priceRanges.map((range, index) => (
                                <li key={index} className={cx('priceItem')}>
                                    <label className={cx('checkboxLabel')}>
                                        <input type="checkbox" />
                                        <span className={cx('checkmark')}></span>
                                        {range.label}
                                    </label>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>

                {/* Brands Section */}
                <div className={cx('sidebarSection')}>
                    <div 
                        className={cx('sectionHeader')} 
                        onClick={() => toggleSection('brands')}
                    >
                        <h3>Thương Hiệu</h3>
                        {expandedSections.brands ? <FaChevronUp /> : <FaChevronDown />}
                    </div>
                    
                    {expandedSections.brands && (
                        <>
                            <div className={cx('searchBrands')}>
                                <input type="text" placeholder="Tìm thương hiệu..." />
                            </div>
                            <ul className={cx('brandList')}>
                                {loading ? (
                                    <li className={cx('loading')}>Đang tải...</li>
                                ) : brands.length > 0 ? (
                                    brands.map(brand => (
                                        <li key={brand._id} className={cx('brandItem')}>
                                            <label className={cx('checkboxLabel')}>
                                                <input type="checkbox" />
                                                <span className={cx('checkmark')}></span>
                                                {brand.name}
                                            </label>
                                        </li>
                                    ))
                                ) : (
                                    <li className={cx('empty')}>Không có thương hiệu</li>
                                )}
                            </ul>
                        </>
                    )}
                </div>

                {/* Special Deals */}
                <div className={cx('sidebarSection')}>
                    <div 
                        className={cx('sectionHeader')} 
                        onClick={() => toggleSection('deals')}
                    >
                        <h3>Ưu Đãi Đặc Biệt</h3>
                        {expandedSections.deals ? <FaChevronUp /> : <FaChevronDown />}
                    </div>
                    
                    {expandedSections.deals && (
                        <ul className={cx('dealsList')}>
                            <li className={cx('dealItem')}>
                                <label className={cx('checkboxLabel')}>
                                    <input type="checkbox" />
                                    <span className={cx('checkmark')}></span>
                                    <FaTag className={cx('dealIcon')} /> Flash Sale
                                </label>
                            </li>
                            <li className={cx('dealItem')}>
                                <label className={cx('checkboxLabel')}>
                                    <input type="checkbox" />
                                    <span className={cx('checkmark')}></span>
                                    <FaRegStar className={cx('dealIcon')} /> Sản phẩm mới
                                </label>
                            </li>
                            <li className={cx('dealItem')}>
                                <label className={cx('checkboxLabel')}>
                                    <input type="checkbox" />
                                    <span className={cx('checkmark')}></span>
                                    <FaSort className={cx('dealIcon')} /> Bán chạy nhất
                                </label>
                            </li>
                        </ul>
                    )}
                </div>

                {/* Recently Viewed */}
                <div className={cx('sidebarSection')}>
                    <div className={cx('sectionHeader')}>
                        <h3>Đã Xem Gần Đây</h3>
                    </div>
                    <div className={cx('recentlyViewed')}>
                        <p className={cx('emptyMessage')}>Chưa có sản phẩm nào</p>
                    </div>
                </div>

                {/* Store Location Section */}
                <div className={cx('sidebarSection', 'storeLocation')}>
                    <div className={cx('locationHeader')}>
                        <HiOutlineLocationMarker className={cx('locationIcon')} />
                        <h3>Cửa Hàng Gần Đây</h3>
                    </div>
                    <div className={cx('locationInfo')}>
                        <p className={cx('storeName')}>BeautySkin Clinic & Spa</p>
                        <p className={cx('storeAddress')}>123 Nguyễn Văn Linh, Quận 7, TP. HCM</p>
                        <a href="tel:+84901234567" className={cx('storePhone')}>Gọi ngay: 0901 234 567</a>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Sidebar;