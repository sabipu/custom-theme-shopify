

if (!String.prototype.padEnd) {
    String.prototype.padEnd = function padEnd(targetLength,padString) {
        targetLength = targetLength>>0; //floor if number or convert non-number to 0;
        padString = String((typeof padString !== 'undefined' ? padString : ' '));
        if (this.length > targetLength) {
            return String(this);
        }
        else {
            targetLength = targetLength-this.length;
            if (targetLength > padString.length) {
                padString += padString.repeat(targetLength/padString.length); //append to original to ensure we are longer than needed
            }
            return String(this) + padString.slice(0,targetLength);
        }
    };
}


/**
 * SHOPIFY FUNCTIONS.
 */
async function getShopifyProductTags(collection, iteration = 1, tags = []) {
  await axios
    .get(
      `https://testbhas.myshopify.com/collections/${collection}/products.json?limit=250&page=${iteration}`,
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
  console.log("getAllProducts: " + iteration + " = " + products.length);
  await axios
    .get(`https://testbhas.myshopify.com/products.json?limit=250&page=${iteration}`)
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
    .get(`https://testbhas.myshopify.com/products.json?limit=250&page=${iteration}`)
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
    .get(`https://testbhas.myshopify.com/products.json?limit=250&page=${iteration}`)
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



async function addProductsToCart(products) {
  $('body').addClass('custom__loading');
  let count = 0;

  for (let product of products) {
    count++;
    await axios({
      method: 'post',
      url: `https://testbhas.myshopify.com/cart/add.js`,
      data: {
        quantity: 1,
        id: product,
      },
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then(response => {
        console.log(response);
        count--;
        if (count === 0) {
          $('body').removeClass('custom__loading');
        }
      })
      .catch(error => console.log(error));
  }
}

/**
 * END OF SHOPIFY FUNCTIONS.
 */



async function getShopifyProducts ()
{
  let shopProducts = [];
    await getAllProducts(shopProducts, 1);
  
  
  //let shopProducts2 = [];
   await getAllProducts(shopProducts, 2);

  console.log("shop products: " + shopProducts.length);
  
  console.log("product", shopProducts);
    for(var k=0; k<shopProducts.length; k++)
    {
      var product = shopProducts[k]; 
      
      
      if(typeof product.id == "undefined")
      {
        console.log("WE HAVE A PROBLEM");
       continue; 
        
      }
        var h = "<div class='pr'><br /><br /><br /><div style='border-bottom: 2px solid #ccc;padding-bottom: 5px; margin-top: 15px;'><strong>" + k + ": " + product.title + "</strong>&nbsp;&nbsp;&nbsp;<span style='color:#ddd;'>("+ product.id +")</span></div><br />";
   
        var n = 1;
        for(var n=1; n<product.variants.length+1;n++)
        {
          var variant = product.variants[n-1];
          h += "<div>&nbsp;&nbsp;&nbsp;&nbsp;"+n+ ". <strong>Variant: &nbsp;&nbsp;<span style='color:blue;'>"+ variant.id +"</span></strong>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;" + variant.title.padEnd(20, "~") +  "&nbsp;&nbsp;&nbsp;&nbsp;<span class='" + variant.available + "'>Available: " + variant.available + "</span> &nbsp;&nbsp;&nbsp;&nbsp;" + "   | &nbsp;&nbsp;&nbsp;&nbsp; SKU: " + variant.sku.padEnd(30, "~") + " &nbsp;&nbsp;&nbsp;&nbsp; Price: " + variant.price + "</div>";
     
        }
      
      h += "</div>";
      h = h.replace(/~/g, "&nbsp;");
      $('#pdata-content').append(h);
    }
  
 
}




$( document ).ready(function() {
  getShopifyProducts();
  
  
  $('#search').keyup(function (e){
    
    var v = $(this).val();
    var $prs = $('.pr');
    
    // if the search value is less than 2 characters, show everything
    if(v.length < 2)
    {
      for(var i=0; i<$prs.length; i++)
      {
        var $p = $($prs[i]);
        $p.show();
      }
      return;
    }
    
    v = v.toLowerCase();
    for(var i=0; i<$prs.length; i++)
    {
      var $p = $($prs[i]);
      var ht = $p.html();

      ht = ht.toLowerCase();

      if(ht.indexOf(v) > -1)
      {
        $p.show(); 
      }
      else
      {
        $p.hide(); 
      } 
    }
    
  });
});