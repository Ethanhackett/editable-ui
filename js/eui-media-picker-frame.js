// Load inline script on the admin page specifically to launch media window
jQuery(document).ready(function($) {
  var media_frame;

  // Get Peramiters
  function getParameterByName(name) {
    // SOURCE: http://stackoverflow.com/questions/901115/how-can-i-get-query-string-values-in-javascript
    name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
    var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"), results = regex.exec(location.search);
    return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
  }

  // Load Media Window
  function eui_media_modal() {

    // Retrive URL parameter by key
    var frame_src_type = getParameterByName('src-type');
    var frame_button_label = getParameterByName('button-label').replace('-', ' ');
    var frame_src_id = '#' + getParameterByName('src-id');
    var frame_src_title = getParameterByName('src-title');
    // Set the src url and decod the uri
    var frame_src_alt = decodeURIComponent(getParameterByName('src-alt'));

    // Define the variables we'll used based on the triggers data attributes

    var frame_upload_to = '#input'; // Assign which input we want to place the retrieved url
    var frame_alt_to = '#media-alt'; // Where to place the alt tag title

    // Create frame with some options.
    media_frame = wp.media({
      className: 'media-frame', // Adds class to the media-frame in case we need to modify it
      frame: 'select', // Use select for image upload 'select' or 'post'
      multiple: false, // This limits the user to upload single images. Set true for multiple image upload.
      title: 'Media Manager', // Localized object to hold our data.
      library: {
        type: frame_src_type // image, video or audio
      }
    });

    media_frame.on('select', function(){ // This returns the media data info on select
      // Do nothing
    });

    // Open Media Modal
    media_frame.open(); // Now that everything has been set, let's open up the frame.

    // Remove the default wordpress button
    $('.media-button, .media-modal-close').remove();
    // if the button label is not equale to none, add the new button
    if (frame_button_label != 'none') {
      $('.media-frame-toolbar .media-toolbar').append('<a href="#" class="new-media-button">' + frame_button_label + '</a>');
    }
    // Use set timeout to give the modal time to build the image library then click and selecte the active image
    setTimeout(function() {
      $('li[aria-label="'+ frame_src_title +'"] a').trigger('click');
    }, 500);

    $(document).on('click', '.new-media-button', function(e){
      e.preventDefault();

      var media_attachment = media_frame.state().get('selection').first().toJSON(); // Grab our attachment selection and construct a JSON representation of the model.
      // Strip the domain

      var media_attachment_url = media_attachment.url;
      var media_attachment_url = media_attachment_url.replace(/https?:\/\/[^\/]+/i, '');

      if (window.location.origin == 'https://www.cotap.com') {
        // if the domain is production prepend the cdn url
        var media_attachment_url = 'https://www.cdn.cotap.com' + media_attachment_url;
      } else if (window.location.origin == 'https://www.sandbox.cotap.com') {
        // if the domain is sandbox prepend the cdn url
        var media_attachment_url = 'https://cdn-www.sandbox.cotap.com' + media_attachment_url;
      }

      var media_attachment_alt = media_attachment.alt;

      if (!media_attachment_alt) {
        var media_attachment_alt = 'No Alt Tag';
      }

      // Send the attachment URL to our custom input field via jQuery.
      $(frame_src_id, top.document).attr('src', media_attachment_url);
      $(frame_src_id, top.document).attr('alt', media_attachment_alt);
      $(frame_src_id, top.document).attr('title', media_attachment.title);
      $(frame_src_id, top.document).trigger('click');
    });
  }

  // On page load update the media window
  eui_media_modal();

  /* --------------------------------------*/
  // If in iframe hide the wordpress top-bar and side menu
  if (window.self != window.top) {
    $('body').addClass('in-iframe');
    $('body').css({'background': '#fff'})
    $('#wpadminbar, #adminmenuwrap, #screen-meta-links').remove();
    $('html.wp-toolbar').css({'padding-top': '0px'})
    $('#wpwrap').css({'top': '0px'});
    $('#wpcontent').css({'margin-left': '0px', 'background':'#fff'});
  }
  /* --------------------------------------*/

}); // End Document Ready
