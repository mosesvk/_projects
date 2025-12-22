# Options Modal Functionality

## Overview

This document describes the implementation and fixes for the Options Modal slider functionality, specifically for the Giving Units and Missionary Units dual-range sliders.

## External Libraries

- **Alpine.js v2.x**: Used for reactive data binding and event handling via `x-data`, `x-on`, `x-model`, `x-init`, and `x-bind` directives
- **Tailwind CSS v2.2.15**: Used for styling and layout classes
- **Flowbite v2.1.1**: Used for modal components

## Modal Structure

The Options Modal contains filter controls including:
- **Dropdown Filters**: Area Served, Type, Client(s)
- **Dual-Range Sliders**: Giving Units, Missionary Units (with visual circles)
- **Text Input Ranges**: Total Assets, Total Revenue (text inputs only)

## Slider Implementation

### Component Structure

Each slider (Giving Units and Missionary Units) consists of:

1. **Text Input Fields** (Min/Max): Manual value entry with comma formatting
2. **Container Div**: Handles mouse events and manages input switching
3. **Two Overlapping Range Inputs**: 
   - Min range input (initially active, z-index: 21)
   - Max range input (initially disabled, z-index: 20)
4. **Visual Elements**:
   - Gray background track
   - Green filled bar (between min and max positions)
   - Two green circular indicators (min and max thumbs)

### Key Files

- **HTML Structure**: `src/Index.html` (lines ~4762-4958 for Giving Units, ~4833-5027 for Missionary Units)
- **Range Functions**: `src/utility/Utility.js`
  - `range()` - Giving Units slider logic
  - `missionaryRange()` - Missionary Units slider logic
  - `assetsRange()` - Total Assets logic
  - `revenueRange()` - Total Revenue logic

## Fixes Implemented

### 1. Slider Value Updates Not Triggering Queries

**Problem**: When moving sliders, values updated in the input boxes but didn't trigger query updates. Manual input worked correctly.

**Solution**: Changed slider `x-on:input` handlers from `mintrigger(false)` to `mintrigger(true)` and `maxtrigger(false)` to `maxtrigger(true)`.

**Location**: `src/Index.html` lines ~4796, 4806, 4866, 4876

**Code Pattern**:
```html
<input
  type="range"
  x-on:input="mintrigger(true, true)"  <!-- Changed from mintrigger(false) -->
  x-model="minprice"
/>
```

### 2. Clickable Area Misalignment

**Problem**: When dragging circles, the clickable area moved away from the visual circle position.

**Solution**: 
- Changed range inputs from `pointer-events-none` to `pointer-events-auto`
- Added `pointer-events-none` to visual circle elements
- Implemented dynamic z-index switching based on click proximity

**Location**: `src/Index.html` lines ~4909-4950

**Key Changes**:
- Range inputs: `pointer-events-auto` (enables interaction)
- Visual circles: `pointer-events-none` (allows clicks to pass through)
- Container mousedown handler manages which input is active

### 3. Conditional Rounding Behavior

**Problem**: Values were always rounded to nearest 100/100000, even when typing manually.

**Solution**: Added `shouldRound` parameter to all `mintrigger` and `maxtrigger` functions.

**Location**: 
- `src/utility/Utility.js` - All range functions (lines ~1832, 1868, 1915, 1945, etc.)
- `src/Index.html` - Slider handlers pass `true` for rounding, blur handlers don't

**Implementation**:
```javascript
mintrigger(shouldDispatchEvent = true, shouldRound = false) {
  // ... value parsing ...
  if (shouldRound) {
    this.minprice = Math.round(this.minprice / 100) * 100;
  }
  // ... rest of logic ...
}
```

**Usage**:
- Slider input: `mintrigger(true, true)` - rounds and dispatches event
- Manual input blur: `mintrigger(true)` - no rounding, dispatches event
- Changed `step="100"` to `step="1"` on range inputs for smoother movement

### 4. Min/Max Circle Clickability Issues

**Problem**: 
- Min circles required multiple clicks to activate
- Clicking min then max would still drag min
- "Taking turns" behavior between min and max

