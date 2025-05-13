
window.addEventListener("load", () => {
  /* preloader */ 
  document.querySelector(".js-preloader").classList.add("loaded");
  document.querySelector(".js-preloader .js-bg-item").addEventListener("transitionend", () => {
    document.querySelector(".js-preloader").style.display = "none";
    // INITIALIZE AOS
    AOS.init({
      duration: 1200,
      easing:'ease-in-out-cubic',
      once: true
    });
  })
});


/* header menu */ 

function headerMenu(){
  const toggler = document.querySelector(".js-header-toggler");
  const menu = document.querySelector(".js-header-menu");
  const items = menu.querySelectorAll("li");

  const menuToggle = () => {
   menu.classList.toggle("open");
   toggler.classList.toggle("active");
  }
  toggler.addEventListener("click", menuToggle);

  items.forEach((item) => {
    item.querySelector("a").addEventListener("click", () => {
       if(window.innerWidth <= 991){
         menuToggle();
       }
    });
  });
}
headerMenu();

/* schedule tabs */ 

function scheduleTabs(){
  const tabs = document.querySelectorAll(".js-schedule-tab");

  tabs.forEach((tab) => {
     tab.addEventListener("click", () => {
        if(tab.classList.contains("active")){
         return;
        }
        document.querySelector(".js-schedule-tab.active").classList.remove("active");
        tab.classList.add("active");
        const target = tab.getAttribute("data-target");
        document.querySelector(".js-schedule-table.active").classList.remove("active");
        document.querySelector(target).classList.add("active");
     });
  });
}
scheduleTabs();


// Splitting
Splitting();



function bodyScrollingToggle(){
  document.body.classList.toggle("hidden-scrolling");
}

/*---------------- portfolio filter and popup -------------------*/ 

