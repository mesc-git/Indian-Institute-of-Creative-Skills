/* ---------- chatbot.js (updated) ---------- */
const chatWindow = document.getElementById("chat-window");
const userInput = document.getElementById("user-input");
const sendBtn = document.getElementById("send-btn");
const popupChat = document.getElementById("chatbot-popup");

const GOOGLE_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbwkyXniEU2zkw8BJdtBWTtb-a4jZsShDeLY8_wYtXNpAbJn4a7DUNCI9KxOTPy6bCzX/exec";

const subjects = [
  "Admission Process",
  "Apply Now",
  "Why IICS",
  "Courses Offered",
  "Talk to counsellor",
];

const responses = [
  {
    key: "Hi",
    keywords: ["hi", "hello", "hey", "good morning", "good evening", "good afternoon"],
    response: `<p>Hi there! How can I help you today?</p>`
  },
  {
    key: "Admission Process",
    keywords: ["admission", "apply", "entrance", "fees", "support", "process"],
    response: `
      <p>Here is info about the admission process:</p>
      <ul>
  <li>1. Fill out the MECAT-IICS application <span><a href="https://iicsindia.org/admission.html">form</a></span> and submit it.</li>
  <li>2. After submission, you’ll receive your login credentials at the email address you provided.</li>
  <li>3. Click the Login button and sign in using your username and password.</li>
  <li>4. Once logged in, you’ll be redirected to your dashboard — complete your application form there.</li>
  <li>5. Pay the MECAT-IICS application fee and submit your final application.</li>
</ul>
    <p>Click <span><a href="/admission-process.html">here</a></span> to know more.
`
  },
  {
    key: "Apply Now",
    keywords: [],
    response: `<p>You can apply from <span><a href="https://iicsindia.org/admission.html">here</a></span></p>`
  },
  {
    key: "Courses Offered",
    keywords: ["course", "program", "degree", "study", "field"],
    response: `
      <p>Here's a list of all courses at IICS:</p>
      <ul class="course-list">
      <li class="course-btn">Animation & Game Production</li>
      <li class="course-btn">Sound Design & Music Production</li>
      <li class="course-btn">Event And Experiential Management</li>
      <li class="course-btn">Costume Designing</li>
    </ul>`
  },
  {
    key: "Why IICS",
    keywords: ["benefits", "mentors", "advantages"],
    response: `
      <p>Established under the aegis of the Ministry of Skill Development and Entreprenuership:
IICS is setting a benchmark in creative education, selected students are an integral part of the National Vision to be global Creative Leaders

<strong>Global Exposure:</strong>
International study tours to Cannes, MIPCOM & SIGGRAPH for real-world creative insights.<br>
<strong>Industry Experts as Mentors:</strong>
Learn from Oscar-winners, celebrities and top industry professionals.<br>
<strong>Paid Apprenticeship model:</strong>
Guaranteed, stipend-based apprenticeships embedded into every program.</p>
<p>For more info, Click <span><a href="https://iicsindia.org/industry-mentor.html">here</a></span></p>
`
  },

  {
  key: "Animation & Game Production",
  keywords: ["animation", "game production"],
  response: `<ul>
  <li><strong>Degree:</strong> B.Sc in Animation & Game Production</li>
  <li><strong>Campuses:</strong> Available in Delhi & Bhopal Campus</li>
  <li><strong>Duration:</strong> 3 Years</li>
  <li><strong>Eligibility:</strong> 12th pass from any stream, UG students, or candidates with relevant experience</li>
  <li><strong>Training Hours:</strong> 500 hours per year</li>
  <li><strong>Industry Mentor:</strong> Mr. Vaibhav Kumaresh</li>
  <li><strong>Application Fee:</strong> Rs. 5000</li>
  <li><strong>Course Fee:</strong> Rs. 4.5 LPA</li>
  </ul>
  <p>For more info, Click <span><a href="https://iicsindia.org/animation-&-gaming.html">here</a></span></p>
  <div class="mt-2">
        <button class="quick-btn animation-more-btn">Know More About Mentor</button>
      </div>
`
},
{
  key: "Sound Design & Music Production",
  keywords: ["sound", "music", "production"],
  // NOTE: changed id -> class for the button to avoid duplicate-id issues after history restore
  response: `<ul>
  <li><strong>Degree:</strong> B.Sc in Sound Design & Music Production</li>
  <li><strong>Campuses:</strong> Available in Delhi & Bhopal Campus</li>
  <li><strong>Duration:</strong> 3 Years</li>
  <li><strong>Eligibility:</strong> 12th pass from any stream, UG students, or candidates with relevant experience</li>
  <li><strong>Training Hours:</strong> 500 hours per year</li>
  <li><strong>Industry Mentor:</strong> Padma Shri Resul Pookutty</li>
  <li><strong>Application Fee:</strong> Rs. 5000</li>
  <li><strong>Course Fee:</strong> Rs. 6 LPA</li>
  </ul>
  <p>For more info, Click <span><a href="https://iicsindia.org/sound-design-&-music-video-production.html">here</a></span></p>
  <div class="mt-2">
        <button class="quick-btn sound-more-btn">Know More About Mentor</button>
      </div>
`
},
{
  key: "Event And Experiential Management",
  keywords: ["event", "management"],
  response: `<ul>
  <li><strong>Degree:</strong> B.Sc in Events & Experiential Management</li>
  <li><strong>Campuses:</strong> Available in Delhi & Bhopal Campus</li>
  <li><strong>Duration:</strong> 3 Years</li>
  <li><strong>Eligibility:</strong> 12th pass from any stream, UG students, or candidates with relevant experience</li>
  <li><strong>Training Hours:</strong> 500 hours per year</li>
  <li><strong>Industry Mentor:</strong> Ms. Sushma Gaikwad</li>
  <li><strong>Application Fee:</strong> Rs. 5000</li>
  <li><strong>Course Fee:</strong> Rs. 5.1 LPA</li>
</ul>
<p>For more info, Click <span><a href="/event-&-experimental-management.html">here</a></span></p>
<div class="mt-2">
        <button class="quick-btn event-more-btn">Know More About Mentor</button>
      </div>
`
},
{
  key: "Costume Designing",
  keywords: ["costume", "fashion"],
  response: `<ul>
  <li><strong>Degree:</strong> B.Sc in Costume Designing</li>
  <li><strong>Campuses:</strong> Available in Delhi & Bhopal Campus</li>
  <li><strong>Duration:</strong> 3 Years</li>
  <li><strong>Eligibility:</strong> 12th pass with interest in fashion, textiles, theatre arts, or visual storytelling</li>
  <li><strong>Industry Mentor:</strong> Ms. Neeta Lulla</li>
  <li><strong>Application Fee:</strong> Rs. 5000</li>
  <li><strong>Course Fee:</strong> Rs. 5.4 LPA</li>
</ul>
<p>For more info, Click <span><a href="https://iicsindia.org/costume-design.html">here</a></span></p>
<div class="mt-2">
        <button class="quick-btn costume-more-btn">Know More About Mentor</button>
      </div>
`
},

  {
    key: "Mentors",
    keywords: ["mentor", "faculty", "teacher", "guide"],
    response: `
      <p>Meet our top mentors:</p>
      <ul>
        <li><a href="#" class="!text-[#000]">Dr. (Hon) Amit Behl</a></li>
        <li><a href="#" class="!text-[#000]">Padma Shri Resul Pookutty</a></li>
        <li><a href="#" class="!text-[#000]">Padma Shri Shankar Mahadevan</a></li>
        <li><a href="#" class="!text-[#000]">Ms. Dia Mirza</a></li>
        <li><a href="#" class="!text-[#000]">Ms. Kavita Krishnamurthy</a></li>
        <li><a href="#" class="!text-[#000]">Ms. Neeta Lulla</a></li>
        <li><a href="#" class="!text-[#000]">Ms. Sushma Gaikwad</a></li>
        <li><a href="industry-mentor.html" class="!text-[#000]">and Many More...</a></li>
      </ul>`
  },
  {
    key: "Sample Papers",
    keywords: ["sample papers", "exam", "syllabus", "entrance exam"],
    response: `<p>You can check all sample papers <a href="https://iicsindia.org/sample-paper.html" target="_blank">here</a>.</p>`
  }
];

