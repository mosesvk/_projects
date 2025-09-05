# Sidebar Collapse Functionality Documentation

## Overview
The CFHI Dashboard implements a collapsible sidebar that can toggle between expanded (w-56) and collapsed (w-14) states. This functionality is primarily handled through JavaScript event listeners and CSS class toggling using Tailwind CSS utility classes.

## HTML Structure

### Main Sidebar Container
**File:** `src/Index.html` (Lines 535-882)

```html
<aside
  id="sidebar"
  class="fixed top-0 left-0 z-20 flex flex-col flex-shrink-0 hidden w-56 h-full pt-16 font-normal duration-75 lg:flex transition-width duration-500 ease-in-out"
>
```

**Key CSS Classes:**
- `fixed top-0 left-0`: Fixed positioning at top-left
- `z-20`: High z-index for layering
- `w-56`: Default expanded width (14rem/224px)
- `transition-width duration-500 ease-in-out`: Smooth width transitions

### Sidebar Content Container
```html
<div
  id="sidebar-content"
  class="flex-1 px-3 space-y-1 bg-white divide-y divide-gray-200 dark:bg-gray-800 dark:divide-gray-700"
>
```

**Key CSS Classes:**
- `px-3`: Default horizontal padding (0.75rem)
- `space-y-1`: Vertical spacing between items

### Sidebar Navigation Items
Each navigation item has the following structure:

```html
<button
  id="enrollmentLink"
  data-popover-target="popoverEnrollment-hover"
  data-popover-trigger="hover"
  data-popover-placement="right"
  class="flex items-center w-full p-2 text-black transition duration-75 rounded-lg group hover:bg-gray-300 dark:text-white dark:hover:bg-gray-700"
>
  <svg class="flex-shrink-0 w-6 h-6" ...></svg>
  <span
    class="flex-1 ml-4 text-left text-xl font-semibold tracking-wide whitespace-nowrap"
    sidebar-toggle-item=""
  >
    Demo
  </span>
</button>
```

**Key Elements:**
- `data-popover-target`: Links to hover tooltip
- `sidebar-toggle-item=""`: Custom attribute for text elements
- `ml-4`: Left margin for text spacing

### Popover Tooltips
Each sidebar item has an associated popover for collapsed state:

```html
<div
  data-popover
  id="popoverEnrollment-hover"
  role="tooltip"
  class="hidden absolute z-10 invisible inline-block w-64 transition-opacity duration-300 border border-gray-700 rounded-lg shadow-sm opacity-0"
>
```

**Key CSS Classes:**
- `hidden`: Initially hidden
- `absolute z-10`: Positioned above other elements
- `w-64`: Fixed width for tooltip content

### Main Content Area
```html
<div
  id="main-content"
  class="relative w-full h-full overflow-y-auto bg-gray-50 ml-56 dark:bg-gray-900 transition-width duration-500 ease-in-out"
>
```

**Key CSS Classes:**
- `ml-56`: Default left margin matching sidebar width
- `transition-width duration-500 ease-in-out`: Smooth margin transitions

### Toggle Buttons
**Hamburger Menu Button:**
```html
<button
  id="toggleSidebarMobile"
  aria-expanded="true"
  aria-controls="sidebar"
  class="p-2 text-gray-600 rounded cursor-pointer hover:text-gray-900 hover:bg-gray-100 focus:ring-2 focus:ring-gray-100 dark:focus:ring-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
>
  <svg id="toggleSidebarMobileHamburger" class="w-6 h-6" ...></svg>
  <svg id="toggleSidebarMobileClose" class="hidden w-6 h-6" ...></svg>
</button>
```

**Backdrop Overlay:**
```html
<div
  id="sidebarBackdrop"
  class="fixed inset-0 z-10 hidden bg-gray-900/50 dark:bg-gray-900/90"
></div>
```

## JavaScript Functionality

### Core Functions
**File:** `src/content/uiManagement.js`

