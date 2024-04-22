(function() {
  "use strict";

  ready(function() {

    // Restore focus after page reload
    var returnFocusTo = sessionStorage.getItem('returnFocusTo');
    if (returnFocusTo) {
      sessionStorage.removeItem('returnFocusTo');
      var returnFocusToEl = document.querySelector(returnFocusTo);
      returnFocusToEl && returnFocusToEl.focus && returnFocusToEl.focus();
    }

    // Render inline micro-templates
    each('[data-element="template"]', function(el) {
      if (el.hasAttribute('data-template')) {
        Util.renderTemplate(el, el.getAttribute('data-template'));
      }
    });

    /**
     * Converts HTML links within a given element into objects.
     * @param el
     * @returns {[]}
     */
    var convertLinksToObjects = function(el) {
      return Array.prototype.map.call(el.querySelectorAll('a'), function(a) {
        return { title: a.innerText, html_url: a.href };
      });
    };

    // Render Zendesk helper micro-templates
    // @see https://developer.zendesk.com/documentation/help_center/help-center-templates/helpers/
    var supportedHelpers = ['breadcrumbs', 'recent-articles', 'related-articles', 'recent-activity', 'share'];
    supportedHelpers.forEach(function(helper) {
      each('[data-element="' + helper + '"]', function(el) {
        if (el.hasAttribute('data-template')) {
          var data = {};

          // Breadcrumb helper data
          if (helper === 'breadcrumbs') {
            data = { breadcrumbs: convertLinksToObjects(el) };
          }

          // Recent and related articles helper data
          else if (helper === 'recent-articles' || helper === 'related-articles') {
            data = { articles: convertLinksToObjects(el) };
          }

          // Recent activity helper data
          else if (helper === 'recent-activity') {
            data = { items: convertLinksToObjects(el) };
          }

          // Social share links helper data
          else if (helper === 'share') {
            var links = Array.prototype.map.call(el.querySelectorAll('a'), function(a) {
              var svg = a.querySelector('svg');
              return {
                title: a.getAttribute('aria-label'),
                description: svg ? svg.getAttribute('aria-label') : '',
                html_url: a.href
              };
            });
            data = { links: links };
          }

          // Render the micro-template
          Util.renderTemplate(el, el.getAttribute('data-template'), data);
        }
      });
    });

    // Open social sharing links in a new window
    each('.share a', function(a) {
      a.addEventListener('click', function(e) {
        e.preventDefault();
        window.open(this.href, '', 'height = 500, width = 500');
      });
    });

    // Add focus classname to search field
    each('.form-field [type="search"]', function(el) {
      el.addEventListener('focus', function() { this.parentNode.classList.add(Util.classNames.FOCUS); });
      el.addEventListener('focusout', function() { this.parentNode.classList.remove(Util.classNames.FOCUS); });
    });

    // Replace images with inline SVG
    Array.prototype.forEach.call(document.querySelectorAll('[data-inline-svg]'), Util.replaceWithSVG);

    // Smooth scroll
    function maybeScroll() {
      var smoothScroll = Util.getURLParameter('smooth-scroll', window.location);
      if (smoothScroll === 'true' && window.location.hash) {
        var offset = Util.getURLParameter('offset', window.location);
        var target = document.getElementById(window.location.hash.substring(1).split("?")[0]);
        Util.scrollIntoView(target, offset);
      }
    }

    window.addEventListener('hashchange', maybeScroll, false);
    maybeScroll();

    /**
     * Collapsible nav plugin.
     * @param el
     * @constructor
     */
    function CollapsibleNav(el) {
      this.el = el;
      el.addEventListener('click', this.onClick.bind(this));
    }

    CollapsibleNav.prototype = {

      onClick: function(e) {
        var maxHeight = window.getComputedStyle(this.el).maxHeight;
        if (maxHeight === 'none') {
          return;
        }

        var isExpanded = this.el.getAttribute('aria-expanded') === 'true';
        var navLink = e.target;

        if (isExpanded) {

          // Close the nav if the clicked link is selected
          if (navLink.getAttribute('aria-selected') === 'true') {
            this.el.setAttribute('aria-expanded', 'false');
            this.el.classList.remove('is-expanded');
            navLink.setAttribute('aria-selected', 'false');
            e.preventDefault();
          }
        } else {

          // Open the nav if it's closed
          this.el.setAttribute('aria-expanded', 'true');
          this.el.classList.add('is-expanded');
          navLink.setAttribute('aria-selected', 'true');
          e.preventDefault();
        }
      }
    };

    each('.collapsible-nav', function(nav) {
      new CollapsibleNav(nav);
    });

    window.CollapsibleNav = CollapsibleNav;

  });
})();

// RPB addition for accordions

document.addEventListener('DOMContentLoaded', function() {
  var acc = document.getElementsByClassName("accordion__item-title");
  var i;

  for (i = 0; i < acc.length; i++) {
    acc[i].addEventListener("click", function() {
      this.classList.toggle("active");
      var panel = this.nextElementSibling;
      if (panel.style.maxHeight) {
        panel.style.maxHeight = null;
      } else {
        panel.style.maxHeight = panel.scrollHeight + "px";
      }
    });
  }
});