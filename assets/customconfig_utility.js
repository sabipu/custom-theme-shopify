  var shouldUpdateLink = true;

  function setupHacks()
  {

  }

  String.prototype.capitalize = function() {
    return this.charAt(0).toUpperCase() + this.slice(1)
  }

  function updateLink()
  {
    window.history.replaceState("", "", getURIForProduct());
    
  }


  function refreshUIs()
  {
      setupColors();
      setupInputOptions();
      setupSelectInputs();
      //setupBraidedSleeves();
      setupChooseables();
  }

  function forceWindowToScrollTop(complete)
  {
    var forceInterval = undefined;  
    forceInterval = setInterval(function (){
      if($(window).scrollTop() <= 0)
      {
        clearInterval(forceInterval);
        if(typeof complete == "function")
        {
          complete();
        }
      }
      else
      {
        $(window).scrollTop(0);
      }
    }, 200);
  }

  function loadPrefillProduct_selectChooseable(value, selector)
  {
    try {
      if(value != null)
      {
        var $chooseable = $(selector + ' li[data-url-value=' + value + ']');
        if($chooseable.length > 0)
        {
          $chooseable.click();
        }
      }
    }
    catch (err)
    {
      
    }
    
  }


  function getURIForProduct(obj)
  {
    return config.url_slug + "?" + getURIForPrefillObject(obj);
  }

  function getURLForProduct(obj)
  {
    return config.shop_url + getURIForProduct(obj);
  }


  function readPrefillURL ()
  {

    setupHacks();

    let url = new URL(window.location.href);

    let searchParams = new URLSearchParams(url.search);
    var hasCustomURL = searchParams.get('c');
    var loadURI = hasCustomURL ? url.search : config.default_uri;
    return readPrefillURI(loadURI);

  }

  function setupURLValues()
  {
    $('.input_select_ul li').each(function (index, el)
    {
      var $el = $(el);
      if(!$el.attr("data-url-value"))
      {
        var dataUID = $el.attr("data-value");
        if(!dataUID) { dataUID = $el.attr("data-chooseable"); }
        if(!dataUID) { dataUID = $el.attr("data-variant-id"); }
        if(dataUID) { $el.attr("data-url-value", dataUID); }
      }
    });
  }

  function generateShortHash(value)
  {
    return generateUID();
  }

  function generateUID (separator) {
      var firstPart = (Math.random() * 46656) | 0;
      var secondPart = (Math.random() * 46656) | 0;
      firstPart = ("000" + firstPart.toString(36)).slice(-3);
      secondPart = ("000" + secondPart.toString(36)).slice(-3);
      return firstPart + secondPart;
  };

  function setupColors ()
  {
    $('.input_colours li').each(function (index, el) {
      var $el = $(el);
      $el.css({background: $el.data('colour')});
    });


    $('.input_colours li a').each(function (index, el) {
      var $el = $(el);
      var colorString = $el.attr("href").replace("#colour_", "").capitalize();

      $el.append('<div class="mini-popup">'+colorString+'</div>');
    });
  }

  function setupInputOptions()
  {
    $('.input_select_ul li').unbind("click.inputOptions").bind("click.inputOptions", function (e){
      e.preventDefault();
      if($(this).hasClass('unavailable')) { return; }
      $(this).siblings().removeClass('selected');
      $(this).addClass('selected');
    });
  }

  function setupAccordion()
  {
    $('.group').click(function(event){
      var $this = $(this);
      if(!$this.hasClass('open'))
      {
        $this.siblings('.group').removeClass('open').addClass('closed');
        $this.removeClass('closed').addClass('open');

        if(config.disable_animation) return;

        

        setTimeout(function ()
        {
          // $this[0].scrollIntoView({behavior: "smooth", block: "start", inline: "nearest"});

          var $thisOffset2 = $this.offset();
          if($(document).scrollTop() > $thisOffset2.top)
          {
            $("html, body").animate({ scrollTop: ($thisOffset2.top - 100) + "px" }, 100);
          }

        }, 200);
      }
    });
  }

  function setupSelectInputs()
  {
    $('.input_select_ul li').unbind("click.selectinput").bind("click.selectinput", function (e, extra)
    {
      //e.originalInputEvent = true;
      // console.log("extra: ", extra);
      if($(this).hasClass('unavailable')) { return; }
      // console.log("input selected", $(this), $(this).parent().parent().parent().parent().parent());
      processInputWithElement($(this).parent().parent().parent().parent().parent(), e, extra);
      processInputWithElement($(this).parent().parent().parent().parent(), e, extra);
      processInputWithElement($(this).parent().parent().parent(), e, extra);
      processInputWithElement($(this).parent().parent(), e, extra);
      processInputWithElement($(this).parent(), e, extra);
      processInputWithElement($(this), e, extra);
      updateAllChoices(this);
    });


    $('#custom_text_logo_color_select li').unbind("click.selectinputink").bind("click.selectinputink", function (e)
    {
      //if($(this).hasClass('unavailable')) { return; }

      var color = $(this).attr("data-value");
      var heatshrinks = [];


      if(color == "black")
      {
        heatshrinks = ["green", "orange", "red", "white"];
      }
      else if(color == "brown")
      {
        heatshrinks = ["grey", "white", "yellow"];
      }
      else if(color == "cyan")
      {
        heatshrinks = ["orange", "white"];
      }
      else if(color == "darkblue")
      {
        heatshrinks = ["blue", "brown", "green", "grey", "red", "white", "yellow"];
      }
      else if(color == "green")
      {
        heatshrinks = ["black", "blue", "grey", "orange", "white", "yellow"];
      }
      else if(color == "grey")
      {
        heatshrinks = ["black", "green", "white", "yellow"];
      }
      else if(color == "orange")
      {
        heatshrinks = ["blue", "brown", "white", "yellow"];
      }
      else if(color == "turqoise")
      {
        heatshrinks = ["green", "grey", "white", "yellow"];
      }
      else if(color == "red")
      {
        heatshrinks = ["blue", "grey", "orange", "white", "yellow"];
      }
      else if(color == "white")
      {
        heatshrinks = ["brown"];
      }
      else if(color == "yellow")
      {
        heatshrinks = ["green"];
      }


      var $heatshrink_li = $('#custom_text_logo_heatshrink_select li');

      $heatshrink_li.removeClass("selected");
      $heatshrink_li.hide();


      var f = false;
      for(var l=0;l<$heatshrink_li.length;l++)
      {
        var $li = $($heatshrink_li[l]);
        for(var i=0;i<heatshrinks.length;i++)
        {
          if($li.attr("data-value") == heatshrinks[i])
          {
            $li.show();
            if(!f)
            {
              f = true;
              $li.addClass("selected");
            }
            break;
          }
        }
      }



      updateHeatShrinkPhoto();

    });


    $('#custom_text_logo_heatshrink_select li, #custom_text_logo_direction_select li').unbind("click.selectinputheat").bind("click.selectinputheat", function (e)
    {
      updateHeatShrinkPhoto();
    });

  }

  function updateHeatShrinkPhoto ()
  {
    if(config.item_property_slug == "Custom Speaker Cable")
    {
      return; 
    }
    var heatshrink = {
      ink: $('#custom_text_logo_color_select li.selected').attr("data-value"),
      flat: $('#custom_text_logo_heatshrink_select li.selected').attr("data-value"),
      direction: "vertical"
    };
    
    if(heatshrink.ink == "cancel" || heatshrink.flat == undefined || heatshrink.ink == undefined)
    {
      $('#cable_side_b_sleeve').css({"background-image": "none"});
      $('#cable_side_a_sleeve').css({"background-image": "none"});
      return; 
    }
    
    if($('#custom_text_logo_direction_select li.selected').length > 0)
    {
      heatshrink.direction = $('#custom_text_logo_direction_select li.selected').attr("data-value");
    }

    var image_url = config.image_url+"images/heatshrink/heatshrink__ink-"+ heatshrink.ink + "__flat-"+heatshrink.flat+"__" + heatshrink.direction+ ".png";
    preloadImages(
        [image_url],
        function ()
        {
          $('#cable_side_b_sleeve').css({"background-image": "url("+image_url+")"});
          $('#cable_side_a_sleeve').css({"background-image": "url("+image_url+")"});
        }
      );





  }

  function evalInContext(js, context) {
      //# Return the results of the in-line anonymous function we .call with the passed context
      return function() { return eval(js); }.call(context);
  }


  function processInputWithElement($element, event, extra)
  {
    var preCallback = $element.data("precallback");
    var postCallback = $element.data('postcallback');
    var hideSelectors = $element.data('hide');
    var showSelectors = $element.data('show');
    var hidexSelectors = $element.data('hidex');
    var showxSelectors = $element.data('showx');
    var clickSelectors = $element.data('click');
    var chooseASelectors = $element.data('choosea');
    var chooseBSelectors = $element.data('chooseb');

    var isConnectorA = $element.closest("#connectorA").length > 0;
    var isConnectorB = $element.closest("#connectorB").length > 0;

    var showSiblingSelectors = $element.data('show-sibling');

    var deSelectors = $element.data('deselect');
    deselectWithSelector(deSelectors);
    
    // run precallbacks
    if(typeof preCallback != "undefined" && preCallback.length > 0)
    {
      evalInContext(preCallback, $element);
    }
    if(typeof hideSelectors != "undefined" && hideSelectors.length > 0)
    {
      $(hideSelectors).removeClass('selected');
    }
    if(typeof hidexSelectors != "undefined" && hidexSelectors.length > 0)
    {
      $(hidexSelectors).hide();
    }
    if(typeof showSiblingSelectors != "undefined" && showSiblingSelectors.length > 0)
    {
      $(showSiblingSelectors).siblings().removeClass('selected');
      $(showSiblingSelectors).addClass('selected');
    }
    if(typeof showSelectors != "undefined" && showSelectors.length > 0)
    {
      $(showSelectors).addClass('selected');
      if($(showSelectors).find('.input_colours .input_select_ul').length > 0 && $(showSelectors).find('.input_colours .input_select_ul li.selected').length < 1)
      {
//         $(showSelectors).find('.input_colours .input_select_ul li').first().click();
      }
    }
    if(typeof showxSelectors != "undefined" && showxSelectors.length > 0)
    {
      $(showxSelectors).show();
    }
    if(typeof clickSelectors != "undefined" && clickSelectors.length > 0)
    {
      if(!(typeof extra != "undefined" && typeof extra.childInputClick != "undefined"))
      {
        $(clickSelectors).trigger('click', {childInputClick: true});
      }
    }

    // console.log("choose A's: " + chooseASelectors + ": " + $("#connectorA").find(chooseASelectors).length);

    if(typeof chooseASelectors != "undefined" && chooseASelectors.length > 0)
    {
      if(!(typeof extra != "undefined" && typeof extra.childInputClick != "undefined"))
      {
        $("#connectorA").find(chooseASelectors).trigger('click', {childInputClick: true});
      }
      

    }
    if(typeof chooseBSelectors != "undefined" && chooseBSelectors.length > 0)
    {
      if(!(typeof extra != "undefined" && typeof extra.childInputClick != "undefined"))
      {
        // console.log("choose B's: " + chooseBSelectors + ": " + $("#connectorB").find(chooseBSelectors).length);
        $("#connectorB").find(chooseBSelectors).trigger('click', {childInputClick: true});
      }
    }
    // run postcallbacks
    if(typeof postCallback != "undefined" && postCallback.length > 0)
    {
      evalInContext(postCallback, $element);
    } 
  }

  function deselectWithSelector(deSelectors)
  {
    
    if(typeof deSelectors != "undefined" && deSelectors.length > 0)
    {
      var d = deSelectors.split(',');
      for(var i = 0; i<d.length; i++)
      {
        var dd = d[i].replace(" ", "");
        $(dd + ' .selected').removeClass('selected');
      }
    }
  }

  function chooseableClicked(el)
  {
    var $el = $(el);
    var variantId = $el.attr("data-variant-id");
    if(variantId)
    {
      //console.log("chooseable clicked", __products[parseInt(variantId)]);
    }
  }

  function setupChooseables()
  {
    var $chooseables = $('.chooseable');
    
    for(var i=0;i<$chooseables.length;i++)
    {
     	var $chooseable = $($chooseables[i]);
      	if($chooseable.closest('#cable').length > 0 || $chooseable.closest('#input_select_cable_sleeve').length > 0 )
        {
          if(!$chooseable.attr('data-multiply-by-length') && $chooseable.attr('data-variant-id'))
          {
            $chooseable.attr('data-multiply-by-length', true);
          }
        }
      
    }
    
    
    $chooseables.unbind("click.chooseable").bind("click.chooseable", function (e){

      chooseableClicked(this);
      if($(this).hasClass('unavailable')) { return; }

      var chooseable_value = $(this).data('chooseable');
      var $option = $(this).closest('.option');
      var $groups = $('.group');

      var product = { choices: {} };

      for(var g=0; g<$groups.length; g++)
      {
        var $group = $($groups[g]);
        var $group_id = $group.attr('id');
        var $choices = $group.find('.option.selected .chooseable.selected');
        var $choices_slug = $group_id;
        var choice = { group: $group_id };



        for(var i=0; i<$choices.length; i++)
        {
          var $choice = $($choices[i]);
          if($choice.parent().hasClass("input_select_ul_hidden") && !$choice.parent().hasClass('selected'))
          {
            continue;
          }
          if($choice.parent().hasClass("input_select_ul") && !$choice.parent().hasClass('selected'))
          {
            //continue;
          }


          $choices_slug += "___" + $choice.data('chooseable');

          var $option = $choice.closest('.option');
          var $optionKey = $option.data('key');
          if($optionKey)
          {
            choice[$optionKey] = $choice.data('chooseable');
          }
        }

        if(typeof($choices_slug) != "undefined" && $choices_slug.split('___').length > 1)
        {
          var original_slug = $choices_slug;
          $choices_slug = $choices_slug.replace("connectorA", "connector");
          $choices_slug = $choices_slug.replace("connectorB", "connector");
          var imageOptions = {
            "item": original_slug,
            "group": $group_id,
            "slug": $choices_slug,

          };
          changeImage(imageOptions);

          
        }

        product.choices[$group_id] = choice;
      }

      updateProduct(product, this);



    });

    $('.chooseable-alt').unbind("click.chooseablealt").bind("click.chooseablealt", function (e){
      updateProduct();
    });

  }

  function updateAllChoices(target)
  {
    $('.input_select_ul').each(function (index, el){
      var hasChoices = $(el).data('update-choices');
      if(hasChoices) eval(hasChoices);
    });
  }

  function setupWindowScroll()
  {
    var $image = $('#image_column');
    var imageHeight = $image.height();
    var deltaSize = 170;
    var footerHeight = $('footer').height();
    
    function repositionImage()
    {
      if(config.disable_animation) return;
      var scroll = $(window).scrollTop();
      var bodyHeight = $("body").height();
      var maxY = bodyHeight - imageHeight - footerHeight - 40 - deltaSize;
      var newTop = scroll - deltaSize;
      if(newTop > maxY) return;

      if(scroll > 177)
      {
        $image.css({"top": (scroll - deltaSize) + "px"});
      }
      else
      {
        $image.css({"top": "0px"});
      }
    }

    $( window ).scroll(function(e) {
      repositionImage();
    });
    $( window ).resize(function(e) {
      repositionImage();
    });
  }






  /**
   * SHOPIFY FUNCTIONS.
   */
  async function getShopifyProductTags(collection, iteration = 1, tags = []) {
    await axios
      .get(
        config.shop_url + `/collections/${collection}/products.json?limit=250&page=${iteration}`,
      )
      .then(response => {
      
      
        
      
        _.forEach(response.data.products, product => {
          _.forEach(product.tags, tag => {
            if (_.includes(tag, 'config')) {
              tags.push(tag);
            }
          });
        });

        if (response.data.products.length === 250) {
          getShopifyProductTags(collection, iteration + 1, tags);
        }
      })
      .catch(error => {
        console.log(error);
      });

    return tags;
  }

  async function getAllProducts(products, iteration = 1) {
    await axios
      .get(config.shop_url + `/products.json?limit=250&page=${iteration}`)
      .then(response => {
          for(var n=0; n<response.data.products.length;n++)
          {
            var product = response.data.products[n];
            products.push(product);
          }

        if (response.data.products.length === 250) {

          getAllProducts(products, iteration + 1);
        } else if (response.data.products.length < 250) {
          return;
        }
      })
      .catch(error => console.log(error));
  }

  async function findProductIdByTag(tag, iteration = 1) {
    let productId = undefined;

    await axios
      .get(config.shop_url + `/products.json?limit=250&page=${iteration}`)
      .then(response => {
        let products = response.data.products;

        _.forEach(products, product => {
          _.forEach(product.tags, productTag => {
            if (productTag === tag) {
              productId = product.id;
            }
          });
        });

        if (response.data.products.length === 250) {
          findProductIdByTag(tag, iteration + 1);
        }
      })
      .catch(error => console.log(error));

    return productId;
  }

  async function findProductByTag(tag, iteration = 1) {
    let p = undefined;

    await axios
      .get(config.shop_url + `/products.json?limit=250&page=${iteration}`)
      .then(response => {
        let products = response.data.products;

        _.forEach(products, product => {
          _.forEach(product.tags, productTag => {
            if (productTag === tag) {
              p = product;
            }
          });
        });

        if (response.data.products.length === 250) {
          findProductIdByTag(tag, iteration + 1);
        }
      })
      .catch(error => console.log(error));

    return p;
  }



  /**
   * END OF SHOPIFY FUNCTIONS.
   */


  var __products = [];
  var __variants = [];

  async function getShopifyProducts ()
  {
    let shopProducts = [];
    let shopProducts2 = [];
    await getAllProducts(shopProducts, 1);
    await getAllProducts(shopProducts2, 2);
    products = shopProducts;  
    _.forEach(shopProducts, product => {
      _.forEach(product.variants, variant => {      
        setupProductVariant(variant, product);
      });
    });
    updateProduct();
    var c = 0;
    for(var k in __products) {
    
      c++;
    }


  }



  function setupProductVariant(variant, product)
  {
      __variants.push(variant);

      __products[variant.id] = product;
      var $product = $('li[data-variant-id=' + variant.id + ']');



      if($product.length > 0)
      {
         var setupProductVariant = $product.hasClass("setupProductVariant");

         if(setupProductVariant) $product.removeClass("unavailable");
         
         

         if(!variant.available)
         {
           // removed unavailable
            //$product.addClass("unavailable");
         }

         $product.addClass("setupProductVariant");

         $product.data("shopify-compare-price", variant.compare_at_price);
         $product.data("shopify-price", variant.price);
         $product.data("shopify-available", variant.available);

         $product.attr("data-shopify-compare-price", variant.compare_at_price);
         $product.attr("data-shopify-price", variant.price);
         $product.attr("data-shopify-available", variant.available);
         $product.attr("data-shopify-title", variant.title);
         $product.attr("data-shopify-product-title", product.title);
      }
      else
      {
        //console.log("product variant not found", product);
      }
    
  }

  function getCableLength ()
  {
    var $cl = $('#select_cable_length input[type="text"]');
    var value = parseFloat($cl.attr("data-number"));
    return value;
  }

  function getCableLengthQuantity ()
  {
    var length = getCableLength();
    return Math.ceil(length / 0.1);
  }
  
  function updateProduct (product, element)
  {
    order.price = 0;
    order.cart = [];
    var $chooseables = $('.chooseable, .chooseable-alt');
    console.log("---------------------------------");
    console.log("UPDATING PRODUCT -------------------------------------");
    console.log("---------------------------------");
    
    for(var i=0; i<$chooseables.length; i++)
    {
      var $choice = $($chooseables[i]);
      if($choice.hasClass("selected"))
      {
        var choiceQuantity = 1;
        var shopifyProductTitle = $choice.attr("data-shopify-product-title");
        var variantId = $choice.attr("data-variant-id");
        var variantMultiplyByCableLength = $choice.attr("data-multiply-by-length");
        var variantPrice = parseFloat($choice.attr("data-shopify-price"));
        
        if(variantMultiplyByCableLength)
        {
          choiceQuantity = getCableLengthQuantity();

           console.log("MULTIPLY BY LENGTH: " + getCableLengthQuantity());
           console.log(shopifyProductTitle + ": Varient: " + variantId + " : Price: " + variantPrice);
        }
        
        console.log("ADDING PRICE: " + shopifyProductTitle + " | Price: " + variantPrice + " | Variant: " + variantId + " | Quantity Price: " + (variantPrice *choiceQuantity), order);
        
        if(!isNaN(variantPrice))
        {
          order.price += (variantPrice *choiceQuantity);
        }

        if(isNaN(variantPrice))
        {
          console.log("found bad chooseable:", $choice, {
         title: shopifyProductTitle,
          variant: variantId,
          price: variantPrice,
          quantity: choiceQuantity,
           });
        }
		var newOrderProduct = {
          title: shopifyProductTitle,
          variant: variantId,
          price: variantPrice,
          quantity: choiceQuantity,
          element: $choice,
        };
        
        order.cart.push(newOrderProduct);
      }
    }
    updateTechSpecs(order);
    $('#total_price .price_text').text(order.price.toFixed(2));
    
    console.log("---------------------------------");
    console.log("FINAL PRICE: $" + order.price.toFixed(2));
    console.log("---------------------------------");
  }

  function emptyOrderFromCart(callback)
  {


    $.ajax({
        type: "POST",
        url: '/cart/clear.js',
        complete: callback,
        dataType: 'json'
      });
  }

  function setupBraidedSleeves()
  {
    $('.input_colours_patterns li').each(function (index, el)
    {
      var $el = $(el);
      var dataImage = $el.data('image');
      if(dataImage && dataImage != "cancel")
      {
        $el.css({
          "background-image": "url(" + dataImage + ")",
          "background-repeat": "no-repeat",
          "background-position": "center center",
        });
      }
    });

  }

  function setupUploadButton ()
  {
    var newFilename = "unknown filename";
    var newFile = undefined;
    $('#custom_logo_file_upload_button').click(function (e)
    {
      $('#custom_logo_file_upload_input').click();
    });

    $('#custom_logo_file_upload_input').change(function(ev) {
      var input = this;
      if (input.files && input.files[0]) {
          var reader = new FileReader();

          reader.onload = function(e) {
            //$('#blah').attr('src', e.target.result);

            $('#uploaded_image').css('background-image', 'url(' + e.target.result + ')');
          }

          reader.readAsDataURL(input.files[0]);
          newFile = input.files[0];

          $('.uploaded_image').addClass("user_custom_image");
          $('#custom_logo_file_upload_form').submit();
        }
        else
        {
          $('.uploaded_image').removeClass("user_custom_image");
        }

    });

    $('#remove-image').click(function(event) {
      event.preventDefault();
      $('#uploaded_image').css('background-image', 'none');
      document.getElementById('custom_logo_file_upload_input').value = "";
      $('#custom_logo_file_upload_form')[0].reset();
      $('.uploaded_image').removeClass("user_custom_image");
    });

    $('#custom_logo_file_upload_form').submit(function (e)
    {
      e.preventDefault();
      var  formData = new FormData($('#custom_logo_file_upload_form')[0]);
      $('.upload_status').html('<span class="upload_status_title" id="upload_status_title">Uploading...</span>');
      $('.upload_status').removeClass('hidden').fadeIn();

      if( document.getElementById("custom_logo_file_upload_input").files.length == 0 ){
        return;
      }

      function showUploadError(msg)
      {
        $('.upload_status').fadeOut(800, function ()
            {
          $('.upload_status').html('<span class="upload_status_title error" id="upload_status_title">Error</span> <span class="upload_status_filename" id="upload_status_filename">Try again</span>');
              $('.upload_status').removeClass('hidden');
              $('.upload_status').fadeIn(600);
            });
      }


      $.ajax({
            url: config.upload_url,
            type: 'POST',
            data: formData,
            // dataType: "json",
            success: function (data, textStatus, xhr) 
            {
              $('.upload_status').fadeOut(800, function ()
              {
                $('.upload_status').html('<span class="upload_status_title success" id="upload_status_title">Uploaded</span><span class="upload_status_filename" id="upload_status_filename">sample_logo.png</span><span class="upload_status_filesize" id="upload_status_filesize">345 kb</span>');
                $('#upload_status_filename').text(newFile.name);
                $('#upload_status_filesize').text((newFile.size / 1000).toFixed(1) + " kb");
                  $('.upload_status').removeClass('hidden');
                  $('.upload_status').fadeIn(600);

              });
              order.custom_logo = undefined;
                if(data.success)
                {
                  order.custom_logo = data.custom_logo_url;
                  order.custom_logo_filename = data.filename;
                }
                else
                {
                  showUploadError("Error");
                }
            },
            error: function (xhr, textStatus, errorStr)
            {
          showUploadError("Error");
            },
            cache: false,
            contentType: false,
            processData: false
        });


    });
  }

  function redirectToCart()
  {
    $( "#the_cart_count" ).load( config.shop_url + " #the_cart_count_text", function (text_resp, text_status, xhrR)
    {
      redirectToCartURL();
    } );
  }

  function redirectToCartURL()
  {

    window.location.href=config.shop_url + "/cart";
  }

  function showCartError(title,message)
  {
    var msg = typeof title == "undefined" ? "" : '<h4>'+title+'</h4>'+'<p>'+message+'</p>';
    $('#cart_status_message').html(msg);

    if(msg == "")
    {
      $('#cart_status_message').hide();
    }
    else
    {
      $('#cart_status_message').fadeIn();
    }
  }


  Number.prototype.toFixedNumber = function(x, base){
    var pow = Math.pow(base||10,x);
    return Math.round(this*pow) / pow;
  }



  function setupTextLengthInputs() {

    var input = $('.input_text_dial input[type=text]');
    var amountToChange = 0.1;
    var t = undefined;
    var shouldStop = true;

    function getCableLength ($el) { return $el.val().replace(/[^\d.]/g, ''); }

    function setCableLengthValue(v)
    {
      var fixAmount = 1;
      v = parseFloat(v) < 0 ? 0 : v;
      vArr = v.toString().split(".");
      //if(vArr.length > 1) fixAmount = vArr[1].length;
      v = parseFloat(v).toFixedNumber(fixAmount);
      v = isNaN(v) ? 0 : v;
      v = parseFloat(v).toFixedNumber(fixAmount);
      // console.log("set cable length", v);
      var nmb= v;
      v = (v.length < 1 ? '0' : v) + ' m';
      input.val(v);
      input.attr("data-number", nmb);
    }

    
    input.keypress(function(e) {
        shouldStop = false;
        clearTimeout(t);
    }).keyup(function (e)
    {
      if(shouldStop) return false;
      var $this = $(this);
      t = setTimeout(function (){
        clearTimeout(t);
        setCableLengthValue(getCableLength($this));
      }, 200);
      shouldStop = true;
    });

    $('.input_text_dial .plus').click(function() {
      setCableLengthValue(parseFloat(getCableLength(input)) + amountToChange);
      updateProduct();
      updateLink();
    });

    $('.input_text_dial .minus').click(function() {
      setCableLengthValue(parseFloat(getCableLength(input)) - amountToChange);
      updateProduct();
      updateLink();
    });
  }



  function addVariantToCart(index, cartItems, finishedCallback)
  {
    if(index >= cartItems.length)
    {
      if(typeof finishedCallback == "function")
      {
        finishedCallback();
      }
      else
      {
        redirectToCartURL();
      }
      return; 
    }

    var cartOrder = cartItems[index];
	console.log("add to cart", index, cartOrder);
    if(isNaN(cartOrder.price))
    {
        // orderLinesData[parseInt(jqXHR.responseJSON.id)] = 0;
        // orderLines.push(parseInt(jqXHR.responseJSON.id));

        if(index < cartItems.length)
        {
          addVariantToCart(index+1, cartItems, finishedCallback);
        }
        else
        {
          if(typeof finishedCallback == "function")
          {
            finishedCallback();
          }
        }
        return;
    }

    $.ajax('/cart/add.js', {
        type: 'POST',
        dataType: 'json',
        data: {
          quantity: parseInt(cartOrder.quantity),
          id: parseInt(cartOrder.variant),
          properties: {
            'Item': config.item_property_slug + ' (#'+order.uniqueid+')',
          }
        },
        complete: function (jqXHR, textStatus) {

          if(textStatus == "error")
          {
            if(jqXHR.responseJSON.status == 422)
            {
                var response = jqXHR.responseJSON;
                showCartError(response.message, response.description + "<br />Please choose a different option.");
                emptyOrderFromCart(function ()
                {
                  $('#addToCart').show();
                  $('#addToCartSpinner').hide();
                });
            }
            else (jqXHR.responseJSON.status == 404)
            {
                var response = jqXHR.responseJSON;
                showCartError(response.message, response.description + "<br />Please choose a different option.");
                emptyOrderFromCart(function ()
                {
                  $('#addToCart').show();
                  $('#addToCartSpinner').hide();
                });
            }
            // console.log("cart error", cartOrder);
            return;
          }

          orderLinesData[parseInt(jqXHR.responseJSON.id)] = 0;
          orderLines.push(parseInt(jqXHR.responseJSON.id));

          if(index < cartItems.length)
          {
            addVariantToCart(index+1, cartItems, finishedCallback);
          }
          else
          {
            if(typeof finishedCallback == "function")
            {
              finishedCallback();
            }
          }
        }
      });

  }


  function toggleAndStoreClassForUpdateImage($el, slug, groupClass, imageOptions)
  {
      var $parent = $el.closest("#image");

      var currentAttr = $parent.attr("data-" + imageOptions.group);

      if(currentAttr)
      {
        $parent.removeClass(currentAttr);
        $parent.removeAttr("data-" + imageOptions.group);
      }

      $parent.addClass(imageOptions.slug);
      $parent.attr("data-" + imageOptions.group, imageOptions.slug);

      var removeClasses = $el.attr("data-current-class");
      if(removeClasses)
      {
        var removeClasses_array = removeClasses.split(" ");
        for(var x=0; x<removeClasses_array.length; x++)
        {
          var newSlug = removeClasses_array[x];
          $el.removeClass(newSlug);
        }
      }
      
      var addedClass = imageOptions.slug;
      $el.addClass(imageOptions.slug);
      if(!$el.hasClass(groupClass))
      {
        $el.addClass(groupClass);
      }

      if(slug.indexOf('___') > -1)
      {
        var slugs = slug.split("___");
        for(var x=0; x<slugs.length; x++)
        {
          var newSlug = slugs[x];
          $el.addClass(newSlug);
          addedClass += " " + newSlug;
        }
      }

      $el.attr("data-current-class", addedClass);


  }


  function preloadImages(urls, allImagesLoadedCallback){

    $('#image').addClass("preloading_images");

    var currentCount = $('#image').attr("data-preloading");

    if(currentCount == undefined)
    {
      currentCount = 0;
    }
    else
    {
      currentCount = parseInt($('#image').attr("data-preloading"));
    }
    currentCount += urls.length;
    $('#image').attr("data-preloading", currentCount);

    // console.log("current count: " + currentCount, urls);


    preloadImagesWithURLS(urls, function ()
    {
      $('#image').removeClass("preloading_images");

      var currentCount = parseInt($('#image').attr("data-preloading"));

      currentCount = currentCount - urls.length;

      // console.log("new current count: " + currentCount);

       $('#image').attr("data-preloading", currentCount);

      if(typeof(allImagesLoadedCallback) == "function")
      {
        allImagesLoadedCallback();
      }
    })

  }


  function preloadImagesWithURLS(urls, allImagesLoadedCallback){
      var loadedCounter = 0;
    var toBeLoadedNumber = urls.length;
    urls.forEach(function(url){
      preloadImage(url, function(){
          loadedCounter++;
        if(loadedCounter == toBeLoadedNumber){
          allImagesLoadedCallback();
        }
      });
    });
    function preloadImage(url, anImageLoadedCallback){
        var img = new Image();
        img.onload = anImageLoadedCallback;
        img.src = url;
    }
  }




  function preloadImage(url, callback)
  {
      var img=new Image();
      img.src=url;
      img.onload = callback;
  }





