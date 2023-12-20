const IBAN_REG = /^([A-Z]{2}[ '+'\\'+'-]?[0-9]{2})(?=(?:[ '+'\\'+'-]?[A-Z0-9]){9,30}$)((?:[ '+'\\'+'-]?[A-Z0-9]{3,5}){2,7})([ '+'\\'+'-]?[A-Z0-9]{1,3})?$/

export function isIBAN(iban: string): boolean {
  if (!iban.match(IBAN_REG)) return false
  return true
}
