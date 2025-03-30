import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getAllBrandsAxios } from '~/services/brandAxios';
import classNames from 'classnames/bind';
import styles from './BrandMenu.module.scss';

const cx = classNames.bind(styles);

function BrandMenu() {
    const [brands, setBrands] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [activeSection, setActiveSection] = useState('0-9');

    // Define all possible alphabet sections
    const alphabetSections = ['0-9', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 
                             'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];

    useEffect(() => {
        fetchAllBrands();
    }, []);

    const fetchAllBrands = async () => {
        setLoading(true);
        try {
            const response = await getAllBrandsAxios();
            
            if (response && response.data) {
                // Sort brands alphabetically by name
                const sortedBrands = response.data.sort((a, b) => 
                    a.name.localeCompare(b.name, 'vi')
                );
                
                setBrands(sortedBrands);
            } else {
                setError('Failed to fetch brands data');
            }
        } catch (err) {
            console.error('Error fetching brands:', err);
            setError('Could not load brands from server');
        } finally {
            setLoading(false);
        }
    };

    // Group brands by first character
    const groupBrandsByLetter = () => {
        const groupedBrands = {
            '0-9': []
        };
        
        // Initialize all letter groups
        alphabetSections.forEach(letter => {
            if (letter !== '0-9') {
                groupedBrands[letter] = [];
            }
        });
        
        // Sort brands into appropriate groups
        brands.forEach(brand => {
            const firstChar = brand.name.charAt(0).toUpperCase();
            
            if (/^[0-9]/.test(firstChar)) {
                groupedBrands['0-9'].push(brand);
            } else if (/^[A-Z]/.test(firstChar) && groupedBrands[firstChar]) {
                groupedBrands[firstChar].push(brand);
            } else {
                // For any character that doesn't fit our defined sections
                // This is a fallback, typically shouldn't happen with proper data
                if (!groupedBrands['Other']) {
                    groupedBrands['Other'] = [];
                }
                groupedBrands['Other'].push(brand);
            }
        });
        
        return groupedBrands;
    };

    const groupedBrands = groupBrandsByLetter();

    // Scroll to section when alphabet navigation is clicked
    const scrollToSection = (sectionId) => {
        setActiveSection(sectionId);
        const section = document.getElementById(sectionId);
        if (section) {
            section.scrollIntoView({ behavior: 'smooth' });
        }
    };

    if (loading) {
        return (
            <div className={cx('loading-container')}>
                <div className={cx('loading-spinner')}></div>
                <p>Đang tải thương hiệu...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className={cx('error-notification')}>
                <p>{error}</p>
            </div>
        );
    }

    return (
        <div className={cx('wrapper')}>
            <div className={cx('container')}>
                <h1 className={cx('page-title')}>Xem {brands.length} thương hiệu</h1>
                
                {/* Alphabet Navigation */}
                <div className={cx('alphabet-navigation')}>
                    {alphabetSections.map(letter => (
                        <button
                            key={letter}
                            className={cx('alphabet-button', { active: activeSection === letter })}
                            onClick={() => scrollToSection(letter)}
                        >
                            {letter}
                        </button>
                    ))}
                </div>
                
                {/* Brand Sections */}
                <div className={cx('brand-sections')}>
                    {alphabetSections.map(letter => {
                        const brandsInSection = groupedBrands[letter] || [];
                        
                        // Only show sections that have brands
                        if (brandsInSection.length === 0) return null;
                        
                        return (
                            <div id={letter} key={letter} className={cx('brand-section')}>
                                <h2 className={cx('section-title')}>{letter}</h2>
                                <div className={cx('brand-grid')}>
                                    {brandsInSection.map(brand => (
                                        <Link 
                                            to={`/brand/${brand._id}`}
                                            key={brand._id}
                                            className={cx('brand-item')}
                                        >
                                            {brand.name}
                                        </Link>
                                    ))}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}

export default BrandMenu;