
$('#logout').click(function (){
    (window.localStorage.getItem("cart")?JSON.parse(window.localStorage.getItem("cart")):window.localStorage.setItem("cart",JSON.stringify([])));
    const cart=JSON.parse(window.localStorage.getItem("cart"));
    $.post('/api/cart/',{cart_items:JSON.stringify(cart)}).done(function (data){
        console.log(data)
        console.log("Successfully")
        window.localStorage.setItem("cart", JSON.stringify([]));
    }).fail(function (){
        console.log("fail")
    })

})


//jQuery use to update and show cart
$('#add-to-cart').submit(function (event) {
    event.preventDefault();
    let URL = '/api/products/'
    const productID = $('[name="idProduct"]').val();
    const sizeID = $('[name = "size"]:checked').val();
    const qty = $('[name = "qty"]').val();

    URL += productID + '?size=' + sizeID;

    (window.localStorage.getItem("cart") ? JSON.parse(window.localStorage.getItem("cart")) : window.localStorage.setItem("cart", JSON.stringify([])));
    let cart = JSON.parse(window.localStorage.getItem("cart"));

    $.get(URL, function (data) {
        let isHas = false;
        let isSuccess = true;
        cart = cart.map((dataCart) => {
            if (dataCart.product._id === data.product._id && dataCart.size._id === data.size._id) {
                const remain = $('#remain').text();
                isHas = true
                if (+remain>=+dataCart.qty+ +qty){
                    dataCart.qty += +qty;
                    isSuccess = true
                }
                else {
                    isSuccess = false
                }

            }
            return dataCart
        })
        if (!isHas) {
            cart.push({product: data.product, size: data.size, qty: +qty});
        }
        console.log(cart)
        convertHTML(cart);
        if (isSuccess){
            window.localStorage.setItem("cart",JSON.stringify(cart))
            //window.alert("Successfully add item!")
            $('#message').html(
                ' <div class="alert alert-success alert-dismissible fade show" role="alert">\n' +
                '        Add cart successfully!' +
                '        <button type="button" class="close" data-dismiss="alert" aria-label="Close">\n' +
                '            <span aria-hidden="true">&times;</span>\n' +
                '        </button>\n' +
                '    </div>').animate({opacity: '1'}, "slow");

            setTimeout( function (){$('#message').animate({opacity: '0.1'}, "slow").html('')},1000)
        }
        else{
            $('#message').html(
                ' <div class="alert alert-danger alert-dismissible fade show" role="alert">\n' +
                '        No enough amount to add cart!' +
                '        <button type="button" class="close" data-dismiss="alert" aria-label="Close">\n' +
                '            <span aria-hidden="true">&times;</span>\n' +
                '        </button>\n' +
                '    </div>').animate({opacity: '1'}, "slow");

            setTimeout( function (){$('#message').animate({opacity: '0.1'}, "slow").html('')},1000)

        }

    })
})
const showCart = function() {
    (window.localStorage.getItem("cart")?JSON.parse(window.localStorage.getItem("cart")):window.localStorage.setItem("cart",JSON.stringify([])));
    const cart=JSON.parse(window.localStorage.getItem("cart"));
    convertHTML(cart)
    console.log("Show");
}
const removeCartItem = function (idProd, idSize) {

    const cart = JSON.parse(window.localStorage.getItem("cart"));
    const index = cart.findIndex(x => x.product._id === idProd && x.size._id === idSize)
    console.log(index);
    cart.splice(index, 1)
    console.log(cart)
    window.localStorage.setItem("cart", JSON.stringify(cart))
    convertHTML(cart);

}
const plusItemCart = function (idProd, idSize) {
    console.log("ggg")
    const cart = JSON.parse(window.localStorage.getItem("cart"));
    const index = cart.findIndex(x => x.product._id === idProd && x.size._id === idSize)
    console.log(idSize)
    console.log(index)

    $.get('/api/products/'+idProd, function (data){
        let success = false;
        data.product.product_detail.map((sizedata) => {
            if (sizedata.size_id === idSize) {
                if (sizedata.remaining_amount>cart[index].qty){
                    cart[index].qty += 1;
                    window.localStorage.setItem("cart", JSON.stringify(cart))
                    let id  = 'qty-cart-'+ cart[index].product._id+cart[index].size._id;
                    console.log("Hello")
                    // $(`input[id="${id}"]`).val(cart[index].qty)
                    convertHTML(cart)
                    success = true;
                    $('#message-cart').html(
                        ' <div class="alert alert-success alert-dismissible fade show" role="alert">\n' +
                        '        Successfully!' +
                        '        <button type="button" class="close" data-dismiss="alert" aria-label="Close">\n' +
                        '            <span aria-hidden="true">&times;</span>\n' +
                        '        </button>\n' +
                        '    </div>').animate({opacity: '1'}, "slow");

                    setTimeout( function (){$('#message-cart').animate({opacity: '0.1'}, "slow").html('')},1000)

                }
            }
        })
        if (!success){
            $('#message-cart').html(
                ' <div class="alert alert-danger alert-dismissible fade show" role="alert">\n' +
                '        Add fail!' +
                '        <button type="button" class="close" data-dismiss="alert" aria-label="Close">\n' +
                '            <span aria-hidden="true">&times;</span>\n' +
                '        </button>\n' +
                '    </div>').animate({opacity: '1'}, "slow");

            setTimeout( function (){$('#message-cart').animate({opacity: '0.1'}, "slow").html('')},1000)

        }


    })


}
const minusItemCart = function (idProd, idSize) {

    const cart = JSON.parse(window.localStorage.getItem("cart"));
    const index = cart.findIndex(x => x.product._id === idProd && x.size._id === idSize)
    let isIncrease = false;
    if (cart[index].qty>1){
        cart[index].qty -= 1;
        window.localStorage.setItem("cart", JSON.stringify(cart))
        $('#message-cart').html(
            ' <div class="alert alert-success alert-dismissible fade show" role="alert">\n' +
            '        Successfully!' +
            '        <button type="button" class="close" data-dismiss="alert" aria-label="Close">\n' +
            '            <span aria-hidden="true">&times;</span>\n' +
            '        </button>\n' +
            '    </div>').animate({opacity: '1'}, "slow");

        setTimeout( function (){$('#message-cart').animate({opacity: '0.1'}, "slow").html('')},1000)
        isIncrease=true;
    }


    convertHTML(cart);
    if (!isIncrease){
        $('#message-cart').html(
            ' <div class="alert alert-danger alert-dismissible fade show" role="alert">\n' +
            '        Minus fail!' +
            '        <button type="button" class="close" data-dismiss="alert" aria-label="Close">\n' +
            '            <span aria-hidden="true">&times;</span>\n' +
            '        </button>\n' +
            '    </div>').animate({opacity: '1'}, "slow");

        setTimeout( function (){$('#message-cart').animate({opacity: '0.1'}, "slow").html('')},1000)
    }

}




