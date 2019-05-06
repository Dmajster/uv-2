const electron = require('electron')
const {ipcRenderer} = electron;

class Converter {
    constructor() {

    }

    static convert(type, unit1, amount1, unit2 ) {
        let baseAmount1 = this.solveToBaseUnit(type, unit1, amount1);
        let baseAmount2 = this.solveToBaseUnit(type, unit2, 1);

        return baseAmount1/baseAmount2;
    }

    static solveToBaseUnit(type, unitName, amount) {

        let unit = null;

        for (let unitSystem in units[type]) {
            for(let comparedUnit in units[type][unitSystem]){
                if(comparedUnit == unitName){
                    unit = units[type][unitSystem][comparedUnit];
                }
            }
        }

        if( unitName != unit["base"] ){
            return this.solveToBaseUnit(type, unit["base"], amount * unit["quantity"])
        }

        return amount;
    }

    static getUnit(type, unitName){
        for (let unitSystem in units[type]) {
            for(let comparedUnit in units[type][unitSystem]){
                if(comparedUnit == unitName){
                   return units[type][unitSystem][comparedUnit];
                }
            }
        }
    }
}