const toggleBtn = document.getElementById('chatbot-toggle');
const overlay = document.getElementById('chatbot-overlay');
const chatbot = document.getElementById('chatbot');
let isOpen = false;

const openChatbot = () => {
  overlay.classList.remove('hidden');
  document.body.classList.add('overflow-hidden');
  popupChat.style.display='none';

  // Fade in overlay
  requestAnimationFrame(() => overlay.classList.add('visible'));

  // Entry animation
  chatbot.classList.remove('chatbot-exit');
  chatbot.classList.add('chatbot-enter');

  isOpen = true;
};

const closeChatbot = () => {
  chatbot.classList.remove('chatbot-enter');
  chatbot.classList.add('chatbot-exit');
  overlay.classList.remove('visible');
  popupChat.style.display='block';

  setTimeout(() => {
    overlay.classList.add('hidden');
    document.body.classList.remove('overflow-hidden');
  }, 300);

  isOpen = false;
};

toggleBtn.addEventListener('click', () => {
  isOpen ? closeChatbot() : openChatbot();
});

overlay.addEventListener('click', () => closeChatbot());
chatbot.addEventListener('click', (e) => e.stopPropagation());

function disableScroll() {
  document.documentElement.style.overflow = 'hidden';
  document.body.style.overflow = 'hidden';
}

