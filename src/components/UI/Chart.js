import React from 'react';
import { connect } from "react-redux";
import { useState, useEffect } from "react";
import { getAnalyticsAPI } from "../../actions";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';
import { faker } from '@faker-js/faker';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);


const months = [
  'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
  'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
];


const BarChart = (props) => {
  const [labels, setLabels] = useState();
  const [ticketsSold, setTicketsSold] = useState();
  const [ticketsLeft, setTicketsLeft] = useState();
  // const [filterOption, setFilterOption] = useState(0);

  let options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Tickets sold vs tickets left',
      },
    },
  };

  let data = {
    labels,
    datasets: [
      {
        label: props.filterType=="sales" ? 'GHS' : 'Tickets Sold',
        data: ticketsSold,
        backgroundColor: 'rgba(53, 162, 235, 0.5)',
      },
      {
        label: props.filterType=="sales" ? 'GHS' : 'Tickets Left',
        data: ticketsLeft,
        backgroundColor: 'rgba(255, 99, 132, 0.5)',
      },
    ],
  };

  const filterTypeHandler = (filterOption) => {
    if (filterOption === "months"){
      // Get the keys of the months object
      let key_lst = Object.keys(props.analytics.months);
      console.log(key_lst);
      // Find their equivalent str repr in months
      let filterLabel = key_lst.map(key => (key >= 0 && key < months.length) ? months[key-1] : undefined);
      // Set label to result
      setLabels(filterLabel);
      if (props.filterType === "tickets"){
        // Get a list of tickets sold
        let tickets_sold_list = key_lst.map(key => {
          const obj = props.analytics.months[key];
          return obj.total_tickets_sold;
        });
        setTicketsSold(tickets_sold_list);
        // Get a list of tickets left
        let tickets_left_list = key_lst.map(key => {
          const obj = props.analytics.months[key];
          return obj.total_tickets_quantity - obj.total_tickets_sold;
        });
        setTicketsLeft(tickets_left_list);
      };
      if (props.filterType === "sales"){
        // Get a list of tickets sales amounts
        let total_sales_list = key_lst.map(key => {
          const obj = props.analytics.months[key];
          return obj.total_sales_amount;
        });
        setTicketsSold(total_sales_list);
        // Get a list of tickets left amounts
        let tickets_sales_left_list = key_lst.map(key => {
          const obj = props.analytics.months[key];
          return obj.total_expected_sales_amount - obj.total_sales_amount;
        });
        setTicketsLeft(tickets_sales_left_list);
      };
    };
    if (filterOption === "years"){
      // Get the keys of the years object as labels
      let filterLabel = Object.keys(props.analytics.years);
      console.log(filterLabel);
      // Set label to result
      setLabels(filterLabel);

      if (props.filterType === "tickets"){
        // Get a list of tickets sold
        let tickets_sold_list = filterLabel.map(key => {
          const obj = props.analytics.years[key];
          return obj.total_tickets_sold;
        });
        setTicketsSold(tickets_sold_list);
        // Get a list of tickets left
        let tickets_left_list = filterLabel.map(key => {
          const obj = props.analytics.years[key];
          return obj.total_tickets_quantity - obj.total_tickets_sold;
        });
        setTicketsLeft(tickets_left_list);
      };
      if (props.filterType === "sales"){
        // Get a list of tickets sales amounts
        let total_sales_list = filterLabel.map(key => {
          const obj = props.analytics.years[key];
          return obj.total_sales_amount;
        });
        setTicketsSold(total_sales_list);
        // Get a list of tickets left amounts
        let tickets_sales_left_list = filterLabel.map(key => {
          const obj = props.analytics.years[key];
          return obj.total_expected_sales_amount - obj.total_sales_amount;
        });
        setTicketsLeft(tickets_sales_left_list);
      };
    };
  };

  useEffect(() => {
    if (!props.analytics){
      props.getAnalytics(props.organizer.id);
    };    
    if (props.analytics){
      filterTypeHandler(props.filterOption);
    }
  }, [props.analytics, props.filterType, props.filterOption]);

  return <Bar options={options} data={data} />;
}


const mapStateToProps = (state) => {
  return {
    organizer: state.organizerState.organizer,
    analytics: state.organizerState.analytics,
  };
};

const mapDispatchToProps = (dispatch) => ({ 
  getAnalytics: (organizer_id) => {dispatch(getAnalyticsAPI(organizer_id))},
});

export default connect(mapStateToProps, mapDispatchToProps)(BarChart);
