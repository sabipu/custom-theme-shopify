var config = {
  upload_url: "https://uploads.cablesmiths.com.au/upload.php",
  image_url: "https://s3-ap-southeast-1.amazonaws.com/cdn-dilate-digital/cablesmiths/",
  shop_url: "https://cablesmiths.com.au",
  default_uri: "c=1&cable-brand=canare&cable-type=canare_6mm&cable-length=3&cable-color=canare_6mm_black&connectorA-brand=neutrik&connectorA-connection=neutrik_xlr&connectorA-connector=neutrik_male_black_xlr&connectorA-ring=neutrik_ringColor_black&connectorA-boot=neutrik_bootColor_black&connectorB-brand=neutrik&connectorB-connection=neutrik_xlr&connectorB-connector=neutrik_female_black_xlr&connectorB-ring=neutrik_ringColor_black&connectorB-boot=neutrik_bootColor_black",
  url_slug: "/pages/microphone-configurator",
  item_property_slug: "Custom Mic Cable",
  disable_animation: false,
};
var orderLines = [];
var orderLinesData = [];
var products = undefined;
var order = {
  uniqueid: generateUID(),
  custom_logo: undefined,
  custom_logo_filename: undefined
};


var prefill = {
  cable: { brand: null, type: null, length: null, color: null, },
  connectorA: { brand: null, connection: null, connector: null, ring: null, boot: null, },
  connectorB: { brand: null, connection: null, connector: null, ring: null, boot: null, },
  custom: { url: null, text: null, ink: null, },
  sleeve: null,
  tie: null,
};


$( document ).ready(function() {
    shouldUpdateLink = false;
    setupColors();
    setupInputOptions();
    setupAccordion();
    setupTextLengthInputs();
    setupSelectInputs();
    setupBraidedSleeves();
    setupChooseables();
    setupWindowScroll();
    setupUploadButton();
    setupAddToCart();
    getShopifyProducts();
    setupURLValues();
    readPrefillURL();
    shouldUpdateLink = false;
});



function loadPrefillProduct(obj)
{
  console.log("loading prefill obj", obj);
  var v = undefined;
  var $chooseable = undefined;
  // config.disable_animation = true;

  // start of cable
  // cable brand
  loadPrefillProduct_selectChooseable(obj.cable.brand, '#select_cable_brand');

  // cable type
  loadPrefillProduct_selectChooseable(obj.cable.type, '#select_cable_types');
  
  // cable color
  loadPrefillProduct_selectChooseable(obj.cable.color, '#select_cable_color');

  // cable length
  v = obj.cable.length;
  if(v != null)
  {
    $chooseable = $('#select_cable_length input[type=text]');
    if($chooseable.length > 0)
    {
      $chooseable.val(v + " m");
      $chooseable.attr("data-number", v);
    }
  }

  // connector A
  // connector A brand
  loadPrefillProduct_selectChooseable(obj.connectorA.brand, '#select_connectorA_brand');
  // connector A connection
  loadPrefillProduct_selectChooseable(obj.connectorA.connection, '#select_connectorA_connection');
  // connector A connector
  loadPrefillProduct_selectChooseable(obj.connectorA.connector, '#select_connectorA_connector');
  // connector A ring
  loadPrefillProduct_selectChooseable(obj.connectorA.ring, '#select_connectorA_ringColor');
  // connector A boot
  loadPrefillProduct_selectChooseable(obj.connectorA.boot, '#select_connectorA_bootColor');

  // connector B
  // connector B brand
  loadPrefillProduct_selectChooseable(obj.connectorB.brand, '#select_connectorB_brand');
  // connector B connection
  loadPrefillProduct_selectChooseable(obj.connectorB.connection, '#select_connectorB_connection');
  // connector B connector
  loadPrefillProduct_selectChooseable(obj.connectorB.connector, '#select_connectorB_connector');
  // connector B ring
  loadPrefillProduct_selectChooseable(obj.connectorB.ring, '#select_connectorB_ringColor');
  // connector B boot
  loadPrefillProduct_selectChooseable(obj.connectorB.boot, '#select_connectorB_bootColor');


  // custom logo
  if(obj.custom.url != null)
  {
    $chooseable = $('#uploaded_image');
    if($chooseable.length > 0)
    {
      $(".uploaded_image").addClass("user_custom_image");
      $chooseable.css("background-image", "url(" + obj.custom.url + ")");
      order.custom_logo = obj.custom.url;
    }
  }

  // custom text
  v = obj.custom.text;
  if(v != null)
  {
    $chooseable = $('#input_box_custom_text');
    if($chooseable.length > 0)
    {
      $chooseable.val(v);
    }
  }

  // custom ink color
  loadPrefillProduct_selectChooseable(obj.custom.ink, '#custom_text_logo_color_select');

  // sleeve
  loadPrefillProduct_selectChooseable(obj.sleeve, '#input_select_cable_sleeve');

  // tie
  loadPrefillProduct_selectChooseable(obj.tie, '#input_select_cable_tie');


  $("#options .group").removeClass("open").addClass("closed");
  $("#options #cable").addClass("open");


}


