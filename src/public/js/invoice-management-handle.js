// $(document).ready(function (){
//     let html =``
//     $.get("/api/users/invoices", function (invoices) {
//         console.log(invoices)
//
//         invoices.map( (invoice, index)=>{
//             setTimeout(function (){
//                 $.get("/api/address/"+invoice.address_info_id, function (address){
//                     const date = new Date(invoice.createdAt).toLocaleString()
//                     console.log(date)
//                     html += `
//             <tr>
//                 <th scope="row">${index+1}</th>
//                 <td>${invoice._id}</td>
//                 <td id="${invoice.address_info_id}">${address.address_text}</td>
//                 <td>${invoice.status}</td>
//                 <td>${invoice.payment_method}</td>
//                 <td><p>${new Intl.NumberFormat('vi-VN', {style: 'currency', currency: 'VND'}).format(invoice.totalFee)}</p></td>
//                 <td><p>${date}</p></td>
//                 <td><a href="#">Detail</a></td>
//             </tr>
//             `
//                     $('#invoice-list').html(html)
//                 })
//             },100)
//
//
//         })
//
//     })
// })

const showDetailInvoice = function (invoiceID){
    console.log(invoiceID)
    $('#body-invoice-detail').html('')
    $.get('/api/users/invoices/'+invoiceID, function(data){
        let html=``;
        console.log(data)
        data.invoice_items.map((item,index)=>{
            html+=`    <tr>
                            <th scope="row">${index+1}</th>
                            <td class="text-center"><img src="${item.product.image_show_url}" alt="" width="100" height="100"></td>
                            <td class="text-center">${item.product.name}</td>
                            <td class="text-center">${item.size}</td>
                            <td class="text-center">${item.qty}</td>
                            <td class="text-center">${item.product.price.string_price}</td>
                            <td class="text-center"><p>${new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(item.qty*item.product.price.price_value)}</p></td>
                        </tr>
                        `
        })
        console.log(html)
        $('#body-invoice-detail').html(html).animate({height:'show'},"slow")
    })
}

const deleteInvoice = function(invoiceID){
    $.ajax({
            url: '/api/users/invoices/'+invoiceID+'/delete',
            type:'PUT',
            success: function (result) {
                console.log("Successfully")

                let html =''
                $.get('/api/users/invoices', function(data){
                    data.map((invoice,index)=>{
                        const priceFormat = new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(invoice.totalFee)
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
                                html+= `<td><button class=" btn btn-danger fa-trash fa w-100 h-100" onclick=""></button></td>`}
                            else{
                                html+=` <td><button class=" btn btn-danger fa-trash fa w-100 h-100 " disabled></button></td>`
                        }

                           html+= `<td><button class="btn btn-primary" data-toggle="modal" data-target="#idCenter" onclick="showDetailInvoice('${invoice._id}')">Detail </button></td>
                        </tr>`
                    })
                    $('#body-invoices').html(html);
                })
            }
        }
    )
}
$('#idCenter').on('shown.bs.modal', function() { $("body.modal-open").removeAttr("style"); });