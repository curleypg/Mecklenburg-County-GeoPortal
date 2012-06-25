
// usage: log('inside coolFunc', this, arguments);
// paulirish.com/2009/log-a-lightweight-wrapper-for-consolelog/
window.log = function(){
  log.history = log.history || [];   // store logs to an array for reference
  log.history.push(arguments);
  arguments.callee = arguments.callee.caller;
  if(this.console) console.log( Array.prototype.slice.call(arguments) );
};
// make it safe to use console.log always
(function(b){function c(){}for(var d="assert,count,debug,dir,dirxml,error,exception,group,groupCollapsed,groupEnd,info,log,markTimeline,profile,profileEnd,time,timeEnd,trace,warn".split(","),a;a=d.pop();)b[a]=b[a]||c})(window.console=window.console||{});


// place any jQuery/helper plugins in here, instead of separate, slower script files.


/**
 * tableGenerator
 * @author	Tobin Bradley
 */
(function($) {
	$.fn.tableGenerator = function( options ) {

		// plugin's default options
		var settings = {
			'rowClass': '',
			'colClass': 'ui-widget-content',
			'fields': [],
			'nodataString': 'No records found.',
			'data': {},
			'data2': {},
			'returnType': 'rowsh',
			'rowsvCount': '3'
		};

		return this.each(function() {
			if ( options ) {
				$.extend( settings, options );
			}
			writebuffer = "";

			if (settings.returnType == 'rowsh') {
				if (settings.data.total_rows > 0) {


					// Process JSON
					$.each(settings.data.rows, function(j, item){
						writebuffer += '<tr>';
						//Check to see if it's a table that includes locate/routing functions
						if (item.row.lon) {
							zoomClick = 'onclick="zoomToLonLat(' + item.row.lon + ',' + item.row.lat + ', 8); addMarker(' + item.row.lon + ',' + item.row.lat + ', 1, \'<p><b>' + item.row.name + '</b><br />' + item.row.address + '</p>\')"';
							routeurl = googleRoute(selectedAddress.address + ' NC', item.row.lat + ',' + item.row.lon );
							writebuffer += "<td class='" + settings.colClass + "'><a href='javascript:void(0);' title='Locate on the map.' " + zoomClick + "><img src='img/find.gif' style='margin: 0px' /></a></td><td class='" + settings.colClass + "'><a href='" + routeurl + "' target='_blank' title='Get driving directions.'><img src='img/car.png' style='margin: 0px' /></a></td>"
						}
						for (i = 0; i < settings.fields.length; i++) {
							writebuffer += '<td class="' + settings.colClass + '">' + eval(settings.fields[i]) + '</td>';
						}
						writebuffer += '</tr>';
					});

					// Populate table
					$(this).append(writebuffer);

				}
				else {
					// No records found
					$(this).append('<tr><td class="' + settings.colClass + '" colspan="' + $(this).parent().children("thead").children("tr").children("th").length + '">' + settings.nodataString + '</td></tr>');
				}
			}

			if (settings.returnType == 'rowsv') {
				if (settings.data.total_rows > 0) {
					y = 0;
					for (i = 0; i < settings.fields.length; i++) {
						writebuffer += "<tr>";
						writebuffer += '<td class="' + settings.colClass + '">' + settings.fields[i] + '</td>';
						i++;
						writebuffer += '<td class="textright ' + settings.colClass + '">' + eval(settings.fields[i]) + '</td>';
						i++;
						writebuffer += '<td class="textright ' + settings.colClass + '">' + eval(settings.fields[i]) + '</td>';
						writebuffer += "</tr>";
					}

					// Populate table
					$(this).append(writebuffer);

				}
				else $(this).append('<tr><td class="' + settings.colClass + '" colspan="' + $(this).parent().children("thead").children("tr").children("th").length + '">' + settings.nodataString + '</td></tr>');



			}

		});
	};

})(jQuery);


/**
 * Fix placeholder support for IE and whatnot
 */
