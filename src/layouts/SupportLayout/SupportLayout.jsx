import React from 'react';
import SupportHeader from '../components/Header/SupportHeader';
import SupportFooter from '../components/Footer/SupportFooter';

function SupportLayout({ children }) {
    return (
        <div className="support-wrapper">
            <div className="support-content">
                {children}
            </div>
        </div>
    );
}

export default SupportLayout;