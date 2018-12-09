'use strict';

let panels = document.getElementsByClassName("panel");
const h = window.innerHeight;
let event = document.createEvent('Event');
event.initEvent('reach', true, true);
for(let panel of panels) {
    panel.style.height = `${h}px`;
}

let downButton = document.getElementsByClassName("down-button")[0];
downButton.style.visibility = 'hidden';

let page = 0;
let pageFlag = true;
window.onload= function () {
    let wheel= function (event) {
        let delta=0;
        if(!event)//for ie
            event=window.event;
        if(event.wheelDelta){//ie,opera
            delta=event.wheelDelta/120;
        }else if(event.detail){
            delta=-event.detail/3;
        }
        if(delta){
            handle(delta);
        }
        if(event.preventDefault)
            event.preventDefault();
        event.returnValue=false;
    };
    if(window.addEventListener){
        window.addEventListener('DOMMouseScroll',wheel,false);
    }
    window.onwheel=wheel;
    downButton.onclick = () => handle(-1);
    window.onbeforeunload = () => window.scrollTo(0, 0);
};
function handle(delta) {
    if(!pageFlag)
        return;
    if (delta > 0 && page > 0) {//向上滚动
        page--;
        panels[page].scrollIntoView({ behavior: 'smooth' });
        panels[page].dispatchEvent(event);
    } else if (delta<0 && page < panels.length-1){//向下滚动
        page++;
        panels[page].scrollIntoView({ behavior: 'smooth'});
        panels[page].dispatchEvent(event);
    }
    if (page > 0 && page !== panels.length-1)
        downButton.style.visibility = 'visible';
    else
        downButton.style.visibility = 'hidden';
    pageFlag = false;
    setTimeout(() => {pageFlag = true}, 500);
}