jQuery.support.placeholder = (function(){
    var i = document.createElement('input');
    return 'placeholder' in i;
})();
if (!$.support.placeholder) {
    $('[placeholder]').focus(function() {
      var input = $(this);
      if (input.val() == input.attr('placeholder')) {
        input.val('');
        input.removeClass('placeholder');
      }
    }).blur(function() {
      var input = $(this);
      if (input.val() === '' || input.val() == input.attr('placeholder')) {
        input.addClass('placeholder');
        input.val(input.attr('placeholder'));
      }
    }).blur();
}


/**
 * Sort option list
 */
function sortAlpha(a, b) {
    return a.innerHTML.toLowerCase() > b.innerHTML.toLowerCase() ? 1 : -1;
}


/**
* Add left and right labels to a jQuery UI Slider
*/
$.fn.extend({
    sliderLabels: function(left,right) {
        var $this = $(this);
        var $sliderdiv= $this;
        $sliderdiv
        .css({'font-weight': 'normal'});
        $sliderdiv
        .prepend('<span class="ui-slider-inner-label"  style="position: absolute; left:0px; top:15px;">'+left+ '</span>')
        .append('<span class="ui-slider-inner-label" style="position: absolute; right:0px; top:15px;">'+right+ '</span>');
    }
});


/*
 * jQuery hashchange event - v1.3 - 7/21/2010
 * http://benalman.com/projects/jquery-hashchange-plugin/
 *
 * Copyright (c) 2010 "Cowboy" Ben Alman
 * Dual licensed under the MIT and GPL licenses.
 * http://benalman.com/about/license/
 */
