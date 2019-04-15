(function($, Drupal) {
  // Drupal core specific class names.
  var formActionsClass = '.layout-region-node-footer__content .form-actions';
  var settingsClass = '.layout-region-node-secondary';

  // Translations.
  var closeText = Drupal.t('Close settings menu');
  var settingsText = Drupal.t('Settings');
  var formActionsText = Drupal.t('Form actions');
  var openFormActionsText = Drupal.t('Open form actions');
  var closeFormActionsText = Drupal.t('Close form actions');

  /**
   * Closes the settings tray.
   */
  function closeSettings() {
    $('.edit-settings').attr('aria-pressed', false);
    $(settingsClass)
      .add('body')
      .removeClass('active');

    // Remove keydownCloseSettings function from keydown.
    $(document).off('keydown', keydownCloseSettings);
  }

  /**
   * Keypress function to close the settings tray.
   * @param {event} e
   */
  function keydownCloseSettings(e) {
    var keyCode = e.keyCode || e.which;
    // Check if Esc key is pressed to close settings tray.
    if (keyCode == 27) {
      closeSettings();
    }
  }

  /**
   * Appends title and close button to the settings tray.
   */
  Drupal.behaviors.settings = {
    attach: function(context, settings) {
      var $settings = $(settingsClass, context);
      var $settingsWrapper = $('.settings-wrapper', context);

      // Check if settings exist.
      if (!$settings.length || $settingsWrapper.length) {
        return;
      }

      // Creates close button to close settings tray.
      var $button = $('<button />')
        .addClass('settings-close')
        .attr({
          type: 'button',
          role: 'button',
          title: closeText,
        })
        .text(closeText)
        .on('click', closeSettings);

      // Creates title for settings tray.
      var $title = $('<h2 />')
        .addClass('settings-title')
        .text(settingsText);

      // Creates wrapper for $button and $title.
      var $wrapper = $('<div />')
        .addClass('settings-wrapper')
        .append($title)
        .append($button);

      // Add $wrapper and $button to settings tray.
      $settings.prepend($wrapper).append($button.clone(true));
    },
  };

  /**
   * Takes the existing buttons and wraps them within a floating menu area.
   */
  Drupal.behaviors.floatingButtons = {
    attach: function(context, settings) {
      var $formAction = $(formActionsClass, context);
      var $buttonsWrapper = $('.buttons-wrapper', context);

      // Check if form actions exist.
      if (!$formAction.length || $buttonsWrapper.length) {
        return;
      }

      // Creates settings button for settings tray.
      var $settingsButton = $('<button />')
        .addClass('buttons-button edit-settings')
        .attr({
          type: 'button',
          role: 'button',
          'aria-pressed': false,
        })
        .text(settingsText)
        .on('click', function() {
          $(this).attr('aria-pressed', true);
          $(settingsClass)
            .addClass('active')
            .attr('tabindex', -1)
            .focus()
            .removeAttr('tabindex')
            .end()
            .find('body')
            .addClass('active');

          // Add keydownCloseSettings function from keydown.
          $(document).on('keydown', keydownCloseSettings);
        });

      // Creates main button to show/hide menu options.
      var $settingsMenuButton = $('<button />')
        .addClass('buttons-button settings-menu')
        .attr({
          type: 'button',
          role: 'menuitem',
          'aria-pressed': false,
          'aria-expanded': false,
          title: openFormActionsText,
        })
        .text(openFormActionsText)
        .on('click', function() {
          var $this = $(this);
          var $formAction = $(formActionsClass);
          var $elements = $formAction.add('.buttons-wrapper');
          if ($formAction.hasClass('active')) {
            $elements.removeClass('active');
            $this
              .attr({
                'aria-pressed': false,
                'aria-expanded': false,
                title: openFormActionsText,
              })
              .text(openFormActionsText)
              .blur();
          } else {
            $elements.addClass('active');
            $this
              .attr({
                'aria-pressed': true,
                'aria-expanded': true,
                title: closeFormActionsText,
              })
              .text(closeFormActionsText);
          }
        });

      // Creates a wrapper for the options.
      var $buttonWrapper = $('<ul />')
        .addClass('buttons-wrapper')
        .attr({
          role: 'menubar',
          'aria-label': formActionsText,
        })
        .append($('<li />'));

      // Add above options to the form actions.
      $formAction
        .replaceWith(function() {
          var $ul = $('<ul />', { html: $(this).html() });
          $.each(this.attributes, function(i, attribute) {
            $ul.attr(attribute.name, attribute.value);
          });
          $ul.attr('role', 'menu');
          return $ul;
        })
        .end()
        .find(formActionsClass)
        // Prepend $settingsButton only if settings exists.
        .prepend($(settingsClass).length ? $settingsButton : null)
        .children()
        .attr('role', 'menuitem')
        .wrap(function() {
          return $('<li />', {
            class: this.id,
          });
        })
        .removeClass('button button--danger button--primary')
        .addClass('buttons-button')
        .parents(formActionsClass)
        .wrap($buttonWrapper)
        .before($settingsMenuButton);
    },
  };
})(jQuery, Drupal);
