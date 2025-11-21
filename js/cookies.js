function setCookie(name, value, days) {
    let expires = "";
    if (days) {
      const date = new Date();
      date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
      expires = "; expires=" + date.toUTCString();
    }
    document.cookie = name + "=" + encodeURIComponent(value || "") + expires + "; path=/";
  }
  
  function getCookie(name) {
    const nameEQ = name + "=";
    const ca = document.cookie.split(';');
    for (let i = 0; i < ca.length; i++) {
      let c = ca[i];
      while (c.charAt(0) === ' ') c = c.substring(1);
      if (c.indexOf(nameEQ) === 0) return decodeURIComponent(c.substring(nameEQ.length));
    }
    return null;
  }
  
  function deleteCookie(name) {
    document.cookie = name + "=; Max-Age=-99999999;";
  }
  
  function acceptCookies() {
    setCookie("cookiesAccepted", "accepted", 365);
    document.getElementById("cookieBanner").style.display = "none";
  }
  
  function rejectCookies() {
    setCookie("cookiesAccepted", "rejected", 365);
    document.getElementById("cookieBanner").style.display = "none";
    // Optional: disable analytics or tracking scripts here
  }
  
  window.onload = function () {
    const cookieStatus = getCookie("cookiesAccepted");
    if (!cookieStatus) {
      document.getElementById("cookieBanner").style.display = "block";
    }
  };