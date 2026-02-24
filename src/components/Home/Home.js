import React from "react";
import styled, { keyframes, css } from "styled-components";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import { useEffect, useState, useRef, useCallback } from "react";

import BackgroundSlider from "./BackgroundSlider";
import CarouselFlex from "../Shared/CarouselFlex";
import TopDiscounts from "../Discounts/TopDiscounts";
import { LeftButton, RightButton } from "../Shared/CarouselControls";
import DiscountCard from "../Discounts/DiscountCard";

import { getDiscountsAPI } from "../../actions";

// ─── Skeleton card for loading state ─────────────────────────────────────────
const SkeletonCard = () => (
  <SkeletonWrap>
    <SkeletonImg />
    <SkeletonLine width="80%" />
    <SkeletonLine width="55%" />
    <SkeletonLine width="40%" />
  </SkeletonWrap>
);

// ─── Component ───────────────────────────────────────────────────────────────
const Home = (props) => {
  const [categories, setCategories] = useState();
  const [topDiscounts, setTopDiscounts] = useState();
  const [activeCategory, setActiveCategory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [leftFade, setLeftFade] = useState(false);
  const [rightFade, setRightFade] = useState(true);
  const filterRef = useRef(null);
  const sectionRefs = useRef({});

  useEffect(() => {
    props.getDiscounts();
  }, []);

  useEffect(() => {
    if (props.discounts.results) {
      const categories_lists = props.discounts.results.map(
        (discount) => discount.categories
      );
      const categories_set = new Set();
      categories_lists.forEach((subList) => {
        subList.forEach((category) => {
          categories_set.add(category.name);
        });
      });
      const allCategories = [...categories_set];
      setCategories(allCategories);
      setActiveCategory(allCategories[0]);

      const top_discounts = props.discounts.results
        .sort((a, b) => b.likes - a.likes)
        .slice(0, 4);
      setTopDiscounts(top_discounts);
      setLoading(false);
    }
  }, [props.discounts]);

  // Update edge fade indicators on filter scroll
  const handleFilterScroll = useCallback(() => {
    const el = filterRef.current;
    if (!el) return;
    setLeftFade(el.scrollLeft > 10);
    setRightFade(el.scrollLeft < el.scrollWidth - el.clientWidth - 10);
  }, []);

  useEffect(() => {
    const el = filterRef.current;
    if (el) {
      el.addEventListener("scroll", handleFilterScroll, { passive: true });
      handleFilterScroll();
      return () => el.removeEventListener("scroll", handleFilterScroll);
    }
  }, [categories, handleFilterScroll]);

  // IntersectionObserver — sync active category chip with scroll position
  useEffect(() => {
    if (!categories) return;
    const observers = [];

    categories.forEach((category) => {
      const el = document.getElementById(`${category.toLowerCase()}-section`);
      if (!el) return;
      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) setActiveCategory(category);
        },
        { threshold: 0.3 }
      );
      observer.observe(el);
      observers.push(observer);
    });

    return () => observers.forEach((o) => o.disconnect());
  }, [categories]);

  const handleClickScroll = (id, category) => {
    setActiveCategory(category);
    const element = document.getElementById(id.toLowerCase() + "-section");
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  // Scroll the active chip into view inside the filter bar
  useEffect(() => {
    if (!activeCategory || !filterRef.current) return;
    const activeChip = filterRef.current.querySelector(`[data-cat="${activeCategory}"]`);
    if (activeChip) {
      activeChip.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "center" });
    }
  }, [activeCategory]);

  return (
    <Container>
      <BackgroundSlider />

      <Content>
        {/* ── Top Discounts ── */}
        {loading ? (
          <SkeletonSection>
            <SkeletonTitle />
            <SkeletonRow>
              {[1, 2, 3, 4].map((i) => <SkeletonCard key={i} />)}
            </SkeletonRow>
          </SkeletonSection>
        ) : (
          topDiscounts && (
            <FadeInSection delay="0s">
              <TopDiscounts discounts={topDiscounts} />
            </FadeInSection>
          )
        )}

        {/* ── Category Filter Bar ── */}
        {categories && (
          <FilterBar>
            <FilterEdgeFade side="left" visible={leftFade} />
            <FilterEdgeFade side="right" visible={rightFade} />

            <LeftButton target="filter" pos="0" />

            <CategoriesTrack
              id="filter"
              ref={filterRef}
              role="region"
              aria-label="categories-filter"
              tabIndex="0"
            >
              {categories.map((category, key) => (
                <CategoryChip
                  key={key}
                  data-cat={category}
                  active={activeCategory === category}
                  onClick={() => handleClickScroll(category, category)}
                >
                  {category}
                  {activeCategory === category && <ChipActiveDot />}
                </CategoryChip>
              ))}
            </CategoriesTrack>

            <RightButton target="filter" pos="0" />
          </FilterBar>
        )}

        {/* ── Category Sections ── */}
        <CategoriesWrap>
          {loading ? (
            [1, 2].map((i) => (
              <SkeletonSection key={i}>
                <SkeletonTitle />
                <SkeletonRow>
                  {[1, 2, 3, 4].map((j) => <SkeletonCard key={j} />)}
                </SkeletonRow>
              </SkeletonSection>
            ))
          ) : (
            categories && categories.map((category, key) => (
              <AnimatedSection
                key={key}
                id={`${category.toLowerCase()}-section`}
                index={key}
              >
                <CategoryHeader>
                  <CategoryTitleLeft>
                    <CategoryName>{category}</CategoryName>
                    <CategoryCount>
                      {props.discounts.results
                        ? props.discounts.results.filter((d) =>
                            d.categories.map((c) => c.name).includes(category)
                          ).length
                        : 0}{" "}
                      deals
                    </CategoryCount>
                  </CategoryTitleLeft>
                  <SeeMoreLink to={`/discounts/cat/${category.toLowerCase()}`}>
                    See all →
                  </SeeMoreLink>
                </CategoryHeader>

                {props.discounts.results && (
                  <CarouselFlex
                    type="category"
                    divId={category.toLowerCase()}
                    className="category-carousel-section"
                  >
                    {props.discounts.results
                      .filter((discount) =>
                        discount.categories
                          .map((cat) => cat.name)
                          .includes(category)
                      )
                      .slice(0, 4)
                      .map((discount, key) => (
                        <DiscountCard key={key} discount={discount} />
                      ))}
                  </CarouselFlex>
                )}
              </AnimatedSection>
            ))
          )}
        </CategoriesWrap>
      </Content>
    </Container>
  );
};

