
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

const showCart = function() {
    (window.localStorage.getItem("cart")?JSON.parse(window.localStorage.getItem("cart")):window.localStorage.setItem("cart",JSON.stringify([])));
    const cart=JSON.parse(window.localStorage.getItem("cart"));
    convertHTML(cart)
    console.log("Show");
}
//jQuery use to update and show cart
$('#add-to-cart').submit(function (event) {
    event.preventDefault();
    let URL = '/api/products/'
    const productID = $('[name="idProduct"]').val();
    const sizeID = $('[name = "size"]:checked').val();
    const color = $('[name = "color"]:checked').val();
    const qty = $('[name = "qty"]').val();

    URL += productID + '?size=' + sizeID;

    (window.localStorage.getItem("cart") ? JSON.parse(window.localStorage.getItem("cart")) : window.localStorage.setItem("cart", JSON.stringify([])));
    const cart = JSON.parse(window.localStorage.getItem("cart"));

    $.get(URL, function (data) {
        let isHas = false;
        cart.map((dataCart) => {
            if (dataCart.product._id === data.product._id && dataCart.size._id === data.size._id) {
                dataCart.qty += +qty;
                isHas = true
            }
            console.log(typeof dataCart.product._id)
        })
        if (!isHas) {
            cart.push({product: data.product, size: data.size, qty: +qty});
        }

        window.localStorage.setItem("cart",JSON.stringify(cart))
        //window.alert("Successfully add item!")

        convertHTML(cart);
        $('#message').html(
            ' <div class="alert alert-danger alert-dismissible fade show" role="alert">\n' +
            '        Thêm vào giỏ hàng thành công!' +
            '        <button type="button" class="close" data-dismiss="alert" aria-label="Close">\n' +
            '            <span aria-hidden="true">&times;</span>\n' +
            '        </button>\n' +
            '    </div>').animate({opacity: '1'}, "slow");

        setTimeout( function (){$('#message').animate({opacity: '0.1'}, "slow").html('')},1000)

    })
})

const removeCartItem = function (idProd, idSize) {

    const cart = JSON.parse(window.localStorage.getItem("cart"));
    const index = cart.findIndex(x => x.product._id === idProd && x.size._id === idSize)
    console.log(index);
    cart.splice(index, 1)
    console.log(cart)
    window.localStorage.setItem("cart", JSON.stringify(cart))

    convertHTML(cart);

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
                                        <td><input class="form-control" type="text" value="${dataCart.qty}" width="50px" /></td>
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

