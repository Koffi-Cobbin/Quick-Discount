import React, { useEffect, useState } from "react";
import parse from 'html-react-parser';
import { useParams } from "react-router";
import styled from "styled-components";

import SuggestedDiscountCard from "./SuggestedDiscountCard";
// import CarouselSection from "../Shared/CarouselSection";
import { LeftButton, RightButton} from "../Shared/CarouselControls";
import Loading from "../Shared/Loading";
import Gallery from "../Gallery/Gallery";
import { discountsData } from "../Assets/data";
import { connect } from "react-redux";
import photos from "../Assets/photos";
import AvailablePackages from "../DiscountPackages/AvailablePackages";
import AddToWishlist from "../Wishlist/AddToWishlist";
import { formatDate, formatTime } from "../../utils/middleware";
import { getDiscountMediaAPI } from "../../actions";


const DiscountDetail = (props) => {
    let { discountId } = useParams();
    const [discount, setDiscount] = useState();
    const [readMore,setReadMore] = useState(false);
    const [packagesIsShown, setPackagesIsShown] = useState(false);
    const [organizerDiscounts, setOrganizerDiscounts] = useState();
    const [otherDiscounts, setOtherDiscounts] = useState();

    const linkName = readMore ? 'Read Less <<':'Read More >>'

    // Other discounts from organizer: filter all discounts
    const getOrganizerDiscounts = () => {
        const newOrganizerDiscounts= props.discounts.results.filter((discount_item) => {
          return ((discount_item.id != discount.id) && (discount_item.organizer.id == discount.organizer.id))
        });
        if (newOrganizerDiscounts.length > 0){
            setOrganizerDiscounts(newOrganizerDiscounts);
        } else{
            setOrganizerDiscounts(null);
        }          
      };

    // Other discounts: filter all discounts for two discounts sharing same category as this discount
    const getOtherDiscounts = () => {
        const newOtherDiscounts= props.discounts.results.filter((discount_item) => {
          return ((discount_item.id != discount.id) && 
          (discount_item.organizer.id != discount.organizer.id) &&
          (discount_item.categories.some(category => discount.categories.includes(category))))
        });
        if (newOtherDiscounts.length > 0){
            setOtherDiscounts(newOtherDiscounts);
        } else{
            setOtherDiscounts(null);
        }        
      };

    useEffect(() => {
        // Get the current discount
        const getDiscount = () => { 
            let evnt = props.discounts.results.find(obj => obj.id === +discountId);
            console.log("Current Discount", evnt);
            setDiscount(evnt);
          }; 
        
        if (!discount || (discount && discount.id !== +discountId)){
            getDiscount();
        };

        // Get the discount media
        if (!props.discount_media || (discount && props.discount_media.length > 0 && props.discount_media[0].discount != discount.url)){
            props.getDiscountMedia(discountId);
            console.log("Peeeeee Mail")
        };

        // Get organizer discounts
        if ((!organizerDiscounts && discount) || (discount && discount.organizer.id != organizerDiscounts[0].organizer.id)){
            getOrganizerDiscounts();
        }        

        // Get other discounts
        if ((!otherDiscounts && discount) || 
        (discount && otherDiscounts && otherDiscounts[0].categories.some(category => discount.categories.includes(category)))){
            getOtherDiscounts();
        };
        
    }, [discountId, props.discount_media, discount]);

    const showPackagesHandler = () => {
        setPackagesIsShown(true);
    };
    
    const hidePackagesHandler = () => {
        setPackagesIsShown(false);
    };

    const getDiscountURL = () => {
        let url = window.location.href;
        navigator.clipboard.writeText(url);

        // Alert the copied text
        alert("Link copied: " + url);
    };

    const readMoreHandler = (id) => {
        setReadMore(!readMore);
        let content = document.getElementById(id);
        if (content.style.maxHeight){
            content.style.maxHeight = null;
        } else {
            content.style.maxHeight = content.scrollHeight + "px";
        };
    };

    return (
        <>
        {discount ? (
        <Container>
            {packagesIsShown && <AvailablePackages discount={discount} onClose={hidePackagesHandler} /> }
            <DiscountImageWrapper>
                <DiscountImage imgUrl={discount.flyer}/>
                <ImageOverlay />
                <ShareDiscount onClick={getDiscountURL}>
                    <img src="/images/icons/share-w.svg" /> 
                </ShareDiscount>
            </DiscountImageWrapper>

            <AboutDiscountWrapper>
            <AboutDiscount>
                <DiscountInfo>
                    <Title>{ discount.title}</Title>
                    
                    <DateTimeWrapper>
                        <Wrapper>
                            <Date>
                                <p>{formatDate(discount.start_date)} |</p> &nbsp;
                            </Date>
                           
                            <Time>
                                <p>{formatTime(discount.start_time)}</p> &nbsp;
                            </Time>
                        </Wrapper>

                        <Wrapper>
                            <DiscountType>
                                { discount.discount_type === "free" && <Free>Free</Free> }
                                { discount.discount_type === "paid" && <Packageed>Paid</Packageed> }
                            </DiscountType>
                        </Wrapper>

                        <Address>
                            <p>{ discount.location }</p> 
                        </Address>

                        {/* <Like>
                            <img src="/images/icons/like.svg" />
                            <span>{discount.likes}</span>
                        </Like> */}
                    </DateTimeWrapper>

                    <Description>
                        {parse(discount.description)}                        
                        {/* <ReadMoreOrLess onClick={()=>{readMoreHandler("discount-description")}}>{linkName}</ReadMoreOrLess> */}
                    </Description>
                </DiscountInfo>

                <ReserveSection>
                    <ReserveSectionContent>
                        <ReserveSectionButtons>
                            <ReserveSpot onClick={showPackagesHandler}>Reserve a spot</ReserveSpot>
                            <AddToWishlist type="btn" discount={discount}/>
                        </ReserveSectionButtons>
                        <Owner>
                            <p>
                              By <a>{discount.organizer.name}</a>
                            </p>
                            <span>Follow us</span>
                            <button>{discount.organizer.social_media_handle}</button>
                        </Owner>
                    </ReserveSectionContent>
                </ReserveSection>
            </AboutDiscount>
            </AboutDiscountWrapper>

            <AboutOrganiserAndMap>
                <SectionContent>
                    <Map id="mapIframe">
                        {parse(discount.address)}
                    </Map>
                    <AboutOrganiser>
                        <h3>About the Organiser</h3>
                        <p className="organiser_name">{discount.organizer.name}</p>
                        <OrganiserButtons>
                            <ContactButton href={`tel:${discount.organizer.phone_number}`}>Contact</ContactButton>
                            <FollowButton href={discount.organizer.website_url}>Follow</FollowButton>
                        </OrganiserButtons>
                        <OrganiserInfo>
                            <p>{discount.organizer.description}</p>
                            {/* <ReadMoreOrLess onClick={()=>{readMoreOrLessHandler('1')}}>{linkName}</ReadMoreOrLess> */}
                        </OrganiserInfo>
                    </AboutOrganiser>
                </SectionContent>
            </AboutOrganiserAndMap>

            {props.discount_media && props.discount_media.length > 0 &&
            <SectionWrapper>
                <DiscountGalleryTitle>Discount gallery</DiscountGalleryTitle>
                <DiscountGallery>
                    <GallerySection id="gallery">
                        <Gallery photos={props.discount_media} type={null}/>
                    </GallerySection>
                    <LeftButton target="gallery" pos="0"/>
                    <RightButton target="gallery" pos="0"/>
                </DiscountGallery>
            </SectionWrapper>
            }

            {(organizerDiscounts || otherDiscounts) &&
            <SuggestedDiscounts>
                <SectionContent className="more-discounts">
                    <MoreDiscounts>
                        <SuggestedDiscountsTitle>
                            {organizerDiscounts ? (
                            <>
                            <h3>More discounts from Organiser</h3>
                            <span>See more</span>
                            </>
                            ) : (
                            <>
                            <h3>More discounts for you</h3>
                            <span>See more</span>
                            </>
                            )}
                        </SuggestedDiscountsTitle>

                        <MoreDiscountList>
                        {organizerDiscounts ? (
                            organizerDiscounts.map((discount, key) => (
                                <SuggestedDiscountCard key={key} discount={discount}/>
                            ))
                        ) : (
                            otherDiscounts && otherDiscounts.slice(2, 4).map((discount, key) => (
                                <SuggestedDiscountCard key={key} discount={discount}/>
                            ))
                        )
                        }
                        </MoreDiscountList>
                    </MoreDiscounts>

                    <OtherDiscounts>
                        <SuggestedDiscountsTitle>
                            <h3>Other discounts for you</h3>
                            <span>See more</span>
                        </SuggestedDiscountsTitle>

                        <OtherDiscountList>
                        {otherDiscounts &&
                            otherDiscounts.slice(0, 2).map((discount, key) => (
                            <SuggestedDiscountCard key={key} discount={discount}/>
                            ))
                        }
                        </OtherDiscountList>
                    </OtherDiscounts>
                </SectionContent>
            </SuggestedDiscounts>
            }
        </Container>
        ) : (
            <Loading />
            )
        }
    </>
    )
}

