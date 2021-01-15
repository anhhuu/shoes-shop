
const socket = io();
//JQuery use to show status of product
$('input:radio[name="size"]').change(
    function () {
        if (this.checked) {
            const productID = $('[name="idProduct"]').val();
            const sizeID = $(this).val();
            let URL = '/api/products/' + productID
            $.get(URL, function ({product}) {

                const index = product.product_detail.findIndex(x => x.size_id === sizeID);
                const status = document.getElementById("status")

                if (product.product_detail[index].remaining_amount === 0 || product.product_detail[index].remaining_amount === '0') {
                    status.innerHTML = "Hết hàng";
                    $('#pd-add-to-cart').attr('disabled', true);
                    $('[name="qty"]').val(1);
                } else {
                    status.innerHTML = "Còn hàng";
                    $('#pd-add-to-cart').attr('disabled', false);
                    $('[name="qty"]').val(1);
                }

                $('#remain').text(product.product_detail[index].remaining_amount);
                $('[name="qty"]').attr("max", product.product_detail[index].remaining_amount).attr("min", 1)


            })
        }
    });
let comments = [];


//Jquery comment
$('#comment-form').submit(function (event) {
    event.preventDefault()
    const nameGuest = $('#guestname').val();
    const commentContent = $('#content-comment').val();
    const productID = $('[name="idProduct"]').val();
    $.get('/api/users/image', function (data){

        let comment = {};
        comment.img = data.img
        comment.guest_name = nameGuest;
        comment.comment_content = commentContent;
        comment.createdAt = new Date();

        $.post('/api/products/comment', {productID: productID, comment: JSON.stringify(comment)}).done(function (data) {
            commentSocket($("#guestname").val(), $("#content-comment").val(), comment.createdAt, comment.img);

        })
    }).fail(function (){
        let comment = {};
        comment.guest_name = nameGuest;
        comment.img =comment.img?comment.img:"//bizweb.dktcdn.net/thumb/1024x1024/100/339/085/products/stan-smith-shoes-white-cq2206-01-standard.jpg?v=1545145114263"
        comment.comment_content = commentContent;
        comment.createdAt = new Date();

        $.post('/api/products/comment', {productID: productID, comment: JSON.stringify(comment)}).done(function (data) {
            commentSocket($("#guestname").val(), $("#content-comment").val(), comment.createdAt)
        })
    })



})

