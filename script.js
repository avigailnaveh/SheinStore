// localStorage.removeItem("popupuse");
    // localStorage.removeItem("targetDate");
//  localStorage.removeItem("randomInt");
let popupuse = localStorage.getItem('popupuse') === 'true';
let currentProduct = null;
let countOfProduct = 1;
let arrOfCaregory = [];
let globalCategory;

// const today = new Date();
// today.setDate(today.getDate() + 1);
// let Tomorrow=today.toISOString();

//  let targetDate = new Date(localStorage.getItem('targetDate') || Tomorrow);
 let targetDate = new Date(localStorage.getItem('targetDate') || '2024-07-21T17:13:00');
localStorage.setItem('randomInt', localStorage.getItem('randomInt') || 1);
let randomInt;

document.addEventListener("DOMContentLoaded", () => {
    
    updateCountdown();
    const recipeListElement = document.getElementById("listOfCategories");
    const recipeNavListElement = document.getElementById("listOfCategoriesContainer");
    const imgItem = document.getElementById('items');
    imgItem.style.display = "none";
    const disbutton = document.getElementById('disbutton');
    disbutton.style.display="none";
    const sortcontainer = document.getElementById('sort-container');
    sortcontainer.style.display="none";
    let previousPage = sessionStorage.getItem('previousPage'); 
    
    if (previousPage === 'favourites.html'||previousPage === 'cart.html'||previousPage === 'pay.html') {
        sessionStorage.setItem('previousPage', 'index.html');
        let categoryPage=localStorage.getItem('categoryPage');
        fetchProductData(categoryPage);
        
    }
    let searchPage = sessionStorage.getItem('searchPage'); 
    console.log(searchPage);
    if (searchPage === 'favourites.html'||searchPage === 'cart.html'||searchPage === 'pay.html') {
        sessionStorage.setItem('searchPage', 'index.html');
        let inputsearch=localStorage.getItem('inputsearch');
        console.log(inputsearch);
        searching(inputsearch);
    }
    fetch('https://dummyjson.com/products/category-list')
        .then(res => res.json())
        .then(data => {
            data.forEach(category => {
               
                arrOfCaregory.push(category);
                const div = document.createElement('div');
                div.textContent = category;
                div.classList.add('category-item');
                div.addEventListener('click', () => {
                    fetchProductData(category);
                });
                recipeNavListElement.appendChild(div);

                const li = document.createElement('li');
                li.textContent = category;
                li.classList.add('category-item');
                li.addEventListener('click', () => {
                    fetchProductData(category);
                });
                recipeListElement.appendChild(li);
            });
            const imgItem = document.getElementById('items');
            imgItem.style.display = "none";
            // const sortcontainer = document.getElementById('sort-container');
            // sortcontainer.style.display="none";
            const disbutton = document.getElementById('disbutton');
            disbutton.style.display="none";
            fleshselecard();
        });
       
        
        function fetchProductData(category) {
            globalCategory = category;
            
            const sortcontainer = document.getElementById('sort-container');
            sortcontainer.style.display = "flex";
        
            fetch(`https://dummyjson.com/products/category/${category}`)
                .then(res => res.json())
                .then(productsData => {
                    let select = document.getElementById("sortOptions");
                    select.selectedIndex = 0;
                    const card = document.getElementById('recipeCards');
                    card.innerHTML = "";
                    productsData.products.forEach(product => {
                        let pricesale = product.price;
                        let isDiscounted = arrOfCaregory[localStorage.getItem('randomInt')] == product.category;
                        let strsale = `<h4>${pricesale}</h4>`;
                        
                        if (isDiscounted) {
                            let discountedPrice = Math.abs(product.price - (product.discountPercentage/100)*product.price);
                            let formattedPrice = discountedPrice.toFixed(2);
                            pricesale = formattedPrice;
                            strsale = `<h4 class="original-price">${product.price}</h4><h4 class="red">${pricesale}</h4>`;
                        }
        
                        const productCard = document.createElement("div");
                        productCard.className = "product-card";
                        productCard.innerHTML = `
                            <img src="${product.thumbnail}" alt="${product.title}">
                            <h3>${product.title}</h3>
                            <div class="centerCard">
                                ${strsale}
                                <button class="addToCart" id="addCart-${product.id}">Add to cart</button>
                            </div>
                        `;
                        
                        productCard.addEventListener('click', () => { fetchItemData(product); });
                        card.appendChild(productCard);
                        const addToCartButton = productCard.querySelector('.addToCart');
                        addToCartButton.addEventListener('click', (event) => {
                            event.stopPropagation();
                            buynow(product);
                        });
                    });
                    
                    const disproducd = document.getElementById('recipeCards');
                    const appear = document.getElementById('appear');
                    const imgItem = document.getElementById('items');
                    
                    // sortcontainer.style.display = "flex";
                    
                    disproducd.style.display = "flex";
                    appear.style.display = "none";
                    imgItem.style.display = "none";  
                    const disbutton = document.getElementById('disbutton');
                    disbutton.style.display = "none";
                });
        }
   
   
        window.addItemToCart = function(product) {
            let pricesale = product.price;
            if (arrOfCaregory[localStorage.getItem('randomInt')] == product.category) {
                let discountedPrice = Math.abs(product.price - (product.discountPercentage/100)*product.price);
                let formattedPrice = discountedPrice.toFixed(2);
                pricesale = formattedPrice;
            }
        
            let cart = JSON.parse(localStorage.getItem('cart')) || [];
            let existingProductIndex = cart.findIndex(item => item.id === product.id);
        
            if (existingProductIndex > -1) {
                cart[existingProductIndex].count += countOfProduct;
            } else {
                cart.push({
                    id: product.id,
                    title: product.title,
                    price: pricesale,
                    image: product.thumbnail,
                    count: countOfProduct
                });
            }
        
            localStorage.setItem('cart', JSON.stringify(cart));
            
            // Update all buttons for this product
            let addCartButtons = document.querySelectorAll(`[id^="addCart-${product.id}"]`);
            addCartButtons.forEach(button => {
                let originalText = button.innerText;
                button.innerText = "Added!";
                setTimeout(() => {
                    button.innerText = originalText;
                }, 1000);
            });
        };
    
    
    window.addItemToFavourites = function(product) {
        let pricesale=product.price;
        if(arrOfCaregory[localStorage.getItem('randomInt')]==product.category){
            let discountedPrice= Math.abs(product.price - (product.discountPercentage/100)*product.price);
            let formattedPrice = discountedPrice.toFixed(2);
            pricesale=formattedPrice;
        }
        const productToSave = {
            id: product.id,
            title: product.title,
            price: pricesale,
            image: product.thumbnail,
            count:countOfProduct
        };
        let favourites = JSON.parse(localStorage.getItem('favourites')) || [];
        favourites.push(productToSave);
        localStorage.setItem('favourites', JSON.stringify(favourites));
        
    }
  

    const scrollLeft = document.getElementById('scrollLeft');
    const scrollRight = document.getElementById('scrollRight');
    const container = document.getElementById('listOfCategoriesContainer');

    scrollLeft.addEventListener('click', () => {
        container.scrollBy({
            left: -100,
            behavior: 'smooth'
        });
    });

    scrollRight.addEventListener('click', () => {
        container.scrollBy({
            left: 100,
            behavior: 'smooth'
        });
    });
    
    if (popupuse === false) {
        const today = new Date();
        today.setDate(today.getDate() + 1);
        let Tomorrow=today.toISOString();
        targetDate=Tomorrow;
        localStorage.setItem('targetDate', targetDate.toISOString());
        const popupoverlay = document.getElementById('popupOverlay');
        popupoverlay.style.display = "flex";
        localStorage.setItem('popupuse', 'true');
        popupuse = true;
    }
    
    fleshselecard();
    
    fetch('https://dummyjson.com/products/category-list')
        .then(res => res.json())
        .then(index=>{
            for (let i = 2; i < 12; i=i+3) {
                fetch(`https://dummyjson.com/products/category/${index[i]}?limit=5`)
                .then(res => res.json())
                .then(reccmeneditem => {
                    const card = document.getElementById('recommended');
                    reccmeneditem.products.forEach(product => {
                        let pricesale=product.price;
                        let strsale = `<h4>${pricesale}</h4>`;
                        if(arrOfCaregory[localStorage.getItem('randomInt')]==product.category){
                            let discountedPrice= Math.abs(product.price - (product.discountPercentage/100)*product.price);
                            let formattedPrice = discountedPrice.toFixed(2);
                            pricesale=formattedPrice;
                            strsale= `<h4 class="red" >${pricesale}</h4>`;
                        }
                        const productCard = document.createElement("div");
                        productCard.className = "product-card";
                        productCard.innerHTML = `
                            <img src="${product.thumbnail}" alt="${product.title}">
                            <h3>${product.title}</h3>
                            <div class="centerCard">
                                ${strsale}
                                <button class="addToCart" id="addCart-${product.id}">Add to cart</button>
                            </div>
                        `;
                        
                        productCard.addEventListener('click', () => { 
                            fetchItemData(product); 
                            const appear = document.getElementById('appear');
                            appear.style.display = "none";
                        });
                        card.appendChild(productCard);
                        if(arrOfCaregory[localStorage.getItem('randomInt')]==product.category){
                            let elements = document.querySelectorAll(".red"); 
                            elements.forEach(function(element) {
                                element.style.color = "red";
                            });
                        }
                        const addToCartButton = productCard.querySelector('.addToCart');
                        addToCartButton.addEventListener('click', (event) => {
                            event.stopPropagation();
                            buynow(product);
                        });
                    });
                })
                .catch(error => {
                    console.error('Error fetching products:', error);
                });
                
            }
            
        });
     
    
    // Clear the content of 'recommended' only once, outside the loop
    const card = document.getElementById('recommended');
    card.innerHTML = "";
   
   
});
function fetchItemData(product) {
    countOfProduct = 1;
    currentProduct = product;
   
    fetch(`https://dummyjson.com/products/${product.id}`)
        .then(res => res.json())
        .then(productsData => {
            const imageContainer = document.getElementById('carouselContent');
            imageContainer.innerHTML = ''; // Clear existing content

            // Create main image container
            const mainImageContainer = document.createElement('div');
            mainImageContainer.classList.add('main-image-container');

            // Create and add the main thumbnail image
            const mainImage = document.createElement('img');
            mainImage.src = product.thumbnail;
            mainImage.alt = product.title;
            mainImage.classList.add('main-product-image');
            mainImageContainer.appendChild(mainImage);

            // Create thumbnail gallery container
            const thumbnailGallery = document.createElement('div');
            thumbnailGallery.classList.add('thumbnail-gallery');

            // Add thumbnail images
            product.images.forEach((imageSrc, index) => {
                const thumbnailContainer = document.createElement('div');
                thumbnailContainer.classList.add('thumbnail-container');

                const thumbnailImage = document.createElement('img');
                thumbnailImage.src = imageSrc;
                thumbnailImage.alt = `Thumbnail ${index + 1}`;
                thumbnailImage.classList.add('thumbnail-image');

                thumbnailImage.addEventListener('click', () => {
                    mainImage.src = imageSrc;
                });

                thumbnailContainer.appendChild(thumbnailImage);
                thumbnailGallery.appendChild(thumbnailContainer);
            });

            // Append thumbnail gallery and main image container to the image container
            imageContainer.appendChild(mainImageContainer);
            imageContainer.appendChild(thumbnailGallery);

            let revew = document.getElementById("reviews");
            document.getElementById("nameOfItem").innerText = product.title;
            document.getElementById("inStack").innerText = product.availabilityStatus;
            
            let pricesale = product.price;
            let isDiscounted = arrOfCaregory[localStorage.getItem('randomInt')] == product.category;
            
            if (isDiscounted) {
                let discountedPrice = Math.abs(product.price - (product.discountPercentage / 100) * product.price);
                let formattedPrice = discountedPrice.toFixed(2);
                pricesale = formattedPrice;
                document.getElementById("pricesale").innerText = product.price;
                document.getElementById("pricesale").style.display = "inline";
                document.getElementById("price").style.color = "red";
            } else {
                document.getElementById("pricesale").style.display = "none";
                document.getElementById("price").style.color = "";
            }
            
            document.getElementById("price").innerText = pricesale;
            document.getElementById("description").innerText = product.description;
            
            let starsRating = product.rating;
            const stars = document.querySelectorAll('.star');
            stars.forEach(star => {
                if (star.dataset.value <= starsRating) {
                    star.classList.add('filled');
                } else {
                    star.classList.remove('filled');
                }
            });

            revew.innerHTML = "";
            revew.innerHTML = `(${product.reviews.length} reviews)`;
            let reviews = document.getElementById('review');
            let bottomReviews = document.getElementById('bottom-review-container');
            reviews.innerHTML = "";
            bottomReviews.innerHTML = "";

            product.reviews.forEach(review => {
                let divreview = document.createElement('div');
                divreview.className = "reviews";
                let datereview = calcdate(review.date);

                let reviewContent = `
                <div class="forResponsiveButtem">
                    <div class="review-header">
                        <span class="reviewer-name">${review.reviewerName}</span>
                        <span class="review-date">${datereview}</span>
                    </div>
                    <div class="review-rating">Rating: 
                    <div class="starsrev">
                        <span class="starrev" data-value="1">&#9733;</span>
                        <span class="starrev" data-value="2">&#9733;</span>
                        <span class="starrev" data-value="3">&#9733;</span>
                        <span class="starrev" data-value="4">&#9733;</span>
                        <span class="starrev" data-value="5">&#9733;</span>
                    </div>
                    </div>
                    <p class="review-comment">${review.comment}</p>
                    <span class="review-email">${review.reviewerEmail}</span>
                    <hr class="hrrev">
                </div>
                `;

                divreview.innerHTML = reviewContent;
                reviews.appendChild(divreview);

                // Create a clone of the review for the bottom section
                let bottomDivReview = divreview.cloneNode(true);
                bottomReviews.appendChild(bottomDivReview);

                // Fill stars for both review sections
                [divreview, bottomDivReview].forEach(reviewElement => {
                    let starsRating = review.rating;
                    const stars = reviewElement.querySelectorAll('.starrev');
                    stars.forEach(star => {
                        if (parseInt(star.dataset.value) <= starsRating) {
                            star.classList.add('filledrev');
                        } else {
                            star.classList.remove('filledrev');
                        }
                    });
                });
            });
        });

    const corimg = document.getElementById('recipeCards');
    corimg.style.display = "none";
    const sortcontainer = document.getElementById('sort-container');
    sortcontainer.style.display = "none";
    const disbutton = document.getElementById('disbutton');
    disbutton.style.display = "none";
    const imgItem = document.getElementById('items');
    imgItem.style.display = "flex";
}
function fleshselecard() {
    randomInt = parseInt(localStorage.getItem('randomInt')) || 0; 
    let Caregory = arrOfCaregory[randomInt];
    console.log(randomInt);
    console.log(Caregory); 
    fetch(`https://dummyjson.com/products/category/${Caregory}`)
        .then(res => res.json())
        .then(productsData => {
            const card = document.getElementById('flashSaleCard');
            card.innerHTML = "";
            productsData.products.forEach(product => {
                let discountedPrice = Math.abs(product.price - (product.discountPercentage/100)*product.price);
                let formattedPrice = discountedPrice.toFixed(2);
                const productCard = document.createElement("div");
                productCard.className = "product-card";
                productCard.innerHTML = `
                    <img src="${product.thumbnail}" alt="${product.title}">
                    <h3>${product.title}</h3>
                    <div class="centerCard">
                        <h4 class="red">${formattedPrice}</h4>
                        <button class="addToCart" id="addCart-${product.id}">Add to cart</button>
                    </div>
                `;
              
                productCard.addEventListener('click', () => {
                    fetchItemData(product);
                    const appear = document.getElementById('appear');
                    appear.style.display = "none";
                    const disbutton = document.getElementById('disbutton');
                    disbutton.style.display="none";
                });
                card.appendChild(productCard);
                let elements = document.querySelectorAll(".red"); 
                elements.forEach(function(element) {
                    element.style.color = "red";
                });
                const addToCartButton = productCard.querySelector('.addToCart');
                addToCartButton.addEventListener('click', (event) => {
                    event.stopPropagation();
                    buynow(product);
                    console.log(`Added to cart: ${product.title}`); 
                });
            });
        })
        .catch(error => {
            console.error('Error fetching products:', error);
        });
}

