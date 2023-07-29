    // script.js
    
    const itemsPerPage = 4; // Number of products to display per page
    let currentPage = 1; // Current page number
    let productsData = []; // Variable to store the product data
    
    const fetchProducts = async () => {
      try {
        const response = await fetch('products.json');
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const products = await response.json();
        return products;
      } catch (error) {
        console.error('Error fetching product data:', error);
        return [];
      }
    };
    
    const renderProducts = () => {
      const productsContainer = document.querySelector(".products");
      const startIndex = (currentPage - 1) * itemsPerPage;
      const endIndex = startIndex + itemsPerPage;
      const currentProducts = productsData.slice(startIndex, endIndex);
    
      const output = currentProducts.map(item => `
        <div class="w3-col l3 s6">
           
      <div class="w3-container">
        <div class="w3-display-container">  
          <a href="${item.link}" target="_blank"><img src="${item.image}" alt="${item.alt}" style="width:100%;"></a>
          <span class="w3-tag w3-display-topleft">${item.tag}</span><br>
         </div>
       </div><br>
    </div>
      `).join('');
      productsContainer.innerHTML = output;
    };
    
    const renderPagination = () => {
      const totalPages = Math.ceil(productsData.length / itemsPerPage);
    
      const paginationContainer = document.querySelector(".pagination");
      paginationContainer.innerHTML = '';
    
      for (let i = 1; i <= totalPages; i++) {
        const button = document.createElement('button');
        button.textContent = i;
        button.addEventListener('click', () => {
          currentPage = i;
          renderProducts();
          renderPagination();
        });
    
        // Add "active" class to the current page button
        if (i === currentPage) {
          button.classList.add('active');
        }
    
        paginationContainer.appendChild(button);
      }
    };
    
    // Swipe functionality for product frame and pagination
    //frame
    const productFrame = document.querySelector(".products");
    
    let touchStartX = 0;
    let touchEndX = 0;
    
    productFrame.addEventListener('touchstart', handleTouchStart, false);
    productFrame.addEventListener('touchend', handleTouchEnd, false);
    
    function handleTouchStart(event) {
      touchStartX = event.changedTouches[0].screenX;
    }
    
    function handleTouchEnd(event) {
      touchEndX = event.changedTouches[0].screenX;
      handleSwipe();
    }
    
    function handleSwipe() {
      const swipeThreshold = 50; // Minimum distance for a swipe to be considered
    
      const swipeDistance = touchEndX - touchStartX;
    
      if (swipeDistance > swipeThreshold) {
        // Swipe right (go to previous page)
        currentPage = Math.max(currentPage - 1, 1);
      } else if (swipeDistance < -swipeThreshold) {
        // Swipe left (go to next page)
        const totalPages = Math.ceil(productsData.length / itemsPerPage);
        currentPage = Math.min(currentPage + 1, totalPages);
      }
    
      renderProducts();
      renderPagination();
    }
    
    //pagination
    (async () => {
      productsData = await fetchProducts();
      renderProducts();
      renderPagination();
    })();