function power_connectorA_selected($element)
{
  // console.log("power connectorA selected", $element);

  var $choice = $element.find(".chooseable.selected");
  var chooseable_slug = $choice.data("chooseable");
//   console.log("connectorA: " + chooseable_slug);

  var allChoices = {
    "connector_clipsal_439SHD":{hide: ["connector_clipsal_439SHD", "connector_gen3_pl1ph10", "connector_neutrik_powerCON_NC3FCB", "connector_neutrik_powerCON_out"]},
    "connector_clipsal_438HD_TR":{hide: ["connector_clipsal_438HD_TR","connector_gen3_pl1ph10_socket", "connector_neutrik_powerCON_NC3FCA", "connector_neutrik_powerCON"]},
    "connector_gen3_pl1ph10":{hide: ["connector_clipsal_439SHD", "connector_gen3_pl1ph10", "connector_neutrik_powerCON_NC3FCB", "connector_neutrik_powerCON_out"]},
    "connector_gen3_pl1ph10_socket":{hide: ["connector_clipsal_438HD_TR","connector_gen3_pl1ph10_socket", "connector_neutrik_powerCON_NC3FCA", "connector_neutrik_powerCON"]},
    "connector_neutrik_powerCON_NC3FCA":{hide: ["connector_clipsal_439SHD", "connector_gen3_pl1ph10", "connector_neutrik_powerCON_NC3FCB", "connector_neutrik_powerCON_out"]},
    "connector_neutrik_powerCON_NC3FCB":{hide: ["connector_clipsal_438HD_TR","connector_gen3_pl1ph10_socket", "connector_neutrik_powerCON_NC3FCA", "connector_neutrik_powerCON"]},
    "connector_neutrik_powerCON":{hide: ["connector_clipsal_438HD_TR","connector_gen3_pl1ph10_socket", "connector_neutrik_powerCON_NC3FCB","connector_neutrik_powerCON_NC3FCA", "connector_neutrik_powerCON"]},
    "connector_neutrik_powerCON_out":{hide: ["connector_clipsal_439SHD", "connector_gen3_pl1ph10", "connector_neutrik_powerCON_NC3FCA", "connector_neutrik_powerCON_NC3FCB", "connector_neutrik_powerCON_out"]}
  };


  $("#connectorB .chooseable").show();

  var hiddens = allChoices[chooseable_slug].hide;
  for(var x=0; x<hiddens.length;x++)
  {
    var h = hiddens[x];
    var hc = $("#connectorB").find(".chooseable[data-chooseable=" + h + "]");
    console.log("hc: " + hc.length);
    hc.hide();
  }







}


function updateTechSpecs(myOrder)
{
  $('.popup__wrapper .spec__wrapper').html('');
  $('.prod__infos').hide(); 
  $('#cable_specs').hide();
  
  var theDesc = undefined;
  for(var i=0;i<myOrder.cart.length;i++)
  {
    var productOrder = myOrder.cart[i];
    
    if(__products[productOrder.variant])
    {
      var theProduct = __products[productOrder.variant];
      if(theProduct.body_html && theProduct.body_html.indexOf('id="product__specifications"') > -1)
      {
        theDesc = theProduct.body_html;
      }
    }
    
  }
  if(theDesc)
  {
    $('.popup__wrapper .spec__wrapper').html(theDesc);
    $('#product__specifications').show();
    $('.prod__infos').show(); 
    $('#cable_specs').show();
  }
  else
  {
    $('.popup__wrapper .spec__wrapper').html('');
   	$('.prod__infos').hide(); 
    $('#cable_specs').hide();
  }
  
}