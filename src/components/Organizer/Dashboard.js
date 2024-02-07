import React from "react";
import styled from "styled-components";
import Row from "../UI/Row";
import Column from "../UI/Column";
import DiscountCard from "./DiscountCard";
import BarChart from "../UI/Chart";
import { connect } from "react-redux";
import { useState, useEffect } from "react";
import { getOrganizerDiscountsAPI } from "../../actions";
import { eventsData } from "../Assets/data";

const Dashboard = (props) => {
  const [activeDiscounts, setActiveDiscounts] = useState();
  const [pendingDiscounts, setPendingDiscounts] = useState();
  const [rejectedDiscounts, setRejectedDiscounts] = useState();
  const [upcomingDiscounts, setUpcomingDiscounts] = useState([]);
  const [totalPackagesSold, setTotalPackagesSold] = useState(0);
  const [filterType, setFilterType] = useState("tickets");
  const [filterOption, setFilterOption] = useState("months");

  let activeDiscountsCount = activeDiscounts ? activeDiscounts.length : 0;
  let pendingDiscountsCount = pendingDiscounts ? pendingDiscounts.length : 0;
  let rejectedDiscountsCount = rejectedDiscounts ? rejectedDiscounts.length : 0;

  // function to filter a list of discount objects based on a given discount status
  function filterByStatus(eventsList, status) {
    return eventsList.filter((discount) => {
      return discount["status"] === status;
    });
  };

  // function to filter a list of discount objects based on date and time differences
  function filterUpcomingDiscounts(eventsList) {
    return eventsList.filter((discount) => {
      // Get discount start date and end date 
      let startDate = discount["start_date"];
      let endDate = discount["end_date"];
      // Calculate the difference between now and the discount's start date in days
      let startDateDifference = Math.abs(
        new Date(startDate).getTime() - new Date().getTime()
      );
      console.log("startDateDifference ", startDateDifference);

      // Calculate the difference between now and the discount's end date in days
      let endDateDifference = Math.abs(
        new Date(endDate).getTime() - new Date().getTime()
      );
      console.log("endDateDifference ", endDateDifference);
      
      // Get discount start time and end time
      let newDate = new Date();
      let startTime = new Date(`${newDate.toDateString()} ${discount["start_time"]}`); 
      let endTime = new Date(`${newDate.toDateString()} ${discount["end_time"]}`); 

      // Calculate the difference between now and the discount's start time in hours
      let startTimeDifference = Math.abs(
        startTime - new Date().getTime()
      );
      console.log("startTimeDifference ", startTimeDifference);

      // Calculate the difference between now and the discount's end time in hours
      let endTimeDifference = Math.abs(
        endTime - new Date().getTime()
      );
      console.log("endTimeDifference ", endTimeDifference);

      if (startDateDifference >= 0 && startTimeDifference >= 0 && discount["status"] === "active") {
        return true;
      }
      else{
        return false;
      };
    });
  };

  const toggleFilterType = (filter_type) => {
    setFilterType(filter_type);
  };

  const toggleFilterOption = (filter_option) => {
    setFilterOption(filter_option);
  };

  const filterOnClickHandler = (id) => {
    var element = document.getElementById(id);
    if (element.classList.contains("active")) {
      return;
    } 
    else {
        let widgets;
        if (element.classList.contains("filterType")) {
            widgets = document.getElementsByClassName("filterType");
          }
        else{
            widgets = document.getElementsByClassName("widget");
        }
        for (let elem of widgets) {
            if (elem.classList.contains("active")) {
            elem.classList.toggle("active");
            };
        }
        element.classList.toggle("active");
        if (element.classList.contains("filterType")) {
            toggleFilterType(id);
          }
        else{
            toggleFilterOption(id);
        }
    }
  };

  useEffect(() => {
    if (!props.events && props.organizer) {
      props.getOrganizerDiscounts(props.organizer.id);
      console.log("In organizer dashboard!");
    }
    if (props.events) {
      // Set active events
      setActiveDiscounts(filterByStatus(props.events, "active"));
      // Set pending events
      setPendingDiscounts(filterByStatus(props.events, "pending"));
      // Set rejected events
      setRejectedDiscounts(filterByStatus(props.events, "rejected"));
      // Filter upcoming events
      setUpcomingDiscounts(filterUpcomingDiscounts(props.events));
    }
  }, []);

  return (
    <Container>
      <Section>
        <Row style={{ justifyContent: "space-around" }}>
          <Column className="col-25 bg-50">
            <Card className="stats">
              <Number>{totalPackagesSold}</Number>
              <span>Packages sold</span>
            </Card>
          </Column>

          <Column className="col-25 bg-50">
            <Card className="stats">
              <Number>{activeDiscountsCount}</Number>
              <span>Active Discounts</span>
            </Card>
          </Column>

          <Column className="col-25 bg-50">
            <Card className="stats">
              <Number>{pendingDiscountsCount}</Number>
              <span>Pending Discounts</span>
            </Card>
          </Column>

          <Column className="col-25 bg-50">
            <Card className="stats">
              <Number>{rejectedDiscountsCount}</Number>
              <span>Rejected Discounts</span>
            </Card>
          </Column>
        </Row>
      </Section>

      <Section>
        <Title>Analytics</Title>
        <Row className="max-480">
          <Column className="col-75 bg-75 md">
            <BarChartWrap>
              <FixedBarChartWrap>
                <BarChart filterType={filterType} filterOption={filterOption}/>
              </FixedBarChartWrap>
            </BarChartWrap>
          </Column>
          <Column className="col-25 bg-25 md">
            <Card>
              <p>Filter Options</p>
              <FilterOptions>
                <FilterOption
                    id="tickets"
                    className="filterType active"
                    onClick={() => filterOnClickHandler("tickets")}
                >
                    Packages
                </FilterOption>
                <FilterOption
                    id="sales"
                    className="filterType"
                    onClick={() => filterOnClickHandler("sales")}
                >
                    Sales
                </FilterOption>
              </FilterOptions>
              <FilterWidget
                id="months"
                className="widget active"
                onClick={() => filterOnClickHandler("months")}
              >
                Months
              </FilterWidget>
              <FilterWidget
                id="years"
                className="widget"
                onClick={() => filterOnClickHandler("years")}
              >
                Years
              </FilterWidget>
            </Card>
          </Column>
        </Row>
      </Section>

      <Section>
        <Title>Active Discounts</Title>
        {activeDiscountsCount > 0 ?
        <Grid>
          {activeDiscounts && activeDiscounts.slice(0, 4).map((discount, key) => (
              <GridItem>
                <DiscountCard key={key} discount={discount} />
              </GridItem>
            ))}
        </Grid>
        :
        (<p>You have no active events</p>)
        }
      </Section>

      <Section>
        <Title>Upcoming Discounts</Title>
        {upcomingDiscounts && upcomingDiscounts.length > 0 ?
        <Grid>
          {upcomingDiscounts.slice(0, 4).map((discount, key) => (
              <GridItem>
                <DiscountCard key={key} discount={discount} showActions={true}/>
              </GridItem>
            ))}
        </Grid>
        :
        (<p>You have no upcoming events</p>)
        }
      </Section>

      <Section>
        <Title>Notifications</Title>
        <Row style={{ justifyContent: "space-between" }}></Row>
        <p>You have no notifications</p>
      </Section>
    </Container>
  );
};

