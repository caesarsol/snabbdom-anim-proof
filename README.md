# Proof for Snabbdom Anim Module

This repo explores a declarative way to describe [d3](https://d3js.org/) SVG data visualizations.

The use of a virtual-DOM diffing approach, powered by snabbdom,
lets you avoid imperative and verbose manual DOM mutations, and enables you to
program what should **be** visualized on the screen, and not what should **happen** to get it.

All without losing the ability to do enter/exit/update transitions!
