var newcart = { items: [] };
var customCables = [];


function processCart(json_cart) {

    for (var i = 0; i < json_cart.items.length; i++) {
        var item = json_cart.items[i];
        

        if (item.properties != null && typeof item.properties != "undefined" && typeof item.properties.Item != "undefined") {
            var custom = { parts: [], price: 0, title: "Custom cable", quantity: 1, standard_product: false};

            if (typeof customCables[item.properties.Item] != "undefined") {
                custom = customCables[item.properties.Item];
            }
            if (typeof item.properties.type != "undefined") {
                custom.title = item.properties.type;
            }
            if (typeof item.price != "undefined") {
                custom.price += (item.price * item.quantity) / 100;
            }
            custom.parts.push(item);
            customCables[item.properties.Item] = custom;

        } else {
            var custom = { parts: [item], price: item.price / 100, title: item.title, quantity: item.quantity, standard_product: true, isHire: false};
            // console.log('process', item, custom);

            if((item.properties != null && typeof item.properties != "undefined") && typeof item.properties.From != "undefined" && typeof item.properties.To != "undefined")
            {
                custom.isHire = true;
                var nitem = item;
                nitem.title = "Hire from " + item.properties.From + " to " + item.properties.To;
                custom.parts = [nitem];
            }
            newcart.items.push(custom);
        }
    }


    for (var i in customCables) {
        var item = customCables[i];
        newcart.items.push(item);
    }

    var hasHiredItem = false;
    var hasDeposit = false;
    for (var i in newcart.items) {
        var item = newcart.items[i];
        if (!hasHiredItem && item.isHire)
        {
            hasHiredItem = true;
        }
        if(!hasDeposit && item.title.indexOf("Deposit") == 0)
        {
            hasDeposit = true;
        }
    }


    if(hasHiredItem && !hasDeposit)
    {
        return;
    }


    // console.log("new cart", newcart);

    var target = document.getElementById('cart_product');
    var template = target.innerHTML;
    Mustache.parse(template);

    for (var i in newcart.items) {
        var item = newcart.items[i];
        item.price = item.price.toFixed(2);
        var tpl = Mustache.render(template, item);

        var $tpl = $(tpl);

        if(typeof item.parts != "undefined" && item.parts.length > 0)
        {
            for(var x in item.parts)
            {
                var part = item.parts[x];
                var thetitle = part.title;
                var endofline = x == (item.parts.length - 1) ? "" : ", ";
                var partQuantity = "";
                if(part.quantity > 1 && !item.standard_product)
                {
                    partQuantity = " <span class='part_quantity'>(x" + part.quantity + ")</span>";
                }
                $tpl.find(".product_includes").append("<span class='part' data-line-item-quantity-price='"+part.quantity*part.price+"' data-line-item-id='"+part.id+"' data-line-price='"+part.price+"'>" + "<span class='part_title'>" + thetitle +"</span>" + partQuantity + endofline + "</span>");
            }
            
        }
        else
        {
            $tpl.find(".product_includes_container").hide();
        }


        // REMOVE BUTTON CODE
        $tpl.find('.remove_button .button').click(function (e) {


            e.preventDefault();
            var $totalPrice = parseFloat($('.cart__total .total__amount').text().replace('$', ''));
            var $parentProduct = $(this).closest('.parent__product');

            // console.log("total price", $totalPrice);
            var $parts = $parentProduct.find('.part');
            if($parts.length > 0)
            {
                var partLines = {};
                for(var n=0; n<$parts.length;n++)
                {
                    partLines[parseInt($($parts[n]).attr("data-line-item-id"))] = 0;
                    $totalPrice -= parseFloat($($parts[n]).attr("data-line-item-quantity-price"))/100;
                }

                $('.cart__total .total__amount, .cart__subtotal .cart__subtotal-money').text('$' + $totalPrice.toFixed(2));
				$('.cart__wrapper').addClass("loading");
                $.ajax('/cart/update.js', {
                    data: { updates: partLines },
                    type: "POST",
                    complete: function (xhr, textStatus)
                    {
                        //window.location.href = "/cart?refresh=1";
                        $parentProduct.fadeOut(function (){
                            $(this).remove();
                            var ps = $('.parent__product');
                            if(ps.length < 1)
                            {
                                window.location.href = "/cart?refresh=1";
                            }
                          window.location.href = "/cart?refresh=1";
                        });
                    }
                });
            }


        });


        //console.log("item for tpl", item);

        if(item.title.indexOf("Deposit") == 0)
        {
            $tpl.find('.remove_button').remove();
          
            $tpl.find('.cart__prodtitle a').text("Security Deposit for Hired Equipment");
            $tpl.find('.product_includes_container').html("<li>This security deposit will be refunded once you have returned the hired equipment</li>");
          
        }
        $('#newcart_items').append($tpl);
    }
  



}