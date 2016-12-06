# PacNav v1.1.3
A menu compression script that provides variable navigation layout.

PacNav consists of 2 primary elements, a desktop ul (PacNav--desktop) and a mobile ul (PacNav--mobile) that are displayed in varying states to create a single fluid navigation.

## State & CSS
PacNav does not include default styles, they will need to be authored per project. 

State | Selector | Description
----- | -------- | -----------
Desktop | .PacNav--is-desktop | full desktop nav is visible and the full mobile nav is hidden.
Intermediate | .PacNav--is-intermediary | PacNav "moves" menu items (by hiding in desktop, and showing in mobile) from the full nav (Desktop) to the compressed nav (Mobile).
Mobile | .PacNav--is-mobile | mobile nav is displayed by clicking the menu toggle (hamburger menu) the desktop nav is hidden

### Additional Selectors
Selector | Description
-------- | -----------
.PacNav-fixed | items in the desktop nav that should always show (in intermediate and mobile states) these are very useful for CTAs that should always be available.
.PacNav-toggle | element to open/close the menu in mobile state
.PacNav--loaded | body class to confirm PacNav initialization is complete

### UI
PacNav generates default SVG icons to indicate menu compression (hidden items), a hamburger icon, and a close icon.

**NOTE** If you experience unexpected behavior with PacNav at intermediate breakpoints the cause is usually CSS changes to the dom elements. For example, hiding elements (CTA, etc.) within the nav can cause calculations to change making PacNav "jump" between intermediary and mobile as the element is hidden/shown.
To debug PacNav start with your CSS!

## Settings
Default options can be overridden by passing options object when instantiating pacNav.

Option | Type | Default | Description
------ | ---- | ------- | -----------
childSelector | string | `'> *'` | dom selector to identify child elements
direction | string | 'ltr' | CURRENTLY UNIMPLEMENTED
minVisible | int | 2 | minimum number of unfixed items to show before transitioning to mobile nav state
offsetWidth | int | 0 | pixels the nav is offset horizontally within available space (used for more accurate calculations)
mobileOffsetForIntermediary | int | false | pixels to offset mobile nav in intermediary state (use for more accurate styling)
closeMobileDesktopOnly | int | false | override to prevent window listener from closing mobile nav (more forgiving for mistaps on smaller screens)
callback__toggle__onClick | function | n/a | menu toggle click callback function

### Example Initialization
```javascript
$(document).ready(function() {
	$('.PacNav').pacNav({
		childSelector: '> ul > li',
		mobileOffsetForIntermediary: 22,
		closeMobileDesktopOnly: true
	});
});
```