//render Comment
const renderComment = function (commentArr, pageComment) {
    let html = ``
    const productID = $('[name="idProduct"]').val();
    const page = +pageComment > 1 ? +pageComment : 1 || 1;
    const limit = 5;
    const pages = commentArr.length % limit > 0 ? Math.floor(commentArr.length / limit) + 1 : Math.floor(commentArr.length / limit)
    // console.log(pages)
    const pageStart = (page - 1) * limit;
    const pageEnd = page * limit

    for (let index = pageStart; index < pageEnd && index < commentArr.length; index++) {
        const date = (new Date(commentArr[index].createdAt)).toLocaleString()
        // console.log(commentArr[index])
        html += `<div class="card mb-5">
                    <div class="card-header" style="display: inline">

                        <img class="avatar-comment" width="10" height="10"
                             src="${commentArr[index].img}"
                               alt="avatar">

                        <h4 class="card-title" style="display: inline">
                            ${commentArr[index].guest_name}
                        </h4>
                        <p>${date}</p>
                    </div>

                    <p class="w-100 card-text p-3" style="word-wrap: break-word">
                        ${commentArr[index].comment_content}
                    </p>

                </div>`
    }

    if (page === 1) {
        html +=
            `<nav aria-label="Page navigation" class="mb-5">
            <ul class="pagination justify-content-center mb-5">               
                <li class="page-item"><a class="page-link active" >${page}</a></li>`

        if (page + 1 <= pages) {
            html += `<li class="page-item"><a class="page-link" onclick="loadComment('${productID}','${page + 1}')" >${page + 1}</a></li>`
        }

        if (page + 2 <= pages) {
            html += `<li class="page-item"><a class="page-link" onclick="loadComment('${productID}','${page + 2}')" >${page + 2}</a></li>`
        }

        html += `<li class="page-item">
                    <a class="page-link"  onclick="loadComment('${productID}','${pages}')" > >> </a>
                </li> 
            </ul>
        </nav>`
    } else {
        if (page === pages) {
            html +=
                `<nav aria-label="Page navigation" class="mb-5">
            <ul class="pagination justify-content-center mb-5">
                <li class="page-item">
                    <a class="page-link" onclick="loadComment('${productID}','${1}')" ><<</a>
                </li>`
            if (page - 2 > 0) {
                html += `<li className="page-item"><a className="page-link" onclick="loadComment('${productID}','${page - 2}')" >${+page - 2}</a></li>`
            }
            if (page - 1 > 0) {
                html += `<li className="page-item"><a className="page-link" onclick="loadComment('${productID}','${page - 1}')" >${+page - 1}</a></li>`
            }

            html += `<li class="page-item"><a class="page-link active"  onclick="loadComment('${productID}','${page}')">${page}</a></li>
                </ul>
        </nav>`
        } else {
            html +=
                `<nav aria-label="Page navigation" class="mb-5">
            <ul class="pagination justify-content-center mb-5">
                <li class="page-item">
                    <a class="page-link" onclick="loadComment('${productID}','${1}')" ><<</a>
                </li>
                <li class="page-item"><a class="page-link" onclick="loadComment('${productID}','${+page - 1}')">${+page - 1}</a></li>
                <li class="page-item"><a class="page-link active" >${page}</a></li>
                <li class="page-item"><a class="page-link" onclick="loadComment('${productID}','${+page + 1}')">${+page + 1}</a></li>
                <li class="page-item">
                    <a class="page-link" onclick="loadComment('${productID}','${+pages}')"> >> </a>
                </li>
            </ul>
        </nav>`
        }
    }

    $('#comments-product').html(html);
}

//Show comment
$('#show-comments').click(function (event) {
    event.preventDefault()
    const comment = $('#show-comments');
    // console.log("show");
    if (comment.text() === "View comment") {
        const productID = $('[name="idProduct"]').val();

        loadComment(productID)
        comment.text('Hidden comment')
    } else {
        $('#comments-product').html('');
        comment.text("View comment")
    }


})


//Render when load page
const loadComment = function (productID, pageComment) {

    $.get('/api/products/comment/' + productID, function (data) {
        renderComment(data.comments.reverse(), pageComment);
    })
}

