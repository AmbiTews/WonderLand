
// ─── Cookie Utilities ────────────────────────────────────────────────────────

function removeCookie(name) {
  document.cookie = name + '=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';
}

function removeAllCookies() {
  var cookies = document.cookie.split(";");
  cookies.forEach(function (cookie) {
    removeCookie(cookie.split("=")[0]);
  });
}

// ─── Consent UI Elements ─────────────────────────────────────────────────────

var midEl        = document.querySelector(".mid");
var uuidEl       = document.querySelector(".uuid");
var btnGive      = document.querySelector(".btnGive");
var btnDeny      = document.querySelector(".btnDeny");
var btnGetMid    = document.querySelector(".btnGetMid");
var btnGetUuid   = document.querySelector(".btnGetUuid");
var loading      = document.querySelector(".loading");
var btnDeleteCookies = document.querySelector(".btnDeleteCookies");
var btnGlobalUI  = document.querySelector(".btnGlobalUI");
var btnWizardUI  = document.querySelector(".btnWizardUI");
var btnMultipleUI = document.querySelector(".btnMultipleUI");
var btnIabUI     = document.querySelector(".btnIabUI");
var allConsentUIs = document.querySelectorAll(".consent-ui > div");

function hideAllConsentUIs() {
  allConsentUIs.forEach(function (ui) {
    ui.style.display = "none";
  });
}

function show(el) {
  el.style.display = "block";
}

function showConsentUI(el) {
  hideAllConsentUIs();
  show(el);
}

btnGlobalUI.addEventListener("click", function () {
  showConsentUI(document.querySelector(".global"));
});

btnWizardUI.addEventListener("click", function () {
  showConsentUI(document.querySelector(".wizard"));
});

btnMultipleUI.addEventListener("click", function () {
  showConsentUI(document.querySelector(".multiple"));
});

if (btnIabUI) {
  btnIabUI.addEventListener("click", function () {
    showConsentUI(document.querySelector(".iab-standard"));
  });
}

// ─── Consent Actions ─────────────────────────────────────────────────────────

function makeConsentAction(action) {
  return function () {
    adobe.optIn[action === "approve" ? "approveAll" : "denyAll"]();
  };
}

btnGive.addEventListener("click", makeConsentAction("approve"));
btnDeny.addEventListener("click", makeConsentAction("deny"));

if (btnGetMid) {
  btnGetMid.addEventListener("click", function () {
    if (!adobe.optIn.isApproved("ecid")) {
      midEl.innerHTML = "MID cannot be retrieved. Visitor is waiting for Opt In";
      return;
    }
    visitor.getMarketingCloudVisitorID(function (mid) {
      midEl.innerHTML = mid;
    }, true);
  });
}

if (btnGetUuid) {
  btnGetUuid.addEventListener("click", function () {
    if (!adobe.optIn.isApproved("aam")) {
      uuidEl.innerHTML = "UUID cannot be retrieved. DIL is waiting for Opt In";
      return;
    }
    dil.api.afterResult(function (json) {
      uuidEl.innerHTML = json.uuid;
    }).submit();
  });
}

// ─── Wizard UI ───────────────────────────────────────────────────────────────

var btnAgreeOne   = document.querySelector(".btnAgreeOne");
var btnAgreeTwo   = document.querySelector(".btnAgreeTwo");
var btnAgreeThree = document.querySelector(".btnAgreeThree");
var btnAgreeFour  = document.querySelector(".btnAgreeFour");

var btnDenyOne   = document.querySelector(".btnDenyOne");
var btnDenyTwo   = document.querySelector(".btnDenyTwo");
var btnDenyThree = document.querySelector(".btnDenyThree");
var btnDenyFour  = document.querySelector(".btnDenyFour");

var btnWizard = document.querySelector(".btnWizard");
var screen1   = document.querySelector(".screen1");
var screen2   = document.querySelector(".screen2");
var screen3   = document.querySelector(".screen3");
var screen4   = document.querySelector(".screen4");
var screen99  = document.querySelector(".screen99");
var shouldWaitForComplete = true;

