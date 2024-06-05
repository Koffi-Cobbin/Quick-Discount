import React, { useEffect } from "react";
import { connect } from "react-redux";
import { ReactSearchAutocomplete } from 'react-search-autocomplete';
import { useNavigate } from "react-router-dom";
import { BASE_URL } from "../../../utils/constants";
import { setSearchResult } from "../../../actions";

const Search = (props) => {

    const navigate = useNavigate();

    // note: the id field is mandatory
    const items = props.discounts.results;

    useEffect(() => {
        props.addSearchEvent();
      }, []);


    const search = (search_query) => {
        // send get request to searchUrl with keywords then get response
        async function fetchResponse(searchUrl, search_query) {
            try {
                const response = await fetch(`${searchUrl}?keywords=${search_query}`);
                if (!response.ok) {
                    throw new Error("Network response was not OK");
                }
                const responseBody = await response.json();
                props.set_search_result(responseBody);
                console.log("Search results from API ... ", responseBody);
                navigate(`/discounts`);
                if (props.closeNav) {
                    props.closeNav();
                }
            } catch (error) {
                console.error("There was a problem with your fetch request: ", error);
            }
        };

        const searchUrl = `${BASE_URL}/search/`;

        console.log("Search query ... ", search_query);

        fetchResponse(searchUrl, search_query);
    };


    const handleOnSearch = (search_query, results) => {
        // onSearch will have as the first callback parameter
        // the string searched and for the second the results.
        console.log("You searched for ... ", search_query);
        console.log("Found this ... ", results);
        
        // send API search request if Enter is pressed
        if (props.pressedEnter && search_query.length > 0){
            search(search_query);
        }
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
    set_search_result: (payload) => {
        dispatch(setSearchResult(payload));
      },
});

export default connect(mapStateToProps, mapDispatchToProps)(Search);