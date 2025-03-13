import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Cookies from 'js-cookie';

const UserIDChecker = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const userIDFromQuery = queryParams.get('UID');

    if (userIDFromQuery) {
      Cookies.set('UID', userIDFromQuery, { expires: 7 });
    } else {
      const userIDFromCookies = Cookies.get('UID');
      if (!userIDFromCookies) {
        navigate('/errorlog');
      }
    }
  }, [location, navigate]);

  return children;
};

export default UserIDChecker;