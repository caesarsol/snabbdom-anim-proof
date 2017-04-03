import { buildRenderer } from './d3-vdom'
import { view } from './view'

const container = document.getElementById('root')
const render = buildRenderer(container, view)

function osc(x) { return (1 + Math.sin(x)) / 2 }

function genData(key) {
  return Array(50).fill(0).map((_,i) => ({ x: i, y: 5 + osc(i/2.5 + key) * osc(i/4 + key) * 1000 }))
}

function rerender() {
  render(genData(Date.now() / 1000), { onClick: rerender })
}

rerender()

if (1)
  window.setInterval(() => {
    rerender()
  }, 1500)
