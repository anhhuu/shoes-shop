
const showDetailInvoice = function (invoiceID){
    $('#body-invoice-detail').html('')
    $.get('/api/users/invoices/'+invoiceID, function(data){
        let html=``;

        data.invoice_items.map((item,index)=>{
            html+=`    <tr>
                            <th scope="row">${index+1}</th>
                            <td class="text-center"><a href="/products/${item.product.product_url}" 
                                target="_blank"><img src="${item.product.image_show_url}" 
                                alt="" width="100" height="100"></a></td>
                            <td class="text-center"><a href="/products/${item.product.product_url}" 
                            target="_blank">${item.product.name}</a></td>
                            
                            <td class="text-center">${item.size}</td>
                            <td class="text-center">${item.qty}</td>
                            <td class="text-center">${new Intl.NumberFormat('vi-VN', 
                                                                { style: 'currency', currency: 'VND' })
                                .format(item.product.price.price_value*(1-item.product.discount))}
                            </td>
                            <td class="text-center"><p>${new Intl.NumberFormat('vi-VN', 
                                                                        { style: 'currency', currency: 'VND' })
                                .format(item.qty*item.product.price.price_value*(1-item.product.discount))}</p>
                            </td>
                        </tr>
                        `
        })

        $('#body-invoice-detail').html(html).animate({height:'show'},"slow")
    })
}

const showDeleteNotif = function (invoiceID, pageCur){
    let page = $('#page-cur').text()? $('#page-cur').text(): 1;
    $('#body-invoice-notif').html(`<h4>IS YOU MAKE SURE CANCEL THIS INVOICE?</h4>`)
    $('#footer-invoice-notif').html(`<button type="button" data-dismiss="modal" 
            onclick="deleteInvoice('${invoiceID}','${page}')" class="btn btn-secondary">Cancel invoice</button>
                <button type="button" class="btn btn-primary" data-dismiss="modal">Close</button>
`)

}

const deleteInvoice = function(invoiceID, pageCur){
    $.ajax({
            url: '/api/users/invoices/'+invoiceID+'/delete',
            type:'PUT',
            success: function (result) {
                const page= pageCur|| 1;
                pagination(+page);
            }
        }
    )


}

const pagination = function (page){

    $.get('/api/users/invoices',{page:page, limit:1}, function(data){
        let html=``;
        let pages = data.pages

        data.invoices.map((invoice,index)=>{
            const priceFormat = new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' })
                .format(invoice.totalFee)
            const dateFormat = (new Date(invoice.createdAt)).toLocaleString();
            html+=`<tr>
                            <th scope="row">${index+1}</th>
                            <td>${invoice._id}</td>
                            <td id="${invoice.address_info_id}">${invoice.address_text}</td>
                            <td>${invoice.status}</td>
                            <td>${invoice.payment_method}</td>
                            <td><p>${priceFormat}</p></td>
                            <td>${dateFormat}</td>`

            if(invoice.status==='UNVERIFIED'){
                html+= `<td><button class=" btn btn-danger fa-trash fa w-100 h-100" data-toggle="modal"
 data-target="#isDeleteInvoiceNotif" onclick="showDeleteNotif('${invoice._id}','${+page}')"></button></td>`}
            else{
                html+=` <td><button class=" btn btn-danger fa-trash fa w-100 h-100 " disabled></button></td>`
            }

            html+= `<td><button class="btn btn-primary" data-toggle="modal" data-target="#idCenter"
                        onclick="showDetailInvoice('${invoice._id}')">Detail </button></td>
                    </tr>`
        })
        $('#body-invoices').html(html);

        html=``;

        if (+page === 1) {
            html +=
                `<nav aria-label="Page navigation" class="mb-5">
            <ul class="pagination justify-content-center mb-5">               
                <li class="page-item"><a class="page-link active" id="page-cur" >${page}</a></li>`

            if (+page + 1 <= +pages) {
                html += `<li class="page-item"><a class="page-link" onclick="pagination('${+page + 1}')" >${+page + 1}</a></li>`
            }

            if (+page + 2 <= +pages) {
                html += `<li class="page-item"><a class="page-link" onclick="pagination('${+page + 2}')" >${+page + 2}</a></li>`
            }
            if (+pages>1){
                html +=`<li class="page-item">
                    <a class="page-link"  onclick="pagination('${+page + 1}')" >Next</a>
                </li>
            </ul>
        </nav>`
            }

        }
        else {
            if (+page === +pages) {
                html +=
                    `<nav aria-label="Page navigation" class="mb-5">
            <ul class="pagination justify-content-center mb-5">
                <li class="page-item">
                    <a class="page-link" onclick="pagination('${+page - 1}')" >Previous</a>
                </li>`
                if (+page - 2 > 0) {
                    html += `<li className="page-item"><a className="page-link" onclick="pagination('${+page - 2}')" >${+page - 2}</a></li>`
                }
                if (+page - 1 > 0) {
                    html += `<li className="page-item"><a className="page-link" onclick="pagination(${+page - 1})" >${+page - 1}</a></li>`
                }

                html += `<li class="page-item"><a class="page-link active" id="page-cur" onclick="pagination('${page}')">${page}</a></li>
                </ul>
        </nav>`
            } else {
                html +=
                    `<nav aria-label="Page navigation" class="mb-5">
            <ul class="pagination justify-content-center mb-5">
                <li class="page-item">
                    <a class="page-link" onclick="pagination('${+page - 1}')" >Previous</a>
                </li>
                <li class="page-item"><a class="page-link" onclick="pagination('${+page - 1}')">${+page - 1}</a></li>
                <li class="page-item"><a class="page-link active" id="page-cur" >${page}</a></li>
                <li class="page-item"><a class="page-link" onclick="pagination('${+page + 1}')">${+page + 1}</a></li>
                <li class="page-item">
                    <a class="page-link" >Next</a>
                </li>
            </ul>
        </nav>`
            }
        }
        $('#pagination-invoice-1').html(html);
    })

}

$('#idCenter').on('shown.bs.modal', function() { $("body.modal-open").removeAttr("style"); });