function makeWizard(action) {
  return function wizard(category, screenToHide, screenToShow) {
    screenToHide.style.display = "none";
    screenToShow.style.display = "block";
    adobe.optIn[action](category, shouldWaitForComplete);
  };
}

var approvalWizard = makeWizard("approve");
var denialWizard   = makeWizard("deny");

btnAgreeOne.addEventListener("click", function () {
  approvalWizard(adobe.optIn.Categories.ANALYTICS, screen1, screen2);
});
btnDenyOne.addEventListener("click", function () {
  denialWizard(adobe.optIn.Categories.ANALYTICS, screen1, screen2);
});

btnAgreeTwo.addEventListener("click", function () {
  approvalWizard(adobe.optIn.Categories.TARGET, screen2, screen3);
});
btnDenyTwo.addEventListener("click", function () {
  denialWizard(adobe.optIn.Categories.TARGET, screen2, screen3);
});

btnAgreeThree.addEventListener("click", function () {
  approvalWizard(adobe.optIn.Categories.ECID, screen3, screen4);
});
btnDenyThree.addEventListener("click", function () {
  denialWizard(adobe.optIn.Categories.ECID, screen3, screen4);
});

btnAgreeFour.addEventListener("click", function () {
  approvalWizard(adobe.optIn.Categories.AAM, screen4, screen99);
});
btnDenyFour.addEventListener("click", function () {
  denialWizard(adobe.optIn.Categories.AAM, screen4, screen99);
});

btnWizard.addEventListener("click", function () {
  adobe.optIn.complete();
});

// ─── Multiple Permissions UI ──────────────────────────────────────────────────

var btnSubmitPermissions = document.querySelector(".btnSubmitPermissions");

btnSubmitPermissions.addEventListener("click", function (ev) {
  ev.preventDefault();
  loading.style.visibility = "visible";

  setTimeout(function () {
    var allCheckboxes = Array.from(document.querySelectorAll("input[type=checkbox]"));

    allCheckboxes.forEach(function (el) {
      if (el.checked) {
        adobe.optIn.approve(el.name, shouldWaitForComplete);
      } else {
        adobe.optIn.deny(el.name, shouldWaitForComplete);
      }
    });

    adobe.optIn.complete();
    loading.style.visibility = "hidden";
  }, 1000);
});

// ─── Login / Logout ───────────────────────────────────────────────────────────

var loginStatus;
var userType;
var userCRMId;
var emailValidation;
var validEmails = [];

var loginBtn  = document.querySelector("#id01 .modalLogin");
var logoutBtn = document.querySelector("#navbarResponsive .logout");
var loginNav  = document.querySelector("#navbarResponsive .login");
var logoutNav = document.querySelector("#navbarResponsive .logout");

if (loginBtn) {
  loginBtn.addEventListener("click", function () {
    console.log("login button is clicked");
    emailValidation = ValidateEmail(document.getElementById("email").value);

    if (emailValidation) {
      console.log("Email validation is successful");
      cookiecall();
      loginStatus = "Logged In";
      userType    = "Member";
      localStorage.setItem("loginStatus", loginStatus);
      localStorage.setItem("userType", userType);
    }
  });
}

function ValidateEmail(inputText) {
  console.log("Email address is " + inputText);
  validEmails = [
    "ambika.tewari@accenture.com",
    
  "demoofficialpoc@gmail.com"
  ];

  if (validEmails.indexOf(inputText) !== -1) {
        console.log("You have entered an valid email address!");

    return true;
  } else {
    console.log("You have entered an invalid email address!");
    return false;
  }
}

// ─── Window Load ─────────────────────────────────────────────────────────────

window.onload = function () {
  console.log("window is not completely loaded");

  var loginEl  = document.querySelector("#navbarResponsive .login");
  var logoutEl = document.querySelector("#navbarResponsive .logout");

  if (localStorage.getItem("userCRMId") !== null) {
    if (loginEl)  loginEl.style.display  = "none";
    console.log("login btn is hidden now");
    if (logoutEl) logoutEl.style.display = "block";
  }

  if (localStorage.getItem("userCRMId") === null) {
    loginStatus = "Not Logged In";
    userType    = "Anonymous";
    localStorage.setItem("loginStatus", loginStatus);
    localStorage.setItem("userType", userType);
    if (loginEl)  loginEl.style.display  = "block";
    console.log("first page load");
    if (logoutEl) logoutEl.style.display = "none";
  }
};

