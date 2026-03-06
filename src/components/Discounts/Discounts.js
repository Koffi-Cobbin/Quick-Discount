import { useState, useEffect } from "react";
import styled, { keyframes, css, createGlobalStyle } from "styled-components";
import { connect } from "react-redux";
import { getDiscountsAPI, addToWishlistAPI, removeFromWishlistAPI } from "../../actions";
import Card from "../Shared/Card";

// ─── Theme tokens (matches QuickDiscount app) ─────────────────────────────────
const T = {
  bg: "#0e0d0b",
  surface: "rgba(255,255,255,0.034)",
  surfaceHover: "rgba(255,255,255,0.06)",
  border: "rgba(240,236,230,0.08)",
  borderHover: "rgba(250,129,40,0.3)",
  orange: "#fa8128",
  orangeDim: "rgba(250,129,40,0.15)",
  orangeGlow: "rgba(250,129,40,0.06)",
  text: "#f0ece6",
  textMuted: "rgba(240,236,230,0.4)",
  textSub: "rgba(240,236,230,0.62)",
  radius: "14px",
  radiusSm: "8px",
};

const SORTS = ["Popular", "Newest", "Biggest Deal"];

// ─── Animations ───────────────────────────────────────────────────────────────
const fadeUp = keyframes`
  from { opacity: 0; transform: translateY(22px); }
  to   { opacity: 1; transform: translateY(0); }
`;
const grain = keyframes`
  0%,100% { transform: translate(0,0); }
  10%      { transform: translate(-2%,-3%); }
  30%      { transform: translate(3%,-1%); }
  50%      { transform: translate(-1%,2%); }
  70%      { transform: translate(2%,3%); }
  90%      { transform: translate(-3%,1%); }
`;

// ─── Global ───────────────────────────────────────────────────────────────────
const Global = createGlobalStyle`
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;1,700&family=DM+Sans:wght@300;400;500;600&display=swap');
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  body { background: ${T.bg}; color: ${T.text}; }
  ::-webkit-scrollbar { width: 4px; } 
  ::-webkit-scrollbar-track { background: transparent; }
  ::-webkit-scrollbar-thumb { background: rgba(250,129,40,0.3); border-radius: 4px; }
`;

// ─── Layout ───────────────────────────────────────────────────────────────────
const Page = styled.div`
  min-height: 100vh;
  background: ${T.bg};
  font-family: "DM Sans", sans-serif;
  position: relative;
  overflow-x: hidden;
`;

const GrainOverlay = styled.div`
  pointer-events: none;
  position: fixed;
  inset: -50%;
  width: 200%;
  height: 200%;
  opacity: 0.028;
  background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 512 512' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
  animation: ${grain} 8s steps(10) infinite;
  z-index: 0;
`;

const AmbientBlob = styled.div`
  pointer-events: none;
  position: fixed;
  top: -200px;
  right: -200px;
  width: 700px;
  height: 700px;
  border-radius: 50%;
  background: radial-gradient(
    circle,
    rgba(250, 129, 40, 0.07) 0%,
    transparent 65%
  );
  z-index: 0;
`;

const Inner = styled.div`
  position: relative;
  z-index: 1;
  max-width: 1280px;
  margin: 0 auto;
  padding: 0 24px 80px;

  @media (max-width: 600px) {
    padding: 0 16px 60px;
  }
`;

// ─── Header band ─────────────────────────────────────────────────────────────
const Header = styled.div`
  padding: 72px 0 0;
  text-align: center;
  animation: ${fadeUp} 0.55s ease both;

  @media (min-width: 600px) {
    padding-top: 96px;
  }
`;

const Headline = styled.h1`
  font-family: "Playfair Display", Georgia, serif;
  font-size: clamp(2.4rem, 5vw, 4rem);
  font-weight: 700;
  line-height: 1.08;
  color: ${T.text};
  text-align: center;
  em {
    font-style: italic;
    color: ${T.orange};
  }
`;

// ─── Divider ─────────────────────────────────────────────────────────────────
const Rule = styled.div`
  height: 1px;
  background: ${T.border};
  margin: 36px 0 28px;
`;

// ─── Controls row ────────────────────────────────────────────────────────────
const Controls = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 12px;
  flex-wrap: wrap;
  justify-content: space-between;
  margin-bottom: 32px;
  animation: ${fadeUp} 0.55s 0.1s ease both;

  @media (max-width: 480px) {
    flex-direction: column;
    align-items: stretch;
    gap: 16px;
  }
