import React from "react";
import styled from "styled-components";
import Row from "../UI/Row";
import Column from "../UI/Column";
import Card from "../Shared/Card";
import BarChart from "../UI/Chart";
import { connect } from "react-redux";
import { useState, useEffect } from "react";
import { getOrganizerDiscountsAPI, getAnalyticsAPI } from "../../actions";
import { eventsData } from "../Assets/data";

const Dashboard = (props) => {
  const [activeDiscounts, setActiveDiscounts] = useState();
  const [pendingDiscounts, setPendingDiscounts] = useState();
  const [rejectedDiscounts, setRejectedDiscounts] = useState();
  const [upcomingDiscounts, setUpcomingDiscounts] = useState([]);
  const [filterType, setFilterType] = useState("tickets");
  const [filterOption, setFilterOption] = useState("months");

  // Get analytics data from props
  const analytics = props.analytics || {};
  const discountSummary = analytics.discount_summary || {};
  const engagement = analytics.engagement || {};
  const organizerInfo = analytics.organizer || {};

  // Use analytics data for counts (fallback to manual calculation if analytics not available)
  let activeDiscountsCount = discountSummary.active_discounts !== undefined 
    ? discountSummary.active_discounts 
    : (activeDiscounts ? activeDiscounts.length : 0);
  let pendingDiscountsCount = discountSummary.pending_discounts !== undefined 
    ? discountSummary.pending_discounts 
    : (pendingDiscounts ? pendingDiscounts.length : 0);
  let rejectedDiscountsCount = discountSummary.rejected_discounts !== undefined 
    ? discountSummary.rejected_discounts 
    : (rejectedDiscounts ? rejectedDiscounts.length : 0);
  let totalDiscountsCount = discountSummary.total_discounts || 0;

  // Use engagement data for insights
  const totalPackagesSold = engagement.total_attendees || 0;
  const totalLikes = engagement.total_likes || 0;
  const totalReviews = engagement.total_reviews || 0;
  const averageRating = engagement.average_rating || 0;
  const totalWishlists = engagement.total_wishlists || 0;
  const followersCount = organizerInfo.followers_count || 0;

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
    // Fetch analytics when organizer is available
    if (props.organizer && !props.analytics) {
      props.getAnalytics(props.organizer.id);
      console.log("Fetching analytics!");
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
              <span>Packages Sold</span>
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
        <Title>Engagement Insights</Title>
        <Row style={{ justifyContent: "space-around" }}>
          <Column className="col-25 bg-50">
            <Card className="stats">
              <Number>{followersCount}</Number>
              <span>Followers</span>
            </Card>
          </Column>

          <Column className="col-25 bg-50">
            <Card className="stats">
              <Number>{totalLikes}</Number>
              <span>Total Likes</span>
            </Card>
          </Column>

          <Column className="col-25 bg-50">
            <Card className="stats">
              <Number>{totalReviews}</Number>
              <span>Reviews</span>
            </Card>
          </Column>

          <Column className="col-25 bg-50">
            <Card className="stats">
              <Number>{averageRating.toFixed(1)}</Number>
              <span>Avg Rating</span>
            </Card>
          </Column>
        </Row>
        <Row style={{ justifyContent: "space-around", marginTop: "10px" }}>
          <Column className="col-25 bg-50">
            <Card className="stats">
              <Number>{totalWishlists}</Number>
              <span>Wishlists</span>
            </Card>
          </Column>

          <Column className="col-25 bg-50">
            <Card className="stats">
              <Number>{totalDiscountsCount}</Number>
              <span>Total Discounts</span>
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
        <Title>Recent Discounts</Title>
        {analytics.recent_discounts && analytics.recent_discounts.length > 0 ?
        <Grid>
          {analytics.recent_discounts.slice(0, 4).map((discount, key) => (
              <GridItem>
                <Card key={key} discount={discount} />
              </GridItem>
            ))}
        </Grid>
        :
        (activeDiscountsCount > 0 ?
        <Grid>
          {activeDiscounts && activeDiscounts.slice(0, 4).map((discount, key) => (
              <GridItem>
                <Card key={key} discount={discount} />
              </GridItem>
            ))}
        </Grid>
        :
        (<p>You have no recent discounts</p>)
        )}
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
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20px;
  @media (max-width: 1200px) {
    grid-template-columns: repeat(3, 1fr);
  }
  @media (max-width: 900px) {
    grid-template-columns: repeat(2, 1fr);
  }
  @media (max-width: 580px) {
    grid-template-columns: 1fr;
  }
`;

const GridItem = styled.div`
  width: 100%;
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
    analytics: state.organizerState.analytics,
  };
};

const mapDispatchToProps = (dispatch) => ({
  getOrganizerDiscounts: (organizer_id) => {
    dispatch(getOrganizerDiscountsAPI(organizer_id));
  },
  getAnalytics: (organizer_id) => {
    dispatch(getAnalyticsAPI(organizer_id));
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(Dashboard);
