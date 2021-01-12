import {uploadFile} from '/js/helper_function.js';

const cropImageModal = `
<div style="z-index: 9999; margin: 0 auto" class="d-flex flex-column w-100 justify-content-around">
    <div id="resizer-demo" class="w-100" style=" height: 300px; " ></div>

</div>
`

function renderCropModal(data) {

    cModal.showModal(true);
    $('#overlay').html(cropImageModal);
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
            const reader = new FileReader();
            reader.readAsDataURL(blob);

            reader.onloadend = function () {
                const base64data = reader.result;
                $('#avt').prop('src', base64data);
            }
        });

    })
}

let cModal;

export default $(document).ready(function () {

    $('#crop-image').hide();
    class Modal {
        constructor(props) {
            this.isShowModal = false;
            $('#myModal').modal('hide');
        }

        toggle() {
            if (this.isShowModal) {
                $('#myModal').modal('hide');
                $('#myModal').removeClass(' animate__animated animate__backInRight')

            } else {
                $('#myModal').modal('show');
                $('#myModal').addClass(' animate__animated animate__backInRight')
            }
            this.isShowModal = !this.isShowModal;
        }

        showModal( showCropBtn = false ) {
            $('#myModal').modal('show');
            if(showCropBtn){
                $('#crop-image').show();
            }
            this.isShowModal = true
        }

        hideModal() {
            $('#myModal').modal('hide');
            $('#overlay').children().remove();
            $('#crop-image').hide();
            this.isShowModal = false;
        }


    }

    $('#btn-close-preview').click(function (){
        cModal.hideModal();
    })
    $('#exit-button').click(function (){
        cModal.hideModal();
    })

    const restore = function () {
        cModal.hideModal();
    }
    cModal = new Modal();
    const handleImgClick = function () {
        cModal.showModal();
        let img = $('#avt').clone(false);
        img.prop('id','xyz');
        img.addClass('normal-avt');
        $('#overlay').html(img);
        $('#myModal').click(() => restore());

    };

    $('.img-user-avt').on('click .new', handleImgClick)

    $("input[name='avatar']").change(function () {
        if (this.files.length > 0) {
            const file = this.files[0];
            const img = document.getElementById('avt');
            img.file = file;
            const reader = new FileReader();
            reader.onload = (function (aImg) {
                return function (e) {
                    aImg.src = e.target.result;
                    renderCropModal(e.target.result);
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
                setTimeout(() => $('#upload-message').html(''), 2000);
            },

            function (error) {
                $('#upload-message').attr('class', 'text-danger');
                $('#upload-message').html('Upload file failed ' + error);
            })
    });
})