function enableScroll() {
  document.documentElement.style.overflow = '';
  document.body.style.overflow = '';
}

window.addEventListener('DOMContentLoaded', () => {
  setTimeout(() => {
    const popup = document.getElementById('popup');
    if (popup) {
      popup.classList.remove('hidden');
      popup.classList.add('fade-in');
      disableScroll();
    }
  }, 3000);
});

function closePopup(event) {
  const popup = document.getElementById('popup');
  console.log("Clicked:", event.target);

  if (
    event.target.id === 'popup' ||
    event.target.closest('.close-btn')
  ) {
    popup.classList.add('fade-out');
    setTimeout(() => {
      popup.classList.add('hidden');
      popup.classList.remove('fade-out');
      enableScroll();
    }, 300);
  }
}

// ---------------------- SAVE & LOAD CHAT ----------------------
function saveChat() {
  localStorage.setItem("chatHistory", chatWindow.innerHTML);
}
function loadChat() {
  const saved = localStorage.getItem("chatHistory");
  if (saved) {
    chatWindow.innerHTML = saved;

    attachButtonListeners();
    attachCourseButtonListeners();
    attachQuickActionListeners();

    attachSoundMoreButton();
    attachAnimationMoreButton();
    attachEventMoreButton();
    attachCostumeMoreButton();

    const form = document.getElementById("lead-form");
    if (form) {
      form.addEventListener("submit", handleFormSubmit);
    }

    const lastBotMessage = [...chatWindow.querySelectorAll(".message.bot")].pop();
    if (lastBotMessage) {
      const html = lastBotMessage.innerHTML.toLowerCase();
      if (
        html.includes("animation-&-gaming") ||
        html.includes("event") ||
        html.includes("sound design") ||
        html.includes("event and experiential management") ||
        html.includes("costume designing") ||
        html.includes("industry-mentor") ||
        html.includes("admission") ||
        html.includes("apply now") ||
        html.includes("counsellor") ||
        html.includes("thank you")
      ) {
        showQuickActions();
      }
    }
  }
}

function clearChat() {
  localStorage.removeItem("chatHistory");
  chatWindow.innerHTML = "";
}

