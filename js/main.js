


function removeCookie(name) {
    document.cookie = name +'=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';
}

function removeAllCookies() {
    var cookies = document.cookie.split(";");
    cookies.forEach(function (cookie) {
        removeCookie(cookie.split("=")[0]);
    });
}

var midEl = document.querySelector(".mid");
var uuidEl = document.querySelector(".uuid");
var btnGive = document.querySelector(".btnGive");
var btnDeny = document.querySelector(".btnDeny");
var btnGetMid = document.querySelector(".btnGetMid");
var btnGetUuid = document.querySelector(".btnGetUuid");
var loading = document.querySelector(".loading");
var btnDeleteCookies = document.querySelector(".btnDeleteCookies");
var btnGlobalUI = document.querySelector(".btnGlobalUI");
var btnWizardUI = document.querySelector(".btnWizardUI");
var btnMultipleUI = document.querySelector(".btnMultipleUI");
var btnIabUI = document.querySelector(".btnIabUI");
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

!!btnIabUI && btnIabUI.addEventListener("click", function () {
    showConsentUI(document.querySelector(".iab-standard"));
});



function makeConsentAction(action) {
    return function () {
        adobe.optIn[action === "approve" ? "approveAll" : "denyAll"]();
        //consent[action](JSON.stringify(adobe.optIn.permissions));
    };
}

// var dil = DIL.create({
//    partner: "gdprsummit",
//    visitorService: {
//        namespace: "65453EA95A70434F0A495D34@AdobeOrg"
//    }
// });

btnGive.addEventListener("click", makeConsentAction("approve"));
btnDeny.addEventListener("click", makeConsentAction("deny"));

!!btnGetMid && btnGetMid.addEventListener("click", function () {
    if (!adobe.optIn.isApproved("ecid")) {
        midEl.innerHTML = "MID cannot be retrieved. Visitor is waiting for Opt In";
        return;
    }

    visitor.getMarketingCloudVisitorID(function (mid) {
        midEl.innerHTML = mid;
    }, true);
});

!!btnGetUuid && btnGetUuid.addEventListener("click", function () {
    if (!adobe.optIn.isApproved("aam")) {
        uuidEl.innerHTML = "UUID cannot be retrieved. DIL is waiting for Opt In";
        return;
    }

    dil.api.afterResult(function(json) {
        uuidEl.innerHTML = json.uuid;
    }).submit();
});

// Wizard
var btnAgreeOne = document.querySelector(".btnAgreeOne");
var btnAgreeTwo = document.querySelector(".btnAgreeTwo");
var btnAgreeThree = document.querySelector(".btnAgreeThree");
var btnAgreeFour = document.querySelector(".btnAgreeFour");

var btnDenyOne = document.querySelector(".btnDenyOne");
var btnDenyTwo = document.querySelector(".btnDenyTwo");
var btnDenyThree = document.querySelector(".btnDenyThree");
var btnDenyFour = document.querySelector(".btnDenyFour");

var btnWizard = document.querySelector(".btnWizard");
var screen1 = document.querySelector(".screen1");
var screen2 = document.querySelector(".screen2");
var screen3 = document.querySelector(".screen3");
var screen4 = document.querySelector(".screen4");
var screen99 = document.querySelector(".screen99");
var shouldWaitForComplete = true;

function makeWizard(action) {
    return function wizard(category, screenToHide, screenToShow) {
        //consent.deny();
        screenToHide.style.display = "none";
        screenToShow.style.display = "block";
        adobe.optIn[action](category, shouldWaitForComplete);
    };
}

var approvalWizard = makeWizard("approve");
var denialWizard = makeWizard("deny");

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
    //consent.approve(JSON.stringify(adobe.optIn.permissions));
});

// Multiple
var btnSubmitPermissions = document.querySelector(".btnSubmitPermissions");

btnSubmitPermissions.addEventListener("click", function (ev) {
    //consent.deny();
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
        //consent.approve(JSON.stringify(adobe.optIn.permissions));
        loading.style.visibility = "hidden";
    }, 1000);
});