function getURIForPrefillObject(obj)
{
  obj = typeof obj == "undefined" ? getPrefillURLObject() : obj;
  var uri = "";
  if(obj.cable.brand != null) { uri += "&cable-brand=" + obj.cable.brand; }
  if(obj.cable.type != null) { uri += "&cable-type=" + obj.cable.type; }
  if(obj.cable.length != null) { uri += "&cable-length=" + obj.cable.length; }
  if(obj.cable.color != null) { uri += "&cable-color=" + obj.cable.color; }
  if(obj.connectorA.brand != null) { uri += "&connectorA-brand=" + obj.connectorA.brand; }
  if(obj.connectorA.connection != null) { uri += "&connectorA-connection=" + obj.connectorA.connection; }
  if(obj.connectorA.connector != null) { uri += "&connectorA-connector=" + obj.connectorA.connector; }
  if(obj.connectorA.ring != null) { uri += "&connectorA-ring=" + obj.connectorA.ring; }
  if(obj.connectorA.boot != null) { uri += "&connectorA-boot=" + obj.connectorA.boot; }
  if(obj.connectorB.brand != null) { uri += "&connectorB-brand=" + obj.connectorB.brand; }
  if(obj.connectorB.connection != null) { uri += "&connectorB-connection=" + obj.connectorB.connection; }
  if(obj.connectorB.connector != null) { uri += "&connectorB-connector=" + obj.connectorB.connector; }
  if(obj.connectorB.ring != null) { uri += "&connectorB-ring=" + obj.connectorB.ring; }
  if(obj.connectorB.boot != null) { uri += "&connectorB-boot=" + obj.connectorB.boot; }
  if(obj.custom.url != null) { uri += "&custom-url=" + obj.custom.url; }
  if(obj.custom.text != null) { uri += "&custom-text=" + obj.custom.text; }
  if(obj.custom.ink != null) { uri += "&custom-ink=" + obj.custom.ink; }
  if(obj.sleeve != null) { uri += "&sleeve=" + obj.sleeve; }
  if(obj.tie != null) { uri += "&tie=" + obj.tie; }
  return uri.length > 0 ? encodeURI("c=1" + uri) : "";
}


// function to read URL parameters into prefill object


function readPrefillURI (uri)
{
  let searchParams = new URLSearchParams(uri);
  prefill.cable.brand = searchParams.get('cable-brand');
  prefill.cable.type = searchParams.get('cable-type');
  prefill.cable.length = searchParams.get('cable-length');
  prefill.cable.color = searchParams.get('cable-color');

  prefill.connectorA.brand = searchParams.get('connectorA-brand');
  prefill.connectorA.connection = searchParams.get('connectorA-connection');
  prefill.connectorA.connector = searchParams.get('connectorA-connector');
  prefill.connectorA.ring = searchParams.get('connectorA-ring');
  prefill.connectorA.boot = searchParams.get('connectorA-boot');

  prefill.connectorB.brand = searchParams.get('connectorB-brand');
  prefill.connectorB.connection = searchParams.get('connectorB-connection');
  prefill.connectorB.connector = searchParams.get('connectorB-connector');
  prefill.connectorB.ring = searchParams.get('connectorB-ring');
  prefill.connectorB.boot = searchParams.get('connectorB-boot');

  prefill.custom.url = searchParams.get('custom-url');
  prefill.custom.text = searchParams.get('custom-text');
  prefill.custom.ink = searchParams.get('custom-ink');

  prefill.sleeve = searchParams.get('sleeve');
  prefill.tie = searchParams.get('tie');
  loadPrefillProduct(prefill);
}

