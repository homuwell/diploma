const Calculations = require( '../lib/circuitCalculation/calculations');
import {
    FunctionType,
    InputCapacitorsType, InputControlledSource, InputIdealTransformersType,
    InputInductorsType,
    InputResistorsType
} from "../generated/apollo/globalTypes";

it('test resistors', () => {

    let resistors: InputResistorsType[] = [
        {mNode: 2, pNode: 1, resistance: 5},
        {mNode: 0, pNode: 2, resistance: 5},
        {mNode: 3, pNode: 2, resistance: 5}
    ]
    let functionArgs = {
        first: 1,
        second: 0,
        third: 0
    }
    const calculations = new Calculations(
        {
            nodes: 3,
            functionArgs,
            functionType: FunctionType.SINGLE,
            resistors
        });
    const results = calculations.calculateElemsComplex().map ((elem:any) => {
        return {
            f: elem.f,
            rom: elem.rom.toFixed(2),
            kum: elem.kum.toFixed(2),
            kua: elem.kua.toFixed(2),
            rim: elem.rim.toFixed(2),
            ria: elem.ria.toFixed(2),
            roa: elem.roa.toFixed(2)
        };
    });
    const expectedResult = [
        {
            kum: (0.50).toFixed(2),
            kua: (-0).toFixed(2),
            rim: (10).toFixed(2),
            ria: (0).toFixed(2),
            rom: (5.00).toFixed(2),
            roa: (0).toFixed(2)
        }
    ]
        expect(results).toEqual(expectedResult);
})

it('another test resistors', () => {
    let resistors: InputResistorsType[] = [
        {mNode: 1, pNode: 3, resistance: 1},
        {mNode: 3, pNode: 2, resistance: 1},
        {mNode: 3, pNode: 0, resistance: 1}
    ]
    let functionArgs = {
        first: 0.5,
        second: 0,
        third: 0
    }
    const calculations = new Calculations(
        {
            nodes: 3,
            functionArgs,
            functionType: FunctionType.SINGLE,
            resistors
        });
    const results = calculations.calculateElemsComplex().map ((elem:any) => {
        return {
            f: elem.f,
            rom: elem.rom.toFixed(2),
            kum: elem.kum.toFixed(2),
            kua: elem.kua.toFixed(2),
            rim: elem.rim.toFixed(2),
            ria: elem.ria.toFixed(2),
            roa: elem.roa.toFixed(2)
        };
    });
    const expectedResult = [
        {
            kum: (0.5).toFixed(2),
            kua: (0).toFixed(2),
            rim: (2).toFixed(2),
            ria: (0).toFixed(2),
            rom: (2).toFixed(2),
            roa: (0).toFixed(2)
        }
    ]
    expect(results).toEqual(expectedResult);

})

it('resistors, capacitors and inductors test', () => {
    let resistors: InputResistorsType[] = [
        {mNode: 1, pNode: 2, resistance: 0.1},
        {mNode: 2, pNode: 3, resistance: 1},
    ]
    let capacitors: InputCapacitorsType[] = [
        {mNode: 2, pNode: 0, capacity: 10}
    ];
    let inductors: InputInductorsType[] = [
        {mNode: 3, pNode: 0, induction: 1}
    ]
    let functionArgs = {
        first: 0.16,
        second: 0,
        third: 0
    }
    const calculations = new Calculations(
        {
            nodes: 3,
            functionArgs,
            functionType: FunctionType.SINGLE,
            resistors,
            inductors,
            capacitors
        });
    let results = calculations.calculateElemsComplex().map ((elem:any) => {
        return {
            f: elem.f,
            rom: elem.rom.toFixed(2),
            kum: elem.kum.toFixed(2),
            kua: elem.kua.toFixed(2),
            rim: elem.rim.toFixed(2),
            ria: elem.ria.toFixed(2),
            roa: elem.roa.toFixed(2)
        };
    });
    let expectedResult = [
        {
            kum: (0.70).toFixed(2),
            kua: (-42.30).toFixed(2),
            rim: (0.15).toFixed(2),
            ria: (-44.72).toFixed(2),
            rom: (0.10).toFixed(2),
            roa: (-87.02).toFixed(2)
        }
    ]


    expect(results).toEqual(expectedResult);
})


it('VCCSs, idealTransformer and VCVSs test', () => {
    let resistors: InputResistorsType[] = [
        {mNode: 0, pNode: 1, resistance: 1},
        {mNode: 0, pNode: 2, resistance: 1},
        {mNode: 3, pNode: 4, resistance: 1},
        {mNode: 4, pNode: 5, resistance: 1},
        {mNode: 0, pNode: 5, resistance: 1}
    ]
    let VCCSs: InputControlledSource[] = [
        {mFirstNode: 0, pFirstNode: 2, mSecondNode:0, pSecondNode: 1, transmission: 10, T1: 0, T2: 1}
    ];
    const VCVSs: InputControlledSource[] = [
         {mFirstNode: 0, pFirstNode: 3, mSecondNode:0, pSecondNode: 2, transmission: 100, T1: 0, T2: 0}
    ]
    let idealTransformers: InputIdealTransformersType[] = [
        {pFirstNode: 4, mFirstNode: 0,pSecondNode: 5, mSecondNode:0, gain: 1}
    ]
    let functionArgs = {
        first: 0.1,
        second: 0.2,
        third: 0.02
    }
    const calculations = new Calculations(
        {
            nodes: 5,
            functionArgs,
            functionType: FunctionType.LINEAR,
            resistors,
            VCCSsAll: VCCSs,
            VCVSsAll: VCVSs,
           // idealTransformers
        });
    let results = calculations.calculateElemsComplex().map ((elem:any) => {
        return {
            f: elem.f,
            rom: elem.rom.toFixed(2),
            kum: elem.kum.toFixed(2),
            kua: elem.kua.toFixed(2),
            rim: elem.rim.toFixed(2),
            ria: elem.ria.toFixed(2),
            roa: elem.roa.toFixed(2)
        };
    });
    let expectedResult = [
        {
            kum: (0.70).toFixed(2),
            kua: (-42.30).toFixed(2),
            rim: (0.15).toFixed(2),
            ria: (-44.72).toFixed(2),
            rom: (0.10).toFixed(2),
            roa: (-87.02).toFixed(2)
        }
    ]


    expect(results).toEqual(expectedResult);
})

