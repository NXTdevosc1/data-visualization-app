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
        msl.loginRedirect(_msscope);
    }

} 
else {
    function popupupload() {

        document.getElementById("uploadform").style.display = 'block';
    }
    function upload() {
        document.getElementById('userid').value = msl.getActiveAccount().localAccountId;
        document.getElementById('uploadf').submit();
    }

    function deleteproject(projid) {
        console.log("delete");
    }

    var currentproject = null;
    function openproject(projid) {
        if(currentproject && currentproject.settings.ID == projid) return;
        const content = document.getElementById("projectcontent");
        const plist = document.querySelectorAll("#projectlist .file");
        plist.forEach((p) => {
            p.setAttribute('disabled', '')
            p.classList.add("btcursordisabled")
        });
        fetch('/api/open', {
            method: 'post',
            headers: {
                'content-type': 'application/json'
            },
            body: JSON.stringify({
                fileid: projid
            })
        }).then((res) => {
            if(res.status != 200) throw `Error response status : ${res.status}`;
            return res.json();
        }).then((res) => {
            console.log(res);
            if(currentproject) {
                delete currentproject.Chart;
                delete currentproject;
            }
            currentproject = res;
            content.innerHTML = `
            <nav class="header split" style='height: fit-content;'>

                ${res.settings.type == 0 ? '<i class="fa-regular fa-file-csv"></i>' : '<i class="fa-regular fa-file-code"></i>'}
                <div><h1>${res.settings.displayname}</h1>
                ${res.settings.type == 0 ? '<label>CSV File</label>' : '<label>JSON File</label>'}

                </div>
                <button class='iconbtn' onclick='projectexport();'><i style='font-size: 1.1em;' class="fa-light fa-file-export"></i>Export</button>
                <button class='iconbtn captionbtn' onclick='projectsave();'><i style='font-size: 1.1em;' class="fa-light fa-floppy-disk"></i>Save</button>

            </nav>

                <nav class='split' id='workarea'>

                <div class='sidebar'>
                <h2>Visualization</h2>
                <label>Choose how you want the image to be displayed</label>
                <br>
                
                <hr/>
                <br>
                <div class='display'>
                <label style='margin-bottom:20px;'>Display type:</label>
                
                <div>
                
                <label><input type='radio' name='choosedisplay' checked/> Table</label>
                </div>
                <div>
                
                <label><input type='radio' name='choosedisplay' value='Graphical Charts'/> Graphical</label>

                </div>

                <select id='selectplots'>
                    <option onclick="displaytable()">
                        <img src='/res/barchart.png' alt='Bar Chart'/>
                        <label>Bar</label>
                    </option>
                    <option onclick="displaytable()">
                        <img src='/res/linechart.png' alt='Line Chart'/>
                        <label>Line</label>
                    </option>
                    <option onclick="displaytable()">
                        <img src='/res/bubblechart.png' alt='Bubble Chart'/>
                        <label>Bubble</label>
                    </option>
                    <option onclick="displaytable()">
                        <img src='/res/doughnutchart.png' alt='Doughnout Chart'/>
                        <label>Doughnut</label>
                    </option>
                    <option onclick="displaytable()">
                        <img src='/res/piechart.png' alt='Pie Chart'/>
                        <label>Pie</label>
                    </option>
                    <option onclick="displaytable()">
                        <img src='/res/polarareachart.png' alt='Polar Area Chart'/>
                        <label>Polar Area</label>
                    </option>
                    <option onclick="displaytable()">
                        <img src='/res/radarchart.png' alt='Radar Chart'/>
                        <label>Radar</label>
                    </option>
                    <option onclick="displaytable()">
                        <img src='/res/scatterchart.png' alt='Scatter Chart'/>
                        <label>Scatter</label>
                    </option>
                </select>
                </div>
                </div>
                <div><canvas id="activechart"></canvas></div>
                
                </nav>
                `;
                
                currentproject.Chart = new Chart('activechart', {
                    type: 'bar',
                    data: {
                        labels: ['Red', 'Blue', 'Yellow', 'Green', 'Purple', 'Orange'],
                        datasets: [{
                            label: '# of Votes',
                            data: [12, 19, 3, 5, 2, 3],
                            backgroundColor: [
                                'rgba(255, 99, 132, 0.2)',
                                'rgba(54, 162, 235, 0.2)',
                                'rgba(255, 206, 86, 0.2)',
                                'rgba(75, 192, 192, 0.2)',
                                'rgba(153, 102, 255, 0.2)',
                                'rgba(255, 159, 64, 0.2)'
                            ],
                            borderColor: [
                                'rgba(255, 99, 132, 1)',
                                'rgba(54, 162, 235, 1)',
                                'rgba(255, 206, 86, 1)',
                                'rgba(75, 192, 192, 1)',
                                'rgba(153, 102, 255, 1)',
                                'rgba(255, 159, 64, 1)'
                            ],
                            borderWidth: 1
                        }]
                    },
                    options: {
                        scales: {
                            y: {
                                beginAtZero: true
                            }
                        }
                    }
                });
                

            plist.forEach((p) => {
                p.removeAttribute('disabled')
                p.classList.remove("btcursordisabled");
            });
        }).catch((err) => {
            console.error(err);
        })
    }

    
}
