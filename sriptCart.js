document.addEventListener("DOMContentLoaded", () => {
    console.log("DOM fully loaded and parsed");
    let cartItems = JSON.parse(localStorage.getItem('cart')) || [];
    console.log("Cart Items:", cartItems);
    const cartItemsContainer = document.getElementById('colInCart');
    if (!cartItemsContainer) {
        console.error("No element with ID 'colInCart' found");
        return;
    }
    const addedItems = new Map();
    let sum = 0;
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
                    sessionStorage.setItem('previousPage', 'cart.html');
                    localStorage.setItem('categoryPage', category);
                    goback();
                });
                recipeNavListElement.appendChild(div);

                const li = document.createElement('li');
                li.textContent = category;
                li.classList.add('category-item');
                li.addEventListener('click', () => {
                    sessionStorage.setItem('previousPage', 'cart.html');
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
    updateEmptyCartDisplay();

    function updateEmptyCartDisplay() {
        if (addedItems.size === 0) {
            emptyCartImage.style.display = "block";
        } else {
            emptyCartImage.style.display = "none";
        }
    }

    addedItems.forEach(item => {
        const itemElementTr = document.createElement('tr');
        const itemElementTd = document.createElement('td');
        itemElementTd.className = "product-card";
        itemElementTd.innerHTML = `
            <img src="${item.image}" alt="${item.id}">
            <p class="nameofproduct">${item.title}</p>
            <p class="priceItem">${item.price}</p>
            <input type="number" min="1" value="${item.count}">
            <button class="saveinhart"><i class="fas fa-heart "></i></button>
            <button class="remove-btn"><i class="fas fa-trash"></i></button>
        `;
        
        sum += item.price * item.count;
        itemElementTr.appendChild(itemElementTd);
        cartItemsContainer.appendChild(itemElementTr);

        // Update quantity on change
        const quantityInput = itemElementTd.querySelector('input[type="number"]');
        quantityInput.addEventListener('change', (e) => {
            let newCount = parseInt(e.target.value, 10);
            
            // Prevent negative numbers
            if (newCount < 1 || isNaN(newCount)) {
                newCount = 1;
                e.target.value = 1;
            }
            
            item.count = newCount;
            updateCartItem(item.id, newCount);
            updateTotal();
            updateEmptyCartDisplay();
        });

        // Add an input event listener to handle empty input
        quantityInput.addEventListener('input', (e) => {
            if (e.target.value === '') {
                e.target.value = 1;
                item.count = 1;
                updateCartItem(item.id, 1);
                updateTotal();
                updateEmptyCartDisplay();
            }
        });

        // Remove item on button click
        const removeBtn = itemElementTd.querySelector('.remove-btn');
        removeBtn.addEventListener('click', () => {
            cartItemsContainer.removeChild(itemElementTr);
            removeCartItem(item.id);
            updateTotal();
            updateEmptyCartDisplay();
        });

        const saveinhart = itemElementTd.querySelector('.saveinhart');
        saveinhart.addEventListener('click', () => {
            addItemToFavourites(item);
            cartItemsContainer.removeChild(itemElementTr);
            removeCartItem(item.id);
            updateTotal();
            updateEmptyCartDisplay();
        });
    });
   
    const totalElement = document.getElementById('totalSum');
    totalElement.innerText = sum.toFixed(2);

    function updateCartItem(id, newCount) {
        cartItems = cartItems.map(item => {
            if (item.id === id) {
                return { ...item, count: newCount };
            }
            return item;
        });
        localStorage.setItem('cart', JSON.stringify(cartItems));
    }

    function removeCartItem(id) {
        cartItems = cartItems.filter(item => item.id !== id);
        localStorage.setItem('cart', JSON.stringify(cartItems));
        addedItems.delete(id);
    }

    function updateTotal() {
        let newSum = 0;
        cartItems.forEach(item => {
            newSum += item.price * item.count;
        });
        totalElement.innerText = newSum.toFixed(2);
    }

    const payNow = document.getElementById('pay');
   
    payNow.addEventListener('click', (event) => {
        if (addedItems.size !== 0) {
            localStorage.setItem('addedItems', JSON.stringify(Array.from(addedItems.entries())));
            localStorage.setItem('totalSum', totalElement.innerText);
            location.assign('pay.html');
        } else {
            alert('your cart is empty');
        }
    });
});

function goback() {
    location.assign('index.html');
}

function search() {
    sessionStorage.setItem('searchPage', 'cart.html');
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

function showcopon() {
    let popupOverlay = document.getElementById('popupOverlay');
    popupOverlay.style.display = "flex";
}

window.addItemToFavourites = function(product) {
    const productToSave = {
        id: product.id,
        title: product.title,
        price: product.price,
        image: product.image,
        count: 1
    };
    console.log(productToSave);
    let favourites = JSON.parse(localStorage.getItem('favourites')) || [];
    favourites.push(productToSave);
    localStorage.setItem('favourites', JSON.stringify(favourites));
}