# TODO - Fix Loading Message Glitch

## Task: Optimize the loading message functionality to ensure seamless and efficient performance

### Steps:
- [x] 1. Fix `src/actions/index.js` - Update createDiscountAPI to properly manage loading state
- [x] 2. Fix `src/components/Payment/Paystack.js` - Consolidate useEffect hooks to eliminate race conditions
- [x] 3. Fix `src/components/Shared/Loading.js` - Add auto-dismiss for success messages + fix image display

### Progress:
- [x] Step 1: Fix createDiscountAPI loading state
- [x] Step 2: Fix Paystack useEffect race conditions
- [x] Step 3: Add auto-dismiss to Loading component + fix stretched images

### Summary of Changes:
1. **actions/index.js**: Added `setLoading(false)` after successful discount creation, after failure, and in catch block. Also added error message dispatch in catch block.

2. **Paystack.js**: Consolidated two separate useEffect hooks into one with a ref to prevent race conditions. Added auto-redirect after 2.5 seconds to ensure smooth transition.

3. **Loading.js**: 
   - Added auto-dismiss timer (3 seconds) for success messages to prevent flickering/glitching
   - Fixed image display: Larger card (320px) when displaying messages
   - Added proper SuccessIcon component with correct SVG image sizing (48x48px)
   - Hides duplicate images from message JSX
   - Shows appropriate icon (tick-circle.svg for success, error.svg for errors)
   - Properly styles text based on message type (success/error)

