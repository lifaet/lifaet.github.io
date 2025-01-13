/*======================================
 Site Header
 ======================================*/

$(document).ready(function () {
    // Function to handle click events
    function handleClick(event) {
        event.preventDefault(); // Prevent default link behavior
        const target = event.currentTarget; // Use currentTarget to ensure correct element

        console.log('Click event:', target); // Debug log to check click event

        if ($(target).is('.header-main-menu a, .home-buttons a')) {
            $('.header-main-menu li a').removeClass('active');
            $(target).addClass('active');

            if ($(target).is('.header-main-menu a')) {
                $(".sub-page").hide(); // Hide all sections initially
            }

            if (location.pathname.replace(/^\//, '') === target.pathname.replace(/^\//, '') && location.hostname === target.hostname) {
                // Get the hash without the query string
                const hash = target.hash.split('?')[0];
                const targetElement = $(hash);

                if (targetElement.length) {
                    // Show target section without animation and set initial opacity to 0
                    targetElement.css('opacity', 0).show();

                    // Calculate offset for accurate scrolling
                    const offset = targetElement.offset().top;

                    $('html, body').animate({
                        scrollTop: offset
                    }, 250, function () {
                        // Apply fade-in effect after scrolling is done
                        targetElement.animate({ opacity: 1 }, 'slow');
                    });

                    // Update URL without reloading the page
                    if (history.pushState) {
                        history.pushState(null, null, hash);
                    } else {
                        window.location.hash = hash;
                    }
                }
            }

            if ($(target).is('.home-buttons a')) {
                $("#header-main-menu li a[href='#contact']").addClass('active');
            }
        }
    }

    // Attach the click event handler
    $('#header-main-menu li a, .home-buttons a').on("click", handleClick);

    // Call the click event handler for the current hash
    const hash = window.location.hash;
    if (hash) {
        // Get the hash without the query string
        const cleanedHash = hash.split('?')[0];
        handleClick({
            preventDefault: () => { }, // Mock preventDefault method
            currentTarget: document.querySelector(`.header-main-menu a[href="${cleanedHash}"], .home-buttons a[href="${cleanedHash}"]`)
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
const projectDom = document.getElementById("project-dom");
const projectsData =
    [
        {
            "name": "Keylogger Surveillance System",
            "details": "This type of surveillance technology monitors and records each keystroke and DNS query a system makes on a specific computer. It can upload real-time data to an FTP server and provides a secure local and online web console as an interface for viewing and analyzing log files. ",
            "image": "./images/portfolio/1.jpg",
            "link": "https://github.com/lifaet/Keylogger-Surveillance-System",
            "catagory": ["software"]
        },
        {
            "name": "Object Following Robot",
            "details": "It is a simple object-following robot. It can detect an object in front of it and can follow the object.",
            "image": "./images/portfolio/2.jpg",
            "link": "https://github.com/lifaet/WALL-E-Junior",
            "catagory": ["software", "hardware"]
        },
        {
            "name": "MoviesBay",
            "details": "This project was a movie download website. Developed based on HTML, BOOTSTRAP, CSS, JAVASCRIPT, and database integration.",
            "image": "./images/portfolio/3.jpg",
            "link": "https://moviesbay.pages.dev",
            "catagory": ["website"]
        },
        {
            "name": "Optical Communication  ",
            "details": "This demonstrates an advanced technology that transfers data using optical signals.",
            "image": "./images/portfolio/4.jpg",
            "link": "https://github.com/lifaet/Optical-Communication",
            "catagory": ["software", "hardware"]
        },
        {
            "name": "RC Surveillance Car ",
            "details": "he aim of this project is to design and build a remote-controlled surveillance camera car using an ESP32 module, car kit, and Motor driver module.",
            "image": "./images/portfolio/5.jpg",
            "link": "https://github.com/lifaet/RC-Surveillance-Car",
            "catagory": ["software", "hardware"]
        },
        {
            "name": "Rotten Food Detection System",
            "details": "An innovative system based on Arduino and gas sensors, designed to detect and alert users about food spoilage, ensuring food safety and reducing waste. ",
            "image": "./images/portfolio/6.jpg",
            "link": "https://github.com/lifaet/Rotten-Food-Detection-System",
            "catagory": ["software", "hardware"]
        },
        {
            "name": "Automated Toll Collection System",
            "details": "An automated, cashless system using RFID technology to identify vehicles and deduct toll charges.",
            "image": "./images/portfolio/7.jpg",
            "link": "https://github.com/lifaet/Auto-Toll-Collection-System",
            "catagory": ["software", "hardware"]
        },
        {
            "name": "Harinakundu Mobile House",
            "details": "Website for a mobile and accessories shop.",
            "image": "./images/portfolio/8.jpg",
            "link": "https://hmhc.pages.dev",
            "catagory": ["website"]
        },
        {
            "name": "Solar Tracker",
            "details": "It’s a smart system that uses LDRs and Arduino for sun tracking. It adjusts the orientation of solar panels to maximize energy absorption, thereby boosting solar power efficiency. ",
            "image": "./images/portfolio/9.jpg",
            "link": "https://github.com/lifaet/Solar-Tracker",
            "catagory": ["software", "hardware"]
        },
        {
            "name": "Flowers Shop",
            "details": "A website For a local flowers shop",
            "image": "./images/portfolio/10.jpg",
            "link": "https://lifaet.github.io/wd4-flowers-shop",
            "catagory":["website"]
        },
        {
            "name": "Grufolio",
            "details": "Basic portfolio website for individual.",
            "image": "./images/portfolio/11.jpg",
            "link": "https://lifaet.github.io/wd2-grufolio",
            "catagory": ["website"]
        },
        {
            "name": "Brothers Association",
            "details": "A website For local Organization Based on bootstrap.",
            "image": "./images/portfolio/12.jpg",
            "link": "https://lifaet.github.io/wd1-brothers-association",
            "catagory": ["website"]
        },
        {
            "name": "PIR Security Alarm",
            "details": "Security Alarm for restricted area.",
            "image": "./images/portfolio/13.jpg",
            "link": "https://github.com/lifaet/PIR-Security-Alarm",
            "catagory": ["software", "hardware"]
        },
        {
            "name": "Object Detection",
            "details": "Object detection and identification for live camera feed or videos.",
            "image": "./images/portfolio/14.jpg",
            "link": "https://github.com/lifaet/Object-Detection",
            "catagory": ["software"]
        },
        {
            "name": "Work-Rest-Timer",
            "details": "A Balanced Approach to Digital Wellness",
            "image": "./images/portfolio/15.jpg",
            "link": "https://github.com/lifaet/Work-Rest-Timer",
            "catagory": ["software"]
        },
        {
            "name": "Local-FileIndex-Server",
            "details": "Basic application to index and share selected directories of a Windows computer to the local network.",
            "image": "./images/portfolio/16.jpg",
            "link": "https://github.com/lifaet/Local-FileIndex-Server",
            "catagory": ["software"]
        }
    ]

        // Calculate project counts
        // Calculate project counts
        const projectCount = projectsData.length;
        const categoryCounts = projectsData.reduce((counts, project) => {
            project.catagory.forEach(cat => {
                counts[cat] = (counts[cat] || 0) + 1;
            });
            return counts;
        }, {});

        // Update HTML with counts
        document.getElementById("project-count").textContent = projectCount;
        document.getElementById("all-count").textContent = projectCount;
        document.getElementById("website-count").textContent = categoryCounts.website || 0;
        document.getElementById("hardware-count").textContent = categoryCounts.hardware || 0;
        document.getElementById("software-count").textContent = categoryCounts.software || 0;

        // Render projects
        projectsData.forEach(data => {
            const dom = `
                <div class="col-lg-6 col-md-6 col-sm-12 col-xs-12 portfolio-item branding ${data.catagory.join(' ')} all">
                    <div class="portfolio-img">
                        <img src="${data.image}" class="img-responsive" alt="">
                    </div>
                    <div class="portfolio-data">
                        <h4><a href="${data.link}">${data.name}</a></h4>
                        <p class="meta">${data.details}</p>
                        <div class="portfolio-attr">
                            <a href="${data.link}"><i class="lnr lnr-link"></i></a>
                        </div>
                    </div>
                </div>
            `;
            projectDom.innerHTML += dom;
        });
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