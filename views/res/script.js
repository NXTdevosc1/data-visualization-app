var ColorMode = localStorage.getItem("colormode");
if(ColorMode > 1) {
    localStorage.removeItem("colormode");
    ColorMode = null;
}
if(ColorMode == 1) {
    setcolormode(1);
    const s = document.getElementById("modeswitch");

}




function setcolormode(color) {
    const md = document.getElementById("modeswitch");
    if(color == 1) {
        document.body.classList.add("dark");
        md.classList.remove("fa-regular");
        md.classList.add("fa-solid");
    } else {
        
        document.body.classList.remove("dark");
        md.classList.remove("fa-solid");
        md.classList.add("fa-regular");
    }
}

window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (event) => {
    let newColorScheme = event.matches ? 1 : 0;
    console.log("New color scheme", newColorScheme);
    if(localStorage.getItem("colormode") == null) {
        setcolormode(color);
    }
});
function togglecolormode() {
    if(ColorMode != null) {
        ColorMode ^= 1;
        localStorage.setItem("colormode", ColorMode);
        setcolormode(ColorMode);
    } else {
        ColorMode = 1;
        localStorage.setItem("colormode", 1);
        setcolormode(1);
    }
}

if(!acc) {
    function login() {
        event.preventDefault();
        console.log("hello world");
        msl.loginRedirect(_msscope);
    }

}