`;

const CatRail = styled.div`
  display: flex;
  gap: 8px;
  overflow-x: auto;
  overflow-y: hidden;
  flex-shrink: 0;
  width: 100%;
  scrollbar-width: none;
  -webkit-overflow-scrolling: touch;
  scroll-snap-type: x mandatory;
  padding: 4px 0;
  margin: -4px 0;

  /* Ensure horizontal scroll on mobile */
  @media (max-width: 480px) {
    width: calc(100% + 32px);
    margin-left: -16px;
    margin-right: -16px;
    padding-left: 16px;
    padding-right: 16px;
  }

  &::-webkit-scrollbar {
    display: none;
  }
`;

const Chip = styled.button`
  padding: 7px 16px;
  border-radius: 30px;
  font-size: 0.8rem;
  font-family: "Courier New", monospace;
  letter-spacing: 0.04em;
  white-space: nowrap;
  cursor: pointer;
  transition: all 0.18s;
  flex-shrink: 0;
  scroll-snap-align: start;
  border: 1px solid ${({ $active }) => ($active ? T.orange : T.border)};
  background: ${({ $active }) => ($active ? T.orangeDim : "transparent")};
  color: ${({ $active }) => ($active ? T.orange : T.textSub)};

  &:hover {
    border-color: ${T.orange};
    color: ${T.orange};
    background: ${T.orangeDim};
  }
`;

const RightControls = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  flex-shrink: 0;

  @media (max-width: 480px) {
    width: 100%;
    flex-shrink: 1;
  }
`;

const SortSelect = styled.select`
  background: ${T.surface};
  border: 1px solid ${T.border};
  color: ${T.textSub};
  font-family: "Courier New", monospace;
  font-size: 0.78rem;
  letter-spacing: 0.04em;
  padding: 7px 12px;
  border-radius: 30px;
  cursor: pointer;
  outline: none;
  appearance: none;
  transition: border-color 0.2s;
  min-width: 0;
  flex-shrink: 1;

  @media (max-width: 480px) {
    flex: 1;
  }

  &:focus,
  &:hover {
    border-color: rgba(250, 129, 40, 0.35);
    color: ${T.text};
  }

  option {
    background: #1a1a16;
  }
`;

// ─── Results count ───────────────────────────────────────────────────────────
const ResultsMeta = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 20px;
  animation: ${fadeUp} 0.55s 0.15s ease both;
`;

const ResultsCount = styled.p`
  font-family: "Courier New", monospace;
  font-size: 11px;
  letter-spacing: 0.1em;
  color: ${T.textMuted};
  text-transform: uppercase;
`;

const ActiveFilters = styled.div`
  display: flex;
  gap: 6px;
  flex-wrap: wrap;
`;

const FilterPill = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 5px;
  padding: 3px 10px;
  border-radius: 20px;
  font-size: 0.72rem;
  font-family: "Courier New", monospace;
  background: ${T.orangeDim};
  border: 1px solid rgba(250, 129, 40, 0.3);
  color: ${T.orange};
  cursor: pointer;

  &:hover {
    background: rgba(250, 129, 40, 0.25);
  }
`;

// ─── Grid ────────────────────────────────────────────────────────────────────
const Grid = styled.div`
  display: grid;
  gap: 20px;
  grid-template-columns: repeat(auto-fill, minmax(290px, 1fr));
  animation: ${fadeUp} 0.5s 0.2s ease both;
`;


// ─── Skeleton ────────────────────────────────────────────────────────────────
const SkeletonShimmer = keyframes`
  0%   { background-position: -600px 0; }
  100% { background-position:  600px 0; }
`;

const SkeletonBase = css`
  background: linear-gradient(
    90deg,
    rgba(255, 255, 255, 0.04) 25%,
    rgba(255, 255, 255, 0.08) 37%,
    rgba(255, 255, 255, 0.04) 63%
  );
  background-size: 600px 100%;
  animation: ${SkeletonShimmer} 1.4s infinite linear;
  border-radius: 6px;
`;

