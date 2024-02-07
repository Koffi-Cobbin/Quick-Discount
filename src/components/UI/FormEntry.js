import React from 'react';
import classes from "./FormEntry.module.css";


const FormEntry = React.forwardRef((props, ref) => {
  return (
    <div className={props.className}>
        <label htmlFor={props.input.id} className={classes['form-entry-label']}>
            <i className={props.label.iconClass}></i>{props.label.name}
        </label>
        <input ref={ref} {...props.input} className={classes['form-entry-input']}/>
    </div>
  );
});

export default FormEntry;
