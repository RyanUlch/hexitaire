import React, { useState, useEffect, useRef } from 'react';

const Draggable = (props: {children: any, cardID: string}) => {

	const ref = React.useRef() as React.MutableRefObject<HTMLInputElement>;

// Make the DIV element draggable:
const [elmnt, setElmnt] = useState<HTMLElement | null>()
useEffect(() => {
	setElmnt(ref.current);
	if (elmnt) {
		elmnt.onmousedown = dragMouseDown;
	}
}, []);

function closeDragElement() {
    document.onmouseup = null;
    document.onmousemove = null;
  }

  function elementDrag(e: any) {
    if (elmnt) {
		e = e || window.event;
		e.preventDefault();
		elmnt.style.top = e.clientY + "px";
		elmnt.style.left = e.clientX + "px";
	}
  }

  function dragMouseDown(e: any) {
    e = e || window.event;
    e.preventDefault();
    document.onmouseup = closeDragElement;
    document.onmousemove = elementDrag;
  }

function dragElement() {
	console.log(ref.current);
    const check = elmnt;
	if (check) {
		check.onmousedown = dragMouseDown;
	}
}

	return (
		<div ref={ref} id={props.cardID} className='dragElement'>
			{props.children}
			
		</div>
	);
}

export default Draggable;