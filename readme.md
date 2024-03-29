# Mail Clipper

Mail Clipper is a Chrome Extension & Firefox Addon that copies email links (`<a href="mailto:me@stackstudio.dev">me@stackstudio.dev</a>`) to your clipboard instead of opening your email app.

## Download

- [Chrome](https://chromewebstore.google.com/detail/mail-clipper/nbbecejgjjkmaddbhpmkbomjmhihafba?pli=1)
- [Firefox](https://addons.mozilla.org/en-US/firefox/addon/mail-clipper/)

## Running Locally

The `package` script will create a zip file ("packed extension") for chrome by default (`$ ./package`).

### Chrome

Chrome loads "unpacked" (unzipped) extension for development.

To create an unpacked version for Chrome run `./package --unpacked` or `./package -u`.

### Firefox

Firefox requires a "packed" (zipped)

To create a packed bundle for Firefox run `./package --browser firefox` or `./package -b firefox`

## Developing

[Chrome Extension Hello World Tutorial](https://developer.chrome.com/docs/extensions/get-started/tutorial/hello-world)

# Screenshots

## Copy on click

![Clicked Email ](https://stackstudio.dev/assets/images/Mail%20Clipper%202.png)

## Saved email addresses

![Open Popup Screenshot](https://stackstudio.dev/assets/images/Mail%20Clipper%201.png)

# Contributing

Want a feature? Feel free to open a PR or an issue.
