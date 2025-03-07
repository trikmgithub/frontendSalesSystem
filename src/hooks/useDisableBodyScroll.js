import { useEffect } from 'react';

/**
 * Custom hook to disable body scroll when modal is open
 * while still allowing scrolling within the modal content
 */
const useDisableBodyScroll = (isOpen) => {
  useEffect(() => {
    if (isOpen) {
      // Save current scroll position
      const scrollY = window.scrollY;
      
      // Add styles to body to prevent scrolling but maintain position
      document.body.style.position = 'fixed';
      document.body.style.top = `-${scrollY}px`;
      document.body.style.width = '100%';
      document.body.style.overflowY = 'scroll'; // Keep scrollbar to avoid layout shift
      
      return () => {
        // Restore scrolling when component unmounts or modal closes
        document.body.style.position = '';
        document.body.style.top = '';
        document.body.style.width = '';
        document.body.style.overflowY = '';
        
        // Restore scroll position
        window.scrollTo(0, scrollY);
      };
    }
  }, [isOpen]);
};

export default useDisableBodyScroll;