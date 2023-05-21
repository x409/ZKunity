const { zencode_exec } = require("zenroom");

// Zk scenario
export const zkproofScenarios = [
  {
    attributes: ["password", "attribute1"],
    proveContract: `Scenario 'zkproof1': Prove knowledge of a secret password and attribute1
      Given that I have a 'string' named 'password'
      and that I have a 'string' named 'attribute1'
      When I prove knowledge of the 'password'
      and I prove knowledge of the 'attribute1'
      Then create 'zkproof'`,
    verifyContract: `Scenario 'zkproof1': Verify the zkproof
      Given that I have a valid 'zkproof'
      and that I have a 'string' named 'password'
      and that I have a 'string' named 'attribute1'
      When I verify the 'zkproof'
      and I verify the 'password'
      and I verify the 'attribute1'
      Then print 'verification'`
  },
  {
    attributes: ["attribute2", "attribute3"],
    proveContract: `Scenario 'zkproof2': Prove knowledge of attribute2 and attribute3
      Given that I have a 'string' named 'attribute2'
      and that I have a 'string' named 'attribute3'
      When I prove knowledge of the 'attribute2'
      and I prove knowledge of the 'attribute3'
      Then create 'zkproof'`,
    verifyContract: `Scenario 'zkproof2': Verify the zkproof
      Given that I have a valid 'zkproof'
      and that I have a 'string' named 'attribute2'
      and that I have a 'string' named 'attribute3'
      When I verify the 'zkproof'
      and I verify the 'attribute2'
      and I verify the 'attribute3'
      Then print 'verification'`
  },
  // Add more zkproof scenarios as needed
];

const generateZKProof = async (scenarioIndex, attributes) => {
  const keys = JSON.stringify(attributes);
  const data = '';
  const proveContract = zkproofScenarios[scenarioIndex].proveContract;
  const { result } = await zencode_exec(proveContract, { data, keys });
  return result;
};

const verifyZKProof = async (scenarioIndex, proof, attributes) => {
  const keys = JSON.stringify(attributes);
  const data = '';
  const verifyContract = zkproofScenarios[scenarioIndex].verifyContract;
  const { result } = await zencode_exec(verifyContract, { data, keys, proof });
  const verification = JSON.parse(result).verification;
  return verification;
};

(async () => {
  const scenarioIndex = 0; // Select the desired zkproof scenario
  const attributes = zkproofScenarios[scenarioIndex].attributes;

  // Generate the zkproof
  const proof = await generateZKProof(scenarioIndex, attributes);
  console.log("ZKProof:", proof);

  // Verify the zkproof
  const verification = await verifyZKProof(scenarioIndex, proof, attributes);
  console.log("Verification:", verification);
})();