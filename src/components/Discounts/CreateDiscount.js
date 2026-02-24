import React from "react";
import { connect } from "react-redux";
import DiscountForm from "./DiscountForm";

const CreateDiscount = (props) => {
    return <DiscountForm {...props} />;
};

const mapStateToProps = (state) => ({
    categories: state.discountState.categories,
    discount_packages: state.discountState.discount_packages,
    organizer: state.organizerState.organizer,
});

export default connect(mapStateToProps)(CreateDiscount);
