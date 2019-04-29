import { default as units } from './units.js';

export default class Converter {
    constructor() {

    }

    static convert(unit1, amount1, unit2 ) {
        let baseAmount1 = this.solveToBaseUnit(unit1, amount1);
        let baseAmount2 = this.solveToBaseUnit(unit2, 1);

        return baseAmount1/baseAmount2;
    }

    static solveToBaseUnit(unitName, amount) {
        let unit = null;

        for (let unitSystem in units["distance"]) {
            for(let comparedUnit in units["distance"][unitSystem]){
                if(comparedUnit == unitName){
                    unit = units["distance"][unitSystem][comparedUnit];
                    console.log(unit)
                }
            }
        }

        if( unitName != unit["base"] ){
            return this.solveToBaseUnit(unit["base"], amount * unit["quantity"])
        }

        return amount;
    }
}