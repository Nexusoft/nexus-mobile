export default function segmentAddress(address) {
  const line1 = [
    address.substring(0, 6),
    address.substring(6, 11),
    address.substring(11, 16),
    address.substring(16, 21),
    address.substring(21, 26),
  ];
  const line2 = [
    ' ' + address.substring(26, 31),
    address.substring(31, 36),
    address.substring(36, 41),
    address.substring(41, 46),
    address.substring(46, 51),
  ];
  return `${line1.join(' ')}\n${line2.join(' ')}`;
}
