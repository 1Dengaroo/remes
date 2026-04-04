# Google Sensitive Scope Verification Checklist

Checklist for getting `gmail.send` scope approved through Google's sensitive scope verification process. Estimated review time: 3–5 business days after submission.

## Scope

- Scope requested: `https://www.googleapis.com/auth/gmail.send`
- Classification: **Sensitive**
- Purpose: Send outreach emails on behalf of the user
- Additional scope: `email` (OpenID Connect, non-sensitive)

---

## Privacy Policy (`/privacy`)

- [ ] Dedicated "Google user data" section covers all five areas:
  - [ ] **Access**: Names exact scopes (`gmail.send`, `email`), states no read/modify/delete
  - [ ] **Use**: Send-only, no advertising or unrelated purposes
  - [ ] **Storage**: Describes secure storage (Supabase RLS, TLS)
  - [ ] **Sharing**: Explicitly states no third-party sharing of Google data
  - [ ] **Deletion**: Documents disconnect flow and account deletion
- [ ] Google API Services User Data Policy compliance + Limited Use statement included
- [ ] Privacy policy is publicly accessible (no login required)
- [ ] Privacy policy is hosted on the same domain as the app home page
- [ ] Privacy policy is linked from the home page (via footer)

## Terms of Service (`/terms`)

- [ ] Terms page is publicly accessible
- [ ] Linked from the home page (via footer)

## Home Page (`/`)

- [ ] Publicly accessible (no login required)
- [ ] Clearly describes the app's functionality
- [ ] Links to privacy policy
- [ ] Links to terms of service
- [ ] Not a Google Play listing or Facebook page

## Domain Verification

- [ ] Domain verified in [Google Search Console](https://search.google.com/search-console/about)
- [ ] Verified using a Google Account that is an Owner or Editor on the GCP project

## GCP Console — OAuth Consent Screen

- [ ] App name matches branding (Remes)
- [ ] User support email is set
- [ ] Developer contact email is set
- [ ] Home page URI is set (e.g. `https://remes.ai`)
- [ ] Privacy policy URI is set (e.g. `https://remes.ai/privacy`)
- [ ] Terms of service URI is set (e.g. `https://remes.ai/terms`)
- [ ] Authorized domains are listed
- [ ] App logo uploaded (follows [Google branding guidelines](https://developers.google.com/identity/branding-guidelines))

## GCP Console — Scopes

- [ ] `https://www.googleapis.com/auth/gmail.send` declared on the [Data Access page](https://console.developers.google.com/auth/scopes)
- [ ] `email` (OpenID) declared on the Data Access page
- [ ] No unnecessary scopes are declared

## GCP Console — Cleanup

- [ ] Unused or dev OAuth clients deleted from the production project
- [ ] Separate GCP projects for dev/testing and production
- [ ] Production project publishing status set to **In Production** (not Testing)

## Scope Justification

Prepare this for the submission form:

> Remes uses `https://www.googleapis.com/auth/gmail.send` to send personalized outreach emails on behalf of the user. Users connect their Gmail account in app settings, compose or AI-generate email drafts, review them, and send them to business contacts. We do not read, modify, or delete any existing emails. The narrower `gmail.send` scope is the minimum required — there is no send-only scope that is more restrictive.

## Demo Video

- [ ] Recorded and uploaded to YouTube as **Unlisted**
- [ ] Video shows the full flow in English:
  - [ ] User navigates to settings and clicks "Connect Gmail"
  - [ ] Google OAuth consent screen appears with correct app name
  - [ ] Browser address bar with OAuth client ID is visible
  - [ ] User approves the `gmail.send` scope
  - [ ] User composes or reviews an outreach email in Remes
  - [ ] User sends the email via their connected Gmail
  - [ ] (Optional) User disconnects Gmail from settings

## Submission

- [ ] App complies with [Google APIs Terms of Service](https://developers.google.com/terms)
- [ ] App complies with [Google API Services User Data Policy](https://developers.google.com/terms/api-services-user-data-policy)
- [ ] Owner/editor roles on the GCP project are current
- [ ] Submit at [Verification Center](https://console.developers.google.com/auth/verification)
- [ ] Monitor developer contact email for follow-up requests from Google Trust & Safety
