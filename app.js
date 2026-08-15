const AWIN_AFFILIATE_URL = "https://www.awin1.com/cread.php?awinmid=88085&awinaffid=2893463";

const excludedStates = new Set(["CT", "GA", "IL", "KS", "ME", "NH", "NV", "OR", "SC", "VT", "WV"]);
const securedOnlyTypes = new Set(["secured debt", "student loan", "auto loan", "mortgage"]);
const states = [
  ["AL", "Alabama"], ["AK", "Alaska"], ["AZ", "Arizona"], ["AR", "Arkansas"], ["CA", "California"],
  ["CO", "Colorado"], ["CT", "Connecticut"], ["DE", "Delaware"], ["FL", "Florida"], ["GA", "Georgia"],
  ["HI", "Hawaii"], ["ID", "Idaho"], ["IL", "Illinois"], ["IN", "Indiana"], ["IA", "Iowa"],
  ["KS", "Kansas"], ["KY", "Kentucky"], ["LA", "Louisiana"], ["ME", "Maine"], ["MD", "Maryland"],
  ["MA", "Massachusetts"], ["MI", "Michigan"], ["MN", "Minnesota"], ["MS", "Mississippi"], ["MO", "Missouri"],
  ["MT", "Montana"], ["NE", "Nebraska"], ["NV", "Nevada"], ["NH", "New Hampshire"], ["NJ", "New Jersey"],
  ["NM", "New Mexico"], ["NY", "New York"], ["NC", "North Carolina"], ["ND", "North Dakota"], ["OH", "Ohio"],
  ["OK", "Oklahoma"], ["OR", "Oregon"], ["PA", "Pennsylvania"], ["RI", "Rhode Island"], ["SC", "South Carolina"],
  ["SD", "South Dakota"], ["TN", "Tennessee"], ["TX", "Texas"], ["UT", "Utah"], ["VT", "Vermont"],
  ["VA", "Virginia"], ["WA", "Washington"], ["WV", "West Virginia"], ["WI", "Wisconsin"], ["WY", "Wyoming"]
];

const requiredDisclosure =
  "Free consultations are only available in eligible states. This referral flow is generally intended for people with at least $10,000 in unsecured or tax debt. It cannot help with secured debts such as mortgages or auto loans, or with student loans. Applicants must be 21 or older and have a source of income to make program payments. CuraDebt will explain available options and request any required contact consent on its website.";

const stateSelect = document.querySelector("#state");
const form = document.querySelector("#eligibilityForm");
const resultCard = document.querySelector("#resultCard");
const eligibilityDialog = document.querySelector("#eligibilityDialog");
const closeEligibilityDialog = document.querySelector("#closeEligibilityDialog");

document.querySelectorAll("[data-open-checker]").forEach((button) => {
  button.addEventListener("click", () => {
    if (typeof eligibilityDialog.showModal === "function") {
      eligibilityDialog.showModal();
      window.setTimeout(() => document.querySelector("#ageConfirmed").focus(), 0);
    }
  });
});

closeEligibilityDialog.addEventListener("click", () => eligibilityDialog.close());
eligibilityDialog.addEventListener("click", (event) => {
  const bounds = eligibilityDialog.getBoundingClientRect();
  const clickedOutside = event.clientX < bounds.left || event.clientX > bounds.right ||
    event.clientY < bounds.top || event.clientY > bounds.bottom;
  if (clickedOutside) eligibilityDialog.close();
});

states.forEach(([value, label]) => {
  const option = document.createElement("option");
  option.value = value;
  option.textContent = `${label} (${value})`;
  stateSelect.append(option);
});

form.addEventListener("submit", (event) => {
  event.preventDefault();
  const data = readFormData();
  const result = evaluateEligibility(data);
  renderResult(data, result);
});

function readFormData() {
  return {
    ageConfirmed: document.querySelector("#ageConfirmed").checked,
    state: stateSelect.value,
    debtTypes: Array.from(document.querySelectorAll("input[name='debtType']:checked")).map((input) => input.value),
    debtRange: document.querySelector("input[name='debtRange']:checked")?.value ?? "",
    incomeConfirmed: document.querySelector("#incomeConfirmed").checked
  };
}

function evaluateEligibility(data) {
  const reasons = [];
  const hasUnsecured = data.debtTypes.includes("unsecured debt");
  const hasTax = data.debtTypes.includes("tax debt");
  const hasOnlySecured = data.debtTypes.length > 0 && data.debtTypes.every((debtType) => securedOnlyTypes.has(debtType));
  const meetsAmount = data.debtRange === "$10,000-$19,999" || data.debtRange === "$20,000+";
  const priority = hasUnsecured && data.debtRange === "$20,000+";

  if (!data.ageConfirmed) reasons.push("Applicants must confirm they are 21 or older.");
  if (!data.state) reasons.push("Select a U.S. state.");
  if (excludedStates.has(data.state)) reasons.push("Free quote requests are not available in the selected state.");
  if (!data.debtTypes.length) reasons.push("Select at least one debt type.");
  if (hasOnlySecured) reasons.push("This referral flow cannot help with only secured debts, student loans, auto loans, or mortgages.");
  if (!hasUnsecured && !hasTax) reasons.push("This partner flow is intended for unsecured debt or tax debt.");
  if (!meetsAmount) reasons.push("This partner flow is for at least $10,000 in unsecured or tax debt.");
  if (!data.incomeConfirmed) reasons.push("Applicants must have a source of income to make program payments.");

  return {
    qualified: reasons.length === 0,
    priority,
    label: reasons.length === 0 ? (priority ? "qualified-priority" : "qualified") : "disqualified",
    reasons
  };
}

function renderResult(data, result) {
  resultCard.hidden = false;
  resultCard.className = `result-card ${result.qualified ? "qualified" : "disqualified"}`;

  if (!result.qualified) {
    resultCard.innerHTML = `
      <h3>This partner flow may not be available for you.</h3>
      <p>Based on the information selected, MoneyCrunch should not route this visit to the partner quote request.</p>
      <ul>${result.reasons.map((reason) => `<li>${escapeHtml(reason)}</li>`).join("")}</ul>
      <p>You can still review general debt education, but this page will not show the partner redirect button for this screen.</p>
    `;
    resultCard.scrollIntoView({ behavior: "smooth", block: "start" });
    return;
  }

  resultCard.innerHTML = `
    <h3>You meet the basic eligibility screen.</h3>
    <p>${result.priority ? "Your answers indicate $20,000+ in unsecured debt, which is the strongest fit for this referral flow." : "Your answers meet the basic screen for this referral flow."}</p>
    <div class="required-disclosure">${requiredDisclosure}</div>
    <button class="btn btn-submit" type="button" id="partnerRedirectButton">Continue to free consultation</button>
    <p class="small-note">You will continue to CuraDebt's website, where CuraDebt handles the consultation request and any required contact consent. MoneyCrunch may earn compensation if you complete a qualifying action, at no additional cost to you.</p>
  `;

  document.querySelector("#partnerRedirectButton").addEventListener("click", () => {
    window.location.assign(AWIN_AFFILIATE_URL);
  });

  resultCard.scrollIntoView({ behavior: "smooth", block: "start" });
}

function escapeHtml(value) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}
