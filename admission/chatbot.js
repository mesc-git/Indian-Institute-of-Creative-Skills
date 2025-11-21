const chatWindow = document.getElementById("chat-window");
const userInput = document.getElementById("user-input");
const sendBtn = document.getElementById("send-btn");
const subjectButtonsDiv = document.getElementById("subject-buttons");

const subjects = [
  "Admission Process",
  "Courses",
  "Mentors",
  "Sample Papers"
];

const responses = [
  {
    key: "Ceo",
    keywords: ["Ceo", "ceo"],
    response: `
          <p>The CEO of Indian Institute Of Creative Skills is Dr. Mohit Soni</p>
         `
  },
  {
    key: "Hi",
    keywords: ["hi", "hello", "hey", "good morning", "good evening", "good afternoon"],
    response: `
          <p>Hi, How can i help you?</p>
         `
  },
  {
    key: "Admission Process",
    keywords: ["admission", "apply", "entrance", "fees", "support", "process"],
    response: `
      <p>Here is info about the admission process:</p>
      <ul class="text-[#fff]">
        <li ><a href="admission-process.html" class="!text-[#000]">How to Apply</a></li>
      </ul>`
  },
  {
    key: "Design in Animation & Gaming",
    keywords: ["animation", "gaming", "game design", "3d modeling"],
    response: `
      <p><strong>Design in Animation & Gaming</strong></p>
      <ul>
        <li class="!text-[#000]">✔ 12th grade pass from a recognized board</li>
        <li class="!text-[#000]">✔ Interest in 3D modeling, animation, game design</li>
        <li class="!text-[#000]">✔ No technical experience required</li>
      </ul>
    `
  },
  {
    key: "Digital Content Creation & Media Management",
    keywords: ["digital media", "content creation", "social media", "branding"],
    response: `
      <p><strong>Digital Content Creation & Media Management</strong></p>
      <ul>
        <li class="!text-[#000]">✔ 12th grade pass from a recognized board</li>
        <li class="!text-[#000]">✔ Interest in content, social media, storytelling</li>
        <li class="!text-[#000]">✔ Creative mindset, no prior experience needed</li>
      </ul>
    `
  },
  {
    key: "Sound Design & Music Video Production",
    keywords: ["sound design", "music production", "music video", "audio"],
    response: `
      <p><strong>Sound Design & Music Video Production</strong></p>
      <ul>
        <li class="!text-[#000]">✔ 12th grade pass from a recognized board</li>
        <li class="!text-[#000]">✔ Interest in music, audio, sound design</li>
        <li class="!text-[#000]">✔ No prior training required</li>
      </ul>
    `
  },
  {
    key: "Event Planning & Management",
    keywords: ["event planning", "event management", "live events", "hospitality"],
    response: `
      <p><strong>Event Planning & Management</strong></p>
      <ul>
        <li class="!text-[#000]">✔ 12th grade pass from a recognized board</li>
        <li class="!text-[#000]">✔ Interest in events, hospitality, entertainment</li>
        <li class="!text-[#000]">✔ No experience needed, just creativity & drive</li>
      </ul>
    `
  },
  {
    key: "Hair, Makeup & Prosthetics",
    keywords: ["makeup", "hair", "prosthetics", "beauty", "special effects"],
    response: `
      <p><strong>Hair, Makeup & Prosthetics</strong></p>
      <ul>
        <li class="!text-[#000]">✔ 12th grade pass from a recognized board</li>
        <li class="!text-[#000]">✔ Interest in beauty, special effects, transformation</li>
        <li class="!text-[#000]">✔ Creativity and steady hands, no training needed</li>
      </ul>
    `
  },
  {
    key: "Costume Designing",
    keywords: ["costume", "fashion", "design", "character", "textiles"],
    response: `
      <p><strong>Costume Designing</strong></p>
      <ul>
        <li class="!text-[#000]">✔ 12th grade pass from a recognized board</li>
        <li class="!text-[#000]">✔ Interest in fashion, character-driven design</li>
        <li class="!text-[#000]">✔ Passion for storytelling through fabric</li>
      </ul>
    `
  },
  {
    key: "PR & Journalism",
    keywords: ["public relations", "journalism", "media", "communication"],
    response: `
      <p><strong>PR & Journalism</strong></p>
      <ul>
        <li class="!text-[#000]">✔ 12th grade pass from a recognized board</li>
        <li class="!text-[#000]">✔ Interest in media, communication, storytelling</li>
        <li class="!text-[#000]">✔ No experience needed, just curiosity & passion</li>
      </ul>
    `
  },
  // {
  //   key: "Visual & Communication Design",
  //   keywords: ["public relations", " Design", "Visual", "communication"],
  //   response: `
  //     <p><strong>Visual & Communication Design</strong></p>
  //     <ul>
  //       <li class="!text-[#000]">✔ 12th grade pass from a recognized board</li>
  //       <li class="!text-[#000]">✔ Interest in media, communication, storytelling</li>
  //       <li class="!text-[#000]">✔ No experience needed, just curiosity & passion</li>
  //     </ul>
  //   `
  // },
  {
    key: "Courses",
    keywords: ["course", "program", "degree", "study", "field"],
    response: `
      <p>Here's a list of all courses at IICS:</p>
      <ul>



       <li><a href="animation-&-gaming.html" class="!text-[#000]">• Animation & Game Development</a></li>
<li><a href="bsc-in-digital-content-creation-&-media-production.html" class="!text-[#000]">• Digital Content Creation & Media Management</a></li>
<li><a href="sound-design-&-music-video-production.html" class="!text-[#000]">•	Sound Design & Music Video Production</a></li>
<li><a href="event-&-experimental-management.html" class="!text-[#000]">•	Event And Experimental Management</a></li>
<li><a href="hair-make-up-&-prosthetics.html" class="!text-[#000]">•	Hair, Makeup & Prosthetics</a></li>
<li><a href="costume-design.html" class="!text-[#000]">•	Costume Designing</a></li>
<li><a href="pr-&-journalism.html" class="!text-[#000]">•	 PR & Journalism</a></li>
<li><a href="VisualandCommunicationDesign.html" class="!text-[#000]">•	 Visual & Communication Design</a></li>
      </ul>`
  },
  {
    key: "Mentors",
    keywords: ["mentor", "faculty", "teacher", "guide"],
    response: `
      <p>Meet our top mentors:</p>
      <ul>
        <li><a href="" class="!text-[#000]">Dr. (Hon) Amit Behl</a></li>
        
        <li><a href="" class="!text-[#000]">Padma Shri Resul Pookutty</a></li>
        <li><a href="" class="!text-[#000]">Padma Shri Shankar Mahadevann</a></li>
        <li><a href="" class="!text-[#000]">Ms.Dia Mirza</a></li>
        <li><a href="" class="!text-[#000]">Ms. Kavita Krishnamurthy</a></li>
        <li><a href="" class="!text-[#000]">Ms. Neeta Lulla</a></li>
        <li><a href="" class="!text-[#000]">Ms. Sushma Gaikwad</a></li>
        <li><a href="industry-mentor.html" >and Many More....</a></li>


       

      </ul>`
  },
  {
    key: "Sample Papers",
    keywords: ["sample papers", "exam", "syllabus", "entrance exam"],
    response: `
      <p>You can refer to the sample papers of all our courses <a href="https://iicsindia.org/sample-paper.html">here</a>.</p>
      `
  },
  {
    key: "Careers",
    keywords: ["career", "job", "future", "employment", "outcome"],
    response: `
      <p>We offer 7 career pathways:</p>
      <ul>
        <li><a href="/#programs" class="!text-[#000]">Explore Career Outcomes</a></li>
      </ul>`
  },
  {
    key: "International Travel",
    keywords: ["abroad", "travel", "international trip", "foreign", "cannes", "exposure"],
    response: `
      <p><strong>Will I get to travel abroad?</strong></p>
      <p>Yes! Every student is guaranteed at least one international exposure trip to major creative industry events during their course.</p>
      <p><strong>Which international events can I attend?</strong></p>
      <p>Students may attend global events like Cannes Film Festival, MIPCOM, SIGGRAPH, MIDEM, and other top media, entertainment, and design summits based on their specialization.</p>
      <p><strong>Are international trips included in the course fee?</strong></p>
      <p>Yes, the international exposure trip is included in your course fee—no extra charges!</p>
    `
  },
  {
    key: "EMI and Fees",
    keywords: ["emi", "loan", "installment", "payment option", "scholarship", "fee"],
    response: `
      <p><strong>Are EMI or loan options available?</strong></p>
      <p>Yes! We offer easy EMI plans and loan assistance to help you manage your course fee smoothly.</p>
      <p><strong>Do you provide scholarships?</strong></p>
      <p>No! IICS does not provide any kind of scholarships.</p>
      <p><strong>Is there any registration fee?</strong></p>
      <p>Yes, a non-refundable registration fee of INR 2000 is applicable.</p>
    `
  }
  //   {
  //     key: "Live Projects",
  //     keywords: ["project", "live", "real world"],
  //     response: `
  //       <p>Learn through Live Projects:</p>
  //       <a href="live-project.html" class="!text-[#000]">Watch Projects</a>`
  //   },
  //   {
  //     key: "Industry Associations",
  //     keywords: ["industry", "partner", "association", "network"],
  //     response: `
  //       <p>We have strong industry associations.</p>
  //       <a href="industry-assosiates.html" class="!text-[#000]">See Partners</a>`
  //   },
  //   {
  //     key: "Apprenticeship",
  //     keywords: ["apprentice", "intern", "training"],
  //     response: `
  //       <p>Join our Apprenticeship Programs:</p>
  //       <a href="apprenticeship.html"class="!text-[#000]">Learn More</a>`
  //   },
];

