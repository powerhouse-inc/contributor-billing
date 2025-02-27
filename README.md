# Contributor-billing
The Contributor billing package allows contributors of open organisations to get paid in cash and crypto valuta's anonymously for their work. Download the package and install it in your organisation with the Connect app. Or install it in a local copy of the Connect app for development purposes with the command: 'pnpm install @powerhouse/contributor-billing'.

## How to install this package in Connect?

This Contributor-billing package can be installed when running connect by making use of the 'Package Manager' in the connect settings. 
Open the Settings in the bottom left corner of connect by clicking on the settingswheel. Move to the 'Package Manager' section of the settings menu. 
Here you will find a field to add new packages. Add the package by adding inputting it's NPM handle and click confirm: 

NPM handle: @powerhousedao/contributor-billing

## How to install this package in a local version of Connect?
Clone the repository and install the dependencies

```bash
npm install
```

Generate the reducer files based of the document model schema

```bash
npm run generate
```
## Start connect: npm run connect

If you want to explore this package run a local version of connect with the following command:
```
npm run connect
```

You will now find the document models and editors that are part of this package at the bottom of the connect interface an be able to test them in Connect Studio.
