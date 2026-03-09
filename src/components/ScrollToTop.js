import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setPreviousUrl } from "../actions";

function ScrollToTop({ children }) {
  const { pathname } = useLocation();
  const dispatch = useDispatch();

  useEffect(() => {
    // 'instant' skips smooth-scroll animations and cannot be
    // overridden by in-flight scrollIntoView calls from the previous page.
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });

    const authPaths = ["/login", "/signup", "/logout", "/forgetpassword"];
    if (pathname && !authPaths.includes(pathname)) {
      dispatch(setPreviousUrl(pathname));
    }
  }, [pathname, dispatch]);

  return children || null;
}

export default ScrollToTop;