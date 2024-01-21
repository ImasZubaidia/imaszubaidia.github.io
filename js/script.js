window.addEventListener("load", () => {
  const preloader = document.querySelector(".js-preloader");
  preloader.classList.add("loaded");
  preloader.addEventListener("transitionend", () => {
    preloader.style.display = "none";
  });

  AOS.init({ duration: 1200, easing: 'ease-in-out-cubic', once: true });
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
    const portfolioItemInner = event.target.closest(".portfolio-item-inner");
    if (portfolioItemInner) {
      const portfolioItem = portfolioItemInner.parentElement;
      itemIndex = Array.from(portfolioItem.parentElement.children).indexOf(portfolioItem);
      const img = portfolioItem.querySelector(".portfolio-item-img img");
      if (img) {
        screenshots = img.getAttribute("data-screenshots").split(",");
        slideIndex = 0;
        popupToggle();
        popupSlideshow();
        popupDetails();
      }
    }
  });

  closeBtn.addEventListener("click", () => {
    popupToggle();
    if (projectDetailsContainer.classList.contains("active")) {
      popupDetailsToggle();
    }
  });

  function popupToggle() {
    popup.classList.toggle("open");
    if (popup.classList.contains("open")) {
      document.body.style.overflow = "hidden";
      popup.scrollTo(0, 0);
    } else {
      document.body.style.overflow = "";
    }
  }

  function popupSlideshow() {
    const imgSrc = screenshots[slideIndex];
    const popupImg = popup.querySelector(".pp-img");
    popupImg.style.display = "none";
    prevBtn.style.display = "none";
    nextBtn.style.display = "none";
    projectDetailsBtn.style.display = "none";
    popup.querySelector(".pp-counter").style.display = "none";
    popup.querySelector(".pp-loader").classList.add("active");

    if (!popupImg.getAttribute("src") || popupImg.getAttribute("src") !== imgSrc) {
      const img = new Image();
      img.onload = () => {
        popup.querySelector(".pp-loader").classList.remove("active");
        popupImg.style.display = "block";
        popupImg.src = imgSrc;
        updatePopupControls();
      };
      img.src = imgSrc;
    } else {
      updatePopupControls();
    }
  }

  function updatePopupControls() {
    popup.querySelector(".pp-counter").innerHTML = (slideIndex + 1) + " of " + screenshots.length;
    popup.querySelector(".pp-counter").style.display = "block";
    prevBtn.style.display = slideIndex > 0 ? "block" : "none";
    nextBtn.style.display = slideIndex < screenshots.length - 1 ? "block" : "none";
    if (portfolioItems[itemIndex].querySelector(".portfolio-item-details")) {
      projectDetailsBtn.style.display = "block";
    }
  }

  nextBtn.addEventListener("click", () => {
    if (slideIndex === screenshots.length - 1) {
      slideIndex = 0;
    } else {
      slideIndex++;
    }
    popupSlideshow();
  });

  prevBtn.addEventListener("click", () => {
    if (slideIndex === 0) {
      slideIndex = screenshots.length - 1;
    } else {
      slideIndex--;
    }
    popupSlideshow();
  });

  function popupDetails() {
    if (!portfolioItems[itemIndex].querySelector(".portfolio-item-details")) {
      projectDetailsBtn.style.display = "none";
      return;
    }
    const details = portfolioItems[itemIndex].querySelector(".portfolio-item-details").innerHTML;
    popup.querySelector(".pp-project-details").innerHTML = details;
    const title = portfolioItems[itemIndex].querySelector(".portfolio-item-title").innerHTML;
    popup.querySelector(".pp-title h2").innerHTML = title;
    const category = portfolioItems[itemIndex].getAttribute("data-category");
    popup.querySelector(".pp-project-category").innerHTML = category.split("-").join(" ");
  }

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
})();
