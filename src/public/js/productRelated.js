//Jquery product related
$(document).ready(function (){
    const productID = $('[name="idProduct"]').val();

    $.get('/api/products/'+productID,function (data){
        // console.log(data)
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
                    html += `
                    <div class="col-md-3">
                        <div class="card mb-2">
                             <div class="product-shoe-info shoe">
                                <div class="men-pro-item">
                                    <div class="men-thumb-item">
                                        <img src="${productsRelated[i*3+j].image_show_url}" alt="" class="w-75 h-75">
                                        <div class= "men-cart-pro">
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