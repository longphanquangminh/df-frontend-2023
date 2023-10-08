export default function removeExtraSpaces(inputString: string) {
  return inputString.replace(/\s+/g, ' ').trim();
}
