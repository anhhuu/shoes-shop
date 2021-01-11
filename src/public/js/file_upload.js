import {uploadFile} from '/js/helper_function.js';

const avatarImageOverlay = `
<div class="modal fade" id="modal" tabindex="-1" role="dialog" aria-labelledby="exampleModalCenterTitle" aria-hidden="true">
  <div class="modal-dialog modal-dialog-centered" role="document">
    <div class="modal-content">
      <div class="modal-header">
        <h5 class="modal-title" id="exampleModalLongTitle">Modal title</h5>
        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
          <span aria-hidden="true">&times;</span>
        </button>
      </div>
      <div class="modal-body">
        <div id="overlay" class="d-flex align-items-center justify-content-center"></div>
      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
        <button type="button" class="btn btn-primary">Save changes</button>
      </div>
    </div>
  </div>
</div>


`

const cropImageModal = `
<div style="z-index: 9999; margin: 0 auto">
    <div id="resizer-demo" style="width: 500px; height: 500px; " ></div>
    <button id="crop-image" class="btn text-center">Crop</button>
</div>
`
let isShowOverlay = false;

class Modal{
    constructor(props) {
        this.isShowModal = false;
    }

   toggle(){
        if(this.isShowModal){
            $('#modal').modal('hide');
        }else{
            $('#modal').modal('show');
        }
   }
}

function renderOverlay(data) {
    $('#root-layout-container').append(avatarImageOverlay);
    isShowOverlay = true;

    $('#overlay').append($.parseHTML(cropImageModal));
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
                $('#img-user-avt').prop('src', base64data);
            }

            $('#overlay').off('click');
            $('#overlay').remove();
            isShowOverlay = false;


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
            $('#overlay').attr('class', '');

            isShowOverlay = true;
            console.log('Image Click');

            $('#overlay').click(function () {
                img = $('#img-user-avt').detach();
                img.removeClass('avatar-animated')
                $('#overlay').off('click');
                $('#overlay').remove();
                $('#user-avatar-container').append(img);
                isShowOverlay = false;
            });
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
                setTimeout(()=> $('#upload-message').html(''), 2000);
                isShowOverlay = false;
            },

            function (error) {
                $('#upload-message').attr('class', 'text-danger');
                $('#upload-message').html('Upload file failed ' + error);
                isShowOverlay = false;
            })
    });
})
