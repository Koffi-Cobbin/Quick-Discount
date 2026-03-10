import React, { useEffect } from "react";
import styled, { createGlobalStyle } from "styled-components";
import { connect } from "react-redux";
import { ReactSearchAutocomplete } from "react-search-autocomplete";
import { useNavigate } from "react-router-dom";
import { BASE_URL } from "../../../utils/constants";
import { setSearchResult } from "../../../actions";

/* ─── Global overrides: style ReactSearchAutocomplete internals ─────────────
   Scoped under .qd-search-root so rules never leak to SideNav's instance.   */
const SearchGlobalStyle = createGlobalStyle`
  /* ── Outer wrapper shell ── */
  .qd-search-root .wrapper {
    border: none !important;
    box-shadow: none !important;
    background: transparent !important;
    border-radius: 0 !important;
  }

  /* ── Input row ── */
  .qd-search-root .wrapper > div:first-child {
    background: transparent !important;
    border-radius: 10px !important;
    border: 1.5px solid #ffffff !important;
    padding: 0 12px !important;
    display: flex !important;
    align-items: center !important;
    gap: 8px !important;
  }

  /* ── Search icon ── */
  .qd-search-root .wrapper > div:first-child > svg:first-of-type {
    width: 14px !important;
    height: 14px !important;
    flex-shrink: 0 !important;
    color: rgba(255,255,255,0.7) !important;
    opacity: 1 !important;
  }

  /* ── Clear (×) icon ── */
  .qd-search-root .wrapper > div:first-child > svg:last-of-type {
    width: 13px !important;
    height: 13px !important;
    color: rgba(255,255,255,0.5) !important;
    cursor: pointer !important;
  }

  /* ── Input field ── */
  .qd-search-root input {
    background: transparent !important;
    color: #ffffff !important;
    font-family: 'Courier New', 'Consolas', monospace !important;
    font-size: 13px !important;
    font-weight: 400 !important;
    letter-spacing: 0.03em !important;
    caret-color: #ffffff !important;
    border: none !important;
    outline: none !important;
    padding: 0 !important;
    margin: 0 !important;
    flex: 1 !important;
  }

  .qd-search-root input::placeholder {
    color: rgba(255,255,255,0.5) !important;
    font-style: italic !important;
  }

  /* ── Results dropdown ── */
  .qd-search-root .wrapper > div:nth-child(2) {
    background: #ffffff !important;
    border: 1.5px solid rgba(0,0,0,0.1) !important;
    border-top: none !important;
    border-radius: 0 0 10px 10px !important;
    box-shadow: 0 8px 24px rgba(0,0,0,0.12) !important;
    overflow: hidden !important;
  }

  /* ── Result rows ── */
  .qd-search-root .wrapper > div:nth-child(2) li {
    background: transparent !important;
    border-bottom: 1px solid rgba(0,0,0,0.06) !important;
    padding: 9px 14px !important;
    font-size: 13px !important;
    color: #1a1a16 !important;
    cursor: pointer !important;
    transition: background 0.15s ease !important;
  }

  .qd-search-root .wrapper > div:nth-child(2) li:hover,
  .qd-search-root .wrapper > div:nth-child(2) li[aria-selected="true"] {
    background: rgba(250,129,40,0.08) !important;
  }

  .qd-search-root .wrapper > div:nth-child(2) li:last-child {
    border-bottom: none !important;
  }
`;

/* ─── Wrapper — intentionally minimal so the dropdown can render freely ── */
const Shell = styled.div`
  position: relative;
  width: 100%;

  & > div {
    width: 100% !important;
  }
`;

/* ─── Category pill shown in results ────────────────────────────────────── */
const categoryStyle = {
  display: "block",
  textAlign: "left",
  border: "1px solid rgba(250,129,40,0.4)",
  color: "#fa8128",
  width: "fit-content",
  padding: "1px 8px",
  borderRadius: "10px",
  fontSize: "10px",
  marginTop: "2px",
  fontFamily: "'Courier New', monospace",
  letterSpacing: "0.04em",
};

/* ─── Component ─────────────────────────────────────────────────────────── */
const Search = (props) => {
  const navigate = useNavigate();
  const items = props.discounts?.results ?? [];

  useEffect(() => {
    props.addSearchEvent?.();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const search = async (search_query) => {
    try {
      const response = await fetch(`${BASE_URL}/search/?keywords=${search_query}`);
      if (!response.ok) throw new Error("Network response was not OK");
      const body = await response.json();
      props.set_search_result(body);
      navigate("/discounts");
      props.closeNav?.();
    } catch (error) {
      console.error("Search fetch error:", error);
    }
  };

  const handleOnSearch = (search_query, results) => {
    console.log("Searching …", search_query, results);
    if (props.pressedEnter && search_query.length > 0) {
      search(search_query);
    }
  };

  const handleOnSelect = (item) => {
    navigate(`/discounts/${item.id}`);
    props.closeNav?.();
  };

  const formatResult = (item) => (
    <>
      <span style={{ display: "block", textAlign: "left" }}>{item.title}</span>
      {item.categories?.[0] && (
        <span style={categoryStyle}>{item.categories[0].name}</span>
      )}
    </>
  );

  /* Styling prop — passed through only when the parent hasn't already
     overridden everything via a CSS class (e.g. SideNav).               */
  const defaultStyling = {
    border: "1.5px solid #ffffff",
    backgroundColor: "transparent",
    color: "#ffffff",
    outline: "none",
    placeholderColor: "rgba(255,255,255,0.5)",
    iconColor: "rgba(255,255,255,0.7)",
    hoverBackgroundColor: "rgba(250,129,40,0.08)",
    lineColor: "rgba(0,0,0,0.08)",
    boxShadow: "none",
    zIndex: "9999",
    fontFamily: "'Courier New', monospace",
    fontSize: "13px",
    height: "38px",
  };

  const styling = props.styling
    ? { ...defaultStyling, ...props.styling }
    : defaultStyling;

  return (
    <>
      <SearchGlobalStyle />
      <Shell className="qd-search-root">
        <ReactSearchAutocomplete
          items={items}
          onSearch={handleOnSearch}
          onHover={(r) => console.log(r)}
          onSelect={handleOnSelect}
          onFocus={() => console.log("Focused")}
          formatResult={formatResult}
          fuseOptions={{
            keys: ["title", "categories.name", "organizer.name", "location"],
          }}
          resultStringKeyName="title"
          styling={styling}
        />
      </Shell>
    </>
  );
};

const mapStateToProps = (state) => ({
  discounts: state.discountState.discounts,
  categories: state.discountState.categories,
});

const mapDispatchToProps = (dispatch) => ({
  set_search_result: (payload) => dispatch(setSearchResult(payload)),
});

export default connect(mapStateToProps, mapDispatchToProps)(Search);