**Solution**: Implemented dynamic input switching with event interception:

**Location**: `src/Index.html` lines ~4790-4907

**Key Components**:

1. **Container Mousedown Handler**:
   - Calculates which thumb (min/max) is closer to click
   - Detects if switching is needed
   - If switching: prevents event, switches pointer-events/z-index, manually dispatches event to correct input
   - If no switch: updates pointer-events and allows event to proceed

2. **Mousemove Handler**:
   - Updates cursor (pointer/default) based on proximity to thumbs
   - **Pre-activates** the correct input when hovering near a thumb
   - This allows immediate click-and-drag without needing to click first

3. **Mouseup Handler**:
   - Re-enables both inputs after dragging completes

**Code Structure**:
```html
<div
  x-on:mousedown="
    // Calculate distances to thumbs
    // Determine which should be active
    // If switching needed: prevent event, switch, manually trigger
    // If no switch: update pointer-events
  "
  x-on:mouseup="
    // Re-enable both inputs
  "
  x-on:mousemove="
    // Update cursor and pre-activate correct input
  "
>
  <input type="range" ... /> <!-- Min input -->
  <input type="range" ... /> <!-- Max input -->
  <div> <!-- Visual elements with pointer-events-none --> </div>
</div>
```

### 5. Cursor Behavior

**Problem**: Pointer cursor showed over entire green bar, not just circles.

**Solution**: 
- Removed `cursor-pointer` class from range inputs
- Set initial cursor to `default` via inline style
- Mousemove handler updates cursor to `pointer` only when within 5% threshold of thumb positions

**Location**: `src/Index.html` lines ~4874-4906

### 6. Null Reference Errors

**Problem**: Errors when querySelector returned null elements.

**Solution**: Added null checks in all handlers:
- `if (!minInput || !maxInput) return;` in mousedown
- `if (minInput && maxInput)` in mousemove
- `if (minInput)` and `if (maxInput)` in mouseup

## Technical Details

### Range Function Structure

Each range function (`range()`, `missionaryRange()`, etc.) returns an Alpine.js data object with:

- **State Properties**:
  - `minprice`, `maxprice`: Current values
  - `min`, `max`: Range boundaries
  - `minthumb`, `maxthumb`: Thumb position percentages (0-100)

- **Methods**:
  - `mintrigger(shouldDispatchEvent, shouldRound)`: Updates min value, calculates thumb position, updates DOM, optionally rounds and dispatches `filtersChanged` event
  - `maxtrigger(shouldDispatchEvent, shouldRound)`: Same for max value

### Event Flow

1. **User Interaction**:
   - Hover → `mousemove` handler pre-activates correct input
   - Click → `mousedown` handler checks if switch needed, switches if necessary
   - Drag → Active range input handles via native browser behavior
   - Release → `mouseup` handler re-enables both inputs

2. **Filter Updates**:
   - Range input `x-on:input` → calls `mintrigger(true, true)` or `maxtrigger(true, true)`
   - Function dispatches `filtersChanged` CustomEvent
   - `Api.js` listens for event and updates queries

### Z-Index and Pointer Events Strategy

- **Min Input**: Initially z-index 21, pointer-events auto
- **Max Input**: Initially z-index 20, pointer-events none
- **Dynamic Switching**: Based on which thumb is closer to mouse position
- **Visual Elements**: All have `pointer-events-none` to allow clicks to pass through

### Threshold Values

- **Clickable Area**: 5% threshold around each thumb position
- **Rounding Steps**:
  - Giving/Missionary Units: 100
  - Assets/Revenue: 100000

## Current Implementation Status

✅ Slider values trigger query updates  
✅ Clickable areas align with visual circles  
✅ Rounding only occurs on slider movement, not manual input  
✅ Min and max circles are independently clickable  
✅ Cursor shows pointer only over circles  
✅ No null reference errors  
✅ Hovering pre-activates correct input for immediate drag

## Notes

- The implementation uses native HTML5 range inputs with custom styling
- Visual circles are purely decorative (pointer-events-none)
- Actual interaction happens through the invisible range inputs
- Dynamic z-index and pointer-events management ensures correct input receives events

