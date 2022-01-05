const generateButton = document.getElementById('generate'),
  copyTfCodeButton = document.getElementById('copyTfCodeButton'),
  policyUrlInput = document.getElementById('policyUrl'),
  tfCodeTextarea = document.getElementById('tfCode');

function fetchJson(url) {
  return fetch(url)
    .then(res => res.json())
    .then(out => out)
    .catch(err => console.error(err));
}

function generateTfCode(policyJson, policyUrl) {
  let codeTemplate = `
# Azure Policy - __POLICY_NAME__
# __POLICY_URL__
resource "azurerm_policy_definition" "__POLICY_SHORTNAME__" {
  name         = "AZPOLDEF-__POLICY_SHORTNAME__"
  display_name = "AZPOLDEF-__POLICY_SHORTNAME__"
  policy_type  = "Custom"
  mode         = "__POLICY_MODE__"
  description  = "__POLICY_DESC__"

  management_group_name = data.azurerm_management_group.root_management_group.name

  metadata = <<METADATA
{
  "version":  "__POLICY_VERSION__",
  "category": "__POLICY_CATEGORY__"
}
METADATA

  policy_rule = <<POLICY_RULE
__POLICY_RULE__
POLICY_RULE

  parameters = <<PARAMETERS
__POLICY_PARAMETERS__
PARAMETERS
}  
  `;

  const fileName = policyUrl.substring(policyUrl.lastIndexOf('/') + 1).split('.').slice(0, -1).join('.');

  codeTemplate = codeTemplate.replace('__POLICY_NAME__', policyJson.properties.displayName);
  codeTemplate = codeTemplate.replace('__POLICY_SHORTNAME__', fileName);
  codeTemplate = codeTemplate.replace('__POLICY_SHORTNAME__', fileName);
  codeTemplate = codeTemplate.replace('__POLICY_SHORTNAME__', fileName);
  codeTemplate = codeTemplate.replace('__POLICY_URL__', policyUrl);
  codeTemplate = codeTemplate.replace('__POLICY_DESC__', policyJson.properties.description);
  codeTemplate = codeTemplate.replace('__POLICY_MODE__', policyJson.properties.mode);
  codeTemplate = codeTemplate.replace('__POLICY_VERSION__', policyJson.properties.metadata.version);
  codeTemplate = codeTemplate.replace('__POLICY_CATEGORY__', policyJson.properties.metadata.category);
  codeTemplate = codeTemplate.replace('__POLICY_RULE__', JSON.stringify(policyJson.properties.policyRule, null, '\t'));
  codeTemplate = codeTemplate.replace('__POLICY_PARAMETERS__', JSON.stringify(policyJson.properties.parameters, null, '\t'));

  tfCodeTextarea.value = codeTemplate;
}

generateButton.addEventListener('click', async function (event) {
  const policyUrl = policyUrlInput.value,
    policyJson = await fetchJson(policyUrl);

  generateTfCode(policyJson, policyUrl);
});

copyTfCodeButton.addEventListener('click', function (event) {
  tfCodeTextarea.select();
  document.execCommand('copy');
});


