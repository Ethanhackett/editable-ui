<?php
/* ---------------------------------- */
// Start Frontend
/* ---------------------------------- */
  // Editable UI Header
  function eui_header() {

    // Get post id
    $post_id = get_the_ID();

    if ( current_user_can( 'edit_posts' ) ) { // Only Display Editable UI if user can edit the page

      // If you're the admin set the json to the publish verison
      $eui_draft_json = get_post_meta($post_id, 'eui_draft_json', true);
      $eui_page_json = json_decode($eui_draft_json);

    } else {
      // Else set the json to the publish verison
      $eui_publish_json = get_post_meta($post_id, 'eui_publish_json', true);
      $eui_page_json = json_decode($eui_publish_json);
    }
    foreach($eui_page_json as $obj => $value) {
      // Create the object value pairing as vairables
      global ${$obj};
      ${$obj} = $value;
    }
  }
add_action('get_header', 'eui_header');


function eui_footer() {
  if ( current_user_can( 'edit_posts' ) ) { // Only Display Editable UI if user can edit the page

    // Then if the user is on the editor list via the admin
    $current_user = wp_get_current_user();
    // Get the users

    $username = 'eui_user_' . $current_user->user_nicename;
    if (get_option($username) == $current_user->user_nicename) {
      $current_user_can_edit = 'yes';
    }

    echo get_option($current_user->user_nicename);

    if ($current_user_can_edit == 'yes') {
      // Add wp no once
      $nonce = wp_create_nonce("eui_nonce");
      // Create the wp admin-ajax url with noonce
      $link = admin_url('admin-ajax.php?action=eui&post_id='.$post->ID.'&nonce='.$nonce);
      // Retrieve post id
      $post_id = get_the_ID();
      // Retrieve Values
      $eui_draft_json = get_post_meta($post_id, 'eui_draft_json', true);
      $eui_draft_json_decoded = json_decode($eui_draft_json);
      $eui_publish_json = get_post_meta($post_id, 'eui_publish_json', true);
      $eui_publish_json_decoded = json_decode($eui_publish_json);

      // Set the archive limit
      $eui_archive_count = get_option('eui_archive_max');

      for ($i=1; $i<=$eui_archive_count; $i++) {
        ${'eui_archive_' . $i} = get_post_meta($post_id, 'eui_archive_' . $i, true);
      }

      ?>

      <!-- Start Editable UI Ajax Form -->
      <form type="post" action="" id="eui_post">
        <h3>Editable UI - JSON</h3>
        <p>Admin json saving inputs.</p>
        <input name="eui_nonce" type="hidden" value="<?= $nonce; ?>"/>
        <input name="eui_post_id" type="hidden" value="<?= $post_id; ?>"/>
        <input name="eui_username" type="hidden" value="<?= $current_user->user_login ?>"/>
        <label for="eui_draft_json">Draft</label>
        <input name="eui_draft_json" type="text" value="<?= htmlspecialchars($eui_draft_json); ?>"/>
        <label for="eui_publish_json">Published</label>
        <input name="eui_publish_json" type="text" value="<?= htmlspecialchars($eui_publish_json); ?>"/>
        <label>Archives</label>
        <?php for ($i=1; $i<=$eui_archive_count; $i++) { ?>
          <input name="eui_archive_<?= $i ?>" type="text" value="<?= htmlspecialchars(${'eui_archive_' . $i}); ?>" class="eui-archived-inputs"/>
        <?php } ?>

        <input type="submit" class="eui-form-submit-button">

      </form>
      <!-- End Editable UI Ajax Form -->


      <!-- Start Editable UI Interface -->
      <div class="eui-panel">
        <div class="eui-controls">
          <a href="#" class="eui-edit" title="Start Editing"><i class="fa fa-pencil"></i></a>
          <a href="#" class="eui-settings" title="Editable UI Settings"><i class="fa fa-bars"></i></a>
          <a href="#" class="eui-save" title="Save Draft"><i class="fa fa-floppy-o"></i></a>
          <a href="#" class="eui-publish" title="Publish Draft"><i class="fa fa-eye"></i></a>
          <a href="#" class="eui-media-modal" title="Open Media" id="eui_media_button"><i class="fa fa-picture-o"></i></a>
          <a href="#" class="eui-lock" title="Stop Editing"><i class="fa fa-unlock-alt"></i></a>
        </div>
        <h3>Versions</h3>
        <ul>
          <li>
            <a href="#" alt="Preview">
              Draft <span> Saved <?= $eui_draft_json_decoded->{'time'}; ?> - <?= $eui_draft_json_decoded->{'username'}; ?></span>
            </a>
          </li>
          <li>
            <a href="#" alt="Published">
              Published <span> Published <?= $eui_publish_json_decoded->{'time'}; ?> - <?= $eui_publish_json_decoded->{'username'}; ?></span>
            </a>
          </li>
          <?php for ($i=1; $i<=$eui_archive_count; $i++) {
            // Loop through the archives
            $json = get_post_meta($post_id, 'eui_archive_' . $i, true);
            $obj = json_decode($json);
            // If there is no archive don't output a list item
            if (isset($obj)) {
              ?>
              <li>
                <a href="#" alt="Preview">
                  Archive <?= $i ?> <span>Published <?= $obj->{'time'}; ?> - <?= $obj->{'username'}; ?></span>
                </a>
              </li>
            <?php } // End if
            }// End for ?>
        </ul>
      </div>
      <!-- End Editable UI Interface -->

      <!-- Start Editable UI Media Group -->
      <div class="eui-media-group-dialog">
        <div>
          <a href="#" class="eui-preview-close">x</a>
          <div class="eui-preview-image"><img src="" alt=""></div>
          <div class="eui-preview-alt">Alt Title</div>
          <div class="eui-preview-file-name">andrew-version12-2-123.jpg</div>
          <a href="#" class="eui-preview-change">Change Image</a>
          <div class="eui-preview-count">1 of 3</div>
        </div>
        <ul>
        <li>...</li>
        </ul>
      </div>
      <a href="#" class="eui-preview-background"></a>
      <!-- Start Editable UI Media Group -->

      <!-- Start Code Editor -->
      <div class="eui-code">
        <div>
          <span>HTML</span>
          <a href="#" class="eui-cancel"><i class="fa fa-times"></i> Cancel</a>
          <a href="#" class="eui-apply"><i class="fa fa-check"></i> Apply</a>
        </div>
        <pre>
          <code contenteditable="true" class="editable language-markup">
            ...
          </code>
        </pre>
      </div>
      <a href="#" class="eui-code-background"></a>
      <!-- End Code Editor -->

      <!-- Start Iframe Modal -->
      <div class="eui-iframe-modal">
        <a href="#" class="eui-iframe-modal-close">x</a>
        <iframe width="100%" height="100%" id="media-iframe"></iframe>
      </div>
      <a href="#" class="eui-iframe-modal-background"></a>
      <!-- End Iframe Modal -->

      <!-- Start Alerts & Messages -->
      <div class="eui-publish-success-message"><i class="fa fa-check"></i> Page Successfuly Published</div>
      <div class="eui-draft-success-message"><i class="fa fa-check"></i> Draft Successfuly Saved</div>
      <div class="eui-last-edited-dialog">
        <h3>Caution</h3>
        <p>(Recently Edited Text)</p>
        <a href="#" class="eui-continue-editing">Take Over Editing</a> <a href="#" class="eui-cancel-editing">Cancel</a>
      </div>
      <div class="eui-publish-dialog">
        <h3>Publish</h3>
        <p>Do you want to publish this draft?</p>
        <a href="#" class="eui-continue-publishing">Publish</a> <a href="#" class="eui-cancel-publishing">Cancel</a>
      </div>
      <!-- End Alerts & Messages -->

      <?php

      // Include Cotap icons
      include(TEMPLATEPATH.'/inc/icon-picker.php');

      } else {
      // End Admin Editable UI
      $eui_publish_json = get_post_meta($post->ID, 'eui_publish_json', true);
    }
  }
}
add_action('get_footer', 'eui_footer');
/* ---------------------------------- */
?>
