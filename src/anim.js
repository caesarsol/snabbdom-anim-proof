import d3 from 'd3'

const defaultAnimParams = { duration: 500, ease: 'cubic-in-out' }

function animAttrs(oldVnode, vnode) {
  const elm = vnode.elm
  let oldAnimAttrs = oldVnode.data.anim
  let animAttrs = vnode.data.anim

  if (oldAnimAttrs === animAttrs) return
  if (!animAttrs) return

  const params = { ...defaultAnimParams, ...vnode.data.animParams }

  const transition = d3.select(elm)
    .transition()
    .duration(params.duration)
    .ease(params.ease)

  for (let key in animAttrs) {
    const value = animAttrs[key]
    transition.attr(key, value)
  }

  // Only in DEV, checks that no attributes has been removed.
  // This makes it possible to avoid ambiguity and to simplify code.
  if (process.env.NODE_ENV !== 'production') {
    for (let key in oldAnimAttrs) {
      if (!animAttrs.hasOwnProperty(key)) {
        throw new Error(`snabbdom-anim: Don't remove 'anim' attributes between diffs! It's a bad idea.`)
      }
    }
  }
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
    const defaultAttr = attrs[key]
    transition.attr(key, defaultAttr)
  }

  transition.each('end', done)
}

export default { create: animAttrs, update: animAttrs, remove: removeAttrsAnim }
