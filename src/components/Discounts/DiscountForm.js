import React, {useRef} from "react";
import styled from "styled-components";
import parse from 'html-react-parser';
import { useState, useEffect } from "react";
import { connect } from "react-redux";
import { createId } from "@paralleldrive/cuid2";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import Editor from "./Features/Editor";
import Dropzone from "./Features/Dropzone";
import ImageGrid from "./Features/ImageGrid";
import {
  isContactValid,
  isEmailValid,
  isValidURL,
  handleImageErrors,
} from "../../utils/middleware";
import { 
  getCategoriesAPI, 
  createDiscountAPI,
  updateDiscountAPI,
  setCreateDiscountStatus,
  getDiscountMediaAPI, 
  getDiscountPackagesAPI,
  deleteDiscountMediaAPI,
  deleteDiscountPackageAPI,
} from "../../actions";
import { packageOptionsData } from "../Assets/data";
import Payment from "../Payment/Payment";
// import CreateDiscountSuccess from "./CreateDiscountSuccess";
// import CreateDiscountFailed from "./CreateDiscountFailed";


const DiscountForm = (props) => {
  const [discountTitle, setDiscountName] = useState("");
  const [discountDescription, setDiscountDescription] = useState("");
  const [organizerName, setOrganizerName] = useState(props.organizer ? props.organizer.name : "");
  const [organizerDescription, setOrganizerDescription] = useState(props.organizer ? props.organizer.description : "");
  const [email, setEmail] = useState(props.organizer ? props.organizer.email : "");
  const [phoneNumber, setPhoneNumber] = useState(props.organizer ? props.organizer.phone_number : "");
  const [discountCategories, setDiscountCategories] = useState();
  const [percentageDiscount, setPercentageDiscount] = useState("");
  const [location, setLocation] = useState("");
  const [address, setAddress] = useState("");
  const [startDate, setStartDate] = useState(new Date().toISOString().slice(0, 10));
  // set defalt endDate to startDate plus 24hrs
  const [endDate, setEndDate] = useState(new Date(new Date().getTime() + 24 * 60 * 60 * 1000).toISOString().slice(0, 10));
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [discountFlyer, setDiscountFlyer] = useState();
  const [readDiscountFlyer, setReadDiscountFlyer] = useState("");
  const [discountImages, setDiscountImages] = useState([]);
  const [readDiscountImages, setReadDiscountImages] = useState([]);
  const [socialMediaHandles, setSocialMediaHandles] = useState(props.organizer ? props.organizer.social_media_handles : {whatsapp: " ", facebook: " ", instagram: " ", twitter: " "});
  const [videoURL, setVideoURL] = useState("");
  const [websiteURL, setWebsiteUrl] = useState("");
  const [agreement, setAgreement] = useState("");

  const [allCategories, setAllCategories] = useState(); // Categories from API
  const [enableSubmit, setEnableSubmit] = useState(false);
  const [filename, setFilename] = useState("");
  const [discountPackages, setDiscountPackages] = useState();
  const [packageOption, setPackageOption] = useState();
  const [next, setNext] = useState(false);
  const [prev, setPrev] = useState(false);
  
  // ERRORS
  const [emailError, setEmailError] = useState("");
  const [contactError, setContactError] = useState("");
  const [imageError, setImageError] = useState({ flyer: "", images: "" });
  const [videoURLError, setVideoURLError] = useState("");
  const [websiteURLError, setWebsiteURLError] = useState("");
  // social media handles url errors
  const [socialMediaHandlesURLError, setSocialMediaHandlesURLError] = useState(
    {whatsappError: "", facebookError: "", instagramError: "", twitterError: ""}
  );

  // const priceInputRef = useRef(null);

  // const package_options = ["daily", "weekly", "monthly"];

  const navigate = useNavigate();

  const scrollUp = () => {
    const element = document.getElementById("top");
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleNext = () => {
    setNext(!next);
    if (prev){
      setPrev(!prev);
    }
    scrollUp();
  };

  const handlePrev = () => {
    setPrev(!prev);
    if (next){
      setNext(!next);
    }
    scrollUp();
  };

  const validateEmail = (value) => {
    setEmail(value);
    let emailRes = isEmailValid(value);
    setEmailError(emailRes[1] ? emailRes[1] : "");
  };

  const validateContact = (value) => {
    setPhoneNumber(value);
    let contactRes = isContactValid(value);
    setContactError(contactRes[1] ? contactRes[1] : "");
  };

  const validateUrl = (key, value) => {
    let urlRes = isValidURL(value);
    if (key === "website") {
      setWebsiteUrl(value);
      setWebsiteURLError(urlRes ? "" : "Invalid url");
      } 
    else if (key === "video") {
      setVideoURL(value);
      setVideoURLError(urlRes ? "" : "Invalid url");
      } 

  };

  const doesDiscountNameExist = (value) => {
    console.log("Checking if discount name already exists", value);
  };

  const socialMediaChangeHandler = (key, social_media_url) => {
    const updatedSocialMediaHandles = {...socialMediaHandles};
    console.log("updatedSocialMediaHandles... ", updatedSocialMediaHandles);
    const updatedSocialMediaHandlesURLError = {...socialMediaHandlesURLError};
    console.log("updatedSocialMediaHandlesURLError... ", updatedSocialMediaHandlesURLError);
    
    if (social_media_url.length === 0){
      updatedSocialMediaHandlesURLError[`${key}Error`] = "";
      updatedSocialMediaHandles[key] = " ";
    }
    else {
      updatedSocialMediaHandles[key] = social_media_url;
      let urlRes = isValidURL(social_media_url);
      updatedSocialMediaHandlesURLError[`${key}Error`] = urlRes ? "" : "Invalid url";
    }
    setSocialMediaHandles(updatedSocialMediaHandles);
    setSocialMediaHandlesURLError(updatedSocialMediaHandlesURLError);
  };


  // Function to get flyer image
  const getFlyer = async () => {
    let blob = await fetch(props.discount.flyer).then(r => r.blob());
    console.log("Blob ", blob);

    const reader = new FileReader();
    reader.readAsDataURL(blob);
    reader.onload = () => {
      setReadDiscountFlyer(reader.result);
    };
  };

  // UseEffect to set form entries 
  useEffect(() => {
    if (props.categories) {
      setAllCategories(props.categories.results);
    } else {
      props.getCategories();
    };

    // Get Discount Packages
    if (props.discount_packages) {
      setDiscountPackages(props.discount_packages.results);
      setPackageOption({...props.discount_packages.results[0], quantity:1});
    } else {
      props.getDiscountPackages();
    };

    if (props.discount && !discountFlyer){
      setDiscountName(props.discount.name);
      setDiscountDescription(props.discount.description);
      setOrganizerName(props.discount.organizer.name);
      setOrganizerDescription(props.discount.organizer.description);
      setEmail(props.discount.organizer.email);
      setPhoneNumber(props.discount.organizer.phone_number);
      setDiscountCategories(props.discount.categories);
      setPercentageDiscount(props.discount.percentage_discount);
      setLocation(props.discount.location);
      setAddress(props.discount.address);
      setStartDate(props.discount.start_date);
      setEndDate(props.discount.end_date);
      setStartTime(props.discount.start_time);
      setEndTime(props.discount.end_time);
      setSocialMediaHandles(props.discount.organizer.social_media_handles);
      setWebsiteUrl(props.discount.website_url);
      setPackageOption(props.discount_packages.results[0]);
      setDiscountFlyer(props.discount.flyer);
      setAgreement(props.discount.agreement);

      let flyerURL = props.discount.flyer;
      let flyerURLArr = flyerURL.split('/');
      console.log(flyerURLArr[flyerURLArr.length - 1]);
      setFilename(flyerURLArr[flyerURLArr.length - 1]);

      getFlyer();
    };
  
    // Get the discount media
    if ((!props.discount_media && props.discount) || (props.discount && props.discount_media[0].discount != props.discount.url)){
      props.getDiscountMedia(props.discount.id);
      console.log("Leeeeee Mail")
    };  

    // Discount media
    if (props.discount_media && !discountImages && !readDiscountImages){
      let acceptedFiles = props.discount_media;
      setDiscountImages((prevState) => [
        ...acceptedFiles,
      ]);

      setReadDiscountImages((prevState) => [
        ...acceptedFiles,
      ]);
    };

    // Package options
    // if (packageOptionsData){
    //   const updatedOption = {...packageOptionsData.results[0]};
    //   updatedOption.quantity = 1;
    //   setPackageOption(updatedOption);  
    // };

  }, [props.categories, props.discount, props.discount_media, props.discount_packages]);


  const onDrop = (acceptedFiles, rejectedFiles) => {
    setImageError({ ...imageError, images: "" });

    if (discountImages.length >= 3) {
      setImageError({ ...imageError, images: "Too many files" });
    } else {
      console.log("Accepted files", acceptedFiles);
      console.log("Discount images", discountImages);
      console.log("Read discount images", readDiscountImages);
      // Add acceptedfiles to setDiscountImages
      acceptedFiles.map((file) => {
        const reader = new FileReader();
        const imgId = createId();

        setDiscountImages((prevState) => [
          ...prevState,
          { id: `image-${imgId}`, file: file },
        ]);

        reader.onload = function (e) {
          setReadDiscountImages((prevState) => [
            // setReadDiscountImages
            ...prevState,
            { id: `image-${imgId}`, media_url: e.target.result },
          ]);
        };
        reader.readAsDataURL(file);
        return file;
      });
    }
    console.log("Rejected files ", rejectedFiles);
    if (rejectedFiles.length > 0) {
      let errorMessage = handleImageErrors(rejectedFiles[0].errors[0].code);
      setImageError({ ...imageError, images: errorMessage });
    }
  };

  const popImage = (imageId) => {
    setDiscountImages(
      discountImages.filter((img) => {
        return img.id != imageId;
      })
    );
    setReadDiscountImages(
      discountImages.filter((img) => {
        return img.id != imageId;
      })
    );
    let img = discountImages.find((image) => image.id === imageId);
    if (img.url){
      props.deleteDiscountMedia(imageId);
    }
  };
  // (prevState) => [...prevState]

  const flyerImageHandler = (acceptedFiles, rejectedFiles) => {
    const singleImagePreview = (file) => {
      // let thumbnailElement = document.getElementById("dropzone-image-preview");
      // Show thumbnail for image files
      if (file && file.type.startsWith("image/")) {
        setFilename(mediaFile.name);
        setDiscountFlyer(file);

        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => {
          // thumbnailElement.style.backgroundImage = `url('${reader.result}')`;
          setReadDiscountFlyer(reader.result);
        };
      } else {
        let errorMessage = handleImageErrors(rejectedFiles[0].errors[0].code);
        setImageError({ ...imageError, flyer: errorMessage });
      }
    };

    setImageError({ ...imageError, flyer: "" });
    let mediaFile = acceptedFiles[0];
    singleImagePreview(mediaFile);
  };


  const editorTextChangeHandler = (value) => {
    setDiscountDescription(value !== "<p><br></p>" ? value : "");
  };


  const handleOptionChange = (package_type) => {
    let updatedDiscountPackage = discountPackages.filter((option) => option.type === package_type)[0];
    updatedDiscountPackage.quantity = 1;
    setPackageOption(updatedDiscountPackage);
  };

  const handleQuantityChange = (quantity) => {
    const updatedOption = {...packageOption};
    updatedOption.quantity = parseInt(quantity);
    setPackageOption(updatedOption);     
  };

  const updateIframeDimensions = (googleMap) => {
    // Create a new DOMParser
    const parser = new DOMParser();

    // Parse the HTML string
    const parsedHTML = parser.parseFromString(googleMap, 'text/html');

    // Access the parsed element
    const mapIframe = parsedHTML.querySelector('iframe');
    
    if (mapIframe){
      // Update the width and height attributes
      mapIframe.width = "100%"; // Set the new width
      mapIframe.height = "100%"; // Set the new height
      
      const mapString = mapIframe.outerHTML;
      console.log("MAP ", mapString);
      return mapString;
    }
    else{
      return googleMap;
    }
  };

  const handlePostDiscount = () => {
    // e.preventDefault();

    // if (e.target !== e.currentTarget) {
    //   return;
    // }

    const payload = {
      discount_data: {
        title: discountTitle,
        description: discountDescription,      
        package_type: packageOption.type,
        percentage_discount: percentageDiscount,
        start_date: startDate,
        end_date: endDate,
        start_time: startTime,
        end_time: endTime,
        categories: discountCategories,
        video_url: videoURL,
        website_url: websiteURL,
        agreement: agreement,
        location: location,
        address: updateIframeDimensions(address),             
      },
      organizer_data: {
        name: organizerName,
        description: organizerDescription,
        email: email,
        phone_number: phoneNumber,
        social_media_handles: socialMediaHandles,
      },
      package_data: {
        type: packageOption.type,
        quantity: packageOption.quantity,
        // total_amount: packageOption.price * packageOption.quantity 
      }
    };

    console.log("Payload... ", payload);

    const files = {
      flyer: discountFlyer,
      images: discountImages,
    };

    const formData = new FormData();
    formData.append("payload", JSON.stringify(payload));
    formData.append("flyer", files.flyer);
    formData.append("images_length", files.images.length);

    if (props.discount){
      for (var i = 0; i < files.images.length; i++) {
        if (files.images[i].file){
          formData.append(`image-${i}`, files.images[i].file);
        }
        else{
          formData.append(`image-${i}`, JSON.stringify(files.images[i]));
        }
      };
      let discount_id = props.discount.id;
      props.updateDiscount({formData, discount_id});
    }
    else{
      for (var i = 0; i < files.images.length; i++) {
        formData.append(`image-${i}`, files.images[i].file);
      };
      props.postDiscount(formData);
      // { payload, files }
    };    
  };

  useEffect(() => {
    const isAllEntriesFilled = async () => {
      if (
        discountTitle &&
        discountDescription &&
        percentageDiscount &&
        organizerName &&
        organizerDescription &&
        email &&
        phoneNumber &&
        discountCategories &&
        packageOption &&
        location &&
        // address &&
        startDate &&
        endDate &&
        discountFlyer &&
        socialMediaHandles &&
        agreement
      ) {
        setEnableSubmit(true);
        console.log("FILLED!");
      } else {
        setEnableSubmit(false);
      }
    };
    isAllEntriesFilled();
  }, [
    discountTitle,
    discountDescription,
    percentageDiscount,
    organizerName,
    organizerDescription,
    email,
    phoneNumber,
    discountCategories,
    location,
    address,
    startDate,
    endDate,
    startTime,
    endTime,
    discountFlyer,
    discountImages,
    socialMediaHandles,
    agreement,
    websiteURL,
  ]);

  const reset = () => {
    setDiscountName("");
    setPercentageDiscount("");
    setEmail("");
    setPhoneNumber("");
    setWebsiteUrl("");
    setOrganizerName("");
    setOrganizerDescription("");
    setStartDate("");
    setEndDate("");
    setStartTime("");
    setEndTime("");
    setLocation("");
    setSocialMediaHandles([]);
    setEnableSubmit(false);
    setEmailError("");
    setDiscountCategories([]);
    setDiscountFlyer();
    setDiscountImages([]);
    setAgreement("");
    setAddress("");
  };

  const openTermsPage = () => {
    window.open('/terms', '_blank');
  };


  return (
    <>
      {/* {(props.createDiscountStatus || props.createDiscountStatus===false) ? (
      <>
      { props.createDiscountStatus ? (
          <CreateDiscountSuccess />
        ) : (
          <CreateDiscountFailed />
        )
      }
      </>
    ) : ( */}
      <Container>
        <Content>
          <Header>
            {!props.discount ? 
            <h2>Create Discount Ad</h2> :
            <h2>Update Discount Ad</h2>
            }
            
          </Header>

          <Slides class="slides">
            {!next && 
            <Slide>
              <FormContent>
                <FormInputs>
                  <label>Discount Title</label>
                  <input
                    type="text"
                    value={discountTitle}
                    onChange={(e) => setDiscountName(e.target.value)}
                    onBlur={(e)=>doesDiscountNameExist(e.target.value)}
                    required
                  />
                </FormInputs>

                {/* <Editor description={discountDescription} handleTextEditorChange={editorTextChangeHandler} /> */}

                <FormInputs>
                  <label>Description</label>
                  <textarea 
                      id="w3review" 
                      name="w3review" 
                      rows="4" 
                      cols="30"
                      value={discountDescription}
                      onChange={(e) => setDiscountDescription(e.target.value)} 
                      required="required" 
                  >
                      {discountDescription}
                  </textarea>
                </FormInputs>

                <FormInputs>
                  <label>Percentage Discount</label>
                  <input
                    type="text"
                    value={percentageDiscount}
                    onChange={(e) => setPercentageDiscount(e.target.value)}
                    required
                  />
                </FormInputs>
              </FormContent>
          

              <FormContent>
                <FormInputs>
                  {!props.organizer && (
                    <>
                      <label>Name of Organiser</label>
                      <input
                        type="text"
                        value={organizerName}
                        onChange={(e) => setOrganizerName(e.target.value)}
                        required
                      />

                      <label for="about-organizer">About the Organizer</label>
                      <textarea
                        id="about-organizer"
                        name="about-organizer"
                        value={organizerDescription}
                        onChange={(e) =>
                          setOrganizerDescription(e.target.value)
                        }
                        required
                      ></textarea>

                      <label>Email</label>
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => validateEmail(e.target.value)}
                        required
                      />
                      {emailError && <p className="error">{emailError}</p>}

                      <label>Phone Number</label>
                      <input
                        type="tel"
                        value={phoneNumber}
                        onChange={(e) => validateContact(e.target.value)}
                        required
                      />
                      {contactError && <p className="error">{contactError}</p>}
                    </>
                  )}

                  <label for="categories">Category </label>
                  <br />
                  <select
                    id="categories"
                    name="categories"
                    onChange={(e) =>
                      setDiscountCategories(
                        Array.from(
                          e.target.selectedOptions,
                          (option) => option.value
                        )
                      )
                    }
                    multiple
                    size={5}
                    required
                  >
                    {allCategories && allCategories.map((category) => (
                      <option key={`cat-${category.id}`} value={category.pk}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                  {/* handleCategoriesChange */}
                </FormInputs>
              </FormContent>
           
              <FormContent>
                <FormInputs>
                  <label for="location">Location </label>
                  <input
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                  />
                </FormInputs>
              </FormContent>

              <FormContent>
                <FormInputs>
                  <label>Google Location &nbsp;</label>
                  <label>
                    <Link to="/help/location" target="_blank">
                      Click here to learn how to add location.
                    </Link>
                  </label>
                  <input
                    type="text"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                  />
                </FormInputs>
              </FormContent>               

              <FormContent>
                <AssetsArea>
                  <div>
                    <label>Upload Discount Flyer</label>
                    <Dropzone
                      onDrop={flyerImageHandler}
                      accept={"image/*"}
                      minSizeBytes={1}
                      maxSizeBytes={1000000}
                      maxFiles={1}
                      preview={true}
                      filename={filename}
                      bgImage={readDiscountFlyer}
                      error={imageError.flyer && imageError.flyer}
                    />
                  </div>
                  <div>
                    <label>Upload Discount Images</label>
                    <Dropzone
                      onDrop={onDrop}
                      accept={"image/*"}
                      minSizeBytes={1}
                      maxSizeBytes={1000000}
                      maxFiles={3}
                      error={imageError.images && imageError.images}
                    />
                  </div>
                </AssetsArea>

                <FormInputs>
                  <div>
                    <label>Discount Ad video link</label>
                    <input
                      type="text"
                      value={videoURL}
                      placeholder="https://www.youtube.com"
                      onChange={(e) => validateUrl("video", e.target.value)}
                    />
                    {videoURLError && <p className="error">{videoURLError}</p>}
                  </div>
                </FormInputs>
              </FormContent>
              {readDiscountImages && readDiscountImages.length > 0 && (
                <ImageGrid images={readDiscountImages} popImage={popImage} />
              )}

           
              <FormContent>
              {props.organizer &&
                <>
                <label style={{textAlign: "left", color: "rgba(0, 0, 0, 0.6)"}}>Social Media Links</label>
                <FormInputs>
                  {socialMediaHandles && (
                    <>
                    {socialMediaHandles.instagram &&
                    <>
                      <InputsFlexWrap>
                        <div>
                          <input
                            type="text"
                            value="instagram"
                            readOnly
                          />
                        </div>

                        <div>
                          <input
                            type="text"
                            value={socialMediaHandles.instagram}
                            onChange={(e) => socialMediaChangeHandler("instagram", e.target.value)}
                            required
                          />
                        </div>  
                      </InputsFlexWrap>
                      {socialMediaHandlesURLError.instagramError && <p className="error">{socialMediaHandlesURLError.instagramError}</p>}
                      </>}                      

                    {socialMediaHandles.facebook &&
                    <>
                      <InputsFlexWrap>
                        <div>
                          <input
                            type="text"
                            value="facebook"
                            readOnly
                          />
                        </div>

                        <div>
                          <input
                            type="text"
                            value={socialMediaHandles.facebook}
                            onChange={(e) => socialMediaChangeHandler("facebook", e.target.value)}
                            required
                          />
                        </div>
                      </InputsFlexWrap>
                      {socialMediaHandlesURLError.facebookError && <p className="error">{socialMediaHandlesURLError.facebookError}</p>}
                      </>}

                      {socialMediaHandles.whatsapp &&
                      <>
                      <InputsFlexWrap>
                        <div>
                          <input
                            type="text"
                            value="whatsapp"
                            readOnly
                          />
                        </div>

                        <div>
                          <input
                            type="text"
                            value={socialMediaHandles.whatsapp}
                            onChange={(e) => socialMediaChangeHandler("whatsapp", e.target.value)}
                            required
                          />
                        </div>
                      </InputsFlexWrap>
                      {socialMediaHandlesURLError.whatsappError && <p className="error">{socialMediaHandlesURLError.whatsappError}</p>}
                      </>}

                      {socialMediaHandles.twitter &&
                      <>
                      <InputsFlexWrap>
                        <div>
                          <input
                            type="text"
                            value="twitter"
                            readOnly
                          />
                        </div>

                        <div>
                          <input
                            type="text"
                            value={socialMediaHandles.twitter}
                            onChange={(e) => socialMediaChangeHandler("twitter", e.target.value)}
                            required
                          />
                        </div>
                      </InputsFlexWrap>
                      {socialMediaHandlesURLError.twitterError && <p className="error">{socialMediaHandlesURLError.twitterError}</p>}
                      </>}
                    </>
                  )}
                </FormInputs>
                </>}

                <FormInputs>
                  <div>
                    <label>Website link</label>
                    <input
                      type="text"
                      value={websiteURL}
                      placeholder="https://www.xyz.com"
                      onChange={(e) => validateUrl("website", e.target.value)}
                    />
                    {websiteURLError && <p className="error">{websiteURLError}</p>}
                  </div>
                </FormInputs>
              </FormContent>

              {!props.discount &&
              <Agreement>
                <span>Discount Creation Agreement</span>
                <div>
                  <input
                    type="radio"
                    id="agreement"
                    name="agreement"
                    value="agreed"
                    onChange={(e) => setAgreement(e.target.value)}
                  />
                  <label for="agreement" className="radio-label">
                    I agree to the &nbsp;
                    <a href="/terms" target="_blank" rel="noopener noreferrer">
                      Terms and Conditions
                    </a>
                  </label>
                </div>
              </Agreement>
              }

              <SubmitSection>
                <SubmitButton
                  onClick={handleNext}
                >
                  Next
                </SubmitButton>
              </SubmitSection>
            </Slide>
            }

            {next && !prev &&
            <Slide>
              {/* Payment section */}
              <FormContent>
                <FormInputs>
                  <PackagesFlexWrap className="add-package-section">
                    <div className="package-section">
                      {packageOption &&
                        <PackagesInputsFlexWrap>
                          <div>
                            <label htmlFor="package-type" id="packageType">Package type</label>
                            
                            <select
                              id="package-type"
                              name="package-type"
                              onChange={(e) =>
                                handleOptionChange(e.target.value)
                              }
                            >
                              {discountPackages && discountPackages.map((discount_package) => (
                                <option key={`pac-${discount_package.id}`} value={discount_package.type}>
                                  {discount_package.type}
                                </option>
                              ))}
                            </select>
                          </div>
                          <div>
                            <label>Price</label>
                            <input
                              type="number"
                              name="package-price"
                              value={parseFloat(packageOption.price)*(packageOption.quantity ? packageOption.quantity : 1)}
                              readOnly="True"
                            />
                          </div>
                          <div>
                            <label>Quantity</label>
                            <input
                              type="number"
                              name="package-quantity"
                              placeholder="1"
                              min={1}
                              value={packageOption.quantity}
                              onChange={(e) =>
                                handleQuantityChange(e.target.value)
                              }
                            />
                          </div>
                        </PackagesInputsFlexWrap>
                      }                        
                    </div>
                  </PackagesFlexWrap>
                  <label>
                    <Link to="/help/package-types" target="_blank">
                      Learn more about discount package types.
                    </Link>
                  </label>
                </FormInputs>             
              </FormContent>

              <FormContent>
                <FormInputs>
                  <InputsFlexWrap>
                    <div>
                      <label>Start Date</label>
                      <input
                        type="date"
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                        required
                      />
                    </div>
                    <div>
                      <label>End Date</label>
                      <input
                        type="date"
                        value={endDate}
                        onChange={(e) => setEndDate(e.target.value)}
                        required
                      />
                    </div>
                  </InputsFlexWrap>
                </FormInputs>
              </FormContent>

              {/* Payment Section  */}
              <Payment 
                amount={packageOption.price*packageOption.quantity} 
                package_type={packageOption.type}
                enableSubmit={enableSubmit}
                handlePostDiscount={handlePostDiscount}/>

              <SubmitSection>
                <SubmitButton
                  onClick={handlePrev}
                >
                  Previous
                </SubmitButton>

                {/* <SubmitButton
                  disabled={!enableSubmit}
                  onClick={(discount) => handlePostDiscount(discount)}
                >
                  Submit
                </SubmitButton> */}
              </SubmitSection>
            </Slide>
            }
          </Slides>

          
        </Content>
      </Container>
      {/* )} */}
    </>
  );
};

const Container = styled.div`
  margin-bottom: 20px;
  font-family: Lato, 'Roboto', sans-serif;
  font-size: 20px;
`;

const FlexWrap = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const InputsFlexWrap = styled(FlexWrap)`
  /* border: 1px solid black; */
  & div {
    width: 48%;
    /* border: 1px solid blue; */
    @media (max-width: 480px) {
      width: 100%;
    }
  }
  @media (max-width: 480px) {
    flex-direction: column;
  }
`;

const PackagesFlexWrap = styled(FlexWrap)`  
  & div.package-section {
    /* border: 1px solid blue; */
  }
  &.add-package-section {
    align-items: flex-end;
    /* border: 1px solid black; */
  }
  @media (max-width: 480px) {
    flex-direction: column;
    & div.package-section {
      width: 100%;
    }
  }
`;

const PackagesInputsFlexWrap = styled(FlexWrap)`
  /* border: 1px solid black; */
  & div {
    width: 30%;
    & #packageType{
      white-space: nowrap;
    }
    /* border: 1px solid blue; */
    @media (max-width: 480px) {
      width: 100%;
    }
  }
  @media (max-width: 480px) {
    flex-direction: column;
  }
`;

const Content = styled.div`
  width: 100%;
  max-width: 552px;
  background-color: white;
  margin: 0 auto;
`;

const Header = styled.div`
  padding: 16px 20px;
  border-bottom: 1px solid rgba(0, 0, 0, 0.15);
  /* font-size: 16px; */
  line-height: 1.5;
  color: #fa8128; /* dodgerblue rgba(0, 0, 0, 0.6); */
  /* font-weight: 400; */
  @media (max-width: 480px) {
    padding: 0;
    /* border: 1px solid black; */
    & h2 {
      padding: 0;
      margin: 0;
      /* font-size: larger; */
    }
  }
`;

const FormContent = styled.form`
  display: flex;
  flex-direction: column;
  vertical-align: baseline;
  background: transparent;
  padding: 8px 12px;
`;

const SubmitSection = styled.div`
  padding: 12px 24px 12px 16px;
  border-top: 1px solid rgba(0, 0, 0, 0.15);
`;

const AssetButton = styled.button`
  display: flex;
  align-items: center;
  height: 40px;
  min-width: auto;
  color: rgba(0, 0, 0, 0.5);
`;


const SubmitButton = styled.button`
  min-width: 100px;
  padding: 8px 20px;
  margin: 0px 10px;
  background: ${(props) => (props.disabled ? "rgba(0, 0, 0, 0.5)" : "#0a66c2")};
  border-radius: 20px;
  color: white;
  &:hover {
    background: ${(props) =>
      props.disabled ? "rgba(0, 0, 0, 0.25)" : "#004182"};
  }
`;

const UploadImage = styled.div`
  text-align: center;
  p {
    margin-top: 5px;
    label {
      border: 1px solid blue;
      padding: 3px;
      /* font-size: 13px; */
    }
  }
  img {
    width: 100%;
  }
`;

const UploadVideo = styled.div`
  input {
    width: 100%;
    height: 35px;
    /* font-size: 16px; */
    margin-bottom: 20px;
  }
`;

const FormInputs = styled.div`
  label {
    float: left;
    color: rgba(0, 0, 0, 0.6);
    /* font-size: 15px; */
    margin-bottom: 2px;
  }
  input,
  select {
    width: 100%;
    height: 45px;
    /* font-size: 16px; */
    border: 1px solid #e5e4e2;
    padding: 0 12px;
    margin-bottom: 20px;
  }
  select#categories {
    height: fit-content;
  }
  textarea {
    width: 100%;
    /* font-size: 16px; */
    border: 1px solid #e5e4e2;
    padding: 0 12px;
    min-height: 100px;
    resize: none;
    margin-bottom: 20px;
  }
  button {
    width: 100%;
    height: 45px;
    /* font-size: 16px; */
    background-color: blue;
    color: #fff;
    border: 1px solid #e5e4e2;
    outline: none;
    padding: 0 12px;
    margin-bottom: 20px;
  }
  p.error {
    color: red;
    margin-top: -15px;
    margin-bottom: 20px;
  }
`;

const RadioInputs = styled.div`
  margin-bottom: 20px;
  & span.radio-title {
    /* font-size: 15px; */
    /* font-weight: 600; */
    color: rgba(0, 0, 0, 0.6);
    text-align: left;
    display: block;
    width: 100%;
    margin-bottom: 5px;
  }
  & label.radio-label {
    float: none;
    color: rgba(0, 0, 0, 0.6);
    /* font-size: 15px; */
  }
`;

const RadioWrap = styled.div`
  display: flex;
  padding: 0 5px;
  border: 1px solid rgba(0, 0, 0, 0.15);
  & div {
    width: 50%;
    height: 45px;
    display: flex;
    align-items: center;

    & input[type="radio"] {
      width: 20px;
      height: 20px;
      margin-top: -3px;
      margin-right: 5px;
    }
  }
`;

const Slides = styled.div`
  background: white;
`;

const Slide = styled.div`
  display: ${(props) => props.display};
`;

const AssetsArea = styled.div`
  & div {
    & label {
      width: 100%;
      text-align: left;
      color: rgba(0, 0, 0, 0.6);
    }
  }
`;

const Agreement = styled.div`
  padding: 8px 12px;
  margin-bottom: 20px;
  & span {
    display: block;
    text-align: left;
    padding: 5px 0;
    /* font-size: 15px; */
    /* font-weight: 600; */
    color: #fa8128;
  }
  & div {
    display: flex;
    align-items: flex-start;
    & input {
      margin-right: 10px;
    }
    & label {
      text-align: left;
    }
  }
`;

const mapStateToProps = (state) => {
  return {
    user: state.userState.user,
    categories: state.discountState.categories,
    createDiscountStatus: state.discountState.createDiscountStatus,
    organizer: state.organizerState.organizer,
    discounts: state.organizerState.discounts,
    discount_packages: state.discountState.discount_packages,
    discount_media: state.discountState.discount_media,
  };
};

const mapDispatchToProps = (dispatch) => ({
  postDiscount: (formData) => dispatch(createDiscountAPI(formData)),
  updateDiscount: ({formData, discount_id}) => dispatch(updateDiscountAPI({formData, discount_id})),
  getCategories: () => dispatch(getCategoriesAPI()),
  resetCreateDiscountStatus: () => dispatch(setCreateDiscountStatus(null)),
  getDiscountPackages: () => {dispatch(getDiscountPackagesAPI())},
  getDiscountMedia: (discount_id) => {dispatch(getDiscountMediaAPI(discount_id))},
  deleteDiscountPackage: (package_id) => {dispatch(deleteDiscountPackageAPI(package_id))},
  deleteDiscountMedia: (media_id) => {dispatch(deleteDiscountMediaAPI(media_id))},
});

export default connect(mapStateToProps, mapDispatchToProps)(DiscountForm);
