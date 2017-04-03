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
  return Array(50).fill(0).map((_,i) => ({ x: i, y: 5 + osc(i/2.5 + key) * osc(i/4 + key) * 1000 }))
}

const colorScale = d3.scale.linear().domain([0, 1000]).range(['yellow', 'green'])

const yScale = d3.scale.linear().domain([0, 1000]).range([100, 0])
const yAxis = d3.svg.axis().scale(yScale).orient('left').ticks(5)

function axisVerticalView(scale, { ticks, tickLength = 5, tickFormatting = x => x }) {
  const [min, max] = scale.range()
  const ticksList = scale.ticks(ticks)
  const orient = 'l'
  const tickDir = orient === 'l' ? -1 : +1
  const textAnchor = orient === 'l' ? 'end' : 'begin'
  const textStyle = { fill: 'black', stroke: 'none', textAnchor, alignmentBaseline: 'middle', fontFamily: 'sans-serif' }
  return (
    h('g', { style: { transform: `translate(105px, 100px)`, stroke: 'black' } }, [
      h('line', { attrs: { y1: min, y2: max } }),
      ...ticksList.map(t => h('g', [
        h('line', { attrs: { x1: 0, y1: scale(t), x2: tickDir * tickLength, y2: scale(t) } }),
        h('text',
          { attrs: { x: 2 * tickDir * tickLength, y: scale(t) }, style: textStyle },
          `${tickFormatting(t)}`
        ),
      ])),
    ])
  )
}

function view(data) {
  return (
    h('div#container', { on: { click: rerender } }, [
      h('svg', { attrs: { width: 1300, height: 300 } }, [
        // Classic d3.axis()
        h('g', {
            hook: { insert(vnode) {
              const axis = d3.select(vnode.elm).call(yAxis)
              axis.selectAll('.tick line, .domain').style({
                fill: 'none',
                stroke: 'black',
              })
              axis.selectAll('.tick text').style({
                'font-family': 'sans-serif',
              })
            } },
            style: { transform: `translate(50px, 100px)` },
        }),
        // Experimental snabbdom-d3 axis
        axisVerticalView(yScale, { ticks: 5 }),

        h('g', { style: { transform: `translate(110px, 100px)` } },
          data.map(({ x, y }) =>
            y < 100 ? null :
            h('rect', {
              key: x,
              attrs: { x: x * 15, y: yScale(0), width: 10, height: 0, fill: 'tomato', stroke: 'none' },
              anim: { y: yScale(y), height: yScale(0) - yScale(y), fill: y > 900 ? 'blue' : 'tomato' },
            })
          ).filter(Boolean)
        ),
        h('g', { style: { transform: `translate(110px, 100px)` } },
          data.map(({ x, y }) =>
            x % 3 > 0 ? null :
            h('circle', {
              key: x,
              attrs: { cx: x * 15, cy: 150, r: 0, fill: 'transparent', opacity: 0.5, stroke: 'none' },
              anim: { r: yScale(y) / 2, fill: colorScale(y) },
              animParams: { duration: 800, ease: 'quad-out' },
            })
          ).filter(Boolean)
        ),
      ])
    ])
  )
}

let vnode = container
function render(data) {
  // This modifies the DOM
  vnode = patch(vnode, view(data))
}

function rerender() {
  render(genData(Date.now() / 1000))
}

rerender()

if (0)
  window.setInterval(() => {
    rerender()
  }, 1500)
