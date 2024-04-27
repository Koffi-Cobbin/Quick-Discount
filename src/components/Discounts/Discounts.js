import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { useParams } from "react-router";
import { connect } from "react-redux";

import DiscountCard from "./DiscountCard";
import FilterButtons from "./Features/FilterButtons";
import Loading from "../Shared/Loading";
import Pagination from "../Pagination/Pagination";
import { getDiscountsAPI, getCategoriesAPI } from "../../actions";


const Discounts = (props) => {
  let { catId } = useParams();
  const [filteredEvents, setfilteredEvents] = useState();
  const [checkedInputs, setCheckInputs] = useState({cat: [], loc: [], date: []});
  const [categories, setCategories] = useState();

  const filterEvents = (checkedInputs) => {
    setCheckInputs(checkedInputs);
    const newFilteredEvents= props.discounts.results.filter((discount) => {
      return  checkedInputs["cat"].some(category => discount.categories.filter(cat => cat.name).includes(category))
    });
    setfilteredEvents(newFilteredEvents);
  };

  useEffect(() => {
    const filterEventsOnLoad = () => { 
        if (catId) {
          filterEvents({...checkedInputs, cat: [...checkedInputs["cat"], catId]});
        }
        if (props.discounts.results) {
          setfilteredEvents(props.discounts.results);

          const categories_lists = props.discounts.results.map((discount) => discount.categories);
          console.log("AAA ", categories_lists);
          // Create an empty Set to store unique values
          const categories_set = new Set();
        
          // Loop through each sub-list in A and add its elements to the resultSet
          categories_lists.forEach(subList => {
            subList.forEach(category => {
              categories_set.add(category);
            });
          });
          // Unpack the set into a list
          const categories = [...categories_set];
          setCategories(categories);
          console.log("bbbbbb ", props.discounts.results);
        }
      }; 
    filterEventsOnLoad();
  }, [props.discounts]);

  const discountCardStyles = {
    card: {margin: "0 auto", width: '80%'},
    bgImage: {height: "110px"},
    eventInfo: {paddingMd: "20px", height: "115px"},
    title: {fontSizeSm: "13px", fontSizeMd: "15px", fontSizeL: "18px"},
    fontSizes: {fontSizeSm: "12px", fontSizeMd: "12px", fontSizeL: "15.5px"},
    dateTime: {
      md: {display: "flex", alignItems: "center", justifyContent: "space-between"}, 
      xsm: {}
    },
    time: {},
    eventStatus: {},
    locationStyle: {},
    attendeesSlots: {display: "flex", alignItems: "center", justifyContent: "space-between"},
    slots: {}
  }

  return (
    <Wrapper>
    { (filteredEvents && categories) ? (
      <Container>
          <Title>Discounts /</Title>
          <Section>
              <FlexWrap>
                <FilterButtons
                    filterEvents={filterEvents}
                    setfilteredEvents={setfilteredEvents}
                    categories={categories}
                    checkedInputs={checkedInputs}
                />
              </FlexWrap>
          </Section>  
          <FilteredEvents>
              {
                filteredEvents.map((discount, key) => (
                  <FilteredItem>
                    <DiscountCard 
                      key={key} 
                      discount={discount} 
                      discountCardStyles={discountCardStyles} />
                  </FilteredItem>
                ))
              }
          </FilteredEvents>
          <Wrapper>
            {props.discounts && <Pagination next={props.discounts.next}/>}
          </Wrapper>
      </Container>
      ) : (
        <Loading />
      )
    }
    </Wrapper>
  );
};

const Wrapper = styled.div`
  margin-top: 50px;
  font-family: Lato, 'Roboto', sans-serif;
  font-size: 20px;
`;

const Container = styled.div`
  position: relative;
  max-width: 100%;
  margin: 0 auto;
  border-top: 1px solid white;

  @media (min-width: 768px) {
    width: 75%;
    margin: 0 auto;
  }

  /* Largest devices such as desktops (1920px and up) */
  @media only screen and (min-width: 120em) {
    width: 65%;
    margin: 0 auto;
  }

  /* Largest devices such as desktops (1280px and up) */
  @media only screen and (min-width: 160em) {
    width: 50%;
    margin: 0 auto;
  }
`;

const Title = styled.h3`
  text-align: left;
  margin-top: 40px;
  margin-bottom: 0;
  /* border: 1px solid black; */
  &::after {
    display:block;
    clear:both;
    content : "";
    position: relative;
    left    : 0;
    bottom  : 0;
    height  : 2px;
    width   : 70px; 
    border-bottom:3px solid #fa8128;
    padding:4px 0px;
  }
  @media (max-width: 480px) {
    /* font-size: medium; */
    margin-top: 20px;
    padding-left: 20px;
  }
`;

const Section = styled.div`
  margin-top: 0;
  margin-bottom: 20px;
  /* border: 1px solid blue; */
`;

const FlexWrap = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  margin: 0 auto;
  span {
    color: #36454F;
  }
`;

const FilteredEvents = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  grid-template-rows: repeat(auto-fill, minmax(250px, 1fr));
  grid-gap: 20px 10px;
  /* border: 1px solid black; */

  @media (min-width: 500px) {
    grid-auto-columns: calc(50% - 10px);
  }
  
  @media (min-width: 700px) {
    grid-auto-columns: calc(calc(100% / 3) - 20px);
    grid-gap: 30px 30px;
  }
  
  @media (min-width: 1100px) {
    grid-auto-columns: calc(25% - 30px);
  }
`;

const FilteredItem = styled.div`
  position: relative;
  min-width: 250px;
  border-radius: 20px;
  /* border: 1px solid black; */
  cursor: pointer;
  box-shadow: 0 1px 1px 1px rgba(0, 0, 0, 0.1);

  &:hover {
      box-shadow: 0 8px 16px 0 rgba(0, 0, 0, 0.2);
  }
`;

const mapStateToProps = (state) => {
  return {
      user: state.userState.user,
      token: state.userState.token,
      discounts: state.discountState.discounts,
      categories: state.discountState.categories,
  }
};

const mapDispatchToProps = (dispatch) => ({
  getEvents: () => {dispatch(getDiscountsAPI())}, 
  getCategories: () => dispatch(getCategoriesAPI()),  
});
  
export default connect(mapStateToProps, mapDispatchToProps)(Discounts);
