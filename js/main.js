(function () {
    'use strict';	// this function is strict... prevents use of undeclared variables
    /*globals $:false */		//	prevent jshint from declaring $ as undefined
    console.log ('@ top of JS');
    $ ('body').scrollspy ({target: '.nav'});
    $ ('.nav').on ('click', 'li', function (e) {
        $ ('li').removeClass ("active");         //  remove 'active' class from all links
        $ (this).addClass ("active");            //  restore 'active' class to link clicked
        var pageId = $ (this).textContent;       //  identify the "page"
        $ ('#siteWrapper').removeAttr ('style');
        $ ('#header').removeAttr ('style');
        switch (pageId) {
            case 'about':
                var bkg = "background-color: var(--ablt-bkg-color);";
                break;
            case 'inventory':
                bkg = "background-color: var(--cilt-bkg-color);";
                break;
            case 'contact':
                bkg = "background-color: var(--cnlt-bkg-color);";
                break;
            default:
                bkg = "background-color: var(--hmlt-bkg-color);";
        }
        $ ('#siteWrapper').attr ('style', bkg);
        $ ('#header').attr ('style', bkg);

    });

    $ ('#inventoryContent').on ('click', 'img', function (e) {
        debugger;
        $ ("#inventoryModal").empty ();               //  remove any previous HTML from prior modal
        var i = e.target.id;                          //  id matches "modal-x" where x = numeric index number
        i = parseInt ((i.split ("-")[1]), 10);        //  parse the index out from the class
        var inventoryParms = inventory[i];            //  use the index to pull the modal Parameters from json.js
        //  build modal format
        var modalHTML = '<!-- The Modal -->';
        modalHTML += '<div id="modal-popup">';
        modalHTML += '<button class="close">&times;</button>';
        modalHTML += '<div id="modal-header" class="tablet"><h2>' + inventoryParms.manufacturer + '<small> (' + inventoryParms.product + ')</small></h2></div>';
        modalHTML += '<div id="modal-img"><img class="modal-content" src="' + inventoryParms.priPic + '" alt="' + inventoryParms.caption + '"></div>';
        modalHTML += '<div id="modal-info" class="modal-content">';
        if (inventoryParms.morePics === []) {
            modalHTML += '<div> </div>';
        } else {
            for (var j = 0; j < inventoryParms.morePics.length; j++) {
                modalHTML += '<div><img src="images/' + inventoryParms.morePics[j] + '" alt="modal Pic"></div>';
            }
        }
        modalHTML += '<div>Quantity  : ' + inventoryParms.quantity + '</div>';
        modalHTML += '<div>Available : ' + inventoryParms.available + '</div>';
        modalHTML += '<div>Deadline  : ' + inventoryParms.deadline + '</div>';
        modalHTML += '<div>Quantity  : ' + inventoryParms.quantity + '</div>';
        modalHTML += '<div>Price     : ' + inventoryParms.price + '</div>';
        modalHTML += '<div>Tag line  : ' + inventoryParms.tagLine + '</div>';
        modalHTML += '<div>Decription: ' + inventoryParms.description + '</div>';
        modalHTML += '</div>';
        $ ("#inventoryModal").append (modalHTML);
        $ ("#inventoryModal").show ();
    });
    // build inventory page
    console.log ('@ build inventory page');
    debugger;
    var invHTML = '';
    for (var i = 0; i < inventory.length; i++) {
        invHTML += '<figure id="imgI-' + i + '"><img class="img-responsive cap-top" src="images/' + inventory.priPic + '" alt="' + inventory.caption + '"><figcaption>' + inventory.caption + '</figcaption></figure>';
    }
    invHTML += '<div class="pageDivider"><img class="img-responsive" src="images/dividerSolid.png" alt="divider"></div>';
    $ ("#inventoryContent").empty ();
    $ ("#inventoryContent").append (invHTML);


});