/*==========================================================
        FARHAN & AYESHA
        WALIMA INVITATION
==========================================================*/
 
"use strict";
 
/*==========================================================
        LOADER
==========================================================*/
 
window.addEventListener("load", () => {
 
    const loader = document.getElementById("loader");
 
    setTimeout(() => {
 
        loader.style.opacity = "0";
 
        loader.style.visibility = "hidden";
 
    }, 2500);
 
});
 
 
/*==========================================================
        AOS
==========================================================*/
 
if (typeof AOS !== "undefined") {
 
    AOS.init({
 
        duration: 1000,
 
        once: true,
 
        easing: "ease-in-out"
 
    });
 
}
 
 
/*==========================================================
        GUEST NAME
==========================================================*/
 
const params = new URLSearchParams(window.location.search);
 
const guestName = params.get("guest");
 
const welcomeText = document.getElementById("welcomeText");
 
if (welcomeText) {
 
    if (guestName && guestName.trim() !== "") {
 
        welcomeText.innerHTML =
 
            `✨ Assalamu Alaikum,<br><strong>${guestName}</strong>`;
 
    }
 
    else {
 
        welcomeText.innerHTML =
 
            "✨ Welcome Dear Guest ✨";
 
    }
 
}
 
 
/*==========================================================
        SMOOTH SCROLL
==========================================================*/
 
document.querySelectorAll('a[href^="#"]')
 
.forEach(link => {
 
    link.addEventListener("click", function (e) {
 
        e.preventDefault();
 
        const target =
 
            document.querySelector(this.getAttribute("href"));
 
        if (target) {
 
            target.scrollIntoView({
 
                behavior: "smooth"
 
            });
 
        }
 
    });
 
});
 
 
/*==========================================================
        COUNTDOWN
==========================================================*/
 
const weddingDate = new Date(
 
    "August 3, 2026 18:00:00"
 
).getTime();
 
const timer = document.getElementById("timer");
 
function updateCountdown() {
 
    const now = new Date().getTime();
 
    const distance = weddingDate - now;
 
    if (distance < 0) {
 
        timer.innerHTML =
 
            "<h2>🎉 Welcome to Our Walima 🎉</h2>";
 
        return;
 
    }
 
    const days = Math.floor(
 
        distance / (1000 * 60 * 60 * 24)
 
    );
 
    const hours = Math.floor(
 
        (distance %
 
            (1000 * 60 * 60 * 24))
 
        /
 
        (1000 * 60 * 60)
 
    );
 
    const minutes = Math.floor(
 
        (distance %
 
            (1000 * 60 * 60))
 
        /
 
        (1000 * 60)
 
    );
 
    const seconds = Math.floor(
 
        (distance %
 
            (1000 * 60))
 
        /
 
        1000
 
    );
 
    document.getElementById("days").textContent = days;
 
    document.getElementById("hours").textContent = hours;
 
    document.getElementById("minutes").textContent = minutes;
 
    document.getElementById("seconds").textContent = seconds;
 
}
 
updateCountdown();
 
setInterval(updateCountdown, 1000);
/*==========================================================
        GOOGLE SHEETS RSVP
==========================================================*/
 
const SCRIPT_URL =
"https://script.google.com/macros/s/AKfycbw0pS7VhpW7Qcs4xSLvWI9TgphGJDvxxAM_VA0DFkEOzSJGerjhTqDSNqk757DCOrNe/exec";
 
const form = document.getElementById("rsvpForm");
 
form.addEventListener("submit", async function(e){
 
    e.preventDefault();
 
    const data = {
 
    name: document.getElementById("name").value,
 
    mobile: document.getElementById("mobile").value,
 
    guests: document.getElementById("guests").value,
 
    status: document.getElementById("status").value,
 
    message: document.getElementById("message").value
 
};
 
    try{
 
        const response = await fetch(SCRIPT_URL,{
 
            method:"POST",
 
            headers:{
                "Content-Type":"text/plain;charset=utf-8"
            },
 
            body:JSON.stringify(data)
 
        });
 
        const result = await response.json();
 
        if(result.success){
 
            popup.classList.add("show-popup");
 
            form.reset();
 
        }else{
 
            alert("Error : " + result.message);
 
        }
 
    }catch(err){
 
        alert("Unable to submit RSVP.\n\n" + err);
 
    }
 
});
 
/*==========================================================
        CLOSE POPUP ON BACKGROUND CLICK
==========================================================*/
 
if (popup) {
 
    popup.addEventListener("click", function (e) {
 
        if (e.target === popup) {
 
            popup.classList.remove("show-popup");
 
        }
 
    });
 
}
 
/*==========================================================
        WHATSAPP SHARE
==========================================================*/
 
const shareButton = document.querySelector(".share-btn");
 