function getPrefillURLObject()
{
  var newPrefill = {
    cable: {
      brand: null,
      type: null,
      length: null,
      color: null,
    },
    connectorA: {
      brand: null,
      connection: null,
      connector: null,
      ring: null,
      boot: null,
    },
    connectorB: {
      brand: null,
      connection: null,
      connector: null,
      ring: null,
      boot: null,
    },
    custom: {
      url: null,
      text: null,
      ink: null,
    },
    sleeve: null,
    tie: null,

  };

  // cable values
  // cable brand
  var $el = $('#select_cable_brand li.selected');
  var $elValue = $el.length > 0 && $el.attr("data-url-value") ? $el.attr("data-url-value") : null; 
  if($elValue != null) { newPrefill.cable.brand = $elValue; }
  // cable type
  var $el = $('#select_cable_types li.selected');
  var $elValue = $el.length > 0 && $el.attr("data-url-value") ? $el.attr("data-url-value") : null; 
  if($elValue != null) { newPrefill.cable.type = $elValue; }
  // cable length
  var $el = $('#select_cable_length.selected input[type=text]');
  var $elValue = $el.length > 0 && $el.attr("data-number") ? $el.attr("data-number") : null; 
  if($elValue != null) { newPrefill.cable.length = $elValue; }
  // cable color
  var $el = $('#select_cable_color .chooseable.selected');
  var $elValue = $el.length > 0 && $el.attr("data-url-value") ? $el.attr("data-url-value") : null; 
  if($elValue != null) { newPrefill.cable.color = $elValue; }


  // end of cable values

  // connector A values
  var $el = $('#select_connectorA_brand li.selected');
  var $elValue = $el.length > 0 && $el.attr("data-url-value") ? $el.attr("data-url-value") : null; 
  if($elValue != null) { newPrefill.connectorA.brand = $elValue; }


  var $el = $('#select_connectorA_connection li.selected');
  var $elValue = $el.length > 0 && $el.attr("data-url-value") ? $el.attr("data-url-value") : null; 
  if($elValue != null) { newPrefill.connectorA.connection = $elValue; }


  var $el = $('#select_connectorA_connector .chooseable.selected');
  var $elValue = $el.length > 0 && $el.attr("data-url-value") ? $el.attr("data-url-value") : null; 
  if($elValue != null) { newPrefill.connectorA.connector = $elValue; }

  var $el = $('#select_connectorA_ringColor_neutrik .chooseable.selected');
  var $elValue = $el.length > 0 && $el.attr("data-url-value") ? $el.attr("data-url-value") : null; 
  if($elValue != null) { newPrefill.connectorA.ring = $elValue; }

  var $el = $('#select_connectorA_bootColor_neutrik .chooseable.selected');
  var $elValue = $el.length > 0 && $el.attr("data-url-value") ? $el.attr("data-url-value") : null; 
  if($elValue != null) { newPrefill.connectorA.boot = $elValue; }
  // END connector A values

  // connector B values
  // connector B brand
  var $el = $('#select_connectorB_brand li.selected');
  var $elValue = $el.length > 0 && $el.attr("data-url-value") ? $el.attr("data-url-value") : null; 
  if($elValue != null) { newPrefill.connectorB.brand = $elValue; }

  // connector B connection
  var $el = $('#select_connectorB_connection li.selected');
  var $elValue = $el.length > 0 && $el.attr("data-url-value") ? $el.attr("data-url-value") : null; 
  if($elValue != null) { newPrefill.connectorB.connection = $elValue; }


  var $el = $('#select_connectorB_connector .chooseable.selected');
  var $elValue = $el.length > 0 && $el.attr("data-url-value") ? $el.attr("data-url-value") : null; 
  if($elValue != null) { newPrefill.connectorB.connector = $elValue; }

  var $el = $('#select_connectorB_ringColor_neutrik .chooseable.selected');
  var $elValue = $el.length > 0 && $el.attr("data-url-value") ? $el.attr("data-url-value") : null; 
  if($elValue != null) { newPrefill.connectorB.ring = $elValue; }

  var $el = $('#select_connectorB_bootColor_neutrik .chooseable.selected');
  var $elValue = $el.length > 0 && $el.attr("data-url-value") ? $el.attr("data-url-value") : null; 
  if($elValue != null) { newPrefill.connectorB.boot = $elValue; }
  // END connector B values

  // Cable Tie Value
  var $el = $('#input_select_cable_tie .chooseable.selected');
  var $elValue = $el.length > 0 && $el.attr("data-url-value") ? $el.attr("data-url-value") : null; 
  if($elValue != null) { newPrefill.tie = $elValue; }

  // cable Sleeve Value
  var $el = $('#input_select_cable_sleeve .chooseable.selected');
  var $elValue = $el.length > 0 && $el.attr("data-url-value") ? $el.attr("data-url-value") : null; 
  if($elValue != null) { newPrefill.sleeve = $elValue; }

  // custom text ink color
  var $el = $('#custom_text_logo_color_select .selected');
  var $elValue = $el.length > 0 && $el.attr("data-url-value") ? $el.attr("data-url-value") : null; 
  if($elValue != null) { newPrefill.custom.ink = $elValue; }

  // custom logo value
  if(order.custom_logo != undefined) { newPrefill.custom.url = order.custom_logo; }

  // custom logo text value
  var customLogoText = $('#input_box_custom_text');
  if(customLogoText.val().length > 0) { newPrefill.custom.text = customLogoText.val(); }
  return newPrefill;
}


