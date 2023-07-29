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
        <div class="item"> 
          <div class="img"> 
            <img src="${item.image}" alt="${item.description}"> 
          </div> 
          <div class="content"> 
            <div class="title">${item.title}</div> 
            <div class="des">${item.description}</div> 
            <div class="price">${item.price}</div> 
            <button class="add">Add to cart</button> 
          </div> 
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
