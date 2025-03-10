'use strict';

$(document).ready(function() {
document.addEventListener(adobe.target.event.LIBRARY_LOADED, function(event) {
	console.log('Target Lib Loaded '+new Date().getTime());
	});
	
document.addEventListener(adobe.target.event.REQUEST_START, function(event) {
	console.log('Target Request Started'+new Date().getTime());	});

document.addEventListener(adobe.target.event.REQUEST_FAILED,function(event) {
	console.log('Target Request failed'+new Date().getTime());
	});

document.addEventListener(adobe.target.event.REQUEST_SUCCEEDED,function(event) {
	console.log('Target Request Success '+new Date().getTime());
	});
document.addEventListener(adobe.target.event.CONTENT_RENDERING_START, function(event) {
	console.log('Target Content Rendering Start '+new Date().getTime());
	});


document.addEventListener(adobe.target.event.CONTENT_RENDERING_SUCCEEDED, function(event) {
	console.log('Target Content Rendering succeeded '+new Date().getTime());	
});


document.addEventListener(adobe.target.event.CONTENT_RENDERING_NO_OFFERS, function(event) {
	console.log('Target Content Rendering with no Offers '+new Date().getTime());
	});

document.addEventListener(adobe.target.event.CONTENT_RENDERING_REDIRECT, function(event) {
	console.log('Target Content Rendering redirect '+new Date().getTime());	
});
	});


(function (global) {
    var COUNTER_MAX = 20;
    var TIMEOUT_INTERVAL = 200;
    var at_property = "f6fb5320-92d3-f3f5-36ee-40e7affb6359";
    var tnt_response = '';

    ! function () {
		/*
        window.tt_getCookie = function (t) {
            var e = RegExp(t + "[^;]+").exec(document.cookie);
            return decodeURIComponent(e ? e.toString().replace(/^[^=]+./, "") : "")
        }
        var t = tt_getCookie("MC1"),
            e = tt_getCookie("MSFPC");
        function o(t) {
            return t.split("=")[1].slice(0, 32)
        }
        var n = "";
        if ("" != t) n = o(t);
        else if ("" != e) n = o(e);
        if (n.length > 0) var r = n;
		*/
        if (at_property != "") {
            window.targetPageParams = function () {
                return {
                   
                    "at_property": at_property
                }
            }
        } 

       
    }();

    // ContentSquare functions
    function isEmpty(val) { 
        return (val === undefined || val == null || val.length <= 0) ? true : false;
    } 
        
    function key(obj) {
        return Object.keys(obj).map(function (k) {
            return k + "" + obj[k]; }).join("");
    }
    
    function distinct(arr) {
        var result = arr.reduce(function (acc, e) {
            acc[key(e)] = e;
            return acc;
        }, {});
        
        return Object.keys(result).map(function (k) { return result[k]; });
    }

    document.addEventListener('at-request-succeeded', function (e) {
        tnt_response = (e && e.detail ? e.detail : null);

        if (e.detail.analyticsDetails !== undefined) {
            function checkJSLL() {
                var counter = 0,
                    tt_activityCount,
                    i;

                counter += 1;

                if (typeof global.awa === 'object' && global.awa.isInitialized === true) {
                    //ContentUpdate Event with tnta
                    awa.ct.captureContentUpdate({
                        actionType: "A",
                        behavior: "12",
                        content: JSON.stringify({}),
                        pageTags: {
                            tnta: (tnt_response && tnt_response.analyticsDetails[0]
                                ? tnt_response.analyticsDetails[0].payload.tnta
                                : '')
                        }
                    });

                    if (e.detail.responseTokens !== undefined) {
                        tt_activityCount = e.detail.responseTokens.length;

                        //ContentUpdate Event with Target Friendly names
                        for (i = 0; i < tt_activityCount; i += 1) {
                            awa.ct.captureContentUpdate({
                                actionType: 'A',
                                behavior: '12',
                                content: JSON.stringify({}),
                                pageTags: {
                                    at_activity_name: (tnt_response && tnt_response.responseTokens[i]
                                        ? tnt_response.responseTokens[i]["activity.name"]
                                        : ''),

                                    at_exp_name: (tnt_response && tnt_response.responseTokens[i]
                                        ? tnt_response.responseTokens[i]["experience.name"]
                                        : ''),

                                    at_activity_id: (tnt_response && tnt_response.responseTokens[i]
                                        ? tnt_response.responseTokens[i]["activity.id"]
                                        : ''),

                                    at_exp_id: (tnt_response && tnt_response.responseTokens[i]
                                        ? tnt_response.responseTokens[i]["experience.id"]
                                        : '')
                                }
                            });
                        }
                    }
                } else if (counter <= COUNTER_MAX) {
                    setTimeout(checkJSLL, TIMEOUT_INTERVAL);
                }
            };

            function check1DS() {
                var analytics = global.oneDsAnalytics,
                    counter = 0,
                    tt_activityCount,
                    i;

                counter += 1;

                if (analytics && typeof analytics.isInitialized === 'function') {
                    //ContentUpdate Event with Target Friendly names
                    if (e.detail.responseTokens !== undefined) {
                        tt_activityCount = e.detail.responseTokens.length;   
                    
                        for (i = 0; i < tt_activityCount; i += 1) {
                            analytics.captureContentUpdate({
                                actionType: "A",
                                behavior: "12",
                                content: JSON.stringify({}),
                                pageTags: {
                                    at_activity_name: (tnt_response && tnt_response.responseTokens[i] ? tnt_response.responseTokens[i]["activity.name"] : ''),
                                    at_exp_name: (tnt_response && tnt_response.responseTokens[i] ? tnt_response.responseTokens[i]["experience.name"] : ''),
                                    at_activity_id: (tnt_response && tnt_response.responseTokens[i] ? tnt_response.responseTokens[i]["activity.id"] : ''),
                                    at_exp_id: (tnt_response && tnt_response.responseTokens[i] ? tnt_response.responseTokens[i]["experience.id"] : '')
                                }
                            });
                        }

                        //ContentUpdate Event with tnta
                        analytics.captureContentUpdate({
                            actionType: "A",
                            behavior: "12",
                            content: JSON.stringify({}),
                            pageTags: {
                                tnta: (tnt_response && tnt_response.analyticsDetails[0] ? tnt_response.analyticsDetails[0].payload.tnta : ''), //a4t data payload
                            }
                        });
                    
                        // ttMETA object set for ContentSquare pickup
                        window.ttMETA = typeof(window.ttMETA) != "undefined" ? window.ttMETA : []; var tokens = e.detail.responseTokens; if (isEmpty(tokens)) { return; } var uniqueTokens = distinct(tokens); uniqueTokens.forEach(function(token) { window.ttMETA.push({ 'CampaignName': token["activity.name"], 'CampaignId': token["activity.id"], 'RecipeName': token["experience.name"], 'RecipeId': token["experience.id"], 'OfferId': token["option.id"], 'OfferName': token["option.name"] }); });
                    }
                } else if (counter <= COUNTER_MAX) {
                    setTimeout(check1DS, TIMEOUT_INTERVAL);
                }
            }

            checkJSLL();
            check1DS();
        }
    });
})(window);