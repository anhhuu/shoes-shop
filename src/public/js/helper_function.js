let clearMessage = function () {
    if ($('#upload-message').html() !== '') {
        setTimeout(function () {
            $('#upload-message').html('')
        }, 1000)
    }
}


let base64ToBlob =  function (base64, mime)
{
    mime = mime || '';
    let  sliceSize = 1024;
    let byteChars = window.atob(base64);
    let byteArrays = [];

    for (let offset = 0, len = byteChars.length; offset < len; offset += sliceSize) {
        let slice = byteChars.slice(offset, offset + sliceSize);

        let byteNumbers = new Array(slice.length);
        for (let i = 0; i < slice.length; i++) {
            byteNumbers[i] = slice.charCodeAt(i);
        }

        let byteArray = new Uint8Array(byteNumbers);
        byteArrays.push(byteArray);
    }

    return new Blob(byteArrays, {type: mime});
}


export let uploadFile = function (onSuccessCallBack,onErrorCallback){

    console.log('Uploading')
    let image = $('#img-user-avt').attr('src');
    let  base64ImageContent = image.replace(/^data:image\/(png|jpg);base64,/, "");
    let  blob = base64ToBlob(base64ImageContent, 'image/png');
    let  formData = new FormData();
    formData.append('avatar', blob);

    let settings = {
        "url": "/api/users/upload",
        "method": "POST",
        "processData": false,
        dataType: 'text',
        "type": "POST",
        "enctype": "multipart/form-data",
        "mimeType": "multipart/form-data",
        "contentType": false,
        "data": formData,
        success: onSuccessCallBack,
        error: onErrorCallback
    };

    clearMessage();
    $.ajax(settings)
}