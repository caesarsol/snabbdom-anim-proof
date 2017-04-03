import d3 from 'd3'
import { h } from './d3-vdom'

const colorScale = d3.scale.linear().domain([0, 1000]).range(['yellow', 'green'])

const yScale = d3.scale.linear().domain([0, 1000]).range([100, 0])
const yRadiusScale = d3.scale.linear().domain([0, 1000]).range([1, 50])
const yAxis = d3.svg.axis().scale(yScale).orient('left').ticks(5)

function axisVerticalView(scale, { orient = 'left', ticks, tickLength = 5, tickFormatting = x => x }) {
  const [min, max] = scale.range()
  const ticksList = scale.ticks(ticks)
  const tickDir = orient === 'left' ? -1 : +1
  const textAnchor = orient === 'left' ? 'end' : 'begin'
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

export function view(data, { onClick }) {
  return (
    h('div#root', { on: { click: onClick } }, [
      h('svg', { attrs: { width: 1300, height: 300 } }, [

        // Classic d3.axis(), injected in snabbdom
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

        // Barchart sample
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

        // Circles chart sample
        h('g', { style: { transform: `translate(110px, 100px)` } },
          data.map(({ x, y }) =>
            x % 3 > 0 ? null :
            h('circle', {
              key: x,
              attrs: { cx: x * 15, cy: 150, r: 0, fill: 'transparent', opacity: 0.5, stroke: 'none' },
              anim: { r: yRadiusScale(y), fill: colorScale(y) },
              animParams: { duration: 800, ease: 'quad-out' },
            })
          ).filter(Boolean)
        ),
      ])
    ])
  )
}
