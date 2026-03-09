import { useEffect, useLayoutEffect, useCallback } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { setPreviousUrl } from "../actions";

// Scroll function to ensure we scroll to top
const scrollToTop = () => {
  window.scrollTo(0, 0);
  document.documentElement.scrollTop = 0;
  document.body.scrollTop = 0;
  
  // Also try to scroll the app element
  const appElement = document.getElementById("app");
  if (appElement) {
    appElement.scrollTop = 0;
  }
};

function ScrollToTop({ children }) {
  const location = useLocation();
  const dispatch = useDispatch();
  const { pathname } = location;

  // Use useLayoutEffect for synchronous scroll before paint
  useLayoutEffect(() => {
    scrollToTop();
  }, [pathname]);

  // Also use useEffect as a fallback with multiple attempts
  useEffect(() => {
    // Immediate scroll
    scrollToTop();
    
    // Retry after a short delay to handle async rendering
    const timeout1 = setTimeout(scrollToTop, 10);
    const timeout2 = setTimeout(scrollToTop, 50);
    const timeout3 = setTimeout(scrollToTop, 100);
    const timeout4 = setTimeout(scrollToTop, 250);
    const timeout5 = setTimeout(scrollToTop, 500);
    
    // Set previous_url on every route change so that after login,
    // user is redirected to the actual current page, not stale data.
    // Skip setting previous_url when navigating to auth pages.
    const authPaths = ["/login", "/signup", "/logout", "/forgetpassword"];
    if (pathname && !authPaths.includes(pathname)) {
      dispatch(setPreviousUrl(pathname));
    }
    
    return () => {
      clearTimeout(timeout1);
      clearTimeout(timeout2);
      clearTimeout(timeout3);
      clearTimeout(timeout4);
      clearTimeout(timeout5);
    };
  }, [pathname, dispatch]);

  // If children are provided, render them (wrapper pattern)
  return children || null;
}

export default ScrollToTop;