const Container = styled.div`
  width: 100%;
  color: rgba(0, 0, 0, 0.6);
  text-align: left;
  background: #fff;
`;

const Wrapper = styled.div`
    display: flex;
    align-items: center;
    font-weight: 600;
    /* border: 1px solid black; */
`;

const DiscountImageWrapper = styled.div`
    width: 100%;
    height: 50vh;
    background: black;
    margin-top: -7px;
    position: relative;
`;

const ImageOverlay = styled.div`
    width: 100%;
    height: 50vh;
    position: absolute;
    z-index: 1;
    top: 0;
    left: 0;
    background: black;
    opacity: 0.556;
`;

const DiscountImage = styled.div`
  width: 100%;
  background-color: #333;
  background-position: center;
  background-size: cover;
  height: inherit;
  background-image: ${props => `url(${props.imgUrl})`};
`;

const ShareDiscount = styled.button`
    position: absolute;
    z-index: 1;
    background-color: transparent;
    top: 84%;
    left: 85%;
    border: none;
    outline: none;
    padding: 10px;
    border-radius: 50%;
    img {
        width: 25px;
        height: 25px;
    }

    &:hover {
    cursor: pointer;
  }
`;

const SectionWrapper = styled.div`
    /* border: 1px solid black; */
`;

const SectionContent = styled.div`
    margin: 0 auto;
    display: flex;
    justify-content: space-between;
    /* border: 1px solid green; */
    @media (max-width: 620px) {
        flex-wrap: wrap;
    }

    @media (min-width: 481px) {
        width: 95%;
    }
    @media (min-width: 621px) {
        width: 95%;
        &.more-discounts {
            flex-wrap: wrap;
        }
    }
    @media (min-width: 769px) {
        width: 80%;
        margin-top: 20px;
    }
`;

