'use strict';

let isMobile = false; //initiate as false
// device detection
if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|ipad|iris|kindle|Android|Silk|lge |maemo|midp|mmp|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows (ce|phone)|xda|xiino/i.test(navigator.userAgent)
    || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(navigator.userAgent.substr(0,4))) {
    isMobile = true;
}

if (isMobile)
    alert("This is not a web page for mobile browser.");

let panels = document.getElementsByClassName("panel");
let event = document.createEvent('Event');
event.initEvent('reach', true, true);

function setSize() {
    const h = window.innerHeight;
    for(let panel of panels) {
        panel.style.height = `${h}px`;
    }
}

if(window.addEventListener){
    window.addEventListener('DOMMouseScroll',(e) => {e.preventDefault();},false);
}
window.onwheel= (e) => {e.preventDefault();};
document.addEventListener('keydown', (event) => {
    switch (event.key) {
        case 'ArrowDown':
            event.preventDefault();
            break;
        case 'ArrowUp':
            event.preventDefault();
            break;
    }
});

let downButton = document.getElementById("down-button");
downButton.style.visibility = 'hidden';

let page = 0;
let pageFlag = true;
let oldDelta = 0;
setSize();
window.onload= function () {
    window.onresize = () => {setSize(); panels[page].scrollIntoView();};
    let wheel= function (event) {
        let delta=0;
        if(!event)//for ie
            event=window.event;
        if(event.wheelDelta){//ie,opera
            delta=event.wheelDelta/120;
        }else if(event.detail){
            delta=-event.detail/3;
        }
        if(Math.abs(delta) > 1 || Math.abs(delta-oldDelta) > 0.3){
            handle(delta);
        }
        oldDelta = delta;
        if(event.preventDefault)
            event.preventDefault();
        event.returnValue=false;
    };
    if(window.addEventListener){
        window.addEventListener('DOMMouseScroll',wheel,false);
    }
    window.onwheel=wheel;
    window.onbeforeunload = () => window.scrollTo(0, 0);
    document.addEventListener('keydown', (event) => {
        switch (event.key) {
            case 'ArrowDown':
                event.preventDefault();
                handle(-1.5);
                break;
            case 'ArrowUp':
                event.preventDefault();
                handle(1.5);
                break;
        }
    });
    downButton.onclick = () => changePage(-1.5);
};

function changePage(delta) {
    if (delta > 0.3 && page > 0) {//向上滚动
        page--;
        panels[page].scrollIntoView({ behavior: 'smooth' });
        panels[page].dispatchEvent(event);
    } else if (delta< -0.3 && page < panels.length-1){//向下滚动
        page++;
        panels[page].scrollIntoView({ behavior: 'smooth'});
        panels[page].dispatchEvent(event);
    }
    if (page > 0 && page !== panels.length-1)
        downButton.style.visibility = 'visible';
    else
        downButton.style.visibility = 'hidden';
}

function handle(delta) {
    if(!pageFlag)
        return;
    changePage(delta);
    pageFlag = false;

    setTimeout(() => {pageFlag = true}, 800);
}