export async function getPackage(packageId, contract) {
  const sender = await contract.packageSender(packageId);
  const receiver = await contract.packageReceiver(packageId);
  const bounty = await contract.packageBounty(packageId);
  const insurance = await contract.packageInsurance(packageId);
  const deliverBy = await contract.packageDeliverBy(packageId);
  let state = await contract.packageState(packageId);
  const owner = await contract.ownerOf(packageId);

  state = state.toString();
  switch(state) {
    case "0":
      state = "Open"
      break;
    case "1":
      state = "InTransit"
      break;
    case "2":
      state = "Lost"
      break;
    case "3":
      state = "ReturnedToSender"
      break;
    case "4":
      state = "Delivered"
      break;
   }

  return {
    id: parseInt(packageId).toString(),
    sender: sender.toString(),
    receiver: receiver.toString(),
    bounty: bounty.toString(),
    state: state.toString(),
    insurance: insurance.toString(),
    owner: owner.toString(),
    deliverBy: deliverBy.toString()
  }
}

export default getPackage;
