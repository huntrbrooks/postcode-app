# Play Store Delivery Plan

## 1. PWA Readiness (DONE)
- ✅ Manifest includes start URL `/`, portrait display, icons (192/512/512 maskable), shortcut, categories, and branding for Postcode Revealer.
- ✅ Service worker registered in production, precaches shell + offline fallback.
- ✅ Offline page and caching strategy ready for Lighthouse/TWA requirements.

## 2. Remaining PWA polish
1. ✅ Adaptive icon foreground/background exported to `public/icons/adaptive-foreground.png` and `public/icons/adaptive-background.png`.
2. Capture screenshots (phone 6.7″) once Bubblewrap build is running.
3. ✅ Privacy policy lives at `/privacy.html` and is linked in the footer.

## 3. Bubblewrap / TWA Workflow
See `docs/twa/README.md` for the step-by-step command list and recommended answers (host, package ID, signing key details).

### Required metadata
- **Manifest URL**: `https://postcode-1413q3xkn-gerard-grenvilles-projects.vercel.app/manifest.webmanifest` (swap for final vanity domain when available).
- **Package ID suggestion**: `app.postcode.locator` (reverse-DNS, unique per Play Console).
- **App label**: `Postcode Revealer`.
- **Versioning**: start with `versionName=1.0.0`, `versionCode=1`; increment versionCode on each upload.
- **Signing key**: generate once and store securely. Example:
  ```
  keytool -genkeypair \
    -alias postcode \
    -keyalg RSA \
    -keysize 2048 \
    -validity 9125 \
    -keystore signing-key.jks
  ```
  Record the key password + alias password for Bubblewrap.

1. Install Bubblewrap CLI:
   ```
   npm install -g @bubblewrap/cli
   ```
2. Bootstrap the project (example values; update as needed):
   ```
   npm run twa:init
   ```
3. Review the generated Android project (Android Studio) and update:
   - App name, versionCode, versionName
   - Launcher icons (use the adaptive assets above)
   - `app/src/main/res/xml/shortcuts.xml` (Bubblewrap maps shortcut entries automatically)
4. Build the release bundle:
   ```
   bubblewrap build
   ```
   or within Android Studio → Build → Generate Signed Bundle / APK.

## 4. Asset Links & Origin Verification
- Placeholder file lives at `public/.well-known/assetlinks.json`. Update it after Bubblewrap generates the actual SHA‑256 fingerprint and final package name.
- Bubblewrap prints the fingerprint at the end of `bubblewrap build`. Copy the value into the `sha256_cert_fingerprints` array and redeploy.
- Verify reachability after deploy:
  ```
  https://postcode-.../.well-known/assetlinks.json
  ```
  Android’s Digital Asset Links API should return HTTP 200 with the updated JSON.

## 5. Play Console Checklist
| Item | Status | Notes |
| --- | --- | --- |
| Developer account | ☐ | $25 one-time |
| App name & description | ☐ | Use marketing copy from hero |
| Screenshots (2+) | ✅ | `public/screenshots/iphone15-hero.png` & `iphone15-postcode.png` (capture more as needed) |
| Feature graphic 1024×500 | ✅ | `public/feature-graphic.png` |
| High-res icon 512×512 | ☐ | Already generated (`public/icons/icon-512.png`) |
| Privacy policy URL | ✅ | `/privacy.html` |
| Data safety form | ☐ | Location access, no data collection stored |
| Content rating questionnaire | ☐ | Non-sensitive |

**Asset specs**
- **Phone screenshots**: stored in `public/screenshots/`. Regenerate via `npx playwright@1.48.2 screenshot --device "iPhone 15 Pro Max" <url> <output>`.
- **Feature graphic**: generated via `npm run feature-graphic` (`public/feature-graphic.png`). Re-export if branding changes.
- **Adaptive icon layers**: already generated (`public/icons/adaptive-foreground.png`, `public/icons/adaptive-background.png`); ensure they remain centered within the safe zone when imported into Android Studio.
- **Privacy policy**: create `/privacy` page (Markdown or React route) explaining GPS usage, storage, third-party APIs (OpenStreetMap).
- **Contact info**: supply support email (can reuse repo owner email).

## 6. Deployment Flow
1. Merge `feature/play-store` → `main` after QA.
2. Run production build + deploy to Vercel.
3. Update Bubblewrap project, rebuild bundle, upload to Play Console (internal testing).
4. Once approved, roll out to production and monitor Android Vitals.

> Keep the Bubblewrap project & keystore in a secure private repo or encrypted storage. Never commit signing keys to Git.

