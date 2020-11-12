/**
 * HELPER FUNCTIONS.
 */
String.prototype.replaceAll = function(search, replacement) {
  var target = this;
  return target.split(search).join(replacement);
};

function parseTag(tag) {
  return tag.split('|');
}

function parseKeyValue(pair) {
  return pair.split(':');
}

function parseRelation(relation) {
  return relation.split('.');
}

/**
 * RENDER FUNCTIONS.
 */
function createBox(currentBrand, currentType, pair, type, label, category, hidden) {
  if (currentBrand === `${type}.${label}`) {
    return `
    <li class="${hidden ? 'custom__hidden' : ''}">
      <label class="custom__check">
        <input class="toggler ${category[0]}_${category[1]}" type="radio" name="${category[0]}.${
      category[1]
    }|${type}" data-type="${type}" value="config:${category[0]}.${category[1]}|${
      pair[0]
    }:${type}.${label}">
        <span class="prod__choice-text">${_.upperFirst(label)}</span>
      </label>
    </li>
    `;
  } else if (currentType === `${type}.${label}`) {
    return `
    <li class="${hidden ? 'custom__hidden' : ''}">
      <label class="custom__check">
        <input class="toggler ${category[0]}_${category[1]}" type="radio" name="${category[0]}.${
      category[1]
    }|${type}" data-type="${type}" value="config:${category[0]}.${category[1]}|${
      pair[0]
    }:${currentBrand}|${pair[0]}:${type}.${label}">
        <span class="prod__choice-text">${_.upperFirst(label)}</span>
      </label>
    </li>
    `;
  }
}

function createCircle(currentBrand, currentType, pair, type, label, category, hidden) {
  return `
  <li class="${hidden ? 'custom__hidden' : ''}">
    <label class="custom__check">
      <input class="toggler ${category[0]}_${category[1]}" type="radio" name="${category[0]}.${
    category[1]
  }|${type}" data-type="${type}" value="config:${category[0]}.${
    category[1]
  }|box:${currentBrand}|box:${currentType}|${pair[0]}:${type}.${label}">
      <span class="prod__choice-color color--${label}"></span>
    </label>
  </li>
  `;
}

function createInput(
  currentBrand,
  currentType,
  products,
  pair,
  type,
  label,
  targetElement,
  hidden,
) {
  if (pair[0] === 'box') {
    let boxHTML = createBox(
      currentBrand,
      currentType,
      pair,
      type,
      label,
      products.categories,
      hidden,
    );

    if (!_.includes(targetElement.innerHTML, boxHTML)) targetElement.innerHTML += boxHTML;
  } else if (pair[0] === 'circle') {
    let circleHTML = createCircle(
      currentBrand,
      currentType,
      pair,
      type,
      label,
      products.categories,
      hidden,
    );

    if (!_.includes(targetElement.innerHTML, circleHTML)) targetElement.innerHTML += circleHTML;
  }
}

