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

  // 🔁 Utility: Get wishlist as array
  function getWishlist() {
    try {
      const raw = JSON.parse(localStorage.getItem("wishlist"));
      return Array.isArray(raw) ? raw : [];
    } catch {
      return [];
    }
  }

  // ✅ Utility: Save wishlist to localStorage
  function saveWishlist(wishlist) {
    localStorage.setItem("wishlist", JSON.stringify(wishlist));
  }

  // 🔄 Update the wishlist count in the header
  function updateWishlistCount() {
    const wishlist = getWishlist();
    const count = wishlist.length;
    $(".wishlist-count")
      .text(count)
      .toggle(count > 0);
  }

  // ✅ Update .active class on buttons and product-boxes
  function applyWishlistStatus() {
    const wishlist = getWishlist();

    $(".add-to-wishlist-btn").each(function () {
      const $btn = $(this);
      const id = $btn.data("id");
      const inWishlist = wishlist.some((item) => item.id === id);
      $btn.toggleClass("active", inWishlist);
      $btn.closest(".product-box").toggleClass("active", inWishlist);
    });
  }

  // ⭐️ Click event to toggle wishlist
  $(document).on("click", ".add-to-wishlist-btn", function (e) {
    e.preventDefault();

    const $btn = $(this);
    const id = $btn.data("id");
    const name = $btn.data("name");
    const price = $btn.data("price");
    const img = $btn.data("img");

    let wishlist = getWishlist();
    const index = wishlist.findIndex((item) => item.id === id);

    if (index > -1) {
      // REMOVE from wishlist
      wishlist.splice(index, 1);
      $btn.removeClass("active");
      $btn.closest(".product-box").removeClass("active");
    } else {
      // ADD to wishlist
      wishlist.push({ id, name, price, img });
      $btn.addClass("active");
      $btn.closest(".product-box").addClass("active");
    }

    saveWishlist(wishlist);
    updateWishlistCount();
  });

  // ✅ On page load: sync UI
  $(document).ready(function () {
    applyWishlistStatus();
    updateWishlistCount();
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
});
