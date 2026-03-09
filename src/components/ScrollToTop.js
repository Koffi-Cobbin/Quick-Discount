import { useEffect } from "react";
import { connect } from "react-redux";
import { setPreviousUrl } from "../actions";

function ScrollToTop({ pathname, setUrl }) {
  useEffect(() => {
    window.scrollTo(0, 0);
    // Set previous_url on every route change so that after login,
    // user is redirected to the actual current page, not stale data.
    // Skip setting previous_url when navigating to auth pages.
    const authPaths = ["/login", "/signup", "/logout", "/forgetpassword"];
    if (setUrl && pathname && !authPaths.includes(pathname)) {
      setUrl(pathname);
    }
  }, [pathname, setUrl]);

  return null;
}

const mapDispatchToProps = (dispatch) => ({
  setUrl: (url) => dispatch(setPreviousUrl(url)),
});

export default connect(null, mapDispatchToProps)(ScrollToTop);