if (logoutBtn) {
  logoutBtn.addEventListener("click", function () {
    console.log("User is loggedOut");
    document.cookie = "crmId=null";

    loginStatus = "Not Logged In";
    userType    = "Anonymous";
    console.log("User is logged out");

    var loginEl  = document.querySelector("#navbarResponsive .login");
    var logoutEl = document.querySelector("#navbarResponsive .logout");

    if (loginEl)  loginEl.style.display  = "block";
    console.log("log out btn is hidden now");
    if (logoutEl) logoutEl.style.display = "none";

    localStorage.setItem("loginStatus", loginStatus);
    localStorage.setItem("userType", userType);
    localStorage.removeItem("userCRMId");

    console.log("page is refreshing");
    location.reload();
  });
}

// ─── Cookie Call ─────────────────────────────────────────────────────────────

function cookiecall() {
  var email = document.getElementById("email").value;

  var emailToCrmId = {
    "ankit.r.agarwal@accenture.com":    "112255",
    "amish.arora@accenture.com":         "223377",
    "shikha.s.chauhan@accenture.com":    "334433",
    "ishan.chopra@accenture.com":        "445599",
    "apurvi.gulati@accenture.com":       "556688",
    "silky.jain@accenture.com":          "667799",
    "akshay.a.kapil@accenture.com":      "778888",
    "anjali.khera@accenture.com":        "889911",
    "bhawna.kumar@accenture.com":        "991122",
    "munayan.ray@accenture.com":         "121377",
    "priyanka.b.saxena@accenture.com":   "131444",
    "dhananjay.c.sharma@accenture.com":  "141522",
    "shivani.o.singh@accenture.com":     "151611",
    "ambika.tewari@accenture.com":       "171655",
    "nabendu.varma@accenture.com":       "181933",
    "demoofficialpoc@gmail.com":         "10102020"
  };

  var crmId = emailToCrmId[email] || "null";
  document.cookie = "crmId=" + crmId;

  function getCook(cookiename) {
    var cookiestring = RegExp(cookiename + "=[^;]+").exec(document.cookie);
    return decodeURIComponent(
      cookiestring ? cookiestring.toString().replace(/^[^=]+./, "") : ""
    );
  }

  var cookieValue = getCook("crmId");
  localStorage.setItem("userCRMId", cookieValue);
}

// ─── Cart ─────────────────────────────────────────────────────────────────────

var cartWrapper = document.querySelector(".cd-cart-container");
var productId   = 0;

if (cartWrapper) {
  var cartBody      = cartWrapper.querySelector(".body");
  var cartList      = cartBody.querySelector("ul");
  var cartTotal     = cartWrapper.querySelector(".checkout span");
  var cartTrigger   = cartWrapper.querySelector(".cd-cart-trigger");
  var cartCount     = cartTrigger.querySelector(".count");
  var addToCartBtns = document.querySelectorAll(".cd-add-to-cart");
  var undo          = cartWrapper.querySelector(".undo");
  var undoTimeoutId;

  // Add product to cart
  addToCartBtns.forEach(function (btn) {
    btn.addEventListener("click", function (event) {
      event.preventDefault();
      addToCart(btn);
    });
  });

  // Open/close cart
  cartTrigger.addEventListener("click", function (event) {
    event.preventDefault();
    toggleCart();
  });

  // Close cart when clicking the background overlay
  cartWrapper.addEventListener("click", function (event) {
    if (event.target === cartWrapper) toggleCart(true);
  });

  // Delete item from cart
  cartList.addEventListener("click", function (event) {
    if (event.target.classList.contains("delete-item")) {
      event.preventDefault();
      removeProduct(event.target.closest(".product"));
    }
  });

  // Update item quantity
  cartList.addEventListener("change", function (event) {
    if (event.target.tagName === "SELECT") {
      quickUpdateCart();
    }
  });

  // Undo item removal
  var undoLink = undo.querySelector("a");
  if (undoLink) {
    undoLink.addEventListener("click", function (event) {
      clearInterval(undoTimeoutId);
      event.preventDefault();

      var deletedItem = cartList.querySelector(".deleted");
      if (deletedItem) {
        deletedItem.classList.add("undo-deleted");

        function onAnimEnd() {
          deletedItem.removeEventListener("webkitAnimationEnd", onAnimEnd);
          deletedItem.removeEventListener("animationend", onAnimEnd);
          deletedItem.classList.remove("deleted", "undo-deleted");
          deletedItem.removeAttribute("style");
          quickUpdateCart();
        }

        deletedItem.addEventListener("webkitAnimationEnd", onAnimEnd);
        deletedItem.addEventListener("animationend", onAnimEnd);
      }

      undo.classList.remove("visible");
      maintainLocalStorage();
    });
  }
}