const convertHTML = function (cart) {
    let html = ``;
    let totalFee = 0;
    cart.map((dataCart) => {
        totalFee += dataCart.product.price.price_value * dataCart.qty*(1-dataCart.product.discount);
        html += ` <tr id="${dataCart.product._id}">
                                        <td><img src=${dataCart.product.image_show_url}  style="width: 50px; height: 50px"/> </td>
                                        <td>${dataCart.product.name}</td>
                                        <td>${dataCart.size.text}</td>
                                        <td>In stock</td>
                                        <td>
                                            <div class="qty d-flex justify-content-center">
                                                <span class="minus bg-dark" href="#" onclick="minusItemCart('${dataCart.product._id}','${dataCart.size._id}')">-</span>
                                                <input class="form-control count" type="text" name="cart-qty" readonly 
                                                        id="qty-cart-${dataCart.product._id + dataCart.size._id }" value="${dataCart.qty}"  />
                                                <span class="plus bg-dark " href="#" onclick="plusItemCart('${dataCart.product._id}','${dataCart.size._id}')">+</span>
                                            </div>
                                         </div>
                                        </td>
                                        <td class="text-right">${Intl.NumberFormat('vi-VN', {style: 'currency', currency: 'VND'}).format(dataCart.product.price.price_value*(1-dataCart.product.discount))}</td>
                                        <td class="text-right"><button class="btn btn-sm btn-danger" onclick="removeCartItem('${dataCart.product._id}','${dataCart.size._id}')"><i class="fa fa-trash"></i> </button> </td>
                                    </tr>`
    })
    html += ` 

                                <tr>
                                    <td></td>
                                    <td></td>
                                    <td></td>
                                    <td></td>
                                    <td><strong>Total</strong></td>
                                    <td class="text-right"><strong>${Intl.NumberFormat('vi-VN', {style: 'currency', currency: 'VND'}).format(totalFee)}</strong></td>
                                </tr>`
    $("#cart-table").html(html)
}

