# Play Store Delivery Plan

## 1. PWA Readiness (DONE)
- ✅ Manifest includes start URL `/`, portrait display, icons (192/512/512 maskable), shortcut, categories.
- ✅ Service worker registered in production, precaches shell + offline fallback.
- ✅ Offline page and caching strategy ready for Lighthouse/TWA requirements.

## 2. Remaining PWA polish
1. Generate adaptive icon foreground/background layers (1024×1024 PNG) for Play listing.
2. Capture screenshots (phone 6.7″) once Bubblewrap build is running.
3. Draft privacy policy that explains GPS usage + third-party APIs (link needed for Play listing).

## 3. Bubblewrap / TWA Workflow
1. Install Bubblewrap CLI:
   ```
   npm install -g @bubblewrap/cli
   ```
2. Bootstrap the project (example values; update as needed):
   ```
   bubblewrap init \
     --manifest https://postcode-36hfme5t7-gerard-grenvilles-projects.vercel.app/manifest.webmanifest \
     --directory twa-postcode \
     --packageId app.postcode.locator \
     --signingKeyPath signing-key.jks \
     --signingKeyPassword <password> \
     --signingKeyAlias postcode \
     --signingKeyAliasPassword <password>
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
Bubblewrap prints the SHA‑256 fingerprint of the signing key in `.well-known/assetlinks.json`. Host the generated file at:
```
public/.well-known/assetlinks.json
```
Example placeholder (replace with Bubblewrap output):
```json
[
  {
    "relation": ["delegate_permission/common.handle_all_urls"],
    "target": {
      "namespace": "android_app",
      "package_name": "app.postcode.locator",
      "sha256_cert_fingerprints": [
        "00:11:22:..."
      ]
    }
  }
]
```
After deploying to Vercel, verify with:
```
https://postcode-.../.well-known/assetlinks.json
```

## 5. Play Console Checklist
| Item | Status | Notes |
| --- | --- | --- |
| Developer account | ☐ | $25 one-time |
| App name & description | ☐ | Use marketing copy from hero |
| Screenshots (2+) | ☐ | Capture on iPhone 15 / Android emulator |
| Feature graphic 1024×500 | ☐ | Derive from hero gradient |
| High-res icon 512×512 | ☐ | Already generated (`public/icons/icon-512.png`) |
| Privacy policy URL | ☐ | Host on site `/privacy` |
| Data safety form | ☐ | Location access, no data collection stored |
| Content rating questionnaire | ☐ | Non-sensitive |

## 6. Deployment Flow
1. Merge `feature/play-store` → `main` after QA.
2. Run production build + deploy to Vercel.
3. Update Bubblewrap project, rebuild bundle, upload to Play Console (internal testing).
4. Once approved, roll out to production and monitor Android Vitals.

> Keep the Bubblewrap project & keystore in a secure private repo or encrypted storage. Never commit signing keys to Git.

