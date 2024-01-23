window.addEventListener("load", () => {
  document.querySelector(".js-preloader").classList.add("loaded");
  document.querySelector(".js-preloader").addEventListener("transitionend", () => {
    document.querySelector(".js-preloader").style.display = "none";
    AOS.init({ duration: 1200, easing: 'ease-in-out-cubic', once: true });
  });
});

function headerMenu() {
  const toggler = document.querySelector(".js-header-toggler");
  const menu = document.querySelector(".js-header-menu");
  toggler.addEventListener("click", () => {
    menu.classList.toggle("open");
    toggler.classList.toggle("active");
  });

  menu.querySelectorAll("li a").forEach((item) => {
    item.addEventListener("click", () => {
      if (window.innerWidth <= 991) {
        menu.classList.remove("open");
        toggler.classList.remove("active");
      }
    });
  });
}
headerMenu();

document.querySelectorAll('.about-filter .filter-item').forEach(item => {
  item.addEventListener('click', (e) => {
    e.preventDefault();
    const sectionIdToShow = item.getAttribute('href');
    document.querySelectorAll('.content-section').forEach(section => {
      section.classList.remove('active');
      section.style.display = 'none';
    });

    const sectionToShow = document.querySelector(sectionIdToShow);
    if (sectionToShow) {
      sectionToShow.classList.add('active');
      sectionToShow.style.display = 'block';
    }
    
    document.querySelectorAll('.about-filter .filter-item').forEach(filter => {
      filter.classList.remove('active');
    });
    item.classList.add('active');
  });
});

document.addEventListener('DOMContentLoaded', () => {
  const aboutSection = document.getElementById('about');
  const aboutFilterItem = document.querySelector('.about-filter .filter-item[href="#about"]');
  if (aboutSection && aboutFilterItem) {
    aboutSection.classList.add('active');
    aboutSection.style.display = 'block';
    aboutFilterItem.classList.add('active');
  }

  // Countdown functionality
  const countdownElement = document.querySelector('.loader-countdown');
  let countdown = 3; // Start countdown from 3

  // Function to update the countdown
  function updateCountdown() {
    if (countdown === 0) {
      // Hide loader and show screenshots here
      // For example: document.querySelector('.pp-img').src = 'path_to_your_screenshot.jpg';
    } else {
      countdownElement.innerText = countdown;
      countdown--;
      setTimeout(updateCountdown, 1000);
    }
  }

  // Start the countdown
  setTimeout(updateCountdown, 1000);
});


