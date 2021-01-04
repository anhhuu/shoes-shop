const cartContent = document.querySelector(".cart-detail");
class UI {
    setCartValues(cart) {
        let tempTotal = 0;
        let itemsTotal = 0;
        cart.map(item => {
            tempTotal += item.price * item.amount;
            itemsTotal += item.amount;
        });
        cartTotal.innerText = parseFloat(tempTotal.toFixed(2));
        cartItems.innerText = itemsTotal;
    }
    addCartItem(item) {
        const div = document.createElement("div");
        div.classList.add("cart-item");
        div.innerHTML = `<img src=${item.image} alt="product" />
            <div>
              <h4>${item.title}</h4>
              <h5>$${item.price}</h5>
              <span class="remove-item" data-id=${item.id}>remove</span>
            </div>
            <div>
              <i class="fas fa-chevron-up" data-id=${item.id}></i>
              <p class="item-amount">${item.amount}</p>
              <i class="fas fa-chevron-down" data-id=${item.id}></i>
            </div>`;
        cartContent.appendChild(div);
    }
    showCart() {
        (window.localStorage.getItem("cart")?JSON.parse(window.localStorage.getItem("cart")):window.localStorage.setItem("cart",JSON.stringify([])));
        const cart=JSON.parse(window.localStorage.getItem("cart"));

        cartContent.classList.add("cart-show");
        convertHTML(cart)
        console.log("Show");
    }

    populateCart(cart) {
        cart.forEach(item => this.addCartItem(item));
    }
    hideCart() {
        cartContent.classList.remove("cart-show");
        console.log("Hidden")
    }

    clearCart() {
        let cartItems = cart.map(item => item.id);
        cartItems.forEach(id => this.removeItem(id));
        console.log(cartContent.children);

        while (cartContent.children.length > 0) {
            cartContent.removeChild(cartContent.children[0]);
        }
        this.hideCart();
    }

    getSingleButton(id) {
        return buttonsDOM.find(button => button.dataset.id === id);
    }
}
const showCartFake = function (id){
    const cartContentFake = document.getElementById(id);
    cartContentFake.classList.add("cart-show");
    console.log("ShowFake");
}

let btnCart = document.getElementById("btn-cart");
    btnCart.addEventListener("click",()=>{
    console.log("Hello")
    const ui = new UI();
    return ui.showCart();
})

let btnCont = document.getElementById("continue");
btnCont.addEventListener("click",()=>{
    const ui = new UI();
    ui.hideCart();
})

//button checkout

