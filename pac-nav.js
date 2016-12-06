;(function($)  {

	/**
	 * PacNav v1.1.3
	 *
	 * A menu compression script that provides variable navigation layout. PacNav consists of 2 primary elements, a
	 * desktop ul (PacNav--desktop) and a mobile ul (PacNav--mobile) that are displayed in varying state to create a
	 * single fluid navigation.
	 *
	 * DESKTOP STATE (PacNav--is-desktop): full desktop nav is visible and the full mobile nav is hidden.
	 *
	 * INTERMEDIATE STATE (PacNav--is-intermediary): PacNav "moves" menu items (by hiding in desktop, and showing in
	 * mobile) from the full nav (Desktop) to the compressed nav (Mobile).
	 *
	 * MOBILE STATE (PacNav--is-mobile): mobile nav is displayed by clicking the menu toggle (hamburger menu) the
	 * desktop nav is hidden
	 *
	 * FIXED ELEMENTS: items in the desktop nav that should always show (in intermediate and mobile states) these
	 * are very useful for CTAs that should always be available.
	 *
	 * NOTE: If you experience unexpected behavior with PacNav at intermediate breakpoints the cause is usually CSS
	 * changes to the dom elements. For example, hiding elements (CTA, etc.) within the nav can cause calculations
	 * to change making PacNav "jump" between intermediary and mobile as the element is hidden/shown.
	 *
	 * To debug PacNav start with your CSS!
	 *
	 */
	$.fn.extend({

		pacNav: function(_options) {
			/**
			 * Default options can be overridden by passing options object when instantiating pacNav
			 *
			 * Supported options:
			 * - childSelector: dom selector to identify child elements
			 * - direction: CURRENTLY UNIMPLEMENTED
			 * - minVisible: minimum number of unfixed items to show before transitioning to mobile nav state
			 * - offsetWidth: pixels the nav is offset horizontally within available space (used for more accurate calculations)
			 * - mobileOffsetForIntermediary: pixels to offset mobile nav in intermediary state (use for more accurate styling)
			 * - closeMobileDesktopOnly: override to prevent window listener from closing mobile nav (more forgiving for mistaps on smaller screens)
			 * - callback__toggle__onClick: menu toggle click callback function
			 */
			var options = $.extend({
				childSelector: '> *',
				direction: 'ltr',
				minVisible: 2,
				offsetWidth: 0,
				mobileOffsetForIntermediary: false,
				closeMobileDesktopOnly: false
			}, _options);

			// setup each PacNav on the page
			this.each(function() {

				var $dotsSvg                = $('<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M16 12a2 2 0 1 1 4.001.001A2 2 0 0 1 16 12m-6 0a2 2 0 1 1 4.001.001A2 2 0 0 1 10 12m-6 0a2 2 0 1 1 4.001.001A2 2 0 0 1 4 12z" fill="#000"></path></svg>');
				var $menuSvg                = $('<?xml version="1.0" encoding="UTF-8" standalone="no"?><svg width="42px" height="24px" viewBox="0 0 42 24" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"><g id="lines" stroke="none" stroke-width="1" fill="#000" fill-rule="evenodd"><rect id="line-1" x="0" y="0" width="42" height="4"></rect><rect id="line-2" x="0" y="10" width="42" height="4"></rect><rect id="line-3" x="0" y="10" width="42" height="4"></rect><rect id="line-4" x="0" y="20" width="42" height="4"></rect></g></svg>');
				var $closeSvg				= $('<?xml version="1.0" encoding="UTF-8"?><svg width="26px" height="25px" viewBox="0 0 26 25" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"><defs></defs><g id="Welcome" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd"><g id="MobileNav" transform="translate(-262.000000, -31.000000)" fill="#FFFFFF"><g id="Group" transform="translate(262.000000, 31.000000)"><rect id="Rectangle" transform="translate(13.000000, 12.500000) rotate(-45.000000) translate(-13.000000, -12.500000) " x="-3" y="11" width="32" height="3"></rect><rect id="Rectangle" transform="translate(13.000000, 12.500000) scale(-1, 1) rotate(-45.000000) translate(-13.000000, -12.500000) " x="-3" y="11" width="32" height="3"></rect></g></g></g></svg>');

				var navState                = 'desktop';
				var isMobileNavOpen			= false;
				var navItems				= [];
				var fixedNavItems			= [];
				var unfixedNavItems			= [];

				var $pacNav					= $(this);
				var $window					= $(window);
				var $navContents			= $pacNav.children();
				var $navItems        		= $(options.childSelector, $pacNav);
				var $fixedNavItems       	= $(options.childSelector + '.PacNav-fixed', $pacNav);
				var $navToggle				= $('<div>').addClass('PacNav-toggle');
				var $desktopNav				= $('<div>').addClass('PacNav--desktop');
				var $mobileNav				= $('<div>').addClass('PacNav--mobile').addClass('PacNav--hidden');

				var fixedItemsWidth         = 0;

				var $desktopNavItems		= null;
				var $fixedDesktopNavItems   = null;
				var $unfixedDesktopNavItems = null;

				var $mobileNavItems			= null;
				var $fixedMobileNavItems	= null;
				var $unfixedMobileNavItems	= null;

				var resizeTime;
				var inTimeout 				= false;
				var resizeDelay 			= 100;

				/**
				 * closeMobileNav()
				 *
				 * binds to window click event below to close menu when user clicks outside of it
				 */
				var closeMobileNav = function()
				{
					if (isMobileNavOpen)
					{
						/**
						 * if override option is not set, close mobile nav for all navState
						 * if override option for closing mobile nav is set do NOT close for mobile navState
						 *
						 * optionally more forgiving for mistaps on the mobile nav, by requriing menu toggle tap to close the nav
						 */
						if (!options.closeMobileDesktopOnly || (options.closeMobileDesktopOnly && navState != 'mobile'))
						{
							toggleMobileNav();
						}
					}
				}

				/**
				 * eatPellets()
				 *
				 * This is where the magic happens:
				 * - Loop all unfixed items, toggle visibility based on available space
				 * - Set menu state based on calculations (desktop, intermediary, or mobile)
				 * - Calculate positioning based on updates to nav
				 */
				var eatPellets = function()
				{
					var visibleItems = 0;
					var calculatedWidth = 0;
					var desktopWidth = $desktopNav.innerWidth() - options.offsetWidth - fixedItemsWidth;

					// loop all unfixed nav items
					for (var i = 0; i < $unfixedDesktopNavItems.length; i++)
					{
						// update used width (calculatedWidth) by adding this items width to the current value
						calculatedWidth += unfixedNavItems[i].width;

						// if the item is eligible to be hidden (unfixed) and falls outside of the currently available
						// space, or it's the last item in our nav and our offset is greater than the difference between
						// available/needed space hide the item
						if ((i < $unfixedDesktopNavItems.length - 1 && calculatedWidth > desktopWidth) ||
							(i == $unfixedDesktopNavItems.length - 1 && calculatedWidth - desktopWidth > options.offsetWidth))
						{
							$unfixedDesktopNavItems.eq(i)
								.removeClass('PacNav--visible')
								.addClass('PacNav--hidden');

							$unfixedMobileNavItems.eq(i)
								.removeClass('PacNav--hidden')
								.addClass('PacNav--visible');
						}
						// otherwise show the item and increment our visible item count
						else
						{
							$unfixedDesktopNavItems.eq(i)
								.removeClass('PacNav--hidden')
								.addClass('PacNav--visible');

							$unfixedMobileNavItems.eq(i)
								.removeClass('PacNav--visible')
								.addClass('PacNav--hidden');

							visibleItems++;
						}
					}

					// if the number of visible items is less than the minimum, and our state isn't mobile, set to mobile
					if (visibleItems < options.minVisible)
					{
						$unfixedDesktopNavItems
							.removeClass('PacNav--visible')
							.addClass('PacNav--hidden');

						$unfixedMobileNavItems
							.removeClass('PacNav--hidden')
							.addClass('PacNav--visible');

						$pacNav
							.removeClass('PacNav--is-desktop')
							.removeClass('PacNav--is-intermediary')
							.addClass('PacNav--is-mobile')
							.trigger('PacNav--is-mobile');

						$('body')
							.removeClass('PacNav--is-desktop')
							.removeClass('PacNav--is-intermediary')
							.addClass('PacNav--is-mobile');

						if (navState != 'mobile')
						{
							$navToggle.empty().append($menuSvg);
						}

						navState = 'mobile';
					}

					// if all unfixed items are visible, and our state isn't desktop, set to desktop
					else if (navState != 'desktop' && visibleItems == unfixedNavItems.length)
					{

						$pacNav
							.removeClass('PacNav--is-intermediary')
							.removeClass('PacNav--is-mobile')
							.addClass('PacNav--is-desktop')
							.trigger('PacNav--is-desktop');

						$('body')
							.removeClass('PacNav--is-intermediary')
							.removeClass('PacNav--is-mobile')
							.addClass('PacNav--is-desktop');

						$navToggle.empty();
						navState = 'desktop';
					}

					// if the number of visible items is less than all, but more than our minimum, and menu state isn't
					// intermediary, set state to intermediary
					else if (navState != 'intermediary' && visibleItems < unfixedNavItems.length && visibleItems >= options.minVisible)
					{
						$pacNav
							.removeClass('PacNav--is-desktop')
							.removeClass('PacNav--is-mobile')
							.addClass('PacNav--is-intermediary')
							.trigger('PacNav--is-intermediary');

						$('body')
							.removeClass('PacNav--is-desktop')
							.removeClass('PacNav--is-mobile')
							.addClass('PacNav--is-intermediary');

						$navToggle.empty().append($dotsSvg);
						navState = 'intermediary';
					}

					recalculateFixedItems();
					setIntermediaryMobileOffset();
				};

				/**
				 * Initialize our PacNav
				 * - Calculate item positions (startingCalculations())
				 * - Setup our custom elements (instantiateDom())
				 * - Configure default menu state (eatPellets())
				 *
				 */
				var init = function()
				{
					startingCalculations();
					instantiateDom();

					// TODO: fix so we don't have to call this twice.
					eatPellets();
					eatPellets();

					// configure window event listeners
					$window
						.bind('click', closeMobileNav)
						.bind('resize', eatPellets)
						.bind('resize', function() {
							$('body').removeClass('PacNav--is-scrolling');
						})
						.bind('scroll', function() {
							$('body').addClass('PacNav--is-scrolling');
						})
						.bind('orientationchange', function(e) {
							// resize fires too quickly on mobile device orientation change
							// impose a small timeout, then call eatPellets to ensure proper nav display
							resizeTime = new Date();
							if (inTimeout === false) {
								inTimeout = true;
								setTimeout(endResizeDelay, resizeDelay);
							}
						});

					// sub-menu collision avoidance
					$('.PacNav--desktop li:not(.PacNav-fixed)').bind({mouseenter: function(e){
						closeMobileNav();
					}});

					// configure mobile nav listener
					$mobileNavItems
						.bind('click', function(e) {
							e.stopPropagation();
						});

					// configure menu toggle listener
					$navToggle
						.bind('click', toggleMobileNav);

					// update body dom element to confirm initialization complete
					$('body').addClass('PacNav--loaded');
				};

				/**
				 * Setup custom dom elements needed for PacNav
				 */
				var instantiateDom = function()
				{
					// convert source nav to the desktop & mobile variants we need
					$pacNav
						.empty()
						.append($desktopNav.append($navContents.clone()))
						.append($mobileNav.append($navContents.clone()));

					// if we have a toggle in our nav grab it
					if ($('.PacNav-toggle', $desktopNav).length)
					{
						$navToggle = $('.PacNav-toggle', $desktopNav);
					}
					// otherwise create it using our default toggle
					else
					{
						$pacNav.append($navToggle);
					}

					// update mobile & desktop variables based on generated nav
					$mobileNavItems         = $(options.childSelector, $mobileNav);
					$fixedMobileNavItems    = $(options.childSelector + '.PacNav-fixed', $mobileNav);
					$unfixedMobileNavItems  = $(options.childSelector + ':not(.PacNav-fixed)', $mobileNav);

					$desktopNavItems        = $(options.childSelector, $desktopNav);
					$fixedDesktopNavItems   = $(options.childSelector + '.PacNav-fixed', $desktopNav);
					$unfixedDesktopNavItems = $(options.childSelector + ':not(.PacNav-fixed)', $desktopNav);
				};

				/**
				 * Calculate starting positions
				 *
				 * Values used by eatPellets() to determine nav display/state
				 */
				var startingCalculations = function()
				{
					$navItems.each(function() {

						var ele = $(this)[0];
						var style = ele.currentStyle || window.getComputedStyle(ele);
						var rect = ele.getBoundingClientRect();
						var margins = parseInt(style.marginLeft, 10) + parseInt(style.marginRight, 10);
						var width;

						// IE will return auto margin as string, not numeric value, this fixes that
						margins = (isNaN(margins)) ? 0 : margins;

						// if we can get the element width, use it
						if (rect.width)
						{
							width = rect.width + margins;
						}
						// otherwise calculate it based on distance between sides
						else
						{
							width = (rect.right - rect.left) + margins;
						}

						// update nav object
						navItems.push({
							width: width
						});

						// if it's a fixed item add it to our fixed items object
						if ($(this).hasClass('PacNav-fixed'))
						{
							fixedItemsWidth += width;

							fixedNavItems.push({
								width: width
							});
						}
						// if it's unfixed add it to our unfixed items object
						else
						{
							unfixedNavItems.push({
								width: width
							});
						}

					});
				};

				/**
				 * Adjust the mobile nav when in intermediary state
				 *
				 * Because we use the mobile nav as our "popup" nav in intermediary state the position may need
				 * to be adjusted to accomodate varying layouts. We make that position adjustment here.
				 */
				var setIntermediaryMobileOffset = function()
				{
					var toggle = $navToggle[0];
					var toggleRect = toggle.getBoundingClientRect();

					var nav = $desktopNav[0];
					var navRect = nav.getBoundingClientRect();

					var offset = navRect.right - toggleRect.right - options.mobileOffsetForIntermediary;

					if (navState == 'intermediary') {
						$mobileNav.css({
							right: offset + 'px'
						});
					} else {
						$mobileNav.css({
							right: ''
						});
					}
				};

				/**
				 * Recalculate fixed items
				 *
				 * As the nav state/position/size changes we keep tabs on the fixed items so we can adjust
				 * display accordingly. Updated values used by eatPellets()
				 */
				var recalculateFixedItems = function()
				{
					fixedItemsWidth = 0;
					fixedNavItems = [];

					$fixedDesktopNavItems.each(function() {
						var ele = $(this)[0];
						var style = ele.currentStyle || window.getComputedStyle(ele);
						var rect = ele.getBoundingClientRect();
						var margins = parseInt(style.marginLeft, 10) + parseInt(style.marginRight, 10);
						var width;

						if (rect.width) {
							width = rect.width;// + margins;
						} else {
							width = (rect.right - rect.left);// + margins;
						}

						if (!isNaN(width)) {
							fixedItemsWidth += width;

							fixedNavItems.push({
								width: width
							});
						}
					});
				};

				/**
				 * Toggle mobile nav view state
				 *
				 * When nav is in intermediary state this opens our popup sub-nav. When nav is in mobile state it opens
				 * the full mobile nav.
				 */
				var toggleMobileNav = function(e)
				{
					if (e)
					{
						e.preventDefault();
						e.stopPropagation();
					}

					// toggle state in response to click
					isMobileNavOpen = !isMobileNavOpen;

					// show the mobile nav and update body state identifier
					if (isMobileNavOpen)
					{
						$mobileNav
							.addClass('PacNav--visible')
							.removeClass('PacNav--hidden');

						$('body')
							.addClass('PacNav--visible')
							.removeClass('PacNav--hidden');

						if (navState == 'mobile') {
							$navToggle.empty().append($closeSvg);
						}
					}
					// hide the mobile nav and update body state identifier
					else
					{
						$mobileNav
							.addClass('PacNav--hidden')
							.removeClass('PacNav--visible');

						$('body')
							.addClass('PacNav--hidden')
							.removeClass('PacNav--visible');

						if (navState == 'mobile') {
							$navToggle.empty().append($menuSvg);
						}
					}

					// if a toggle callback function is configured in our options call it now
					if (options.hasOwnProperty('callback__toggle__onClick') && typeof options.callback__toggle__onClick == 'function')
					{
						options.callback__toggle__onClick();
					}
				};

				/**
				 * End delay of resize event response
				 *
				 * When device orientation changes the resize listener fires too soon for accurate reaction by eatPellets
				 * This delay allows the orientationchange listner to eatPellets slightly slower to ensure proper nav display
				 * without affecting desktop resize events
				 */
				var endResizeDelay = function() {
					// if not enough time has elapsed wait again
					if (new Date() - resizeTime < resizeDelay) {
						setinTimeout(endResizeDelay, resizeDelay);
					}
					// otherwise end timeout status and eatPellets()
					else {
						inTimeout = false;
						eatPellets();
					}
				};

				init();

			});
		}

	});

	// Initalize PacNav with our custom settings
	// This could be moved to master.js so PacNav is more modular
	$(document).ready(function() {
		$('.PacNav').pacNav({
			childSelector: '> ul > li',
			mobileOffsetForIntermediary: 22,
			closeMobileDesktopOnly: true
		});
	});

})(jQuery);
