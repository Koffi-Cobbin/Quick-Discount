import React, { useRef, useEffect, useState } from "react";
import { connect } from "react-redux";
import { ReactSearchAutocomplete } from 'react-search-autocomplete';
import { useNavigate } from "react-router-dom";
import { BASE_URL } from "../../../utils/constants";

const Search = (props) => {

    const navigate = useNavigate();

    // note: the id field is mandatory
    const items = props.discounts.results;

    // let search_query = "";
    let search_results = [];

    const onEnter = (event) => {
        if (event.key === "Enter") {
            console.log('You pressed Enter!');

            // send get request to searchUrl with keywords then get response
            async function fetchResponse(searchUrl, keywords) {
                try {
                    const response = await fetch(`${searchUrl}?keywords=${keywords}`);
                    if (!response.ok) {
                        throw new Error("Network response was not OK");
                    }
                    const responseBody = await response.json();
                    console.log("Search results from API ... ", responseBody);
                } catch (error) {
                    console.error("There was a problem with your fetch request: ", error);
                }
            };

            const searchUrl = `${BASE_URL}/search/`;

            console.log("Search query ... ");
            console.log("Search Results ... ");

            // if (search_results.length < 1 && query_string.length > 0) {
            //     fetchResponse(searchUrl, query_string);
            // };
        }
    };


    const handleOnSearch = (keywords, results) => {
        // onSearch will have as the first callback parameter
        // the string searched and for the second the results.
        console.log("You searched for ... ", keywords);
        console.log("Found this ... ", results);
    };


    const handleOnHover = (result) => {
        // the item hovered
        console.log(result)
    };

    const handleOnSelect = (item) => {
        // the item selected
        console.log(item);
        navigate(`/discounts/${item.id}`);
        if (props.closeNav) {
            props.closeNav();
        }
    }

    const handleOnFocus = () => {
        console.log('Focused');        
    }

    const categoryStyle = {
        display: 'block',
        textAlign: 'left',
        border: "1px solid rgba(0,0,0,0.8)",
        outline: "none",
        width: "fit-content",
        padding: "0 10px",
        borderRadius: "12px",
        fontSize: "10px",
    };

    const formatResult = (item) => {
        return (
            <>
                <span style={{ display: 'block', textAlign: 'left' }}>{item.title}</span>
                <span style={categoryStyle}>{item.categories[0].name}</span>
            </>
        )
    }

    const styling = {
        border: "none",
        backgroundColor: "rgba(255, 255, 255, 0.4)",
        color: "#fff",
        outline: "none",
        placeholderColor: "#FFF",
        iconColor: "#FFF",
        hoverBackgroundColor: "rgba(0,0,0,0.8)",
    };

    return (
        <ReactSearchAutocomplete
            items={items}
            onSearch={handleOnSearch}
            onHover={handleOnHover}
            onSelect={handleOnSelect}
            onFocus={handleOnFocus}
            formatResult={formatResult}
            fuseOptions={{ keys: ["title", "categories.name", "organizer.name", "location"] }}
            resultStringKeyName="title"
            styling={props.homeSearch ? styling : {}}
        />
    )
};



const mapStateToProps = (state) => {
    return {
        discounts: state.discountState.discounts,
        categories: state.discountState.categories,
    }
};

const mapDispatchToProps = (dispatch) => ({
});

export default connect(mapStateToProps, mapDispatchToProps)(Search);