const AboutDiscountWrapper = styled(SectionWrapper)``;

const AboutDiscount = styled(SectionContent)`
    margin-top: 40px;
`;

const ExtraDescription = styled.p`
    max-height: 0;
    overflow: hidden;
    transition: max-height 0.2s ease-out;
`;

const DiscountInfo = styled.div`
    color: #36454F;
    padding: 10px;     
    width: 70%;
    /* border: 1px solid red; */
    @media (max-width: 620px) {
        width: 100%;
    }
`;

const Title = styled.h1`
  margin-top: 1px;
  padding-bottom: 2px;
  font-size: 30px;
  border-bottom: 1px solid #36454F;
  @media (max-width: 768px) {
    font-size: 20px; 
    }
    
  @media (max-width: 530px) {
    /* font-size: 15px;  */
    }

  @media (max-width: 420px) {
    /* font-size: 12px;  */
    }
`;

const DateTimeWrapper = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding-top: 5px;
    /* border: 1px solid black; */

  @media (max-width: 768px) {
    flex-wrap: wrap;
    }
`;

const Date = styled.div`
    text-align: left;
    align-items: center;
    /* padding: 5px 0; */
    display: flex;
    align-items: center;
    color: #fa8128;

    p {
        span{
            width: 100px;
        }
        span:first-child{
            text-align: left;
        }
        span:last-child{
            text-align: right;
        }
    }
