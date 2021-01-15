$(document).ready(function () {
    let html = ``;
    const carts = JSON.parse(window.localStorage.getItem("cart"));
    let totalCost = 0;
    carts.map((cartItem, index) => {
        totalCost += cartItem.product.price.price_value * cartItem.qty*(1-cartItem.product.discount);
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
        }).format(cartItem.product.price.price_value * cartItem.qty*(1-cartItem.product.discount))}</td>
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

$('#select-payment-method').change(function () {
    const paymentMethod = $('#select-payment-method option:selected').val();
    $('#show-payment-method').text(paymentMethod)
})

$('#order').click(function () {
    const paymentMethod = $('#select-payment-method option:selected').val();
    const addressDeliveryID = $('#select-address-delivery option:selected').val();
    const carts = JSON.parse(window.localStorage.getItem("cart"));
    const items = [];
    let totalFee = 0;
    carts.map(item => {
        let itemInfo = {};
        itemInfo.product_id = item.product._id;
        itemInfo.qty = item.qty;
        itemInfo.size_id = item.size._id;
        itemInfo.cost = item.qty * (+item.product.price.price_value)*(1-item.product.discount);
        totalFee += itemInfo.cost;
        items.push(itemInfo);
    })

    if (paymentMethod === '' || addressDeliveryID === '' || carts.length === 0) {
        let alertStr = carts.length === 0 ? "Cart is not empty" : '' + addressDeliveryID === '' ? "Address Delivery is not empty" : '' + paymentMethod === '' ? "Payment method is not empty" : '';
        window.alert(alertStr)
        console.log(alertStr)
    } else {
        $.post('/checkout/createInvoice', {
            addressInfoID: addressDeliveryID,
            items: JSON.stringify(items),
            paymentMethod: paymentMethod,
            totalFee: totalFee
        }).done(function () {

            window.localStorage.setItem("cart", JSON.stringify([]));
            //window.alert("Successfully Order");
            $('#message').html(
                ' <div class="alert alert-success alert-dismissible fade show" role="alert">\n' +
                '        Successfully!' +
                '        <button type="button" class="close" data-dismiss="alert" aria-label="Close">\n' +
                '            <span aria-hidden="true">&times;</span>\n' +
                '        </button>\n' +
                '    </div>');
            window.location.replace("/products")


        }).fail(
            $('#message').html(
                ' <div class="alert alert-danger alert-dismissible fade show" role="alert">\n' +
                '        No enough amount to order!' +
                '        <button type="button" class="close" data-dismiss="alert" aria-label="Close">\n' +
                '            <span aria-hidden="true">&times;</span>\n' +
                '        </button>\n' +
                '    </div>')
        )
    }


})


