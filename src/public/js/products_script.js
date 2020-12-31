const BASE_URL = '/api/products';
let userOptions = {

};

function getQueryString(object) {
    const query = Object.keys(object).map(key => {
        if (!object[key]) return '';
        if (Array.isArray(object[key])) {
            return `${key}=[${object[key].join(',')}]`
        }
        return `${key}=${object[key]}`
    }).join('&');

    return '?' + query;
}

function getProducts(page, userOptions) {
    let URL = BASE_URL;

    if (typeof page !== 'string') {
        if (page && page > 1) {
            URL += getQueryString({page});
        }
    } else {
        URL = page;
    }

    if (userOptions && Object.keys(userOptions).length > 0) {
        URL += getQueryString(userOptions);
    }

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

        html += `<a href="${BASE_URL}${getQueryString({page: 1, ...userOptions})}">&laquo;</a>`

        if (+options.currentPage - 3 > 1) {
            html += `<a href="#" class="disabled">...</a>`;
        }
        for (let j = +options.currentPage - 3; j <= +options.currentPage + 3; j++) {

            if (j < 1) continue;
            if (j > options.numOfPage) continue;
            html += `<a href = "${BASE_URL}${getQueryString({page: j, ...userOptions})}"  class = "${j === options.currentPage?'active': ''}" >${j}</a>`;

        }
        if (+options.currentPage + 3 < options.numOfPage) {
            html += `<a href="#" class="disabled">...</a>`
        }
        html += `<a href="${BASE_URL}${getQueryString({page: options.numOfPage, ...userOptions})}">&raquo;</a>`

        $('#pagination').html(html);

        $('#pagination a').click(function (e) {
            e.preventDefault();
            getProducts(($(this).attr('href')), userOptions);
        });

    });

}

function renderBrands() {
    const brandChecks = $('#brand-checks');
    console.log(BASE_URL)
    $.get(`${BASE_URL}/brands`, function (data) {
        let count = 0;

        const htmlCode = data.reduce((acc, brand) => {
            count++;
            return acc + `
            <li>
                 <input type="radio" name="brand-check" class="checked" value="${brand.brand_url}">
                <span class="span">
                ${brand.name}
                </span>
                </a>
            </li>
                `
        }, '');

        brandChecks.html(htmlCode)

    });
}


function getUserOptions() {
    const discountOptions = [];

    $("#discount-options input:checked").each(function (index) {
        discountOptions.push($(this).val());
    })

    const brand = $('#brand-checks input:checked').val();
    const keyword = $('#local-search input').val()
    return {
        discount: discountOptions,
        brand,
        keyword,
        page: 1
    }
}

$(window).load(function () {
    //Load page 1 when the browser have fully loaded
    renderBrands();
    getProducts(1);

    const searchForm = $("#local-search");
    searchForm.submit(function (e) {
        e.preventDefault();
        const userOptions = getUserOptions();

        getProducts(1, userOptions);
    })

    $("#brand-checks ").change(function(){
        userOptions = getUserOptions();
        getProducts(1,userOptions);
    })

    $('#discount-options').change(function (){
       userOptions = getUserOptions();
       getProducts(1,userOptions);
    });

    setUpAutoCallRequestAfterAnInterval(500);

})

function setUpAutoCallRequestAfterAnInterval(interval){
    //setup before functions
    let typingTimer;                //timer identifier
    const doneTypingInterval = interval;  //time in ms, 5 second for example
    const $input = $('#local-search input');
//on keyup, start the countdown
    $input.on('keyup', function () {
        clearTimeout(typingTimer);
        typingTimer = setTimeout(doneTyping, doneTypingInterval);
    });

    //on keydown, clear the countdown
    $input.on('keydown', function () {
        clearTimeout(typingTimer);
    });


//user is "finished typing," do something
    function doneTyping () {
        userOptions = getUserOptions();
        console.log(userOptions);

        getProducts(userOptions.page || 1, userOptions);
    }
}

