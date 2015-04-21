jQuery(document).ready(function($) {

/*
  Outline:
  - Global Variables
  - Click and Keyboard Events
  - Functions
*/


/* ---------------------------------- */
  // Define global variables
  codeButton = '<a href="#" class="eui-edit-code" contenteditable="false">HTML</a>';
/* ---------------------------------- */

/* ---------------------------------- */
  /* NOTE: use $(document).on vs $(element).on to trigger events on dynamicly added elements */

  // For each eui-element elment with the .html class append the html button
  $(document).on('focus', '.eui-element.html', function(){
    // If there isn't a code button add append it
    if ($(this).parent().html().indexOf(codeButton) <= 1) {
      $(this).append(codeButton);
    }
  });

  // On editable blur or focus out/change update the input
  $(document).on('blur', '.eui-element', function() {
    // Ge the elements html (text)
    if ($(this).text() == '') {
      // If there is no text replace text with ...
      if (!$(this).is('i')) {
        $(this).text('…');
        $(this).addClass('eui-error-empty');
      }
    }
    eui_update_json();
  });

  // Edit the code
  $(document).on('click', '.eui-edit-code', function(e){
    e.preventDefault();
    $('.eui-code, .eui-code-background, body').toggleClass('toggle');
    window.htmlElement = $(this).parent();
    // Get the HTML from it's parent
    var html = $(this).parent().html();
    // Remove the edit code from the html being edited
    var html = html.replace(codeButton, '');
    // Place the html in the editor
    $('.eui-code pre code').text(html);
    // Run prism to stylize code
    Prism.highlightElement($('.eui-code pre code')[0]);
  });

  // Media Input Toggle
  $(document).on('click', '.eui-media', function(e){
    e.preventDefault();
    // Get the custom data value for edit id
    var src_id = '#' + $(this).attr('id');
    // Toggle the class on the media edit wrapper to show and hide it
    eui_media_group(src_id);
    eui_media_close();
    eui_update_json();
  });

  // Close Media View
  $(document).on('click', '.eui-preview-close, .eui-preview-background, .eui-media-group-dialog', function(e){
    if (e.target !== this) { return; }
    e.preventDefault();
    eui_media_group_close();
  });

  // Media Input Toggle
  $(document).on('click', '.eui-media-group-dialog ul a', function(e){
    e.preventDefault();
    // Get the custom data value for edit id
    var src_id = $(this).attr('href');
    // Toggle the class on the media edit wrapper to show and hide it
    eui_media_group(src_id);
  });

  // Apply code view
  $(document).on('click', '.eui-apply', function(e){
    e.preventDefault();
    var codeWindow = $(this).closest('.eui-code');
    var code = $(codeWindow).find('code').text() + codeButton;
    htmlElement.html(code).addClass();
    eui_codeWindowToggle();
    eui_update_json();
  });

  // Run syntax highlighting on focus out in HTML area
  $(document).on('blur', 'code.editable', function(e){
    Prism.highlightElement($('.eui-code pre code')[0]);
  });

  // Hide code modal
  $(document).on('click', '.eui-code-background, .eui-cancel', function(e){
    e.preventDefault();
    eui_codeWindowToggle();
  });

  // Switch Version
  $(document).on('click', '.eui-panel ul li a', function(e){
    e.preventDefault();
    eui_switch_draft($(this).parent().index());
  });

  // Start Editing
  $(document).on('click', '.eui-edit', function(e){
    e.preventDefault();
    // First check if page was las edited then allow editing.
    eui_last_edited();
  });

  // Close editing
  $(document).on('click', '.eui-lock', function(e){
    e.preventDefault();
    $('.eui-panel').removeClass('active').removeClass('toggle');
    // Add editing capabulities
    $('.eui-element').each(function(){
      $(this).attr('contenteditable', 'false');
      // Remove editing class
      $('body').removeClass('eui-editing');
      var html = $(this).html();
      // Remove the edit code from the html being edited
      var html = html.replace(codeButton, '');
    });
    // Set editing cookie
    eui_setCookie('edit-mode', 'off', 1);
  });

  // Open Control Panel
  $(document).on('click', '.eui-settings', function(e){
    e.preventDefault();
    $('.eui-panel').toggleClass('toggle');
  });

  // Open Media Window
  $(document).on('click', '.eui-media-modal', function(e){
    e.preventDefault();
    var src_id = '#' + $(this).attr('id');
    eui_media_open(src_id);
  });

  // Open Media Window
  $(document).on('click', '.eui-preview-image, .eui-preview-change', function(e){
    e.preventDefault();
    // Get the image id that we want to update
    var image_id = $('.eui-media-group-dialog').attr('eui-media-id');
    eui_media_open(image_id);
  });

  // Close media window
  $(document).on('click', '.eui-iframe-modal-close, .eui-iframe-modal-background', function(e){
    e.preventDefault();
    eui_media_close();
  });

  // Take over editing confirmation
  $(document).on('click', '.eui-continue-editing', function(e){
    e.preventDefault();
    eui_enable_editing();
    eui_editor_dialog_close();
  });

  // Cancel edit if being edited
  $(document).on('click', '.eui-cancel-editing', function(e){
    e.preventDefault();
    eui_editor_dialog_close();
  });

  // Clicking Save
  $(document).on('click', '.eui-save', function(e){
    e.preventDefault();
    // Run the json function before saving in case user is hasn't focused out
    eui_update_json();
    // Run ajax post for saving
    eui_ajaxSubmit('2');
  });

  // Open Publish Draft Dialog
  $(document).on('click', '.eui-publish', function(e){
    e.preventDefault();
    eui_publish_dialog_open();
  });

  // Close Publish Draft Dialog
  $(document).on('click', '.eui-cancel-publishing', function(e){
    e.preventDefault();
    eui_publish_dialog_close();
  });

  // Confirm Publish Draft
  $(document).on('click', '.eui-continue-publishing', function(e){
    e.preventDefault();
    eui_publish();
    eui_publish_dialog_close();
  });

  $(document).on('click', 'i.eui-element', function(e){
    // Get the cookie variables
    var editMode = eui_getCookie('edit-mode');
    // if edit mode is on continue
    if (editMode == 'on') {
      e.preventDefault();
      // Fade in the modal windows
      $('#cotap-icon-picker-background, #cotap-icon-picker').fadeToggle('fast');
      // Set the active class in the modal window
      var currentClass = $.grep(this.className.split(" "), function(v, i){
         return v.indexOf('icon') === 0;
      }).join();
      // Remove active class
      $('#cotap-icon-picker li').removeClass('active');
      // Find the current active icon and highlight it in the icon picker
      $('#cotap-icon-picker .' + currentClass).parent().parent().addClass('active');
      // Set the id for use when swapping the icons
      iconID = $(this).attr('id');
    }
  });

  // When a user clicks an icon in the picker modal
  $(document).on('click', '#cotap-icon-picker li a', function(e){
    e.preventDefault();
    // Remove active classes
    $('#cotap-icon-picker li').removeClass('active');
    // Make this active
    $(this).parent().addClass('active');
  });

  // When the user clicks the attatch icon button in the modal
  $(document).on('click', '.icon-picker-update-button', function(e){
    e.preventDefault();
    // Get the current active icon class
    var newIcon = $('#cotap-icon-picker').find('.active').find('i').attr('class');
    // Swap it out for the previously clicked icon
    $('#' + iconID).attr('class', newIcon).addClass('eui-element');
    eui_update_json(); // Run sorting json to update value
  });

  $(document).on('click', '.close-cotap-icon-picker, .icon-picker-update-button', function(e){
    e.preventDefault();
    // Fade in the modal windows
    $('#cotap-icon-picker-background, #cotap-icon-picker').fadeToggle('fast');
  });

  // Prevent new lines from wrapping content with divs
  // Rewrite new page lines as <br/>
  $(document).on('keydown', '.eui-element.html', function(e) {
    // trap the return key being pressed
    if (e.keyCode === 13) {
      // insert 2 br tags (if only one br tag is inserted the cursor won't go to the next line)
      document.execCommand('insertHTML', false, '<br>');
      // prevent the default behaviour of return key pressed
      return false;
    }
  });

  // If admin clicks save while in edit mode
  $(document).on('keypress', function(event) {
    if (event.which == 115 && (event.ctrlKey||event.metaKey)|| (event.which == 19)) {
      // If is in editing mode overide command s
      if ($('body').hasClass('eui-editing')) {
        event.preventDefault();
        // Update the json values
        eui_update_json();
        // Run draft save
        eui_ajaxSubmit('2');
        return false;
      }
    }
  });

/* ---------------------------------- */


/* ---------------------------------- */
// Editable UI Functions

  // Open the media group dialog
  function eui_media_group(src_id) {
    // Get the cookie variables
    var editMode = eui_getCookie('edit-mode');
    // if edit mode is on continue
    if (editMode == 'on') {
      // Fade the media viewer in
      $('.eui-media-group-dialog, .eui-preview-background').fadeIn();
      // Set the variables based on the iamge clicked.
      var media_src = $(src_id).attr('src');
      var media_alt = $(src_id).attr('alt');
      $('.eui-preview-alt').text(media_alt);
      $('.eui-media-group-dialog').attr('eui-media-id', src_id);
      $('.eui-media-group-dialog ul').html('');
      // Build the each loop for all the images in that group
      $('.eui-preview-image').animate({'opacity': 0}, 500, function() {
        $(this).css({'background-image': 'url(' + media_src + ')', 'background-repeat': 'no-repeat middle center', 'background-size': 'cover'}).animate({'opacity': 1}, 500);
      });
      $('.eui-preview-image img').animate({'max-width': '0px',}, 700, function() {
        $(this).attr('src', media_src).animate({'max-width': '1000px',}, 1000);
      });
      var count = 0;
      // If image is part of a media group
      if ($(src_id).attr('data-eui-media-group')) {
        var media_group = $(src_id).attr('data-eui-media-group');
        $('[data-eui-media-group="' + media_group + '"]').each(function(count) {
          var image_url = $(this).attr('src');
          var image_id = $(this).attr('id');
          var count = count + 1;
          if (media_src == image_url) {
            placement = count;
            var add_active = 'class="active"';
          }
          $('.eui-media-group-dialog ul').append('<li><a href="#' + image_id + '" ' + add_active + ' style="background-image: url(' + image_url + '); background-repeat: no-repeat middle center; background-size: cover;"></a></li>');
        });
        var media_group_total = $('[data-eui-media-group="' + media_group + '"]').size();
        $('.eui-preview-count').text(placement +' of ' + media_group_total);
        // Since it's a group show group icons
        $('.eui-media-group-dialog ul').show();
      } else {
        var image_url = $(this).attr('src');
        var image_id = $(this).attr('id');
        // Since it's a single image hide the image group
        $('.eui-media-group-dialog ul').hide();
        $('.eui-preview-count').text('1 of 1');
      }


      var file_name = media_src.split('/').pop();
      $('.eui-preview-file-name').text(file_name);
    } // End if is edtiable
  }

  // Close media window
  function eui_media_group_close() {
    $('.eui-media-group-dialog, .eui-preview-background').fadeToggle();
    $('.eui-preview-image').css({'background-image': 'url()', 'background-repeat': 'no-repeat middle center', 'background-size': 'cover'});
    $('.eui-preview-image img').attr('src', '');
  }

  // Open the media modal
  function eui_media_open(src_id) {
    // Get the cookie variables
    var editMode = eui_getCookie('edit-mode');
    // if edit mode is on continue
    if (editMode == 'on') {
      // Toggle the modal
      $('.eui-iframe-modal-background').fadeToggle();
      $('.eui-iframe-modal').animate({top: 1, opacity: 1}, 350);

      if ($(src_id).is('input')) {
        // is an input
      } else if ($(src_id).is('img')) {
        var file_type = 'image';
        var button_label = 'Select-Image';
      } else if ($(src_id).is('source')) {
        var file_type = 'video';
        var button_label = 'Select-Video';
      } else {
        var file_type = 'image,video';
        var button_label = 'none';
      }

      // Encode the image url
      var src_title = $(src_id).attr('title');

      // strip # from id
      var src_id = src_id.replace('#', '');
      var iframe_src = '/wp-admin/options-general.php?page=eui-media&src-id=' + src_id + '&src-type=' + file_type + '&button-label=' + button_label + '&src-title=' + src_title;
      //alert(iframe_src);
      $('#media-iframe').attr('src', iframe_src);
    } // End if edit-mode is 'on'
  }

  function eui_media_close() {
    $('.eui-iframe-modal-background').fadeOut();
    $('.eui-iframe-modal').animate({top: '-150%', opacity: 0}, 350);
    $('#media-iframe').attr('src', ' ');
  }

  // Function to show and hide code view
  function eui_codeWindowToggle(){
    $('.eui-code, .eui-code-background').toggleClass('toggle');
  }

  function eui_last_edited(){
    // Get the latest draft value
    if ($('input[name=eui_draft_json]').val() == '') {
      // Update the json for the first time
      eui_ajaxSubmit();
    } else {
      var draftInput = $.parseJSON($('input[name=eui_draft_json]').val());
      lastUser = draftInput['username'];
      var lastEditTime = draftInput['time'];

      // get the username
      // Switch to !=
      if (lastUser != $('input[name=eui_username]').val()) {
        // Get last edit time split into array
        var lastEditTimes = lastEditTime.split(/[(?:/|:| )]/);
        // Get current date
        var date = new Date();

        // Overely complex way of checking to see if the post was edited in the last hour
        if (lastEditTimes[0] == date.getMonth() && lastEditTimes[1] == date.getDate() ) {
          // Edited today
          if (date.getHours() == lastEditTimes[2]) {
            // Run edit dialog
            eui_editor_dialog_open();
            // Stop the function
            return false;
          } else if ((date.getHours() - lastEditTimes[2]) == 1 && (date.getMinutes() - lastEditTimes[3]) <= 0) {
            // Run edit dialog
            eui_editor_dialog_open();
            // Stop the function
            return false;
          }
        }
        // Enable editing
      }
    }
    eui_enable_editing();
  }
  // Publish Draft
  function eui_publish() {
    var draftInput = $('input[name=eui_draft_json]').val();
    $('input[name=eui_publish_json]').val(draftInput);
    // Bump the revisions list
    $($('.eui-archived-inputs').get().reverse()).each(function() {
      var previousValue = $(this).prev('input').val();
      $(this).val(previousValue);
    });
    $('input[name=eui_archive_1]').val($('input[name=eui_publish_json]').val());
    // Run ajax post for publishing
    eui_ajaxSubmit('1');
  }
  // Close take over editing control
  function eui_publish_dialog_open() {
    $('.eui-publish-dialog').animate({top: 150, opacity: 1}, 300);
  }
  // Close recently edited dialog
  function eui_publish_dialog_close() {
    $('.eui-publish-dialog').animate({top: -200, opacity: 0}, 300);
  }

  // Close take over editing control
  function eui_editor_dialog_open() {
    eui_setCookie('edit-mode', 'off', 1);
    $('.eui-last-edited-dialog p').html('This page was recently edited by '+ lastUser + '.');
    $('.eui-last-edited-dialog').animate({top: 150, opacity: 1}, 300);
  }
  // Close recently edited dialog
  function eui_editor_dialog_close() {
    $('.eui-last-edited-dialog').animate({top: -200, opacity: 0}, 300);
  }

  // Enable editing
  function eui_enable_editing(){
    $('.eui-panel').addClass('active');
    // Add editing capabulities
    $('.eui-element').each(function(){
      $(this).attr('contenteditable', 'true');
      // Add editing class
      $('body').addClass('eui-editing');
      // Set editing cookie
      eui_setCookie('edit-mode', 'on', 1);
    });
    eui_update_json();
    eui_ajaxSubmit('3');
  }

  // Enable editing
  function eui_switch_draft(position){
    // Only switch versions if it's not the draf
    if (position != 0) {

    }
  }

  // Use ajax to submit the form
  $('#eui_post').submit(eui_ajaxSubmit);

  // Save Draft
  // Ajax form config
  function eui_ajaxSubmit(successType){
    var editableUI = $('#eui_post').serialize();

    $.ajax({
      type:'POST',
      url: '/wp-admin/admin-ajax.php?action=eui',
      data: editableUI,
      success:function(data){
        if (successType == '1') {
            // Show the publish success message
            $('.eui-publish-success-message').fadeToggle(200).delay(2000).animate({top: -100}, 700, function() {
              $(this).hide().animate({top: 0});
            });
        } else if (successType == '2') {
          // Show the draft save success message
          $('.eui-draft-success-message').fadeToggle(200).delay(2000).animate({top: -100}, 700, function() {
            $(this).hide().animate({top: 0});
          });
        } else {
          // Don't do anything like if taking over editing form someone else
        }
      }
    });
    // Prevent form submission
    return false;
  }

  // JSON Saving function
  function eui_update_json(){
    // Get the custom data attribute data-string-name
    var draftInput = $('input[name=eui_draft_json]');
    // Define the json item
    item = {}

    // Add the user and time stamp
    item['username'] = $('input[name=eui_username]').val();
    // create time
    var date = new Date();
    var time = date.getMonth() + '/' + date.getDate() + ' ' + date.getHours() + ':' + date.getMinutes();
    item['time'] = time;

    // Loop throuch each li and add them to the string
    $('.eui-element, .eui-media').each(function(){

        // Check if element has an id to pair with
        if ($(this).is('[id]')) {
          // Get the ID of the editable element
          var id = $(this).attr('id');
          // Check if id is valid
          if (id.match(/^[a-zA-Z0-9_]*$/)) {

            // Check the time and set the values
            if ($(this).hasClass('html')) {
              // If it's an html element
              var value = $(this).html();
              // Strip out the HTML button text
              var value = value.replace(codeButton, '');
              item[id] = value;
            } else if ($(this).is('i')) {
              // If this is an icon
              var value = $(this).attr('class');
              var value = value.replace('eui-element', '');
              var value = value.replace(' ', '');
              item[id] = value;
            } else if ($(this).is('img')) {
              // If this is an image
              var value = $(this).attr('src');
              // Get the source to see if it's a placeholder image
              if (value.indexOf('fpoimg') >= 0 || value == '') {
                // Don't save the images or it's alt and title tags
              } else {
                item[id] = value; // Add the src url
                var id_alt = id + '_alt';
                var value = $(this).attr('alt');
                item[id_alt] = value; // Add the alt tag
                var id_title = id + '_title';
                var value = $(this).attr('title');
                item[id_title] = value;
              }
            } else {
              item[id] =  $(this).text();
            }
          } else {
            // Id isn't alpha numeric with underscroes
            $(this).addClass('eui-error-valid-id');
            $(this).attr('contenteditable', 'false');
          } // End id validation
        } else {
          // Id is missing
          $(this).addClass('eui-error-id');
          $(this).attr('contenteditable', 'false');
        }

    });

    jsonString = JSON.stringify(item);
    // Update the value in the input
    $(draftInput).val(jsonString);
  } // End sortableUpdate Function


  // Cookie functions
  // http://jquery-howto.blogspot.com/2010/09/jquery-cookies-getsetdelete-plugin.html
  // Set Cookie
  function eui_setCookie(name,value,days) {
      if (days) {
          var date = new Date();
          date.setTime(date.getTime()+(days*24*60*60*1000));
          var expires = "; expires="+date.toGMTString();
      }
      else var expires = "";
      document.cookie = name+"="+value+expires+"; path=/";
  }
  // Retrieve Cookies
  function eui_getCookie(name) {
      var nameEQ = name + "=";
      var ca = document.cookie.split(';');
      for(var i=0;i < ca.length;i++) {
          var c = ca[i];
          while (c.charAt(0)==' ') c = c.substring(1,c.length);
          if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length,c.length);
      }
      return null;
  }
  // Delete Cookies
  function eui_deleteCookie(name) {
      eui_setCookie(name,"",-1);
  }

  // End Functions
/* ---------------------------------- */



/* ---------------------------------- */
  // On document ready run the following functions

  // Get the cookie variables
  var editMode = eui_getCookie('edit-mode');

  // If edit mode is set to on make elements editable
  if (editMode == 'on') {
    // Edited int he last hour
    eui_last_edited();
  }

  // If edtiable ui text areas are empty fill them with '...'
  $('.eui-element:empty').each(function(){
    if (!$(this).is('i')) {
      $(this).text('…');
    }
  });

  // If icon doesn't have a class starting with "icon-" add a default class.
  $('i.eui-element').each(function(){
    var theClasses = $(this).attr('class').split(" ");
    var i=0;
    var found = false;
    while(i<theClasses.length && !found) {
     if(theClasses[i].indexOf('icon-') == 0) {   // starts with answerbox
        found = true;
     }
     i++;
    }
    if(!found) {
       $(this).addClass('icon-logo-co');
    }
  });

  // For each image without a src attribute use a placeholder image with no tittle or alt tag.
  $('.eui-media[src=""]').each(function(){
    $(this).attr('src', 'http://fpoimg.com/250x250?text=Placeholder').attr('title', '…').attr('alt', '…');
  });

/* ---------------------------------- */


}); // End Document Ready
