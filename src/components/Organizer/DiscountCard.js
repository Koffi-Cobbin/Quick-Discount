import React from "react";
import styled from "styled-components";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { formatDate, formatTime } from "../../utils/middleware";
import { deleteDiscountAPI } from "../../actions";

const DiscountCard = (props) => {
  const [slice, setSlice] = useState(false);

  const navigate = useNavigate();

  const handleSlice = (data) => {
    if (data.length > 56) {
      setSlice(true);
      return data.slice(0, 50);
    } else {
      return data;
    }
  };

  const handleRedirect = (url) => {
    if (url) {
      navigate(url);
    } else {
      navigate("/");
    }
  };

  const isUpcoming = (dateString) => {
    // Convert the date string to a Date object
    const inputDate = new Date(dateString);
    console.log(1111);
    // Get today's date
    const today = new Date();
    console.log(2222);
    // Compare the two dates
    if (inputDate >= today) {
        return true;
    } else {
        return false;
    }
  };

  return (
    <Card>
      <Link to={`/discounts/${props.discount.id}`}>
        <BackgroundImage
          style={{ backgroundImage: `url(${props.discount.flyer})` }}
        />
      </Link>
      <DiscountInfo>
        <Title>
          {handleSlice(props.discount.name)}
          {slice && <span> ...</span>}
        </Title>

        <DateTimeWrapper>
          <Time>
            <p>
              <span>{formatDate(props.discount.start_date)}</span> &nbsp; | &nbsp;
            </p>
          </Time>
          <Date>
            <p>
              <span>{formatTime(props.discount.start_time)}</span>
            </p>
          </Date>
        </DateTimeWrapper>

        <Address>
          <span>{props.discount.location}</span>
        </Address>

        <DiscountStatus>
          <DiscountType>
            {props.discount.discount_type === "free" && <Free>Free &nbsp;|</Free>}
            {props.discount.discount_type === "paid" && (
              <Ticketed>Paid &nbsp;|</Ticketed>
            )}
          </DiscountType>
          {props.discount.location === "venue" && <Live>&nbsp;Live</Live>}
          {props.discount.location === "online" && <Online>&nbsp;Online</Online>}
          {/* { props.discount.status === "postponed" && <Postponed>&nbsp; | Postponed</Postponed> }
                    { props.discount.status === "rejected" && <Canceled>&nbsp; | Rejected</Canceled> }
                    { props.discount.status === "canceled" && <Canceled>&nbsp; | Canceled</Canceled> } */}
        </DiscountStatus>

        {props.showActions &&
            <Wrapper>
            <Actions>
              {(props.discount.sold_tickets > 0 && !isUpcoming(props.discount.end_date)) &&
                <Button
                className="delete"
                onClick={() => props.deleteDiscount(props.discount.id)}
                >
                Delete
                </Button>
              }
                <Button
                onClick={() => handleRedirect(`/discounts/update/${props.discount.id}`)}
                >
                Edit
                </Button>
            </Actions>
            </Wrapper>
        }
      </DiscountInfo>
    </Card>
  );
};

const Card = styled.div`
  width: inherit;
  max-width: 250px;
  height: 280px;
  display: flex;
  flex-direction: column;
  flex-shrink: 0;
  transition: all 0.3s;
  border-radius: 10px;
  overflow: hidden;
  scroll-snap-align: center;
  background-color: #fff;
  margin: 0 auto;
  border: 1px solid rgba(0, 0, 0, 0.15);

  &:hover {
    box-shadow: 0 1px 1px 1px rgba(0, 0, 0, 0.1);
  }
`;

const BackgroundImage = styled.div`
  width: 100%;
  border-radius: 10px 10px 0 0;
  background-color: #333;
  background-position: center;
  background-size: cover;
  height: 110px;
`;

const DiscountInfo = styled.div`
  color: #36454f;
  position: relative;
  flex-grow: 1;
  padding: 20px;
  height: 55%;

  @media (max-width: 767px) {
    font-size: 12px;
    padding: 10px;
  }
  @media (min-width: 768px) {
    font-size: 12px;
  }
`;

const Title = styled.h1`
  margin-top: 1px;
  margin-bottom: 5px;
  font-weight: 600;
  text-align: left;
  max-height: 35px;
  overflow: hidden;
  /* border: 1px solid black; */
  @media (min-width: 768px) {
    font-size: 12px;
  }

  @media (max-width: 530px) {
    font-size: 12px;
  }
`;

const DateTimeWrapper = styled.div`
  color: #fa8128;
  display: flex;
  align-items: center;
`;

const Date = styled.div`
  text-align: left;
  align-items: center;
  font-weight: 600;
  width: fit-content;
`;

const Time = styled(Date)``;

const DiscountStatus = styled.div`
  display: flex;
  align-items: center;
`;

const Live = styled(DiscountStatus)``;

const Online = styled(DiscountStatus)``;

const Upcoming = styled(DiscountStatus)``;

const Postponed = styled(DiscountStatus)``;

const Canceled = styled(DiscountStatus)``;

const DiscountType = styled.span`
  margin-right: 2px;
`;

const Free = styled(DiscountType)``;

const Ticketed = styled(DiscountType)``;

const Address = styled.div`
  text-align: left;
  max-height: 30px;
  overflow: hidden;
  margin-bottom: 4px;
`;

const Wrapper = styled.div`
  position: absolute;
  height: fit-content;
  bottom: 15px;
  right: 15px;
`;

const Actions = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
`;

const Button = styled.button`
  padding: 5px 8px;
  margin: 0 5px;
  border: none;
  border-radius: 4px;
  color: #fff;
  background-color: blue;
  &.delete {
    background-color: red;
  }
`;

const mapStateToProps = (state) => {
  return {};
};

const mapDispatchToProps = (dispatch) => ({
  deleteDiscount: (discount_id) => {
    dispatch(deleteDiscountAPI(discount_id));
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(DiscountCard);
