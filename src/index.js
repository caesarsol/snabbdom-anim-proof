import snabbdom, { h } from 'snabbdom'
import anim from './anim'
import d3 from 'd3'
window.d3 = d3

const patch = snabbdom.init([
  require('snabbdom/modules/class').default, // makes it easy to toggle classes
  require('snabbdom/modules/attributes').default, // for setting attributes on DOM elements (domEl.setAttribute(asd))
  require('snabbdom/modules/props').default, // for setting properties on DOM elements (domEl[prop] = asd)
  require('snabbdom/modules/style').default, // handles styling on elements with support for animations
  require('snabbdom/modules/eventlisteners').default, // attaches event listeners
  anim,
])

const container = document.getElementById('root')

function osc(x) { return (1 + Math.sin(x)) / 2 }

function genData(key) {
  return Array(50).fill(0).map((_,i) => ({ x: i, y: 5 + osc(i/2.5 + key) * osc(i/4 + key) * 100 }))
}

const colorScale = d3.scale.linear().domain([0, 100]).range(['yellow', 'green'])

function view(data) {
  return (
    h('div#container', { on: { click: rerender } }, [
      h('svg', { attrs: { width: 1300, height: 300 } }, [
        h('g',
          data.map(({ x, y }) =>
            y < 10 ? null :
            h('rect', {
              key: x,
              attrs: { x: x * 15, y: 100, width: 10, height: 0, fill: 'tomato', stroke: 'none' },
              anim: { y: 100 - y, height: y, fill: y > 90 ? 'blue' : 'tomato' },
              animParams: { duration: 500, ease: 'cubic-in-out' },
            })
          ).filter(Boolean)
        ),
        h('g',
          data.map(({ x, y }) =>
            x % 3 > 0 ? null :
            h('circle', {
              key: x,
              attrs: { cx: x * 15, cy: 150, r: 0, fill: 'transparent', opacity: 0.5, stroke: 'none' },
              anim: { r: y / 2, fill: colorScale(y) },
              animParams: { duration: 500, ease: 'cubic-in-out' },
            })
          ).filter(Boolean)
        ),
      ])
    ])
  )
}

let vnode = container
function render(data) {
  // Patch into empty DOM element – this modifies the DOM as a side effect
  vnode = patch(vnode, view(data))
}

function rerender() {
  render(genData(Date.now() / 1000))
}

rerender()

if (1)
  window.setInterval(() => {
    rerender()
  }, 1500)