//jquery review
$('#review-form').submit(function (event) {
    event.preventDefault()
    const rate = $('[name = "rating"]:checked').val();
    const fullname = $('#usernamereivew').val();
    const review = $('#reviewcontent').val();
    const productID = $('[name="idProduct"]').val();


    $.get('/api/users/image', function (data){

        let rating = {};
        rating.img = data.img
        rating.fullName = fullname;
        rating.product_id = productID;
        rating.rate = rate;
        rating.review = review;

        $.post('/api/products/review', {rating: JSON.stringify(rating)}).done(function (data) {
            /*if ($('#show-review').text!=="Hidden reviews"){
                $.get('/api/products/comment/'+productID,function (data){
                    renderComment(data.comments.reverse());
                })
                $('#show-review').text("Hidden reviews")
                $('#reviewcontent').val('');
            }*/

            const productID = $('[name="idProduct"]').val();

            $('#message-rate').html(
                `<div class="alert alert-success alert-dismissible show w-100 text-center " role="alert">
                       Successfully
                   <button type="button" class="close" data-dismiss="alert" aria-label="Close">
                       <span aria-hidden="true">&times;</span>
                   </button>
               </div>`).animate({opacity: '1'}, "slow");

            setTimeout( function (){$('#message-rate').animate({opacity: '0.1'}, "slow").html('')},1000)
            loadReview(productID);

        })
            .fail(function (xhr, status, error) {

                $('#message-rate').html(
                    `<div class="alert alert-danger alert-dismissible show  w-100 text-center" role="alert">
                 ${xhr.responseJSON.message}
                   <button type="button" class="close" data-dismiss="alert" aria-label="Close">
                       <span aria-hidden="true">&times;</span>
                   </button>
               </div>`).animate({opacity: '1'}, "slow");

                setTimeout( function (){$('#message-rate').animate({opacity: '0.1'}, "slow").html('')},1000)

            });
    }).fail(function (xhr, status, error){
        let rating = {};
        rating.img = data.img
        rating.fullName = fullname;
        rating.product_id = productID;
        rating.rate = rate;
        rating.review = review;
        rating.img =rating.img?rating.img:"//bizweb.dktcdn.net/thumb/1024x1024/100/339/085/products/stan-smith-shoes-white-cq2206-01-standard.jpg?v=1545145114263"


        $.post('/api/products/review', {rating: JSON.stringify(rating)}).done(function (data) {

            /*if ($('#show-review').text!=="Hidden reviews"){
                $.get('/api/products/comment/'+productID,function (data){
                    renderComment(data.comments.reverse());
                })
                $('#show-review').text("Hidden reviews")
                $('#reviewcontent').val('');
            }*/
            const productID = $('[name="idProduct"]').val();

            loadReview(productID);
            $('#message-rate').html(
                `<div class="alert alert-success alert-dismissible show w-100 text-center" role="alert">
                 Successfully
                   <button type="button" class="close" data-dismiss="alert" aria-label="Close">
                       <span aria-hidden="true">&times;</span>
                   </button>
               </div>`).animate({opacity: '1'}, "slow");

            setTimeout( function (){$('#message-rate').animate({opacity: '0.1'}, "slow").html('')},1000)
        })
            .fail(function (xhr, status, error) {
                console.log(xhr.responseJSON.message);

                $('#message-rate').html(
                    `<div class="alert alert-danger alert-dismissible fade show  w-100 text-center" role="alert">
                 ${xhr.responseJSON.message}
                   <button type="button" class="close" data-dismiss="alert" aria-label="Close">
                       <span aria-hidden="true">&times;</span>
                   </button>
               </div>`).animate({opacity: '1'}, "slow");

                setTimeout( function (){$('#message-rate').animate({opacity: '0.1'}, "slow").html('')},1000)
            });
    })





})