function scrollLeft() {
    const card = document.getElementById('flashSaleCard');
    card.scrollBy({ left: -200, behavior: 'smooth' });
}

function scrollRight() {
    const card = document.getElementById('flashSaleCard');
    card.scrollBy({ left: 200, behavior: 'smooth' });
}

function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function closePopup() {
    document.getElementById('popupOverlay').style.display = 'none';
}

function copyCopon() {
    let copyText = "JEIP2";
    navigator.clipboard.writeText(copyText);
    closePopup();
}

function calcdate(isoDateString) {
    let now = new Date(isoDateString);
    let day = String(now.getDate()).padStart(2, '0');
    let month = String(now.getMonth() + 1).padStart(2, '0');
    let year = now.getFullYear();

    let hours = String(now.getHours()).padStart(2, '0');
    let minutes = String(now.getMinutes()).padStart(2, '0');
    let seconds = String(now.getSeconds()).padStart(2, '0');

    let formattedDate = `${day}-${month}-${year}, ${hours}:${minutes}:${seconds}`;
    return formattedDate;
}

function calculateRemainingTime(targetDate) {
    let now = new Date();
    let difference = targetDate - now;

    if (difference <= 0) {
        return {days: 0, hours: 0, minutes: 0, seconds: 0};
    }

    let days = Math.floor(difference / (1000 * 60 * 60 * 24));
    difference -= days * (1000 * 60 * 60 * 24);

    let hours = Math.floor(difference / (1000 * 60 * 60));
    difference -= hours * (1000 * 60 * 60);

    let minutes = Math.floor(difference / (1000 * 60));
    difference -= minutes * (1000 * 60);

    let seconds = Math.floor(difference / 1000);

    return {days: days, hours: hours, minutes: minutes, seconds: seconds};
}

