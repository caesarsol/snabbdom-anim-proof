import snabbdom, { h } from 'snabbdom'
import anim from './anim'

export { h }

const patch = snabbdom.init([
  require('snabbdom/modules/class').default, // makes it easy to toggle classes
  require('snabbdom/modules/attributes').default, // for setting attributes on DOM elements (domEl.setAttribute(asd))
  require('snabbdom/modules/props').default, // for setting properties on DOM elements (domEl[prop] = asd)
  require('snabbdom/modules/style').default, // handles styling on elements with support for animations
  require('snabbdom/modules/eventlisteners').default, // attaches event listeners
  anim,
])

export function buildRenderer(container, view) {
  let vnode = container

  return function render(data, viewArgs) {
    // This modifies the DOM
    vnode = patch(vnode, view(data, viewArgs))
  }
}
