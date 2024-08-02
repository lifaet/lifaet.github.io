/*======================================
 Site Header
 ======================================*/
$(document).ready(function () {
    // Function to handle click events
    function handleClick(e) {
        if ($(e.target).is('.header-main-menu a, .home-buttons a')) {
            $('.header-main-menu li a').removeClass('active');
            $(this).addClass('active');
            $(".sub-page").hide();
            if (location.pathname.replace(/^\//, '') == e.target.pathname.replace(/^\//, '') && location.hostname == e.target.hostname) {
                // Get the hash without the query string
                var hash = e.target.hash.split('?')[0];
                var target = $(hash);
                target = target.length ? target : $('[name=' + hash.slice(1) + ']');
                if (target.length) {
                    var gap = 0;
                    $(hash, 'html', 'body').animate({
                        opacity: 'show',
                        duration: "slow",
                        scrollTop: target.offset().top - gap
                    });
                }
            }
            if ($(e.target).is('.home-buttons a')) {
                $("#header-main-menu li a[href='#contact']").addClass('active');
            }
        }
    }

    // Attach the click event handler
    $('#header-main-menu li a, .home-buttons a').on("click", handleClick);

    // Call the click event handler for the current hash
    var hash = window.location.hash;
    if (hash) {
        // Get the hash without the query string
        hash = hash.split('?')[0];
        handleClick({
            target: $('.header-main-menu a[href="' + hash + '"], .home-buttons a[href="' + hash + '"]')[0]
        });
    }
});

/*======================================
 Contact Form Header
 ======================================*/
const gScript = `https://script.google.com/macros/s/`
const idx = `AKfycbwTnO3lXBe1RyfMECfWA4i-Z`
const sId = idx + `3dSgHApZGgJYHGkXkQNrEwJM1feXgOGz7HTuSTLm6Xggg`
document.getElementById("contact-form").addEventListener("submit", function (e) {
    e.preventDefault(); // Prevent the default form submission
    document.getElementById("show_contact_msg").textContent = "Submitting..";
    document.getElementById("show_contact_msg").style.display = "block";
    document.getElementById("submit-button").disabled = true;

    // Collect the form data
    var formData = new FormData(this);
    var keyValuePairs = [];
    for (var pair of formData.entries()) {
        keyValuePairs.push(pair[0] + "=" + pair[1]);
    }

    var formDataString = keyValuePairs.join("&");

    // Send a POST request to your Google Apps Script
    fetch(
        gScript + sId + "/exec",
        {
            redirect: "follow",
            method: "POST",
            body: formDataString,
            headers: {
                "Content-Type": "text/plain;charset=utf-8",
            },
        }
    )
        .then(function (response) {
            // Check if the request was successful
            if (response) {
                return response; // Assuming your script returns JSON response
            } else {
                throw new Error("Failed to submit the form.");
            }
        })
        .then(function (data) {
            // Display a success message
            document.getElementById("show_contact_msg").textContent =
                "Message Send successfully!";
            document.getElementById("show_contact_msg").style.display = "block";
            document.getElementById("show_contact_msg").style.backgroundColor = "green";
            document.getElementById("show_contact_msg").style.color = "beige";
            document.getElementById("submit-button").disabled = false;
            document.getElementById("contact-form").reset();

            setTimeout(function () {
                document.getElementById("show_contact_msg").textContent = "";
                document.getElementById("show_contact_msg").style.display = "none";
            }, 2600);
        })
        .catch(function (error) {
            // Handle errors, you can display an error message here
            console.error(error);
            document.getElementById("show_contact_msg").textContent =
                "Error Occurred! Try Again.";
            document.getElementById("show_contact_msg").style.display = "block";
        });
});

/*======================================
cv Form Header
======================================*/
document.getElementById("cv-form").addEventListener("submit", function (e) {
    e.preventDefault(); // Prevent the default form submission
    document.getElementById("show_cv_msg").textContent = "Saving Info...";
    document.getElementById("show_cv_msg").style.display = "block";
    document.getElementById("cv-submit-button").disabled = true;

    // Collect the form data
    var formData = new FormData(this);
    var keyValuePairs = [];
    for (var pair of formData.entries()) {
        keyValuePairs.push(pair[0] + "=" + pair[1]);
    }

    var formDataString = keyValuePairs.join("&");

    // Send a POST request to your Google Apps Script
    fetch(
        gScript + sId + "/exec",
        {
            redirect: "follow",
            method: "POST",
            body: formDataString,
            headers: {
                "Content-Type": "text/plain;charset=utf-8",
            },
        }
    )
        .then(function (response) {
            // Check if the request was successful
            if (response) {
                return response; // Assuming your script returns JSON response
            } else {
                throw new Error("Failed to submit the form.");
            }
        })
        .then(function (data) {
            // Display a success message
            document.getElementById("show_cv_msg").textContent =
                "Information Recorded. Loading CV...";
            document.getElementById("show_cv_msg").style.display = "block";
            document.getElementById("show_cv_msg").style.backgroundColor = "green";
            document.getElementById("show_cv_msg").style.color = "beige";
            document.getElementById("cv-submit-button").disabled = false;
            document.getElementById("cv-form").reset();

            setTimeout(function () {
                document.getElementById("show_cv_msg").textContent = "";
                document.getElementById("show_cv_msg").style.display = "none";
                window.location.href = `https://cv.lifaet.workers.dev/?cv=${grm()}`
            }, 2600);
        })
        .catch(function (error) {
            // Handle errors, you can display an error message here
            console.error(error);
            document.getElementById("show_cv_msg").textContent =
                "Newtork Error! Try Again.";
            document.getElementById("show_cv_msg").style.display = "block";
        });
});

/*************************
 Responsive Menu
 *************************/
$('.responsive-icon').on("click", function (e) {
    e.preventDefault();
    e.stopPropagation();
    if (!$(this).hasClass('active')) {
        $(this).addClass('active');
        $('.header').animate({ 'margin-left': 285 }, 300);
    } else {
        $(this).removeClass('active');
        $('.header').animate({ 'margin-left': 0 }, 300);
    }
    return false;
});

$('.header a').on("click", function (e) {
    $('.responsive-icon').removeClass('active');
    $('.header').animate({ 'margin-left': 0 }, 300);

});
/*======================================
 Typing Text
 ======================================*/
$(".typed").typed({
    stringsElement: $('.typed-strings'),
    typeSpeed: 20,
    backDelay: 500,
    loop: true,
    autoplay: true,
    autoplayTimeout: 500,
    contentType: 'html',
    loopCount: true,
    resetCallback: function () {
        newTyped();
    }
});

/*======================================
 Text rotation
 ======================================*/
$('.text-rotation').owlCarousel({
    dots: !1,
    nav: !1,
    margin: 0,
    items: 1,
    autoplay: true,
    autoplayHoverPause: !1,
    autoplayTimeout: 1000,
    loop: true,
    animateOut: 'zoomOut',
    animateIn: 'zoomIn'
});

/*======================================
 Portfolio Filter
 ======================================*/
$(function () {
    var selectedClass = "";
    $(".filter-tabs").find('button:first-child').addClass('active-filter');
    $(".fil-cat").click(function () {
        $(".filter-tabs").find('button').removeClass('active-filter');
        $(this).addClass('active-filter');
        selectedClass = $(this).attr("data-rel");
        $("#portfolio-page").fadeTo(100, 0.1);
        $("#portfolio-page .portfolio-item").not("." + selectedClass).fadeOut().removeClass('portfolio-item');
        setTimeout(function () {
            $("." + selectedClass).fadeIn().addClass('portfolio-item');
            $("#portfolio-page").fadeTo(300, 1);
        }, 300);

    });
});

/*======================================
 LightBox
 ======================================*/
$('[data-rel^=lightcase]').lightcase({
    maxWidth: 1100,
    maxHeight: 800
});


/*======================================
 WOW Animation
 ======================================*/
new WOW().init();

$(".dark-mode").on("click", function (e) {
    $("body").addClass("darkMode");
});

/*======================================
 Preloader
 ======================================*/
$('#preloader').fadeOut('slow', function () {
    $(this).remove();
});

/*======================================
      Projet dom paint///
     ======================================*/
const projetDom = document.getElementById("project-dom");
const projectsData =
    [
        {
            "name": "Keylogger Surveillance System ",
            "details": "Keylogger Surveillance System is a type of surveillance technology used to monitor and record each keystroke and DNS query made by a system on a specific computer. It can upload real-time data to an FTP server and provides a secure local and online web console as an interface for viewing and analyzing log files.",
            "image": "images/portfolio/1.jpg",
            "link": "https://github.com/lifaet/Keylogger-Surveillance-System",
            "cat": "software"
        },
        {
            "name": "WALL-E Junior",
            "details": "WALL·E Junior is a simple object following robot. It can detect object in front of it and can follow the object.",
            "image": "images/portfolio/2.jpg",
            "link": "https://github.com/lifaet/WALL-E-Junior",
            "cat": "hardware"
        },
        {
            "name": "MoviesBay",
            "details": "This project was a movie download website. Developed based on HTML,BOOTSTRAP,CSS,JAVASCRIPT and database integration.",
            "image": "images/portfolio/3.jpg",
            "link": "https://moviesbay.pages.dev",
            "cat": "website"
        }, {
            "name": "Optical Communication ",
            "details": "Optical-Communication simply Li-Fi communication (Light Fidelity) is an advanced technology that allows transferring data using optical communication such as visible light.",
            "image": "images/portfolio/4.jpg",
            "link": "https://github.com/lifaet/Optical-Communication",
            "cat": "hardware"
        },
        {
            "name": "RC Surveillance Car ",
            "details": "The aim of this project is to design and build a remote-controlled surveillance camera car using a ESP32 module, car kit, Motor driver module.",
            "image": "images/portfolio/5.jpg",
            "link": "https://github.com/lifaet/RC-Surveillance-Car",
            "cat": "hardware"
        },
        {
            "name": "Rotten Food Detection System",
            "details": "\"Rotten Food Detection System\" is an innovative system based on Arduino and gas sensors, designed to detect and alert users about food spoilage, ensuring food safety and reducing waste.",
            "image": "images/portfolio/6.jpg",
            "link": "https://github.com/lifaet/Rotten-Food-Detection-System",
            "cat": "hardware"
        },
        {
            "name": "Auto Toll Collection System",
            "details": "The \"Auto Toll Collection System using RFID\" is an automated, efficient, and cashless system for toll collection on highways. It uses Radio Frequency Identification (RFID) technology to identify vehicles and deduct toll charges, reducing congestion and travel time.",
            "image": "images/portfolio/7.jpg",
            "link": "https://github.com/lifaet/Auto-Toll-Collection-System",
            "cat": "hardware"
        },
        {
            "name": "Harinakundu Mobile House",
            "details": "Website for a mobile and accessories shop. Whose sells bus ticket also. This website also can show available seats live.",
            "image": "images/portfolio/8.jpg",
            "link": "https://hmhc.pages.dev/",
            "cat": "website"
        },
        {
            "name": "Solar Tracker",
            "details": "The \"Solar Tracker using LDR and Arduino\" is an intelligent system that uses Light Dependent Resistors (LDRs) and Arduino to track the sun's position. It adjusts the orientation of solar panels to maximize solar energy absorption, enhancing the efficiency of solar power generation.",
            "image": "images/portfolio/9.jpg",
            "link": "https://github.com/lifaet/Solar-Tracker",
            "cat": "hardware"
        },
        {
            "name": "Flowers Shop",
            "details": "A website For a local flowers shop.",
            "image": "images/portfolio/10.jpg",
            "link": "https://lifaet.github.io/wd4-flowers-shop/",
            "cat": "website"
        },
        {
            "name": "Grufolio",
            "details": "Basic portfolio website for individual.",
            "image": "images/portfolio/11.jpg",
            "link": "https://lifaet.github.io/wd2-grufolio/",
            "cat": "website"
        },
        {
            "name": "Brothers Association",
            "details": "A website For local Organization Based on bootstrap.",
            "image": "images/portfolio/12.jpg",
            "link": "https://lifaet.github.io/wd1-brothers-association/",
            "cat": "website"
        },
        {
            "name": "PIR Security Alarm",
            "details": "Security Alarm for restricted area.",
            "image": "images/portfolio/13.jpg",
            "link": "https://github.com/lifaet/PIR-Security-Alarm",
            "cat": "hardware"
        },
        {
            "name": "Object Detection",
            "details": "Object detection and identification for live camera feed or videos.",
            "image": "images/portfolio/14.jpg",
            "link": "https://github.com/lifaet/Object-Detection",
            "cat": "software"
        }
    ]
projectsData.map(data => {
    const dom = `
    <div
    class="col-lg-6 col-md-6 col-sm-12 col-xs-12 portfolio-item branding ${data.cat} all">
    <div class="portfolio-img">
        <img src="${data.image}" class="img-responsive"
            alt="">
    </div>
    <div class="portfolio-data">
        <h4><a href="${data.link}">${data.name}</a></h4>
        <p class="meta">${data.details}</p>
        <div class="portfolio-attr">
            <a href="${data.link}"><i class="lnr lnr-link"></i></a>
        </div>
    </div>
</div>
    `
    projetDom.innerHTML += dom;
})

/*======================================
     CV Function
     ======================================*/
function grm() {
    const c2v = sId.substring(7, 11);
    const c5w = sId.substring(20, 23);
    const cc = c2v + "4299" + c5w;
    let rt = '';
    for (let i = 0; i < 20; i++) {
        const ri = Math.floor(Math.random() * cc.length);
        rt += cc.charAt(ri);
    }
    return rt;
}