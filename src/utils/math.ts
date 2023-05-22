
import { Decimal, Uint64 } from '@cosmjs/math'

export const toFableBalance = (amount: string) => {
 
    const data = Decimal.fromAtomics(amount, 6);

    return data.toString()
}

export const withCommas = (amount: string) => {
    return parseFloat(amount).toLocaleString('en-US', { maximumFractionDigits: 6 })
}

export const fromFableBalance = (amount: string) => {

    // adjust decimal places on value
    const roundedAmount = Math.round((parseFloat(amount || '0') + Number.EPSILON) * 1000000) / 1000000

    return Decimal.fromUserInput(roundedAmount.toString(), 6).multiply(Uint64.fromString('1000000')).toString()
}