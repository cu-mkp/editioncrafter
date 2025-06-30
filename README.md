[![DOI](https://zenodo.org/badge/574677398.svg)](https://zenodo.org/badge/latestdoi/574677398)

# Editioncrafter
EditionCrafter is an easy-to-use tool for scholars, educators, and research institutions to publish digital editions in a low-cost and sustainable manner. It can be included in a React app or a HTML website. Please see the [EditionCrafter User's Guide](https://editioncrafter.org/guide/) for installation instructions and documentation. 

## EditionCrafter in a React App

If you are including EditionCrafter in a React app, add this module to your project:

```
npm add @cu-mkp/editioncrafter
```

The reference section below details all of the props of the EditionCrafter component. Here is an example of use:

```jsx
import EditionCrafter from '@cu-mkp/editioncrafter'

<EditionCrafter
  documentName='BnF Ms. Fr. 640'
  transcriptionTypes={{
    tc: 'Diplomatic (FR)',
    tcn: 'Normalized (FR)',
    tl: 'Translation (EN)'
  }}
  iiifManifest='https://cu-mkp.github.io/editioncrafter-data/fr640_3r-3v-example/iiif/manifest.json'
  glossaryURL='https://cu-mkp.github.io/editioncrafter-data/fr640_3r-3v-example/glossary.json'
/>
```

## EditionCrafter in an HTML Website

To include EditionCrafter in your HTML website, you need to create a `div` somewhere on your page, assign it an ID and then pass that ID to EditionCrafter. The reference section details the options for EditionCrafter, which are otherwise the same as the React component. Here is an example of use:

```html
 <div id="ec"></div>

 <script type="text/javascript" src="https://www.unpkg.com/@cu-mkp/editioncrafter-umd" ></script>

 <script type="text/javascript">

     EditionCrafter.viewer({
         id: 'ec',
         documentName: 'BnF Ms. Fr. 640',
         iiifManifest: 'https://cu-mkp.github.io/editioncrafter-data/fr640_3r-3v-example/iiif/manifest.json',
         glossaryURL: 'https://cu-mkp.github.io/editioncrafter-data/fr640_3r-3v-example/glossary.json',
         transcriptionTypes: {
           tc: 'Diplomatic (FR)',
           tcn: 'Normalized (FR)',
           tl: 'Translation (EN)'
         }
     });

 </script>
```

## Structure of this repository

There are two apps in this repo. `editioncrafter` is a React component, while `editioncrafter-umd` wraps the React component into a UMD module for use on non-React pages.

## Storybook

For local development, you can use the Storybook component.

Setup for Storybook was kind of rushed and the process could still be made simpler.

1. Clone the [`edition-crafter-cli`](https://github.com/cu-mkp/editioncrafter-cli) repository if you haven't already, do the usual `npm install`, and run `npm start` to launch a server with a test document.
2. Back here in `editioncrafter`, run `npm run storybook` to launch Storybook. You'll see a component called EditionCrafter in the sidebar, and it should be all set to try.

By default, Storybook doesn't display the hash routing params used by `react-router`. You can use the "Open canvas in new tab" button on the top right to open the component in its own tab:

![screenshot of new tab button](newtab.png)

## Releasing a new version

1. Bump the package numbers in `editioncrafter/package.json` and `editioncrafter-umd/package.json`.
2. In the root level of the repo, run `npm run build` to make sure all changes are reflected in the `package-lock.json` files.
3. Commit these changes to `dev`, then merge `dev` into `main`.
4. Create a new GitHub [release](https://github.com/cu-mkp/editioncrafter/releases) pointing to `main` with a version tag matching what you chose in step 1. Make sure to include a list of changes.
5. The GitHub workflow will run automatically to publish the packages. Make sure that [editioncrafter](https://www.npmjs.com/package/@cu-mkp/editioncrafter) and [editioncrafter-umd](https://www.npmjs.com/package/@cu-mkp/editioncrafter-umd) have been successfully published.
