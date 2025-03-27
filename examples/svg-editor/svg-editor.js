const DEFAULT_SELECTED_TOOL = 'M'
const DEFAULT_CIRCLE_ATTRIBUTES = {
  r: 10,
  fill: 'none',
  stroke: 'black',
  'stroke-width': 2,
}
const D_ACTION_MAP = {
  M: {
    length: 2,
    toolSelectEvent: (e) => {

    }
  },
  C: {
    name: 'Cubic Curve',
    length: 6,
  },
  S: {
    name: 'Cubic Curve Segment',
    length: 4,
  },
  L: {
    length: 2,
  },
  Z: {
    length: 0,
  },
}
let selectedElement = null;
let lastSelectedElement = null;
let focusedElement = null;
let selectedTool = DEFAULT_SELECTED_TOOL;
let selectedDAction = DEFAULT_SELECTED_TOOL;
let selectedPathDs = [];
let showControlPoints = false;
let anchorX;
let anchorY;

function createSvgElement(type) {
  return document.createElementNS('http://www.w3.org/2000/svg', type)
}

function createSvgCircleElement(attributes = {}) {
  const attr = { ...DEFAULT_CIRCLE_ATTRIBUTES, ...attributes }
  const circleEl = createSvgElement('circle')
  Object.entries(attr).forEach(([key, value]) => {
    circleEl.setAttribute(key, value)
  })
  return circleEl
}

function cleanPathD(d) {
  return d.replace(/[\s,]+/g, ' ').trim();
}

const xPos = document.querySelector('#x_pos');
const yPos = document.querySelector('#y_pos');
const svg = document.querySelector('#stage > svg');
const focusedElementPropertiesGroup = document.querySelector('#stage > svg g#focused-element-properties')
const mainToolbar = document.querySelector('main > section#toolbar')
const showControlPointsInput = document.querySelector('input#show-control-points')
const isCurve = true;

showControlPointsInput.addEventListener('change', (event) => {
  showControlPoints = event.currentTarget.checked
})

document.querySelectorAll('path').forEach((path) => {
  path.setAttribute('d', cleanPathD(path.getAttribute('d')));
})

Object.entries(D_ACTION_MAP).forEach(([key, value]) => {
  const button = document.createElement('button')
  button.innerText = key
  button.id = `main-toolbar-d-action-${key}`
  if (DEFAULT_SELECTED_TOOL === key) {
    button.classList.add('selected')
  }
  button.addEventListener('click', (event) => {
    if (selectedDAction === key) {
      return;
    }
    button.classList.add('selected')
    const previousDActionEl = document.querySelector(`#main-toolbar-d-action-${selectedDAction}`)
    previousDActionEl.classList.remove('selected')
    selectedDAction = key
  })
  mainToolbar.appendChild(button)
})

function parsePathD(d) {
  const pathDs = d.split(' ');
  const parsedPathDs = [];
  let action = null;
  let actionIndex = -1;
  pathDs.forEach((pathD) => {
    if (pathD in D_ACTION_MAP) {
      action = pathD;
      actionIndex += 1;
      parsedPathDs[actionIndex] = [action];
    } else {
      parsedPathDs[actionIndex].push(Number(pathD));
    }
  });
  return parsedPathDs;
}

function focusElement(el) {
  const parsedPathD = parsePathD(el.getAttribute('d'))
  focusedElement = el
  parsedPathD.forEach((action) => {
    const actionType = action[0]
    const actionPoints = action.slice(1)
    const actionElements = []
    switch(actionType) {
      case 'M': 
        const point = createSvgCircleElement({ cx: actionPoints[0], cy: actionPoints[1]})
        focusedElementPropertiesGroup.appendChild(point)
        break;
      case 'C':
        const point1 = createSvgCircleElement({ cx: actionPoints[0], cy: actionPoints[1], r: 10, stroke: 'blue'})
        const point2 = createSvgCircleElement({ cx: actionPoints[2], cy: actionPoints[3], r: 12, stroke: 'red'})
        const point3 = createSvgCircleElement({ cx: actionPoints[4], cy: actionPoints[5], r: 14})
        focusedElementPropertiesGroup.appendChild(point1)
        focusedElementPropertiesGroup.appendChild(point2)
        focusedElementPropertiesGroup.appendChild(point3)
        break;
    }
  })
}

svg.addEventListener('mousemove', (event) => {
  xPos.textContent = event.offsetX;
  yPos.textContent = event.offsetY;
  if (selectedElement) {

    if (selectedElement.tagName === 'circle') {
      selectedElement.setAttribute('cx', event.offsetX);
      selectedElement.setAttribute('cy', event.offsetY);
    }
    if (selectedElement.tagName === 'rect') {
      selectedElement.setAttribute('x', event.offsetX);
      selectedElement.setAttribute('y', event.offsetY);
    }
    if (selectedElement.tagName === 'path') {
      const existingD = selectedElement.getAttribute('d');
      if (isCurve) {
        // get the last action
        const pathDs = parsePathD(existingD).slice(0, -1).map((p) => p.join(' ')).join(' ');
        console.log('pathDs', pathDs);
        selectedElement.setAttribute('d', `${pathDs} C ${event.offsetX} ${event.offsetY} ${event.offsetX} ${event.offsetY} ${event.offsetX} ${event.offsetY}`);
      } else {
        // This does a "messy" draw
        selectedElement.setAttribute('d', `${existingD} C ${event.offsetX} ${event.offsetY} ${event.offsetX} ${event.offsetY} ${event.offsetX} ${event.offsetY}`);
      }
      // const actionIndex = selectedPathDs.length - 1
      // selectedPathDs[actionIndex] = ['C', event.offsetX, event.offsetY, event.offsetX, event.offsetY, event.offsetX, event.offsetY];
      // selectedElement.setAttribute('d', selectedPathDs.map((d) => d.join(' ')).join(' '));
    }
  }
})
svg.addEventListener('click', (event) => {
  const targetElement = event.target;
  if (!selectedElement) {
    const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    path.setAttribute('stroke', '#000');
    path.setAttribute('fill', 'none');
    path.setAttribute('d', `M ${event.offsetX} ${event.offsetY} C ${event.offsetX} ${event.offsetY} ${event.offsetX} ${event.offsetY} ${event.offsetX} ${event.offsetY}`);
    selectedElement = path
    svg.appendChild(path);
  } else {
    focusElement(selectedElement)
    selectedElement = null;
  }
})