// ---------------------- BOT MESSAGE ----------------------
function addBotMessage(html, delay = 1000, save = true) {
  const typing = document.createElement("div");
  typing.className = "message bot typing";
  typing.innerHTML = `<span class="dot"></span><span class="dot"></span><span class="dot"></span>`;
  chatWindow.appendChild(typing);
  chatWindow.scrollTop = chatWindow.scrollHeight;

  setTimeout(() => {
    typing.remove();
    const msg = document.createElement("div");
    msg.className = "message bot fade-in";
    msg.innerHTML = html;
    chatWindow.appendChild(msg);
    chatWindow.scrollTop = chatWindow.scrollHeight;

    attachButtonListeners();
    attachCourseButtonListeners();
    attachQuickActionListeners();

    attachSoundMoreButton();
    attachAnimationMoreButton();
    attachEventMoreButton();
    attachCostumeMoreButton();

    if (
      // html.includes("admission-process") ||
      html.includes("animation-&-gaming") ||
      html.includes("industry-mentor") ||
      html.includes("Sound Design") ||
      html.includes("Event And Experiential Management") ||
      html.includes("Costume Designing")
    ) {
      showQuickActions();
    }

    if (save) saveChat();
  }, delay);
}

let _soundDelegationAttached = false;
function attachSoundMoreButton() {
  if (_soundDelegationAttached) return;
  _soundDelegationAttached = true;

  chatWindow.addEventListener("click", (e) => {
    const btn = e.target.closest(".sound-more-btn");
    if (!btn) return;

    btn.disabled = true;
    btn.classList.add("opacity-50");
    setTimeout(() => {
      btn.disabled = false;
      btn.classList.remove("opacity-50");
    }, 1200);

    addBotMessage(`
      <p><strong>Padma Shri Dr. Resul Pookutty</strong> is an Oscar and BAFTA Award-winning sound designer, globally acclaimed for his work in <em>Slumdog Millionaire</em> (Academy Award for Best Sound Mixing), <em>Black</em>, <em>Ghajini</em>, <em>Pushpa</em> and many more. His mentorship inspires our students to achieve global standards of creativity and excellence.</p>
    `);
    setTimeout(showQuickActions, 1200);
  });
}

let _animationDelegationAttached = false;
function attachAnimationMoreButton() {
  if (_animationDelegationAttached) return;
  _animationDelegationAttached = true;

  chatWindow.addEventListener("click", (e) => {
    const btn = e.target.closest(".animation-more-btn");
    if (!btn) return;

    btn.disabled = true;
    btn.classList.add("opacity-50");
    setTimeout(() => {
      btn.disabled = false;
      btn.classList.remove("opacity-50");
    }, 1200);

    addBotMessage(`
      <p><strong>Mr. Vaibhav Kumaresh</strong> is one of India’s leading animation filmmakers, best known for his iconic creations like Simpoo Sir, the Amaron Clay World Series, and Chulbuli for POGO TV. As the Founder of Vaibhav Studios, his mentorship connects students directly to the evolving animation and game design industry.</p>
    `);
    setTimeout(showQuickActions, 1200);
  });
}

let _eventDelegationAttached = false;
function attachEventMoreButton() {
  if (_eventDelegationAttached) return;
  _eventDelegationAttached = true;

  chatWindow.addEventListener("click", (e) => {
    const btn = e.target.closest(".event-more-btn");
    if (!btn) return;

    btn.disabled = true;
    btn.classList.add("opacity-50");
    setTimeout(() => {
      btn.disabled = false;
      btn.classList.remove("opacity-50");
    }, 1200);

    addBotMessage(`
      <p><strong>Ms. Sushma Gaikwad,</strong>is a pioneer in the Indian event industry and the Co-founder of Ice Global & Wizcraft MIME. With over two decades of experience in experiential marketing, she has led major national and international events, including the IIFA Awards and the Commonwealth Games Ceremonies.</p>
    `);
    setTimeout(showQuickActions, 1200);
  });
}

