let coponuse = false;

document.addEventListener("DOMContentLoaded", () => {
    const recipeListElement = document.getElementById("listOfCategories");
    const recipeNavListElement = document.getElementById("listOfCategoriesContainer");
    const payincrdit= document.getElementById('credit-card-fields');
    payincrdit.style.display="none";
    fetch('https://dummyjson.com/products/category-list')
        .then(res => res.json())
        .then(data => {
            data.forEach(category => {
                const div = document.createElement('div');
                div.textContent = category;
                div.classList.add('category-item');
                div.addEventListener('click', () => {
                    sessionStorage.setItem('previousPage', 'pay.html');
                    localStorage.setItem('categoryPage', category);
                    location.assign('index.html');
                });
                recipeNavListElement.appendChild(div);

                const li = document.createElement('li');
                li.textContent = category;
                li.classList.add('category-item');
                li.addEventListener('click', () => {
                    sessionStorage.setItem('previousPage', 'pay.html');
                    localStorage.setItem('categoryPage', category);
                    location.assign('index.html');
                });
                recipeListElement.appendChild(li);
            });
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
        
    const totalSum = localStorage.getItem('totalSum');
    let totlePriceElement = document.getElementById('totlePrice');
    let priceElement = document.getElementById('price');
    totlePriceElement.innerText = totalSum;
    priceElement.innerText = totalSum;

    const paymentMethods = document.querySelectorAll('input[name="payment-method"]');
    const creditCardFields = document.getElementById('credit-card-fields');
    const cardInputs = creditCardFields.querySelectorAll('input');

    paymentMethods.forEach(method => {
        method.addEventListener('change', function() {
            if (this.value === 'credit-card') {
                creditCardFields.style.display = 'block';
                cardInputs.forEach(input => input.required = true);
            } else {
                creditCardFields.style.display = 'none';
                cardInputs.forEach(input => {
                    input.required = false;
                    input.value = ''; // Clear the fields when not required
                });
            }
        });
    });

    // Credit card input formatting
    const cardNumber = document.getElementById('card-number');
    const cardExpiry = document.getElementById('card-expiry');
    const cardCVV = document.getElementById('card-cvv');

    cardNumber.addEventListener('input', function(e) {
        let value = e.target.value.replace(/\D/g, '').substring(0, 16);
        let formattedValue = '';
        for (let i = 0; i < value.length; i++) {
            if (i > 0 && i % 4 === 0) {
                formattedValue += ' ';
            }
            formattedValue += value[i];
        }
        e.target.value = formattedValue;
    });

    cardExpiry.addEventListener('input', function(e) {
        let value = e.target.value.replace(/\D/g, '').substring(0, 4);
        if (value.length > 2) {
            value = value.substring(0, 2) + '/' + value.substring(2);
        }
        e.target.value = value;
    });

    cardCVV.addEventListener('input', function(e) {
        e.target.value = e.target.value.replace(/\D/g, '').substring(0, 3);
    });
});

function sendMail() {
    if (validateFields() && validatePaymentMethod()) {
        (function () {
            emailjs.init("RmPwzc2iyx4VIWsZ5");
        })();
        let totlePriceElement = document.getElementById('totlePrice');
        let totlePrice = parseFloat(totlePriceElement.innerText);
        let now = new Date();

        let day = String(now.getDate()).padStart(2, '0');
        let month = String(now.getMonth() + 1).padStart(2, '0');
        let year = now.getFullYear();

        let hours = String(now.getHours()).padStart(2, '0');
        let minutes = String(now.getMinutes()).padStart(2, '0');
        let seconds = String(now.getSeconds()).padStart(2, '0');

        let formattedDate = `${day}-${month}-${year}, ${hours}:${minutes}:${seconds}`;
        let city = document.querySelector('#town-city').value;
        let street = document.querySelector('#street-address').value;
        let apartment = document.querySelector("#apartment").value;
        let selectedPaymentMethod = document.querySelector('input[name="payment-method"]:checked').value;
        let selectedPaymen;
        if(selectedPaymentMethod == "credit-card"){
            selectedPaymen = "אשראי";
        } else if(selectedPaymentMethod == "cash"){
            selectedPaymen = "מזומן";
        }

        let params = {
            sendername: document.querySelector("#first-name").value,
            to: document.querySelector("#email-address").value,
            subject: "buy from shine",
            replyto: "noreply@gmail.com",
            totle: totlePrice,
            pay: selectedPaymen,
            date: formattedDate,
            citylive: city,
            streetlive: street,
            num: apartment,
        };

        let serviceID = "service_uvicsns";
        let templateID = "template_9nw5je8";
        emailjs.send(serviceID, templateID, params)
            .then(res => {
                alert("Thank you for buying, the products are on their way to you. More details by email");
                location.assign('index.html');
            })
            .catch(res => {
                alert("The email was not sent :(");
            });

        document.getElementById("first-name").value = "";
        document.getElementById("company-name").value = "";
        document.getElementById("street-address").value = "";
        document.getElementById("apartment").value = "";
        document.getElementById("town-city").value = "";
        document.getElementById("phone-number").value = "";
        document.getElementById("email-address").value = "";
        document.getElementById("coponInput").value = "";
    } else {
        alert('Please fill in all required fields and select a payment method.');
    }
}

function validateFields() {
    const requiredFields = document.querySelectorAll('input[required]');
    for (let field of requiredFields) {
        if (!field.value.trim()) {
            return false;
        }
    }

    const selectedPaymentMethod = document.querySelector('input[name="payment-method"]:checked');
    if (selectedPaymentMethod && selectedPaymentMethod.value === 'credit-card') {
        const cardNumber = document.getElementById('card-number').value.replace(/\s/g, '');
        const cardExpiry = document.getElementById('card-expiry').value;
        const cardCVV = document.getElementById('card-cvv').value;

        if (!cardNumber || !cardExpiry || !cardCVV) {
            return false;
        }

        if (!/^\d{16}$/.test(cardNumber)) {
            alert('Please enter a valid 16-digit card number.');
            return false;
        }
        if (!/^\d{2}\/\d{2}$/.test(cardExpiry)) {
            alert('Please enter a valid expiry date in MM/YY format.');
            return false;
        }
        if (!/^\d{3}$/.test(cardCVV)) {
            alert('Please enter a valid 3-digit CVV.');
            return false;
        }
    }

    return true;
}

function validatePaymentMethod() {
    const selectedPaymentMethod = document.querySelector('input[name="payment-method"]:checked');
    return selectedPaymentMethod !== null;
}

function addCopon() {
    let coponInput = document.getElementById('coponInput');
    let totlePriceElement = document.getElementById('totlePrice');
    let totlePrice = parseFloat(totlePriceElement.innerText);

    if (coponInput.value == "JEIP2" && coponuse === false) {
        if (totlePrice >= 400) {
            totlePrice = totlePrice - (totlePrice * 0.2);
            coponuse = true;
        } else if (totlePrice >= 300) {
            totlePrice = totlePrice - (totlePrice * 0.15);
            coponuse = true;
        } else {
            alert('You cannot use this coupon, you do not have enough money in the order');
            return;
        }
        totlePriceElement.innerText = totlePrice.toFixed(2);
    }
}

function goback(){
    location.assign('cart.html');
}

function search(){
    sessionStorage.setItem('searchPage', 'pay.html');
    let searchinput = document.getElementById('searchinput');
    localStorage.setItem('inputsearch', searchinput.value);
    location.assign('index.html');
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
    let popupOverlay = document.getElementById('popupOverlay');
    popupOverlay.style.display = "flex";
}