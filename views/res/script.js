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
    var display;
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
                display.destroy();
                delete currentproject;
            }
            currentproject = res;
            content.innerHTML='';
            content.innerHTML = `
            <nav class="header split" style='height: fit-content;'>

                ${res.settings.type == 0 ? '<i class="fa-regular fa-file-csv"></i>' : '<i class="fa-regular fa-file-code"></i>'}
                <div><h1>${res.settings.displayname}</h1>
                ${res.settings.type == 0 ? '<label>CSV File</label>' : '<label>JSON File</label>'}

                </div>
                <button class='iconbtn' onclick='projectexport();'><i style='font-size: 1.1em;' class="fa-light fa-file-export"></i>Export</button>
                <button class='iconbtn captionbtn' onclick='projectsave();'><i style='font-size: 1.1em;' class="fa-light fa-floppy-disk"></i>Save</button>

            </nav>
                <br>
                <nav class='split' id='workarea'>

                <div class='leftbar sidebar'>
                    <div style='margin-right:2em;' class='leftleftbar'>
                    <div class='split'>
                    <div>
                    <h2>Visualization</h2>
                    <label>Choose how you want your image to be displayed</label>
                    </div>
                    </div>
                    <table id='tabulardata'>
                    
                    </table>
                </div>
                
<div class='____RIGHT_SIDE' id='custumization' style='width:fit-content;'>                

                    

</div>

                </div>
                <nav style='display:flex;flex-direction:column;width:100%;'>
                <div style='height:100%;'><canvas id="activechart"></canvas></div>

                </div>
                </nav>
                
                </nav>
                `;
                document.querySelectorAll('input[name="choosedisplay"]').forEach((c) => {
                    c.addEventListener('change', (ev) => {
                        console.log("change", c, ev)
                        if(c.value == 'gd') {
                            document.getElementById('selectplots').removeAttribute('disabled');
                            plotevt(document.getElementById('selectplots'));
                        } else {
                            document.getElementById('selectplots').setAttribute('disabled', '');

                        }
                    })
                })


                initchartcsv();
                

            plist.forEach((p) => {
                p.removeAttribute('disabled')
                p.classList.remove("btcursordisabled");
            });
        }).catch((err) => {
            console.error(err);
        })
    }

    
}
function setvalue(elem) {

    if(elem.value == 'None') {
        chartform.data.datasets[0].data.splice(chartform.data.datasets[0].data.indexOf(_currentsettingselem.innerText), 1);
    } else {
        chartform.data.datasets[0].data.push(_currentsettingselem.innerText);
        
    }
    display.update();
}

var valdropdwn = [{Column: 'None', Value: null}];

function rendervaldropdwn(elem) {
    const vss = document.getElementById('valuesselection');
    vss.innerHTML = '';
    valdropdwn.forEach((v) => {
        vss.innerHTML+=`<option>${v.Column}</option>`;
    })
}

function togglecolumn(elem) {
    const vss = document.getElementById('valuesselection');
    if(elem.checked) {
        console.log(_currentsettingselem.innerText)
        chartform.data.labels.push(_currentsettingselem.innerText);
        valdropdwn.push({Column: _currentsettingselem.innerText, Value: null});
        rendervaldropdwn();
        document.getElementById('valuesselection').setAttribute('disabled', '');
    } else {
        chartform.data.labels.splice(chartform.data.labels.indexOf(_currentsettingselem.innerText),1);
        valdropdwn.forEach((v) => {
            if(v.Column == _currentsettingselem.innerText) {
                valdropdwn.splice(v, 1);
            }
        })
        document.getElementById('valuesselection').removeAttribute('disabled');

    }
    display.update();
}
var chartform;
var filedata;
var _currentsettingselem = null;

function initchartcsv() {
    if(display) display.destroy();
    console.log("csv:", currentproject.file);

    // Inits in bar charts
    chartform = {
        type: 'bar',
        data: {
            labels: [],
            datasets:[{
                label: 'test',
                data: []
            }]
            // datasets:[{
            //     label: currentproject.settings.displayname,
            //     data: []
            // }]
        }
    };
    const table = document.getElementById('tabulardata');
    d3.csv(`/files/${currentproject.settings.ID}`).then((res) => {
        console.log(res);
        filedata = res;
        console.log("length", res.length);

        var inner = '<thead><tr>';
        for(let c = 0;c<res.columns.length;c++) {
            // display the columns
            inner+=`<th onclick='settings(this, 0)'>${res.columns[c]}</th>`;
        }
        inner += '</tr></thead><tbody>';
        for(var i = 0;i<res.length;i++) {


            inner+='<tr>';
            for(var c =0;c<res.columns.length;c++) {
                inner+=`<td onclick='settings(this, 1)'>${res[i][res.columns[c]]}</td>`;
            }
            inner+='</tr>';
        }
        inner+='</tbody>';
        table.innerHTML = inner;
        display = new Chart('activechart', chartform);
    })

}

function projectexport() {
    var a = document.createElement('a');
    a.href = display.toBase64Image();
    a.download = 'export.png';
    a.click();
}

function isColumn(elem) {
    for(var i = 0;i<valdropdwn.length;i++){
        if(valdropdwn[i].Column == elem.innerHTML) return true;
    }
    return false;
}

function isValue(elem) {
    for(var i = 0;i<valdropdwn.length;i++){
        if(valdropdwn[i].Value == elem.innerHTML) return true;
    }
    return false;
}

function settings(elem, type){
    if(_currentsettingselem == elem) return;
    if(_currentsettingselem) _currentsettingselem.classList.remove('act');
    _currentsettingselem = elem;
    elem.classList.add('act');

    const custumization = document.getElementById('custumization');
    custumization.innerHTML = '';
    custumization.innerHTML = `
        <div class='flexcentercolumn'>
    <label>Chart Type :</label>
    <select id='selectplots' onchange='plotevt(this)'> <option>Bar</option><option>Line</option><option>Bubble</option><option>Doughnut</option><option>Pie</option><option>Polar Area</option><option>Radar</option><option>Scatter</option>
    </select>
    </div>

    <div class='flexcentercolumn'>
    <label style='margin-bottom:8px;'><input type='checkbox' onchange='togglecolumn(this)' ${isColumn(elem) ? 'checked' : ''}/> Column</label>
    </div>
    <div class='flexcentercolumn'>
        <label>Value :</label>
        <select id='valuesselection' onchange='setvalue(this)' ${isColumn(elem) ? 'disabled' : ''}>
        </select>
    </div>
        `
        rendervaldropdwn(elem);
}

function plotevt(parent) {
    if(display) display.destroy();

    console.log('plotevt', parent.value);
    if(parent.value == 'Polar Area') {
        chartform.type = 'polarArea';
    } else {
        chartform.type = parent.value.toLowerCase();
    }
    display = new Chart('activechart', chartform);

}


function getrandomcolors(count) {
    let colors=[];
    for(let i = 0;i<count;i++) colors.push(`#${Math.floor(Math.random() * 0xFFFFFF).toString(0x10)}`);
    return colors;
}
