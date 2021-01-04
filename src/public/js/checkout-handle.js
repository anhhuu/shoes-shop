$(document).ready(function () {
    let html = ``;
    const carts = JSON.parse(window.localStorage.getItem("cart"));
    let totalCost = 0;
    carts.map((cartItem, index) => {
        totalCost += cartItem.product.price.price_value * cartItem.qty;
        html += `<tr class="rem1">
                        <td class="invert">${+index + +1}</td>
                        <td class="invert-image"><a href="#"><img style="width: 50px; height: 50px" src=${cartItem.product.image_show_url} alt="${cartItem.product.name}" class="img-responsive"></a></td>
                        <td class="invert">
                            <div class="quantity">
                                <div class="quantity-select">
                                    <div class="entry value"><span>${cartItem.qty}</span></div>
                                </div>
                            </div>
                        </td>
                        <td class="invert">${cartItem.product.name}</td>
                        <td class="invert">${cartItem.size.text}</td>

                        <td class="invert">${Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND'
        }).format(cartItem.product.price.price_value * cartItem.qty)}</td>
                        
                    </tr>`
    })
    html += `<tr class="rem1">
        <td class="invert"></td>
        <td class="invert-image"></td>
        <td class="invert">
        </td>
        <td class="invert"></td>
        <td class="invert">Total</td>

        <td class="invert">${Intl.NumberFormat('vi-VN', {style: 'currency', currency: 'VND'}).format(totalCost)}</td>
        
    </tr>`
    $('#amount-product-cart').text(`${carts.length}`)
    $('#cart-in-checkout').html(html)
})