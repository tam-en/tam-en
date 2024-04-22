(function() {
  "use strict";

  window.Widgets = window.Widgets || {};

  // Key map
  var ENTER = 13;
  var ESCAPE = 27;
  var SPACE = 32;
  var UP = 38;
  var DOWN = 40;
  var TAB = 9;

  document.addEventListener('alpine:init', function() {

    // Simple toggle functionality
    Alpine.data('toggle', function(data) {
      return Object.assign({
        isOpen: false,

        toggle: function() {
          if (this.isOpen) {
            this.close();
          } else {
            this.open();
          }
        },

        open: function() {
          this.isOpen = true;
        },

        close: function() {
          this.isOpen = false;
        }
      }, data);
    });

    // Returns the current category object for section and article pages
    Alpine.data('category', function(data) {
      return Object.assign({
        sectionId: null,
        categoryId: null,
        category: null,

        init: function() {
          var pageId = Util.getPageId();

          // Properties aligned with Navigation extension
          var properties = [
            "id",
            "title",
            "description",
            "name",
            "html_url",
            "position",
            "promoted",
            "pinned",
            "draft",
            "section_id",
            "sorting",
            "category_id",
            "parent_section_id",
            "topic_id",
            "created_at"
          ];
          if (!this.categoryId && Util.isCategoryPage()) this.categoryId = pageId;
          if (!this.sectionId && Util.isSectionPage()) this.sectionId = pageId;

          if (!this.categoryId && !this.sectionId) return;

          Util.get(['categories', 'sections'], properties).then(this.getActiveCategory.bind(this));
        },

        getActiveCategory: function(collection) {

          if (this.categoryId) {
            var activeCategoryId = this.categoryId;
            this.category = collection.categories.filter(function(category) {
              return category.id === activeCategoryId;
            })[0] || null;
          } else if (this.sectionId) {
            var sectionId = this.sectionId;

            // Get the active section
            var activeSection = collection.sections.filter(function(section) {
              return section.id === sectionId;
            })[0] || null;

            // Get the active category
            this.category = collection.categories.filter(function(category) {
              return category.id === activeSection['category_id'];
            })[0] || null;
          }
        }
      }, data);
    });

    // Inline article voting functionality
    Alpine.data('voting', function(data) {

      return Object.assign({

        // Variables
        articleID: null,
        articleTitle: null,
        articleURL: null,
        subject: '',
        helpful: '',
        unhelpful: '',

        // State
        vote: null,
        description: '',
        reason: '',
        success: false,
        fail: false,

        /**
         * Widget for allowing visitors to submit article feedback using an inline form.
         */
        init: function() {
          var _this = this;

          var voteUpButton = _this.$el.querySelector('.vote-up');
          if (voteUpButton) {
            var voteUpIsClicked = voteUpButton.getAttribute('aria-pressed') === 'true';
            voteUpButton.addEventListener('click', function() {
              if (voteUpIsClicked) {
                voteUpIsClicked = false;
                return;
              }
              _this.vote = _this.vote === 'up' ? null : 'up';
            });
          }

          var voteDownButton = _this.$el.querySelector('.vote-down');
          if (voteDownButton) {
            var voteDownIsClicked = voteDownButton.getAttribute('aria-pressed') === 'true';
            voteDownButton.addEventListener('click', function() {
              if (voteDownIsClicked) {
                voteDownIsClicked = false;
                return;
              }
              _this.vote = _this.vote === 'down' ? null : 'down';
            });
          }
        },

        /**
         * Creates a new request using the Zendesk REST API.
         * @param e
         * @returns {Promise<void>}
         */
        createRequest: async function(e) {
          var button = e.target;
          var currentUser = HelpCenter.user;
          var role = currentUser.role;
          var anonymousUserName = 'Anonymous User';

          button.disabled = true;

          var hostName = window.location.hostname;
          var html = `
            <p><strong>Article title</strong></p>
            <p>${this.articleTitle}</p>
            <p></p>
            <p><strong>Article URL</strong></p>
            <p><a href="https://${hostName}/${this.articleURL}">https://${hostName}/${this.articleURL}</a></p>
            <p></p>
            <p><strong>Vote</strong></p>
            <p>${this.vote === 'up' ? 'Yes' : 'No'}</p>
            <p></p>
          `;
          if (this.reason) html += `
            <p><strong>Reason</strong></p><p>${this.reason}</p>
            <p></p>
          `;
          if (this.description) html += `
            <p><strong>Comment</strong></p>
            <p>${this.description}</p>
          `;

          // Generate request data
          var body = {
            request: {
              subject: this.subject,
              custom_fields: [{ id: 360014844320, value: 'other'}],
              comment: {
                html_body: html
              }
            }
          };

          var request = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' }
          };

          if (role === 'anonymous') {

            // Anonymous user
            body.request.requester = {};
            body.request.requester.name = anonymousUserName;
            body.request.requester.email = 'anonymous@example.com';
            request.credentials = 'omit';
          } else {

            // Logged in user
            var currentUserResponse = await fetch('/api/v2/users/me.json');
            var json = await currentUserResponse.json();
            var domain = hostName.substring(hostName.lastIndexOf(".", hostName.lastIndexOf(".") - 1) + 1);

            // Domain mapped
            if (domain !== 'zendesk.com') {
              request.credentials = 'omit';
              body.request.requester = {};
              if (json.user.email) {
                body.request.requester.email = json.user.email;
              } else if (json.user.name) {
                body.request.requester.name = json.user.name;
              } else {
                body.request.requester.name = anonymousUserName;
              }
            }

            // Not domain mapped
            else {
              request.headers['X-CSRF-Token'] = json.user['authenticity_token'];
            }
          }

          request.body = JSON.stringify(body);

          // Create the request
          try {
            var ticketRequest = await fetch('/api/v2/requests', request);
            var response = await ticketRequest.json();
            if (response.hasOwnProperty('request')) {
              this.success = true;
              this.fail = false;
            } else {
              this.fail = true;
            }
            button.disabled = false;
          } catch (error) {
            console.error('Could not create ticket', error);
            this.fail = true;
            button.disabled = false;
          }
        }
      }, data);
    });
  });

  /**
   * Dropdown widget.
   */
  window.Widgets.dropdown = function(data) {
    return Object.assign({
      isExpanded: false,

      get focusableElements() {
        return [...this.$refs.menu.querySelectorAll('a[href], button, input, textarea, select, details,[tabindex]:not([tabindex="-1"])')]
          .filter(el => !el.hasAttribute('disabled') && !el.getAttribute("aria-hidden"))
      },

      init: function() {
        this.$refs.toggle.addEventListener('click', this.clickHandler.bind(this));
        this.$refs.toggle.addEventListener('keydown', this.toggleKeyHandler.bind(this));
        this.$refs.menu.addEventListener('keydown', this.menuKeyHandler.bind(this));
        if (!this.isExpanded) {
          this.$refs.menu.classList.add('invisible');
        }
      },

      open: function() {
        this.isExpanded = true;
        this.$nextTick(this.handleOverflow.bind(this));
      },

      close: function() {
        this.isExpanded = false;
        this.$refs.menu.classList.add('invisible');
        this.$refs.menu.style.left = this.$refs.menu.style.top = this.$refs.menu.style.bottom = null;
      },

      handleOverflow: function() {
        var observer = new IntersectionObserver((entries) => {
          for (var entry of entries) {
            var bounds = entry.boundingClientRect;
            if (bounds.x < 0) {
              this.$refs.menu.style.left = Math.abs(bounds.left) + 'px';
            }
            if (bounds.x + bounds.width >= window.innerWidth) {
              this.$refs.menu.style.left = -((bounds.x + bounds.width) - window.innerWidth) + 'px';
            }
            if (bounds.top + bounds.height >= window.innerHeight) {
              this.$refs.menu.style.top = 'auto';
              this.$refs.menu.style.bottom = '100%';
            }
            this.$refs.menu.classList.remove('invisible');
          }
          observer.disconnect();
        });
        observer.observe(this.$refs.menu);
      },

      focusNextMenuItem: function(currentItem) {
        if (!this.focusableElements.length) return;
        var currentIndex = this.focusableElements.indexOf(currentItem);
        var nextIndex = currentIndex === this.focusableElements.length - 1 || currentIndex < 0 ? 0 : currentIndex + 1;
        this.focusableElements[nextIndex].focus();
      },

      focusPreviousMenuItem: function(currentItem) {
        if (!this.focusableElements.length) return;
        var currentIndex = this.focusableElements.indexOf(currentItem);
        var previousIndex = currentIndex <= 0 ? this.focusableElements.length - 1 : currentIndex - 1;
        this.focusableElements[previousIndex].focus();
      },

      clickHandler: function(e) {
        if (this.isExpanded) {
          this.close();
        } else {
          this.open();
        }
      },

      toggleKeyHandler: function(e) {
        switch (e.keyCode) {
          case ENTER:
          case SPACE:
          case DOWN:
            e.preventDefault();
            if (!this.isExpanded) this.open();
            this.focusNextMenuItem();
            break;
          case UP:
            e.preventDefault();
            if (!this.isExpanded) this.open();
            this.focusPreviousMenuItem();
            break;
          case ESCAPE:
            this.close();
            if (this.$refs.toggle) this.$refs.toggle.focus();
            break;
        }
      },

      menuKeyHandler: function(e) {
        var firstItem = this.focusableElements[0];
        var lastItem = this.focusableElements[this.focusableElements.length - 1];
        var currentElement = e.target;

        switch (e.keyCode) {
          case ESCAPE:
            this.close();
            if (this.$refs.toggle) this.$refs.toggle.focus();
            break;
          case DOWN:
            e.preventDefault();
            this.focusNextMenuItem(currentElement);
            break;
          case UP:
            e.preventDefault();
            this.focusPreviousMenuItem(currentElement);
            break;
          case TAB:
            if (e.shiftKey) {
              if (currentElement === firstItem) {
                this.close();
              } else {
                e.preventDefault();
                this.focusPreviousMenuItem(currentElement);
              }
            } else if (currentElement === lastItem) {
              this.close();
            } else {
              e.preventDefault();
              this.focusNextMenuItem(currentElement);
            }
            break;
        }
      }
    }, data)
  };

  /**
   * Notification widget.
   */
  window.Widgets.notification = function() {
    return {
      key: 'alpine:notification:dismissed',
      isDismissed: null,

      /**
       * Fetches a page of categories.
       * @returns {Promise}
       */
      getNotification: function() {
        this.isDismissed = window.sessionStorage.getItem(this.key) === 'true';
      },

      /**
       * Dismisses the notification.
       */
      dismiss: function() {
        this.isDismissed = true;
        window.sessionStorage.setItem(this.key, 'true');
      }
    }
  };

  /**
   * Header widget.
   */
  window.Widgets.header = function(data) {
    return Object.assign({
      isFixed: false,
      isSticky: false,
      isStuck: null,
      isUnstuck: null,

      init: function() {
        var $el = this.$el;

        if (this.isFixed && this.hasHeroElement()) {
          this.applyFixedHeader();
        } else {
          this.isFixed = false;
          $el.classList.remove('fixed-header');
        }

        $el.classList.add('transition-none');
        $el.classList.add('visible');
        $el.classList.remove('transition-none');

        Util.reflow(this.$el);

        if (this.isSticky) {
          this.applyStickyHeader();
        }
      },

      hasHeroElement: function() {
        var main = document.querySelector('main[role="main"]');
        return main.firstElementChild && main.firstElementChild.classList.contains('hero');
      },

      applyStickyHeader: function() {
        new Sticky(this.$el, {
          classNames: { sticky: 'sticky-top transition' }
        });
        this.$el.addEventListener('sticky:stuck', this.onStuck.bind(this));
        this.$el.addEventListener('sticky:unstuck', this.onUnstuck.bind(this));
      },

      applyFixedHeader: function() {
        this.$el.classList.add('absolute-top');
      },

      onStuck: function() {
        this.isStuck = true;
        this.isUnstuck = false;
        },

      onUnstuck: function() {
        this.isStuck = false;
        this.isUnstuck = true;
      }

    }, data);
  };

  /**
   * Search widget.
   */
  window.Widgets.search = function() {
    return {
      isOpen: false,

      init: function() {
        var searchFields = Array.prototype.slice.call(this.$root.querySelectorAll('[type="search"]'));
        this.searchField = searchFields.length ? searchFields[searchFields.length - 1] : null;

        // Add query string value if appropriate
        var queryString = Util.getURLParameter('query');
        if (queryString && this.searchField && !this.searchField.value) {
          this.searchField.value = queryString;
        }

        this.addEventListeners();
      },

      addEventListeners: function() {
        this.$watch('isOpen', this.onChange.bind(this));
        window.addEventListener('resize', Util.debounce(this.close.bind(this), 500));
      },

      onChange: function(isOpen) {
        if (isOpen) {
          this.showSearch();
        } else {
          this.hideSearch();
        }
      },

      toggle: function() {
        if (this.isOpen) {
          this.close();
        } else {
          this.open();
        }
      },

      open: function() {
        this.isOpen = true;
      },

      showSearch: function() {
        if (this.searchField) {
          var container = Util.closest(this.searchField, '.search');
          if (container) container.style.display = 'block';
          this.searchField.focus();
        }
      },

      close: function() {
        this.isOpen = false;
      },

      hideSearch: function() {
        if (this.searchField) {
          var container = Util.closest(this.searchField, '.search');
          if (container) {
            if (this.$refs.dropdown) {
              Util.onTransitionEnd(this.$refs.dropdown, function() {
                container.style.display = 'none';
              });
            } else {
              container.style.display = 'none';
            }
          }
        }

        // Focus on toggle
        if (this.$root.contains(document.activeElement) && this.$refs.toggle) {
          this.$refs.toggle.focus();
        }
      }
    }
  };

  /**
   * Mobile menu widget.
   */
  window.Widgets.mobileMenu = function() {
    return {
      isOpen: false,

      init: function() {
        window.addEventListener('resize', Util.debounce(this.close.bind(this), 500));
        document.addEventListener('keydown', this.toggleKeyHandler.bind(this));
      },

      toggleKeyHandler: function(e) {
        switch (e.keyCode) {
          case ESCAPE:
            this.close();
            break;
        }
      },

      toggle: function() {
        if (this.isOpen) {
          this.close();
        } else {
          this.open();
        }
      },

      open: function() {
        this.isOpen = true;
      },

      close: function() {
        this.isOpen = false;
      }
    }
  };

  /**
   * Categories widget.
   */
  window.Widgets.categories = function() {
    return {
      categories: [],
      isLoading: true,

      /**
       * Fetches a page of categories.
       * @returns {Promise}
       */
      getCategories: function() {
        return Util.get('categories')
          .then(this.addCategories.bind(this));
      },

      /**
       * Adds the categories returned by the REST API to the collection.
       * @param json
       */
      addCategories: function(json) {
        this.categories = json.categories;
        this.isLoading = false;
      }
    }
  };

  /**
   * Parallax image widget.
   */
  window.Widgets.parallaxImage = function() {
    return {

      init: function() {
        if (!this.prefersReducedMotion()) {
          this.addEventListeners();
        }
      },

      prefersReducedMotion: function() {
        var mediaQueryList = window.matchMedia('(prefers-reduced-motion: reduce)');
        return mediaQueryList.matches;
      },

      addEventListeners: function() {
        window.addEventListener('scroll', this.onScroll.bind(this));
      },

      onScroll: function() {
        var scrolled = window.scrollY;
        this.$el.style['-moz-transform'] = `translate3d(0px,${scrolled / + 3}px, 0px)`;
        this.$el.style['-webkit-transform'] = `translate3d(0px,${scrolled / + 3 }px, 0px)`;
        this.$el.style['transform'] = `translate3d(0px,${scrolled / + 3}px, 0px)`;
      }
    }
  };

  /**
   * Popular keywords widget.
   */
  window.Widgets.popularKeywords = function() {
    return {
      keywords: [],

      /**
       * Parses the set of keywords.
       * @returns {Promise}
       */
      parseKeywords: function(keywords) {
        var baseURL = location.protocol + '//' + location.hostname + '/hc/' + Theme.locale + '/search?query=';
        this.keywords = keywords
          .split(',')
          .map(function(keyword) {
            keyword = keyword.trim();
            return keyword ? { title: keyword, html_url: baseURL + keyword }: keyword;
          })
          .filter(function(keyword) {
            return keyword;
          });
      }
    }
  };

})();