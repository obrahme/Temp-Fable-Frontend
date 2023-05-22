export const truncateAddress = (address: string) => `${address.slice(0, 3)}....${address.slice(address.length - 5)}`;