function renderProducts(products) {
  let currentBrand = '';
  let currentType = '';

  _.forEach(products.options, option => {
    let pair = parseKeyValue(option);
    let relationship = parseRelation(pair[1]);
    let type = relationship[0];
    let label = relationship[1];
    let targetElement = document.querySelector(
      `.${products.categories[0]} .${products.categories[1]} .${type}`,
    );

    if (_.includes(pair[1], 'brand')) {
      currentBrand = pair[1];
    }

    if (_.includes(pair[1], 'type')) {
      currentType = pair[1];
    }

    createInput(currentBrand, currentType, products, pair, type, label, targetElement, true);
  });
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
  await axios
    .get(`https://testbhas.myshopify.com/products.json?limit=250&page=${iteration}`)
    .then(response => {
      _.forEach(response.data.products, product => {
        products.push(product);
      });

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

async function getProductVariants() {
  let allProducts = document.querySelectorAll(
    `li > label.custom__check > input[data-type="colour"]`,
  );
  let productTags = [];

  _.forEach(allProducts, product => {
    if (product.value.includes('connector_a')) {
      productTags.push(
        product.value
          .replace('connector_a', 'connector')
          .replace(':', '|')
          .replace('.', '|'),
      );
    } else if (product.value.includes('connector_b')) {
      productTags.push(
        product.value
          .replace('connector_b', 'connector')
          .replace(':', '|')
          .replace('.', '|'),
      );
    } else {
      productTags.push(product.value.replace(':', '|').replace('.', '|'));
    }
  });

  let shopProducts = [];
  await getAllProducts(shopProducts, 1);

  _.forEach(shopProducts, product => {
    _.forEach(product.tags, tag => {
      if (_.includes(productTags, tag)) {
        if (tag.includes('|connector|')) {
          let connectorA = document.querySelector(
            `li > label.custom__check > input[value="${tag
              .replace('|connector|', '|connector_a|')
              .replace('|', ':')
              .replace('|', '.')}"]`,
          );

          let connectorB = document.querySelector(
            `li > label.custom__check > input[value="${tag
              .replace('|connector|', '|connector_b|')
              .replace('|', ':')
              .replace('|', '.')}"]`,
          );

          connectorA.dataset.id = product.variants[0].id;
          connectorA.dataset.product = 'true';
          connectorB.dataset.id = product.variants[0].id;
          connectorB.dataset.product = 'true';
        } else if (tag.includes('|cable|')) {
          let option = document.querySelector(
            `li > label.custom__check > input[value="${tag.replace('|', ':').replace('|', '.')}"]`,
          );

          option.parentNode.parentNode.innerHTML += `
            <li class="custom__hidden">
              <label class="custom__check">
                <select data-parent=${option.value}>
                  ${_.map(product.variants, variant => {
                    return `<option data-product="true" data-id="${variant.id}">${
                      variant.title
                    }</option>`;
                  })}
                </select>
              </label>
            </li>
          `.replaceAll('</option>,', '</option>');
        }
      }
    });
  });
}

/**
 * CONFIGURATOR FUNCTIONS.
 */
async function initiateConfigurator(store) {
  let microphones = await initiateProducts('microphone', store);

  if (microphones) {
    setupProducts(store.get('microphone_cable').value(), 'microphone_cable');
    setupProducts(store.get('microphone_connector_a').value(), 'microphone_connector_a');
    setupProducts(store.get('microphone_connector_b').value(), 'microphone_connector_b');
    setupProducts(store.get('microphone_heatshrink').value(), 'microphone_heatshrink');
    setupProducts(store.get('microphone_label').value(), 'microphone_label');
  }

  await getProductVariants();

  document.addEventListener('click', event => {
    let finalProducts = document.querySelectorAll(
      `li > label.custom__check > input[data-type="colour"]:checked`,
    );

    let allVariants = document.querySelectorAll(`li > label.custom__check > select`);

    _.forEach(allVariants, variant => {
      $(variant)
        .parent()
        .parent()
        .addClass('custom__hidden');
    });

    _.forEach(finalProducts, product => {
      let variant = document.querySelector(
        `li > label.custom__check > select[data-parent="${product.value}"]`,
      );

      $(variant)
        .parent()
        .parent()
        .removeClass('custom__hidden');
    });
  });
}

async function initiateProducts(product, store) {
  store
    .defaults({
      [`${product}_cable`]: [],
      [`${product}_connector_a`]: [],
      [`${product}_connector_b`]: [],
      [`${product}_heatshrink`]: [],
      [`${product}_label`]: [],
    })
    .write();

  this[`${product}List`] = await getShopifyProductTags(product, 1);

  _.forEach(this[`${product}List`], value => {
    if (_.includes(value, '|cable|')) {
      if (
        !store
          .get(`${product}_cable`)
          .includes(value)
          .value()
      ) {
        store
          .get(`${product}_cable`)
          .push(value)
          .write();
      }
    } else if (_.includes(value, '|connector|')) {
      let aTags = parseTag(value);
      let bTags = parseTag(value);

      aTags[2] = 'connector_a';
      bTags[2] = 'connector_b';

      let connectorA = _.join(aTags, '|');
      let connectorB = _.join(bTags, '|');

      if (
        !store
          .get(`${product}_connector_a`)
          .includes(connectorA)
          .value()
      ) {
        store
          .get(`${product}_connector_a`)
          .push(connectorA)
          .write();
      }

      if (
        !store
          .get(`${product}_connector_b`)
          .includes(connectorB)
          .value()
      ) {
        store
          .get(`${product}_connector_b`)
          .push(connectorB)
          .write();
      }
    } else if (_.includes(value, '|heatshrink|')) {
      if (
        !store
          .get(`${product}_heatshrink`)
          .includes(value)
          .value()
      ) {
        store
          .get(`${product}_heatshrink`)
          .push(value)
          .write();
      }
    } else if (_.includes(value, '|label|')) {
      if (
        !store
          .get(`${product}_label`)
          .includes(value)
          .value()
      ) {
        store
          .get(`${product}_label`)
          .push(value)
          .write();
      }
    }
  });

  return true;
}

function createTags(products) {
  let options = [];
  let categories = [];

  _.forEach(products, product => {
    _.forEach(parseTag(product), tag => {
      switch (tag) {
        case 'config':
          break;
        default:
          _.includes(tag, ':') ? options.push(tag) : categories.push(tag);
          break;
      }
    });
  });

  let filtered = [];
  let currentBrand = '';
  let currentType = '';

  _.forEach(options, option => {
    if (_.includes(option, 'brand')) {
      if (currentBrand !== option) {
        currentBrand = option;
        filtered.push(option);
      }
    } else if (_.includes(option, 'type')) {
      if (currentType !== option) {
        currentType = option;
        filtered.push(option);
      }
    } else {
      filtered.push(option);
    }
  });

  return {
    options: filtered,
    categories: _.union(categories),
  };
}

function toggleProducts(depth, toggles, userString) {
  let tags = parseTag(userString);
  let brandType = undefined;

  _.forEach(tags, tag => {
    if (tag.includes('brand')) brandType = parseRelation(parseKeyValue(tag)[1])[1];
  });

  let togglesToHide = _.filter(toggles, toggle => {
    return !_.includes(toggle.value, userString);
  });

  let hiddenDepths = [];

  _.forEach(toggles, toggle => {
    let toggleInfo = parseTag(toggle.getAttribute('name'));

    if (depth === undefined) {
      _.assign(hiddenDepths, [`${toggleInfo[0]}|type`, `${toggleInfo[0]}|colour`]);
    } else if (depth === 'brand') {
      _.assign(hiddenDepths, [`${toggleInfo[0]}|colour`]);
    } else if (depth === 'type') {
      hiddenDepths = [];
    } else if (depth === 'colour') {
      hiddenDepths = [];
    }

    if (depth === undefined) {
      if (!_.includes(hiddenDepths, `${toggleInfo[0]}|${toggleInfo[1]}`)) {
        $(toggle)
          .parent()
          .parent()
          .removeClass('custom__hidden');
      }
    } else if (depth === 'brand') {
      if (!_.includes(hiddenDepths, `${toggleInfo[0]}|${toggleInfo[1]}`)) {
        $(toggle)
          .parent()
          .parent()
          .removeClass('custom__hidden');
      }
    } else if (depth === 'type') {
      if (!_.includes(hiddenDepths, `${toggleInfo[0]}|${toggleInfo[1]}`)) {
        $(toggle)
          .parent()
          .parent()
          .removeClass('custom__hidden');
      }
    }
  });

  _.forEach(togglesToHide, toggle => {
    if (depth === 'brand') {
      if (toggle.value.includes('type')) {
        $(toggle)
          .parent()
          .parent()
          .addClass('custom__hidden');
      }
    } else if (depth === 'type') {
      if (toggle.value.includes('type')) {
        if (!toggle.value.includes(brandType)) {
          $(toggle)
            .parent()
            .parent()
            .addClass('custom__hidden');
        }
      }
      if (toggle.value.includes('colour')) {
        $(toggle)
          .parent()
          .parent()
          .addClass('custom__hidden');
      }
    }
  });
}

function setupProducts(collection, collectionName) {
  const tags = createTags(collection);
  renderProducts(tags);

  let toggles = document.querySelectorAll(`.toggler.${collectionName}`);
  toggleProducts(undefined, toggles, 'config');

  _.forEach(toggles, toggle => {
    toggle.addEventListener('click', event => {
      const depth = toggle.getAttribute('data-type');
      toggleProducts(depth, document.querySelectorAll(`.toggler.${collectionName}`), toggle.value);

      if (toggle.getAttribute('data-type').includes('colour')) {
        let target = document.querySelector(`.image-${tags.categories[1]}`);
        let imageURL = toggle.value;

        imageURL = imageURL.replaceAll('config', '');
        imageURL = imageURL.replaceAll('box', '');
        imageURL = imageURL.replaceAll('circle', '');
        imageURL = imageURL.replaceAll('|', '-');
        imageURL = imageURL.replaceAll(':', '-');
        imageURL = imageURL.replaceAll('.', '-');
        imageURL = imageURL.substring(1);
        target.src = `http://dilatewebsite.dilatedigital.com.au/cablesmiths/${imageURL}.png`;
      }

      if (toggle.getAttribute('data-type').includes('type')) {
        let target = document.querySelector(`.image-${tags.categories[1]}`);
        let imageURL = toggle.value;

        imageURL = imageURL.replaceAll('config', '');
        imageURL = imageURL.replaceAll('box', '');
        imageURL = imageURL.replaceAll('circle', '');
        imageURL = imageURL.replaceAll('|', '-');
        imageURL = imageURL.replaceAll(':', '-');
        imageURL = imageURL.replaceAll('.', '-');
        imageURL = imageURL.substring(1);
        target.src = `http://dilatewebsite.dilatedigital.com.au/cablesmiths/${imageURL}.png`;
      }

      if (toggle.getAttribute('data-type').includes('brand')) {
        let target = document.querySelector('.prod__logo--image');
        let brandTags = parseTag(toggle.value);
        let brandName = parseRelation(_.last(brandTags))[1];

        target.src = `http://dilatewebsite.dilatedigital.com.au/cablesmiths/logo-${brandName}.png`;
      }
    });
  });
}

async function getLabelling() {
  let allProducts = [];
  await getAllProducts(allProducts, 1);

  let labellingBraidColour = document.querySelector(`.labelling .braided_colour`);
  let labellingCableTies = document.querySelector(`.labelling .cable_ties_colour`);

  _.forEach(allProducts, product => {
    _.forEach(product.tags, tag => {
      if (tag.includes('config|labelling')) {
        if (tag.includes('config|labelling|braided_colour')) {
          let tags = parseTag(tag);
          labellingBraidColour.innerHTML += `
            <li class="">
              <label class="custom__check">
                <input class="toggler" type="radio" name="heatshrink|braided_colour" data-product="true" data-id="${
                  product.variants[0].id
                }">
                <span class="prod__choice-color color--${_.last(tags)}"></span>
              </label>
            </li>
          `;
        } else if (tag.includes('config|labelling|cable_ties_colour')) {
          let tags = parseTag(tag);
          labellingCableTies.innerHTML += `
            <li class="">
              <label class="custom__check">
                <input class="toggler" type="radio" name="heatshrink|cable_ties_colour" data-product="true" data-id="${
                  product.variants[0].id
                }">
                <span class="prod__choice-color color--${_.last(tags)}"></span>
              </label>
            </li>
          `;
        }
      }
    });
  });
}

async function getHeatshrink() {
  let allProducts = [];
  await getAllProducts(allProducts, 1);

  let heatShrinkTube = document.querySelector(`.heatshrink .tube_colour`);
  let heatShrinkImprint = document.querySelector(`.heatshrink .imprint_colour`);
  let heatShrinkInk = document.querySelector(`.heatshrink .ink_colour`);

  _.forEach(allProducts, product => {
    _.forEach(product.tags, tag => {
      if (tag.includes('config|heatshrink')) {
        if (tag.includes('config|heatshrink|tube_colour')) {
          let tags = parseTag(tag);
          heatShrinkTube.innerHTML += `
            <li class="">
              <label class="custom__check">
                <input class="toggler" type="radio" name="heatshrink|tube_colour" data-product="true" data-id="${
                  product.variants[0].id
                }">
                <span class="prod__choice-color color--${_.last(tags)}"></span>
              </label>
            </li>
          `;
        } else if (tag.includes('config|heatshrink|imprint_colour')) {
          let tags = parseTag(tag);
          heatShrinkImprint.innerHTML += `
            <li class="">
              <label class="custom__check">
                <input class="toggler" type="radio" name="heatshrink|imprint_colour" data-product="true" data-id="${
                  product.variants[0].id
                }">
                <span class="prod__choice-color color--${_.last(tags)}"></span>
              </label>
            </li>
          `;
        } else if (tag.includes('config|heatshrink|ink_colour')) {
          let tags = parseTag(tag);
          heatShrinkInk.innerHTML += `
            <li class="">
              <label class="custom__check">
                <input class="toggler" type="radio" name="heatshrink|ink_colour" data-product="true" data-id="${
                  product.variants[0].id
                }">
                <span class="prod__choice-color color--${_.last(tags)}"></span>
              </label>
            </li>
          `;
        }
      }
    });
  });
}

/**
 * MAIN FUNCTION.
 */
(async () => {
  localStorage.clear();
  const Store = low(new LocalStorage('store'));
  await initiateConfigurator(Store);

  getHeatshrink();
  getLabelling();

  let toggles = document.querySelectorAll(`.toggler`);

  document.addEventListener('click', event => {
    _.forEach(toggles, toggle => {
      let parent = $(toggle)
        .parent()
        .parent();

      if (parent.hasClass('custom__hidden')) {
        $(toggle).prop('checked', false);
      }

       if (toggle.value.includes('cable')) {
        if (
          toggle.dataset.type === 'type' &&
          toggle.value.includes('cable') &&
          $(toggle).prop('checked')
        ) {
          $('.image').addClass('cable__added');
        }
      }
      
      if (toggle.value.includes('cable') && toggle.dataset.type === 'type') {
       $('.image').addClass('cable__added');
     }

      if (toggle.value.toLowerCase().includes('silent')) {
        if ($(toggle).prop('checked')) {
          if ($(toggle).hasClass('microphone_connector_a')) {
            let otherConnectorValue = toggle.value.replace('connector_a', 'connector_b');
            if (!$(`.toggler[value="${otherConnectorValue}"]`).hasClass('custom__hidden')) {
              $(`.toggler[value="${otherConnectorValue}"]`)
                .parent()
                .parent()
                .addClass('custom__hidden');
            }
          } else if ($(toggle).hasClass('microphone_connector_b')) {
            let otherConnectorValue = toggle.value.replace('connector_b', 'connector_a');
            if (!$(`.toggler[value="${otherConnectorValue}"]`).hasClass('custom__hidden')) {
              $(`.toggler[value="${otherConnectorValue}"]`)
                .parent()
                .parent()
                .addClass('custom__hidden');
            }
          }
        }
      }
    });
  });

  document.querySelector('#AddToCart').addEventListener('click', event => {
    let selectedOptions = document.querySelectorAll(
      'li:not(.custom__hidden) > label.custom__check [data-product="true"]:checked',
    );

    let selectedVariants = [];

    _.forEach(selectedOptions, option => {
      selectedVariants.push(option.dataset.id);
    });

    addProductsToCart(selectedVariants);
  });
})();