(() => {
  const filterContainer = document.querySelector(".portfolio-filter"),
    portfolioItemsContainer = document.querySelector(".portfolio-items"),
    portfolioItems = document.querySelectorAll(".portfolio-item"),
    popup = document.querySelector(".portfolio-popup"),
    prevBtn = popup.querySelector(".pp-prev"),
    nextBtn = popup.querySelector(".pp-next"),
    closeBtn = popup.querySelector(".pp-close"),
    projectDetailsContainer = popup.querySelector(".pp-details"),
    projectDetailsBtn = popup.querySelector(".pp-project-details-btn");
  let itemIndex, slideIndex, screenshots;

  filterContainer.addEventListener("click", (event) => {
    if (event.target.classList.contains("filter-item") && !event.target.classList.contains("active")) {
      filterContainer.querySelector(".active").classList.remove("outer-shadow", "active");
      event.target.classList.add("active", "outer-shadow");
      const target = event.target.getAttribute("data-target");
      portfolioItems.forEach((item) => {
        if (target === item.getAttribute("data-category") || target === 'all') {
          item.classList.remove("hide");
          item.classList.add("show");
        } else {
          item.classList.remove("show");
          item.classList.add("hide");
        }
      });
    }
  });

  portfolioItemsContainer.addEventListener("click", (event) => {
    if (event.target.closest(".portfolio-item-inner")) {
      const portfolioItem = event.target.closest(".portfolio-item-inner").parentElement;
      itemIndex = Array.from(portfolioItem.parentElement.children).indexOf(portfolioItem);
      screenshots = portfolioItem.querySelector(".portfolio-item-img img").getAttribute("data-screenshots").split(",");
      preloadScreenshots(screenshots); 
      slideIndex = 0;
      popupToggle();
      popupSlideshow();
      document.querySelector('.loader-countdown').style.display = 'block';
      document.querySelector('.pp-loader').classList.add('active');
      startCountdown();
    }
  });


  function startCountdown() {
    const countdownElement = document.querySelector('.loader-countdown');
    let countdown = 3; // Start countdown from 3
  
    function updateCountdown() {
      countdownElement.innerText = countdown;
      if (countdown > 1) {
        countdown--;
        setTimeout(updateCountdown, 1000); // Wait 1 second before updating the countdown
      } else {
        countdownElement.style.display = 'none'; // Hide countdown
        popupSlideshow(); // Show the screenshot
      }
    }
    updateCountdown(); // Start the countdown
  }
  function preloadScreenshots(screenshots) {
    // Enhance the preloading logic for better performance
    screenshots.forEach(src => {
      const img = new Image();
      img.src = src;
      img.onload = () => console.log("Image preloaded: " + src);
      img.onerror = () => console.error("Failed to preload image: " + src);
      img.loading = "lazy";
    });
  }


  function popupToggle() {
    popup.classList.toggle("open");
    if (popup.classList.contains("open")) {
      document.body.style.overflow = "hidden";
      popup.scrollTo(0, 0);
      closeBtn.style.display = "block";
    } else {
      document.body.style.overflow = "";
    }
  }

  function popupSlideshow() {
    const imgSrc = screenshots[slideIndex];
    const popupImg = popup.querySelector(".pp-img");
    popupImg.style.display = "none";
  
    // Hide buttons initially
    projectDetailsBtn.style.display = "none";
    closeBtn.style.display = "none";
    prevBtn.style.display = "none";
    nextBtn.style.display = "none";
  
    const img = new Image();
    img.onload = () => {
      popup.querySelector(".pp-loader").classList.remove("active");
      popupImg.src = imgSrc;
      popupImg.style.display = "block";
  
      // Show buttons immediately after the image has loaded
      if (portfolioItems[itemIndex].querySelector(".portfolio-item-details")) {
        projectDetailsBtn.style.display = "block";
        const details = portfolioItems[itemIndex].querySelector(".portfolio-item-details").innerHTML;
        popup.querySelector(".pp-project-details").innerHTML = details;
      }
      closeBtn.style.display = "block";
  
      // Show prev and next buttons only if there are multiple screenshots
      if (screenshots.length > 1) {
        prevBtn.style.display = "block";
        nextBtn.style.display = "block";
      }
  
      updatePopupControls();
    };
    img.src = imgSrc;
  }
  

  function updatePopupControls() {
    popup.querySelector(".pp-counter").innerHTML = (slideIndex + 1) + " of " + screenshots.length;
    prevBtn.style.display = screenshots.length > 1 ? "block" : "none";
    nextBtn.style.display = screenshots.length > 1 ? "block" : "none";
    const title = portfolioItems[itemIndex].querySelector(".portfolio-item-title").innerHTML;
    popup.querySelector(".pp-title h2").innerHTML = title;
    const category = portfolioItems[itemIndex].getAttribute("data-category");
    popup.querySelector(".pp-project-category").innerHTML = category.split("-").join(" ");
  }

  nextBtn.addEventListener("click", () => {
    slideIndex = (slideIndex + 1) % screenshots.length;
    popupSlideshow();
  });

  prevBtn.addEventListener("click", () => {
    slideIndex = (slideIndex - 1 + screenshots.length) % screenshots.length;
    popupSlideshow();
  });

  projectDetailsBtn.addEventListener("click", () => {
    popupDetailsToggle();
  });

  function popupDetailsToggle() {
    if (projectDetailsContainer.classList.contains("active")) {
      projectDetailsBtn.querySelector("i").classList.remove("fa-minus");
      projectDetailsBtn.querySelector("i").classList.add("fa-plus");
      projectDetailsContainer.classList.remove("active");
      projectDetailsContainer.style.maxHeight = 0;
    } else {
      projectDetailsBtn.querySelector("i").classList.remove("fa-plus");
      projectDetailsBtn.querySelector("i").classList.add("fa-minus");
      projectDetailsContainer.classList.add("active");
      projectDetailsContainer.style.maxHeight = projectDetailsContainer.scrollHeight + "px";
      popup.scrollTo(0, projectDetailsContainer.offsetTop);
    }
  }

  closeBtn.addEventListener("click", () => {
    popupToggle();
    if (projectDetailsContainer.classList.contains("active")) {
      popupDetailsToggle();
    }
  });
})();
