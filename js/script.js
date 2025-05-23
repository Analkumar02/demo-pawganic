/*----------Header----------*/
document.addEventListener("click", function (event) {
  const navMenu = document.querySelector(".nav-menu");
  const menuBtn = document.getElementById("menu-btn");

  const isClickInsideMenu = navMenu.contains(event.target);
  const isClickOnMenuBtn = menuBtn.contains(event.target);

  if (
    !isClickInsideMenu &&
    !isClickOnMenuBtn &&
    navMenu.classList.contains("active")
  ) {
    navMenu.classList.remove("active");
  }
});

document.getElementById("menu-btn").addEventListener("click", function (e) {
  e.preventDefault();
  document.querySelector(".nav-menu").classList.toggle("active");
});

const header = document.getElementById("header");
const stickyOffset = header.offsetTop;

window.addEventListener("scroll", function () {
  if (window.pageYOffset > stickyOffset) {
    header.classList.add("sticky");
  } else {
    header.classList.remove("sticky");
  }
});

/*----------Header----------*/

/*----------Hero slider----------*/
document.querySelectorAll(".slider-bg").forEach((el) => {
  const bg = el.getAttribute("data-background");
  if (bg) {
    el.style.backgroundImage = `url(${bg})`;
  }
});

const progressCircle = document.querySelector(".autoplay-progress svg");
const progressContent = document.querySelector(".autoplay-progress span");

const swiper = new Swiper(".hero-slider", {
  spaceBetween: 30,
  effect: "fade",
  fadeEffect: {
    crossFade: true,
  },
  centeredSlides: true,
  autoplay: {
    delay: 7000,
    disableOnInteraction: false,
  },
  speed: 1000,
  on: {
    autoplayTimeLeft(swiperInstance, time, progress) {
      progressCircle.style.setProperty("--progress", 1 - progress);
    },
  },
});

/*----------Hero slider----------*/

