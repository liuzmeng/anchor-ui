/**
 * sidebar functions
 */

const Sidebar = (($) => {

  /**
   * Constants
   */

  const NAME = 'sidebar'
  const VERSION = '1.0.0-beta'
  const DATA_KEY = 'anchor.sidebar'
  const EVENT_KEY = `.${DATA_KEY}`
  const DATA_API_KEY = '.data-api'
  const JQUERY_NO_CONFLICT = $.fn[NAME]
  const TRANSITION_UNIT_DURATION = 1.2

  const Default = {}

  const Event = {
    LOAD_DATA_API: `load${EVENT_KEY}${DATA_API_KEY}`,
    CLICK_DATA_API: `click${EVENT_KEY}${DATA_API_KEY}`
  }

  const Selector = {
    DATA_SIDEBAR: '[data-toggle="sidebar"]',
    MENU_GROUP: '.menu-group',
    MENU_TITLE: '.menu-title',
    MENU_SUB_TITLE: '.menu-sub-title',
    MENU_DOT: '.menu-dot',
    MENU_TRIANGLE: '.menu-triangle',
    ACTIVE: '.active',
    SELECTED: '.selected'
  }

  /**
   * Class Definition
   */

  class Sidebar {
    constructor (root, config) {
      this._config = this._getConfig(config)
      this.$root = $(root)

      this.init()
    }

    // getters

    static get VERSION () {
      return VERSION
    }

    static get Default () {
      return Default
    }

    // public

    init () {
      let _class = this

      this.$root.find(Selector.MENU_TITLE).append(`<i class="${_class._getNameFromClass(Selector.MENU_DOT)}"></i>`)
      this.$root.find(Selector.MENU_SUB_TITLE).each(function () {
        let $menuGroup = $(this).closest(Selector.MENU_GROUP)
        let isFirst = $(this).index($menuGroup.find(Selector.MENU_SUB_TITLE)) === 0
        let hasChildren = $menuGroup.find(Selector.MENU_SUB_TITLE).length > 1

        if (!isFirst) return
        else if (!hasChildren) return

        $(this).append(`<i class="${_class._getNameFromClass(Selector.MENU_TRIANGLE)}"></i>`)
      })

      let $selected = this.$root.find(`${Selector.MENU_SUB_TITLE}${Selector.SELECTED}`)
      if ($selected.length) {
        let activeClass = this._getNameFromClass(Selector.ACTIVE)
        $selected.parents(Selector.MENU_GROUP).each(function () {
          let $el = $(this).find(Selector.MENU_SUB_TITLE).first()
          let $menuTitle = $(this).find(Selector.MENU_TITLE)

          if (!$el.length) return
          else if ($el.attr('href')) return
          else if ($menuTitle.length) return

          _class.toggleMenuGroup($el[0], false)
        })
        $selected.parents(Selector.MENU_GROUP).each(function () {
          let $el = $(this).find(Selector.MENU_TITLE).first()

          if (!$el.length) return

          _class.toggleMenuGroup($el[0], false)
        })
      }
    }

    toggleMenuGroup (element, transition = true) {
      let $element = $(element)
      let $menuGroup = $element.closest(Selector.MENU_GROUP)
      let activeClass = this._getNameFromClass(Selector.ACTIVE)
      let isActive = $element.hasClass(activeClass)
      let currentHeight = $menuGroup.height()
      let targetHeight

      if (isActive) {
        targetHeight = 40
      } else {
        targetHeight = 0
        $menuGroup.children().each(function () {
          targetHeight += $(this).height()
        })
      }

      let transitionDuration
      if (transition) {
        let heightDiff = targetHeight - currentHeight
        if (heightDiff < 0) heightDiff = heightDiff * -1
        transitionDuration = TRANSITION_UNIT_DURATION * heightDiff
      } else {
        transitionDuration = 0
      }

      $element.toggleClass(activeClass)
      $menuGroup.animate({height: targetHeight}, transitionDuration, () => {
        if (isActive) {}
        else {
          setTimeout(() => {
            $menuGroup.css({height: 'auto'})
          }, 0)
        }
      })
    }

    // private

    _getConfig (config) {
      config = $.extend({}, Default, config)
      return config
    }

    _getNameFromClass (className) {
      className = className.replace(/\./g, '')
      return className
    }

    // static

    static _jQueryInterface (config) {
      return this.each(function () {
        let data = $(this).data(DATA_KEY)
        let _config = $.extend(
          {},
          Sidebar.Default,
          typeof config === 'object' && config
        )

        if (!data) {
          data = new Sidebar(this, _config)
          $(this).data(DATA_KEY, data)
        }
      })
    }

    static _menuTitleClickHandler (event) {
      let target = $(this).closest(Selector.DATA_SIDEBAR)[0]

      if (!$(target).length) return
      if ($(this).attr('href')) return

      let config = $.extend({}, $(target).data())
      Sidebar._jQueryInterface.call($(target), config)

      $(target).data(DATA_KEY).toggleMenuGroup(this)
    }
  }

  /**
   * Data Api
   */

  $(document)
    .on(Event.CLICK_DATA_API, Selector.MENU_TITLE, Sidebar._menuTitleClickHandler)
    .on(Event.CLICK_DATA_API, Selector.MENU_SUB_TITLE, Sidebar._menuTitleClickHandler)

  $(window).on(Event.LOAD_DATA_API, () => {
    $(Selector.DATA_SIDEBAR).each(function () {
      let $sidebar = $(this)

      Sidebar._jQueryInterface.call($sidebar, $sidebar.data())
    })
  })

  /**
   * jQuery
   */

  $.fn[NAME] = Sidebar._jQueryInterface
  $.fn[NAME].Constructor = Sidebar
  $.fn[NAME].noConflict = function () {
    $.fn[NAME] = JQUERY_NO_CONFLICT
    return Sidebar._jQueryInterface
  }

  return Sidebar

})(jQuery)

export default Sidebar