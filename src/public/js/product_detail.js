
//JQuery use to show status of product
$('input:radio[name="size"]').change(
    function(){
        if (this.checked) {
            const productID = $('[name="idProduct"]').val();
            const sizeID = $(this).val();
            let URL = '/api/products/'+productID
            $.get(URL,function ({product}){

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

//Jquery rate
$('input:radio[name="rating"]').change(
    function(){

        // if (this.checked) {
        //     const productID = $('[name="idProduct"]').val();
        //     const sizeID = $(this).val();
        //     let URL = '/api/products/'+productID
        //     $.get(URL,function ({product}){
        //         console.log(product)
        //         const index = product.product_detail.findIndex(x=>x.size_id===sizeID);
        //         const status = document.getElementById("status")
        //
        //         if (product.product_detail[index].remaining_amount===0){
        //             status.innerHTML="Hết hàng"+product.product_detail[index].size_id;
        //         }
        //         else {
        //             status.innerHTML="Còn hàng"+product.product_detail[index].size_id;
        //         }
        //         console.log(product.product_detail[index].remaining_amount)
        //         $('#remain').text(product.product_detail[index].remaining_amount);
        //         $('[name="qty"]').attr("max",product.product_detail[index].remaining_amount)
        //
        //
        //
        //     })
        // }
    });
//jquery review
$('#review-form').submit(function (event){
    event.preventDefault()
    const rate = $('[name = "rating"]:checked').val();

})

//Jquery comment
$('#comment-form').submit(function (event){
    event.preventDefault()
    const  nameGuest = $('#guestname').val();
    const commentContent = $('#content-comment').val();
    const productID = $('[name="idProduct"]').val();

    let comment = {};
    comment.guest_name=nameGuest;
    comment.comment_content=commentContent;


    $.post('/api/products/comment', {productID:productID, comment: JSON.stringify(comment)}).done(function (data){
        console.log(data)
        $.get('/api/products/comment/'+productID,function (data){
            renderComment(data.comments.reverse());
        })
    })


})

//
const renderComment =  function (commentArr){
    let html =``
    commentArr.map(data=>{
        html+=`<div class="card mb-5">
                    <div class="card-header" style="display: inline">

                        <img style="width: 40px; height: 40px; border-radius: 50%; border: #0a0a0a solid; display: inline"
                             src="//bizweb.dktcdn.net/thumb/1024x1024/100/339/085/products/stan-smith-shoes-white-cq2206-01-standard.jpg?v=1545145114263"
                             alt="avatar">

                        <p class="card-title" style="display: inline">
                            ${data.guest_name}
                        </p>


                    </div>

                    <p class="w-100 card-text p-3" style="word-wrap: break-word">
                        ${data.comment_content}
                    </p>

                </div>`
    })

    $('#comments-product').html(html);
}

//Show comment
$('#show-comments').click(function (event){
    event.preventDefault()
    const productID = $('[name="idProduct"]').val();
    console.log(productID   )
    loadComment(productID)
})

//Render when load page
const loadComment = function (productID){
    $.get('/api/products/comment/'+productID,function (data){
        renderComment(data.comments.reverse());
    })
}
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
                dataCart.price
                isHas = true
            }
            console.log(typeof dataCart.product._id)
        })
        if (!isHas){
            cart.push({product: data.product, size: data.size, qty: +qty});
        }

        window.localStorage.setItem("cart",JSON.stringify(cart))
        window.alert("Successfully add item!")

        convertHTML(cart);

    })
})
//Product detail
// $('#product-detail').click(function (){
//     let URL = '/api/products/'
//     const productID = $('[name="idProduct"]').val();
//
//     URL += productID;
//     let html=``;
//     $.get(URL, function (data){
//         data.product.images_detail_url.map((data)=>{
//             html +=``
//         })
//         $('#p-detail-content').html(html);
//     })
//
// })


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

//Jquery product related
$(document).ready(function (){
    const productID = $('[name="idProduct"]').val();

    $.get('/api/products/'+productID,function (data){
        console.log(data)
        $.get('/api/products/product-related',{categoryID: data.product.category_id,
            brandID: data.product.brand_id,
            price: data.product.price.price_value},function (productsRelated){

            let slideNumber = Math.floor(productsRelated.length/4)<4?Math.floor(productsRelated.length/4)+1:Math.floor(productsRelated.length/3);

            let html=``
            for (let i=0; i<slideNumber;i++){
                //header slider
                if (i===0){
                    html+=`<div class="carousel-item active">
                            <div class="row">`
                }
                else {
                    html+=`<div class="carousel-item">  
                            <div class="row">`
                }
                //content slider
                for (let j=0; j<4 && typeof productsRelated[i*4+j] !=='undefined';j++){
                    console.log(productsRelated[i*3+j])
                    html += `
                    <div class="col-md-3">
                        <div class="card mb-2">
                             <div class="product-shoe-info shoe">
                                <div class="men-pro-item">
                                    <div class="men-thumb-item">
                                        <img src="${productsRelated[i*3+j].image_show_url}" alt="" class="w-75 h-75">
                                        <div class="men-cart-pro">
                                            <div class="inner-men-cart-pro">
                                                <a href="/products/${productsRelated[i*3+j].product_url}"
                                                   class="link-product-add-cart">Quick
                                                    View</a>
                                            </div>
                                        </div>

                                    </div>
                                    <div class="item-info-product">
                                        <h5>
                                            <br>
                                            <a href="/products/${productsRelated[i*3+j].product_url}">
                                                ${productsRelated[i*3+j].name}
                                            </a>
                                        </h5>
                                        <div class="info-product-price">
                                            <div class="grid_meta">
                                                <div class="product_price">
                                                    <div class="grid-price ">
                                                    <span class="money ">
                                                        ${productsRelated[i*3+j].price.string_price}
                                                        
                                                    </span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div class="clearfix"></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>`
                }
                html +=`<div class="clearfix"></div>
                        </div>
                    </div>`
            }
            $('#carousel-related').html(html)
        })

    })
})