$(document).ready(function () {
  /*----------Cart Count----------*/

  function getCart() {
    return JSON.parse(localStorage.getItem("cart")) || {};
  }

  function saveCart(cart) {
    localStorage.setItem("cart", JSON.stringify(cart));
  }

  function updateCartCount() {
    const cart = getCart();
    let totalQty = 0;
    Object.values(cart).forEach((item) => (totalQty += item.quantity));
    $(".cart-count")
      .text(totalQty)
      .toggle(totalQty > 0);
  }

  updateCartCount();
  /*----------Cart Count----------*/

  /*----------Wishlist Count----------*/

  function getWishlist() {
    return JSON.parse(localStorage.getItem("wishlist")) || {};
  }

  function saveWishlist(wishlist) {
    localStorage.setItem("wishlist", JSON.stringify(wishlist));
  }

  function updateWishlistCount() {
    const wishlist = getWishlist();
    const count = Object.keys(wishlist).length;
    $(".wishlist-count")
      .text(count)
      .toggle(count > 0);
  }

  updateWishlistCount();
  /*----------Wishlist Count----------*/

  /*----------Add to wishlist----------*/

  $(document).on("click", ".add-to-wishlist-btn", function (e) {
    e.preventDefault();

    const id = $(this).data("id");
    const name = $(this).data("name");
    const img = $(this).data("img");
    const price = parseFloat($(this).data("price"));

    let wishlist = getWishlist();

    if (!wishlist[id]) {
      wishlist[id] = { id, name, img, price };
      saveWishlist(wishlist);
      updateWishlistCount();
    } else {
      alert("Already in wishlist");
    }
  });
  /*----------Add to wishlist----------*/

  /*----------Add to cart----------*/

  $(document).on("click", ".add-to-cart-btn", function (e) {
    e.preventDefault();

    const id = $(this).data("id");
    const name = $(this).data("name");
    const price = parseFloat($(this).data("price"));
    const image = $(this).data("img");

    let cart = getCart();

    if (cart[id]) {
      cart[id].quantity += 1;
    } else {
      cart[id] = { id, name, price, image, quantity: 1 };
    }

    saveCart(cart);
    updateCartCount();
  });
  /*----------Add to cart----------*/

  /*----------Search Box----------*/
  const $searchForm = $(".search-form");
  const $searchBtn = $("#search-btn");
  const $searchBox = $("#search-box");
  const $suggestionsBox = $("#suggestions");

  $searchBtn.on("click", function (e) {
    e.preventDefault();
    $searchForm.toggleClass("active");
    $suggestionsBox.hide().empty();
    $searchBox.val("");
  });

  $searchBox.on("input", function () {
    const query = $(this).val().toLowerCase().trim();

    if (!query) {
      $suggestionsBox.hide().empty();
      return;
    }

    $.getJSON("data/products.json", function (data) {
      const results = data.products
        .filter((product) => product.name.toLowerCase().includes(query))
        .slice(0, 4);

      if (results.length === 0) {
        $suggestionsBox
          .html('<div class="suggestion-item">No results found</div>')
          .show();
        return;
      }

      const html = results
        .map(
          (product) => `
    <div class="suggestion-item" data-id="${product.id}">
        <img src="${product.images[0]}" alt="${product.name}">
        <span>${product.name}</span>
    </div>
`
        )
        .join("");

      $suggestionsBox.html(html).css({ display: "block" });
    });
  });

  $(document).on("click", ".suggestion-item", function () {
    const id = $(this).data("id");
    if (id) {
      window.location.href = `product-desc.html?id=${id}`;
    }
  });

  $(document).on("click", function (e) {
    if (
      !$searchForm.is(e.target) &&
      $searchForm.has(e.target).length === 0 &&
      !$searchBtn.is(e.target) &&
      $searchBtn.has(e.target).length === 0 &&
      !$searchBox.is(e.target) &&
      $searchBox.has(e.target).length === 0 &&
      !$suggestionsBox.is(e.target) &&
      $suggestionsBox.has(e.target).length === 0
    ) {
      $searchForm.removeClass("active");
      $suggestionsBox.hide();
    }
  });
  /*----------Search Box----------*/

  /*----------Featured Products Carousel----------*/

  $.getJSON("data/products.json", function (data) {
    const featuredProducts = data.products.filter(
      (product) => product.tags && product.tags.includes("featured")
    );

    let html = "";
    featuredProducts.forEach((product) => {
      const nameWords = product.name.split(" ");
      const shortName =
        nameWords.slice(0, 7).join(" ") + (nameWords.length > 7 ? "..." : "");

      html += `
        <div class="swiper-slide product-slide">
            <div class="product-box">
                <div class="product-img position-relative">
                    <img class="pr-img" src="${product.images[0]}" alt="${
        product.name
      }">
                    <div class="add-to-cart">
                        <a href="#" class="btn add-to-cart-btn" 
                           data-id="${product.id}" 
                           data-name="${shortName}" 
                           data-price="${product.offerPrice}" 
                           data-img="${product.images[0]}">
                            <img src="images/cart-white.svg" alt="cart"> add to cart
                        </a>
                    </div>
                    <div class="wishlist-box">
                        <a href="#" class="add-to-wishlist-btn"
                            data-id="${product.id}"
                            data-name="${shortName}"
                            data-img="${product.images[0]}"
                            data-price="${product.offerPrice}">
                            <i class="bx bx-heart"></i>
                        </a>
                    </div>
                </div>
                <div class="product-info">
                    <a class="pr-title" href="product-desc.html?id=${
                      product.id
                    }">
                        <p>${shortName}</p>
                    </a>
                    <div class="pr-price">
                        <div class="offer-price">$${product.offerPrice.toFixed(
                          2
                        )}</div>
                        <div class="org-price"><strike>$${product.originalPrice.toFixed(
                          2
                        )}</strike></div>
                    </div>
                </div>
            </div>
        </div>
    `;
    });

    $("#featured-products-wrapper").html(html);

    new Swiper(".feature-pr-slider", {
      slidesPerView: 1,
      spaceBetween: 20,
      loop: true,
      autoplay: {
        delay: 2500,
        disableOnInteraction: false,
      },
      navigation: {
        nextEl: ".pr-slider-next",
        prevEl: ".pr-slider-prev",
      },
      breakpoints: {
        576: { slidesPerView: 2 },
        768: { slidesPerView: 3 },
        992: { slidesPerView: 4 },
        1200: { slidesPerView: 5 },
      },
    });
  });
  /*----------Featured Products Carousel----------*/

  /*----------Trending Products----------*/

  $.getJSON("data/products.json", function (data) {
    const trendingProducts = data.products
      .filter((product) => product.tags && product.tags.includes("trending"))
      .slice(0, 6);

    let html = "";
    trendingProducts.forEach((product) => {
      const nameWords = product.name.split(" ");
      const shortName =
        nameWords.slice(0, 7).join(" ") + (nameWords.length > 7 ? "..." : "");

      html += `
    <div class="col-lg-4 col-md-4 col-sm-6 col-6">
        <div class="product-box">
            <div class="product-img position-relative">
                <img class="pr-img" src="${product.images[0]}" alt="${
        product.name
      }">
                <div class="add-to-cart">
                    <a href="#" class="btn add-to-cart-btn"
                       data-id="${product.id}"
                       data-name="${shortName}"
                       data-price="${product.offerPrice}"
                       data-img="${product.images[0]}">
                        <img src="images/cart-white.svg" alt="cart"> add to cart
                    </a>
                </div>
                <div class="wishlist-box">
                    <a href="#" class="add-to-wishlist-btn"
                       data-id="${product.id}"
                       data-name="${shortName}"
                       data-img="${product.images[0]}"
                       data-price="${product.offerPrice}">
                        <i class="bx bx-heart"></i>
                    </a>
                </div>
            </div>
            <div class="product-info">
                <a class="pr-title" href="product-desc.html?id=${product.id}">
                    <p>${shortName}</p>
                </a>
                <div class="pr-price">
                    <div class="offer-price">$${product.offerPrice.toFixed(
                      2
                    )}</div>
                    <div class="org-price"><strike>$${product.originalPrice.toFixed(
                      2
                    )}</strike></div>
                </div>
            </div>
        </div>
    </div>
`;
    });

    $("#trending-products-wrapper").html(html);
  });

  /*----------Top Rated Products----------*/

  $.getJSON("data/products.json", function (data) {
    const topratedProducts = data.products
      .filter((product) => product.tags && product.tags.includes("top"))
      .slice(0, 6);

    let html = "";
    topratedProducts.forEach((product) => {
      const nameWords = product.name.split(" ");
      const shortName =
        nameWords.slice(0, 7).join(" ") + (nameWords.length > 7 ? "..." : "");

      html += `
    <div class="col-lg-4 col-md-4 col-sm-6 col-6">
        <div class="product-box">
            <div class="product-img position-relative">
                <img class="pr-img" src="${product.images[0]}" alt="${
        product.name
      }">
                <div class="add-to-cart">
                    <a href="#" class="btn add-to-cart-btn"
                       data-id="${product.id}"
                       data-name="${shortName}"
                       data-price="${product.offerPrice}"
                       data-img="${product.images[0]}">
                        <img src="images/cart-white.svg" alt="cart"> add to cart
                    </a>
                </div>
                <div class="wishlist-box">
                    <a href="#" class="add-to-wishlist-btn"
                       data-id="${product.id}"
                       data-name="${shortName}"
                       data-img="${product.images[0]}"
                       data-price="${product.offerPrice}">
                        <i class="bx bx-heart"></i>
                    </a>
                </div>
            </div>
            <div class="product-info">
                <a class="pr-title" href="product-desc.html?id=${product.id}">
                    <p>${shortName}</p>
                </a>
                <div class="pr-price">
                    <div class="offer-price">$${product.offerPrice.toFixed(
                      2
                    )}</div>
                    <div class="org-price"><strike>$${product.originalPrice.toFixed(
                      2
                    )}</strike></div>
                </div>
            </div>
        </div>
    </div>
`;
    });

    $("#toprated-products-wrapper").html(html);
  });

  /*----------Testimonial Carousel----------*/
  var swiper = new Swiper(".testimonial-slider", {
    spaceBetween: 30,
    centeredSlides: true,
    loop: true,
    autoplay: {
      delay: 5000,
      disableOnInteraction: false,
    },
  });

  /*----------Single Product Page----------*/

  if (window.location.pathname.includes("product-desc.html")) {
    const urlParams = new URLSearchParams(window.location.search);
    const productId = urlParams.get("id");

    if (productId) {
      $.getJSON("data/products.json", function (data) {
        const product = data.products.find((p) => p.id === productId);
        if (!product) return;

        const {
          name,
          category,
          images,
          offerPrice,
          originalPrice,
          shortDesc,
          description,
          ingredients,
          keyBenefits,
          rating = 0,
        } = product;

        const imageSlides = images
          .map(
            (img) => `<div class="swiper-slide"><img src="${img}" alt=""></div>`
          )
          .join("");

        const thumbSlides = images
          .map(
            (img) => `<div class="swiper-slide"><img src="${img}" alt=""></div>`
          )
          .join("");

        let tabs = "",
          tabContents = "";
        if (description) {
          tabs += `<li class="nav-item"><button class="nav-link active" id="desc-tab" data-bs-toggle="tab" data-bs-target="#desc" type="button" role="tab">Description</button></li>`;
          tabContents += `<div class="tab-pane fade show active" id="desc" role="tabpanel"><p>${description}</p></div>`;
        }
        if (ingredients) {
          tabs += `<li class="nav-item"><button class="nav-link ${
            !description ? "active" : ""
          }" id="ingredients-tab" data-bs-toggle="tab" data-bs-target="#ingredients" type="button" role="tab">Ingredients</button></li>`;
          tabContents += `<div class="tab-pane fade ${
            !description ? "show active" : ""
          }" id="ingredients" role="tabpanel"><p>${ingredients}</p></div>`;
        }
        if (keyBenefits) {
          tabs += `<li class="nav-item"><button class="nav-link ${
            !description && !ingredients ? "active" : ""
          }" id="benefits-tab" data-bs-toggle="tab" data-bs-target="#benefits" type="button" role="tab">Key Benefits</button></li>`;
          tabContents += `<div class="tab-pane fade ${
            !description && !ingredients ? "show active" : ""
          }" id="benefits" role="tabpanel"><ul class="list-style-disc benefit-list">${keyBenefits
            .map((item) => `<li>${item}</li>`)
            .join("")}</ul></div>`;
        }

        function renderStars(rating) {
          let starsHtml = "";
          for (let i = 1; i <= 5; i++) {
            if (rating >= i) {
              starsHtml += '<li><i class="bx bxs-star"></i></li>';
            } else if (rating >= i - 0.5) {
              starsHtml += '<li><i class="bx bxs-star-half"></i></li>';
            } else {
              starsHtml += '<li><i class="bx bx-star"></i></li>';
            }
          }
          return starsHtml;
        }

        const html = `
                            <div class="container-xl">
                                <div class="row">
                                <div class="col-lg-6">
                                    <div class="single-img-box">
                                    <div class="swiper single-pr-slider">
                                        <div class="swiper-wrapper">${imageSlides}</div>
                                        <div class="swiper-button-next single-pr-btn"></div>
                                        <div class="swiper-button-prev single-pr-btn"></div>
                                    </div>
                                    <div class="swiper single-thumb-slider" thumbsSlider>
                                        <div class="swiper-wrapper">${thumbSlides}</div>
                                    </div>
                                    </div>
                                </div>

                                <div class="col-lg-6">
                                    <div class="single-pr-content">
                                    <div class="pr-category"><p>${category.toUpperCase()}</p></div>
                                    <h2 class="single-pr-title">${name}</h2>
                                    <ul class="rw-stars">${renderStars(
                                      rating
                                    )}</ul>
                                    <div class="signle-pr-price">
                                        <div class="offer-price">$${offerPrice.toFixed(
                                          2
                                        )}</div>
                                        <div class="org-price"><strike>$${originalPrice.toFixed(
                                          2
                                        )}</strike></div>
                                    </div>
                                    <div class="pr-divider"></div>
                                    <p class="short-desc">${shortDesc || ""}</p>

                                    <div class="cart-box">
                                        <div class="quantity-box">
                                        <button class="qty-btn minus"><span>-</span></button>
                                        <input type="number" class="qty-input" value="1" min="1">
                                        <button class="qty-btn plus"><span>+</span></button>
                                        </div>
                                        <div class="add-to-cart btn add-to-cart-btn"
                                        data-id="${product.id}"
                                        data-name="${product.name}"
                                        data-price="${offerPrice}"
                                        data-img="${images[0]}">
                                        add to cart
                                        </div>
                                    </div>

                                    <div class="wishlist-box">
                                        <a href="#" class="add-to-wishlist-btn"
                                        data-id="${product.id}"
                                        data-name="${product.name}"
                                        data-price="${offerPrice}"
                                        data-img="${images[0]}">
                                        <i class="bx bx-heart"></i> Add To Wishlist
                                        </a>
                                    </div>

                                    <div class="safe-checkout">
                                        <p>Guaranteed Safe Checkout</p>
                                        <img src="images/guarantee.png" alt="safe-checkout">
                                    </div>
                                    </div>
                                </div>

                                <div class="col-12">
                                    <div class="custom-tabs mt-5">
                                    <ul class="nav nav-tabs pr-details" id="productTabs" role="tablist">${tabs}</ul>
                                    <div class="tab-content pt-4">${tabContents}</div>
                                    </div>
                                </div>
                                </div>
                            </div>`;

        $(".pr-desc-area").html(html);

        const thumbSwiper = new Swiper(".single-thumb-slider", {
          spaceBetween: 10,
          loop: true,
          slidesPerView: 4,
          freeMode: true,
          watchSlidesProgress: true,
        });

        new Swiper(".single-pr-slider", {
          loop: true,
          spaceBetween: 10,
          navigation: {
            nextEl: ".swiper-button-next",
            prevEl: ".swiper-button-prev",
          },
          thumbs: {
            swiper: thumbSwiper,
          },
        });
      });
    }
  }

  $(document).on("click", ".qty-btn.plus", function () {
    const input = $(this).siblings(".qty-input");
    input.val(parseInt(input.val()) + 1);
  });

  $(document).on("click", ".qty-btn.minus", function () {
    const input = $(this).siblings(".qty-input");
    const currentVal = parseInt(input.val());
    if (currentVal > 1) {
      input.val(currentVal - 1);
    }
  });

  const urlParams = new URLSearchParams(window.location.search);
  const productId = urlParams.get("id");

  if (productId) {
    $.getJSON("data/products.json", function (data) {
      const product = data.products.find((p) => p.id === productId);
      if (!product) return;

      const relatedProducts = data.products.filter((p) => p.id !== productId);
      const relatedHtml = relatedProducts
        .map(
          (item) => `
  <div class="swiper-slide">
    <div class="product-box">
      <div class="product-img position-relative">
        <img class="pr-img" src="${item.images[0]}" alt="${item.name}">
        <div class="add-to-cart">
          <a href="#" class="btn add-to-cart-btn"
             data-id="${item.id}"
             data-name="${item.name}"
             data-price="${item.offerPrice}"
             data-img="${item.images[0]}">
            <img src="images/cart-white.svg" alt="cart"> add to cart
          </a>
        </div>
        <div class="wishlist-box">
          <a href="#" class="add-to-wishlist-btn"
             data-id="${item.id}"
             data-name="${item.name}"
             data-img="${item.images[0]}"
             data-price="${item.offerPrice}">
            <i class="bx bx-heart"></i>
          </a>
        </div>
      </div>
      <div class="product-info">
        <a class="pr-title" href="product-desc.html?id=${item.id}">
          <p>${item.name.split(" ").slice(0, 7).join(" ")}${
            item.name.split(" ").length > 7 ? "..." : ""
          }</p>
        </a>
        <div class="pr-price">
          <div class="offer-price">$${item.offerPrice.toFixed(2)}</div>
          <div class="org-price"><strike>$${item.originalPrice.toFixed(
            2
          )}</strike></div>
        </div>
      </div>
    </div>
  </div>
`
        )
        .join("");

      $("#related-products-wrapper").html(relatedHtml);

      new Swiper(".related-pr-slider", {
        slidesPerView: 4,
        spaceBetween: 30,
        navigation: {
          nextEl: ".pr-slider-next",
          prevEl: ".pr-slider-prev",
        },
        breakpoints: {
          576: { slidesPerView: 2 },
          768: { slidesPerView: 3 },
          992: { slidesPerView: 4 },
          1200: { slidesPerView: 5 },
        },
      });
    });
  }
});
