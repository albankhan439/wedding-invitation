/*==========================================================
        WALIMA GUEST MANAGEMENT SYSTEM
==========================================================*/
 
"use strict";
 
/*==========================================================
        ELEMENTS
==========================================================*/
 
const guestName = document.getElementById("guestName");
const guestMobile = document.getElementById("guestMobile");
const searchGuest = document.getElementById("searchGuest");
 
const addGuestBtn = document.getElementById("addGuestBtn");
const updateGuestBtn = document.getElementById("updateGuestBtn");
 
const tableBody =
document.querySelector("#guestTable tbody");
 
/*==========================================================
        DATA
==========================================================*/
 
let guests =
JSON.parse(localStorage.getItem("walimaGuests")) || [];
 
let editIndex = -1;
 
/*==========================================================
        SAVE
==========================================================*/
 
function saveGuests(){
 
localStorage.setItem(
 
"walimaGuests",
 
JSON.stringify(guests)
 
);
 
}
 
/*==========================================================
        CLEAR FORM
==========================================================*/
 
function clearForm(){
 
guestName.value="";
 
guestMobile.value="";
 
editIndex=-1;
 
}
 
/*==========================================================
        GENERATE LINK
==========================================================*/
 
function generateLink(name) {
 
    return `http://127.0.0.1:5500/index.html?guest=${encodeURIComponent(name)}`;
 
}
/*==========================================================
        ADD GUEST
==========================================================*/
 
addGuestBtn.addEventListener("click",()=>{
 
const name=
 
guestName.value.trim();
 
const mobile=
 
guestMobile.value.trim();
 
if(name===""){
 
alert("Enter guest name");
 
return;
 
}
 
guests.push({
 
name,
 
mobile
 
});
 
saveGuests();
 
renderGuests();
 
clearForm();
 
});
/*==========================================================
        UPDATE
==========================================================*/
 
updateGuestBtn.addEventListener("click",()=>{
 
if(editIndex===-1){
 
return;
 
}
 
guests[editIndex]={
 
name:guestName.value,
 
mobile:guestMobile.value
 
};
 
saveGuests();
 
renderGuests();
 
clearForm();
 
});
 /*==========================================================
        RENDER GUEST TABLE
==========================================================*/
 
function renderGuests() {
 
    tableBody.innerHTML = "";
 
    guests.forEach((guest, index) => {
 
        const row = document.createElement("tr");
 
        const inviteLink = generateLink(guest.name);
 
        row.innerHTML = `
 
            <td>${guest.name}</td>
 
            <td>${guest.mobile || "-"}</td>
 
            <td>
                <button class="action-btn link-btn"
                    onclick="copyInvitation('${inviteLink}')">
                    🔗 Copy
                </button>
            </td>
 
            <td>
                <button class="action-btn whatsapp-btn"
                    onclick="shareInvitation('${guest.name}')">
                    📱 WhatsApp
                </button>
            </td>
 
            <td>
                <button class="action-btn edit-btn"
                    onclick="editGuest(${index})">
                    ✏️ Edit
                </button>
            </td>
 
            <td>
                <button class="action-btn delete-btn"
                    onclick="deleteGuest(${index})">
                    🗑 Delete
                </button>
            </td>
 
        `;
 
        tableBody.appendChild(row);
 
    });
 
}
 /*==========================================================
        COPY INVITATION LINK
==========================================================*/
 
window.copyInvitation = async function(link){
 
    try{
 
        await navigator.clipboard.writeText(link);
 
        alert("Invitation link copied successfully!");
 
    }catch(err){
 
        alert("Unable to copy link.");
 
    }
 
};
/*==========================================================
        SHARE ON WHATSAPP
==========================================================*/
 
window.shareInvitation = function(name){
 
    const inviteLink = generateLink(name);
 
    const message =
 
`✨ Assalamu Alaikum ${name},
 
You are cordially invited to the Walima Reception of
 
💚 Farhan Khan
&
💚 Ayesha Shaikh
 
📅 Monday, 3 August 2026
🕕 6:00 PM Onwards
 
📍 Sayaji Hotel, Indore
 
Please open your personal invitation:
 
${inviteLink}`;
 
    window.open(
 
        "https://wa.me/?text=" +
 
        encodeURIComponent(message),
 
        "_blank"
 
    );
 
};
/*==========================================================
        EDIT GUEST
==========================================================*/
 
window.editGuest = function(index){
 
    editIndex = index;
 
    guestName.value = guests[index].name;
 
    guestMobile.value = guests[index].mobile;
 
};
/*==========================================================
        DELETE GUEST
==========================================================*/
 
window.deleteGuest = function(index){
 
    if(confirm("Delete this guest?")){
 
        guests.splice(index,1);
 
        saveGuests();
 
        renderGuests();
 
    }
 
};
 /*==========================================================
        INITIALIZE
==========================================================*/
 
renderGuests();
/*==========================================================
        LIVE SEARCH
==========================================================*/
 
searchGuest.addEventListener("keyup", () => {
 
    const keyword = searchGuest.value.toLowerCase();
 
    const rows = tableBody.querySelectorAll("tr");
 
    rows.forEach(row => {
 
        const text = row.textContent.toLowerCase();
 
        row.style.display = text.includes(keyword)
            ? ""
            : "none";
 
    });
 
});
/*==========================================================
        STATISTICS
==========================================================*/
 
function updateStatistics(){
 
    const totalGuests =
        document.getElementById("totalGuests");
 
    if(totalGuests){
 
        totalGuests.textContent = guests.length;
 
    }
 
}
/*==========================================================
        EXPORT CSV
==========================================================*/
 
function exportCSV(){
 
    let csv =
 
"Name,Mobile\n";
 
    guests.forEach(guest=>{
 
        csv +=
 
`${guest.name},${guest.mobile}\n`;
 
    });
 
    const blob =
 
new Blob([csv],{
 
type:"text/csv"
 
});
 
    const link =
 
document.createElement("a");
 
    link.href =
 
URL.createObjectURL(blob);
 
    link.download =
 
"Walima_Guest_List.csv";
 
    link.click();
 
}
/*==========================================================
        IMPORT CSV
==========================================================*/
 
function importCSV(file){
 
    const reader =
 
new FileReader();
 
    reader.onload = function(e){
 
        const lines =
 
e.target.result.split("\n");
 
        lines.shift();
 
        lines.forEach(line=>{
 
            if(line.trim()==="") return;
 
            const data =
 
line.split(",");
 
            guests.push({
 
                name:data[0],
 
                mobile:data[1]
 
            });
 
        });
 
        saveGuests();
 
        renderGuests();
 
        updateStatistics();
 
    };
 
    reader.readAsText(file);
 
}
/*==========================================================
        INITIALIZE
==========================================================*/
 
renderGuests();
 
updateStatistics();
 