jQuery(document).ready(function($){	


	

	
		var loginStatus;
		var userType;
		var userCRMId;
		var emailValidation;
		var validEmails=[]
		
		
	$("#id01 .modalLogin").on('click', function()
	{
		console.log("login button is clicked");
		emailValidation=ValidateEmail(document.getElementById("email").value);
		
		if(emailValidation)
		{
		console.log("Email validation is suucessful");
		cookiecall();
		loginStatus="Logged In";
		userType="Member";
		localStorage.setItem('loginStatus',loginStatus);
		localStorage.setItem('userType', userType);
		}
	});
	
			//validate Email address
	
	function ValidateEmail(inputText)
		{
			console.log("Email address is " +inputText);
			validEmails=["ankit.r.agarwal@accenture.com","amish.arora@accenture.com","shikha.s.chauhan@accenture.com","ishan.chopra@accenture.com","apurvi.gulati@accenture.com","silky.jain@accenture.com","akshay.a.kapil@accenture.com", "anjali.khera@accenture.com","bhawna.kumar@accenture.com","munayan.ray@accenture.com","priyanka.b.saxena@accenture.com","dhananjay.c.sharma@accenture.com","shivani.o.singh@accenture.com","ambika.tewari@accenture.com","nabendu.varma@accenture.com","demoofficialpoc@gmail.com"]
			
		var val=validEmails.indexOf(inputText);
		if(val!==-1)
		{
		return true;
		
		}
		else
		{
		alert("You have entered an invalid email address!");
		return false;
		}
		}
	
	
	
	window.onload = function()
	{
		console.log("window is not completely loaded");
		if(localStorage.getItem("userCRMId")!==null)
		{
		$("#navbarResponsive .login").css({"display":"none"});
		console.log("login btn is hidden now");
		$("#navbarResponsive .logout").css({"display":"block"});
		}
		if(localStorage.getItem("userCRMId")===null)
		{
			loginStatus="Not Logged In";
		userType="Anonymous";
		localStorage.setItem('loginStatus',loginStatus);
		localStorage.setItem('userType', userType);	
		$("#navbarResponsive .login").css({"display":"block"});
		console.log("first page load");
		$("#navbarResponsive .logout").css({"display":"none"});
		}
	};   
	
	
	$("#navbarResponsive .logout").on('click', function ()
	{
	    console.log("User is loggedOut");
	    
	    document.cookie=("crmId=" + "null");
		
		loginStatus="Not Logged In";
		userType="Anonymous"
		console.log("User is logged out");				
		$("#navbarResponsive .login").css({"display":"block"});
		console.log("log out btn is hidden now");
		$("#navbarResponsive .logout").css({"display":"none"});
		localStorage.setItem('loginStatus',loginStatus);
		localStorage.setItem('userType', userType);			
		localStorage.removeItem('userCRMId');
		console.log("page is refreshing");
	    location.reload();

	});
	 
	
	function cookiecall(){

    var email = $('#email').val();

    if(email == "ankit.r.agarwal@accenture.com"){ document.cookie=("crmId=" + "112255");}
	else if (email=="amish.arora@accenture.com"){document.cookie= ("crmId="  +"223377");}
	else if (email=="shikha.s.chauhan@accenture.com"){document.cookie= ("crmId="  +"334433");}
	else if (email=="ishan.chopra@accenture.com"){document.cookie= ("crmId="  +"445599");}
	else if (email=="apurvi.gulati@accenture.com"){document.cookie= ("crmId="  +"556688");}
	else if (email=="silky.jain@accenture.com"){document.cookie= ("crmId="  +"667799");}
	else if (email=="akshay.a.kapil@accenture.com"){document.cookie= ("crmId="  +"778888");}
	else if (email=="anjali.khera@accenture.com"){document.cookie= ("crmId="  +"889911");}
	else if (email=="bhawna.kumar@accenture.com"){document.cookie= ("crmId="  +"991122");}
	else if (email=="munayan.ray@accenture.com"){document.cookie= ("crmId="  +"121377");}
	else if (email=="priyanka.b.saxena@accenture.com"){document.cookie= ("crmId="  +"131444");}
	else if (email=="dhananjay.c.sharma@accenture.com"){document.cookie= ("crmId="  +"141522");}
	else if (email=="shivani.o.singh@accenture.com"){document.cookie= ("crmId="  +"151611");}
	else if (email=="ambika.tewari@accenture.com"){document.cookie= ("crmId="  +"171655");}
	else if (email=="nabendu.varma@accenture.com"){document.cookie= ("crmId="  +"181933");}
	else if (email=="demoofficialpoc@gmail.com"){document.cookie= ("crmId="  +"10102020");}
	else{document.cookie=("crmId=" + "null");}
	
	
	function getCook(cookiename) 
			  {
			  var cookiestring=RegExp(cookiename+"=[^;]+").exec(document.cookie);
			  return decodeURIComponent(!!cookiestring ? cookiestring.toString().replace(/^[^=]+./,"") : "");
			  }

			var cookieValue = getCook('crmId');
			localStorage.setItem('userCRMId', cookieValue);
	
	}
	
	
	
	
	var cartWrapper = $('.cd-cart-container');
	//product id - you don't need a counter in your real project but you can use your real product id
	var productId = 0;

	if( cartWrapper.length > 0 ) {
		//store jQuery objects
		var cartBody = cartWrapper.find('.body')
		var cartList = cartBody.find('ul').eq(0);
		var cartTotal = cartWrapper.find('.checkout').find('span');
		var cartTrigger = cartWrapper.children('.cd-cart-trigger');
		var cartCount = cartTrigger.children('.count')
		var addToCartBtn = $('.cd-add-to-cart');
		var undo = cartWrapper.find('.undo');
		var undoTimeoutId;

		//add product to cart
		addToCartBtn.on('click', function(event){
			event.preventDefault();
			addToCart($(this));
		});

		//open/close cart
		cartTrigger.on('click', function(event){
			event.preventDefault();
			toggleCart();
		});

		//close cart when clicking on the .cd-cart-container::before (bg layer)
		cartWrapper.on('click', function(event){
			if( $(event.target).is($(this)) ) toggleCart(true);
		});

		//delete an item from the cart
		cartList.on('click', '.delete-item', function(event){
			event.preventDefault();
			removeProduct($(event.target).parents('.product'));
		});

		//update item quantity
		cartList.on('change', 'select', function(event){
			quickUpdateCart();
		});

		//reinsert item deleted from the cart
		undo.on('click', 'a', function(event){
			clearInterval(undoTimeoutId);
			event.preventDefault();
			cartList.find('.deleted').addClass('undo-deleted').one('webkitAnimationEnd oanimationend msAnimationEnd animationend', function(){
				$(this).off('webkitAnimationEnd oanimationend msAnimationEnd animationend').removeClass('deleted undo-deleted').removeAttr('style');
				quickUpdateCart();
			});
			undo.removeClass('visible');
			maintainLocalStorage();
		});
	}

	function toggleCart(bool) {
		var cartIsOpen = ( typeof bool === 'undefined' ) ? cartWrapper.hasClass('cart-open') : bool;
		
		if( cartIsOpen ) {
			cartWrapper.removeClass('cart-open');
			//reset undo
			clearInterval(undoTimeoutId);
			undo.removeClass('visible');
			cartList.find('.deleted').remove();

			setTimeout(function(){
				cartBody.scrollTop(0);
				//check if cart empty to hide it
				if( Number(cartCount.find('li').eq(0).text()) == 0) cartWrapper.addClass('empty');
			}, 500);
		} else {
			cartWrapper.addClass('cart-open');
		}
	}

	function addToCart(trigger) {
	   
		var cartIsEmpty = cartWrapper.hasClass('empty');
		//update cart product list
		addProduct();
		//update number of items 
		updateCartCount(cartIsEmpty);
		//update total price
		//updateCartTotal(trigger.data('price'), true);
		quickUpdateCart();
		//show cart
		cartWrapper.removeClass('empty');
		//store added values in localstorage
		maintainLocalStorage();
	}

	function addProduct() {console.log("hello1");
		//this is just a product placeholder
		//you should insert an item with the selected product info
		//replace productId, productName, price and url with your real product info
		var description,imgName,title;
		var queryString = new Array();
            if (queryString.length == 0) {
                if (window.location.search.split('?').length > 1) {
                    var params = window.location.search.split('?')[1].split('&');
                    for (var i = 0; i < params.length; i++) {
                        var key = params[i].split('=')[0];
                        var value = decodeURIComponent(params[i].split('=')[1]);
                        queryString[key] = value;
                    }
                }
                else{
                    var title = $('#title').text();
                    var img = $('#imgContainer').attr('src');
                    var priceTag = $('#price').text();
                    var price = priceTag.split(':');
                    var imgName = img.split('/');
                    var queryString = new Array();
                    queryString['title'] = title;
                    queryString['imgName'] = imgName[1];
                    queryString['price'] = $.trim(price[1]);
                }
            }
		productId = productId + 1;
		var productAdded = $('<li class="product"><div class="product-image"><a href="#0" style="font-size:62.5%"><img src="img/' +queryString["imgName"]+'" alt="placeholder"></a></div><div class="product-details"><h3><a href="#0" style="font-size:62.5%">' + queryString["title"] + '</a></h3><span class="price" >' + queryString['price'] + '</span><div class="actions"><a href="#0" class="delete-item" style="font-size:62.5%">Remove</a><div class="quantity" style="font-size:62.5%"><label for="cd-product-'+ productId +'">Qty</label><span class="select"><select style="font-size:75%" id="cd-product-'+ productId +'" name="quantity"><option value="1">1</option><option value="2">2</option><option value="3">3</option><option value="4">4</option><option value="5">5</option><option value="6">6</option><option value="7">7</option><option value="8">8</option><option value="9">9</option></select></span></div></div></div></li>');
		
		console.log("product Added are" +productAdded);
		cartList.prepend(productAdded);
	}

	function removeProduct(product) {
		clearInterval(undoTimeoutId);
		cartList.find('.deleted').remove();
		
		var topPosition = product.offset().top - cartBody.children('ul').offset().top ,
			productQuantity = Number(product.find('.quantity').find('select').val()),
			productTotPrice = Number(product.find('.price').text().replace('$', '')) * productQuantity;
		
		product.css('top', topPosition+'px').addClass('deleted');
console.log("Prdict Total Price " +productTotPrice);
console.log("Product Quantity is " +productQuantity);
		//update items count + total price
		updateCartTotal(productTotPrice, false);
		updateCartCount(true, -productQuantity);
		undo.addClass('visible');

		//wait 8sec before completely remove the item
		undoTimeoutId = setTimeout(function(){
			undo.removeClass('visible');
			cartList.find('.deleted').hide();
		}, 8000);
		// update localstorage on product remove
		maintainLocalStorage();
		
		/*
		if($(".cd-cart-container").hasClass("cart-open"))
			{
			$(".cd-cart-trigger").on('click', function(){
				maintainLocalStorage();
				console.log("cart is closed")});
			}
			*/

		console.log("local Storage from remove function is called");
	}

	function quickUpdateCart() {
		
		var quantity = 0;
		var price = 0;
	
		cartList.children('li:not(.deleted)').each(function(){
			var singleQuantity = Number($(this).find('select').val());
			quantity = quantity + singleQuantity;
			price = price + singleQuantity*Number($(this).find('.price').text().replace('$', ''));
			console.log("Hi Megha" + " " +price );
		});

		cartTotal.text(price.toFixed(2));
		cartCount.find('li').eq(0).text(quantity);
		cartCount.find('li').eq(1).text(quantity+1);
	}

	function updateCartCount(emptyCart, quantity) {
		
		if( typeof quantity === 'undefined' ) {
			var actual = Number(cartCount.find('li').eq(0).text()) + 1;
			var next = actual + 1;
		
			if( emptyCart ) {
				cartCount.find('li').eq(0).text(actual);
				cartCount.find('li').eq(1).text(next);
		
			} else {
				cartCount.addClass('update-count');
    	
				setTimeout(function() {
					cartCount.find('li').eq(0).text(actual);
				}, 150);

				setTimeout(function() {
					cartCount.removeClass('update-count');
				}, 200);

				setTimeout(function() {
					cartCount.find('li').eq(1).text(next);
				}, 230);
			}
		} else {
			var actual = Number(cartCount.find('li').eq(0).text()) + quantity;
			var next = actual + 1;
			cartCount.find('li').eq(0).text(actual);
			cartCount.find('li').eq(1).text(next);
		}
	}
	function maintainLocalStorage(){
		console.log("local storage is called");	
		
		
		
		var arr=[];
		
		var categoryName;
		var saveCartValues = $("#addedItems > ul").html();//old code
		
		var totalItems=$("#addedItems > ul > li").not(".deleted").find(".product-details > h3 > a").length;
		
		//items name in cart
		for(var a=0;a<totalItems;a++)
		{
			var itemNameInCart = $("#addedItems > ul").find(".product-details > h3 > a").eq(a).text();
			console.log(arr.push(itemNameInCart));
			console.log(arr);
		}
		
		var cartTotal = $("#checkout").text();
		localStorage.setItem('saveCartValues', saveCartValues);
		localStorage.setItem('cartTotal', cartTotal);
		localStorage.setItem('cartItemName', arr);
	
		console.log(cartTotal);
		console.log(saveCartValues);
		console.log(itemNameInCart);
	}

	function updateCartTotal(price, bool) {
		console.log("total cost in cart :" +cartTotal);
		console.log("price is :" +price);
		console.log(Number(cartTotal.text()));
				console.log((Number(price)).toFixed(2));
		console.log((Number(cartTotal.text()) + Number(price)).toFixed(2) );
		console.log( (Number(cartTotal.text()) - Number(price)).toFixed(2));
		bool ? cartTotal.text( (Number(cartTotal.text()) + Number(price)).toFixed(2) )  : cartTotal.text( (Number(cartTotal.text()) - Number(price)).toFixed(2) );
	}
	
	
	$("#checkout , #checkoutBtn").on('click', function()
{
	console.log("checkout btn clicked");
	maintainLocalStorage();
})
});


