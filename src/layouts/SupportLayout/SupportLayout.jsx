import React from 'react';
import SupportHeader from '../components/Header/SupportHeader';
import SupportFooter from '../components/Footer/SupportFooter';

function SupportLayout({ children }) {
    return (
        <div className="support-wrapper">
            <SupportHeader />
            <div className="support-content">
                {children}
            </div>
            <SupportFooter />
        </div>
    );
}

export default SupportLayout;