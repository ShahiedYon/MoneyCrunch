# MoneyCrunch

Debt relief referral and education landing page for MoneyCrunch.

## CuraDebt Awin Precheck

The deployed Netlify site is served from `MoneyCrunchDeploy/`.

Before sending traffic, replace the placeholder in both JavaScript copies:

- `MoneyCrunchDeploy/script.js`
- `app.js`

```js
const AWIN_AFFILIATE_URL = "AWIN_CURDEBT_LINK_HERE";
```

The checker logs state, debt type, debt range, qualification result, campaign/source parameters, redirect clicks, and the affiliate URL placeholder to browser `localStorage`. MoneyCrunch does not collect name, email, or phone number in this precheck flow.
