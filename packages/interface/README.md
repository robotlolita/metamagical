# The Meta:Magical Interface

> **NOTE**  
> This specification is a draft.


The Meta:Magical interface describes how one may attach meta-data to
objects in JavaScript, which can later be queried by other code to
provide more powerful development tools, like interactive documentation
browsing or testing.


## Approach

Objects in JavaScript don't have a field for meta-data, like you have in
Clojure or Siren, but with ECMAScript 2015 Symbols and WeakMaps, it's
possible to circumvent this and attach meta-data to an object in a way
that is safe for non-owned objects, and doesn't cause collisions in
owned objects.


### Meta-data for your own objects

For objects that you own, Meta:Magical relies on the existence of a
property with the global `@@meta:magical` symbol
(`Symbol.for('@@meta:magical')`). Since the symbol is global to the
entire runtime, it doesn't matter where it's created, things will always
be the same. Furthermore, being a symbol means that name collisions with
regular properties are not possible — even if the choice of name already
makes that fairly unlikely.

The value pointed by the symbol is an object that provides the
meta-data. Meta:Magical specifies some fields in this object as having
special meaning, users are free to use any other field as they see
fit.


### Meta-data for thirdy-party objects

For objects that you don't own, Meta:Magical stores the meta-data in a
global WeakMap. This allows Meta:Magical to keep track of meta-data on
objects without mutating those objects, so it can support immutable
(frozen / non-extensible) objects, native objects, and others that you'd
rather not change.

> **WARNING**  
> 
> The global WeakMap relies on there existing only one instance of the
> `metamagical` module in your entire program. This relies on both the `require`
> cache not being cleared, and the resolution algorithm always resolving the
> identifier `metamagical` to the very same file. **It IS brittle**, but so far
> I don't have any other idea of how to solve this problem in JavaScript.