function updateCountdown() {
    let countdownTime = calculateRemainingTime(targetDate);

    let countdownElement = document.getElementById('countdown');
    countdownElement.textContent = countdownTime.days + ':' +
                                    countdownTime.hours.toString().padStart(2, '0') + ':' +
                                    countdownTime.minutes.toString().padStart(2, '0') + ':' +
                                    countdownTime.seconds.toString().padStart(2, '0');

    if (countdownTime.days > 0 || countdownTime.hours > 0 || countdownTime.minutes > 0 || countdownTime.seconds > 0) {
        setTimeout(updateCountdown, 1000);
    } else {
        targetDate = addDayToDate(targetDate);
        localStorage.setItem('targetDate', targetDate.toISOString());
        let rand = Math.floor(Math.random() * 23); 
        localStorage.setItem('randomInt', rand);
        
        // Update cart and favorites prices
        updateItemPrices();

        updateCountdown(); 
        fleshselecard();
    }
}

function updateItemPrices() {
    
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    let favourites = JSON.parse(localStorage.getItem('favourites')) || [];
    console.log(cart);
    let allItems = [...cart, ...favourites];
    let uniqueIds = [...new Set(allItems.map(item => item.id))];

    Promise.all(uniqueIds.map(id => 
        fetch(`https://dummyjson.com/products/${id}`)
            .then(res => res.json())
    )).then(products => {
        let priceMap = new Map(products.map(p => [p.id, p.price]));

        cart = cart.map(item => ({...item, price: priceMap.get(item.id)}));
        favourites = favourites.map(item => ({...item, price: priceMap.get(item.id)}));

        localStorage.setItem('cart', JSON.stringify(cart));
        localStorage.setItem('favourites', JSON.stringify(favourites));
    });
}

