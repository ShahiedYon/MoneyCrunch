# MoneyCrunch

Debt relief referral and education landing page for MoneyCrunch.

## CuraDebt Awin Precheck

The deployed Netlify site is served from `MoneyCrunchDeploy/`.

The approved CuraDebt Awin tracking link is configured in both JavaScript copies:

- `MoneyCrunchDeploy/script.js`
- `app.js`

```js
const AWIN_AFFILIATE_URL = "https://www.awin1.com/cread.php?awinmid=88085&awinaffid=2893463";
```

MoneyCrunch does not collect names, contact details, or form submissions in this precheck flow. Qualified visitors continue to CuraDebt, where CuraDebt presents its own disclosures and contact-consent terms.
