// import { useContext } from 'react';
import { useContext, useEffect, useState } from 'react';
import Modal from '../UI/Modal';
import DiscountPackage from './DiscountPackage/DiscountPackage';
import classes from './AvailablePackages.module.css';
import { DUMMY_TICKETS } from '../Assets/data';
import CartContext from '../../store/cart-context';
import { connect } from "react-redux";
import { getDiscountPackagesAPI } from '../../actions';


const AvailablePackages = (props) => {
  const [showMessage, setShowMessage] = useState(false);
  const cartCtx = useContext(CartContext);

  const { items } = cartCtx;

  const msgClasses = `${classes.message} ${showMessage ? classes.bump : ''}`;

  useEffect(() => {
    // Get the discount packages
    if (!props.discount_packages || (props.discount_packages.length > 0 && props.discount_packages[0].discount != props.discount.url)){
      props.getDiscountPackages(props.discount.id);
      console.log("Weeeeee Mail");
    };

    const handleShowMsg = () => {
      if (items.length === 0) {
        return;
      }

      setShowMessage(true);

      const timer = setTimeout(() => {
        setShowMessage(false);
      }, 1000);

      return () => {
        clearTimeout(timer);
      };
    };
    handleShowMsg();
    
  }, [items, props.discount_packages]);


  const discountPackagesList = props.discount_packages ? props.discount_packages.map((discountPackage) => (
    <li className={classes.discountPackage}>
      <DiscountPackage
        key={discountPackage.id}
        id={discountPackage.id}
        type={discountPackage.type}
        discount={props.discount}
        price={discountPackage.price}
        showForm={true}
      />
    </li>
  ))
  : [];

  return (
    <Modal onClose={props.onClose}>
      <section className={classes.discountPackages}>
        {discountPackagesList.length > 0 ?
        <ul>{discountPackagesList}</ul> :
        <p style={{textAlign: "center"}}>No packages available.</p>
        }
      </section>
      <p className={msgClasses}>Package added to cart</p>
    </Modal>
  );
};


const mapStateToProps = (state) => {
  return {
    discount_packages: state.discountState.discount_packages,
  }
};

const mapDispatchToProps = (dispatch) => ({
  getDiscountPackages: (discount_id) => {dispatch(getDiscountPackagesAPI(discount_id))},
});

export default connect(mapStateToProps, mapDispatchToProps)(AvailablePackages);