// ─── Animations ───────────────────────────────────────────────────────────────

const fadeUp = keyframes`
  from { opacity: 0; transform: translateY(20px); }
  to   { opacity: 1; transform: translateY(0); }
`;

const shimmer = keyframes`
  0%   { background-position: -600px 0; }
  100% { background-position:  600px 0; }
`;

const pipScale = keyframes`
  from { transform: scale(0); }
  to   { transform: scale(1); }
`;

// ─── Layout ───────────────────────────────────────────────────────────────────

const Container = styled.div`
  max-width: 100%;
  position: relative;
  font-family: Inter, 'Roboto', sans-serif;
`;

const Content = styled.div`
  max-width: 100%;
  position: relative;

  @media (min-width: 768px) {
    width: 75%;
    margin: 0 auto;
  }

  @media only screen and (min-width: 120em) {
    width: 65%;
    margin: 0 auto;
  }

  @media only screen and (min-width: 160em) {
    width: 50%;
    margin: 0 auto;
  }
`;

// ─── Fade-in wrapper for top discounts ───────────────────────────────────────

const FadeInSection = styled.div`
  animation: ${fadeUp} 0.55s ${({ delay }) => delay || "0s"} ease both;
`;

// ─── Category Filter Bar ──────────────────────────────────────────────────────

const FilterBar = styled.div`
  position: sticky;
  top: 70px;
  z-index: 100;
  /* background-color: #f8f8f8; */
  border-bottom: 1px solid rgba(0, 0, 0, 0.06);
  /* box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06); */
  background: rgba(14, 9, 4, 0.82);
  box-shadow:
      0 4px 24px rgba(0, 0, 0, 0.22),
      0 1px 0 rgba(255, 255, 255, 0.04) inset,
      0 -1px 0 rgba(220, 103, 14, 0.2) inset;
  /*  */
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 2px;
`;

