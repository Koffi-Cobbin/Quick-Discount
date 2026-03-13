import React, { useEffect, useState, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import parse from 'html-react-parser';
import { useParams } from "react-router";
import { Link } from "react-router-dom";
import styled from "styled-components";
import axios from "axios";

import { LeftButton, RightButton} from "../Shared/CarouselControls";
import Loading from "../Shared/Loading";
import Gallery from "../Gallery/Gallery";
import { connect } from "react-redux";
import ReactPlayer from "react-player";
import CustomerReview from "./CustomerReview";
import StarRating from "./StarRating";
import CarouselFlex from "../Shared/CarouselFlex";
import Card from "../Shared/Card";
import { Badge } from "../Shared/Card";

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
    const {
        discounts,
        authToken,
        getDiscounts,
        setUrl,
        getDiscountReviews,
        discount_media,
        getDiscountMedia,
        is_follower,
        user_discount_like,
        isUserFollowing,
        isDiscountLikedByUser
    } = props;

    const followClickLock = useRef(false);
    const likeClickLock = useRef(false);
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

    const linkName = readMore ? 'Read Less':'Read More'

    const navigate = useNavigate();
    const location = useLocation();

    const formatExpiry = (dateStr) => {
        if (!dateStr) return null;
        const d = new Date(dateStr);
        return d.toLocaleDateString("en-GB", { day: "numeric", month: "short" });
    };

    const getOrganizerDiscounts = React.useCallback(() => {
        const newOrganizerDiscounts= discounts.results.filter((discount_item) => {
          return ((discount_item.id !== discount.id) && (discount_item.organizer.id === discount.organizer.id))
        });
        if (newOrganizerDiscounts.length > 0){
            setOrganizerDiscounts(newOrganizerDiscounts);
        } else{
            setOrganizerDiscounts(null);
        }          
      }, [discounts, discount]);

    const getRecomendedDiscounts = React.useCallback(() => {
        const newRecomendedDiscounts= discounts.results.filter((discount_item) => {
          return ((discount_item.id !== discount.id) &&
          (discount_item.categories.some((category) => {
            var categories_list = [];
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
      }, [discounts, discount]);

    const isOverflown = () => {
        let element = document.getElementById("discount-description");
        return setShowReadMore(element.scrollHeight > element.clientHeight || element.scrollWidth > element.clientWidth);
      };

    useEffect(() => {
        const getDiscount = () => { 
            if (!discounts.results){
                getDiscounts();
            }
            else {
                let current_discount = discounts.results.find(obj => obj.id === +discountId);
                console.log("Current Discount", current_discount);
                setDiscount(current_discount);

                if (current_discount && authToken){
                    isUserFollowing(current_discount.organizer.id);
                    isDiscountLikedByUser(current_discount.id)
                }                
                setUrl(location.pathname);
            }
          }; 
        
        if (!discount || (discount && discount.id !== +discountId) || (discount && authToken)){
            getDiscount();            
        };
        }, [discountId, discounts, authToken, discount, location.pathname, getDiscounts, isUserFollowing, isDiscountLikedByUser, setUrl]);

    useEffect(() => {
        getDiscountReviews(discountId);
        console.log("Discount Reviews >>> ");
        }, [discountId, getDiscountReviews]);

    useEffect(() => {
        if (!discount) return; // Wait until discount is resolved

        const mediaIsEmpty = !discount_media || discount_media.length === 0;
        const mediaIsForDifferentDiscount = 
            discount_media?.length > 0 && discount_media[0].discount !== discount.url;

        if (mediaIsEmpty || mediaIsForDifferentDiscount) {
            getDiscountMedia(discountId);
            console.log("Getting Discount Media >>")
        }
    }, [discount_media, discount, getDiscountMedia, discountId]);

    useEffect(() => {
        if ((!organizerDiscounts && discount) || (discount && discount.organizer.id !== organizerDiscounts[0].organizer.id)){
            console.log("Getting Organizer Discounts >>> ");
            getOrganizerDiscounts();
        }  
        }, [discount, organizerDiscounts, getOrganizerDiscounts]);

    useEffect(() => {  
        if (!recomendedDiscounts && discount){
            getRecomendedDiscounts();
            console.log("Getting Recomended Discounts");
        }      
    }, [discount, recomendedDiscounts, getRecomendedDiscounts]);

    useEffect(() => {
        if (is_follower){
            console.log("Is following ", is_follower.user ? true : false);
            setFollowing(is_follower.user ? true : false);
        } else {
            setFollowing(false);
        }
    }, [is_follower]);

    useEffect(() => {
        if (user_discount_like){
            setLiked(true);            
        }
    }, [user_discount_like]);

    const getDiscountURL = () => {
        let url = window.location.href;
        navigator.clipboard.writeText(url);
        alert("Link copied: " + url);
    };

    const readMoreHandler = (id) => {
        setReadMore(!readMore);
        let content = document.getElementById(id);
        if (content.style.maxHeight){
            setTimeout(() => {
                content.style.maxHeight = null;
            }, 10);
        } else {
            setTimeout(() => {
                content.style.maxHeight = content.scrollHeight + "px";
            }, 10);            
        };
    };

    const followOrganizerHandler = () => {
        return new Promise((resolve, reject) => {
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
                        resolve(response.data);
                    }
                })
                .catch(error => {
                    console.log(error);
                    reject(error);
                });
        });
    };

    const unfollowOrganizerHandler = () => {
        return new Promise((resolve, reject) => {
            const searchUrl = `${BASE_URL}/discounts/organizer/followers/delete/${props.is_follower.id}/`;

            axios.delete(searchUrl, {
                    headers: {
                        Authorization: `Bearer ${props.authToken}`,
                    }
                })
                .then(response => {
                    if (response.status === 204) {
                        console.log("Unfollow response ", response.data);
                        props.isFollower(null);
                        resolve(response);
                    }
                })
                .catch(error => {
                    console.log(error);
                    reject(error);
                });
        });
    };

    const handleFollow = async () => {
        if (followClickLock.current) return;
        followClickLock.current = true;

        const previousFollowersCount = discount.organizer.followers;
        const wasFollowing = following;

        if (following) {
            setDiscount({...discount, organizer: {...discount.organizer, followers: Math.max(0, discount.organizer.followers - 1)}});
            try {
                await unfollowOrganizerHandler();
            } catch (error) {
                setDiscount({...discount, organizer: {...discount.organizer, followers: previousFollowersCount}});
                setFollowing(wasFollowing);
            }
        } else if (props.user) {
            setDiscount({...discount, organizer: {...discount.organizer, followers: discount.organizer.followers + 1}});
            try {
                await followOrganizerHandler();
            } catch (error) {
                setDiscount({...discount, organizer: {...discount.organizer, followers: previousFollowersCount}});
                setFollowing(wasFollowing);
            }
        } else {
            followClickLock.current = false;
            navigate(`/login`);
            return;
        }

        followClickLock.current = false;
    };

    const likeDiscount = () => {
        return new Promise((resolve, reject) => {
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
                        props.set_user_discount_like(response.data);
                        console.log("Like response ", response.data);
                        resolve(response.data);
                    }
                })
                .catch(error => {
                    console.log(error);
                    reject(error);
                });
        });
    };

    const unlikeDiscount = () => {
        return new Promise((resolve, reject) => {
            const searchUrl = `${BASE_URL}/discounts/likes/delete/${props.user_discount_like?.id}/`;
            axios.delete(searchUrl, {
                headers: {
                    Authorization: `Bearer ${props.authToken}`,
                }
            })
            .then(response => {
                if (response.status === 204) {
                    console.log("Unlike response ", response.data);
                    setLiked(false);
                    props.set_user_discount_like(null);
                    resolve(response);
                }
            })
            .catch(error => {
                console.log(error);
                reject(error);
            });
        });
    };

    const handleLike = async () => {
        if (likeClickLock.current) return;
        likeClickLock.current = true;

        const previousLikesCount = discount.likes;
        const wasLiked = liked;

        if (!props.user) {
            likeClickLock.current = false;
            navigate(`/login`);
            return;
        }

        if (liked) {
            setDiscount({...discount, likes: Math.max(0, discount.likes - 1)});
            try {
                await unlikeDiscount();
            } catch (error) {
                setDiscount({...discount, likes: previousLikesCount});
                setLiked(wasLiked);
            }
        } else {
            setDiscount({...discount, likes: discount.likes + 1});
            try {
                await likeDiscount();
            } catch (error) {
                setDiscount({...discount, likes: previousLikesCount});
                setLiked(wasLiked);
            }
        }

        likeClickLock.current = false;
    };

    useEffect(() => {
        const handleScroll = (event) => {
            if (discount && discount.video_url){
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
            };
            isOverflown();
        };
    
        window.addEventListener("scroll", handleScroll);
        console.log("Running scroll ...");
    
        return () => {
          window.removeEventListener("scroll", handleScroll);
        };
      }, [discount]);

    return (
        <>
        {discount ? (
        <Container>
            <DiscountImageWrapper>
                <DiscountImage imgUrl={discount.flyer}/>
                <ButtonsContainer>
                    <DiscountBadge >
                        {discount.percentage_discount ? discount.percentage_discount : "Deal"}
                    </DiscountBadge >
                    {discount.end_date && (
                        <ExpiryTag>Ends {formatExpiry(discount.end_date)}</ExpiryTag>
                    )}
                    <ShareDiscount onClick={getDiscountURL}>
                        <img src="/images/icons/share-w.svg" alt=""/> 
                    </ShareDiscount>
                </ButtonsContainer>
            </DiscountImageWrapper>

            <AboutDiscountWrapper>
            <AboutDiscount>
                <DiscountInfo>
                    <Title>
                        <b>{ discount.title} &nbsp;</b>                        
                        <Like $liked={liked} onClick={handleLike}>
                            {/* <svg viewBox="0 0 24 24">
                                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                            </svg> */}
                            <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <g>
                                    <path fill-rule="evenodd" clip-rule="evenodd" d="M15.9977 5.63891C16.2695 4.34931 15.433 3.00969 14.2102 2.59462C13.6171 2.37633 12.9892 2.4252 12.4662 2.60499C11.9449 2.78419 11.4461 3.12142 11.1369 3.58441L11.136 3.58573L7.49506 9.00272C8.05104 9.29585 8.43005 9.87954 8.43005 10.5518V21.3018H6.91003V21.3018H16.6801C18.2938 21.3018 19.2028 20.2977 19.8943 19.202C20.6524 18.0009 21.1453 16.7211 21.5116 15.5812C21.6808 15.0546 21.8252 14.5503 21.9547 14.0984L21.9863 13.9881C22.126 13.5007 22.2457 13.0904 22.366 12.7549C22.698 11.8292 22.5933 10.9072 22.067 10.2072C21.5476 9.5166 20.7005 9.15175 19.76 9.15175H15.76C15.6702 9.15175 15.6017 9.11544 15.5599 9.06803C15.5238 9.02716 15.4831 8.95058 15.502 8.81171L15.9977 5.63891Z"/>
                                    <path d="M2.18005 10.6199C2.18005 10.03 2.62777 9.55176 3.18005 9.55176H6.68005C7.23234 9.55176 7.68005 10.03 7.68005 10.6199V21.3018H3.18005C2.62777 21.3018 2.18005 20.8235 2.18005 20.2336V10.6199Z"/>
                                </g>
                            </svg>
                            <span>{discount.likes}</span>
                        </Like>
                    </Title>

                    <Description>
                        {/* <p>
                            <b>Discount: </b> 
                            <Colored> {discount.percentage_discount} </Colored>            
                        </p> */}
                        {/* <p>
                            <b>Duration: </b> 
                            <Colored> {formatDate(discount.start_date)} </Colored> to        
                            <Colored> {formatDate(discount.start_date)} </Colored>                 
                        </p> */}
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
                        </ContactButtons>
                    </ContactSectionContent>
                </ContactSection>
            </AboutDiscount>
            </AboutDiscountWrapper>

            <AboutOrganiserAndMap>
                <SectionContent>
                    <Map id="mapIframe">
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
                    <GallerySection id="gallery">
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
                        <Card
                            key={key}
                            discount={recomendedDiscount}
                            bgColor="light"
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

  @media (min-width: 768px) {
    width: 70%;
    margin: 0 auto;
  }

  @media only screen and (min-width: 120em) {
    width: 60%;
    margin: 0 auto;
  }

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
`;

const DiscountImageWrapper = styled.div`
    width: 100%;
    height: 50vh;
    margin-top: 70px;
    position: relative;
    @media (max-width: 768px) {
        margin-top: 45px; 
    }
`;

const DiscountImage = styled.div`
  background-color: #333;
  background-position: center;
  background-size: cover;
  height: inherit;
  background-image: ${props => `url(${props.imgUrl})`};
  margin: 0 auto;
  border-radius: 0 0 30px 30px;
`;

const DiscountBadge = styled(Badge)`
    position: static;
    box-shadow: none;
    transform: none;
    font-size: 13px;
    font-weight: 700;
    padding: 10px;

    &:hover {
        transform: none;
    }
`;

const ButtonsContainer = styled.div`
    position: absolute;
    bottom: 10px;
    right: 10px;
    display: flex;
    align-items: center;
    gap: 10px;

    @media (max-width: 380px) {
        flex-wrap: wrap;
        justify-content: flex-end;

        ${DiscountBadge} {
            width: 100%;
            text-align: center;
        }
    }
`;

const ShareDiscount = styled.button`
    background-color: rgba(0, 0, 0, 0.9);
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

const ExpiryTag = styled.div`
    background-color: rgba(0, 0, 0, 0.9);
    border: none;
    outline: none;
    padding: 10px;
    border-radius: 20px;
    color: white;
    font-family: "Courier New", monospace;
    font-size: 10px;
    font-weight: bold;
    letter-spacing: 0.06em;
`;

const SectionWrapper = styled.div``;

const SectionContent = styled.div`
    margin: 0 auto;
    display: flex;
    justify-content: space-between;
    @media (max-width: 620px) {
        flex-wrap: wrap;
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
    @media (max-width: 620px) {
        width: 100%;
    }
`;

const Title = styled.h1`
    margin-top: 1px;
    padding-bottom: 2px;
    font-size: 30px;
    display: flex;
    align-items: baseline;
`;

const Colored = styled.span`
    color: #fa8128;
`;

const ContactSection = styled.div`
    width: 30%;
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
    display: flex;
    flex-direction: column;
    justify-content: center;

    @media (max-width: 620px) {
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

const Like = styled.button`
  padding: 2px;
  height: 25px;
  display: flex;
  align-items: center;
  color: ${props => props.$liked ? '#fa8128' : '#fa8128'};
  font-size: 14px;
  cursor: pointer;
  background: transparent;
  border: none;
  outline: none;

  svg {
    width: 25px;
    height: 25px;
    margin-right: 8px;
    fill: ${props => props.$liked ? '#fa8128' : '#888'};
    // stroke: #fa8128;
    // stroke-width: 2;
    padding: 3px;
    background: #E5E4E2;
    border-radius: 50%;
    opacity: 0.7;
    transition: transform 0.15s ease, fill 0.2s ease;
  }

  &:hover svg {
    transform: scale(1.1);
  }
    
`;

const Description = styled.div`
    margin: 10px 0;
    line-height: 1.75;

    #discount-description{
        max-height: 100px;
        overflow: hidden;
        transition: max-height 0.5s ease-out;
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

const AboutOrganiser = styled.div`
  width: 35%;
  height: fit-content;
  background: #FFF;
  border: 1px solid #E5E4E2;
  border-radius: 10px;
  margin: 10px;
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
`;

const CommentsSection = styled(SectionWrapper)`
    margin: 10px 0;
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
`;

const RecomendedDiscounts = styled.div``;

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