(function($,e,b){var c="hashchange",h=document,f,g=$.event.special,i=h.documentMode,d="on"+c in e&&(i===b||i>7);function a(j){j=j||location.href;return"#"+j.replace(/^[^#]*#?(.*)$/,"$1")}$.fn[c]=function(j){return j?this.bind(c,j):this.trigger(c)};$.fn[c].delay=50;g[c]=$.extend(g[c],{setup:function(){if(d){return false}$(f.start)},teardown:function(){if(d){return false}$(f.stop)}});f=(function(){var j={},p,m=a(),k=function(q){return q},l=k,o=k;j.start=function(){p||n()};j.stop=function(){p&&clearTimeout(p);p=b};function n(){var r=a(),q=o(m);if(r!==m){l(m=r,q);$(e).trigger(c)}else{if(q!==m){location.href=location.href.replace(/#.*/,"")+q}}p=setTimeout(n,$.fn[c].delay)}$.browser.msie&&!d&&(function(){var q,r;j.start=function(){if(!q){r=$.fn[c].src;r=r&&r+a();q=$('<iframe tabindex="-1" title="empty"/>').hide().one("load",function(){r||l(a());n()}).attr("src",r||"javascript:0").insertAfter("body")[0].contentWindow;h.onpropertychange=function(){try{if(event.propertyName==="title"){q.document.title=h.title}}catch(s){}}}};j.stop=k;o=function(){return a(q.location.href)};l=function(v,s){var u=q.document,t=$.fn[c].domain;if(v!==s){u.title=h.title;u.open();t&&u.write('<script>document.domain="'+t+'"<\/script>');u.close();q.location.hash=v}}})();return j})()})(jQuery,this);


/*
    jQuery pub/sub plugin by Peter Higgins
	https://github.com/phiggins42/bloody-jquery-plugins/blob/master/pubsub.js
    Modified by Tobin Bradley
    AFL/BSD Licensed
*/
;(function(d){
    // the topic/subscription hash
    var cache = {};
    // Publish some data on a named topic.
    d.publish = function(topic, args){
        cache[topic] && d.each(cache[topic], function(){
            try {
                this.apply(d, args || []);
            } catch(err) {
                console.log(err);
            }
        });
    };
    // Register a callback on a named topic.
    d.subscribe = function(topic, callback){
        if(!cache[topic]){
            cache[topic] = [];
        }
        cache[topic].push(callback);
        return [topic, callback]; // Array
    };
    // Disconnect a subscribed function for a topic.
    d.unsubscribe = function(topic, callback){
        cache[topic] && d.each(cache[topic], function(idx){
            if(this == callback){
                cache[topic].splice(idx, 1);
            }
        });
    };
    // List Subscribers
    d.subscribers = function(topic) {
        l = [];
        cache[topic] && d.each(cache[topic], function(idx){
            l.push(this.name);
        });
        return l;
    };
})(jQuery);


/**
 * Google Earth - Maps Integration r337
 * http://code.google.com/p/google-maps-utility-library-v3/source/browse/trunk/googleearth/#googleearth%2Fsrc
 */

/**
 * @constructor
 * @param {google.maps.Map} map the Map associated with this Earth instance.
 */
/**
 * @fileoverview Earth API library for Maps v3.
 * usage:  var ge = new GoogleEarth(map);.
 * @author jlivni@google.com (Josh Livni).
 */
function GoogleEarth(a){if(!google||!google.earth){throw"google.earth not loaded"}if(!google.earth.isSupported()){throw"Google Earth API is not supported on this system"}if(!google.earth.isInstalled()){throw"Google Earth API is not installed on this system"}this.RED_ICON_="http://maps.google.com/mapfiles/kml/paddle/red-circle.png";this.map_=a;this.mapDiv_=a.getDiv();this.earthVisible_=false;this.earthTitle_="Earth";this.moveEvents_=[];this.overlays_={};this.lastClickedPlacemark_=null;this.displayCounter_=0;this.addEarthMapType_();this.addEarthControl_()}window["GoogleEarth"]=GoogleEarth;GoogleEarth.MAP_TYPE_ID="GoogleEarthAPI";GoogleEarth["MAP_TYPE_ID"]=GoogleEarth.MAP_TYPE_ID;GoogleEarth.INFO_WINDOW_OPENED_EVENT_="GEInfoWindowOpened";GoogleEarth.MAX_EARTH_ZOOM_=27;GoogleEarth.prototype.getInstance=function(){return this.instance_};GoogleEarth.prototype["getInstance"]=GoogleEarth.prototype.getInstance;GoogleEarth.prototype.addEarthMapType_=function(){var a=this.map_;var b={tileSize:new google.maps.Size(256,256),maxZoom:19,name:this.earthTitle_,alt:this.earthTitle_,getTile:function(a,b,c){var d=c.createElement("DIV");return d}};a.mapTypes.set(GoogleEarth.MAP_TYPE_ID,b);var c={mapTypeControlOptions:{mapTypeIds:[google.maps.MapTypeId.ROADMAP,google.maps.MapTypeId.SATELLITE,GoogleEarth.MAP_TYPE_ID]}};a.setOptions(c);var d=this;google.maps.event.addListener(a,"maptypeid_changed",function(){d.mapTypeChanged_()})};GoogleEarth.prototype.mapTypeChanged_=function(){if(this.map_.getMapTypeId()==GoogleEarth.MAP_TYPE_ID){this.showEarth_()}else{this.switchToMapView_()}};GoogleEarth.prototype.showEarth_=function(){var a=this.findMapTypeControlDiv_();this.setZIndexes_(a);this.addShim_(a);this.controlDiv_.style.display="";this.earthVisible_=true;if(!this.instance_){this.initializeEarth_();return}this.refresh_()};GoogleEarth.prototype.refresh_=function(){this.overlays_={};this.flyToMapView_(true);this.clearPlacemarks_();this.displayCounter_++;this.clearMoveEvents_();this.addMapOverlays_();this.addMeckLayers_()};GoogleEarth.prototype.clearMoveEvents_=function(){for(var a=0,b;b=this.moveEvents_[a];a++){google.maps.event.removeListener(b)}};GoogleEarth.prototype.clearPlacemarks_=function(){var a=this.instance_.getFeatures();while(a.getFirstChild()){a.removeChild(a.getFirstChild())}};GoogleEarth.prototype.flyToMapView_=function(a){var b=this.map_.getCenter();var c=this.instance_.createLookAt("");var d=Math.pow(2,GoogleEarth.MAX_EARTH_ZOOM_-this.map_.getZoom());c.setRange(d);c.setLatitude(b.lat());c.setLongitude(b.lng());c.setHeading(0);c.setAltitude(0);var e=this.instance_;if(a){e.getOptions().setFlyToSpeed(5);c.setTilt(30);e.getOptions().setFlyToSpeed(.75);window.setTimeout(function(){e.getView().setAbstractView(c)},200);window.setTimeout(function(){e.getOptions().setFlyToSpeed(1)},250)}else{e.getView().setAbstractView(c)}};GoogleEarth.getKMLColor_=function(a,b){if(a[0]=="#"){a=a.substring(1,9)}if(typeof b=="undefined"){b="FF"}else{b=parseInt(parseFloat(b)*255,10).toString(16);if(b.length==1){b="0"+b}}var c=a.substring(0,2);var d=a.substring(2,4);var e=a.substring(4,6);var f=[b,e,d,c].join("");return f};GoogleEarth.prototype.generatePlacemarkId_=function(a){var b=this.displayCounter_+"GEV3_"+a["__gme_id"];return b};GoogleEarth.prototype.createPlacemark_=function(a){var b=this.generatePlacemarkId_(a);this.overlays_[b]=a;return this.instance_.createPlacemark(b)};GoogleEarth.prototype.addGroundOverlay_=function(a){var b=a.getBounds();var c=b.getNorthEast();var d=b.getSouthWest();var e=this.instance_;var f=e.createGroundOverlay("");f.setLatLonBox(e.createLatLonBox(""));var g=f.getLatLonBox();g.setBox(c.lat(),d.lat(),c.lng(),d.lng(),0);f.setIcon(e.createIcon(""));f.getIcon().setHref(a.getUrl());e.getFeatures().appendChild(f)};GoogleEarth.prototype.addKML_=function(a){var b=this.instance_;google.earth.fetchKml(b,a,function(a){if(!a){window.setTimeout(function(){alert("Bad or null KML.")},0);return}b.getFeatures().appendChild(a)})};GoogleEarth.prototype.updatePlacemark_=function(a){var b=this.overlays_[a];var c=this.instance_.getElementById(a);var d=c.getGeometry();var e=b.getPosition();d.setLatitude(e.lat());d.setLongitude(e.lng())};GoogleEarth.prototype.createPoint_=function(a){if(!a.getPosition()){return}var b=this.instance_;var c=this.createPlacemark_(a);if(a.getTitle()){c.setName(a.getTitle())}var d=b.createIcon("");if(a.getIcon()){d.setHref(a.getIcon())}else{d.setHref(this.RED_ICON_)}var e=b.createStyle("");e.getIconStyle().setIcon(d);c.setStyleSelector(e);var f=b.createPoint("");f.setLatitude(a.getPosition().lat());f.setLongitude(a.getPosition().lng());c.setGeometry(f);b.getFeatures().appendChild(c);var g=this;var h=google.maps.event.addListener(a,"position_changed",function(){var b=g.generatePlacemarkId_(a);g.updatePlacemark_(b)});this.moveEvents_.push(h)};GoogleEarth.computeOffset_=function(a,b,c){var d=6378137;b/=d;c=c*(Math.PI/180);var e=a.lat()*(Math.PI/180);var f=a.lng()*(Math.PI/180);var g=Math.cos(b);var h=Math.sin(b);var i=Math.sin(e);var j=Math.cos(e);var k=g*i+h*j*Math.cos(c);var l=Math.atan2(h*j*Math.sin(c),g-i*k);return new google.maps.LatLng(Math.asin(k)/(Math.PI/180),(f+l)/(Math.PI/180))};GoogleEarth.prototype.getMVCVal_=function(a,b,c){var d=a.get(b);if(typeof d=="undefined"){return c}else{return d}};GoogleEarth.prototype.addMapOverlays_=function(){var a=this.getOverlays_();for(var b=0,c;c=a["Marker"][b];b++){this.createPoint_(c)}for(var b=0,d;d=a["KmlLayer"][b];b++){this.addKML_(d.getUrl())}for(var b=0,e;e=a["GroundOverlay"][b];b++){this.addGroundOverlay_(e)}};GoogleEarth.prototype.addMeckLayers_=function(){features=folder.getFeatures();while(features.getFirstChild()){features.removeChild(features.getFirstChild())}ge=this.getInstance();$.each(overlayMaps,function(a){if($("#"+a).is(":checked")&&overlayMaps[a].kmlnetworkpath){var b=ge.createLink("");b.setHref(overlayMaps[a].kmlnetworkpath);var c=ge.createNetworkLink("");c.setLink(b);folder.getFeatures().appendChild(c)}});var a=ge.createLink("");a.setHref("http://maps.co.mecklenburg.nc.us/geoserver/gwc/service/kml/postgis:tax_parcels.png.kml");var b=ge.createNetworkLink("");b.setLink(a);folder.getFeatures().appendChild(b);ge.getFeatures().appendChild(folder)};GoogleEarth.prototype.initializeEarth_=function(){var a=this;google.earth.createInstance(this.earthDiv_,function(b){a.instance_=b;folder=b.createFolder("");folder.setOpacity(.7);a.addEarthEvents_();a.refresh_()},function(b){a.hideEarth_();a.map_.setMapTypeId(google.maps.MapTypeId.ROADMAP);throw"Google Earth API failed to initialize: "+b})};GoogleEarth.prototype.addEarthEvents_=function(){var a=this.instance_;a.getWindow().setVisibility(true);var b=a.getNavigationControl();b.setVisibility(a.VISIBILITY_AUTO);var c=b.getScreenXY();c.setYUnits(a.UNITS_INSET_PIXELS);c.setXUnits(a.UNITS_PIXELS);var d=a.getLayerRoot();d.enableLayerById(a.LAYER_BORDERS,true);d.enableLayerById(a.LAYER_ROADS,true);d.enableLayerById(a.LAYER_BUILDINGS,true);d.enableLayerById(a.LAYER_TERRAIN,true);d.enableLayerById(a.LAYER_TREES,true);a.getOptions().setAtmosphereVisibility(true);var e=this;google.maps.event.addListener(this.map_,GoogleEarth.INFO_WINDOW_OPENED_EVENT_,function(a){if(!e.earthVisible_){return}var b=e.instance_.createHtmlStringBalloon("");var c=e.lastClickedPlacemark_;b.setFeature(c);b.setContentString(a.getContent());e.instance_.setBalloon(b)});google.earth.addEventListener(a.getGlobe(),"mousemove",function(a){$("#toolbar-coords").text(a.getLongitude().toFixed(4)+" "+a.getLatitude().toFixed(4)+" Elev: "+Math.round(a.getAltitude()*3.2808399)+"ft")});google.earth.addEventListener(a.getGlobe(),"click",function(a){e.resizeEarth_();var b=a.getTarget();var c=e.overlays_[b.getId()];if(c){a.preventDefault();var d=e.getOverlaysForType_("InfoWindow");for(var f=0,g;g=d[f];f++){g.close()}e.lastClickedPlacemark_=b;google.maps.event.trigger(c,"click")}})};GoogleEarth.prototype.matchMapToEarth_=function(){var a=this.instance_.getView().copyAsLookAt(this.instance_.ALTITUDE_RELATIVE_TO_GROUND);var b=a.getRange();var c=Math.round(GoogleEarth.MAX_EARTH_ZOOM_-Math.log(b)/Math.log(2));if(!this.map_.getZoom()==c){this.map_.setZoom(c-1)}else{this.map_.setZoom(c)}var d=new google.maps.LatLng(a.getLatitude(),a.getLongitude());this.map_.panTo(d)};GoogleEarth.prototype.switchToMapView_=function(){if(!this.earthVisible_){return}this.matchMapToEarth_();var a=this;window.setTimeout(function(){a.flyToMapView_()},50);window.setTimeout(function(){a.hideEarth_()},2200)};GoogleEarth.prototype.hideEarth_=function(){this.unsetZIndexes_();this.removeShim_();this.controlDiv_.style.display="none";this.earthVisible_=false};GoogleEarth.prototype.setZIndexes_=function(a){var b=a.style.zIndex;var c=this.controlDiv_.parentNode.childNodes;for(var d=0,e;e=c[d];d++){e["__gme_ozi"]=e.style.zIndex;e.style.zIndex=-1}a["__gme_ozi"]=b;this.controlDiv_.style.zIndex=a.style.zIndex=0};GoogleEarth.prototype.unsetZIndexes_=function(){var a=this.controlDiv_.parentNode.childNodes;for(var b=0,c;c=a[b];b++){c.style.zIndex=c["__gme_ozi"]}};GoogleEarth.prototype.addShim_=function(a){var b=this.iframeShim_=document.createElement("IFRAME");b.src="javascript:false;";b.scrolling="no";b.frameBorder="0";var c=b.style;c.zIndex=-1e5;c.width=c.height="100%";c.position="absolute";c.left=c.top=0;a.appendChild(b)};GoogleEarth.prototype.removeShim_=function(){this.iframeShim_.parentNode.removeChild(this.iframeShim_);this.iframeShim_=null};GoogleEarth.prototype.findMapTypeControlDiv_=function(){var a="title=['\"]?"+this.earthTitle_+"[\"']?";var b=new RegExp(a);var c=this.controlDiv_.parentNode.childNodes;for(var d=0,e;e=c[d];d++){if(b.test(e.innerHTML)){return e}}};GoogleEarth.prototype.addEarthControl_=function(){var a=this.mapDiv_;var b=this.controlDiv_=document.createElement("DIV");b.style.position="absolute";b.style.width=0;b.style.height=0;b.index=0;b.style.display="none";var c=this.innerDiv_=document.createElement("DIV");c.style.width=a.clientWidth+"px";c.style.height=a.clientHeight+"px";c.style.position="absolute";b.appendChild(c);var d=this.earthDiv_=document.createElement("DIV");d.style.position="absolute";d.style.width="100%";d.style.height="100%";c.appendChild(d);this.map_.controls[google.maps.ControlPosition.TOP_LEFT].push(b);var e=this;google.maps.event.addListener(this.map_,"resize",function(){e.resizeEarth_()})};GoogleEarth.prototype.resizeEarth_=function(){var a=this.innerDiv_.style;var b=this.mapDiv_;a.width=b.clientWidth+"px";a.height=b.clientHeight+"px"};GoogleEarth.prototype.getOverlaysForType_=function(a){var b=[];var c=GoogleEarth.overlays_[a];for(var d in c){if(c.hasOwnProperty(d)){var e=c[d];if(e.get("map")==this.map_){b.push(e)}}}return b};GoogleEarth.prototype.getOverlays_=function(){var a={};var b=GoogleEarth.OVERLAY_CLASSES;for(var c=0,d;d=b[c];c++){a[d]=this.getOverlaysForType_(d)}return a};GoogleEarth.overlays_={};GoogleEarth.modifyOpen_=function(){google.maps.InfoWindow.prototype.openOriginal_=google.maps.InfoWindow.prototype["open"];GoogleEarth.overlays_["InfoWindow"]={};google.maps.InfoWindow.prototype["open"]=function(a,b){if(a){if(!this["__gme_id"]){this["__gme_id"]=GoogleEarth.counter_++;GoogleEarth.overlays_["InfoWindow"][this["__gme_id"]]=this}}else{delete GoogleEarth.overlays_["InfoWindow"][this["__gme_id"]];this["__gme_id"]=undefined}google.maps.event.trigger(a,GoogleEarth.INFO_WINDOW_OPENED_EVENT_,this);this.openOriginal_(a,b)}};GoogleEarth.modifySetMap_=function(a){var b=google.maps[a].prototype;b["__gme_setMapOriginal"]=b.setMap;GoogleEarth.overlays_[a]={};google.maps[a].prototype["setMap"]=function(b){if(b){if(!this["__gme_id"]){this["__gme_id"]=GoogleEarth.counter_++;GoogleEarth.overlays_[a][this["__gme_id"]]=this}}else{delete GoogleEarth.overlays_[a][this["__gme_id"]];this["__gme_id"]=undefined}this["__gme_setMapOriginal"](b)}};GoogleEarth.OVERLAY_CLASSES=["Marker","Polyline","Polygon","Rectangle","Circle","KmlLayer","GroundOverlay","InfoWindow"];GoogleEarth.counter_=0;GoogleEarth.trackOverlays_=function(){var a=GoogleEarth.OVERLAY_CLASSES;for(var b=0,c;c=a[b];b++){GoogleEarth.modifySetMap_(c);if(c=="InfoWindow"){GoogleEarth.modifyOpen_()}}};GoogleEarth.trackOverlays_()

/**
 * Sort photos
 */
function sortPhotos(a, b) {
    return parseInt(a.getAttribute("data-date")) < parseInt(b.getAttribute("data-date")) ? 1 : -1;
};


