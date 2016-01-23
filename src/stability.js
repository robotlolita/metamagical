//----------------------------------------------------------------------
//
// This source file is part of the Meta:Magical project.
//
// Copyright (C) 2016 Quildreen Motta.
// Licensed under the MIT licence.
//
// See LICENCE for licence information.
// See CONTRIBUTORS for the list of contributors to the project.
//
//----------------------------------------------------------------------


// -- Dependencies -----------------------------------------------------
var Refinable = require('./refinable');


// -- Implementation ---------------------------------------------------
var Explanation = Refinable.refine({
  explain() {
    return `
## Stability: ${this.index} - ${this.name}

${this.description}
    `;
  }
});

var Stability = {
  deprecated: Explanation.refine({
    index: 0,
    name: 'Deprecated',
    description: `
This feature is known to be problematic, and will either be entirely
removed from the system, or completely redesigned. You should not rely
on it.
    `
  }),

  experimental: Explanation.refine({
    index: 1,
    name: 'Experimental',
    description: `
This feature is experimental and likely to change (or be removed) in the
future.
    `
  }),

  stable: Explanation.refine({
    index: 2,
    name: 'Stable',
    description: `
This feature is stable, and its API is unlikely to change (unless deemed
necessary for security or other important reasons). You should expect
backwards compatibility with the system, and a well-defined and automated
(if possible) migration path if it changes.
    `
  }),

  locked: Explanation.refine({
    index: 3,
    name: 'Locked',
    description: `
This API will not change, however security and other bug fixes will still
be applied.
    `
  })
};


// -- Exports ----------------------------------------------------------
module.exports = Stability;
