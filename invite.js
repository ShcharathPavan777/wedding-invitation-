/* =========================
   EDIT THESE VALUES
   ========================= */
const INVITE = {
  brideName: "keerthy",
  groomName: "pavan",
  heroScript: "We Do",
  heroKicker: "TOGETHER WITH THEIR FAMILIES",
  heroSub: "INVITE YOU TO THEIR WEDDING CELEBRATION",

  dayLabel: "SATURDAY",
  monthLabel: "FEBRUARY",
  dateNumber: "21",
  yearNumber: "2026",
  timeLabel: "AT 10:30 AM",

  // Map (Google Maps share link)
  MAP_URL: "https://maps.google.com/?q=Oasis+Palace,+35145+Newark+Blvd,+Newark,+CA+94560",

  // RSVP button (Google Form share link)
  RSVP_URL: "https://docs.google.com/forms/d/e/1FAIpQLSedYqUuwUNrTeIYOsI6LoE2Qw1YR6zxQh19aGvKCunXr6eV1A/viewform?usp=header",

  // Optional: Google Form embed URL (NOT the same as RSVP_URL).
  // Example format: https://docs.google.com/forms/d/e/<FORM_ID>/viewform?embedded=true


  // Timeline / program
 program: [
    { time: "10:30 AM", title: "CEREMONY", meta: "35145 Newark Blvd, Newark, CA 94560 ", icon: "rings.svg" },
    { time: "12:30 PM", title: "LUNCH", meta: "35145 Newark Blvd, Newark, CA 94560 ", icon: "rings.svg" },
    { time: "1:00 PM", title: "RECEPTION", meta: "35145 Newark Blvd, Newark, CA 94560 D", icon: "rings.svg" },
  ],

  // Details cards
  dressTitle: "DRESS CODE",
  dressText: "Semi-formal/formal and elegant. Feel free to add a touch of gold to match our theme.",
  transportTitle: "TRANSPORTATION",
  transportText: "Shuttles will be available to transport guests from the ceremony to the reception and vice versa.",
  stayTitle: "ACCOMMODATION",
  stayText: "We reserved rooms for you at a Hotel , minutes from the venue. ",

  // RSVP section
  rsvpTitle: "RSVP",
  rsvpText: "Please click the RSVP button and fill out the form to confirm your attendance.",
  rsvpDeadline: "FEBRUARY 15",

  // Thank you section
  thanksTitle: "Thank you!",
  footerNote: "We can’t wait to celebrate with you.",

  // Default images (replace in /assets or use Edit mode)
  heroImage: "images/couple.jpeg",
  thanksImage: "images/me.jpeg",
};

const $ = (sel, root=document) => root.querySelector(sel);

function setText(key, value){
  document.querySelectorAll(`[data-edit="${key}"]`).forEach(el => { el.textContent = value; });
}

function applyInvite(){
  Object.entries(INVITE).forEach(([k,v]) => {
    if(typeof v === "string") setText(k, v);
  });

  $("#heroImage").src = localStorage.getItem("heroImage") || INVITE.heroImage;
  $("#thanksImage").src = localStorage.getItem("thanksImage") || INVITE.thanksImage;

  $("#ctaMap").href = INVITE.MAP_URL;
  $("#rsvpButton").href = INVITE.RSVP_URL;

  // timeline
  const wrap = $("#timeline");
  wrap.innerHTML = "";
  INVITE.program.forEach((item, i) => {
    const row = document.createElement("div");
    row.className = "timeRow";
    const left = document.createElement("div");
    const right = document.createElement("div");
    const mid = document.createElement("div");
    mid.className = "timeMid";
    mid.innerHTML = `<span class="dot" aria-hidden="true"></span>`;

    const bubble = (side) => {
      const b = document.createElement("div");
      b.className = "timeBubble";
      b.innerHTML = `
        <div class="timeBubble__time">${item.time}</div>
        <div class="timeBubble__title">${item.title}</div>
        <div class="timeBubble__meta">${item.meta}</div>
      `;
      return b;
    };

    // alternate bubbles like the reference
    if(i % 2 === 0){
      left.appendChild(bubble("left"));
      right.innerHTML = `<img class="icon" src="assets/${item.icon}" alt="" aria-hidden="true">`;
    } else {
      left.innerHTML = `<img class="icon" src="assets/${item.icon}" alt="" aria-hidden="true">`;
      right.appendChild(bubble("right"));
    }

    row.appendChild(left); row.appendChild(mid); row.appendChild(right);
    wrap.appendChild(row);
  });

  // embed
  const iframe = $("#rsvpEmbed");
  if(INVITE.RSVP_EMBED_URL){
    iframe.src = INVITE.RSVP_EMBED_URL;
    iframe.style.display = "block";
  }
}

function enableEditMode(on){
  $("#editor").style.display = on ? "flex" : "none";
  $("#editToggle").setAttribute("aria-pressed", on ? "true" : "false");

  document.querySelectorAll("[data-edit]").forEach(el => {
    el.contentEditable = "false";
  });
}

function wireEditPersistence(){
  // Save text edits to localStorage (so you can tweak in-browser)
  document.querySelectorAll("[data-edit]").forEach(el => {
    const key = el.getAttribute("data-edit");
    const saved = localStorage.getItem(`txt:${key}`);
    if(saved) el.textContent = saved;

    el.addEventListener("input", () => {
      localStorage.setItem(`txt:${key}`, el.textContent.trim());
    });
  });

  const toDataURL = (file, cb) => {
    const reader = new FileReader();
    reader.onload = () => cb(String(reader.result));
    reader.readAsDataURL(file);
  };

  $("#heroFile").addEventListener("change", (e) => {
    const f = e.target.files?.[0]; if(!f) return;
    toDataURL(f, (data) => { localStorage.setItem("heroImage", data); $("#heroImage").src = data; });
  });

  $("#thanksFile").addEventListener("change", (e) => {
    const f = e.target.files?.[0]; if(!f) return;
    toDataURL(f, (data) => { localStorage.setItem("thanksImage", data); $("#thanksImage").src = data; });
  });

  $("#resetLocal").addEventListener("click", () => {
    Object.keys(localStorage).forEach(k => {
      if(k.startsWith("txt:") || k === "heroImage" || k === "thanksImage") localStorage.removeItem(k);
    });
    location.reload();
  });
}

function main(){
  applyInvite();

  let editOn = false;
  $("#editToggle").addEventListener("click", () => {
    editOn = !editOn;
    enableEditMode(editOn);
  });

  wireEditPersistence();
}
document.addEventListener("DOMContentLoaded", main);
