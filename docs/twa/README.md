# Trusted Web Activity Setup

These steps describe exactly how to run Bubblewrap locally and generate the Android project (`twa-postcode/`) that will be uploaded to Google Play.

## Prerequisites
- `npm install` (already installs `@bubblewrap/cli` locally).
- Java JDK 17 is required. Bubblewrap offers to download it the first time you run any command—choose **Yes** unless you already have a local JDK.
- Enough disk space for Android SDK tools (~1.5 GB) once you run `bubblewrap build`.

## Initialize the project
Run the script (interactive):
```bash
npm run twa:init
```
Bubblewrap will fetch the production manifest (`https://postcode-1413q3xkn-gerard-grenvilles-projects.vercel.app/manifest.webmanifest`) and prompt for confirmations. Recommended answers:

| Prompt | Value |
| --- | --- |
| Host | `https://postcode-1413q3xkn-gerard-grenvilles-projects.vercel.app` (swap for custom domain later) |
| Start URL | `/` |
| App Name | `Postcode Revealer` |
| Launcher Name | `Revealer` |
| Package ID | `app.postcode.locator` |
| Version Code | `1` (increment for every release) |
| Display | `standalone` |
| Orientation | `portrait` |
| Theme Color | `#05060b` |
| Background Color | `#05060b` |
| Icon URL | `https://postcode-1413q3xkn-gerard-grenvilles-projects.vercel.app/icons/icon-512.png` |
| Maskable Icon URL | `https://postcode-1413q3xkn-gerard-grenvilles-projects.vercel.app/icons/icon-512-maskable.png` |
| Shortcuts | Keep existing |
| Monochrome Icon URL | *(leave blank for now)* |
| Play Billing / Location Delegation | `No` |
| Signing key path | `twa-postcode/android-keystore.jks` |
| Signing key alias | `postcode` |

When asked to create the signing key, enter:
- Full name / org info (anything descriptive, e.g., "Postcode Revealer").
- Country code: `AU` (or your actual country).
- Choose strong keystore + key passwords and record them securely. They will be needed for every `bubblewrap build` and for Google Play’s Play App Signing enrollment.

> The generated Android project lives in `twa-postcode/`. Keep it **out of Git** (add to `.git/info/exclude` or store it in a private repo if needed) because it contains your signing material.

## Build / regenerate
- After editing `twa-manifest.json`, rebuild the project:
  ```bash
  npm run twa:build
  ```
  Set the passwords beforehand:
  ```bash
  export BUBBLEWRAP_KEYSTORE_PASSWORD="<keystore>"
  export BUBBLEWRAP_KEY_PASSWORD="<alias>"
  ```
  The output bundle will be in `twa-postcode/app-release-bundle.aab`.

- If you rerun `npm run twa:init`, Bubblewrap will overwrite the Android project. To keep local Android Studio edits, modify `twa-postcode/twa-manifest.json` and call `bubblewrap update` instead of a fresh init.

## Asset Links
After Bubblewrap finishes, run:
```bash
bubblewrap fingerprint list --manifest twa-postcode
bubblewrap fingerprint generateAssetLinks --manifest twa-postcode --output assetlinks.json
```
Use the fingerprint output to replace the placeholder in `public/.well-known/assetlinks.json`, then redeploy to Vercel.

## Play Console upload
1. Run `npm run twa:build` to create the `.aab`.
2. Upload the bundle to the Internal Testing track.
3. Submit the privacy/data safety forms (policy URL: `https://postcode-1413q3xkn-gerard-grenvilles-projects.vercel.app/privacy.html`).
4. Once approved, promote to Closed/Open/Production.

