import {uploadFile} from '/js/helper_function.js';

const avatarImageOverlay = `<div id="overlay" class="d-flex justify-content-center align-items-center">

</div> `

const cropImageModal = `
<div style="z-index: 9999; margin: 0 auto">
    <div id="resizer-demo" style="width: 500px; height: 500px; " ></div>
    <button id="crop-image" class="btn text-center">Crop</button>
</div>

`
let isShowOverlay = false;

function renderOverlay(data) {
    $('#root-layout-container').append(avatarImageOverlay);
    isShowOverlay = true;

    $('#overlay').append($.parseHTML(cropImageModal));

    $('resizer-demo').off('click');

    const el = document.getElementById('resizer-demo');
    const resize = new Croppie(el, {
        viewport: {width: 100, height: 100, type: 'circle'},
        enableResize: true,
        enableOrientation: true,
        mouseWheelZoom: 'ctrl',

    });

    resize.bind({
        url: data,
    });
    //on button click
    $('#crop-image').click(function () {
        resize.result('blob').then(function (blob) {
            // do something with cropped blob
            console.log(blob);
            const reader = new FileReader();
            reader.readAsDataURL(blob);

            reader.onloadend = function () {
                const base64data = reader.result;
                console.log(base64data)
                $('#img-user-avt').prop('src', base64data);
            }

            $('#overlay').off('click');
            $('#overlay').remove();

        });

    })
}

export default $(document).ready(function () {


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
                    renderOverlay(e.target.result);
                };
            })(img);
            reader.readAsDataURL(file);

        }
    })

    $('#upload-image-form').submit(function (e) {
        e.preventDefault();
        uploadFile(
            function (res) {
                $('#upload-message').attr('class', 'text-success');
                $('#upload-message').html('Upload file succeeded');
            },

            function (error) {
                $('#upload-message').attr('class', 'text-danger');
                $('#upload-message').html('Upload file failed ' + error);
            })
    });
})