(() =>{
    
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

    /* filter portfolio items*/
    filterContainer.addEventListener("click", (event)=>{
      if(event.target.classList.contains("filter-item") && 
        !event.target.classList.contains("active")){
         // deactivate existing active 'filter-item'
         filterContainer.querySelector(".active").classList.remove("outer-shadow","active");
         // activate new 'filter item'
         event.target.classList.add("active","outer-shadow");
         const target = event.target.getAttribute("data-target");
         portfolioItems.forEach((item) =>{
          if(target === item.getAttribute("data-category") || target === 'all'){
              item.classList.remove("hide");
              item.classList.add("show");
          }
          else{
              item.classList.remove("show");
              item.classList.add("hide");
          }
         }) 
      }
    })





// Add click event listeners to all filter items
document.querySelectorAll('.about-filter .filter-item').forEach(item => {
  item.addEventListener('click', function(e) {
    e.preventDefault();

    // Get the section ID from the href attribute of the clicked item
    const sectionIdToShow = this.getAttribute('href');

    // Remove 'active' class from all sections
    document.querySelectorAll('.content-section').forEach(section => {
      section.classList.remove('active');
      section.style.display = 'none'; // Hide the section
    });

    // Add 'active' class to the clicked section
    const sectionToShow = document.querySelector(sectionIdToShow);
    if (sectionToShow) {
      sectionToShow.classList.add('active');
      sectionToShow.style.display = 'block'; // Show the section
    }

    // Update 'active' state for navigation items
    document.querySelectorAll('.about-filter .filter-item').forEach(filter => {
      filter.classList.remove('active');
    });
    this.classList.add('active'); // Highlight the clicked navigation item
  });
});

// Show the #about section as default on initial page load
document.addEventListener('DOMContentLoaded', () => {
  const aboutSection = document.getElementById('about');
  const aboutFilterItem = document.querySelector('.about-filter .filter-item[href="#about"]');

  if (aboutSection && aboutFilterItem) {
    aboutSection.classList.add('active');
    aboutSection.style.display = 'block'; // Show the #about section
    aboutFilterItem.classList.add('active'); // Highlight the #about navigation item
  }
});




















portfolioItemsContainer.addEventListener("click", (event) => {
  if(event.target.closest(".portfolio-item-inner")){
      const portfolioItem = event.target.closest(".portfolio-item-inner").parentElement;
      // get the portfolioItem index
      itemIndex = Array.from(portfolioItem.parentElement.children).indexOf(portfolioItem);
      screenshots = portfolioItems[itemIndex].querySelector(".portfolio-item-img img").getAttribute("data-screenshots");
      // convert screenshots into array
      screenshots = screenshots.split(",");
      if(screenshots.length === 1){
          prevBtn.style.display="none";
          nextBtn.style.display="none";
      }
      else{
          prevBtn.style.display="block";
          nextBtn.style.display="block";
      }
      slideIndex = 0;
      popupToggle();
      popupSlideshow();
      popupDetails();
  }
});

    closeBtn.addEventListener("click", () =>{
      popupToggle();
      if(projectDetailsContainer.classList.contains("active")){
        popupDetailsToggle();
      }
    })

    function popupToggle() {
      popup.classList.toggle("open");
      if (popup.classList.contains("open")) {
          document.body.style.overflow = "hidden";
          // Reset scroll position of the popup content when opening
          popup.scrollTo(0, 0);
      } else {
          document.body.style.overflow = "";
      }
  }
  

    function popupSlideshow(){
      const imgSrc = screenshots[slideIndex];
      const popupImg = popup.querySelector(".pp-img");
      /*activate loader until the popupImg loaded */
      popup.querySelector(".pp-loader").classList.add("active");
      popupImg.src=imgSrc;
      popupImg.onload = () =>{
        // deactivate loader after the popupImg loaded
        popup.querySelector(".pp-loader").classList.remove("active");
      }
      popup.querySelector(".pp-counter").innerHTML = (slideIndex+1) + " of " + screenshots.length;
    }

    // next slide
    nextBtn.addEventListener("click", () =>{
      if(slideIndex === screenshots.length-1){
        slideIndex = 0;
      }
      else{
        slideIndex++;
      }
      popupSlideshow();
    })

    // prev slide
    prevBtn.addEventListener("click", () =>{
      if(slideIndex === 0){
        slideIndex = screenshots.length-1
      }
      else{
        slideIndex--;
      }
      popupSlideshow();
    })

    function popupDetails(){
       // if portfolio-item-details not exists
       if(!portfolioItems[itemIndex].querySelector(".portfolio-item-details")){
           projectDetailsBtn.style.display="none";
           return; /*end function execution*/
       }
       projectDetailsBtn.style.display="block";
      // get the project details
      const details = portfolioItems[itemIndex].querySelector(".portfolio-item-details").innerHTML;
      // set the project details
      popup.querySelector(".pp-project-details").innerHTML = details;
      // get the project title
      const title = portfolioItems[itemIndex].querySelector(".portfolio-item-title").innerHTML;
      // set the project title
      popup.querySelector(".pp-title h2").innerHTML = title;
      // get the project category
      const category = portfolioItems[itemIndex].getAttribute("data-category");
      // set the project category
      popup.querySelector(".pp-project-category").innerHTML = category.split("-").join(" ");
    }
    
    projectDetailsBtn.addEventListener("click",() =>{
      popupDetailsToggle();
    })

    function popupDetailsToggle(){
      if(projectDetailsContainer.classList.contains("active")){
        projectDetailsBtn.querySelector("i").classList.remove("fa-minus");
        projectDetailsBtn.querySelector("i").classList.add("fa-plus");
        projectDetailsContainer.classList.remove("active");
        projectDetailsContainer.style.maxHeight = 0 + "px"
      }
      else{
        projectDetailsBtn.querySelector("i").classList.remove("fa-plus");
        projectDetailsBtn.querySelector("i").classList.add("fa-minus");
         projectDetailsContainer.classList.add("active");
         projectDetailsContainer.style.maxHeight = projectDetailsContainer.scrollHeight + "px";
         popup.scrollTo(0,projectDetailsContainer.offsetTop);
      }
    }
  
})();