let _costumeDelegationAttached = false;
function attachCostumeMoreButton() {
  if (_costumeDelegationAttached) return;
  _costumeDelegationAttached = true;

  chatWindow.addEventListener("click", (e) => {
    const btn = e.target.closest(".costume-more-btn");
    if (!btn) return;

    btn.disabled = true;
    btn.classList.add("opacity-50");
    setTimeout(() => {
      btn.disabled = false;
      btn.classList.remove("opacity-50");
    }, 1200);

    addBotMessage(`
      <p><strong>Ms. Neeta Lulla,</strong> 4-Time National Award-winning costume designer, is acclaimed for her work in over 400+ films, and celebrated for her work in films such as Jodhaa Akbar, Devdas, Manikarnika, and Lamhe. <br/>
      Her expertise bridges the worlds of fashion, cinema, and design innovation, providing IICS learners with invaluable industry exposure.</p>
    `);
    setTimeout(showQuickActions, 1200);
  });
}

// ---------------------- USER MESSAGE ----------------------
function addUserMessage(text, save = true) {
  const msg = document.createElement("div");
  msg.className = "message user";
  msg.textContent = text;
  chatWindow.appendChild(msg);
  chatWindow.scrollTop = chatWindow.scrollHeight;
  if (save) saveChat();
}

// ---------------------- SUBJECT BUTTONS ----------------------
function showSubjectButtons() {
  let buttonsHTML = `<p class="mt-2">What do you want to know?</p><div class="subject-buttons fade-in">`;
  subjects.forEach(sub => {
    buttonsHTML += `<button class="subject-btn">${sub}</button>`;
  });
  buttonsHTML += `</div>`;
  addBotMessage(buttonsHTML, 1000);
  setTimeout(attachButtonListeners, 1500);
}

// ---------------------- QUICK ACTION BUTTONS ----------------------
function showQuickActions() {
  document.querySelectorAll(".quick-actions").forEach(el => el.remove());

  const quickBtns = `
    <div class="quick-actions fade-in">
      <button class="quick-btn">Go to Main Menu</button>
      <button class="quick-btn">Talk to Counsellor</button>
      <button class="quick-btn">Apply Now</button>
    </div>
  `;
  chatWindow.insertAdjacentHTML("beforeend", quickBtns);
  chatWindow.scrollTop = chatWindow.scrollHeight;
  setTimeout(attachQuickActionListeners, 500);
}

function attachQuickActionListeners() {
  document.querySelectorAll(".quick-btn").forEach(btn => {
    btn.onclick = () => {
      const action = btn.textContent.trim().toLowerCase();

      if (action.includes("main menu")) {
        showSubjectButtons();
      } 
      else if (action.includes("talk to counsellor")) {
        handleUserInput("Talk to Counsellor");
      } 
      else if (action.includes("apply now")) {
        handleUserInput("Apply Now");
      }
    };
  });
}

function attachCourseButtonListeners() {
  document.querySelectorAll(".course-btn").forEach(btn => {
    btn.onclick = () => handleUserInput(btn.textContent);
  });
}

// ---------------------- START NEW CHAT BUTTON ----------------------
document.getElementById("new-chat-btn").addEventListener("click", () => {
  if (confirm("Are you sure you want to start a new chat? This will clear your previous messages.")) {
    chatWindow.innerHTML = "";
    localStorage.removeItem("chatHistory");
    localStorage.removeItem("leadData");
    localStorage.removeItem("counsellorContacted");

    addBotMessage("👋 Hello! Welcome to Indian Institute Of Creative Skills.", 500);
    setTimeout(() => addBotMessage("I'm here to help you with admissions, courses, mentors, and more.", 1000), 1200);
    setTimeout(() => showLeadForm(true), 2500);
  }
});

function attachButtonListeners() {
  document.querySelectorAll(".subject-btn").forEach(btn => {
    btn.onclick = () => handleUserInput(btn.textContent);
  });
}

