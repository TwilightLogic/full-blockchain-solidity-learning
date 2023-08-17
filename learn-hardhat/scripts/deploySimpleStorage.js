const hre = require("hardhat")

async function main() {
  const simpleStorage = await hre.ethers.deployContract(
    "contracts/SimpleStorage.sol:SimpleStorage"
  )
  await simpleStorage.waitForDeployment()

  console.log(`Deployed to ${simpleStorage.target}`)
}

main().catch((error) => {
  console.error(error)
  process.exitCode = 1
})
