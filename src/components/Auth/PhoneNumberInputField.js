import React from "react";
import { useForm, Controller } from "react-hook-form";
import PhoneInput, { isValidPhoneNumber } from "react-phone-number-input";
import "react-phone-number-input/style.css";


const PhoneNumberInputField = () => {
    const {
        handleSubmit,
        formState: { errors },
        control
      } = useForm();
      
      
    const onSubmit = (data) => {
        console.log({data});
    };

    const handleValidate = (value) => {
        const isValid = isValidPhoneNumber(value);
        console.log({ isValid })
        return isValid
    };

    return (
       <form onSubmit={handleSubmit(onSubmit)} className="user-info-form">
        <div>
            <label htmlFor="phone-input">Phone Number</label>
            <Controller
                name="phone-input"
                control={control}
                rules={{
                    validate: (value) => handleValidate(value)
                }}
                render={({ field: { onChange, value } }) => (
                    <PhoneInput
                        value={value}
                        onChange={onChange}
                        defaultCountry="US"
                        id="phone-input"
                    />
                )}
            />

            {errors["phone-input"] && (
                <p className="error-message">Invalid Phone number</p>
            )}
        </div>
       </form>
    );
};

export default PhoneNumberInputField;
