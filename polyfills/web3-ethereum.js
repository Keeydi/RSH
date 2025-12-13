// Stub for web3/ethereum module - not needed in React Native
// These functions are only used for Ethereum wallet authentication which we don't use
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAddress = getAddress;
exports.fromHex = fromHex;
exports.toHex = toHex;
exports.createSiweMessage = createSiweMessage;

function getAddress(address) {
  // Minimal stub - should not be called in React Native
  return address ? address.toLowerCase() : '';
}

function fromHex(hex) {
  return parseInt(hex, 16);
}

function toHex(value) {
  const bytes = new TextEncoder().encode(value);
  const hex = Array.from(bytes, (byte) => byte.toString(16).padStart(2, '0')).join('');
  return '0x' + hex;
}

function createSiweMessage(parameters) {
  // Minimal stub - should not be called in React Native
  return '';
}