`;

const Time = styled(Date)``;

const Address = styled.div`
    font-weight: 600;
    /* border: 1px solid black; */
`;

const ReserveSection = styled.div`
    width: 30%;
    /* border: 1px solid yellow; */
    display: flex;
    flex-direction: row-reverse;
    @media (max-width: 620px) {
        width: 100%;
        flex-direction: row;
    }
`;

const ReserveSectionContent = styled.div`
    width: 170px;
    margin-top: 30px;
    /* border: 1px solid green; */
    @media (max-width: 620px) {
        width: 100%;
        margin-top: 0;
    }
`;

const ReserveSectionButtons = styled.div`
    @media (max-width: 620px) {
        width: 100%;
        display: flex;
        align-items: center;
        justify-content: space-between;
    }
`;

const ReserveButton = styled.button`
    display: block;
    width: 150px;
    height: 30px;
    margin: 10px;
    border: none;
    outline: none;
    border-radius: 30px;
`;

const ReserveSpot = styled(ReserveButton)`
    color: white;
    background-color: blue;
`;

const GuestReserve = styled(ReserveButton)`
    border: 1px solid blue;
    color: blue;
    background-color: #fff;
`;

const Owner = styled.div`
  padding: 20px;
  text-align: center;
  background-color: #E5E4E2;
  border-radius: 10px;
  margin: 10px;
  font-size: 12.5px;
  p {
    a {color: black;}
  }
  span {
    display: block;
    margin-top: 10px;
    }
  button {
    width: 80px;
    height: 30px;
    border: none;
    outline: none;
    border-radius: 30px;
    margin-top: 10px;
  }
  @media (max-width: 530px) {
    
  }
`;

const DiscountType = styled.div`
    margin-right: 2px;
`;

const Free = styled.p``;

const Packageed = styled.p``;

const Location = styled.p``;

const Like = styled.p`
  padding: 2px;
  height: 20px;
  display: flex;
  align-items: center;

  img {
    width: 20px;
    height: 20px;
    margin-right: 8px;
    padding: 3px;
    border: none;
    outline: none;
    border-radius: 50%;
    background: #E5E4E2;
    opacity: 0.7;
  }
`;

const Description = styled.div`
    margin: 10px 0;
    font-family: Arial, Helvetica, sans-serif;
    line-height: 1.5;
    @media (max-width: 530px) {
    font-size: 13px;
    padding: 5px 0 5px 0;
  }
`;

const ReadMoreOrLess = styled.button`
    margin: 10px auto;
    font-size: 12px;
    padding: 3px 5px;
    width: fit-content;
    display: flex;
    justify-content: space-around;
    border: 1px solid #A9A9A9;
    outline: none;
    border-radius: 10px;
    text-align: center;
    color: #818589;
    background-color: white;
`;

const AboutOrganiserAndMap = styled(SectionWrapper)`
    margin: 10px 0;
`;

const Map = styled.div`
    width: 60%;
    height: 300px;
    background: #FFF;
    border-radius: 10px;
    margin: 10px 0;
    border: 1px solid #E5E4E2;
    @media (max-width: 620px) {
        width: 100%;
        margin: 5px;
    }
`;

const MapImage = styled.img`
  width: 100%;
  border-radius: 10px;
  background-position: center;
  background-size: cover;
  height: 100%;
`;


const AboutOrganiser = styled.div`
  width: 35%;
  height: fit-content;
  background: #FFF;
  border: 1px solid #E5E4E2;
  border-radius: 10px;
  margin: 10px;
  /* box-shadow: 0 4px 8px 0 rgba(0,0,0,0.2); */
  padding: 10px;
  text-align: center;
  h3 {
    margin-top: 20px;
    margin-bottom: 20px;
    }
  p {
    &.organiser_name {
        color: #fa8128;
        font-weight: 600;
    }
  }
  @media (max-width: 620px) {
    width: 100%;
    }