const FilterEdgeFade = styled.div`
  position: absolute;
  top: 0;
  bottom: 0;
  width: 48px;
  z-index: 2;
  pointer-events: none;
  transition: opacity 0.3s ease;
  opacity: ${({ visible }) => (visible ? 1 : 0)};

  ${({ side }) =>
    side === "left"
      ? css`
          left: 30px;
          background: linear-gradient(to right, #f8f8f8 30%, transparent);
        `
      : css`
          right: 30px;
          background: linear-gradient(to left, #f8f8f8 30%, transparent);
        `}
`;

const CategoriesTrack = styled.div`
  flex: 1;
  display: flex;
  align-items: center;
  padding: 12px 8px;
  overflow-x: auto;
  scroll-snap-type: x proximity;
  scroll-behavior: smooth;
  -webkit-overflow-scrolling: touch;
  gap: 8px;

  /* Hide scrollbar — all browsers */
  scrollbar-width: none;
  -ms-overflow-style: none;
  &::-webkit-scrollbar {
    display: none;
  }
`;

const CategoryChip = styled.span`
  position: relative;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 7px 18px;
  border-radius: 20px;
  font-size: 14px;
  font-weight: ${({ active }) => (active ? "600" : "400")};
  white-space: nowrap;
  flex-shrink: 0;
  cursor: pointer;
  user-select: none;
  scroll-snap-align: center;
  transition:
    background-color 0.22s ease,
    color 0.22s ease,
    transform 0.15s ease,
    box-shadow 0.22s ease;

  background-color: ${({ active }) => (active ? "#67309b" : "#fff")};
  color: ${({ active }) => (active ? "#fff" : "#444")};
  box-shadow: ${({ active }) =>
    active
      ? "0 2px 12px rgba(103, 48, 155, 0.28)"
      : "0 1px 3px rgba(0,0,0,0.08)"};

  &:hover {
    background-color: ${({ active }) => (active ? "#5a2888" : "#f0eaf8")};
    color: ${({ active }) => (active ? "#fff" : "#67309b")};
    transform: translateY(-1px);
  }

  &:active {
    transform: translateY(0);
  }

  &:first-of-type { scroll-snap-align: start; }
  &:last-of-type  { scroll-snap-align: end; }
`;

const ChipActiveDot = styled.span`
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.75);
  animation: ${pipScale} 0.2s ease;
`;

// ─── Category Sections ────────────────────────────────────────────────────────

const CategoriesWrap = styled.div`
  margin-top: 8px;
  max-width: 100%;
`;

const AnimatedSection = styled.div`
  width: 100%;
  margin: 6px 0;
  padding-bottom: 10px;
  background: ${({ index }) => (index % 2 === 0 ? "#fff" : "#fbfbfb")};
  border-top: 1px solid rgba(0, 0, 0, 0.04);

  animation: ${fadeUp} 0.5s ease both;
  animation-delay: ${({ index }) => Math.min(index * 0.06, 0.3)}s;
`;

const CategoryHeader = styled.div`
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  padding: 16px 12px 4px;
`;

const CategoryTitleLeft = styled.div`
  display: flex;
  align-items: baseline;
  gap: 8px;
`;

const CategoryName = styled.h4`
  margin: 0;
  font-size: 20px;
  font-weight: 700;
  color: #fa8128;
  position: relative;

  &::after {
    content: '';
    position: absolute;
    left: 0;
    bottom: -4px;
    width: 32px;
    height: 3px;
    background: #fa8128;
    border-radius: 2px;
    opacity: 0.5;
  }
`;

const CategoryCount = styled.span`
  font-size: 12px;
  font-weight: 500;
  color: #aaa;
  letter-spacing: 0.02em;
`;

const SeeMoreLink = styled(Link)`
  font-size: 14px;
  font-weight: 500;
  color: #808080;
  text-decoration: none;
  padding: 4px 10px;
  border-radius: 12px;
  transition: background 0.2s, color 0.2s;

  &:hover {
    background: #f5f0fa;
    color: #67309b;
  }
`;

// ─── Skeleton Loading ─────────────────────────────────────────────────────────

const skeletonShimmer = css`
  background: linear-gradient(90deg, #f0f0f0 25%, #e8e8e8 50%, #f0f0f0 75%);
  background-size: 600px 100%;
  animation: ${shimmer} 1.4s infinite linear;
`;

const SkeletonSection = styled.div`
  padding: 16px 12px;
  margin-bottom: 8px;
`;

const SkeletonTitle = styled.div`
  ${skeletonShimmer}
  height: 24px;
  width: 160px;
  border-radius: 6px;
  margin-bottom: 16px;
`;

const SkeletonRow = styled.div`
  display: flex;
  gap: 12px;
  overflow: hidden;
`;

const SkeletonWrap = styled.div`
  flex: 0 0 220px;
  border-radius: 16px;
  overflow: hidden;
  background: #fff;
  padding: 8px;
  box-shadow: 0 1px 4px rgba(0,0,0,0.07);
`;

const SkeletonImg = styled.div`
  ${skeletonShimmer}
  height: 150px;
  border-radius: 12px;
  margin-bottom: 10px;
`;

const SkeletonLine = styled.div`
  ${skeletonShimmer}
  height: 14px;
  border-radius: 4px;
  margin-bottom: 8px;
  width: ${({ width }) => width || "100%"};
`;

// ─── Redux ────────────────────────────────────────────────────────────────────

const mapStateToProps = (state) => {
  return {
    user: state.userState.user,
    token: state.userState.token,
    discounts: state.discountState.discounts,
  };
};

const mapDispatchToProps = (dispatch) => ({
  getDiscounts: () => {
    dispatch(getDiscountsAPI());
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(Home);