function postCallback_neutrik_XLR()
{
  
  if($('#input_cable_types_gotham_GAC7_tube_mic').hasClass('selected'))
  {
    $('.neutrik_xlr_gotham').show();
  }
  else
  {
    $('.neutrik_xlr_gotham').removeClass('selected').hide();
  }
}
function connectorABMasterCheck($el)
{
  if(!$('#connectorB').hasClass('master_choice') && !$('#connectorA').hasClass('master_choice'))
  {
    $el.closest('.connector_group').addClass('master_choice');
    return true;
  }
  else if($el.closest('.connector_group').hasClass('master_choice'))
  {
    return true;
  }
  return false;
}

function postCallback_neutrik_14_connectorA_hideB($el)
{
  var shouldProceed = connectorABMasterCheck($el); if(!shouldProceed) return;
  // $('#connectorB .connectors_xlr').hide();
  // $('#connectorB .connectors_14').show();
}

function postCallback_neutrik_XLR_connectorA_hideB($el)
{
  var shouldProceed = connectorABMasterCheck($el); if(!shouldProceed) return;
  // $('#connectorB .connectors_xlr').show();
  // $('#connectorB .connectors_14').hide();
}

function postCallback_switchcraft_14_connectorA_hideB($el)
{
  var shouldProceed = connectorABMasterCheck($el); if(!shouldProceed) return;
  // $('#connectorB .connectors_xlr').hide();
  // $('#connectorB .connectors_35mm').hide();
  // $('#connectorB .connectors_14').show();
}

function postCallback_switchcraft_XLR_connectorA_hideB($el)
{
  var shouldProceed = connectorABMasterCheck($el); if(!shouldProceed) return;
  // $('#connectorB .connectors_xlr').show();
  // $('#connectorB .connectors_14').hide();
  // $('#connectorB .connectors_35mm').hide();
  
}

function postCallback_switchcraft_35mm_connectorA_hideB($el)
{
  var shouldProceed = connectorABMasterCheck($el); if(!shouldProceed) return;
  // $('#connectorB .connectors_xlr').hide();
  // $('#connectorB .connectors_14').hide();
  // $('#connectorB .connectors_35mm').show();
  
}

function postCallback_neutrik_14_connectorB_hideA($el)
{
  var shouldProceed = connectorABMasterCheck($el); if(!shouldProceed) return;
  // $('#connectorA .connectors_xlr').hide();
  // $('#connectorA .connectors_14').show();
}