`;

const OrganiserButtons = styled.div`
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 10px;
    @media (max-width: 620px) {

    }
`;

const ContactButton = styled.a`
    display: inline-block;
    text-decoration: none;
    text-align: center;
    width: 100px;
    padding: 5px 0;
    margin: 10px;
    color: blue;
    background-color: #fff;
    border: 1px solid blue;
    border-radius: 30px;
    outline: none;
    cursor: default;
    &:hover,
    &.active{
        text-decoration: none;
    }
`;

const FollowButton = styled.a`
    display: inline-block;
    text-decoration: none;
    text-align: center;
    width: 100px;
    padding: 5px 0;
    margin: 10px;
    color: white;
    background-color: blue;
    border: none;
    border-radius: 30px;
    outline: none;
    cursor: default;
    &:hover,
    &.active{
        text-decoration: none;
        color: white;
    }
`;

const OrganiserInfo = styled.div`
    margin: 0 15px;
    text-align: left;
    @media (max-width: 530px) {
    font-size: 13px;
  }
`;

const SuggestedDiscounts = styled(SectionWrapper)`
    margin: 10px 0;
    /* border: 1px solid black; */
`;

const MoreDiscounts = styled.div`
    width: 50%;
    /* border: 1px solid blue; */
    @media (max-width: 768px) {
        width: 100%;
        margin: 5px;
    }
`;

const MoreDiscountList = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: space-between;
`;

const OtherDiscounts = styled.div`
    width: 50%;
    /* border: 1px solid red; */
    @media (max-width: 768px) {
        width: 100%;
        margin: 5px;
    }
`;

const OtherDiscountList = styled(MoreDiscountList)``;

const SuggestedDiscountsTitle = styled.div`
  font-size: 16px;
  font-weight: 400;
  padding: 10px 0;
  display: flex;
  align-items: center;
  justify-content: space-between;
  h3 {
    margin: 0 10px;
  }
  span {

  }
  @media (min-width: 769px) {
    & h3 {
        font-size: 16.5px;
    }
  }
  @media (min-width: 1024px) {
    & h3 {
        font-size: 22px;
    }
  }
  @media (max-width: 768px) {
    & h3 {font-size: 16px;};
    padding: 5px 0;
  }
`;

const DiscountGallery = styled.div`
    position: relative;
    margin: 0 10px;
    /* border: 1px solid black; */
    @media (min-width: 481px) {
        width: 95%;
        margin: 0 auto;
    }
    @media (min-width: 769px) {
        width: 80%;
        margin: 0 auto;
        margin-top: 20px;
    }
`;

const DiscountGalleryTitle = styled.h3`
  padding: 0;
  margin: 0;
  @media (min-width: 481px) {
    font-size: 18px;
    width: 95%;
    margin: 0 auto;
  }
  @media (min-width: 769px) {
    width: 80%;
    margin: 0 auto;
  }
  @media (max-width: 480px) {
    font-size: 16px;
    padding: 0 10px;
  } 
`;

const GallerySection = styled.div`
  display: flex;
  padding: 0;
  overflow-x: scroll;
  scroll-snap-type: x mandatory;
  scroll-behavior: smooth;
  padding: 20px 10px;
  /* border: 1px solid red; */

  &::-webkit-scrollbar {
      display: none;
  }
`;


const mapStateToProps = (state) => {
    return {
        user: state.userState.user,
        wishlist: state.discountState.wishlist,
        discounts: state.discountState.discounts,
        discount_media: state.discountState.discount_media,
    }
};
  
const mapDispatchToProps = (dispatch) => ({
    getDiscountMedia: (discount_id) => {dispatch(getDiscountMediaAPI(discount_id))},
});

export default connect(mapStateToProps, mapDispatchToProps)(DiscountDetail);