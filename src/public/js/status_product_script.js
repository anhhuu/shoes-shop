function getStatus(prod,idSize,qty){
    (window.localStorage.getItem("cart")?window.localStorage.getItem("cart"):window.localStorage.setItem("cart",JSON.stringify([])));
    const cart  = localStorage.getItem("cart");
    cart.map((cartItem)=>{
        if (cartItem.prod){

        }
    })


}

