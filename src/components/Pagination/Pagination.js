import React, { useEffect, useState } from 'react';
import { setDiscounts } from '../../actions';
import { connect } from "react-redux";


const Pagination = (props) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [nextPage, setNextPage] = useState(null);
  const [nextPageURL, setNextPageURL] = useState(null);
  const [prevPageURL, setPrevPageURL] = useState(null);

  const handlePageChange = (newPage, choice) => {
    // Function to fetch data from the API
    const fetchData = async () => {
      try {
        let url = choice === "next" ? nextPageURL : prevPageURL;
        console.log("URLL ", url);
        const response = await fetch(url);
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }

        const responseData = await response.json();
        props.setDiscounts(responseData);
        console.log("Next page response ", responseData);

        // Check if there's a next page and store the URL
        if (responseData.next) {
          setNextPageURL(responseData.next);
          setNextPage(parseInt(responseData.next.charAt(responseData.next.length - 1)));
        } else {
          setNextPageURL(null);
        }

        if (responseData.previous) {
          setPrevPageURL(responseData.previous);
        } else {
          setPrevPageURL(null);
        }
    } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    if (newPage >= 1 && newPage <= nextPage) {
      setCurrentPage(newPage);
      fetchData();
    }
  };

  const { next } = props;
  useEffect(() => {    
    setNextPageURL(next);
    setNextPage(parseInt(next ? next.charAt(next.length - 1) : next));
    console.log(next);
  }, [next]);

  return (
    <div>
      <div>
        <button onClick={() => handlePageChange(currentPage-1, "prev")} disabled={currentPage === 1}>
          Prev &nbsp;
        </button>
        <span>{currentPage} &nbsp;</span>
        <button onClick={() => handlePageChange(currentPage + 1, "next")} disabled={currentPage === nextPage | null}>
          Next
        </button>
      </div>
    </div>
  );
}

const mapStateToProps = (state) => {
  return {};
};

const mapDispatchToProps = (dispatch) => ({
  setDiscounts: (payload) => dispatch(setDiscounts(payload)),
});

export default connect(mapStateToProps, mapDispatchToProps)(Pagination);