// ---------------------- FORM ----------------------
function showLeadForm() {
  const formHTML = `
    <form id="lead-form" class="lead-form fade-in" novalidate>
      <p>Please share your details so we can assist you better:</p>

      <div class="form-group">
        <input type="text" id="user-name" placeholder="Your Name" required />
        <small class="error-message" id="error-name"></small>
      </div>

      <div class="form-group">
        <input type="email" id="user-email" placeholder="Your Email" required />
        <small class="error-message" id="error-email"></small>
      </div>

      <div class="form-group">
        <input type="tel" id="user-phone" placeholder="Your Phone (10 digits)" required />
        <small class="error-message" id="error-phone"></small>
      </div>

      <button type="submit" id="submit-lead">Let's Chat</button>
    </form>
  `;
  addBotMessage(formHTML, 1500);
  setTimeout(() => {
    const form = document.getElementById("lead-form");
    if (form) form.addEventListener("submit", handleFormSubmit);
  }, 1800);
}

async function handleFormSubmit(e) {
  e.preventDefault();
  const name = document.getElementById("user-name").value.trim();
  const email = document.getElementById("user-email").value.trim();
  const phone = document.getElementById("user-phone").value.trim();

  // Error message elements
  const nameError = document.getElementById("error-name");
  const emailError = document.getElementById("error-email");
  const phoneError = document.getElementById("error-phone");

  // Reset errors
  nameError.textContent = "";
  emailError.textContent = "";
  phoneError.textContent = "";

  let valid = true;

  // ✅ Name Validation
  if (name.length < 2) {
    nameError.textContent = "Please enter your full name.";
    valid = false;
  }

  // ✅ Email Validation
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailPattern.test(email)) {
    emailError.textContent = "Please enter a valid email address.";
    valid = false;
  }

  // ✅ Phone Validation
  const phonePattern = /^[0-9]{10}$/;
  if (!phonePattern.test(phone)) {
    phoneError.textContent = "Please enter a valid 10-digit phone number.";
    valid = false;
  }

  if (!valid) return;

  // ✅ Disable fields while submitting
  const form = e.target;
  form.querySelectorAll("input, button").forEach(el => el.disabled = true);

  const loader = document.createElement("div");
  loader.className = "message bot typing";
  loader.innerHTML = `<span class="dot"></span><span class="dot"></span><span class="dot"></span>`;
  chatWindow.appendChild(loader);
  chatWindow.scrollTop = chatWindow.scrollHeight;

  // ✅ Store lead in localStorage
  const leadData = { name, email, phone };
  localStorage.setItem("leadData", JSON.stringify(leadData));

  try {
    await fetch(GOOGLE_SCRIPT_URL, {
      method: "POST",
      mode: "no-cors",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(leadData)
    });

    loader.remove();
    addBotMessage(`<p>🎉 Thank you, ${name}! Your details have been submitted successfully.</p>`);
    setTimeout(showSubjectButtons, 2000);
  } catch (err) {
    loader.remove();
    console.error("Error submitting lead:", err);
    addBotMessage("<p>⚠️ Something went wrong while saving your details. Please try again later.</p>");
    form.querySelectorAll("input, button").forEach(el => el.disabled = false);
  }

  saveChat();
}

// ---------------------- UPDATE COUNSELLOR STATUS ----------------------
async function updateCounsellorStatus({ name, email, phone }) {
  const hasContacted = localStorage.getItem("counsellorContacted");

  if (hasContacted === "YES") {
    addBotMessage("<p>✅ You’ve already requested to talk to a counsellor. Our team will contact you soon.</p>");
    addBotMessage("<p>OR You can also reach out to us at <span><a href='tel:9594949959'>+91 9594949959</a></span></p>");
    setTimeout(showQuickActions, 1200);
    return;
  }

  addBotMessage("<p>⏳ Connecting you to our counsellor...</p>");
  const loader = document.createElement("div");
  loader.className = "message bot typing";
  loader.innerHTML = `<span class="dot"></span><span class="dot"></span><span class="dot"></span>`;
  chatWindow.appendChild(loader);
  chatWindow.scrollTop = chatWindow.scrollHeight;

  try {
    await fetch(GOOGLE_SCRIPT_URL, {
      method: "POST",
      mode: "no-cors",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, phone, talkToCounsellor: "YES" })
    });

    loader.remove();
    addBotMessage("<p>✅ Thank you! Our counsellor will contact you soon.</p>");
    addBotMessage("<p>OR You can also reach out to us at <span><a href='tel:9594949959'>+91 9594949959</a></span></p>");
    localStorage.setItem("counsellorContacted", "YES");
    setTimeout(showQuickActions, 1200);
  } catch (err) {
    loader.remove();
    console.error("Error updating counsellor status:", err);
    addBotMessage("<p>⚠️ Something went wrong while saving your response. Please try again later.</p>");
  }

  saveChat();
}

