Editable UI
==========

Editable UI created by [@ethanhackett](https://twitter.com/ethanhackett) and distributed under GPL licensing.

---

##Admin Config
To access Editable UI admin configurations, login to wordpress and navigate to **Settigns** -> **Editable UI**

####<a name="admin-maxarchive"></a>Max Archive Count
Max archive count sets how many JSON archive versions Wordpress should store. Depending on hosting resources and configuration it may be advantages to modify max archive counts.

The default max archive count is 3.

####<a name="admin-errors"></a>Display Errors
ID pairing is essencial for the storing and retrieving of values with Editable UI. Turning this setting on adds a red alert class to elements with editable classes that lack IDs.

Error is only visable to logged in Wordpress editors. Visitors will not see these errors messages.

####<a name="admin-json"></a>Display JSON Inputs
Displaying JSON Inputs can help with the debugging process or when migrating page content from a sandbox envornment to production. The form reveals the inputs and the JSON data associated with each page.

To see the JSON inputs navigate to the page and scroll to the footer. You will see a small form which will allow you to directly edit, copy, paste or post page data.

JSON input elements are only visable to logged in Wordpress editors. Visitors will not see these the form.

####<a name="admin-privilages"></a>Editable UI Privilages
Giving a user editable abilities should be carefully considered. Not all users understand the impace copy changes have. the Editable UI plugin was designed to midigate editors ability to break webpages however it is still possible to add rouge html tags which can break a site.

If you're seeing empty checkboxes this is simply an indicator that some of your users lack first or lastnames. It is not recemended that you check any empty boxes for security reasons.

<br/>

---

##Frontend Markup
Markup editable content areas by adding one of the following classes or class combinations with an id.

```
 <h2 id="header" class="eui-element"><?= $header ?></h2>
 
 <div id="paragraph" class="eui-element html"><?= $paragraph ?></div>
 
 <img class="eui-media" id="image" src="<?= $image ?>" title="<?= $image_title ?>" alt="<?= $image_alt ?>" data-eui-media-group="Group Images"/>
 
```

###IDs

HTML ID's are used during the JSON saving process. Each ID represents a key for storing dating and must exists.

IDs must only be alpha numeric with _. using dashes or special characters will break the output methods **A-z, 0-9, and \_**.

```
 <div id="unique_id">I'm an element with an ID.</div>
```

###Classes .eui-element

######<a name="editor-element"></a>Text
Add the **eui-element** class to an HTML element to allow basic text editing. This will strip any HTML and only allow for basic text midifications. This is ideal for headers or blocks of copy.

```
 <div id="unique_id" class="eui-element html">I'm an editable TEXT element.</div>
```

######<a name="editor-html"></a>HTML .eui-element.html
Add the **eui-element** and **html** classes to an element to enable both text and HTML copy. Adding the .html class will append a little gray (html) button at the end of the element which will allow users to toggle a basic web based HTML editor.

```
 <div id="unique_id" class="eui-element html">I'm an editable TEXT & HTML element.</div>
```

######<a name="editor-media"></a>Image .eui-media
Add the **eui-media** class to an image.

```
 <div id="unique_id" class="eui-media" alt="Image Here" src="htt://domain.com/image.jpg"/>
```
######<a name="editor-media-groups"></a>Image Groups
Images can be grouped together for galleries or in the case of responsive layouts that show and hide images when a page is resized.

To group images add the custom data attribute **data-eui-media-group**.

```
 <div id="unique_id" class="eui-media" alt="Image Here" src="htt://domain.com/image.jpg" data-eui-media-group="Image Grouping"/>
```

######Returning Editable Values
Since Editable UI Pairs the values with the element ID as the key we simply output the ID as a php variable and Editable UI handles the rest JSON parsin. You can use either php templating shorthand or php echo **<?= $unique_id ?>** or **<?php echo $unique_id; ?>**, both will work.

**<a name="example-text"></a>Text**

```
 <div id="unique_id_1" class="eui-element"><?= $unique_id_1 ?></div>
 
 <div id="unique_id_2" class="eui-element"><?php echo $unique_id_2; ?></div>
```

**<a name="example-image"></a>Image**

Images are a little different since they include both the url to the image, alt tag and a title. The title is how Wordpress tracks images in their media gallery.

Make sure you inlcude an alt tag and a title tag by adding **"_alt"** and **"_title"** to the end of the php variable.

```
 <img class="eui-media" id="photo_image_1" src="<?= $photo_image_1 ?>" title="<?= $photo_image_1_title ?>" alt="<?= $photo_image_1_alt ?>" data-eui-media-group="Image Group"/>
 
 <img class="eui-media" id="photo_image_2" src="<?php echo $photo_image_2; ?>" title="<?php echo $photo_image_2_title; ?>" alt="<?php ehco $photo_image_2_alt; ?>" data-eui-media-group="Image Group"/>
```
<br/>

---

##Trouble Shooting
While creating Editable UI I tried to anticipate common mistakes or errors. However, sometimes trouble shooting and debugging is nesesary.

####Fixing JSON Data
Sometimes JSON data errors can occur while saving and it can be help to [display JSON inputs](#admin-json) and copy the JSON data into a [JSON validator](http://www.jsoneditoronline.org) to ensure your JSON strings are valid.

####Missing IDS
Missing or invalid IDs are a common bugs. To simplify data retrieval from the JSON data the elements value is paired with it's ID. Turn [display errors](#admin-errors) to track down the tricky bugger.

####Images
Don't forget to add alt and title tags to images.

####Edit in edit in edit... 
It is possible that users to copy and paste an Editable UI element into another if they're copy and pasting code. This can cause "Edit-ception", where an editor is inside another editor or a premature closing tag breaks the edit box. You may have to go copy the JSON file and clean it up manually or try switching to Safari which tends to be cleaner about the copy and pasting process.