if (shareButton) {
 
    shareButton.addEventListener("click", () => {
 
        const guest =
            guestName ? `?guest=${encodeURIComponent(guestName)}` : "";
 
        const inviteURL =
            window.location.origin +
            window.location.pathname +
            guest;
 
        const message =
 
`✨ Assalamu Alaikum
 
You are cordially invited to the Walima Reception of
 
Farhan Khan ❤️ Ayesha Shaikh
 
📅 Monday, 3 August 2026
🕕 6:00 PM Onwards
 
Please join us.
 
${inviteURL}`;
 
        window.open(
 
            `https://wa.me/?text=${encodeURIComponent(message)}`,
 
            "_blank"
 
        );
 
    });
 
}
 
/*==========================================================
        SCROLL REVEAL
==========================================================*/
 
const revealElements =
 
document.querySelectorAll(
 
".detail-box, .gallery-card, .invite-card, .urdu-card, .verse-card, .venue-card"
 
);
 
const revealObserver = new IntersectionObserver(
 
(entries) => {
 
entries.forEach((entry) => {
 
if (entry.isIntersecting) {
 
entry.target.classList.add("show");
 
}
 
});
 
},
 
{
 
threshold:0.15
 
}
 
);
 
revealElements.forEach((item)=>{
 
item.classList.add("fade-up");
 
revealObserver.observe(item);
 
});
 
/*==========================================================
        CURRENT YEAR
==========================================================*/
 
const year = new Date().getFullYear();
 
console.log(
 
`Farhan & Ayesha Walima Website © ${year}`
 
);
/*==========================================================
        TYPEWRITER EFFECT
==========================================================*/
 
function typeWriter(element, text, speed = 60) {
 
    if (!element) return;
 
    element.innerHTML = "";
 
    let index = 0;
 
    function typing() {
 
        if (index < text.length) {
 
            element.innerHTML += text.charAt(index);
 
            index++;
 
            setTimeout(typing, speed);
 
        }
 
    }
 
    typing();
 
}
 
window.addEventListener("load", () => {
 
    const guestMessage = guestName
        ? `✨ Assalamu Alaikum, ${guestName}`
        : "✨ Welcome Dear Guest";
 
    setTimeout(() => {
 
        typeWriter(welcomeText, guestMessage);
 
    }, 2600);
 
});
 
 
/*==========================================================
        ACTIVE NAVIGATION
==========================================================*/
 
const sections = document.querySelectorAll("section");
 
const navLinks = document.querySelectorAll("nav ul li a");
 
window.addEventListener("scroll", () => {
 
    let current = "";
 
    sections.forEach(section => {
 
        const top = section.offsetTop - 120;
 
        const height = section.offsetHeight;
 
        if (pageYOffset >= top) {
 
            current = section.getAttribute("id");
 
        }
 
    });
 
    navLinks.forEach(link => {
 
        link.classList.remove("active");
 
        if (link.getAttribute("href") === "#" + current) {
 
            link.classList.add("active");
 
        }
 
    });
 
});
 
 
/*==========================================================
        BACK TO TOP BUTTON
==========================================================*/
 
const topButton = document.createElement("button");
 
topButton.innerHTML = "↑";
 
topButton.id = "backToTop";
 
document.body.appendChild(topButton);
 
topButton.style.position = "fixed";
topButton.style.right = "20px";
topButton.style.bottom = "20px";
topButton.style.width = "50px";
topButton.style.height = "50px";
topButton.style.borderRadius = "50%";
topButton.style.border = "none";
topButton.style.cursor = "pointer";
topButton.style.background = "#D4AF37";
topButton.style.color = "#062E28";
topButton.style.fontSize = "22px";
topButton.style.display = "none";
topButton.style.zIndex = "999";
 
window.addEventListener("scroll", () => {
 
    if (window.scrollY > 500) {
 
        topButton.style.display = "block";
 
    } else {
 
        topButton.style.display = "none";
 
    }
 
});
 
topButton.addEventListener("click", () => {
 
    window.scrollTo({
 
        top: 0,
 
        behavior: "smooth"
 
    });
 
});
 
 
/*==========================================================
        HERO BUTTON ANIMATION
==========================================================*/
 
const openButton = document.querySelector(".open-btn");
 
if (openButton) {
 
    setInterval(() => {
 
        openButton.classList.toggle("glow");
 
    }, 1800);
 
}
 
 
/*==========================================================
        CONSOLE MESSAGE
==========================================================*/
 
console.log(
"%cFarhan ❤️ Ayesha Walima Website Ready",
"color:#D4AF37;font-size:18px;font-weight:bold;"
);
/*==========================================================
        FLOATING PETALS
==========================================================*/
 
const petalsContainer =
document.getElementById("petals-container");
 
const petals = [
 
"🌸",
 
"🌺",
 
"🌼",
 
"🌷"
 
];
 
function createPetal(){
 
const petal =
document.createElement("div");
 
petal.className = "petal";
 
petal.innerHTML =
petals[Math.floor(Math.random()*petals.length)];
 
petal.style.left =
Math.random()*100+"vw";
 
petal.style.animationDuration =
(6+Math.random()*6)+"s";
 
petal.style.fontSize =
(18+Math.random()*18)+"px";
 
petalsContainer.appendChild(petal);
 
setTimeout(()=>{
 
petal.remove();
 
},12000);
 
}
 
setInterval(createPetal,500);