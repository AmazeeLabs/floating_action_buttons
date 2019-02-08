(function($, Drupal) {
  // Drupal core specific class names
  var formActionsClass = '.layout-region-node-footer__content .form-actions';
  var settingsClass = '.layout-region-node-secondary';

  // Translations
  var closeText = Drupal.t('Close settings menu');
  var settingsText = Drupal.t('Settings');
  var formActionsText = Drupal.t('Form actions');
  var openFormActionsText = Drupal.t('Open form actions');
  var closeFormActionsText = Drupal.t('Close form actions');

  /**
   * Appends title and close button to the settings tray.
   */
  Drupal.behaviors.settings = {
    attach: function(context, settings) {
      var $settings = $(settingsClass);
      var $settingsWrapper = $('.settings-wrapper');

      if (!$settings.length || $settingsWrapper.length) {
        return;
      }

      function closeSettings() {
        $('.edit-settings').attr('aria-pressed', false);
        $(settingsClass)
          .add('body')
          .removeClass('active');
      }

      var $button = $('<button />')
        .addClass('settings-close')
        .attr({
          type: 'button',
          role: 'button',
        })
        .text(closeText)
        .on('click', closeSettings);

      var $title = $('<h2 />')
        .addClass('settings-title')
        .text(settingsText);

      var $wrapper = $('<div />')
        .addClass('settings-wrapper')
        .append($title)
        .append($button);
      $settings.append($wrapper);

      $(document).on('keydown', function(e) {
        var keyCode = e.keyCode || e.which;
        if (keyCode == 27 && $(settingsClass).hasClass('active')) {
          closeSettings();
        }
      });
    },
  };

  /**
   * Takes the existing buttons and wraps them within a floating menu area.
   */
  Drupal.behaviors.floatingButtons = {
    attach: function(context, settings) {
      var $formAction = $(formActionsClass);
      var $buttonsWrapper = $('.buttons-wrapper');

      if (!$formAction.length || $buttonsWrapper.length) {
        return;
      }

      var $settings = $(settingsClass);
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
        });

      var $settingsMenuButton = $('<button />')
        .addClass('buttons-button settings-menu')
        .attr({
          type: 'button',
          role: 'menuitem',
          'aria-pressed': false,
          'aria-expanded': false,
        })
        .text(openFormActionsText)
        .on('click', function() {
          var $this = $(this);
          var $formAction = $(formActionsClass);
          var $elements = $(formActionsClass).add('.buttons-wrapper');
          if ($formAction.hasClass('active')) {
            $elements.removeClass('active');
            $this
              .attr({
                'aria-pressed': false,
                'aria-expanded': false,
              })
              .text(openFormActionsText)
              .blur();
          } else {
            $elements.addClass('active');
            $this
              .attr({
                'aria-pressed': true,
                'aria-expanded': true,
              })
              .text(closeFormActionsText);
          }
        });

      var $buttonWrapper = $('<ul />')
        .addClass('buttons-wrapper')
        .attr({
          role: 'menubar',
          'aria-label': formActionsText,
        })
        .append($('<li />'));

      $(formActionsClass)
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
        .prepend($settings.length ? $settingsButton : null)
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