// ---------------------- HANDLE USER INPUT ----------------------
function handleUserInput(customText = null) {
  const text = customText || userInput.value.trim();
  if (!text) return;
  addUserMessage(text);
  userInput.value = "";

  const lower = text.toLowerCase();
  const leadData = JSON.parse(localStorage.getItem("leadData") || "{}");

  if (lower.includes("talk to counsellor")) {
    const name = leadData.name || document.getElementById("user-name")?.value || "";
    const email = leadData.email || document.getElementById("user-email")?.value || "";
    const phone = leadData.phone || document.getElementById("user-phone")?.value || "";

    if (name && email && phone) {
      localStorage.setItem("leadData", JSON.stringify({ name, email, phone }));
      updateCounsellorStatus({ name, email, phone });
    } else {
      addBotMessage("<p>Please share your details first before connecting to a counsellor.</p>");
      setTimeout(showLeadForm, 1500);
    }
    return;
  }

  if (lower.includes("go to main menu")) {
    showSubjectButtons();
    return;
  }

  if (lower.includes("apply now")) {
    addBotMessage(`<p>You can apply from <span><a href="https://iicsindia.org/admission.html" target="_blank">here</a></span>.</p>`);
    setTimeout(showQuickActions, 1000);
    return;
  }

  if (lower.includes("why iics")) {
    addBotMessage(`<p>Established under the aegis of the Ministry of Skill Development and Entreprenuership:
IICS is setting a benchmark in creative education, selected students are an integral part of the National Vision to be global Creative Leaders
<br>
<strong>Global Exposure:</strong>
International study tours to Cannes, MIPCOM & SIGGRAPH for real-world creative insights.<br>
<strong>Industry Experts as Mentors:</strong>
Learn from Oscar-winners, celebrities and top industry professionals.<br>
<strong>Paid Apprenticeship model:</strong>
Guaranteed, stipend-based apprenticeships embedded into every program.</p>
<p>For more info, Click <span><a href="https://iicsindia.org/industry-mentor.html">here</a></span></p>`);
    setTimeout(showQuickActions, 1000);
    return;
  }

  // ✅ Handle Courses
  if (lower.includes("animation") || lower.includes("sound") || lower.includes("event") || lower.includes("costume")) {
    const matched = responses.find(r => lower.includes(r.key.toLowerCase()));
    if (matched) {
      addBotMessage(matched.response);
      setTimeout(showQuickActions, 1000);
      return;
    }
  }

  // ✅ Handle all other subjects
  const matched = responses.find(r => r.keywords.some(k => lower.includes(k)));
  if (matched) {
    addBotMessage(matched.response);
    setTimeout(showQuickActions, 1000);
  } else {
    addBotMessage("Sorry, I couldn't find anything related to that. Try asking about admission, courses, mentors, etc.");
  }

  saveChat();
}

// ---------------------- INITIAL GREETING ----------------------
window.addEventListener("DOMContentLoaded", () => {
  if (localStorage.getItem("chatHistory")) {
    loadChat();
  } else {
    addBotMessage("👋 Hello! Welcome to Indian Institute Of Creative Skills.", 800);
    setTimeout(() => addBotMessage("I'm here to help you with admissions, courses, mentors, and more.", 1000), 1500);
    setTimeout(() => showLeadForm(), 3000);
  }
});

sendBtn.addEventListener("click", () => handleUserInput());
userInput.addEventListener("keydown", e => {
  if (e.key === "Enter") handleUserInput();
});
