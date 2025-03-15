document.addEventListener("DOMContentLoaded", function() {
    const video = document.getElementById("qr-video");
    const resultElement = document.getElementById("qr-result");

    // Запрашиваем доступ к камере
    navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" } })
        .then(function(stream) {
            video.srcObject = stream;
            video.setAttribute("playsinline", true); // Для мобильных устройств
            video.play();
            requestAnimationFrame(tick);
        })
        .catch(function(err) {
            console.error("Ошибка при доступе к камере: ", err);
        });

    function tick() {
        if (video.readyState === video.HAVE_ENOUGH_DATA) {
            const canvasElement = document.createElement("canvas");
            canvasElement.width = video.videoWidth;
            canvasElement.height = video.videoHeight;
            const canvas = canvasElement.getContext("2d");

            canvas.drawImage(video, 0, 0, canvasElement.width, canvasElement.height);
            const imageData = canvas.getImageData(0, 0, canvasElement.width, canvasElement.height);
            const code = jsQR(imageData.data, imageData.width, imageData.height, {
                inversionAttempts: "dontInvert",
            });

            if (code) {
                resultElement.textContent = code.data;
            } else {
                resultElement.textContent = "QR-код не найден";
            }
        }
        requestAnimationFrame(tick);
    }
});