const addMessage = (text, sender = "bot") => {
  const msg = document.createElement("div");
  msg.className = `message ${sender}`;
  msg.innerHTML = text;
  chatWindow.appendChild(msg);
  chatWindow.scrollTop = chatWindow.scrollHeight;
};

const handleSubject = (subjectName) => {
  const matched = responses.find(r => r.key === subjectName);
  addMessage(subjectName, "user");
  setTimeout(() => {
    if (matched) {
      addMessage(matched.response);
    } else {
      addMessage(`Sorry, I couldn't find anything related to that.`);
    }
  }, 300);
};

const handleUserInput = () => {
  const message = userInput.value.trim();
  if (!message) return;

  addMessage(message, "user");
  userInput.value = "";

  const lower = message.toLowerCase();

  const matched = responses.find(r =>
    r.keywords.some(keyword => lower.includes(keyword))
  );

  setTimeout(() => {
    if (matched) {
      addMessage(matched.response);
    } else {
      addMessage(`Sorry, I couldn't find anything related to that. Try asking about admission, courses, mentors, etc.`);
    }
  }, 500);
};

// Subject buttons creation
const renderSubjectButtons = () => {
  const ul = document.createElement("ul");
  ul.className = "button-list"; 

  subjects.forEach(subject => {
    const li = document.createElement("li");
    li.className = "button-item";

    const btn = document.createElement("button");
    btn.className = "subject-btn";
    btn.innerText = subject;
    btn.onclick = () => handleSubject(subject);

    li.appendChild(btn);
    ul.appendChild(li); 
  });

  subjectButtonsDiv.appendChild(ul);
};

renderSubjectButtons();

sendBtn.addEventListener("click", handleUserInput);
userInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter") handleUserInput();
});