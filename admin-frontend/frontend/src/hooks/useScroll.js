import { useEffect } from 'react';

const useScroll = (ref) => {
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 100) {
        ref.current.classList.add('scrolled');
      } else {
        ref.current.classList.remove('scrolled');
      }
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [ref]);
};

export default useScroll;