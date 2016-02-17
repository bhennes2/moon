/*
======================================================================
current_moon.js

Include this in the head node of the page.
====================================================================== */


/* write once, read many, so that the image and the stats are for
   the same date/time */

var moon_imagenum;


/*
======================================================================
get_moon_imagenum()

Initialize the frame number.  If the current date is within the year
2016, the frame number is the (rounded) number of hours since the
start of the year.  Otherwise it's 1.
====================================================================== */

function get_moon_imagenum()
{
   var now = new Date();
   var year = now.getUTCFullYear();
   if ( year != 2016 ) {
      moon_imagenum = 1;
      return false;
   }
   var janone = Date.UTC( year, 0, 1, 0, 0, 0 );
   moon_imagenum = 1 + Math.round(( now.getTime() - janone ) / 3600000.0 );
   if ( moon_imagenum > 8784 ) moon_imagenum = 8784;
   return false;
}


/*
======================================================================
show_moon_image()

Write the img tag that displays the current Moon image defined by
moon_imagenum.  Called from the body at the point where the image
should appear.

This is called when the page is first loaded.  When the image needs to
be replaced later, use replace_moon_image().
====================================================================== */

function show_moon_image()
{
   var fn = "000" + moon_imagenum;
   fn = fn.slice( fn.length - 4 );

   /* prepend this path to the filename, if needed */
   var domain = "http://svs.gsfc.nasa.gov"
   var path = "/vis/a000000/a004400/a004404/";

   document.write( "<a id='map_link' href='" + path +
      "frames/5760x3240_16x9_30p/fancy/comp." + fn + ".tif'>" +
      "<img id='moon_image' src='" +
      path + "frames/730x730_1x1_30p/moon." + fn + ".jpg' alt='Frame " +
      fn + "' title='Frame " + fn + "'></a>" );
}


/*
======================================================================
include_moon_stats()

Append the Javascript function that displays the statistics.  The
appended function is show_moon_info(), which is called from the body
at the point that the statistics table should appear.

This is called when the page is first loaded.  When the table needs to
be replaced later, use replace_moon_stats().
====================================================================== */

function include_moon_stats()
{
   var fn = "000" + moon_imagenum;
   fn = fn.slice( fn.length - 4 );

   /* prepend this path to the filename, if needed */
   var domain = "http://svs.gsfc.nasa.gov"
   var path = "/vis/a000000/a004400/a004404/";

   var filename = path + "mooninfo/mooninfo." + fn + ".js";
   document.write( "<scr" + "ipt id='moon_info_script' type='text/javascript' src='" +
      filename + "'></scr" + "ipt>" );
}


/*
======================================================================
replace_moon_image()

Replace the Moon image.  Uses the Document Object Model to find the
img element with ID "moon_image" and replace its src and alt values.
====================================================================== */

function replace_moon_image()
{
   var fn = "000" + moon_imagenum;
   fn = fn.slice( fn.length - 4 );

   /* prepend this path to the filename, if needed */
   var domain = "http://svs.gsfc.nasa.gov"
   var path = "/vis/a000000/a004400/a004404/";

   var filename = path + "frames/730x730_1x1_30p/moon." + fn + ".jpg";
   var element = document.getElementById( "moon_image" );
   element.src = filename;
   element.alt = "Frame " + fn;
   element.title = "Frame " + fn;

   filename = path + "frames/5760x3240_16x9_30p/fancy/comp." + fn + ".tif";
   element = document.getElementById( "map_link" );
   element.href = filename;
}


/*
======================================================================
replace_moon_stats()

Replace the function that writes the table of Moon statistics, then
call that function.  We need to set up a callback that's fired after
the function text has been loaded, so that we don't try to call the
function before it's been replaced.  Uses the DOM to find the script
with ID "moon_info_script", remove it, and add the new script.  See

http://www.javascriptkit.com/javatutors/loadjavascriptcss2.shtml
====================================================================== */

function replace_moon_stats()
{
   var fn = "000" + moon_imagenum;
   fn = fn.slice( fn.length - 4 );

   var element = document.getElementById( "moon_info_script" );
   var pnode = element.parentNode;
   pnode.removeChild( element );

   /* prepend this path to the filename, if needed */
   var domain = "http://svs.gsfc.nasa.gov"
   var path = "/vis/a000000/a004400/a004404/";

   var filename = path + "mooninfo/mooninfo." + fn + ".js";
   element = document.createElement( "script" );
   element.setAttribute( "type", "text/javascript" );
   element.setAttribute( "src", filename );
   element.setAttribute( "id", "moon_info_script" );

   /* This ensures that we don't try to call the new show_moon_info()
      until it's actually loaded. */

   element.onload = function () { show_moon_info(); }

   /* IE handles this with a different event. */

   element.onreadystatechange = function () {
      if ( element.readyState == 'complete' || element.readyState == 'loaded' )
         show_moon_info();
   }

   pnode.appendChild( element );
}


/*
======================================================================
init_user_date()

Initialize the user date input fields based on moon_imagenum.  Called
in index.html after the input tags (the input elements must exist in
the DOM before this is called).
====================================================================== */

function init_user_date()
{
   var em = document.getElementById( "moon_month" );
   var ed = document.getElementById( "moon_day" );
   var eh = document.getElementById( "moon_hour" );

   var janone = Date.UTC( 2016, 0, 1, 0, 0, 0 );
   var now = new Date( 3600000.0 * ( moon_imagenum - 1 ) + janone );
   em.value = now.getUTCMonth() + 1;
   ed.value = now.getUTCDate();
   eh.value = now.getUTCHours();
}


/*
======================================================================
new_user_date()

Callback for the Update button.  Sets the new image number, then calls
functions to replace the image and the info table.
====================================================================== */

function new_user_date()
{
   var md = [ 31, 29, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31 ];
   var em = document.getElementById( "moon_month" );
   var ed = document.getElementById( "moon_day" );
   var eh = document.getElementById( "moon_hour" );

   if ( isNaN( em.value )) em.value = 1;
   if ( em.value > 12 ) em.value = 12;
   if ( em.value <  1 ) em.value =  1;

   if ( isNaN( ed.value )) ed.value = 1;
   if ( ed.value > md[ em.value - 1 ] ) ed.value = md[ em.value - 1 ];
   if ( ed.value <  1 ) ed.value =  1;

   if ( isNaN( eh.value )) eh.value = 0;
   if ( eh.value > 23 ) eh.value = 23;
   if ( eh.value <  0 ) eh.value =  0;

   var t = Date.UTC( 2016, em.value - 1, ed.value, eh.value, 0, 0 );
   var janone = Date.UTC( 2016, 0, 1, 0, 0, 0 );
   moon_imagenum = 1 + Math.round(( t - janone ) / 3600000.0 );

   replace_moon_image();
   replace_moon_stats();
}


get_moon_imagenum();
include_moon_stats();
