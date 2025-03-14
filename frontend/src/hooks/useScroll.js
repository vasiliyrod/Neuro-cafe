import { useEffect } from 'react';

const useScroll = (ref, options = {}) => {
  useEffect(() => {
    const handleScroll = () => {
      if (ref.current) {
        const { offsetTop, offsetHeight } = ref.current;
        const scrollY = window.scrollY;

        if (scrollY > offsetTop && scrollY < offsetTop + offsetHeight) {
          ref.current.classList.add('scrolled');
        } else {
          ref.current.classList.remove('scrolled');
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll();

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [ref]);
};

export default useScroll;