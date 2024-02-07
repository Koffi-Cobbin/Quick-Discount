import React, { useState, useEffect } from "react";
import { useParams } from "react-router";
import classes from "./Help.module.css";

function Help() {
  let { secId } = useParams();

  useEffect(() => {
    if (secId) {
      const element = document.getElementById(secId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  }, [secId]);

  return (
    <div className={classes.mainWrapper}>
      <div className={classes.wrapper}>
        <div className={classes.sidebar}>
          <nav>
            <ul>
              <li>
                <a href="#basics">Basics</a>
              </li>
              <li>
                <a href="#accounts">Account</a>
              </li>
              <li>
                <a href="#payment">Payment</a>
              </li>
            </ul>
          </nav>
        </div>
        <div className={classes.content}>
          <section id="basics">
            <h2>Basics</h2>
            <p>
              Welcome to <b>QuickDiscount</b>! Get all your latest discounts with no <i><b>wahala!</b></i>. 
              Wanna run a discount promo? Just create a QuickDiscount ad.
            </p>
            <p>Getting started is simple:</p>
            <ul>
              <li>Create an account or log in if you already have one.</li>
              <li>
                Click on "Post" to start creating your discount ad.
              </li>
              <li>
                Set percentage discounts, prices, and other discount information.
              </li>
              <li>
                Once your ad is live, users can start purchasing.
              </li>
            </ul>
          </section>

          <section id="accounts">
            <h2>Accounts</h2>
            <p>
              Having an QuickDiscount account allows you to access and manage your
              discount ads. You can:
            </p>
            <ul>
              <li>Create, edit, and delete ads.</li>
              <li>Set up your payment preferences and receive payments.</li>
              <li>View your discount statistics and engagement details.</li>
              <li>Communicate with customers through our messaging system.</li>
            </ul>
            <p>
              Make sure to keep your account information secure and updated to
              ensure smooth discount management.
            </p>
          </section>

          <section id="payment">
            <h2>Payment</h2>
            <p>
              QuickDiscount provides secure payment processing for your discount
              sales. We support various payment methods to make it convenient
              for both shops and customers. When setting up your
              discount ad:
            </p>
            <ul>
              <li>
                Choose your preferred payment gateway (e.g., MoMo, Bank).
              </li>
              <li>
                Enter your payment details to receive discount sales revenue.
              </li>
              <li>
                Customers can securely purchase products using their preferred
                payment method.
              </li>
            </ul>
            <p>
              Payments are typically processed within a specified timeframe, and
              you can track your earnings and payout status through your account
              dashboard.
            </p>
          </section>


          {/* AD PACKAGES SECTION */}
          <section id="ticket-types">
            <h2>Ad Packages</h2>
            <p>
              When it comes to running a discount sale, the deciding factor is more or less the type of deals you’ve set up for would-be customers.
            </p>

            <ol>
                <li>
                    <h3>Daily</h3>
                    <p>
                      A daily package that will be visible on the main page of the app for 24hrs. 
                      It is recommended if you want to promote your product/service once per day or have limited inventory.
                      It is suitable for promoting limited-time offers or new product launches. 
                      The price includes one clickthrough per day.
                      The price is GHS20 per day or GHS50 for unlimited visibility.
                    </p>
                </li>

                <li>
                    <h3>Weekly</h3>
                    <p>
                      Visible on the homepage for one week. This ad type allows for multiple clicks.  
                      Pricing varies based on number of clicks:
                        <ul>
                          <li><b>Up to 10 Clicks: GHS75</b></li>
                          <li><b>More than 10 Clicks: GHS100</b></li>
                        </ul>
                    </p>
                </li>

                <li>
                    <h3>Monthly</h3>
                    <p>
                      Advertisement appears in the top banner position on the home screen 
                      and is visible for an entire month. Price is GHS300.
                    </p>
                </li>
            </ol>
          </section> 
        </div>
      </div>
    </div>
  );
}

export default Help;