const SkeletonCard = styled.div`
  background: ${T.surface};
  border: 1px solid ${T.border};
  border-radius: ${T.radius};
  overflow: hidden;
`;
const SkeletonImg = styled.div`
  ${SkeletonBase};
  height: 190px;
`;
const SkeletonLine = styled.div`
  ${SkeletonBase};
  height: 14px;
  width: ${({ w }) => w || "80%"};
  margin: 10px 18px 0;
`;
const SkeletonThin = styled.div`
  ${SkeletonBase};
  height: 10px;
  width: ${({ w }) => w || "55%"};
  margin: 8px 18px 18px;
`;

// ─── Empty ───────────────────────────────────────────────────────────────────
const Empty = styled.div`
  grid-column: 1 / -1;
  text-align: center;
  padding: 80px 20px;
  animation: ${fadeUp} 0.4s ease both;
`;
const EmptyIcon = styled.div`
  font-size: 3rem;
  margin-bottom: 16px;
`;
const EmptyText = styled.p`
  font-family: "Playfair Display", serif;
  font-size: 1.4rem;
  font-style: italic;
  color: ${T.textSub};
  margin-bottom: 8px;
`;
const EmptySub = styled.p`
  font-size: 0.85rem;
  color: ${T.textMuted};
`;

// ─── Search bar ──────────────────────────────────────────────────────────────
const SearchWrap = styled.div`
  position: relative;
  flex: 1;
  min-width: 0;
  max-width: 340px;

  @media (max-width: 480px) {
    max-width: none;
  }
`;

const SearchInput = styled.input`
  width: 100%;
  background: ${T.surface};
  border: 1px solid ${T.border};
  border-radius: 30px;
  color: ${T.text};
  font-family: "DM Sans", sans-serif;
  font-size: 0.85rem;
  padding: 8px 16px 8px 38px;
  outline: none;
  transition: border-color 0.2s;

  &::placeholder {
    color: ${T.textMuted};
  }
  &:focus {
    border-color: rgba(250, 129, 40, 0.4);
  }
`;

const SearchIcon = styled.span`
  position: absolute;
  left: 13px;
  top: 50%;
  transform: translateY(-50%);
  color: ${T.textMuted};
  font-size: 14px;
  pointer-events: none;
`;

