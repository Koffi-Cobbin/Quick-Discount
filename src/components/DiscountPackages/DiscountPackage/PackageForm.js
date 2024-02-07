import { useRef, useState } from 'react';

import Input from '../../UI/Input';
import classes from './PackageForm.module.css';

const PackageForm = (props) => {
  const [quantityIsValid, setQuantityIsValid] = useState(true);
  const quantityInputRef = useRef();

  const submitHandler = (event) => {
    event.preventDefault();

    const enteredAmount = quantityInputRef.current.value;
    const enteredAmountNumber = +enteredAmount;

    if (
      enteredAmount.trim().length === 0 ||
      enteredAmountNumber < 1 ||
      enteredAmountNumber > 5
    ) {
      setQuantityIsValid(false);
      return;
    }

    props.onAddToCart(enteredAmountNumber);
  };

  return (
    <form className={classes.form} onSubmit={submitHandler}>
      <Input
        ref={quantityInputRef}
        label='Quantity'
        input={{
          id: 'amount_' + props.id,
          type: 'number',
          min: '1',
          max: '5',
          step: '1',
          defaultValue: '1',
        }}
      />
      <button>+ <span className={classes['add-package-btn-txt']}>Add</span></button>
      {!quantityIsValid && <p>Please enter a valid amount (1-5).</p>}
    </form>
  );
};

export default PackageForm;
