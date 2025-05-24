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

$(document).ready(function() {
    /*----------Featured Products Carousel----------*/

    $.getJSON("data/products.json", function(data) {
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

    $.getJSON("data/products.json", function(data) {
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

    $.getJSON("data/products.json", function(data) {
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
    /*----------Testimonial Carousel----------*/
});