#### 1. `toggleSidebarWidth(sidebar)`
**Lines 2-18**

```javascript
const toggleSidebarWidth = (sidebar) => {
  sidebar.classList.toggle("w-56");
  sidebar.classList.toggle("w-14");
  // Toggle ml-64 and ml-14 classes on main-content
  mainContent.classList.toggle("ml-56");
  mainContent.classList.toggle("ml-14");

  sidebarContent.classList.toggle("px-3");
  sidebarContent.classList.toggle("px-2");

  demoContentHeader.classList.toggle("hidden");
  cashContentHeader.classList.toggle("hidden");
  debtContentHeader.classList.toggle("hidden");
  incomeContentHeader.classList.toggle("hidden");
  expenseContentHeader.classList.toggle("hidden");
  reportContentHeader.classList.toggle("hidden");
};
```

**Functionality:**
- Toggles sidebar width between `w-56` (expanded) and `w-14` (collapsed)
- Adjusts main content margin from `ml-56` to `ml-14`
- Changes sidebar content padding from `px-3` to `px-2`
- Shows/hides content headers in collapsed state

#### 2. `togglePopoverVisibility()`
**Lines 42-47**

```javascript
const togglePopoverVisibility = () => {
  const popoverDivs = document.querySelectorAll("div[id^='popover']");
  popoverDivs.forEach((popoverDiv) => {
    popoverDiv.classList.toggle("hidden");
  });
};
```

**Functionality:**
- Toggles visibility of all popover tooltips
- Uses `hidden` class to show/hide tooltips

#### 3. `handleSidebarButtonClick()`
**Lines 35-39**

```javascript
const handleSidebarButtonClick = () => {
  toggleSidebarWidth(sidebar);
  togglePopoverVisibility(); // Toggle visibility of popover divs
  toggleListItemsPadding(); // Toggle padding on sidebar list items
};
```

**Functionality:**
- Main handler for sidebar toggle actions
- Calls all necessary toggle functions
- **Note:** `toggleListItemsPadding()` is referenced but not defined in current code

### Event Listeners
**Lines 71-75**

```javascript
toggleSidebarMobileClose.addEventListener("click", () => {
  handleSidebarButtonClick(); // Toggle sidebar width and main content margin-left
});
toggleSidebarMobileHamburger.addEventListener("click", handleSidebarButtonClick);
sidebarBackdrop.addEventListener("click", handleSidebarButtonClick);
```

**Event Sources:**
1. **Hamburger Icon:** `toggleSidebarMobileHamburger`
2. **Close Icon:** `toggleSidebarMobileClose`
3. **Backdrop Click:** `sidebarBackdrop`

### Element References
**Lines 20-33**

```javascript
const sidebar = document.getElementById("sidebar");
const sidebarBackdrop = document.getElementById("sidebarBackdrop");
const toggleSidebarMobileHamburger = document.getElementById("toggleSidebarMobileHamburger");
const toggleSidebarMobileClose = document.getElementById("toggleSidebarMobileClose");
const sidebarButtons = document.querySelectorAll("button[id$='Link']");
const tabContents = document.querySelectorAll(".tab-content");
const mainContent = document.getElementById("main-content");
const sidebarContent = document.getElementById("sidebar-content");
const demoContentHeader = document.getElementById("demoContentHeader");
const cashContentHeader = document.getElementById("cashContentHeader");
const debtContentHeader = document.getElementById("debtContentHeader");
const incomeContentHeader = document.getElementById("incomeContentHeader");
const expenseContentHeader = document.getElementById("expenseContentHeader");
const reportContentHeader = document.getElementById("reportContentHeader");
```

## CSS Classes and States

### Width Classes
- **Expanded State:** `w-56` (14rem/224px)
- **Collapsed State:** `w-14` (3.5rem/56px)

