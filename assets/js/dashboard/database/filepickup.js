

document.getElementById("pikuperImage").addEventListener("change",function(){
    const selected = document.getElementById("pikuperImage").value;
      if(selected=="camera")
      {
          $("#photoBody").css("display","flex");
           camera();
           $("#imageBodyChoiser").css("display","none");
      }
      else if(selected=="galley")
      {
          $("#imageBodyChoiser").css("display","flex");
      }
      else
      {
        $("#imageBodyChoiser").css("display","none");
        $("#photoBody").css("display","none");
      }
});
document.getElementById("closeCamera").addEventListener("click",function(){
           $("#photoBody").css("display","none");
});
let changeCamera=0;
let currentStream;
let videoDevices;
let cameraFeed   = document.getElementById('cameraFeed');
 async function camera()
{
    const captureButton = document.getElementById('captureButton');
    const photoCanvas = document.getElementById('photoCanvas');
    const context = photoCanvas.getContext('2d');
      $("#changeCamra").empty();
    // Access the user's camera
     const devices = await navigator.mediaDevices.enumerateDevices();
      videoDevices = devices.filter(device => device.kind === 'videoinput');

      // Start first camera by default
      if (videoDevices.length > 0) {
        startCamera(videoDevices[0].deviceId);
      }
       videoDevices.forEach((device, index) => {
        const option = document.createElement('option');
        option.value = device.deviceId;
        option.text = device.label || `Camera ${index + 1}`;
        $("#changeCamra").append(option);
      });
    // Capture photo on button click
    captureButton.addEventListener('click', () => {
        photoCanvas.width = cameraFeed.videoWidth;
        photoCanvas.height = cameraFeed.videoHeight;
        $("#photoCanvas").css("display","flex");
        context.drawImage(cameraFeed, 0, 0, photoCanvas.width, photoCanvas.height);
         $("#photoBody").css("display","none");
        // You can then get the image data from the canvas, e.g., photoCanvas.toDataURL('image/png')
        const base64Image = photoCanvas.toDataURL('image/png'); // default is 'image/png'
        $("#imageData").attr("value",base64Image);
    });
}
document.getElementById("changeCamra").addEventListener("change",function(){
    const selectedDeviceId = document.getElementById("changeCamra").value;
      startCamera(selectedDeviceId);
});
async function startCamera(deviceId) {
      if (currentStream) {
        currentStream.getTracks().forEach(track => track.stop());
      }

      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { deviceId: { ideal: deviceId } }
        });
        currentStream = stream;
        cameraFeed.srcObject = stream;
      } catch (error) {
        console.error('Error accessing camera:', error);
      }
}


function generateEnrollmentID() {
    let year = new Date().getFullYear();
    let randomNum = Math.floor(10000 + Math.random() * 90000);
    return `${year}SBC${randomNum}`;
}

$("#SID").attr("value",generateEnrollmentID());





document.getElementById("imageInput").addEventListener("change", function(event){
    const file = event.target.files[0];
        if (!file) return;

        const reader = new FileReader();

        reader.onload = function(e) {
            const img = new Image();
            img.onload = function() {
                const canvas = document.getElementById('photoCanvas');
                const ctx = canvas.getContext('2d');

                // Set canvas size to image size
                canvas.width = img.width;
                canvas.height = img.height;
                 $("#photoCanvas").css("display","flex");
                ctx.drawImage(img, 0, 0,canvas.width,canvas.height);

                
                // Convert to Base64 with selected compression level
                const base64Image = canvas.toDataURL('image/jpeg');
                $("#imageData").attr("value",base64Image);
            };
                img.src = e.target.result;
        };

        reader.readAsDataURL(file); // Read file as Base64
});

const className = ["1th","2nd","3rd","4th","5th","6th","7th","8th","9th","10th","11th","12th"];
      for(let i =0;i<className.length;i++){
         const option = document.createElement('option');
        option.value = className[i];
        option.text = className[i];
        $("#className").append(option);
}
