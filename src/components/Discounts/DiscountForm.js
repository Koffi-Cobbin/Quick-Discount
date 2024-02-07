import React from "react";
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
  setDiscountPackages,
} from "../../actions"
// import CreateDiscountSuccess from "./CreateDiscountSuccess";
// import CreateDiscountFailed from "./CreateDiscountFailed";


const DiscountForm = (props) => {
  const [discountName, setDiscountName] = useState("");
  const [discountDescription, setDiscountDescription] = useState("");
  const [organizerName, setOrganizerName] = useState(props.organizer ? props.organizer.name : "");
  const [organizerDescription, setOrganizerDescription] = useState(props.organizer ? props.organizer.description : "");
  const [email, setEmail] = useState(props.organizer ? props.organizer.email : "");
  const [phoneNumber, setPhoneNumber] = useState(props.organizer ? props.organizer.phone_number : "");
  const [discountCategories, setDiscountCategories] = useState();
  const [discountType, setDiscountType] = useState("");
  const [location, setLocation] = useState("");
  const [address, setAddress] = useState("");
  const [occurrence, setOccurrence] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [discountFlyer, setDiscountFlyer] = useState();
  const [readDiscountFlyer, setReadDiscountFlyer] = useState("");
  const [discountImages, setDiscountImages] = useState([]);
  const [readDiscountImages, setReadDiscountImages] = useState([]);
  const [socialMedia, setSocialMedia] = useState(props.organizer ? props.organizer.social_media_handle : "");
  const [websiteURL, setWebsiteUrl] = useState("");
  const [agreement, setAgreement] = useState("");

  const [slotType, setSlotType] = useState("");
  const [slotNumber, setSlotNumber] = useState();

  const [allCategories, setAllCategories] = useState(); // Categories from API
  const [enableSubmit, setEnableSubmit] = useState(false);
  const [filename, setFilename] = useState("");
  const [packageOptions, setPackageOptions] = useState([
    { price: null, package_type: "daily", quantity: 1 },
  ]);
  
  // ERRORS
  const [emailError, setEmailError] = useState("");
  const [contactError, setContactError] = useState("");
  const [imageError, setImageError] = useState({ flyer: "", images: "" });
  const [urlError, setUrlError] = useState("");

  const package_options = ["daily", "weekly", "monthly", "delete"];

  const navigate = useNavigate();

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

  const validateUrl = (value) => {
    setWebsiteUrl(value);
    let urlRes = isValidURL(value);
    setUrlError(urlRes ? "" : "Invalid url");
  };

  const doesDiscountNameExist = (value) => {
    console.log("Checking if discount name already exists", value);
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

    // Get the discount packages
    if (props.discount && !discountFlyer){
      if (!props.discount_packages || (props.discount_packages.length>0 && props.discount_packages[0].discount != props.discount.url)){
        props.getDiscountPackages(props.discount.id);
      };

      setDiscountName(props.discount.name);
      setDiscountDescription(props.discount.description);
      setOrganizerName(props.discount.organizer.name);
      setOrganizerDescription(props.discount.organizer.description);
      setEmail(props.discount.organizer.email);
      setPhoneNumber(props.discount.organizer.phone_number);
      setDiscountCategories(props.discount.categories);
      setDiscountType(props.discount.discount_type);
      setSlotNumber(1);
      setLocation(props.discount.location);
      setAddress(props.discount.address);
      setOccurrence(props.discount.occurrence);
      setStartDate(props.discount.start_date);
      setEndDate(props.discount.end_date);
      setStartTime(props.discount.start_time);
      setEndTime(props.discount.end_time);
      setSocialMedia(props.discount.organizer.social_media_handle);
      setWebsiteUrl(props.discount.website_url);
      setPackageOptions(props.discount_packages);
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

  const radioInputHandler = (id) => {
    let elem = document.getElementById(id);

    if (elem.checked) {
      if (id === "paid-discount" || id === "free-discount") {
        setDiscountType(elem.value);
      }
      if (id === "limited-slots" || id === "unlimited-slots") {
        setSlotType(elem.value);
      }
      if (id === "once" || id === "recuring") {
        setOccurrence(elem.value);
      }
      if (id === "agreement") {
        setAgreement(elem.value);
      }
    }
  };

  const editorTextChangeHandler = (value) => {
    setDiscountDescription(value !== "<p><br></p>" ? value : "");
  };

  const handleAddButton = () => {
    const newOptions = [...packageOptions];
    const lastOption = newOptions[newOptions.length - 1];
    console.log("Last option, ",lastOption);
    if (lastOption && (!lastOption.price || lastOption.quantity < 1)) {
      return; // Skip adding if the last package_type is incomplete
    }
    let selected_options = packageOptions.map((elem) => elem.package_type);
    let remaining_options = package_options
      .slice(0, 4)
      .filter((elem) => !selected_options.includes(elem));
    if (remaining_options.length > 0) {
      setPackageOptions([
        ...newOptions,
        { package_type: remaining_options[0], price: null, quantity: 1 },
      ]);
    } else {
      alert("All packages have been added");
    }
  };

  const handleOptionChange = (index, package_type) => {
    if (packageOptions.some((obj) => obj.package_type === package_type)) {
      return; // Skip adding a package_type if the package_type exists
    }
    if (package_type === "delete") {
      let discount_package = packageOptions[index];
      // Check if discount_package has been sold
      // If sold, don't Delete discount_package from db if it exists
      if (discount_package.url && discount_package.sold_packages === 0){
        const updatedOptions = packageOptions.slice();
        updatedOptions.splice(index, 1);
        setPackageOptions(updatedOptions);

        props.deleteDiscountPackage(discount_package.id);
        console.log("Package deleted!");
        let updatedDiscountPackages = props.discount_packages.filter((elem) => elem.url !== discount_package.url);
        props.updateDiscountPackages(updatedDiscountPackages);
      }
      if (!discount_package.url){
        const updatedOptions = packageOptions.slice();
        updatedOptions.splice(index, 1);
        setPackageOptions(updatedOptions);
      }
    } else {
      const updatedOptions = [...packageOptions];
      updatedOptions[index].package_type = package_type;
      setPackageOptions(updatedOptions);
    }
  };

  const handlePriceChange = (index, price) => {
    const updatedOptions = [...packageOptions];
    updatedOptions[index].price = price;
    setPackageOptions(updatedOptions);
  };

  const handleQuantityChange = (index, quantity) => {
    const updatedOptions = [...packageOptions];
    updatedOptions[index].quantity = quantity;
    setPackageOptions(updatedOptions);
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

  const handlePostDiscount = (e) => {
    e.preventDefault();

    if (e.target !== e.currentTarget) {
      return;
    }

    const filteredPackageOptions = packageOptions.filter(
      (discount_package) =>
        discount_package.price !== null && discount_package.price > 0 && discount_package.quantity >= 1
    );

    console.log("Filtered packages ", filteredPackageOptions);

    const payload = {
      discount_data: {
        name: discountName,
        description: discountDescription,
        discount_type: discountType,
        slot_type: slotType,
        slot_number: slotNumber,
        start_date: startDate,
        end_date: endDate,
        start_time: startTime,
        end_time: endTime,
        categories: discountCategories,
        occurrence: occurrence,
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
        social_media_handle: socialMedia,
      },
      packages_data: filteredPackageOptions,
    };

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
        discountName &&
        discountDescription &&
        organizerName &&
        organizerDescription &&
        email &&
        phoneNumber &&
        discountCategories &&
        discountType &&
        location &&
        address &&
        occurrence &&
        startDate &&
        endDate &&
        startTime &&
        endTime &&
        discountFlyer &&
        socialMedia &&
        agreement
      ) {
        setEnableSubmit(true);
      } else {
        setEnableSubmit(false);
      }
    };
    isAllEntriesFilled();
    // console.log(location);
  }, [
    discountName,
    discountDescription,
    organizerName,
    organizerDescription,
    email,
    phoneNumber,
    discountCategories,
    discountType,
    location,
    address,
    occurrence,
    startDate,
    endDate,
    startTime,
    endTime,
    discountFlyer,
    discountImages,
    socialMedia,
    agreement,
    websiteURL,
  ]);

  const reset = () => {
    setDiscountName("");
    setEmail("");
    setPhoneNumber("");
    setWebsiteUrl("");
    setOrganizerName("");
    setOrganizerDescription("");
    setDiscountType("");
    setOccurrence("");
    setStartDate("");
    setEndDate("");
    setStartTime("");
    setEndTime("");
    setLocation("");
    setSocialMedia("");
    setEnableSubmit(false);
    setEmailError("");
    setDiscountCategories([]);
    setDiscountFlyer();
    setDiscountImages([]);
    setAgreement("");
    setAddress("");
    setSlotType("");
    setSlotNumber(0);
    setPackageOptions([{ price: null, package_type: "daily", quantity: 1 }]);
  };

  useEffect(() => {
    if (props.createDiscountStatus) {
      // reset();
      // Instead of reset, redirect to dashboard & clear createDiscountStatus
      props.resetCreateDiscountStatus();
      navigate("/dashboard");
    }
  }, [props.createDiscountStatus]);

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
            <Slide>
              <FormContent>
                <FormInputs>
                  <label>Discount Title</label>
                  <input
                    type="text"
                    value={discountName}
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
              </FormContent>
            </Slide>

            <Slide>
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
            </Slide>

            <Slide>
              <FormContent>
                {/* <RadioInputs>
                  <span className="radio-title">Discount Type</span>
                  <RadioWrap>
                    <div>
                      <input
                        type="radio"
                        id="paid-discount"
                        name="discount-type"
                        value="paid"
                        onChange={() => radioInputHandler("paid-discount")}
                        checked={discountType === "paid"}
                      />
                      <label for="discount-type" className="radio-label">
                        Paid
                      </label>
                    </div>
                    <div>
                      <input
                        type="radio"
                        id="free-discount"
                        name="discount-type"
                        value="free"
                        onChange={() => radioInputHandler("free-discount")}
                        checked={discountType === "free"}
                      />
                      <label for="discount-type" className="radio-label">
                        Free
                      </label>
                    </div>
                  </RadioWrap>
                </RadioInputs> */}

                <FormInputs>
                  <PackagesFlexWrap className="add-package-section">
                    <div className="package-section">
                      {packageOptions && packageOptions.map((option, index) => (
                        <PackagesInputsFlexWrap key={index}>
                          <div>
                            <label htmlFor="package-type">Package type &nbsp;</label>
                            
                            <select
                              id="package-type"
                              name="package-type"
                              value={option.package_type}
                              onChange={(e) =>
                                handleOptionChange(index, e.target.value)
                              }
                            >
                              <option value="daily">daily</option>
                              <option value="weekly">weekly</option>
                              <option value="monthly">monthly</option>
                              <option value="delete">delete</option>
                            </select>
                          </div>
                          <div>
                            <label>Price</label>
                            <input
                              type="number"
                              name="package-price"
                              step="0.01"
                              placeholder="0.00"
                              value={option.price}
                              readOnly="True"
                              onChange={(e) =>
                                handlePriceChange(index, e.target.value)
                              }
                            />
                          </div>
                          <div>
                            <label>Quantity</label>
                            <input
                              type="number"
                              name="package-quantity"
                              placeholder="0"
                              value={option.quantity}
                              onChange={(e) =>
                                handleQuantityChange(index, e.target.value)
                              }
                            />
                          </div>
                        </PackagesInputsFlexWrap>
                      ))}                        
                    </div>

                    <div>
                      <button type="button" onClick={handleAddButton}>
                        Add
                      </button>
                    </div>
                  </PackagesFlexWrap>
                  <label>
                    <Link to="/help/package-types" target="_blank">
                      Learn more about discount package types.
                    </Link>
                  </label>
                </FormInputs>
             
              </FormContent>
            </Slide>

            <Slide>
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
            </Slide>

            <Slide>
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
            </Slide>

            <Slide>
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
                  {/* <div>
                    <label>Upload Discount Images</label>
                    <Dropzone
                      onDrop={onDrop}
                      accept={"image/*"}
                      minSizeBytes={1}
                      maxSizeBytes={1000000}
                      maxFiles={3}
                      error={imageError.images && imageError.images}
                    />
                  </div> */}
                </AssetsArea>
              </FormContent>
              {readDiscountImages && readDiscountImages.length > 0 && (
                <ImageGrid images={readDiscountImages} popImage={popImage} />
              )}
            </Slide>

            <Slide>
              <FormContent>
                <FormInputs>
                  <InputsFlexWrap>
                  {!props.organizer && (
                    <div>
                      <label>Social Media Handle</label>
                      <input
                        type="text"
                        value={socialMedia}
                        onChange={(e) => setSocialMedia(e.target.value)}
                        required
                      />
                    </div>
                  )}
                    <div>
                      <label>Website link <small>or social media link</small></label>
                      <input
                        type="text"
                        value={websiteURL}
                        placeholder="https://www.xyz.com"
                        onChange={(e) => validateUrl(e.target.value)}
                      />
                      {urlError && <p className="error">{urlError}</p>}
                    </div>
                  </InputsFlexWrap>
                </FormInputs>
              </FormContent>
            </Slide>
          </Slides>

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
              disabled={!enableSubmit}
              onClick={(discount) => handlePostDiscount(discount)}
            >
              Submit
            </SubmitButton>
          </SubmitSection>
        </Content>
      </Container>
      {/* )} */}
    </>
  );
};