function postCallback_neutrik_XLR_connectorB_hideA($el)
{
  var shouldProceed = connectorABMasterCheck($el); if(!shouldProceed) return;
  // $('#connectorA .connectors_xlr').show();
  // $('#connectorA .connectors_14').hide();

}

function postCallback_switchcraft_14_connectorB_hideA($el)
{
  var shouldProceed = connectorABMasterCheck($el); if(!shouldProceed) return;
  // $('#connectorA .connectors_xlr').hide();
  // $('#connectorB .connectors_35mm').hide();
  // $('#connectorA .connectors_14').show();
}

function postCallback_switchcraft_XLR_connectorB_hideA($el)
{
  var shouldProceed = connectorABMasterCheck($el); if(!shouldProceed) return;
  // $('#connectorA .connectors_xlr').show();
  // $('#connectorA .connectors_14').hide();
  // $('#connectorB .connectors_35mm').hide();
  
}

function postCallback_switchcraft_35mm_connectorB_hideA($el)
{
  var shouldProceed = connectorABMasterCheck($el); if(!shouldProceed) return;
  // $('#connectorA .connectors_xlr').hide();
  // $('#connectorA .connectors_14').hide();
  // $('#connectorB .connectors_35mm').show();
  
}



function neutrik_connectorA_postcallback()
{
  var $select = undefined;
  if($('#select_connectorA_ringColor_neutrik .chooseable.selected').length < 1)
  {
    $select = $('#select_connectorA_ringColor_neutrik .chooseable').first();
    $select.addClass("selected");
  }
  if($('#select_connectorA_bootColor_neutrik .chooseable.selected').length < 1)
  {
    $select = $('#select_connectorA_bootColor_neutrik .chooseable').first();
    $select.addClass("selected");
  }

  if($select != undefined)
  {
    $select.click();
  }
}

function neutrik_connectorB_postcallback()
{
  var $select = undefined;
  if($('#select_connectorB_ringColor_neutrik .chooseable.selected').length < 1)
  {
    $select = $('#select_connectorB_ringColor_neutrik .chooseable').first();
    $select.addClass("selected");
  }
  if($('#select_connectorB_bootColor_neutrik .chooseable.selected').length < 1)
  {
    $select = $('#select_connectorB_bootColor_neutrik .chooseable').first();
    $select.addClass("selected");
  }

  if($select != undefined)
  {
    $select.click();
  }
}









