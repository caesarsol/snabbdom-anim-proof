import d3 from 'd3'

const defaultAnimParams = { duration: 500, ease: 'cubic-in-out' }

function animAttrs(oldVnode, vnode) {
  const elm = vnode.elm
  let oldAnimAttrs = oldVnode.data.anim
  let animAttrs = vnode.data.anim
  const params = { ...defaultAnimParams, ...vnode.data.animParams }

  if (!oldAnimAttrs && !animAttrs) return
  if (oldAnimAttrs === animAttrs) return
  oldAnimAttrs = oldAnimAttrs || {}
  animAttrs = animAttrs || {}

  const attrsToUpdate = []

  // update modified attributes, add new attributes
  for (let key in animAttrs) {
    const cur = animAttrs[key]
    const old = oldAnimAttrs[key]
    if (old === cur) continue
    attrsToUpdate.push({ key, value: cur })
  }

  // remove removed attributes
  for (let key in oldAnimAttrs) {
    if (key in animAttrs) continue
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
  if (!animAttrs) return
  const attrs = vnode.data.attrs
  const params = { ...defaultAnimParams, ...vnode.data.animParams }
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