// ─── Main component ───────────────────────────────────────────────────────────
function DiscountsPage(props) {
  const [activeCat, setActiveCat] = useState("All");
  const [sort, setSort] = useState("Popular");
  const [query, setQuery] = useState("");
  const [saved, setSaved] = useState(new Set());
  const [savingId, setSavingId] = useState(null);

  const { getDiscounts, discounts, loading: propsLoading, user, token, addToWishlist, removeFromWishlist, wishlist } = props;

  // Fetch discounts on mount if not already loaded
  useEffect(() => {
    if (!discounts?.results) {
      getDiscounts();
    }
  }, [discounts, getDiscounts]);

  // Initialize saved state from wishlist
  useEffect(() => {
    if (wishlist?.results) {
      const savedIds = new Set(wishlist.results.map(item => item.discount?.id || item.discount));
      setSaved(savedIds);
    }
  }, [wishlist]);

  // Derive unique category list from live data
  const allDiscounts = discounts?.results || [];
  const cats = [
    "All",
    ...[
      ...new Set(allDiscounts.flatMap((d) => d.categories.map((c) => c.name))),
    ],
  ];

  const loading = propsLoading || !discounts?.results;

  // Filter + sort
  const filtered = allDiscounts
    .filter(
      (d) =>
        activeCat === "All" || d.categories.some((c) => c.name === activeCat),
    )
    .filter(
      (d) =>
        !query ||
        d.title.toLowerCase().includes(query.toLowerCase()) ||
        d.location.toLowerCase().includes(query.toLowerCase()),
    )
    .sort((a, b) => {
      if (sort === "Popular") return (b.likes || 0) - (a.likes || 0);
      if (sort === "Biggest Deal")
        return (b.percentage_discount || 0) - (a.percentage_discount || 0);
      return 0;
    });

  const toggleSave = (id) => {
    // Prevent multiple clicks while processing
    if (savingId) return;

    const isCurrentlySaved = saved.has(id);
    
    // Optimistically update UI
    setSaved((prev) => {
      const next = new Set(prev);
      if (isCurrentlySaved) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });

    // If user is not logged in, show alert
    if (!token || !token.access) {
      alert("Please login to save discounts to your wishlist");
      // Revert optimistic update
      setSaved((prev) => {
        const next = new Set(prev);
        if (isCurrentlySaved) {
          next.add(id);
        } else {
          next.delete(id);
        }
        return next;
      });
      return;
    }

    // Set loading state for this specific card
    setSavingId(id);

    // Call appropriate API
    const action = isCurrentlySaved 
      ? removeFromWishlist({ discount_id: id })
      : addToWishlist({ discount_id: id });

    action.then(() => {
      setSavingId(null);
    }).catch((error) => {
      console.error("Wishlist operation failed:", error);
      setSavingId(null);
      // Revert optimistic update on error
      setSaved((prev) => {
        const next = new Set(prev);
        if (isCurrentlySaved) {
          next.add(id);
        } else {
          next.delete(id);
        }
        return next;
      });
      alert("Failed to update wishlist. Please try again.");
    });
  };

  // Format end_date for display
  const formatExpiry = (dateStr) => {
    if (!dateStr) return null;
    const d = new Date(dateStr);
    return d.toLocaleDateString("en-GB", { day: "numeric", month: "short" });
  };

  return (
    <>
      <Global />
      <Page>
        <GrainOverlay />
        <AmbientBlob />

        <Inner>
          {/* ── Header ── */}
          <Header>
            <Headline>
              Fresh deals, <em>no wahala.</em>
            </Headline>
          </Header>

          <Rule />

          {/* ── Controls ── */}
          <Controls>
            <CatRail>
              {cats.map((cat) => (
                <Chip
                  key={cat}
                  $active={activeCat === cat}
                  onClick={() => setActiveCat(cat)}
                >
                  {cat}
                </Chip>
              ))}
            </CatRail>

            <RightControls>
              <SearchWrap>
                <SearchIcon>🔍</SearchIcon>
                <SearchInput
                  placeholder="Search deals..."
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                />
              </SearchWrap>

              <SortSelect
                value={sort}
                onChange={(e) => setSort(e.target.value)}
              >
                {SORTS.map((s) => (
                  <option key={s}>{s}</option>
                ))}
              </SortSelect>
            </RightControls>
          </Controls>

          {/* ── Results meta ── */}
          {!loading && (
            <ResultsMeta>
              <ResultsCount>
                {filtered.length} deal{filtered.length !== 1 ? "s" : ""} found
                {activeCat !== "All" ? ` · ${activeCat}` : ""}
              </ResultsCount>
              <ActiveFilters>
                {activeCat !== "All" && (
                  <FilterPill onClick={() => setActiveCat("All")}>
                    {activeCat} ✕
                  </FilterPill>
                )}
                {query && (
                  <FilterPill onClick={() => setQuery("")}>
                    "{query}" ✕
                  </FilterPill>
                )}
              </ActiveFilters>
            </ResultsMeta>
          )}

          {/* ── Grid ── */}
          <Grid>
            {loading ? (
              Array.from({ length: 6 }).map((_, i) => (
                <SkeletonCard key={i}>
                  <SkeletonImg />
                  <SkeletonLine w="75%" />
                  <SkeletonLine w="55%" />
                  <SkeletonThin w="40%" />
                </SkeletonCard>
              ))
            ) : filtered.length === 0 ? (
              <Empty>
                <EmptyIcon>🔎</EmptyIcon>
                <EmptyText>No discounts found.</EmptyText>
                <EmptySub>Try a different category or search term.</EmptySub>
              </Empty>
            ) : (
            filtered.map((d) => (
                <Card 
                  key={d.id} 
                  discount={d} 
                  onSave={toggleSave} 
                  isSaved={saved.has(d.id)}
                  isLoading={savingId === d.id}
                  bgColor="rgba(14, 13, 11, 0.85)"
                />
              ))
            )}
          </Grid>
        </Inner>
      </Page>
    </>
  );
}

const mapStateToProps = (state) => ({
  discounts: state.discountState.discounts,
  loading: state.discountState.loading,
  user: state.userState.user,
  token: state.userState.token,
  wishlist: state.discountState.wishlist,
});

const mapDispatchToProps = (dispatch) => ({
  getDiscounts: () => dispatch(getDiscountsAPI()),
  addToWishlist: (data) => dispatch(addToWishlistAPI(data)),
  removeFromWishlist: (data) => dispatch(removeFromWishlistAPI(data)),
});

export default connect(mapStateToProps, mapDispatchToProps)(DiscountsPage);
