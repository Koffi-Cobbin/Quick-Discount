import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import parse from 'html-react-parser';
import { useParams } from "react-router";
import { Link } from "react-router-dom";
import styled from "styled-components";
import axios from "axios";

// import CarouselSection from "../Shared/CarouselSection";
import { LeftButton, RightButton} from "../Shared/CarouselControls";
import Loading from "../Shared/Loading";
import Gallery from "../Gallery/Gallery";
import { connect } from "react-redux";
import ReactPlayer from "react-player";
import AddToWishlist from "../Wishlist/AddToWishlist";
import CustomerReview from "./CustomerReview";
import StarRating from "./StarRating";
import CarouselFlex from "../Shared/CarouselFlex";
import DiscountCard from "./DiscountCard";
import { formatDate } from "../../utils/middleware";
import { 
    getDiscountsAPI,
    getDiscountMediaAPI, 
    getDiscountReviewsAPI, 
    isUserFollowerAPI, 
    setUserIsFollower,
    isDiscountLikedByUserAPI,
    setUserDiscountLike,
    setPreviousUrl
} from "../../actions";
import { BASE_URL } from "../../utils/constants";


const DiscountDetail = (props) => {
    let { discountId } = useParams();
    const [discount, setDiscount] = useState();
    const [readMore,setReadMore] = useState(false);
    const [showReadMore,setShowReadMore] = useState(false);
    const [organizerDiscounts, setOrganizerDiscounts] = useState();
    const [recomendedDiscounts, setRecomendedDiscounts] = useState();
    const [showPopup, setShowPopup] = useState(false);
    const [play, setPlay] = useState(false);
    const [following, setFollowing] = useState(false);
    const [liked, setLiked] = useState(false);
    // const [disableLike, setDisableLike] = useState(false);

    const linkName = readMore ? 'Read Less':'Read More'

    const navigate = useNavigate();
    const location = useLocation();

    // Other discounts from organizer: filter all discounts
    const getOrganizerDiscounts = () => {
        const newOrganizerDiscounts= props.discounts.results.filter((discount_item) => {
          return ((discount_item.id !== discount.id) && (discount_item.organizer.id === discount.organizer.id))
        });
        if (newOrganizerDiscounts.length > 0){
            setOrganizerDiscounts(newOrganizerDiscounts);
        } else{
            setOrganizerDiscounts(null);
        }          
      };

    // Other discounts: filter all discounts for discounts sharing same category as this discount
    const getRecomendedDiscounts = () => {
        const newRecomendedDiscounts= props.discounts.results.filter((discount_item) => {
          return ((discount_item.id !== discount.id) &&
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


    //   Check if description is overflowing
    const isOverflown = () => {
        let element = document.getElementById("discount-description");
        return setShowReadMore(element.scrollHeight > element.clientHeight || element.scrollWidth > element.clientWidth);
      };

    
    //   GET DISCOUNT
    useEffect(() => {
        // Get the current discount
        const getDiscount = () => { 
            if (!props.discounts.results){
                props.getDiscounts();
            }
            else {
                let current_discount = props.discounts.results.find(obj => obj.id === +discountId);
                console.log("Current Discount", current_discount);
                setDiscount(current_discount);

                if (current_discount && props.authToken){
                    // Check if user follows organizer of current discount
                    props.isUserFollowing(current_discount.organizer.id);
                    props.isDiscountLikedByUser(current_discount.id)
                }                
                
                // set current url as url to return to when action triggers login
                props.setUrl(location.pathname);
            }
          }; 
        
        if (!discount || (discount && discount.id !== +discountId) || (discount && props.authToken)){
            getDiscount();            
        };
        }, [discountId, props.discounts, props.authToken]);

    
    //   GET DISCOUNT REVIEWS
    useEffect(() => {
        props.getDiscountReviews(discountId);
        console.log("Discount Reviews >>> ");
        }, [discountId]);


    //   GET DISCOUNT MEDIA
    useEffect(() => {
        if (!props.discount_media || (discount && props.discount_media.length > 0 && props.discount_media[0].discount !== discount.url)){
            props.getDiscountMedia(discountId);
            console.log("Getting Discount Media >>")
        };
        }, [props.discount_media]);

    
    //   GET ORGANIZER DISCOUNT 
    useEffect(() => {
        if ((!organizerDiscounts && discount) || (discount && discount.organizer.id !== organizerDiscounts[0].organizer.id)){
            console.log("Getting Organizer Discounts >>> ");
            getOrganizerDiscounts();
        }  
        }, [discount]);


    useEffect(() => {  
        // Get the recomended discounts
        // (discount && recomendedDiscounts && recomendedDiscounts[0].categories.some(category => discount.categories.includes(category)))){
        if (!recomendedDiscounts && discount){
            getRecomendedDiscounts();
            console.log("Getting Recomended Discounts");
        };      
        
    }, [discount]); // 


    // SET FOLLOWING
    useEffect(() => {
        setFollowing(props.is_follower);
        }, [props.is_follower]);

    // SET liked on discount
    useEffect(() => {
        if (props.user_discount_like){
            setLiked(true);
            props.set_user_discount_like(null);
        }
        }, [props.user_discount_like]);

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
            // wait for the transition to finish
            setTimeout(() => {
                // set the max height to the given value
                content.style.maxHeight = null;
            }, 10);
            
        } else {
            // wait for the transition to finish
            setTimeout(() => {
                // set the max height to the given value
                content.style.maxHeight = content.scrollHeight + "px";
            }, 10);            
        };
    };

    // follow organizer
    const followOrganizerHandler = () => {
        const searchUrl = `${BASE_URL}/discounts/organizer/followers/add/`;
        console.log("Bearer ", props.authToken);

        axios.post(searchUrl, {
                organizer_pk: discount.organizer.id
            },
            { headers: {
                'Accept': "application/json", 
                "Content-Type": "application/json",
                'Authorization': `Bearer ${props.authToken}`,
              }
            })
            .then(response => {
                if (response.data) {
                    props.isFollower(response.data);
                    console.log("Follow response ", response.data);
                }
            })
            .catch(error => {
                console.log(error);
                });
        };

    // unfollow organizer
    const unfollowOrganizerHandler = () => {
        const searchUrl = `${BASE_URL}/discounts/organizer/followers/delete/${props.is_follower.id}/`;

        axios.delete(searchUrl, {
                headers: {
                    Authorization: `Bearer ${props.authToken}`,
                }
            })
            .then(response => {
                // if response status is 204
                if (response.status === 204) {
                    console.log("Unfollow response ", response.data);
                    props.isFollower(null);
                    }
                })
            .catch(error => {
                console.log(error);
                });
        };

    // handle follow
    const handleFollow = async () => {
        if (props.is_follower) {
            setDiscount({...discount, organizer: {...discount.organizer, followers: discount.organizer.followers-1}});
            unfollowOrganizerHandler();
            } 
        else if (props.user) {
            setDiscount({...discount, organizer: {...discount.organizer, followers: discount.organizer.followers+1}});
            followOrganizerHandler();            
        } else {
            navigate(`/login`);
        }
    };


    // like discount
    const likeDiscount = () => {
        const searchUrl = `${BASE_URL}/discounts/likes/add/`;
        axios.post(searchUrl, {
                discount_id: discount.id
            },
            { headers: {
                'Accept': "application/json", 
                "Content-Type": "application/json",
                'Authorization': `Bearer ${props.authToken}`,
            }
            })
            .then(response => {
                if (response.data) {
                    setLiked(true);
                    console.log("Like response ", response.data);
                }
            })
            .catch(error => {
                console.log(error);
                });
            };


    // dislike discount (TODO: Exclude this function to allow for only likes)
    const dislikeDiscount = () => {
        const searchUrl = `${BASE_URL}/discounts/likes/delete/${liked.id}/`;
        axios.delete(searchUrl, {
            headers: {
                Authorization: `Bearer ${props.authToken}`,
            }
        })
        .then(response => {
            if (response.status === 204) {
                console.log("Dislike response ", response.data);
                setLiked(false);
                // props.set_user_discount_like(null);
                }
            })
        .catch(error => {
            console.log(error);
            });
        };


    // handle like
    const handleLike = async () => {
        // if (liked) {
        //     setDiscount({...discount, likes: discount.likes-1});
        //     dislikeDiscount();
        //     } 
        if (!liked && props.user) {
            setDiscount({...discount, likes: discount.likes+1});
            likeDiscount();            
        } else {
            navigate(`/login`);
        }
    };


    useEffect(() => {
        const handleScroll = (event) => {
            const videoSection = document.getElementById('video-section');
            const rect = videoSection.getBoundingClientRect();
            const viewHeight = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);
            const inView = rect.top <= viewHeight && rect.bottom >= 0;
            if (inView) {
                setPlay(true);
                } 
            else {
                setPlay(false);
                }
            // Is description overflowing?
            isOverflown();
        };
    
        window.addEventListener("scroll", handleScroll);
        console.log("Running scroll ...");
    
        return () => {
          window.removeEventListener("scroll", handleScroll);
        };
      }, []);

    return (
        <>
        {discount ? (
        <Container>
            <DiscountImageWrapper>
                <DiscountImage imgUrl={discount.flyer}/>
                {/* <ImageOverlay /> */}
                <ShareDiscount onClick={getDiscountURL}>
                    <img src="/images/icons/share-w.svg" alt=""/> 
                </ShareDiscount>
            </DiscountImageWrapper>

            <AboutDiscountWrapper>
            <AboutDiscount>
                <DiscountInfo>
                    <Title>
                        <b>{ discount.title} &nbsp;</b>                        
                        <Like disabled={liked} onClick={handleLike}>
                            <img src="/images/icons/like.svg" alt=""/>
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
                        <div id="discount-description">
                            {parse(discount.description)}   
                        </div>
                        {showReadMore &&
                        <ReadMoreOrLess onClick={()=>{readMoreHandler("discount-description")}}>{linkName}</ReadMoreOrLess>
                        }
                    </Description>
                </DiscountInfo>

                <ContactSection>
                    <SectionTitle className="contact-sec">Contact Us</SectionTitle>
                    <ContactSectionContent>
                        {discount.organizer.social_media_handles &&
                            <ContactButtons className="small">
                                {discount.organizer.social_media_handles.whatsapp &&
                                <ContactButton href={`https://wa.me/${discount.organizer.phone_number}`} target="_blank">
                                    <img src="/images/icons/whatsapp.png" alt="WhatsApp" width="42" height="42"/>
                                </ContactButton>
                                }

                                {discount.organizer.social_media_handles.facebook &&
                                <ContactButton href={discount.organizer.social_media_handles.facebook} target="_blank">
                                    <img src="/images/icons/Facebook.webp" alt="Facebook" width="42" height="42"/>
                                </ContactButton>
                                }

                                {discount.organizer.social_media_handles.instagram &&
                                <ContactButton href={discount.organizer.social_media_handles.instagram} target="_blank">
                                    <img src="/images/icons/Instagram.png" alt="Instagram" width="42" height="42"/>
                                </ContactButton>
                                }

                                {discount.organizer.social_media_handles.twitter &&
                                <ContactButton href={discount.organizer.social_media_handles.twitter} target="_blank">
                                    <img src="/images/icons/twitter.svg" alt="Twitter" width="42" height="42"/>
                                </ContactButton>
                                }
                            </ContactButtons>  
                        }                          

                        <ContactButtons>
                            <PhoneButton 
                                href={`tel:${discount.organizer.phone_number}`} target="__blank"
                                onMouseEnter={()=>setShowPopup(true)}
                                onMouseLeave={()=>setShowPopup(false)}
                                style={{ position: 'relative' }}
                            >
                                <img src="/images/icons/phone-calling-w.svg" alt="website" width="15" height="15"/>
                                <b>Phone</b>
                                {showPopup && (
                                    <PhoneToolTip>
                                        <p>{discount.organizer.phone_number}</p>
                                    </PhoneToolTip>
                                )}
                            </PhoneButton>  

                            <WebLinkButton href={discount.website_url} target="__blank">
                                <img src="/images/icons/globe-v.svg" alt="website" width="14" height="14"/> 
                                <b>Website</b>
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
                    >
                        {/* style={{ backgroundImage: `url("/images/map.png")` }} */}
                        {/* <MapImage src={discount.flyer}/> */}
                        {parse(discount.address)}
                    </Map>
                    <AboutOrganiser>
                        <Wrapper className="about-organizer">
                            <OrganiserProfile>
                                <img src="/images/1.jpg" alt=""/>
                            </OrganiserProfile>
                            <div>
                                <h4>{discount.organizer.name}</h4>
                                <Followers> 
                                    <span>{discount.organizer.followers}</span> &nbsp; 
                                    {discount.organizer.followers === 1 ? 'Follower' : 'Followers'}
                                </Followers>
                            </div>
                        </Wrapper>                        
                        
                        <OrganiserInfo>
                            <p>{discount.organizer.description}</p>
                        </OrganiserInfo>
                        <OrganiserButtons>   
                            {following ?                    
                                <FollowButton onClick={handleFollow}>Unfollow</FollowButton>
                                :
                                <FollowButton onClick={handleFollow}>Follow</FollowButton>
                            }
                        </OrganiserButtons>
                    </AboutOrganiser>
                </SectionContent>
            </AboutOrganiserAndMap>

            {discount.video_url &&
            <SectionWrapper>
                <VideoWrap id="video-section">
                    <ReactPlayer 
                        width={"100%"} 
                        url={discount.video_url} 
                        controls={true}
                        muted={true}
                        volume={0.2}
                        playing={play}/>
                </VideoWrap>
            </SectionWrapper>
            }

            {props.discount_media && props.discount_media.length > 0 &&
            <SectionWrapper>
                <DiscountGalleryTitle>Gallery</DiscountGalleryTitle>
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
                            <Rating>{discount.average_rating }</Rating>
                            <Stars>
                                <StarRating rating={discount.average_rating } showRate={false} />
                                <p>{discount.total_rating } ratings</p>
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
                            <p>All reviews are from people who have redeemed deals with this merchant. 
                                Review requests are sent by email or sms to customers who purchase the deal.
                            </p>
                        </div>
                    </ReviewVerificationInfo>

                    <CommentList>
                        {props.reviews && props.reviews.results.length === 0 ? (
                            <NoComments>There are no reviews yet.</NoComments>
                        ) : (
                        <>
                            {props.reviews && props.reviews.results.slice().reverse().map((review, index) => (
                                <CustomerReview className="customer-review" key={index} index={index} discount={discount} review={review}/>
                            ))} 
                        </> 
                        )}                          
                    </CommentList>    
                </ReviewSectionContent>          
            </CommentsSection>

            {recomendedDiscounts && recomendedDiscounts.length > 0 &&
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

                    <CarouselFlex    
                        divId="recomended"    
                        type="category" 
                        classId="recomendations"                  
                    >
                        {recomendedDiscounts.slice(0, 4).map((recomendedDiscount, key) => (
                        <DiscountCard
                            key={key}
                            discount={recomendedDiscount}
                        />
                        ))}
                    </CarouselFlex>
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
  /* border: 1px solid red; */
  /* font-family: Inter, 'Roboto', sans-serif; */

  @media (min-width: 768px) {
    width: 70%;
    margin: 0 auto;
  }

  /* Largest devices such as desktops (1920px and up) */
  @media only screen and (min-width: 120em) {
    width: 60%;
    margin: 0 auto;
  }

  /* Largest devices such as desktops (1280px and up) */
  @media only screen and (min-width: 160em) {
    width: 50%;
    margin: 0 auto;
  }
`;

const Wrapper = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: 600;
    /* border: 1px solid black; */
    &.about-organizer{
        @media only screen and (min-width: 621px) and (max-width: 1200px) {
            flex-wrap: wrap;
        }
    }
`;


const VideoWrap = styled.div`
    margin-top: 8px;
    width: 100%;
    display: block;
    position: relative;
    background-color: #f9fafb;
    /* border: 1px solid blue; */
`;


const DiscountImageWrapper = styled.div`
    width: 100%;
    height: 50vh;
    /* background: black; */
    /* border: 1px solid black; */
    margin-top: 80px;
    position: relative;
    @media (max-width: 768px) {
        margin-top: 60px; 
    }
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
  /* @media (min-width: 769px) {
        width: 80%;
    } */
`;

const ShareDiscount = styled.button`
    position: absolute;
    z-index: 1;
    background-color: rgba(0, 0, 0, 0.7);
    top: 84%;
    right: 2%;
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

    /* @media (min-width: 481px) {
        width: 95%;
    }

    @media (min-width: 621px) {
        width: 95%;
    }

    @media (min-width: 769px) {
        width: 80%;
        margin-top: 20px;
    } */
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
    width: 80%;
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

  /* @media (max-width: 768px) {
    font-size: 24px; 
    } */
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
    color: #fa8128;
`;

const Time = styled(Date)``;

const Address = styled.div`
    font-weight: 600;
    /* border: 1px solid black; */
`;

const ContactSection = styled.div`
    width: 20%;
    /* border: 1px solid yellow;     */
    /* flex-direction: row-reverse; */
    &>h4{
        text-align: center;
        margin: 30px auto;
        padding: 0;
    }
    @media (max-width: 620px) {
        width: 100%;
        &>h4{
            margin: 0 auto;
        }
    }
`;

const ContactSectionContent = styled.div`
    /* margin-top: 30px; */
    display: flex;
    flex-direction: column;
    justify-content: center;
    /* border: 1px solid black; */

    @media (max-width: 620px) {
        /* width: 100%; */
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

const ContactButton = styled.a`
    display: inline-block;
    text-decoration: none;
    text-align: center;
    margin: 5px;
    color: blue;
    background-color: #fff;
    /* border: 1px solid blue; */
    border-radius: 30px;
    outline: none;
    text-decoration: none;
    &.active{
        text-decoration: none;
    }
`;

const WebLinkButton = styled.a`
    display: flex;
    justify-content: center;
    align-items: center;
    text-decoration: none;
    width: 80%;
    max-width: 150px;
    height: 30px;
    margin: 10px auto;
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
    &:hover,
    &.active{
        text-decoration: none;
        color: #67309b;
    }
`;

const PhoneButton = styled.a`
    display: flex;
    justify-content: center;
    align-items: center;
    width: 80%;
    max-width: 150px;
    height: 30px;
    margin: 10px auto;
    border: none;
    outline: none;
    text-decoration: none;
    border-radius: 30px;
    border: 1px solid #808080;
    color: #fff;
    background-color: #67309b;
    cursor: pointer;

    &>img{
        border: none;
        outline: none;
        margin-right: 5px;
    } 
    &.active,
    &:hover{
        text-decoration: none;
        color: #fff;
    }
`;


const PhoneToolTip = styled.div`
    position: absolute;
    top: -150%;
    left: 50%;
    transform: translateX(-50%);
    background-color: #67309b;
    border: 1px solid #67309b;
    border-radius: 10px;
    padding: 10px;
    z-index: 100;
    p{
        padding: 0;
        margin: 0;
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
`;

const DiscountType = styled.div`
    margin-right: 2px;
`;

const Free = styled.p``;

const Packageed = styled.p``;

const Location = styled.p``;

const Like = styled.button`
  padding: 2px;
  height: 25px;
  display: flex;
  align-items: center;
  color: #fa8128;
  font-size: 14px;
  cursor: pointer;

  img {
    width: 25px;
    height: 25px;
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

    #discount-description{
        max-height: 100px;
        overflow: hidden;
        transition: max-height 0.5s ease-out;
        /* border: 1px solid black; */
    }
    @media (max-width: 530px) {
    font-size: 16px;
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
  @media only screen and (min-width: 621px) and (max-width: 1200px) {
        width: 100%;
    }
`;

const OrganiserButtons = styled.div`
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 10px;
`;


const FollowButton = styled.button`
    display: inline-block;
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
    /* border: 1px solid red; */
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
`;

const DiscountGalleryTitle = styled.h4`
  padding: 10px;
  margin: 0;
  color: #000;
`;

const GallerySection = styled.div`
  display: flex;
  padding: 0;
  overflow-x: scroll;
  scroll-snap-type: x mandatory;
  scroll-behavior: smooth;
  padding: 20px 10px;
  position: relative;
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
        user_discount_like: state.discountState.user_discount_like,
        discount_media: state.discountState.discount_media,
        reviews: state.discountState.reviews,
        is_follower: state.userState.is_follower,
        authToken: state.userState.token ? state.userState.token.access : null
    }
};
  
const mapDispatchToProps = (dispatch) => ({
    getDiscounts: () => {dispatch(getDiscountsAPI())},
    getDiscountMedia: (discount_id) => {dispatch(getDiscountMediaAPI(discount_id))},
    getDiscountReviews: (discount_id) => {dispatch(getDiscountReviewsAPI(discount_id))},
    isUserFollowing: (organizer_id) => {dispatch(isUserFollowerAPI(organizer_id))},
    isFollower: (payload) => {dispatch(setUserIsFollower(payload))},
    isDiscountLikedByUser: (discount_id) => {dispatch(isDiscountLikedByUserAPI(discount_id))},
    setUrl: (url) => dispatch(setPreviousUrl(url)), 
    set_user_discount_like: (payload) => dispatch(setUserDiscountLike(payload)), 
});

export default connect(mapStateToProps, mapDispatchToProps)(DiscountDetail);