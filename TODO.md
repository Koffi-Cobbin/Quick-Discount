# Task: Implement getUserDiscountLikesAPI similar to getDiscountsAPI, call on Home.js load if logged in

## Progress
- [x] Create TODO.md ✅

## Steps to Complete
1. ✅ Update src/actions/actionType.js - Add USER_DISCOUNT_LIKES constant ✅
2. Update src/actions/index.js - Add setUserDiscountLikes action and getUserDiscountLikesAPI thunk
2. Update src/actions/index.js - Add setUserDiscountLikes action and getUserDiscountLikesAPI thunk
3. Update src/reducers/discountReducer.js - Add userDiscountLikes to initState and SET_USER_DISCOUNT_LIKES case
4. Update src/components/Home/Home.js - Import/dispatch getUserDiscountLikesAPI if token.access exists
5. Test: Login → Load home → Verify API call & Redux state (userDiscountLikes populated)
6. Mark complete & attempt_completion

**Current Step: 1/6**
