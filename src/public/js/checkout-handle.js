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

$('#select-province').change(function () {
    const provinceID = $('#select-province option:selected').val()
    console.log(provinceID)
    $.get('/api/address/province/' + provinceID, function (data) {
        let html = `<option value=""></option>`;
        data.map(district => {
            html += `<option value="${district._id}">${district.name}</option>`
        })
        $('#select-district').html(html);
    })


})
$('#select-district').change(function () {
    const provinceID = $('#select-province option:selected').val()
    const districtID = $('#select-district option:selected').val()
    $.get('/api/address/province/' + provinceID + '/' + districtID, function (data) {
        let html = `<option value=""></option>`;
        data.map(ward => {
            html += `<option value="${ward._id}">${ward.name}</option>`
        })
        $('#select-ward').html(html);
    })


})
$('#select-address-delivery').change(function () {
    const addrID = $('#select-address-delivery option:selected').val();
    let addressText = ''
    $.get('api/address/' + addrID, function (data) {
        addressText = data.phone_number + ', ' + data.full_name + ', ' + data.address_text
        $('#show-address-delivery').text(addressText)
    })
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
    let totalFee = 0
    carts.map(item => {
        let itemInfo = {};
        itemInfo.product_id = item.product._id;
        itemInfo.qty = item.qty;
        itemInfo.size_id = item.size._id;
        itemInfo.cost = item.qty * (+item.product.price.price_value);
        totalFee += itemInfo.cost;
        items.push(itemInfo);
    })


    console.log(items)
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
            window.alert("Successfully Order");
            window.location.replace("/products")

        })
    }


})

$('#add-new-delivery').submit(function (event) {
    event.preventDefault();
    const fullname = $('#fullname-user').val()
    const phoneNumber = $('#phone-user').val()
    const province = $('#select-province option:selected')
    const district = $('#select-district option:selected')
    const ward = $('#select-ward option:selected')
    const address = $('#address-user').val()
    const note = $('#user-note').val()

    let addressInfo = {};
    addressInfo.full_name = fullname
    addressInfo.address_text = address + ', ' + ward.text() + ', ' + district.text() + ', ' + province.text();
    addressInfo.phone_number = phoneNumber
    addressInfo.note = note
    addressInfo.province_id = province.val()
    addressInfo.district_id = district.val()
    addressInfo.ward_id = ward.val()
    console.log(addressInfo)

    $.ajax({
        url: '/api/address/',
        type: 'POST',
        data: {addressInfo: JSON.stringify(addressInfo)},
        success: function () {
            $('#checkout-address-message')
                .attr('class', '')
                .addClass('text-success')
                .html('Add address successfully');
            setTimeout(function () {
                $('#checkout-address-message').html('');
            }, 2000)
        },
        error: function () {
            $('#checkout-address-message')
                .attr('class', '')
                .addClass('text-danger')
                .html('Add address an error occur');
            setTimeout(function () {
                $('#checkout-address-message').html('');
            }, 2000)

        }
    })

    // $.post('/api/address/',)
    //     .done(function(){
    //     })

    $('#show-address-delivery').html(addressInfo.phone_number + ', ' + addressInfo.full_name + ', ' + addressInfo.address_text);
    $.get('/api/address/', function (data) {
        let html = ``;
        data.slice(0).reverse().map(addr => {
            html += `<option value="${addr._id}" >${addr.phone_number},${addr.full_name},${addr.address_text}</option>`
        })
        $('#select-address-delivery').html(html);

        console.log($('#select-address-delivery option:selected').val())

    })

})

