This updated format is meant to grow with the user. 

We are currently limited to vuetify version 3, because of the vue-toolkit

this requires the version of `vue-toolkit` currently on (or up to date with ) the `main` branch. 

To use it, assuming the toolkit is in a directory next to yours, link it like this.
use `yarn link --relative ../vue-toolkit` to work with a local repo and `yarn unlink ../vue-toolkit` to undo it

This is also the reason for the `include: ['@cosmicds/vue-toolkit',]` in `vite.config.mts`

we need the pinia resolution to get the toolkit and the web-engine on the same pinia version. 
the toolkit ask for ~2.1.7, and the engine is on ^2.0.22. Yarn will just install both, which then causes
a type error. This forces yarn to use a common version. 

needed to downgrade font-aweseom vue for local development. yarn `Cannot link into a workspac with a dependency conflict`

updated packages to most recent minor/patch versions with `npx npm-check-updates -u --target minor`

we use local imports, so that we have type-checking in our components

i added prettier so they vs-code can format according to rules and formats we have generally used. 
i do not include a `format` script because it doesn't perfectly align with our lint rules. linting
is the main way we do formatting. but people with prettier setup in their editors will get formatting 
that is inline with how we usually code (mainly split attributes, 2-space tabs)

CI has be unpdated to v22 of node, as that is a LTS  release. 
going to version 25 requires installing corepack manually. 

.editorconfig is an older standard like prettier that helps other editor format and strucutre files

moved HighwayGothic to index.html so it doesn't need to be imported multiple times
compress to woff2 format with `fonttools ttLib.woff2 compress -o HighwayGothicNarrow.woff2 HighwayGothicNarrow.ttf`
and placed into public because things in `assets` need to be manually imported if in any js context. they don't need to be
imported if in a pure html string (still need to be at `./assets/mything.ext`) because we have `transformAssetUrls`.
css strings (`url(...)` in less/css) are a separate thing, vite resolves those on its own, transformAssetUrls is
only for the vue template


we are be default using a custom vue theme, so that it is setup in case we need it. 
i also use it so that we can include custom values, in a way that will allow use to
better create themes, and have more centralized control over colors. i think this 
is fine since vuetify is required. someone who wants to do so much as to strip out vuetify
as a dependency is likely also willing to take on the cost of rewriting their own css
- something to note on themeing is that we often want our buttons to have the accent color
  `<v-btn>` defaults to the `variant=elevated` (which looks like `flat`, except with elevation) `surface` for the background with `on-surface` for the text
  
  
  
# link local packages
[yarn link](https://yarnpkg.com/cli/link)
Link (local dev copies):
```bash
yarn link ../../wwt-webgl-engine/engine ../../wwt-webgl-engine/engine-pinia ../../wwt-webgl-engine/engine-types ../../wwt-webgl-engine/engine-helpers ../../wwt-webgl-engine/astro
yarn link ../vue-toolkit
```

Unlink (back to registry versions):
```bash
yarn unlink ../../wwt-webgl-engine/engine ../../wwt-webgl-engine/engine-pinia ../../wwt-webgl-engine/engine-types ../../wwt-webgl-engine/engine-helpers ../../wwt-webgl-engine/astro
yarn unlink ../vue-toolkit
```

you can do `yarn link -r` if you want relative paths




## Questions and Issues
 - Icon-Button - hidden to the user that the id they assing is not really. we shouldn't define an id by default, just let the user, it's too important
 - 
 
 
 
 <v-icon> needs @click and @keyup.enter
 <v-btn> provides the @keyup with the @click
 
 
 - try icon-button as a button
 
 
- make a docs page with our example
 - showing a WTML
 - show some catalog
 - basic manipulation of ImageSetLayers
 
 
 only some elements are focusable by default, everything else needs to be a tabindex -1 at least
 
 use tabindex -1 for programmatically focusable items, that are not reachable by keyboard
 
so vuetify internally handles applying refocusing dialog activators. 
if you put something in the activator slots, or assign the activator prop to an id, 
that thing will get focus after the dialog closes
but note that using the v-dialog activator does not give keyboard accessibility


# Example 1
 - using the composable to load a wtml with less boiler plate. 
 
 The normal way to load a WMTL file
 ```ts
 
import { type ImageSetLayer } from "@wwtelescope/engine";

const layer = ref<ImageSetLayer | null>(null)

onMounted(() => {
  store.waitForReady().then(async () => {
    
    store.
    
  })
})

 
 ```
 
 
 put a gaurd on local storage