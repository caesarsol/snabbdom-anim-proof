import d3 from 'd3'

function animAttrs(oldVnode, vnode) {
  const elm = vnode.elm
  let oldAttrs = oldVnode.data.anim
  let attrs = vnode.data.anim
  const params = vnode.data.animParams

  if (!oldAttrs && !attrs) return
  if (oldAttrs === attrs) return
  oldAttrs = oldAttrs || {}
  attrs = attrs || {}

  const attrsToUpdate = []

  // update modified attributes, add new attributes
  for (let key in attrs) {
    const cur = attrs[key]
    const old = oldAttrs[key]
    if (old === cur) continue
    attrsToUpdate.push({ key, value: cur })
  }

  // remove removed attributes
  for (let key in oldAttrs) {
    if (key in attrs) continue
    const zero = 0 // Should check for values other than numbers, such as colors
    attrsToUpdate.push({ key, value: zero, then: () => { elm.removeAttribute(key) } })
  }

  if (attrsToUpdate.length === 0) return

  const transition = d3.select(elm)
    .transition()
    .duration(params.duration)
    .ease(params.ease)

  attrsToUpdate.forEach(({ key, value, then }) => {
    transition.attr(key, value)
    if (then) transition.each('end', then)
  })
}

function removeAttrsAnim(vnode, done) {
  const elm = vnode.elm
  const animAttrs = vnode.data.anim
  const attrs = vnode.data.attrs
  if (!animAttrs) return
  const params = vnode.data.animParams
  const transition = d3.select(elm)
    .transition()
    .duration(params.duration)
    .ease(params.ease)

  for (let key in animAttrs) {
    const attr = animAttrs[key]
    if (!Number.isFinite(attr)) continue
    const zero = attrs[key]
    transition.attr(key, zero)
  }

  transition.each('end', done)
}

export default { create: animAttrs, update: animAttrs, remove: removeAttrsAnim }
