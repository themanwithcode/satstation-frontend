import { Network } from "../types/Network";
import { addressFormats, AddressTypes, addressTypeToName } from "./address";



export function getAddressFormat(address: string, network: Network) {
  let format = {
    address,
    format: "unknown",
  };

  const addressTypes = addressFormats[network]
  const addressTypesList = Object.keys(addressTypes)

  for (let i = 0; i < addressTypesList.length; i++) {
    const addressType = addressTypesList[i] as AddressTypes
    const addressTypeReg = addressTypes[addressType]
    const addressName = addressTypeToName[addressType]

    if (addressTypeReg.test(address)) {
        format = {
            address,
            format: addressName
        }
    }
  }

  return format
}
