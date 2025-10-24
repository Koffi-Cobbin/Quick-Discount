import React, { useRef } from 'react';
import styled from "styled-components";
import classes from './Test.module.css';

const Test = () => {
    const containerRef = useRef(null);

  const scroll = (scrollOffset) => {
    containerRef.current.scrollBy({
      left: scrollOffset,
      behavior: 'smooth',
    });
  };
  
  return (
    <div className={classes.container} ref={containerRef}>
      <div className={classes.row}>
        {[...Array(10)].map((_, index) => (
          <div className={classes.card} key={index}>
            <img
              src={`https://via.placeholder.com/200x200?text=Column${index + 1}`}
              alt={`Column${index + 1}`}
            />
          </div>
        ))}
      </div>

      <button className={classes["control left"]} onClick={() => scroll(-300)}>
        &#8249;
      </button>
      <button className={classes["control right"]} onClick={() => scroll(300)}>
        &#8250;
      </button>
    </div>
  );
};



export default Test;
