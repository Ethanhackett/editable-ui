<?php
/* ---------------------------------- */
/* Start Admin Settings */
/* ---------------------------------- */
  /* ---------------------------------- */
  // Define admin options
  function eui_register_settings() {
    add_option( 'eui_archive_max', '3');
    register_setting( 'default', 'eui_archive_max' );
    add_option( 'eui_error_tracking', 'on');
    register_setting( 'default', 'eui_error_tracking' );
    add_option( 'eui_json_tracking', 'on');
    register_setting( 'default', 'eui_json_tracking' );

    // Get the users
    $users = get_users();
    // For each user loop through and create the inputs
    foreach( $users as $user ) {
      $username = 'eui_user_' . $user->user_nicename;
      add_option( $username, 'off');
      register_setting( 'default', $username);
    }
  }
  add_action( 'admin_init', 'eui_register_settings' );
  /* ---------------------------------- */

/* ---------------------------------- */
  // Start admin page
  function eui_register_options_page() {
    add_options_page('Editable UI Settings', 'Editable UI', 'manage_options', 'eui-options', 'eui_options_page');
  }
  add_action('admin_menu', 'eui_register_options_page');

  function eui_options_page() { ?>
  <div class="wrap">
    <?php screen_icon(); ?>
    <h2>Editable UI</h2>
    <form method="post" action="options.php">
      <?php settings_fields( 'default' ); ?>
        <table class="form-table" style="max-width: 500px;">
          <tr valign="top">
            <td scope="row">
              <h4 style="margin-bottom: 0px;">Max Archive Count</h4>
              <span>How many archives would you like to save?</span>
            </td>
            <td>
              <select name="eui_archive_max">
                <option value="1" <?php if ( get_option('eui_archive_max') == 1 ) echo 'selected="selected"'; ?>>1</option>
                <option value="2" <?php if ( get_option('eui_archive_max') == 2 ) echo 'selected="selected"'; ?>>2</option>
                <option value="3" <?php if ( get_option('eui_archive_max') == 3 ) echo 'selected="selected"'; ?>>3</option>
                <option value="4" <?php if ( get_option('eui_archive_max') == 4 ) echo 'selected="selected"'; ?>>4</option>
                <option value="5" <?php if ( get_option('eui_archive_max') == 5 ) echo 'selected="selected"'; ?>>5</option>
                <option value="6" <?php if ( get_option('eui_archive_max') == 6 ) echo 'selected="selected"'; ?>>6</option>
                <option value="7" <?php if ( get_option('eui_archive_max') == 7 ) echo 'selected="selected"'; ?>>7</option>
                <option value="8" <?php if ( get_option('eui_archive_max') == 8 ) echo 'selected="selected"'; ?>>8</option>
                <option value="9" <?php if ( get_option('eui_archive_max') == 9 ) echo 'selected="selected"'; ?>>9</option>
                <option value="10" <?php if ( get_option('eui_archive_max') == 10 ) echo 'selected="selected"'; ?>>10</option>
              </select>
            </td>
          </tr>
          <tr valign="top">
            <td scope="row">
              <h4 style="margin-bottom: 0px;">Display Errors</h3>
              <span>Highlight element without ids.</span>
            </td>
            <td>
              On <input type="radio" <?php if ( get_option('eui_error_tracking') == 'on' ) echo 'checked'; ?> name="eui_error_tracking" value="on">
              Off <input type="radio" <?php if ( get_option('eui_error_tracking') == 'off' or get_option('eui_error_tracking') == null ) echo 'checked'; ?> name="eui_error_tracking" value="off">
            </td>
          </tr>
          <tr valign="top">
            <td scope="row">
              <h4 style="margin-bottom: 0px;">Display JSON Inputs</h3>
              <span>Makes the json inputs in the footer visable.</span>
            </td>
            <td>
              On <input type="radio" <?php if ( get_option('eui_json_tracking') == 'on' ) echo 'checked'; ?> name="eui_json_tracking" value="on">
              Off <input type="radio" <?php if ( get_option('eui_json_tracking') == 'off' or get_option('eui_json_tracking') == null ) echo 'checked'; ?> name="eui_json_tracking" value="off">
            </td>
          </tr>
          <tr>
            <td>
              <h4 style="margin-bottom: 0px;">Editable UI Privilages</h3>
              <span>Select which users can use Editable UI.</span><br/><br/>
              <?php
                 // Get the users
                 $users = get_users();
                 // For each user loop through and create the inputs
                 foreach( $users as $user ) {
                   $username = 'eui_user_' . $user->user_nicename;
                  // If they have a first and last name use them else use their friendly username
                  if (!empty($user->user_firstname) && !empty($user->user_lastname)) {
                    $username_full = $user->user_firstname . ' ' . $user->user_lastname;
                  } else {
                    $username_full = $user->user_nicename;
                  } ?>
                    <label><?= get_avatar( $user->user_email, 30 ); ?><input type="checkbox" name="<?= $username ?>" value="<?= $user->user_nicename ?>" <?php if ( get_option($username) == $user->user_nicename ) echo 'checked'; ?>> <?= $username_full ?></label>
                 <?php
                 } // end foreach loop

              ?>
            </td>
          </tr>
        </table>
      <?php submit_button(); ?>
    </form>
  </div>
  <style>
    label {
      display: block;
      clear: both;
      line-height: 30px;
      padding: 5px;
      border-radius: 20px;
    }
    label:nth-child(odd) {
      background-color: rgba(0, 0, 0, 0.02);
    }
    label:hover {
      background-color: rgba(0, 0, 0, 0.06);
    }
    label img {
      border-radius: 50%;
      float: left;
      margin-bottom: 10px;
      margin-right: 7px;
    }
    label input {
    }
  </style>
  <?php } // End eui_options_page() function
