document.addEventListener("DOMContentLoaded", () => {
    console.log("DOM fully loaded and parsed");
    let cartItems = JSON.parse(localStorage.getItem('favourites')) || [];
    console.log("Cart Items:", cartItems);
    const addedItems = new Map();
    
    const recipeListElement = document.getElementById("listOfCategories");
    const recipeNavListElement = document.getElementById("listOfCategoriesContainer");
    
   
    fetch('https://dummyjson.com/products/category-list')
        .then(res => res.json())
        .then(data => {
            data.forEach(category => {
               
                const div = document.createElement('div');
                div.textContent = category;
                div.classList.add('category-item');
                div.addEventListener('click', () => {
                    sessionStorage.setItem('previousPage', 'favourites.html');
                    localStorage.setItem('categoryPage', category);
                    goback();
                });
                recipeNavListElement.appendChild(div);

                const li = document.createElement('li');
                li.textContent = category;
                li.classList.add('category-item');
                li.addEventListener('click', () => {
                    sessionStorage.setItem('previousPage', 'favourites.html');
                    localStorage.setItem('categoryPage', category);
                    goback();
                });
                recipeListElement.appendChild(li);
            });
        
        });

    cartItems.forEach(item => {
        if (addedItems.has(item.id)) {
            addedItems.get(item.id).count += item.count;
        } else {
            addedItems.set(item.id, { ...item });
        }
    });
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
    
    const emptyCartImage = document.getElementById('emptyCart');
    const cartItemsContainer = document.getElementById('recipeCards');
    updateEmptyCartDisplay();

    function updateEmptyCartDisplay() {
        if (addedItems.size === 0) {
            emptyCartImage.style.display = "block";
        } else {
            emptyCartImage.style.display = "none";
        }
    }

    addedItems.forEach(item => {
        const itemCard = document.createElement('div');
        itemCard.classList.add('product-card');

        itemCard.innerHTML = `
        <div class="favorall">
            <img src="${item.image}" alt="${item.title}">
            <h3>${item.title}</h3>
            <div class="centerCard">
                <h4>${item.price}</h4>
                <div class="cartbottem">
                    <button class="addToCart" id="addCart-${item.id}">Add to cart</button>
                    <button class="remove-btn"><i class="fas fa-trash"></i></button>
                </div>
            </div>
         </div>
        `;

        cartItemsContainer.appendChild(itemCard);

        // Add to cart button click event
        const addToCartBtn = itemCard.querySelector('.addToCart');
        addToCartBtn.addEventListener('click', () => {
            addItemToCart(item);
        });

        // Remove item on button click
        const removeBtn = itemCard.querySelector('.remove-btn');
        removeBtn.addEventListener('click', () => {
            cartItemsContainer.removeChild(itemCard);
            removeCartItem(item.id);
            updateEmptyCartDisplay();
        });
    });
    function removeCartItem(id) {
        cartItems = cartItems.filter(item => item.id !== id);
        localStorage.setItem('favourites', JSON.stringify(cartItems));
        addedItems.delete(id);
    }

    function updateEmptyCartDisplay() {
        if (addedItems.size === 0) {
            emptyCartImage.style.display = "block";
        } else {
            emptyCartImage.style.display = "none";
        }
    }

    window.addItemToCart = function(product) {
        let cart = JSON.parse(localStorage.getItem('cart')) || [];
        
        // Check if the product is already in the cart
        let existingProductIndex = cart.findIndex(item => item.id === product.id);
        
        if (existingProductIndex !== -1) {
            // If the product is already in the cart, increase its count
            cart[existingProductIndex].count += 1;
        } else {
            // If it's a new product, add it to the cart
            const productToSave = {
                id: product.id,
                title: product.title,
                price: product.price,
                image: product.image,
                count: 1
            };
            cart.push(productToSave);
        }
        
        localStorage.setItem('cart', JSON.stringify(cart));
    
        let addCartButton = document.getElementById(`addCart-${product.id}`);
        let originalText = addCartButton.innerText;
        addCartButton.innerText = "Added!";
        setTimeout(() => {
            addCartButton.innerText = originalText;
        }, 1000); 
    };
});

function goback() {
    location.assign('index.html');
}
function search(){
    sessionStorage.setItem('searchPage', 'favourites.html');
    let searchinput = document.getElementById('searchinput');
    localStorage.setItem('inputsearch', searchinput.value);
    goback();
}
function closePopup() {
    document.getElementById('popupOverlay').style.display = 'none';
}
function copyCopon() {
    let copyText = "JEIP2";
    navigator.clipboard.writeText(copyText);
    closePopup();
}
function showcopon(){
    let popupOverlay=document.getElementById('popupOverlay');
    popupOverlay.style.display="flex";
}
