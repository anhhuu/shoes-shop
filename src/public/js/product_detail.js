
//JQuery use to show status of product
$('input:radio[name="size"]').change(
    function(){
        console.log($(this).val());
        if (this.checked) {
            const productID = $('[name="idProduct"]').val();
            const sizeID = $(this).val();
            let URL = '/api/products/'+productID
            $.get(URL,function ({product}){
                console.log(product)
                const index = product.product_detail.findIndex(x=>x.size_id===sizeID);
                const status = document.getElementById("status")

                if (product.product_detail[index].remaining_amount===0){
                    status.innerHTML="Hết hàng"+product.product_detail[index].size_id;
                }
                else {
                    status.innerHTML="Còn hàng"+product.product_detail[index].size_id;
                }
                console.log(product.product_detail[index].remaining_amount)
                $('#remain').text(product.product_detail[index].remaining_amount);
                $('[name="qty"]').attr("max",product.product_detail[index].remaining_amount)



            })
        }
    });

//plus the qty of product
$('#plus-qty').click(function (){
    let qty = $('[name="qty"]').val();
    console.log(qty)
    const remain = $('#remain').text();
    console.log("remain")
    console.log(remain)

    console.log(+qty<=+remain)

    if (+qty<=+remain){

        $('[name="qty"]').val(+qty+1);
    }

})
//minus the qty of product
$('#minus-qty').click(function (){
    let qty = $('[name="qty"]').val();
    console.log(qty)
    if (qty>1){
        $('[name="qty"]').val(+qty-1);
    }


})


const chooseSize = function (idSize, prod ) {
    const product = JSON.parse(prod);
    const status = document.getElementById("status")
    let size
    product.product_detail.map((sizedata)=>{
        if (sizedata.size_id === idSize){
            size = sizedata;
        }
    })
    if (size.remaining_amount>0){
        status.innerHTML="Còn hàng"+idSize;
    }
    else
        status.innerHTML="Hết hàng"+idSize;
    console.log(product);
    console.log(size);


}

//jQuery use to update and show cart
$('#add-to-cart').submit(function (event){
    event.preventDefault();
    let URL = '/api/products/'
    const productID = $('[name="idProduct"]').val();
    const sizeID = $('[name = "size"]:checked').val();
    const color = $('[name = "color"]:checked').val();
    const qty = $('[name = "qty"]').val();

    URL += productID + '?size='+sizeID;

    (window.localStorage.getItem("cart")?JSON.parse(window.localStorage.getItem("cart")):window.localStorage.setItem("cart",JSON.stringify([])));
    const cart=JSON.parse(window.localStorage.getItem("cart"));

    $.get(URL, function (data){
        let isHas = false;
        cart.map((dataCart)=>{
            if(dataCart.product._id===data.product._id && dataCart.size._id===data.size._id){
                dataCart.qty += +qty;
                isHas = true
            }
            console.log(typeof dataCart.product._id)
        })
        if (!isHas){
            cart.push({product: data.product, size: data.size, qty: +qty});
        }

        window.localStorage.setItem("cart",JSON.stringify(cart))

        convertHTML(cart);

    })
})

//function use to delete cartitem
//had a problem
const removeCartItem = function (idProd, idSize){

    const cart = JSON.parse(window.localStorage.getItem("cart"));
    const index =cart.findIndex(x=>x.product._id === idProd && x.size._id===idSize)
    console.log(index);
    cart.splice(index,1)
    console.log(cart)
    window.localStorage.setItem("cart",JSON.stringify(cart))

    convertHTML(cart);
    $("#cart-table").html( html)

}

const convertHTML = function (cart){
    let html = ``;
    let totalFee=0;
    cart.map((dataCart)=>{
        totalFee += dataCart.product.price.price_value*dataCart.qty;
        html+=` <tr id="${dataCart.product._id}">
                                        <td><img src=${dataCart.product.image_show_url}  style="width: 50px; height: 50px"/> </td>
                                        <td>${dataCart.product.name}</td>
                                        <td>${dataCart.size.text}</td>
                                        <td>In stock</td>
                                        <td><input class="form-control" type="text" value="${dataCart.qty}" width="50px" /></td>
                                        <td class="text-right">${dataCart.product.price.string_price}</td>
                                        <td class="text-right"><button class="btn btn-sm btn-danger" onclick="removeCartItem('${dataCart.product._id}','${dataCart.size._id}')"><i class="fa fa-trash"></i> </button> </td>
                                    </tr>`
    })
    html +=` <tr>
                                    <td></td>
                                    <td></td>
                                    <td></td>
                                    <td></td>
                                    <td>Sub-Total</td>
                                    <td class="text-right">${totalFee}</td>
                                </tr>
                                <tr>
                                    <td></td>
                                    <td></td>
                                    <td></td>
                                    <td></td>
                                    <td>Shipping</td>
                                    <td class="text-right">69000</td>
                                </tr>
                                <tr>
                                    <td></td>
                                    <td></td>
                                    <td></td>
                                    <td></td>
                                    <td><strong>Total</strong></td>
                                    <td class="text-right"><strong>${totalFee + 69000}</strong></td>
                                </tr>`
    $("#cart-table").html( html)
}