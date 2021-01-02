const avatarImageOverlay = `
<div id="overlay">

</div>
`
let isShowOverlay = false;
window.localStorage.removeItem('image_url');

$('#img-user-avt').click(function () {

    if (!isShowOverlay) {
        $('#root-layout-container').append(avatarImageOverlay);
        let img = $('#img-user-avt').detach();
        img.addClass('avatar-animated');
        $('#overlay').append(img);

        $('#overlay') && $('#overlay').click(function () {

            img = $('#img-user-avt').detach();
            img.removeClass('avatar-animated')
            $('#overlay').off('click');
            $('#overlay').remove();
            $('#user-avatar-container').append(img);
            isShowOverlay = false;
        });


        isShowOverlay = true;
    }
})

$("input[name='avatar']").change(function () {
    if (this.files.length > 0) {
        const file = this.files[0];
        const img = document.getElementById('img-user-avt');
        img.file = file;
        const reader = new FileReader();
        reader.onload = (function (aImg) {
            return function (e) {
                aImg.src = e.target.result;
            };
        })(img);
        reader.readAsDataURL(file);
    }
})

function clearMessage() {
    if ($('#upload-message').html() !== '') {
        setTimeout(function () {
            $('#upload-message').html('')
        }, 1000)
    }
}

$('#upload-image-form').submit(function (e) {
    e.preventDefault();
    const form = new FormData();
    const file = $("#upload-input").prop('files')[0];
    form.append('avatar', file);

    if (!file) {
        $('#upload-message').attr('class', 'text-danger');
        $('#upload-message').html('File not found');
        clearMessage();
        return;
    }
    const settings = {
        "url": "/api/users/upload",
        "method": "POST",
        "processData": false,
        dataType: 'text',
        "type": "POST",
        "enctype": "multipart/form-data",
        "mimeType": "multipart/form-data",
        "contentType": false,
        "data": form,
        success: function (res) {
            $('#upload-message').attr('class', 'text-success');
            $('#upload-message').html('Upload file succeed');
            window.localStorage.setItem('image_url', res)
        },

        error: function (error) {
            $('#upload-message').attr('class', 'text-danger');
            $('#upload-message').html('Upload file failed');
        }
    };

    clearMessage();
    $.ajax(settings)
});

