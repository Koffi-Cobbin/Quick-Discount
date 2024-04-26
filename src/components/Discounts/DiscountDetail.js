import React, { useEffect, useState } from "react";
import parse from 'html-react-parser';
import { useParams } from "react-router";
import { Link } from "react-router-dom";
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
import CustomerReview from "./CustomerReview";
import StarRating from "./StarRating";
import CarouselSection from "../Shared/CarouselSection";
import CarouselFlex from "../Shared/CarouselFlex";
import DiscountCard from "./DiscountCard";
import { formatDate, formatTime } from "../../utils/middleware";
import { getDiscountMediaAPI, getDiscountReviewsAPI } from "../../actions";


const DiscountDetail = (props) => {
    let { discountId } = useParams();
    const [discount, setDiscount] = useState();
    const [readMore,setReadMore] = useState(false);
    const [packagesIsShown, setPackagesIsShown] = useState(false);
    const [organizerDiscounts, setOrganizerDiscounts] = useState();
    const [recomendedDiscounts, setRecomendedDiscounts] = useState();

    const linkName = readMore ? 'Read Less':'Read More'

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
    const getRecomendedDiscounts = () => {
        const newRecomendedDiscounts= props.discounts.results.filter((discount_item) => {
          return ((discount_item.id != discount.id) &&
          (discount_item.categories.some((category) => {
            // Create an empty Set to store unique values
            var categories_list = [];

            // Loop through each sub-list in A and add its elements to the resultSet
            discount.categories.forEach((category) => {
                categories_list.push(category.name);
                });

            return categories_list.includes(category.name);
            })
        ))});
        if (newRecomendedDiscounts.length > 0){
            setRecomendedDiscounts(newRecomendedDiscounts);
        } else{
            setRecomendedDiscounts(null);
        }        
      };

    useEffect(() => {
        // Get the current discount
        const getDiscount = () => { 
            let discount = props.discounts.results.find(obj => obj.id === +discountId);
            console.log("Current Discount", discount);
            setDiscount(discount);
          }; 
        
        if (!discount || (discount && discount.id !== +discountId)){
            getDiscount();
        };

        // Get the discount media
        if (!props.discount_media || (discount && props.discount_media.length > 0 && props.discount_media[0].discount != discount.url)){
            props.getDiscountMedia(discountId);
            console.log("Peeeeee Mail")
        };

        // Get the discount reviews
        if (!props.reviews || (discount && props.reviews.length > 0 && props.reviews[0].discount != discount.url)){
            props.getDiscountReviews(discountId);
            console.log("Discount Reviews >>> ");
        };

        // Get organizer discounts
        if ((!organizerDiscounts && discount) || (discount && discount.organizer.id != organizerDiscounts[0].organizer.id)){
            getOrganizerDiscounts();
        }        

        // Get the recomended discounts
        if ((!recomendedDiscounts && discount) || 
        (discount && recomendedDiscounts && recomendedDiscounts[0].categories.some(category => discount.categories.includes(category)))){
            getRecomendedDiscounts();
            console.log("Recomended Discounts XXX");
        };
        
    }, [discountId, recomendedDiscounts, discount, props.discount_media, props.reviews]);

    const contactButtonHandler = () => {
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

    const discountCardStyles = {
        card: { margin: "0 auto", width: "80%" },
        bgImage: { height: "110px" },
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
        <>
        {discount ? (
        <Container>
            {packagesIsShown && <AvailablePackages discount={discount} onClose={hidePackagesHandler} /> }
            <DiscountImageWrapper>
                <DiscountImage imgUrl={discount.flyer}/>
                {/* <ImageOverlay /> */}
                <ShareDiscount onClick={getDiscountURL}>
                    <img src="/images/icons/share-w.svg" /> 
                </ShareDiscount>
            </DiscountImageWrapper>

            <AboutDiscountWrapper>
            <AboutDiscount>
                <DiscountInfo>
                    <Title>
                        { discount.title} &nbsp;
                        <Like>
                            <img src="/images/icons/like.svg" />
                            <span>{discount.likes}</span>
                        </Like>
                    </Title>

                    <Description>
                        <p>
                            <b>Discount: </b> 
                            <Colored> {discount.percentage_discount} </Colored>            
                        </p>
                        <p>
                            <b>Duration: </b> 
                            <Colored> {formatDate(discount.start_date)} </Colored> to        
                            <Colored> {formatDate(discount.start_date)} </Colored>                 
                        </p>
                        <p>
                            <b>Location: </b> 
                            <Colored> { discount.location } </Colored>                           
                        </p>
                        {parse(discount.description)}                        
                        <ReadMoreOrLess onClick={()=>{readMoreHandler("discount-description")}}>{linkName}</ReadMoreOrLess>
                    </Description>
                </DiscountInfo>

                <ContactSection>
                    <ContactSectionContent>
                        <SectionTitle className="contact-sec">Contact Us</SectionTitle>
                        <ContactButtons className="small">
                            <ContactButton onClick={contactButtonHandler}>
                                <img src="/images/icons/whatsapp.png" alt="WhatsApp" width="42" height="42"/>
                            </ContactButton>
                            <ContactButton onClick={contactButtonHandler}>
                                <img src="/images/icons/Facebook.webp" alt="Facebook" width="42" height="42"/>
                            </ContactButton>
                            <ContactButton onClick={contactButtonHandler}>
                                <img src="/images/icons/Instagram.png" alt="Instagram" width="42" height="42"/>
                            </ContactButton>
                        </ContactButtons>                            

                        <ContactButtons>
                            <PhoneButton>
                                <img src="/images/icons/phone-calling-w.svg" alt="website" width="15" height="15"/>
                                <a href={`tel:${discount.organizer.phone_number}`} target="__blank"><b>Phone</b></a>
                            </PhoneButton>  

                            <WebLinkButton>
                                <img src="/images/icons/globe-v.svg" alt="website" width="14" height="14"/>
                                <a href="#" target="__blank"><b>Website</b></a>
                            </WebLinkButton>

                            {/* <AddToWishlist type="btn" discount={discount}/> */}
                        </ContactButtons>
                    </ContactSectionContent>
                </ContactSection>
            </AboutDiscount>
            </AboutDiscountWrapper>

            <AboutOrganiserAndMap>
                <SectionContent>
                    <Map 
                    id="mapIframe"
                    style={{ backgroundImage: `url(${discount.flyer})` }}
                    >
                        {/* <MapImage src={discount.flyer}/> */}
                        {/* {parse(discount.location)} */}
                    </Map>
                    <AboutOrganiser>
                        <Wrapper>
                            <OrganiserProfile>
                                <img src="/images/1.jpg"/>
                            </OrganiserProfile>
                            <div>
                                <h4>{discount.organizer.name}</h4>
                                <Followers>
                                    <span>1.2K</span> &nbsp;Followers
                                </Followers>
                            </div>
                        </Wrapper>                        
                        
                        <OrganiserInfo>
                            <p>{discount.organizer.description}</p>
                        </OrganiserInfo>
                        <OrganiserButtons>                            
                            <FollowButton href={discount.organizer.website_url}>Follow</FollowButton>
                        </OrganiserButtons>
                    </AboutOrganiser>
                </SectionContent>
            </AboutOrganiserAndMap>

            {props.discount_media && props.discount_media.length > 0 &&
            <SectionWrapper>
                <DiscountGalleryTitle>Discount Gallery</DiscountGalleryTitle>
                <DiscountGallery>
                    <GallerySection id="galery">
                        <Gallery photos={props.discount_media} type={null} />
                    </GallerySection>
                    <LeftButton target="gallery" pos="0" />
                    <RightButton target="gallery" pos="0" /> 
                </DiscountGallery>
            </SectionWrapper>
            }

            <CommentsSection>
                <ReviewSectionContent>
                    <SectionTitle>Customer Reviews</SectionTitle>
                    <ReviewSectionHeader>
                        <Left>
                            <Rating>{discount.rate}</Rating>
                            <Stars>
                                <StarRating rating={discount.rate} showRate={false} />
                                <p>1,430 Groupon Ratings</p>
                            </Stars>
                        </Left>
                        <Right>
                            <label for="reviews-sort">Sort by &nbsp;</label>
                            <select name="languages" id="reviews-sort">
                                <option value="javascript">Highest Rated</option>
                                <option value="php">Least Rated</option>
                            </select>
                        </Right>
                    </ReviewSectionHeader>

                    <ReviewVerificationInfo>
                        <div><img src="/images/icons/checked-tick.svg" alt="WhatsApp" width="42" height="42"/></div>
                        
                        <div className="verified-badge">
                            <p><b>100% Verified Reviews</b></p>
                            <p>All Groupon reviews are from people who have redeemed deals with this merchant. 
                                Review requests are sent by email or sms to customers who purchase the deal.
                            </p>
                        </div>
                    </ReviewVerificationInfo>

                    <CommentList>
                        {props.reviews && props.reviews.length === 0 ? (
                            <NoComments>There are no reviews yet.</NoComments>
                        ) : (
                            <></> 
                        )} 

                        {props.reviews && props.reviews.results.slice().reverse().map((review, index) => (
                            <CustomerReview className="customer-review" key={index} index={index} discount={discount} review={review}/>
                        ))}  
                    </CommentList>    
                </ReviewSectionContent>          
            </CommentsSection>

            {recomendedDiscounts &&
            <SuggestedDiscounts>
                <RecomendedDiscounts
                    key="recomended-section"
                    id="recomended-section"
                    index="recomended-section"
                    className="category-section"
                >
                    <SuggestedDiscountsTitle>
                        <h4>Recomended deals</h4>
                        <h4>
                            <Link to={`/discounts`}>
                            See more
                            </Link>
                        </h4>
                    </SuggestedDiscountsTitle>

                    {recomendedDiscounts && (
                    <CarouselFlex    
                        divId="recomended"    
                        type="category" 
                        classId="recomendations"                  
                    >
                        {recomendedDiscounts.slice(0, 2).map((discount, key) => (
                        <DiscountCard
                            key={key}
                            discount={discount}
                            discountCardStyles={discountCardStyles}
                        />
                        ))}
                    </CarouselFlex>
                    )}
                </RecomendedDiscounts>
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
  font-family: Inter, 'Roboto', sans-serif;
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
    /* background: black; */
    margin-top: 80px; /* -7 */
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
  /* width: 80%; */
  background-color: #333;
  background-position: center;
  background-size: cover;
  height: inherit;
  background-image: ${props => `url(${props.imgUrl})`};
  margin: 0 auto;
  border-radius: 0 0 30px 30px;
  @media (min-width: 769px) {
        width: 80%;
    }
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
    }

    @media (min-width: 769px) {
        width: 80%;
        margin-top: 20px;
    }
`;

const ReviewSectionContent = styled(SectionContent)`
    margin: 0 auto;
    display: block;
    @media (max-width: 620px) {
        flex-wrap: no-wrap;
        padding: 10px;
    };
`;

const AboutDiscountWrapper = styled(SectionWrapper)``;

const AboutDiscount = styled(SectionContent)`
    margin-top: 40px;
`;

const ReviewSectionHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  @media (max-width: 620px) {
        flex-wrap: wrap;
    };
`;

const Left = styled.div`
    display: flex;
    align-items: center;
    width: 30%;
    @media (max-width: 620px) {
        width: 100%;
    }
`;

const Right = styled.div`
    &>select{
        border-radius: 5px;
        border: 1px solid #808080;
        padding: 7px;
    }
    @media (max-width: 620px) {
        width: 100%;
    }
`;

const Rating = styled.div`
    font-size: 45px;
    font-weight: 600;
    margin: 0;
    padding: 0;
    margin-right: 10px;
`;

const Stars = styled.div``;

const ReviewVerificationInfo = styled.div`
  display: flex;
  align-items: center;
  background: #e0e0e0;
  border-radius: 5px;
  padding: 7px;
  margin: 5px 0;
  &>div.verified-badge{
    margin-left: 5px;
  }
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
    /* border-bottom: 1px solid #36454F; */
    display: flex;
    align-items: baseline;
    /* justify-content: space-between; */

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

const Colored = styled.span`
    /* text-align: left; */
    /* align-items: center; */
    /* padding: 5px 0; */
    /* display: flex;
    align-items: center; */
    color: #fa8128;

    /* p {
        span{
            width: 100px;
        }
        span:first-child{
            text-align: left;
        }
        span:last-child{
            text-align: right;
        }
    } */
`;

const Time = styled(Date)``;

const Address = styled.div`
    font-weight: 600;
    /* border: 1px solid black; */
`;

const ContactSection = styled.div`
    width: 30%;
    /* border: 1px solid yellow; */
    display: flex;
    flex-direction: row-reverse;
    @media (max-width: 620px) {
        width: 100%;
        flex-direction: row;
    }
`;

const ContactSectionContent = styled.div`
    width: 170px;
    margin-top: 30px;
    &>h4{
        text-align: center;
        // margin: 0;
        padding: 0;
    }
    @media (max-width: 620px) {
        width: 100%;
        margin-top: 0;
    }
`;

const ContactButtons = styled.div`
    &.small{
        width: fit-content;
        margin: 0 auto;
    }
    @media (max-width: 620px) {
        display: flex;
        align-items: center; 
        justify-content: space-between;
    }
`;

const ContactButton = styled.button`
    display: inline-block;
    text-decoration: none;
    text-align: center;
    margin: 5px;
    color: blue;
    background-color: #fff;
    /* border: 1px solid blue; */
    border-radius: 30px;
    outline: none;
    cursor: default;
`;

const WebLinkButton = styled.button`
    display: inline-block;
    width: 150px;
    height: 30px;
    margin: 10px;
    border: none;
    outline: none;
    border-radius: 30px;
    border: 1px solid #67309b;
    color: #67309b;
    background-color: #fff;
    &>img{
        border: none;
        outline: none;
        margin-right: 5px;
    }
    &>a{
        color: #67309b;
        text-decoration: none;
    }
`;

const PhoneButton = styled.button`
    display: inline-block;
    width: 150px;
    height: 30px;
    margin: 10px;
    border: none;
    outline: none;
    border-radius: 30px;
    border: 1px solid #808080;
    color: #fff;
    background-color: #67309b;
    cursor: default;

    &>img{
        border: none;
        outline: none;
        margin-right: 5px;
    }
    &>a{
        color: #fff;
        text-decoration: none;
    }    
    &:hover,
    &.active{
        text-decoration: none;
    }
`;

const Followers = styled(ContactButton)` 
    display: inline-block;
    width: 150px;
    height: 30px;
    margin: 10px;
    border: none;
    outline: none;
    border-radius: 30px;
    border: 1px solid #fa8128;
    color:#fa8128;
    font-weight: 600;
    cursor: default;
`;

const GuestReserve = styled(ContactButton)`
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
  color: #fa8128;
  font-size: 14px;

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
    line-height: 1.75;
    @media (max-width: 530px) {
    font-size: 13px;
    padding: 5px 0 5px 0;
  }
`;

const ReadMoreOrLess = styled.button`
    margin: 10px auto;
    font-size: 12px;
    padding: 3px 8px;
    width: fit-content;
    display: flex;
    justify-content: space-around;
    border: 1px solid #A9A9A9;
    outline: none;
    border-radius: 15px;
    text-align: center;
    color: #818589;
`;


const AboutOrganiserAndMap = styled(SectionWrapper)`
    margin: 10px 0;
    padding: 30px 0;
    background: #FCFBF4;    
    // background: #e0e0e0;
`;

const Map = styled.div`
    width: 60%;
    height: 300px;
    background: #FFF;
    border-radius: 10px;
    margin: 10px 0;
    border: 1px solid #E5E4E2;
    background-position: center;
    background-size: cover;
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
  h4 {
    margin-top: 20px;
    margin-bottom: 20px;
    color: #000;
    }
  @media (max-width: 620px) {
    width: 100%;
    }
`;

const OrganiserProfile = styled.div`
  width: 35%;
  &>img{
    width: 100px;
    height: 100px;
    border-radius: 50%;
    border: 2px solid #E5E4E2;
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


const FollowButton = styled.a`
    display: inline-block;
    text-decoration: none;
    text-align: center;
    width: 100px;
    padding: 5px 0;
    margin: 10px;
    color: white;
    background-color: #67309b;
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
    /* text-align: left; */
    @media (max-width: 530px) {
    font-size: 13px;
  }
`;

const CommentsSection = styled(SectionWrapper)`
    margin: 10px 0;
    /* border: 1px solid black; */
`;

const SectionTitle = styled.h4`
    margin: 10px 0;
    padding: 30px 0;
    color: #000;
    @media (max-width: 620px) {
        margin: 0;
    }
    &.contact-sec{
        @media (max-width: 620px) {
            margin: 10px 0 20px;
        }
    }
`;

const CommentList = styled.div`
    & > div.customer-review{
        background: ${(props) => (props.index % 2 === 0 ? "#e0e0e0" : "#fff")};
    }
`;

const NoComments = styled.p`
`;

const SuggestedDiscounts = styled(SectionWrapper)`
    margin: 0;
    /* border: 1px solid black; */
`;

const RecomendedDiscounts = styled.div`
    width: 80%;
    margin: 0 auto;
    /* border: 1px solid red; */
    @media (max-width: 768px) {
        width: 100%;
    }
`;


const SuggestedDiscountsTitle = styled.div`
  color: #fa8128;
  display: flex;
  align-items: center;
  justify-content: space-between;
  h4 {
    padding: 5px;
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
    margin: 0 auto;
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
        /* margin-top: 20px; */
    }
`;

const DiscountGalleryTitle = styled.h3`
  padding: 10px 0;
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
        reviews: state.discountState.reviews
    }
};
  
const mapDispatchToProps = (dispatch) => ({
    getDiscountMedia: (discount_id) => {dispatch(getDiscountMediaAPI(discount_id))},
    getDiscountReviews: (discount_id) => {dispatch(getDiscountReviewsAPI(discount_id))},
});

export default connect(mapStateToProps, mapDispatchToProps)(DiscountDetail);