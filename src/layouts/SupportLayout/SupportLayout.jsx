import React from 'react';

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