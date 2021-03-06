import namecoin from 'namecoin';
import { SEND_APP, CONFIRM_APP, VERIFY_APP, isAppType } from './type-configuration.js';
import {validateAddress} from "../../../server/api/doichain";
import {logError} from "./log-configuration";

var sendSettings = Meteor.settings.send;
var sendClient = undefined;
if(isAppType(SEND_APP)) {
  if(!sendSettings || !sendSettings.doichain)
    throw new Meteor.Error("config.send.doichain", "Send app doichain settings not found")
  sendClient = createClient(sendSettings.doichain);
}
export const SEND_CLIENT = sendClient;

var confirmSettings = Meteor.settings.confirm;
var confirmClient = undefined;
var confirmAddress = undefined;
if(isAppType(CONFIRM_APP)) {
  if(!confirmSettings || !confirmSettings.doichain)
    throw new Meteor.Error("config.confirm.doichain", "Confirm app doichain settings not found")
  confirmClient = createClient(confirmSettings.doichain);
  confirmAddress = confirmSettings.doichain.address;
  const validateAddressOutput = validateAddress(confirmClient,confirmAddress)

  if(validateAddressOutput === undefined ||
      !validateAddressOutput ||
      !validateAddressOutput.isvalid ||
      !validateAddressOutput.ismine){

    logError('validateAddressOutput:',validateAddressOutput);
    //throw new Meteor.Error("config.confirm.doichain.address", "Confirm Address is not configured, invalid or not yours.")
  }
}
export const CONFIRM_CLIENT = confirmClient;
export const CONFIRM_ADDRESS = confirmAddress;

var verifySettings = Meteor.settings.verify;
var verifyClient = undefined;
if(isAppType(VERIFY_APP)) {
  if(!verifySettings || !verifySettings.doichain)
    throw new Meteor.Error("config.verify.doichain", "Verify app doichain settings not found")
  verifyClient = createClient(verifySettings.doichain);
}
export const VERIFY_CLIENT = verifyClient;

function createClient(settings) {
  return new namecoin.Client({
    host: settings.host,
    port: settings.port,
    user: settings.username,
    pass: settings.password
  });
}