### Margin Classes
- **Expanded State:** `ml-56` (14rem left margin)
- **Collapsed State:** `ml-14` (3.5rem left margin)

### Padding Classes
- **Expanded State:** `px-3` (0.75rem horizontal padding)
- **Collapsed State:** `px-2` (0.5rem horizontal padding)

### Visibility Classes
- **Hidden:** `hidden` (display: none)
- **Visible:** No class (default display)

### Transition Classes
- **Smooth Transitions:** `transition-width duration-500 ease-in-out`

## User Interaction Flow

### 1. User Clicks Toggle Button
```
User clicks hamburger/close icon
↓
Event listener triggers handleSidebarButtonClick()
```

### 2. Sidebar Width Toggle
```
toggleSidebarWidth() executes
↓
Sidebar: w-56 ↔ w-14
Main Content: ml-56 ↔ ml-14
Sidebar Content: px-3 ↔ px-2
```

### 3. Content Visibility Toggle
```
Content headers toggle hidden class
↓
Headers show/hide based on sidebar state
```

### 4. Popover Toggle
```
togglePopoverVisibility() executes
↓
All popover divs toggle hidden class
↓
Tooltips show/hide based on sidebar state
```

### 5. Visual Update
```
CSS transitions animate changes
↓
Smooth 500ms transition completes
```

## Mobile Responsiveness

### Desktop Behavior
- Sidebar is visible by default (`lg:flex`)
- Toggle buttons control collapse/expand
- Smooth transitions between states

### Mobile Behavior
- Sidebar is hidden by default (`hidden`)
- Overlay backdrop appears when open
- Clicking backdrop closes sidebar

## Files Involved

### Primary Files
1. **`src/Index.html`** - HTML structure and CSS classes
2. **`src/content/uiManagement.js`** - Main JavaScript functionality

### Supporting Files
3. **`src/functions/Utility.js`** - Contains `closeSidebarAfterSelectingOption()` function
4. **`src/components/Header.js`** - Dropdown functionality (related but separate)

## Missing Functionality

### `toggleListItemsPadding()` Function
**Issue:** Referenced in `handleSidebarButtonClick()` but not defined
**Location:** `src/content/uiManagement.js:38`
**Impact:** Function call will cause JavaScript error
**Recommendation:** Either implement the function or remove the call

## CSS Framework Dependencies

### Tailwind CSS Classes Used
- **Width:** `w-56`, `w-14`
- **Margin:** `ml-56`, `ml-14`
- **Padding:** `px-3`, `px-2`
- **Visibility:** `hidden`
- **Transitions:** `transition-width`, `duration-500`, `ease-in-out`
- **Positioning:** `fixed`, `absolute`, `relative`
- **Z-index:** `z-10`, `z-20`

### Flowbite Integration
- **Popover System:** Uses Flowbite's popover data attributes
- **Data Attributes:** `data-popover-target`, `data-popover-trigger`, `data-popover-placement`

## Performance Considerations

### CSS Transitions
- **Duration:** 500ms for smooth user experience
- **Easing:** `ease-in-out` for natural feel
- **Properties:** Only `width` and `margin` transitions

### JavaScript Performance
- **Event Delegation:** Efficient event listener management
- **DOM Queries:** Cached element references
- **Class Toggling:** Native browser optimization

## Accessibility Features

### ARIA Attributes
- **`aria-expanded`:** Indicates sidebar state
- **`aria-controls`:** Links toggle to sidebar
- **`role="tooltip"`:** Proper tooltip semantics

### Keyboard Navigation
- **Focus Management:** Proper focus handling
- **Tab Order:** Logical navigation sequence

## Browser Compatibility

### CSS Features
- **CSS Grid:** Modern layout support
- **CSS Transitions:** Widely supported
- **CSS Custom Properties:** Modern browsers

### JavaScript Features
- **ES6+:** Arrow functions, const/let
- **DOM APIs:** Modern element selection
- **Event Handling:** Standard event listeners
