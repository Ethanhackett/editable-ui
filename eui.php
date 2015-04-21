<?php
/*
Plugin Name: Editable UI
Plugin URI: http://editableui.com
Description: Editable UI adds simple yet powerful front end editing capabilities.
Version: 1.0
Author: @EthanHackett
Author URI: http://www.ethanhackett.com
License: GPL
*/

// Set global variables for including files
define( 'EUI_PLUGIN_PATH', plugin_dir_path( __FILE__ ) );
define( 'EUI_PLUGIN_URL', plugin_dir_url( __FILE__ ) );

// Include Admin Settings Page
require_once( EUI_PLUGIN_PATH . 'eui-backend.php');

// Include Frontend Resources
require_once( EUI_PLUGIN_PATH . 'eui-frontend.php');

?>