const Container = styled.div``;

const Section = styled.div`
  border: none;
  padding: 10px;
  margin-bottom: 10px;
  position: relative;
`;

const Number = styled.h2`
  color: #fa8128;
  margin: 0;
`;

const Title = styled.h4`
  color: #fa8128;
  margin: 10px 0;
  text-align: left;
  padding-bottom: 10px;
  border-bottom: 1px solid rgba(0, 0, 0, 0.15);
`;

const Card = styled.div`
  width: 180px;
  border: 1px solid rgba(0, 0, 0, 0.15);
  border-radius: 5px;
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin-right: 10px;
  margin-bottom: 5px;
  p {
    margin-top: 10px;
  }
  &.stats {
    height: 110px;
  }
  @media (max-width: 540px) {
    width: 100%;
  }
`;

const BarChartWrap = styled.div`
  padding: 5px;
  border: 1px solid rgba(0, 0, 0, 0.15);
  border-radius: 5px;
  position: relative;
  overflow-x: scroll;
  @media (max-width: 320px) {
    width: 250px;
  }
`;

const FixedBarChartWrap = styled.div`
  width: 99%;
  margin: 0 auto;
  position: relative;
  @media (max-width: 540px) {
    min-width: 300px;
  }
`;

const Grid = styled.div`
  display: flex;
  /* align-items: center; */
  /* justify-content: space-around; */
  @media (max-width: 540px) {
    flex-wrap: wrap;
    justify-content: space-between;
  }
`;

const GridItem = styled.div`
  width: 270px;
  @media (max-width: 540px) {
    /* width: 200px; */
    margin-bottom: 10px;
  }
`;

const FilterOptions = styled.div`
  border: 1px solid rgba(0, 0, 0, 0.15);
  border-radius: 5px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 5px;
  padding: 5px;
`;

const FilterOption = styled.button`
  width: 60px;  
  &.active,
  &:hover {
    border-bottom: 3px solid rgba(53, 162, 235, 0.5);
  }
`;

const FilterWidget = styled.button`
  padding: 10px;
  width: 100px;
  border-radius: 5px;
  margin-bottom: 5px;
  background-color: rgba(0, 0, 0, 0.08);
  &.active,
  &:hover {
    background-color: rgba(53, 162, 235, 0.5);
  }
`;

const mapStateToProps = (state) => {
  return {
    user: state.userState.user,
    organizer: state.organizerState.organizer,
    events: state.organizerState.events,
    notifications: state.organizerState.notifications,
  };
};

const mapDispatchToProps = (dispatch) => ({
  getOrganizerDiscounts: (organizer_id) => {
    dispatch(getOrganizerDiscountsAPI(organizer_id));
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(Dashboard);