function addDayToDate(date) {
    let newDate = new Date(date);
    newDate.setDate(newDate.getDate() + 1);
    return newDate;
}

function howMuch(minOrPlus) {
    let num = document.getElementById('num');
    let currentNumber = parseInt(num.innerText);
    
    if (minOrPlus == 1) {
        num.innerText = currentNumber + 1;
    } else if (minOrPlus == 0 && currentNumber > 1) {
        num.innerText = currentNumber - 1;
    }
}

function buynow(product) {
    let num = document.getElementById('num');
    countOfProduct = parseInt(num.innerText);
    addItemToCart(product);
    num.innerText = '1';
    countOfProduct = 1;
    let addCartButton = document.getElementById(`buyNow`);
    let originalText = addCartButton.innerText;
    addCartButton.innerText = "Added!";
    setTimeout(() => {
        addCartButton.innerText = originalText;
    }, 1000);
}

function saveInHeart(product) {
    addItemToFavourites(product);
}

function search(){
    let searchinput = document.getElementById('searchinput');
    searching(searchinput.value);
}

function searching(searchinput) {
   
    fetch(`https://dummyjson.com/products/search?q=${searchinput}`)
        .then(res => res.json())
        .then(productsData => {
            const card = document.getElementById('recipeCards');
            card.innerHTML = "";

            productsData.products.forEach(product => {
                let pricesale=product.price;
                let strsale = `<h4>${pricesale}</h4>`;
                if(arrOfCaregory[localStorage.getItem('randomInt')]==product.category){
                    let discountedPrice= Math.abs(product.price - (product.discountPercentage/100)*product.price);
                    let formattedPrice = discountedPrice.toFixed(2);
                    pricesale=formattedPrice;
                     strsale=`<h4 class="red" >${pricesale}</h4>`;
                }
                const productCard = document.createElement("div");
                productCard.className = "product-card";
                productCard.innerHTML = `
                    <img src="${product.thumbnail}" alt="${product.title}">
                    <h3>${product.title}</h3>
                    <div class="centerCard">
                        ${strsale}
                        <button class="addToCart" id="addCart-${product.id}">Add to cart</button>
                    </div>
                `;
                
                productCard.addEventListener('click', () => { fetchItemData(product); });
                card.appendChild(productCard);
                if(arrOfCaregory[localStorage.getItem('randomInt')]===product.category){
                    let elements = document.querySelectorAll(".red"); 
                    elements.forEach(function(element) {
                        element.style.color = "red";
                    });
                }
                const addToCartButton = productCard.querySelector('.addToCart');
                addToCartButton.addEventListener('click', (event) => {
                    event.stopPropagation();
                    buynow(product);
                });
                
            });

            const disproducd = document.getElementById('recipeCards');
            const imgItem = document.getElementById('items');
            const appear = document.getElementById('appear');
             const sortcontainer = document.getElementById('sort-container');
            const disbutton = document.getElementById('disbutton');
            disbutton.style.display="none";
             sortcontainer.style.display="none";
            disproducd.style.display = "flex";
            appear.style.display = "none";
            imgItem.style.display = "none";
        });
        document.getElementById("searchinput").value = "";
}

