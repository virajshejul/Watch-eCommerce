// scroll reveal animation
const revealElements = document.querySelectorAll("[data-reveal]");
const scrollReveal = function(){
    for (let i = 0; i < revealElements.length; i++){
        const elementsonScreen = revealElements[i].getBoundingClientRect().top < window.innerHeight / 1.15;
        if(elementsonScreen){
            revealElements[i].classList.add("revealed");
        } else {
            revealElements[i].classList.remove("revealed");
        }
    }
}
window.addEventListener("scroll", scrollReveal);
scrollReveal();

// back to top
const backtoTop = document.querySelector("[data-back-top]");
window.addEventListener("scroll", function (){
    const bodyHeight = document.body.scrollHeight;
    const windowHeight = window.innerHeight;
    const scrollEndPos = bodyHeight - windowHeight;
    const totalScrollPercent = (window.scrollY / scrollEndPos) * 100;
    backtoTop.textContent = `${totalScrollPercent.toFixed(0)}%`;

    if (totalScrollPercent > 5){
        backtoTop.classList.add('show');
    } else {
        backtoTop.classList.remove('show');
    }
});

// HEADER NAVBAR
const ul = document.querySelector('.hex_navbar ul');
const overlay = document.querySelector('.overlay');
const icon = document.querySelector('.nav_toggle i');
const items = ul.querySelectorAll('li');

//close navbar function
function closeNavbar(){
    items.forEach(item => {
        item.style.transform = 'translateY(-20px)';
    });
    setTimeout(() => {
        ul.classList.remove('show');
        overlay.classList.remove('show');
        icon.classList.add('fa-bars');
        icon.classList.remove('fa-close');
    }, 500);
}

// toggle navbar
document.querySelector('.nav_toggle').addEventListener('click', function(){
    if (ul.classList.contains('show')){
        closeNavbar();
    } else {
        ul.classList.add('show');
        overlay.classList.add('show');
        icon.classList.remove('fa-bars');
        icon.classList.add('fa-close');
        items.forEach((item, index) => {
            item.style.transform = `translateY(${index * 60}px)`;
        });
    }
});

//scroll to section and close navbar
document.querySelector('.hex_navbar').addEventListener('click', function(e){
    if(e.target.tagName === 'A'){
        e.preventDefault();
        const targetId = e.target.getAttribute('href');
        const targetElement = document.querySelector(targetId);
        targetElement.scrollIntoView({ behavior: 'smooth' });
        setTimeout(closeNavbar, 800);
    }
});

//close navbar on clicking outside 
document.addEventListener('click', function(event){
    const isClickInsideNav = event.target.closest('.hex_navbar') || 
    event.target.closest('.nav_toggle');
    if (!isClickInsideNav && ul.classList.contains('show')){
        closeNavbar();
    }
})

// HOME SECTION SLIDER
document.getElementById('next').onclick = function(){
    let lists = document.querySelectorAll('.item');
    document.getElementById('slide').appendChild(lists[0]);
}
document.getElementById('prev').onclick = function(){
    let lists = document.querySelectorAll('.item');
    document.getElementById('slide').prepend(lists[lists.length - 1]);
}

// CART FUNCTIONALITY
document.addEventListener('DOMContentLoaded', function(){
    const cartIcon = document.querySelector('.cart_icon');
    const cartSidebar = document.getElementById('cart_sidebar');
    const sidebarClose = document.getElementById('sidebar_close');
    const cartItemsContainer = document.querySelector('.cart_items');
    const cartTotalElement = document.querySelector('.cart_total');
    const cartCountElement = cartIcon.querySelector('.cart_icon span');
    const addToCartButtons = document.querySelectorAll('#btn_border');
    const checkOut = document.querySelector('.checkout_btn');

    let cart = [];

    // Function to update cart sidebar
    function updateCart(){
        cartItemsContainer.innerHTML = '';
        let total = 0;
        cart.forEach((item, index) => {
            const cartStuff = document.createElement('div');
            cartStuff.classList.add('cart_stuff');
            cartStuff.innerHTML = `
            <p>${item.name} - $${item.price.toFixed(2)}</p>
            <i class = "fa-solid fa-trash remove_btn" data-index = "${index}"></i>
            `;
            cartItemsContainer.appendChild(cartStuff);
            total += item.price;
        });
        cartTotalElement.textContent = `$${total.toFixed(2)}`;
        cartCountElement.textContent = cart.length;
    }

    // Function to add item to cart
    function addToCart(item){
        cart.push(item);
        updateCart();
    }
    // Function to delete item from cart
    function removeFromCart(index){
        cart.splice(index, 1);
        updateCart();
    }
    
    // Handle add to cart button click
    addToCartButtons.forEach((button, index) => {
        button.addEventListener('click', () => {
            const card = button.closest('.cart_card');
            const name = card.querySelector('.card_title').textContent;
            const price = parseFloat(card.querySelector('.card_price').textContent.replace('$', ''));
            const item = { name, price }
            addToCart(item)
        });
    });

    // Handle remove button click in cart sidebar
    cartItemsContainer.addEventListener('click', (e) => {
        if (e.target.classList.contains('remove_btn')){
            const index = e.target.dataset.index;
            removeFromCart(index);
        }
    });
    
    // Open Cart sidebar
    cartIcon.addEventListener('click', () => {
        cartSidebar.classList.add('open');
    });

    // Close Cart sidebar
    sidebarClose.addEventListener('click', () => {
        cartSidebar.classList.remove('open');
    });
    
    checkOut.addEventListener('click', () => {
        cartSidebar.classList.remove('open');
    });
    
});

//TESTIMONIAL SLIDER
let currIndex = 1;
let istransition = false;
const sliderTrack= document.querySelector('.testi_track');
const testimonials = Array.from(document.querySelectorAll('.testi_container'));
const totalTesti = testimonials.length;
function clone_Nodes(){
    const firstClone = testimonials[0].cloneNode(true);
    const lastClone = testimonials[totalTesti - 1].cloneNode(true);
    sliderTrack.appendChild(firstClone);
    sliderTrack.insertBefore(lastClone, testimonials[0]);
}
function initSlider(){
    clone_Nodes();
    sliderTrack.style.transform = `translateX(-100%)`;
}
function slideTo(index){
    if(istransition) return;
    istransition = true;
    sliderTrack.style.transition = 'transform 1s ease-in-out';
    sliderTrack.style.transform = `translateX(-${index * 100}%)`;
    sliderTrack.addEventListener(
        'transitionend',
        () => {
            istransition = false;
            if(index === totalTesti + 1){
                sliderTrack.style.transition = 'none';
                currIndex = 1;
                sliderTrack.style.transform = `translateX(-${currIndex * 100}%)`;
            } else if (index === 0){
                sliderTrack.style.transition = 'none';
                currIndex = totalTesti;
                sliderTrack.style.transform = `translateX(-${currIndex * 100}%)`;
            }
        },
        { once: true }
    );
}
function startSlider(){
    setInterval(() => {
        if (!istransition){
            currIndex++;
            slideTo(currIndex);
        }
    }, 5000);
}
window.onload = () => {
    initSlider();
    startSlider();
};