const Container = styled.div`
  margin-bottom: 20px;
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
    width: 80%;
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
  font-size: 16px;
  line-height: 1.5;
  color: #fa8128; /* dodgerblue rgba(0, 0, 0, 0.6); */
  font-weight: 400;
  @media (max-width: 480px) {
    padding: 0;
    /* border: 1px solid black; */
    & h2 {
      padding: 0;
      margin: 0;
      font-size: larger;
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
      font-size: 13px;
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
    font-size: 16px;
    margin-bottom: 20px;
  }
`;

const FormInputs = styled.div`
  label {
    float: left;
    color: rgba(0, 0, 0, 0.6);
    font-size: 15px;
    margin-bottom: 2px;
  }
  input,
  select {
    width: 100%;
    height: 45px;
    font-size: 16px;
    border: 1px solid #e5e4e2;
    padding: 0 12px;
    margin-bottom: 20px;
  }
  select#categories {
    height: fit-content;
  }
  textarea {
    width: 100%;
    font-size: 16px;
    border: 1px solid #e5e4e2;
    padding: 0 12px;
    min-height: 100px;
    resize: none;
    margin-bottom: 20px;
  }
  button {
    width: 100%;
    height: 45px;
    font-size: 16px;
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
    font-size: 15px;
    font-weight: 600;
    color: rgba(0, 0, 0, 0.6);
    text-align: left;
    display: block;
    width: 100%;
    margin-bottom: 5px;
  }
  & label.radio-label {
    float: none;
    color: rgba(0, 0, 0, 0.6);
    font-size: 15px;
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
    font-size: 15px;
    font-weight: 600;
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
  getDiscountPackages: (discount_id) => {dispatch(getDiscountPackagesAPI(discount_id))},
  getDiscountMedia: (discount_id) => {dispatch(getDiscountMediaAPI(discount_id))},
  updateDiscountPackages: (payload) => {dispatch(setDiscountPackages(payload))},
  deleteDiscountPackage: (package_id) => {dispatch(deleteDiscountPackageAPI(package_id))},
  deleteDiscountMedia: (media_id) => {dispatch(deleteDiscountMediaAPI(media_id))},
});

export default connect(mapStateToProps, mapDispatchToProps)(DiscountForm);
