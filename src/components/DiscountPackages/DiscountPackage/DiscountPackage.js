import { useContext } from 'react';

import PackageForm from './PackageForm';
import classes from './DiscountPackage.module.css';
import CartContext from '../../../store/cart-context';
import { formatDate, formatTime } from "../../../utils/middleware";


const DiscountPackage = (props) => {
  const cartCtx = useContext(CartContext);

  const price = `${parseFloat(props.price).toFixed(2)}`;

  const addToCartHandler = quantity => {
    cartCtx.addItem({
      id: props.id,
      name: props.discount.name,
      quantity: quantity,
      price: props.price
    });
  };

  return (
    <>
      <div className={classes.item}>
        <div className={classes['item-left']}>
          <span className={classes['package-type']}>{props.type}</span>
          <h2 className={classes.num}>{formatDate(props.discount.start_date).split(',')[1].split(' ')[2]}</h2>
          <p className={classes.day}>{formatDate(props.discount.start_date).split(',')[1].split(' ')[1]}</p>
          <div className={classes['price-sm'] }>&#8373; {price}</div>
          <span className={classes['up-border']}></span>
          <span className={classes['down-border']}></span>
        </div> 
        {/* <!-- end item-left --> */}
        
        <div className={classes['item-right']}>
          {/* <p className={classes.discount}>Music Discount</p> */}
          <h2 className={classes.title}>{props.discount.name}</h2>
          
          <div className={classes.sce}>
            <div className={classes.icon}>
              {/* <i className="fa fa-table"></i> */}
              <img src="/images/icons/calendar.svg" alt="Date" />
            </div>
            <p>
              {formatDate(props.discount.start_date)}
            </p>
          </div>

          <div className={classes.sce}>
            <div className={classes.icon}>
              <img src="/images/icons/time.svg" alt="Time" />
            </div>
            <p>
              {formatTime(props.discount.start_time)}
            </p>
          </div>

          <div className={classes.fix}></div>

          <div className={classes.loc}>
            <div className={classes.icon}>
              <img src="/images/icons/location.svg" alt="Loc" />
              {/* <i className="fa fa-map-marker"></i> */}
            </div>
            <p>{props.discount.address}</p>
          </div>

          <div className={classes.fix}></div>
          
          <div className={classes['price-form']}>
            <div className={classes.price}>GH&#8373; {price}</div>
            {props.showForm && <PackageForm id={props.id} onAddToCart={addToCartHandler} />}
          </div>
        </div> 
        {/* <!-- end item-right --> */}
      </div> 
      {/* <!-- end item --> */}
    </>
  );
};

export default DiscountPackage;
