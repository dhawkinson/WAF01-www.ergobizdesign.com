(function () {
    'use strict';	// this function is strict... prevents use of undeclared variables
    /*globals $:false */		//	prevent jshint from declaring $ as undefined

    //  build inventory gallery on load
    //  NOTE: this is dynamic content - currently sourced from JSON (inventorySource)
    //  it will likely change to a dB in the future but will never be sourced from the HTML

    var invHTML = '<div id="inv-gallery" class="row">';     //  row of gallery images (wraps)
    for (var i = 0; i < inventorySource.length; i++) {
        invHTML += '<figure class="thumbnail col-xs-6 col-sm-4 col-md-2"><a href="#imgInv-' + i + '" data-toggle="modal"><img src="images/' + inventorySource[i].priPic + '" class="img-responsive cap-top center-block inventory-item" role="button" data-target="#imgInv-' + i + '" alt="' + inventorySource[i].caption + '"></a><figcaption>' + inventorySource[i].caption + ' Click for details.</figcaption></figure>';
        //invHTML += '<li class="thumbnail col-md-4 col-sm-6"><a href="#imgInv-'+i+'" data-toggle="modal"><img src="images/' + inventorySource[i].priPic + '" class="img-responsive cap-top center-block inventory-item" role="button" data-target="#imgInv-'+i+'" alt="' + inventorySource[i].caption + '"></a><div class="caption">' + inventorySource[i].caption + ' Click for details.</div></li>';
    }
    invHTML += '</div>';                                    //  close the row of gallery images
    invHTML += '<div class="row">';                         //  row with divider
    invHTML += '<img class="col-xs-12 img-responsive" src="images/dividerSolid.png" alt="divider">';
    invHTML += '</div>';                            //  close the divider row
    $ ("#inv-gallery").remove ();                     //  probably not needed because this is load time - just caution
    $ ("#inventory").append (invHTML);               //  append the galery to the page.

    //  end build inventory gallery

    navigationResets ();

    var topoffset = 15;

    //  Activate Scrollspy
    $ ('body').scrollspy ({
        target: '.navbar-fixed-top',
        offset: topoffset
    });

    //  Add in inBody class to nav when scrollspy event fires
    $ ('.navbar-fixed-top').on ('activate.bs.scrollspy', function () {
        navigationResets ()
    });
    //Use smooth scrolling when clicking on navigation
    $ ('.navbar-fixed-top a[href*="#"]:not([href="#"])').click (function () {
        if (location.pathname.replace (/^\//, '') === this.pathname.replace (/^\//, '') && location.hostname === this.hostname) {
            var target = $ (this.hash);
            target = target.length ? target : $ ('[name=' + this.hash.slice (1) + ']');
            if (target.length) {
                $ ('html,body').animate ({
                    scrollTop: target.offset ().top - topoffset + 2
                }, 500);
                return false;
            }                // target.length
        }                    // click function
    });                      // smooth scrolling

    function navigationResets () {
        $ ('.navbar-fixed-top').on ('activate.bs.scrollspy', function () {      //  Clear inBody class to nav on page load
            var hash = $ (this).find ('li.active a').attr ('href');
            var pageBkg = '';
            var headBkg = '';
            if (hash !== '#home') {
                $ ('nav').addClass ('inBody');
                if (hash === '#about') {
                    pageBkg = 'background-color: var(--ablt-bkg-color)';
                    headBkg = 'background-color: var(--abac-bkg-color)';
                } else if (hash === '#inventory') {
                    pageBkg = 'background-color: var(--cilt-bkg-color)';
                    headBkg = 'background-color: var(--ciac-bkg-color)';
                } else {
                    pageBkg = 'background-color: var(--cnlt-bkg-color)';
                    headBkg = 'background-color: var(--cnac-bkg-color)';
                }
            } else {
                $ ('nav').removeClass ('inBody');
                pageBkg = 'background-color: var(--hmlt-bkg-color)';
                headBkg = 'background-color: var(--hmac-bkg-color)';
            }
            $ ('body').attr ('style', pageBkg);                                  //  add page background style to body
            $ ('nav').attr ('style', headBkg);                                   //  add header background style to nav
        });
    }

    $ ('#inv-gallery').on ('click', 'img', function (e) {
        $ ("#inv-modal").remove ();                                             //  remove any previous HTML from prior modal
        debugger;
        var image = e.target.parentElement.hash;                              //  id matches "invImg-x" where x = numeric index number
        var l = image.length;
        image = image.substring (1, l);                                       //  strip the leading hashtag
        var i = parseInt ((image.split ("-")[1]), 10);                         //  parse the index out from the id
        var inventoryParms = inventorySource[i];                              //  use the index to pull the modal Parameters from json.js

        //  build modal format

        var modalHTML = '<div id="' + image + '" class="modal fade" tabindex="-1">';    //  define the modal
        modalHTML += '<div class="modal-dialog modal-md">';                               //  define the modal-dialog

        //      modal header -- contains Mfg Name, Mfg Product Line & 'close' button
        modalHTML += '<div class="modal-header">';
        modalHTML += '<button type="button" class="close" data-dismiss="modal" aria-label="Close">&times;</button>';
        modalHTML += '<h4 class="modal-title" id="modalLabel">' + inventoryParms.manufacturer + ' ' + inventoryParms.product + '</h4>';
        modalHTML += '</div>';                                                                   //  close modal-header

        //      modal body -- contains primary product photo (the image from the gallery) & any (optional) Secondary Pics -- up to 5
        modalHTML += '<div class="modal-body">';
        modalHTML += '<img class="img-responsive primaryPic" src="images/' + inventoryParms.priPic + '" alt="' + inventoryParms.caption + '" style="width: 300px; height: auto; padding: 2em;">';
        if (inventoryParms.morePics.length > 0) {
            modalHTML += '<div class="secContainer">';                                           //  build div for secondary images
            for (var j = 0; j < inventoryParms.morePics.length; j++) {
                modalHTML += '<img class="img-responsive secondaryPic" src="images/' + inventoryParms.morePics[j] + '" alt="modal Pic" style="width: 100px; height: auto; padding: 2em;">';                                                //  include the secondary images
            }
            modalHTML += '</div>';                                                              //  close the secContainer

        }
        modalHTML += '</div>';                                                                  //  close modal-body

        //      modal footer -- contains the inventory particulars (qty, availability, deadline, price, (opt) tag line, description
        modalHTML += '<div class="modal-footer">';
        modalHTML += '<p>Quantity   : ' + inventoryParms.quantity + '</p>';
        modalHTML += '<p>Available  : ' + inventoryParms.available + '</p>';
        modalHTML += '<p>Deadline   : ' + inventoryParms.deadline + '</p>';
        modalHTML += '<p>Price      : ' + inventoryParms.price + '</p>';
        if ((inventoryParms.tagLine !== '') && (inventoryParms.tagLine !== 'undefined')) {
            modalHTML += '<p><strong>Tag line   : ' + inventoryParms.tagLine + '</strong></p>';
        }
        modalHTML += '<div>Description: <span>' + inventoryParms.description + '</span></div>';
        modalHTML += '</div>';                                                                  //  close modal-footer
        modalHTML += '</div>';                                                                  //  close the Modal

        $ ("#inventory").append (modalHTML);

        $ ("#inv-modal").modal ('show');

        //  close modal window

        $ (".close").on ('click', 'btn', function () {
            $ ("#inv-modal").modal ('hide');
        });
    });

} ());