function toggleCart(bool) {
  var cartIsOpen = (typeof bool === "undefined")
    ? cartWrapper.classList.contains("cart-open")
    : bool;

  if (cartIsOpen) {
    cartWrapper.classList.remove("cart-open");
    clearInterval(undoTimeoutId);
    undo.classList.remove("visible");

    var deletedInCart = cartList.querySelector(".deleted");
    if (deletedInCart) deletedInCart.remove();

    setTimeout(function () {
      cartBody.scrollTop = 0;
      var countLi = cartCount.querySelectorAll("li");
      if (Number(countLi[0].textContent) === 0) {
        cartWrapper.classList.add("empty");
      }
    }, 500);
  } else {
    cartWrapper.classList.add("cart-open");
  }
}

function addToCart(trigger) {
  var cartIsEmpty = cartWrapper.classList.contains("empty");
  addProduct();
  updateCartCount(cartIsEmpty);
  quickUpdateCart();
  cartWrapper.classList.remove("empty");
  maintainLocalStorage();
}

function addProduct() {
  console.log("hello1");

  var queryString = {};
  var search = window.location.search;

  if (search.split("?").length > 1) {
    var params = search.split("?")[1].split("&");
    params.forEach(function (param) {
      var key   = param.split("=")[0];
      var value = decodeURIComponent(param.split("=")[1]);
      queryString[key] = value;
    });
  } else {
    var titleEl    = document.getElementById("title");
    var imgEl      = document.getElementById("imgContainer");
    var priceEl    = document.getElementById("price");

    var title    = titleEl ? titleEl.textContent : "";
    var img      = imgEl  ? imgEl.getAttribute("src") : "";
    var priceTag = priceEl ? priceEl.textContent : "";
    var price    = priceTag.split(":");
    var imgName  = img.split("/");

    queryString["title"]   = title;
    queryString["imgName"] = imgName[1];
    queryString["price"]   = (price[1] || "").trim();
  }

  productId += 1;

  var li = document.createElement("li");
  li.className = "product";
  li.innerHTML =
    '<div class="product-image">' +
      '<a href="#0" style="font-size:62.5%">' +
        '<img src="img/' + queryString["imgName"] + '" alt="placeholder">' +
      "</a>" +
    "</div>" +
    '<div class="product-details">' +
      "<h3>" +
        '<a href="#0" style="font-size:62.5%">' + queryString["title"] + "</a>" +
      "</h3>" +
      '<span class="price">' + queryString["price"] + "</span>" +
      '<div class="actions">' +
        '<a href="#0" class="delete-item" style="font-size:62.5%">Remove</a>' +
        '<div class="quantity" style="font-size:62.5%">' +
          '<label for="cd-product-' + productId + '">Qty</label>' +
          '<span class="select">' +
            '<select style="font-size:75%" id="cd-product-' + productId + '" name="quantity">' +
              [1,2,3,4,5,6,7,8,9].map(function(n){
                return '<option value="' + n + '">' + n + "</option>";
              }).join("") +
            "</select>" +
          "</span>" +
        "</div>" +
      "</div>" +
    "</div>";

  console.log("product Added:", li);
  cartList.insertBefore(li, cartList.firstChild);
}