var image = {};
var img = 2;
function changeImage (imageOptions)
{

 // $('#image').addClass("preloading_images");
  var newValue = imageOptions.slug;
  var cableSet = false;
  if(imageOptions.group == "cable" && imageOptions.slug != image[imageOptions.group] && typeof image["sleeve"] == "undefined")
  {

    preloadImages(
      [config.image_url+"images/cfg/"+ imageOptions.slug + ".png"],
      function ()
      {


        $('#cable_side_b_cable').css({"background-image": "url("+config.image_url+"images/cfg/"+ imageOptions.slug + ".png)"});
        $('#cable_side_a_cable').css({"background-image": "url("+config.image_url+"images/cfg/"+ imageOptions.slug + ".png)"});

        toggleAndStoreClassForUpdateImage($('#cable_side_b_cable'), imageOptions.slug, "productImage_cable_mic", imageOptions);
        toggleAndStoreClassForUpdateImage($('#cable_side_a_cable'), imageOptions.slug, "productImage_cable_mic", imageOptions);
        $('#image').removeClass("preloading_images");
      }
    );

    

    
    cableSet = true;
  }

  if(imageOptions.group == "sleeve" && imageOptions.slug != image[imageOptions.group])
  {
    if(imageOptions.slug != "sleeve___cancel")
    {

      preloadImages(
        [config.image_url+"images/cfg/"+ imageOptions.slug + ".png"],
        function ()
        {
          toggleAndStoreClassForUpdateImage($('#cable_side_b_cable'), imageOptions.slug, "productImage_cable_mic", imageOptions);
          toggleAndStoreClassForUpdateImage($('#cable_side_a_cable'), imageOptions.slug, "productImage_cable_mic", imageOptions);
          $('#cable_side_b_cable').css({"background-image": "url("+config.image_url+"images/cfg/"+ imageOptions.slug + ".png)"});
          $('#cable_side_a_cable').css({"background-image": "url("+config.image_url+"images/cfg/"+ imageOptions.slug + ".png)"});
          $('#image').removeClass("preloading_images");
        });
      
    }
    else
    {
      newValue = undefined;
      image[imageOptions.group] = newValue;

      if(typeof image["cable"] != "undefined")
      {
        var cableOptions = {
          "group": "cable",
          "slug": image["cable"],
        };
        image["cable"] = undefined;
        changeImage(cableOptions);
      }
    }
    cableSet = true;
  }

  if(imageOptions.group == "connectorA" && imageOptions.slug != image[imageOptions.group])
  {
    preloadImages(
        [config.image_url+"images/cfg/"+ imageOptions.slug + ".png"],
        function ()
        {
          toggleAndStoreClassForUpdateImage($('#cable_side_a_connector'), imageOptions.slug, "productImage_cable_mic", imageOptions);
          $('#cable_side_a_connector').css({"background-image": "url("+config.image_url+"images/cfg/"+ imageOptions.slug + ".png)"});
          $('#image').removeClass("preloading_images");
        });
    
  }

  if(imageOptions.group == "connectorB" && imageOptions.slug != image[imageOptions.group])
  {
    preloadImages(
        [config.image_url+"images/cfg/"+ imageOptions.slug + ".png"],
        function ()
        {
          toggleAndStoreClassForUpdateImage($('#cable_side_b_connector'), imageOptions.slug, "productImage_cable_mic", imageOptions);
          $('#cable_side_b_connector').css({"background-image": "url("+config.image_url+"images/cfg/"+ imageOptions.slug + ".png)"});
          $('#image').removeClass("preloading_images");
    });
  }
  image[imageOptions.group] = newValue;
  updateLink();

}


function updatePrice(imageOptions)
{
  img = img == 2 ? 2 : 3.50;

  var p = parseFloat($('#total_price .price_text').text());
  var r = Math.round(Math.random());
  p += r *img;
  $('#total_price .price_text').text(p.toFixed(2));
}







function setupAddToCart()
{
  $('#addToCart').click(function (e){
    showCartError();
    $('#addToCart').hide();
    $('#addToCartSpinner').show();
    e.preventDefault();


    orderLines = [];
    orderLinesData = [];

    addVariantToCart(0, order.cart, function ()
    {
      // if there is a custom logo or text
      var inputText = $('#input_box_custom_text');
      var customLogoTextColor = "black";
      var customLogoTextDirection = "vertical";
      var $customColor = $('#custom_text_logo_color_select li.selected');
      if($customColor.length > 0)
      {
        customLogoTextColor = $customColor.attr("data-value");
      }

      var $customDirection = $('#custom_text_logo_direction_select li.selected');
      if($customDirection.length > 0)
      {
        customLogoTextDirection = $customDirection.attr("data-value");
      }

      if(order.custom_logo != undefined || inputText.val().length > 0)
      {

        var itemProperties = {
          'Item': config.item_property_slug + ' (#'+order.uniqueid+')',
          'Ink': customLogoTextColor,
          'Direction': customLogoTextDirection
        };

        if(order.custom_logo != undefined)
        {
          itemProperties.Logo = order.custom_logo;
        }
        if(inputText.val().length > 0)
        {
          itemProperties.Text = inputText.val();
        }

        $.ajax('/cart/add.js', {
          type: 'POST',
          data: {
            quantity: 1,
            id: parseInt($('#custom_logo_text_product').val()),
            properties: itemProperties
          },
          complete: function (jqXHR, textStatus) {
            redirectToCart();
          }
        });
      }
      else
      {
        redirectToCart();
      }      
    });


    
  });
}

function chooseableClicked(el) {
    
    var $el = $(el);
    var $closest = $el.closest('#select_cable_types');
    
    if($closest.length > 0) {
      if($el.data('url-value') === 'sommer_2000451' || $el.data('url-value') === 'sommer_2000311') {
          $('#techflex-sleeves').hide();
      } else {
        $('#techflex-sleeves').show();
      }
  }     
}