/* ---------------------------------- */
/* End Admin Settings */
/* ---------------------------------- */

/* ---------------------------------- */
  // Start media admin page
  function eui_register_media_page() {
    add_options_page('Editable UI Media', null, 'manage_options', 'eui-media', 'eui_media_page');
  }
  add_action('admin_menu', 'eui_register_media_page');

  function eui_media_page() {

    wp_enqueue_script('prism', plugins_url( '/js/eui-media-picker-frame.js' , __FILE__ ), array(), null, true);
    wp_enqueue_media();
    wp_enqueue_script( 'custom-header' );

    ?>
    <style>
    /* Set margin around thickbox to 0 for iframe */
    .in-iframe .media-modal.wp-core-ui {
      top:0px !important;
      left:0px !important;
      right:0px !important;
      bottom:0px !important;
    }
    /* hide iframe input fields when accesed via a modal */
    .in-iframe .setting[data-setting=title], .in-iframe .setting[data-setting=description], .in-iframe .setting[data-setting=caption] {
      display: none;
    }
    /* New Media button style */
    .new-media-button {
      float: right;
      display: block;
      margin: 6px -8px 0px 15px;
      padding: 15px 30px;
      color: #fff !important;
      text-decoration: none;
      color: #fff;
      font-weight: 200;
      font-size: 14px;
      background: #777;
      transition: background 0.3s ease-in-out;
      border-radius: 5px;
    }
    .new-media-button:hover {
      background: #ac80d7;
    }
    </style>
    ...
  <?php }
  // Remove the sub menu
// End media admin page
/* ---------------------------------- */

/* ---------------------------------- */
  // Add error tracking body class for js
  add_filter( 'body_class','eui_classes' );
  function eui_classes( $classes ) {
    // If setting option is enabled
    if ( get_option('eui_error_tracking') == 'on') {
        $classes[] = 'eui_track_errors';
    }
    if ( get_option('eui_json_tracking') == 'on') {
        $classes[] = 'eui_show_json';
    }
    return $classes;
  }
/* ---------------------------------- */


/* ---------------------------------- */
  // Enqueue Scripts
  function eui_scripts() {
    if( current_user_can( 'edit_posts' ) ) {
      // Then if the user is on the editor list via the admin
      $current_user = wp_get_current_user();
      // Get current user's email
      $current_username = $current_user->user_nicename;
      // Get the users
      $users = get_users();
      // For each user loop through and create the inputs
      foreach( $users as $user ) {
        $username = 'eui_user_' . $user->user_nicename;
        if (get_option($username) == $current_username) {
          $current_user_can_edit = 'yes';
        }
      }


      if ($current_user_can_edit == 'yes') {
        wp_enqueue_script('eui', plugins_url( '/js/eui.js' , __FILE__ ), array(), null, true);
        wp_enqueue_script('prism', plugins_url( '/js/prism.js' , __FILE__ ), array(), null, true);
        wp_enqueue_script('media-upload');
      }
    }
  }
  add_action( 'wp_enqueue_scripts', 'eui_scripts', 20);

  // Enqueue Styles
  function eui_styles() {
    if( current_user_can( 'edit_posts' ) ) {
      wp_register_style( 'wp-enqueue-styles', plugins_url('/css/eui.css', __FILE__) );
      wp_enqueue_style( 'wp-enqueue-styles' );
    }
  }
  add_action( 'wp_enqueue_scripts', 'eui_styles' );
  //Add media upload scripts
  function add_media_upload_scripts() {
    if ( is_admin() ) {
         return;
       }
    if( current_user_can( 'edit_posts' ) ) {
      wp_enqueue_media();
    }
  }
  add_action('wp_enqueue_scripts', 'add_media_upload_scripts');
/* ---------------------------------- */




/* ---------------------------------- */
// Start AJAX Processing
/* ---------------------------------- */
  // Editable UI Saving Functionality
  function eui_processing() {

    // Retrieve the nonce and post id
    $eui_nonce = $_POST['eui_nonce'];
    $eui_post_id = $_POST['eui_post_id'];

    // Verify the nonce. If insn't there, stop the script
    if ( !wp_verify_nonce( $eui_nonce, 'eui_nonce')) { exit('No naughty business please'); }

    // Set the archive limit
    $eui_archive_count = get_option('eui_archive_max');

    // Save the value
    if( isset( $_POST['eui_draft_json'] ) ) update_post_meta( $eui_post_id, 'eui_draft_json', $_POST['eui_draft_json'] );
    if( isset( $_POST['eui_publish_json'] ) ) update_post_meta( $eui_post_id, 'eui_publish_json', $_POST['eui_publish_json'] );

    for ($i=1; $i<=$eui_archive_count; $i++) {
      $archive_label = 'eui_archive_' . $i;
      if( isset( $_POST[$archive_label] ) ) update_post_meta( $eui_post_id, $archive_label, $_POST[$archive_label] );
    }

    // Redirect the user back to the posted from page
    // This only triggers if the ajax functionality fails
    if(!empty($_SERVER['HTTP_X_REQUESTED_WITH']) && strtolower($_SERVER['HTTP_X_REQUESTED_WITH']) == 'xmlhttprequest') {
      $result = json_encode($result);
      echo $result;
    }
    else {
      header('Location: '.$_SERVER['HTTP_REFERER']);
    }
    // If no redirect happens stop
    die();

  }

  // If user isn't logged in die
  function eui_login() {
    echo 'You must log in to make edits';
    die();
  }

  add_action('wp_ajax_eui', 'eui_processing');
  add_action('wp_ajax_nopriv_eui', 'eui_login');
/* ---------------------------------- */
// End AJAX Processing
/* ---------------------------------- */
?>
