var toggle = document.getElementById("toggle-color-scheme");
var toggle__mobile = document.getElementById("toggle-color-scheme__mobile");

var moon_icon = document.getElementById("my-moon-icon");
var moon_icon__mobile = document.getElementById("my-moon-icon__mobile");

var sun_icon = document.getElementById("my-sun-icon");
var sun_icon__mobile = document.getElementById("my-sun-icon__mobile");

var storedTheme = localStorage.getItem('theme') || (window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");
if (storedTheme) {
    document.documentElement.setAttribute('data-theme', storedTheme);
    document.documentElement.setAttribute('data-bs-theme', storedTheme);
}

// change button icon
if (storedTheme === "light") {
    moon_icon.style.display = "inline";
    moon_icon__mobile.style.display = "inline";

    sun_icon.style.display = "none";
    sun_icon__mobile.style.display = "none";
} else {
    moon_icon.style.display = "none";
    moon_icon__mobile.style.display = "none";

    sun_icon.style.display = "inline";
    sun_icon__mobile.style.display = "inline";
}

toggle.onclick = function() {
    var currentTheme = document.documentElement.getAttribute("data-theme");
    var targetTheme = "light";

    if (currentTheme === "light") {
        targetTheme = "dark";
    }

    // change button icon
    if (targetTheme === "light") {
        moon_icon.style.display = "inline";
        moon_icon__mobile.style.display = "inline";

        sun_icon.style.display = "none";
        sun_icon__mobile.style.display = "none";
    } else {
        moon_icon.style.display = "none";
        moon_icon__mobile.style.display = "none";

        sun_icon.style.display = "inline";
        sun_icon__mobile.style.display = "inline";
    }

    document.documentElement.setAttribute('data-theme', targetTheme);
    document.documentElement.setAttribute('data-bs-theme', targetTheme);

    localStorage.setItem('theme', targetTheme);
};

toggle__mobile.onclick = toggle.onclick;