//render reviews
const renderReview = function (reviewArr, pageReview, pages) {
    let html = ``
    const productID = $('[name="idProduct"]').val();
    const page = +pageReview > 1 ? +pageReview : 1 || 1;
    const limit = 2;

    const pageStart = (page - 1) * limit;
    const pageEnd = page * limit

    for (let index = 0; index < pageEnd && index < reviewArr.length; index++) {
        const date = (new Date(reviewArr[index].createdAt)).toLocaleString()


        html += `<div class="card mb-5">
                    <div class="card-header" style="display: inline">

                        <img class="avatar-comment"
                     
                             src="${reviewArr[index].img}"
                             alt="avatar">

                        <h4 class="card-title" style="display: inline">
                            ${reviewArr[index].user_full_name}
                        </h4>
                        <p>${date}</p>
                    
                    <div class="rating " >`
        for (let index1 = 5; index1 >= 1; index1--) {
            if (reviewArr[index].rate === index1) {
                html += `<input type="radio"  value="${index1}" readonly checked><label htmlFor="${index1}">☆</label>`
            } else {
                html += `<input type="radio"  value="${index1}" readonly><label htmlFor="${index1}">☆</label>`
            }


        }
        html += `</div>
                    </div>

                    <p class="w-100 card-text p-3" style="word-wrap: break-word">
                        ${reviewArr[index].review}
                    </p>

                </div>`
    }

    if (page === 1) {
        html +=
            `<nav aria-label="Page navigation" class="mb-5">
            <ul class="pagination justify-content-center mb-5">               
                <li class="page-item"><a class="page-link active" >${page}</a></li>`

        if (page + 1 <= pages) {
            html += `<li class="page-item"><a class="page-link" onclick="loadReview('${productID}','${page + 1}')" >${page + 1}</a></li>`
        }

        if (page + 2 <= pages) {
            html += `<li class="page-item"><a class="page-link" onclick="loadReview('${productID}','${page + 2}')" >${page + 2}</a></li>`
        }

        html += `<li class="page-item">
                    <a class="page-link"  onclick="loadReview('${productID}','${pages}')" > >></a>
                </li>
            </ul>
        </nav>`
    } else {
        if (page === pages) {
            html +=
                `<nav aria-label="Page navigation" class="mb-5">
            <ul class="pagination justify-content-center mb-5">
                <li class="page-item">
                    <a class="page-link" onclick="loadReview('${productID}','${1}')" > <<</a>
                </li>`
            if (page - 2 > 0) {
                html += `<li className="page-item"><a className="page-link" onclick="loadReview('${productID}','${page - 2}')" >${+page - 2}</a></li>`
            }
            if (page - 1 > 0) {
                html += `<li className="page-item"><a className="page-link" onclick="loadReview('${productID}','${page - 1}')" >${+page - 1}</a></li>`
            }

            html += `<li class="page-item"><a class="page-link active"  onclick="loadReview('${productID}','${page}')">${page}</a></li>
                </ul>
        </nav>`
        } else {
            html +=
                `<nav aria-label="Page navigation" class="mb-5">
            <ul class="pagination justify-content-center mb-5">
                <li class="page-item">
                    <a class="page-link" onclick="loadReview('${productID}','${1}')" > <<</a>
                </li>
                <li class="page-item"><a class="page-link" onclick="loadReview('${productID}','${+page - 1}')">${+page - 1}</a></li>
                <li class="page-item"><a class="page-link active" >${page}</a></li>
                <li class="page-item"><a class="page-link" onclick="loadReview('${productID}','${+page + 1}')">${+page + 1}</a></li>
                <li class="page-item">
                    <a class="page-link" onclick="loadReview('${productID}','${+pages}')">>> </a>
                </li>
            </ul>
        </nav>`
        }
    }


    $('#review-product').html(html);
}
//load reviews
const loadReview = function (productID, pageReview) {

    $.get('/api/products/review/' + productID, {page: pageReview}, function (data) {
        renderReview(data.reviews, pageReview, data.pages);
    })
}

$('#show-review').click(function (event) {
    event.preventDefault()
    const reviews = $('#show-review');
    console.log("show");
    if (reviews.text() === "View reviews") {
        const productID = $('[name="idProduct"]').val();

        loadReview(productID)
        reviews.text('Hidden reviews')
    } else {
        $('#review-product').html('');
        reviews.text("View reviews")
    }


})
//plus the qty of product
$('#plus-qty').click(function () {
    let qty = $('[name="qty"]').val();
    const remain = $('#remain').text();


    if (+qty <= +remain) {

        $('[name="qty"]').val(+qty + 1);
    }

})
//minus the qty of product
$('#minus-qty').click(function () {
    let qty = $('[name="qty"]').val();

    if (qty > 1) {
        $('[name="qty"]').val(+qty - 1);
    }


})





//function use to delete cartitem
//had a problem



socket.emit("join-room", `comments/${$('[name="idProduct"]').val()}`);

socket.on(`comments/${$('[name="idProduct"]').val()}`, ({name, message, date,imageURL}) => {
    const SeenComment = $('#show-comments');
    if (SeenComment.text()==='View comment'){
        loadComment($('[name="idProduct"]').val(),1);
        $('#show-comments').text('Hidden comment')
    }
    else{
        renderSingleComment(name, message, date,imageURL);
    }

});


function commentSocket(name, message, date, imageURL) {
    socket.emit(`comments`, {
        message: message,
        productID: $('[name="idProduct"]').val(),
        name: name,
        date: (new Date(date)).toLocaleDateString(),
        imageURL
    });
}

function renderSingleComment(name, message, date, imageURL) {
    $("#comments-product").prepend(`
  <div class="card mb-5">
                    <div class="card-header" style="display: inline">

                        <img class="avatar-comment" src="${imageURL}"
                        alt="avatar">

                        <h4 class="card-title" style="display: inline">
                            ${name}
                        </h4>
                        <p>${date}</p>
                    </div>

                    <p class="w-100 card-text p-3" style="word-wrap: break-word">
                        ${message}
                    </p>

                </div> 
    `)
}

