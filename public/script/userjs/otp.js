
const inputs = document.querySelectorAll(".otp-input");
inputs.forEach((input, index) => {
    input.addEventListener("input", () => {
        input.value = input.value.replace(/[^0-9]/g, "")
        if (input.value && index < inputs.length - 1) {
            inputs[index + 1].focus();
        }
    });
    input.addEventListener("keydown", (e) => {
        if (e.key === "Backspace" && input.value === "" && index > 0) {
            inputs[index - 1].focus()
            console.log(e)
        }
    });
});

const countdown = document.getElementById("countdown")
const resendBtn = document.getElementById("resendBtn")
resendBtn.addEventListener("click", resendOTP);

let timer = null;

function startTimer() {
    clearInterval(timer);

    const now = Date.now();
    let timeLeft = Math.floor((backendExpireTime - now) / 1000)

    if (timeLeft < 0) timeLeft = 0;

    countdown.textContent = timeLeft;
    resendBtn.classList.add("disabled-resend");
    resendBtn.classList.remove("enabled-resend");


    timer = setInterval(() => {
        timeLeft--;
        countdown.textContent = timeLeft;

        if (timeLeft <= 0) {
            clearInterval(timer);
            countdown.textContent = "0";
            resendBtn.classList.remove("disabled-resend");
            resendBtn.classList.add("enabled-resend");
            notyf.error("OTP expired. Click Resend Code.");
        }
    }, 1000)

}

startTimer();

function verifyOTP(event) {
    event.preventDefault();
    let otp = "";
    for (let i = 1; i <= 6; i++) {
        otp += document.getElementById("otp-" + i).value;
    }

    axios.post("/user/otp", { otp }, { withCredentials: true })
        .then((response) => {
            if (response.data.success) {
                notyf.success("OTP Verified Successfully");
                setTimeout(() => {
                    window.location.href = response.data.redirect;
                }, 1500);
            } else {
                notyf.error(response.data.message);
            }
        })
        .catch(() => {
            notyf.error("Invalid OTP. Please try again");
        });
}

function resendOTP(event) {
    if (resendBtn.classList.contains("disabled-resend")) return;

    event.preventDefault()

    axios.post("/user/resend-otp", {}, { withCredentials: true })
        .then((response) => {
            if (response.data.success) {
                notyf.success("New OTP Sent to your email");
                backendExpireTime = Number(response.data.otpExpires);
                startTimer();
            } else {
                notyf.error(response.data.message)
            }
        })
        .catch(() => {
            notyf.error("An error occured while resending OTP.please try again")
        })
}
