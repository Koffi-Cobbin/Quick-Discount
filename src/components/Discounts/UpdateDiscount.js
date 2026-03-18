import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import { useParams } from "react-router";
import DiscountForm from "./DiscountForm";

const UpdateDiscount = (props) => {
    const [discount, setDiscount] = useState();
    const { discountId } = useParams();

    useEffect(() => {
        if (props.discounts?.results) {
            setDiscount(props.discounts.results.find((d) => d.id === +discountId));
        } else if (props.discounts) {
            setDiscount(props.discounts.find((d) => d.id === +discountId));
        }
    }, [discountId, props.discounts]);

    return <DiscountForm {...props} discount={discount} />;
};

const mapStateToProps = (state) => ({
    discounts: state.organizerState.discounts,
    organizer: state.organizerState.organizer,
    categories: state.discountState.categories,
    discount_packages: state.discountState.discount_packages,
    discount_media: state.organizerState.discount_media,
});

export default connect(mapStateToProps)(UpdateDiscount);
