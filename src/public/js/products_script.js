function getProducts(page, userOptions) {
    let URL = '/api/products';
    if (typeof page !== 'string') {
        if (page && page > 1) {
            URL += '?page=' + page;
        }
    } else {
        URL = page;
    }

    console.log(location);

    $.get(URL, function (data) {

        const result = data.products.map(function (item) {
            return `<div class="col-md-3 product-men">
                            <div class="product-shoe-info shoe">
                                <div class="men-pro-item">
                                    <div class="men-thumb-item">
                                        <img src="${item.image_show_url}" alt="">
                                        <div class="men-cart-pro">
                                            <div class="inner-men-cart-pro">
                                                <a href="products/${item.product_url}"
                                                   class="link-product-add-cart">Quick
                                                    View</a>
                                            </div>
                                        </div>

                                    </div>
                                    <div class="item-info-product">
                                        <h5>
                                            <br>
                                            <a href="products/${item.product_url}">
                                                ${item.name}
                                            </a>
                                        </h5>
                                        <div class="info-product-price">
                                            <div class="grid_meta">
                                                <div class="product_price">
                                                    <div class="grid-price ">
                                                    <span class="money ">
                                                        ${item.price.string_price}
                                                        
                                                    </span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div class="clearfix"></div>
                                    </div>
                                </div>
                            </div>
                        </div>`


        });
        $('.product-sec1.row-custom').html(result.join(' '));

        let html = '';
        //Get next 4 pages;
        const options = data.options;

        html += `<a href="/api/products?page=1&brand=${options.brandChecked}">&laquo;</a>`

        if (parseInt(options.currentPage) - 3 > 1) {
            html += `<a href="#" class="disabled">...</a>`;

        }
        for (let j = parseInt(options.currentPage) - 3; j <= parseInt(options.currentPage) + 3; j++) {

            if (j < 1) {

                continue;
            }


            if (j > options.numOfPage) {

                continue;
            }


            if (j == options.currentPage) {

                if (options.brandChecked) {
                    html += `<a href = "/api/products?page= ${j} &brand=${options.brandChecked}"  class = "active" >${j}< /a>`;

                } else {
                    html += `<a href="/api/products?page=${j} " class="active">
            ${j} 
            </a>`
                }
            } else {
                if (options.brandChecked) {
                    html += `<a href="/api/products?page=${j}&brand=${options.brandChecked}">${j} </a>`
                } else {
                    html += `<a href="/api/products?page=${j} ">${j}</a>`
                }
            }
        }
        if (parseInt(options.currentPage) + 3 < options.numOfPage) {
            html += `<a href="#" class="disabled">...</a>`
        }
        html += `<a href="/api/products?page=${options.numOfPage}&brand=${options.brandChecked}">&raquo;</a>`

        $('#pagination').html(html);

        $('#pagination a').click(function (e) {
            e.preventDefault();
            getProducts(($(this).attr('href')), userOptions);
        });

    });


}

getProducts(1);