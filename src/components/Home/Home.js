import React from "react";
import styled from "styled-components";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import { useEffect, useState } from "react";

import BackgroundSlider from "./BackgroundSlider";
import CarouselFlex from "../Shared/CarouselFlex";
import TopDiscounts from "../Discounts/TopDiscounts";
import { LeftButton, RightButton } from "../Shared/CarouselControls";
import DiscountCard from "../Discounts/DiscountCard";

import { getDiscountsAPI, getCategoriesAPI} from "../../actions";

const Home = (props) => {
  const [categories, setCategories] = useState();

  useEffect(() => {
    const getData = () => {
      props.getCategories();
      props.getDiscounts();
    };
    getData();
    console.log("GETTING DATA ...");
  }, []);

  useEffect(() => {
    if (props.discounts.results) {
      // Get categories of fectched discounts
      const categories_lists = props.discounts.results.map(
        (discount) => discount.categories
      );
      console.log("AAA ", categories_lists);
      // Create an empty Set to store unique values
      const categories_set = new Set();

      // Loop through each sub-list in A and add its elements to the resultSet
      categories_lists.forEach((subList) => {
        subList.forEach((category) => {
          categories_set.add(category.name);
        });
      });
      // Unpack the set into a list
      let allCategories = [...categories_set];
      console.log("All categories ", allCategories);
      setCategories(allCategories);
    }
  }, [props.discounts]);

  const handleClickScroll = (id) => {
    const element = document.getElementById(id.toLowerCase() + "-section");
    if (element) {
      // 👇 Will scroll smoothly to the top of the next section
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  const discountCardStyles = {
    card: { margin: "0 auto", width: "80%" },
    bgImage: { height: "120px" },
    eventInfo: { paddingMd: "20px", height: "115px" },
    title: { fontSizeSm: "13px", fontSizeMd: "15px", fontSizeL: "18px" },
    fontSizes: { fontSizeSm: "12px", fontSizeMd: "12px", fontSizeL: "15.5px" },
    dateTime: {
      md: {
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
      },
      xsm: {},
    },
    time: {},
    eventStatus: {},
    locationStyle: {},
    attendeesSlots: {
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
    },
    slots: {},
  };

  return (
    <Container>
      <div>
        <BackgroundSlider />
      </div>

      {props.discounts.results && 
        <TopDiscounts 
          discounts={props.discounts.results.slice(0,4)} 
          discountCardStyles={discountCardStyles}/>}

      <Section>
        <LeftButton target="filter"/>
        
        <Categories
          id="filter"
          role="region"
          aria-label="categories-filter"
          tabindex="0"
        >
          {categories && (
            <>
              <span className="active" onClick={() => handleClickScroll("popular")}>
                {categories[0]}
              </span>
              {categories.slice(1).map((category, key) => (
                <span key={key} onClick={() => handleClickScroll(category)}>
                  {category}
                </span>
              ))}
            </>
          )}
        </Categories>
        
        <RightButton target="filter"/>
      </Section>

      <CategoriesWrap>
        {categories && (
          <>
            {categories.map((category, key) => (
              <CategorySection
                key={key}
                id={`${category.toLowerCase()}-section`}
                index={key}
                className="category-section"
              >
                <CategoryTitle>
                  <h4>{category}</h4>
                  <h4>
                    <Link to={`/discounts/cat/${category.toLowerCase()}`}>
                      See more
                    </Link>
                  </h4>
                </CategoryTitle>
                {props.discounts.results && (
                  <CarouselFlex
                    type="category"
                    divId={category.toLowerCase()}
                    className="category-carousel-section"
                  >
                    {props.discounts.results.slice(0,4).map((discount, key) => (
                      <DiscountCard
                        key={key}
                        discount={discount}
                        discountCardStyles={discountCardStyles}
                      />
                    ))}
                  </CarouselFlex>
                )}
              </CategorySection>
            ))}
          </>
        )}
      </CategoriesWrap>
    </Container>
  );
};

const Container = styled.div`
  max-width: 100%;
  position: relative;
`;

const Section = styled.div`
  position: relative;
  width: 100%;
  overflow-x: hidden;
  margin: 10px 0;
  background-color: #f8f8f8;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const Categories = styled.div`
  width: 100%;
  padding: 20px 0;
  display: flex;
  overflow-x: auto;
  scroll-snap-type: x proximity;
  scroll-behavior: smooth;
  -webkit-overflow-scrolling: touch;
  position: relative;
  /* border: 1px solid black; */

  span {
    margin: 5px 10px;
    padding: 8px 20px;
    background-color: #fff;
    border-radius: 20px;
    font-size: 14px;
    flex-shrink: 0;
    scroll-snap-align: center;

    &:first-of-type {
      scroll-snap-align: start;
    }
    &:last-of-type {
      scroll-snap-align: end;
    }

    &:hover,
    &.active {
      background-color: #67309b;
      color: white;
      cursor: default;
    }
  }

  &::-webkit-scrollbar {
    display: none;
  }

  @media (min-width: 768px) {
    margin: 0 auto;
    width: 80%;
  }
`;

const CategoriesWrap = styled.div`
  margin-top: 5px;
  max-width: 100%;
`;

const CategorySection = styled.div`
  width: 100%;
  margin: 10px 0;
  padding-bottom: 10px;
  /* border: 1px solid blue; */

  &.category-section {
    background: ${(props) => (props.index % 2 === 0 ? "#fff" : "#fbfbfb")};
    background-image: ${(props) =>
      props.bgImage ? `url(${props.bgImage})` : "none"};
  }
`;

const CategoryTitle = styled.div`
  color: #fa8128;
  display: flex;
  align-items: center;
  justify-content: space-between;
  h4 {
    margin: 5px;
    a {
      color: #808080;
      font-size: 14px;
      text-decoration: none;
      &:hover {
        cursor: default;
      }
    }
  }
  @media (min-width: 768px) {
    width: 90%;
    margin: 0 auto;
  }

  /* Largest devices such as desktops (1920px and up) */
  @media only screen and (min-width: 120em) {
    width: 80%;
    margin: 0 auto;
  }

  /* Largest devices such as desktops (1280px and up) */
  @media only screen and (min-width: 160em) {
    width: 60%;
    margin: 0 auto;
  }
`;

const Popular = styled(CategorySection)`
  margin-top: 20px;
`;

const mapStateToProps = (state) => {
  return {
    user: state.userState.user,
    token: state.userState.token,
    discounts: state.discountState.discounts,
    // categories: state.discountState.categories,
  };
};

const mapDispatchToProps = (dispatch) => ({
  getDiscounts: () => {
    dispatch(getDiscountsAPI());
  },
  getCategories: () => dispatch(getCategoriesAPI()),
});

export default connect(mapStateToProps, mapDispatchToProps)(Home);