function showcopon(){
    let popupOverlay=document.getElementById('popupOverlay');
    popupOverlay.style.display="flex";
}

document.getElementById('sortOptions').addEventListener('change', function() {
    const category =globalCategory;
            const sortOption = document.getElementById('sortOptions').value;
            let url = 'https://dummyjson.com/products';
            
            if (category) {
                url += `/category/${category}?`;
            } else {
                url += '?';
            }

            if (sortOption === 'priceDesc') {
                url += 'sortBy=price&order=desc';
            } else if (sortOption === 'priceAsc') {
                url += 'sortBy=price&order=asc';
            } else if (sortOption === 'ratingDesc') {
                url += 'sortBy=rating&order=desc';
            }
    fetch(url)
        .then(res => res.json())
        .then(productsData => {
            const card = document.getElementById('recipeCards');
            card.innerHTML = "";

            productsData.products.forEach(product => {
                let pricesale=product.price;
                    if(arrOfCaregory[localStorage.getItem('randomInt')]==product.category){
                        let discountedPrice= Math.abs(product.price - (product.discountPercentage/100)*product.price);
                        let formattedPrice = discountedPrice.toFixed(2);
                        pricesale=formattedPrice;
                    }
                const productCard = document.createElement("div");
                productCard.className = "product-card";
                productCard.innerHTML = `
                    <img src="${product.thumbnail}" alt="${product.title}">
                    <h3>${product.title}</h3>
                    <div class="centerCard">
                        <h4 class="red">${pricesale}</h4>
                        <button class="addToCart" id="addCart-${product.id}">Add to cart</button>
                    </div>
                `;
                
                productCard.addEventListener('click', () => { fetchItemData(product); });
                card.appendChild(productCard);
                const addToCartButton = productCard.querySelector('.addToCart');
                addToCartButton.addEventListener('click', (event) => {
                    event.stopPropagation();
                    buynow(product);
                });
                if(arrOfCaregory[localStorage.getItem('randomInt')]==product.category){
                    let elements = document.querySelectorAll(".red"); 
                    elements.forEach(function(element) {
                        element.style.color = "red";
                    });
                }
            });

            const disproducd = document.getElementById('recipeCards');
            const appear = document.getElementById('appear');
            const imgItem = document.getElementById('items');
            disproducd.style.display = "flex";
            appear.style.display = "none";
            imgItem.style.display = "none";
        });
        document.getElementById("searchinput").value = "";
});

function goback(){
    location.assign('index.html');
}