function removeProduct(product) {
  clearInterval(undoTimeoutId);

  var prevDeleted = cartList.querySelector(".deleted");
  if (prevDeleted) prevDeleted.remove();

  var cartListOffset   = cartList.getBoundingClientRect().top;
  var productOffset    = product.getBoundingClientRect().top;
  var topPosition      = productOffset - cartListOffset + cartBody.scrollTop;
  var productQuantity  = Number(product.querySelector(".quantity select").value);
  var productTotPrice  = Number(product.querySelector(".price").textContent.replace("$", "")) * productQuantity;

  product.style.top = topPosition + "px";
  product.classList.add("deleted");

  console.log("Product Total Price:", productTotPrice);
  console.log("Product Quantity:", productQuantity);

  updateCartTotal(productTotPrice, false);
  updateCartCount(true, -productQuantity);
  undo.classList.add("visible");

  undoTimeoutId = setTimeout(function () {
    undo.classList.remove("visible");
    var deletedItem = cartList.querySelector(".deleted");
    if (deletedItem) deletedItem.style.display = "none";
  }, 8000);

  maintainLocalStorage();
  console.log("local Storage from remove function is called");
}

function quickUpdateCart() {
  var quantity = 0;
  var price    = 0;

  var items = cartList.querySelectorAll("li:not(.deleted)");
  items.forEach(function (item) {
    var singleQuantity = Number(item.querySelector("select").value);
    quantity += singleQuantity;
    price    += singleQuantity * Number(item.querySelector(".price").textContent.replace("$", ""));
    console.log("Hi Megha " + price);
  });

  cartTotal.textContent = price.toFixed(2);
  var countLis = cartCount.querySelectorAll("li");
  countLis[0].textContent = quantity;
  countLis[1].textContent = quantity + 1;
}

function updateCartCount(emptyCart, quantity) {
  var countLis = cartCount.querySelectorAll("li");

  if (typeof quantity === "undefined") {
    var actual = Number(countLis[0].textContent) + 1;
    var next   = actual + 1;

    if (emptyCart) {
      countLis[0].textContent = actual;
      countLis[1].textContent = next;
    } else {
      cartCount.classList.add("update-count");

      setTimeout(function () { countLis[0].textContent = actual; }, 150);
      setTimeout(function () { cartCount.classList.remove("update-count"); }, 200);
      setTimeout(function () { countLis[1].textContent = next; }, 230);
    }
  } else {
    var actual = Number(countLis[0].textContent) + quantity;
    var next   = actual + 1;
    countLis[0].textContent = actual;
    countLis[1].textContent = next;
  }
}

function maintainLocalStorage() {
  console.log("local storage is called");

  var arr        = [];
  var cartListEl = document.querySelector("#addedItems > ul");

  var saveCartValues = cartListEl ? cartListEl.innerHTML : "";
  var productLinks   = cartListEl
    ? cartListEl.querySelectorAll("li:not(.deleted) .product-details > h3 > a")
    : [];

  productLinks.forEach(function (link) {
    arr.push(link.textContent);
  });

  var cartTotalEl  = document.getElementById("checkout");
  var cartTotalVal = cartTotalEl ? cartTotalEl.textContent : "";

  localStorage.setItem("saveCartValues", saveCartValues);
  localStorage.setItem("cartTotal", cartTotalVal);
  localStorage.setItem("cartItemName", arr.join(","));

  console.log(cartTotalVal);
  console.log(saveCartValues);
}

function updateCartTotal(price, bool) {
  console.log("total cost in cart:", cartTotal.textContent);
  console.log("price:", price);
  var current = Number(cartTotal.textContent);
  cartTotal.textContent = bool
    ? (current + Number(price)).toFixed(2)
    : (current - Number(price)).toFixed(2);
}

// ─── Checkout Button ──────────────────────────────────────────────────────────

["#checkout", "#checkoutBtn"].forEach(function (selector) {
  var el = document.querySelector(selector);
  if (el) {
    el.addEventListener("click", function () {
      console.log("checkout btn clicked");
      maintainLocalStorage();
    });
  }
});
