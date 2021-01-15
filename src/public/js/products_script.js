const BASE_URL = '/api/products';
let range = [1000000, 20000000];

let userOptions = {
    range
};

const alert = `    <div class="alert alert-warning w-100" role="alert">
                    <h4 class="alert-heading">There are no products with those conditions</h4>
                    </div>`

function getQueryString(object) {

    const range = object.range;
    delete object['range'];

    Object.keys(object).forEach(key => {
        if (!object[key]) {
            delete object[key];
        }
    });

    return '?' + $.param(object, true) + (range ? '&range=[' + range.join(',') + ']' : '');
}

function resetProducts() {
    $('.products').prop('class', 'products');
}

function getProducts(pageOrURL, options) {
    let URL = BASE_URL;

    if (typeof pageOrURL !== 'string') {
        if (pageOrURL && pageOrURL > 1) {
            URL += getQueryString({page: pageOrURL});
        }

        if (options && Object.keys(options).length > 0) {
            URL += getQueryString(options);
        }

        userOptions.page = +pageOrURL;

    } else {
        URL = pageOrURL;
        const tokens = pageOrURL.split('&');

        for (let i = 0; i < tokens.length; i++) {
            if (/page=\d+/.test(tokens[i])) {
                userOptions.page = +(tokens[i].split('=')[1]);
                break;
            }
        }

    }


    $.get(URL, function (data) {

        if (data.products.length === 0) {
            $('#products__section').removeClass("products");
            $('#products__section').addClass('d-flex justify-content-center align-items-center w-100 h-100');
            return $('#products__section').html(alert);
        } else {
            $('#products__section').removeClass('d-flex justify-content-center align-items-center w-100 h-100');
            $('#products__section').addClass('products');
        }

        const result = data.products.map(function (item) {
            let priceHTML = ``
            if (Math.floor(item.discount * 100) === 0) {

                priceHTML =
                    `<div>
                        <span class="money ">${(new Intl.NumberFormat('vi-VN', {style: 'currency', currency: 'VND'}))
                            .format(Math.floor(item.price.price_value * (1 - item.discount) / 1000) * 1000).toString()}
                        </span>
                    </div>`

            } else {
                priceHTML = `
                    <div class="d-flex">
                        
                         <span class="money mr-3">
                                ${(new Intl.NumberFormat('vi-VN', {style: 'currency', currency: 'VND'}))
                        .format(Math.floor(item.price.price_value * (1 - item.discount) / 1000) * 1000).toString()} 
                        </span>
                        <p><span > ${item.price.string_price}</span></p>
                    </div>`
            }
            return `
           <div class="product-men">
                 <div class="product-shoe-info shoe">
                       <div class="men-pro-item">
                            <div class="men-thumb-item">         
                                        
                                        ${item.discount > 0 ?
                `<div class="discount-label red text-center">
                                               <span>${Math.floor(item.discount * 100)} %</span>
                                           </div>` : ''
            }           
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
                                                    ${priceHTML}
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
        resetProducts();
        $('.products').html(result.join(' '));

        let html = '';
        //Get next 4 pages;
        let options = data.options;
        options = {
            ...options,
            ...getUserOptions()
        }
        html += `<a href="${BASE_URL}${getQueryString({...options, page: 1})}">&laquo;</a>`

        if (+options.currentPage - 3 > 1) {
            html += `<a href="#" class="disabled">...</a>`;
        }
        for (let j = +options.currentPage - 3; j <= +options.currentPage + 3; j++) {

            if (j < 1 || j > options.numOfPage) continue;

            html += `<a href = "${BASE_URL}${getQueryString({
                ...options,
                page: j
            })}"  ${j === options.currentPage ? 'class="active"' : ''} >${j}</a>`;

        }
        if (+options.currentPage + 3 < options.numOfPage) {
            html += `<a href="#" class="disabled">...</a>`
        }
        html += `<a href="${BASE_URL}${getQueryString({...options, page: options.numOfPage})}">&raquo;</a>`

        $('#pagination').html(html);

        $('#pagination a').click(function (e) {
            e.preventDefault();
            getProducts(($(this).attr('href')), options);
        });

    });

}

function renderBrands() {
    const brandChecks = $('#brand-checks');

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
    let options = {
        discount: discountOptions,
        brand,
        keyword,
        page: 1
    };

    const order_by = $('#filter').val();
    if (order_by !== "") {
        options = {
            ...options,
            order_by
        }
    }

    userOptions = {
        ...userOptions,
        ...options,
        range
    }

    return userOptions
}

$(window).load(function () {
    //Load page 1 when the browser have fully loaded

    const BROWSER_URL = window.location.href;
    $('#cd-search').off('submit');

    let timerHandler;


    $(function () {
        $("#slider-range").slider({
            range: true,
            min: 1000000,
            max: 20000000,
            step: 10000,
            values: [1000000, 20000000],
            slide: function (event, ui) {
                userOptions = {
                    ...userOptions,
                    range: ui.values
                }

                const [start, end] = ui.values;
                range = [start, end];
                $('#amount2').val(start + ' VNĐ ' + '    ' + end + ' VNĐ')

                clearTimeout(timerHandler);
                timerHandler = setTimeout(() => {
                    userOptions = getUserOptions();
                    getProducts(1, userOptions)
                    // console.log('complete');
                }, 1500);

            }
        });

        $('#amount2').val(1000000 + ' VNĐ ' + '    ' + 20000000 + ' VNĐ')
    });

    $('#cd-search').submit(function (e) {
        e.preventDefault();
        userOptions = {
            ...userOptions,
            keyword: $(this).find('input').val()
        }
        getProducts(1, userOptions);

    });


    if (BROWSER_URL.includes('?')) {
        const keyword = BROWSER_URL.split('?')[1].split('=')[1];
        userOptions = {
            ...userOptions,
            keyword
        }
        getProducts(1, userOptions)
    } else {
        getProducts(1);
    }
    renderBrands();

    const searchForm = $("#local-search");
    searchForm.submit(function (e) {
        e.preventDefault();

        userOptions = {
            ...userOptions,
            ...getUserOptions()
        }

        getProducts(1, userOptions);
    })

    $("#brand-checks ").change(function () {
        userOptions = {
            ...userOptions,
            ...getUserOptions()
        }
        getProducts(1, userOptions);
    })

    $('#discount-options').change(function () {
        userOptions = {
            ...userOptions,
            ...getUserOptions()
        }

        getProducts(1, userOptions);
    });
    setUpAutoCallRequestAfterAnInterval(500);

})

function setUpAutoCallRequestAfterAnInterval(interval) {
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
    function doneTyping() {
        userOptions = getUserOptions();
        getProducts(userOptions.page || 1, userOptions);
    }
}

$('#filter').change(function () {
    userOptions = getUserOptions();
    getProducts(userOptions.page || 1, userOptions);

});

