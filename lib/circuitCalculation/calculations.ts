import {complex} from 'ts-complex-numbers'
import {
    FunctionType, InputBipolarTransistors,
    InputCapacitorsType,
    InputControlledSource, InputIdealOperationAmplifiersType,
    InputIdealTransformersType,
    InputInductorsType,
    InputOperationAmplifiersType,
    InputResistorsType, InputTransformers, InputUnipolarTransistors,
} from "../../generated/apollo/globalTypes";
import {bipolarTransistor} from "nexus-prisma";

const MAX_NODES = 100;
const MAX_BIPOLAR = 50;
const MAX_MULTIPOLE = 20;


enum BipolarType {
    Resistor = 'R',
    Capacitor = 'C',
    Inductor = 'I'
}
type ControlledSource = {
    mFirstNode: number;
    mSecondNode: number;
    pFirstNode: number;
    pSecondNode: number;
    transmission: number;
}

type TransferFunction = {
    f: number
    kum: number
    kua: number
    rim: number
    ria: number
    rom: number
    roa: number
}


type VCCS = {
    mFirstNode: number;
    mSecondNode: number;
    pFirstNode: number;
    pSecondNode: number;
    transmission: number;
}


type VCVS = {
    mFirstNode: number;
    mSecondNode: number;
    pFirstNode: number;
    pSecondNode: number;
    transmission: number;
}


enum CalculationsType {
    ComplexMatrices = 'ComplexMatrices',
    PartialMatrices = 'PartialMatrices'
}

type Node = {
    positive: number
    negative: number
}

type FunctionArgs = {
    first: number
    second: number
    third: number
}

type SchemaModel = {
    nodes: number
    functionArgs: FunctionArgs
    type?: CalculationsType
    sourceIn?: Node
    sourceOut?: Node
    functionType: FunctionType
    capacitors?: Array<InputCapacitorsType>
    inductors?: Array<InputInductorsType>
    resistors?: Array<InputResistorsType>
    VCCSsAll?: Array<InputControlledSource>
    VCVSsAll?: Array<InputControlledSource>
    CCCSsAll?: Array<InputControlledSource>
    CCVSsAll?: Array<InputControlledSource>
    transformers?: Array<InputTransformers>
    idealTransformers?: Array<InputIdealTransformersType>
    operationAmplifiers?: Array<InputOperationAmplifiersType>
    idealOperationAmplifiers?: Array<InputIdealOperationAmplifiersType>
    bipolarTransistors?: Array<InputBipolarTransistors>,
    unipolarTransistors?: Array<InputUnipolarTransistors>
}


class Calculations {
    public nodes: number
    public type: CalculationsType = CalculationsType.ComplexMatrices
    public functionArgs: FunctionArgs
    public functionType: FunctionType
    public capacitors: Array<InputCapacitorsType> | null = null
    public inductors: Array<InputInductorsType> | null = null
    public resistors: Array<InputResistorsType> | null = null
    public VCCSsAll: Array<InputControlledSource> | null = null
    public VCVSsAll: Array<InputControlledSource> | null = null
    public CCCSsAll: Array<InputControlledSource> | null = null
    public CCVSsAll: Array<InputControlledSource> | null = null
    private transformers: Array<InputTransformers> | null = null
    public idealTransformers: Array<InputIdealTransformersType> | null = null
    public operationAmplifiers: Array<InputOperationAmplifiersType> | null = null
    private idealOperationAmplifiers: Array<InputIdealOperationAmplifiersType> | null = null
    private unipolarTransistors: Array<InputUnipolarTransistors> | null = null
    private bipolarTransistors: Array<InputBipolarTransistors> | null = null
    public sourceIn: Node = {positive: 1, negative: 0}
    public sourceOut: Node = {positive: 2, negative: 0}
    public VCCSsFreqDependent: Array<InputControlledSource> | null = null
    public VCCSs: Array<ControlledSource> | null = null
    public VCVSsFreqDependent: Array<InputControlledSource> | null = null
    public VCVSs: Array<ControlledSource> | null = null
    public CCCSsFreqDependent: Array<InputControlledSource> | null = null
    public CCCSs: Array<ControlledSource> | null = null
    public CCVSsFreqDependent: Array<InputControlledSource> | null = null
    public CCVSs: Array<ControlledSource> | null = null
    public w: complex[][] = []
    public functionValues: Array<number> = []
    public sourceType: Boolean

    public results: Array<TransferFunction> = [];
    constructor (
        dataModel: SchemaModel,
     ) {
        console.log('datamodel is:');
        console.log(dataModel);
        this.nodes = dataModel.nodes;
        console.log('nodes before');
        console.log(this.nodes);
        this.functionArgs = dataModel.functionArgs;
        this.functionType = dataModel.functionType;
        if (dataModel.type !== undefined) this.type = dataModel.type;
        if (dataModel.sourceIn !== undefined) this.sourceIn = dataModel.sourceIn;
        if (dataModel.sourceOut !== undefined) this.sourceOut = dataModel.sourceOut;
        if (dataModel.transformers !== undefined) this.transformers = dataModel.transformers;
        if (dataModel.idealTransformers !== undefined) this.idealTransformers = dataModel.idealTransformers;
        if (dataModel.operationAmplifiers !== undefined) this.operationAmplifiers = dataModel.operationAmplifiers;
        if (dataModel.idealOperationAmplifiers !== undefined) this.idealOperationAmplifiers = dataModel.idealOperationAmplifiers;
        if (dataModel.resistors !== undefined) this.resistors = dataModel.resistors;
        if (dataModel.capacitors !== undefined) this.capacitors = dataModel.capacitors;
        if (dataModel.inductors !== undefined) this.inductors = dataModel.inductors;
        if (dataModel.VCCSsAll !== undefined) this.inputControlledSource(dataModel.VCCSsAll, this.VCCSs, this.VCCSsFreqDependent) ;
        if (dataModel.VCVSsAll !== undefined) this.inputControlledSource(dataModel.VCVSsAll, this.VCVSs, this.VCVSsFreqDependent);
        if (dataModel.CCCSsAll !== undefined) this.inputControlledSource(dataModel.CCCSsAll, this.CCCSs, this.CCCSsFreqDependent);
        if (dataModel.CCVSsAll !== undefined) this.inputControlledSource(dataModel.CCVSsAll, this.CCVSs, this.CCVSsFreqDependent);
        if (dataModel.unipolarTransistors !== undefined) this.unipolarTransistors = dataModel.unipolarTransistors;
        if (dataModel.bipolarTransistors !== undefined) this.bipolarTransistors = dataModel.bipolarTransistors;
        if (dataModel.functionType !== undefined)  this.functionType = dataModel.functionType;
        this.addDummyElems();
        //TODO fix w size
        for (let i = 0; i < MAX_NODES + 1; i++) {
            this.w[i] = [];
            for (let j = 0; j < MAX_NODES + 1; j++) {
                this.w[i][j] = new complex(0, 0);
            }
        }
        switch (this.functionType) {
            case 'SINGLE':
                this.functionValues.push(this.functionArgs.first); // добавление одной точки
                break;
            case 'LINEAR':
                for (let i = this.functionArgs.first; i < this.functionArgs.second; i = i + this.functionArgs.third) { //линейный закон
                    this.functionValues.push(i);
                }
                break;
            case 'LOGARITHMIC':
                for (let i = this.functionArgs.first; i < this.functionArgs.second; i = i * this.functionArgs.third) { // логарифмический закон
                    this.functionValues.push(i);
                }
                break;
        }
        this.sourceType = (this.sourceIn.positive === 1 && this.sourceIn.negative === 0) && (this.sourceOut.positive === 2 && this.sourceOut.negative === 0);
    }
    private gaussThreePole () {
        let c = new complex(0, 0);
        let t = new complex(0, 0);
        let cn = new complex(0, 0);
        let mult: complex
        let l;

        for (let k = this.nodes; k >= 3; k--) {
            l = k;
            /*
            g = 0.001;
            while((this.w[l][k]).mag() <= g) {
                l = l - 1;
                if (l ===2) {
                    l = k;
                    g = 0.1 * g;
                }
            }
                  console.log(`w[i][k] = ${this.w[i][k]}, w[k][k] = ${this.w[k][k]}`);
                console.log(`i = ${i} k = ${k} n = ${this.nodes}`);
            console.log(`this.w[k][j] = ${this.w[k][j]} c = ${c} w[i][j] = ${this.w[i][j]}`);
             console.log(`after w[i][j] = ${this.w[i][j]}`);
                  console.log(`c = ${c}`);
             */
            if (l != k)
                for(let j = k; j <= this.nodes; j++) {
                    t = this.w[k][j];
                    this.w[k][j] = this.w[l][j];
                    this.w[l][j] = t;
                }
            for(let i = k - 1; i >= 1; i--) {
                if (this.w[i][k] == cn) continue;
                c = this.w[i][k].div(this.w[k][k]);
                for(let j = 1; j <= k - 1; j++)
                    if(this.w[k][j] != cn) this.w[i][j] = this.w[i][j].sub(  this.w[k][j].mult(c) )
            }
        }
    }
    private inputControlledSource(input: InputControlledSource[], elems: ControlledSource[] | null, freqDependent: InputControlledSource[] | null) {
        for(let i = 0; i < input.length; i++) {
            if(input[i].T1 === 0 && input[i].T2 === 0) {
                if (elems === null) elems = [];
                elems!.push({
                    pFirstNode: input[i].pFirstNode,
                    mFirstNode: input[i].mFirstNode,
                    pSecondNode: input[i].pSecondNode,
                    mSecondNode: input[i].mSecondNode,
                    transmission: input[i].transmission
                })
            } else {
                if (freqDependent === null) freqDependent = [];
                freqDependent.push(input[i]);
            }
        }
    }

    private addDummyElems() {
        if (this.capacitors !==null) this.capacitors.unshift({pNode: 0, mNode: 0, capacity: 0});
        if (this.resistors !== null)  this.resistors.unshift({pNode: 0, mNode: 0, resistance: 0});
        if (this.inductors !== null) this.inductors.unshift({pNode: 0, mNode: 0, induction: 0});
        if (this.VCCSs !== null) this.VCCSs.unshift({pFirstNode: 0, mFirstNode: 0, pSecondNode: 0, mSecondNode: 0, transmission: 0});
        if (this.VCCSsFreqDependent !== null)  this.VCCSsFreqDependent.unshift({pFirstNode: 0, mFirstNode: 0, pSecondNode: 0, mSecondNode: 0, transmission: 0, T1: 0, T2: 0});
        if (this.CCCSs !== null)  this.CCCSs.unshift({pFirstNode: 0, mFirstNode: 0, pSecondNode: 0, mSecondNode: 0, transmission: 0});
        if (this.CCCSsFreqDependent !== null) this.CCCSsFreqDependent.unshift({pFirstNode: 0, mFirstNode: 0, pSecondNode: 0, mSecondNode: 0, transmission: 0, T1: 0, T2: 0});
        if (this.CCVSs !== null)  this.CCVSs.unshift({pFirstNode: 0, mFirstNode: 0, pSecondNode: 0, mSecondNode: 0, transmission: 0});
        if (this.CCVSsFreqDependent !== null) this.CCVSsFreqDependent.unshift({pFirstNode: 0, mFirstNode: 0, pSecondNode: 0, mSecondNode: 0, transmission: 0, T1: 0, T2: 0});
        if (this.VCVSs !== null)  this.VCVSs.unshift({pFirstNode: 0, mFirstNode: 0, pSecondNode: 0, mSecondNode: 0, transmission: 0});
        if (this.VCVSsFreqDependent) this.VCVSsFreqDependent.unshift({pFirstNode: 0, mFirstNode: 0, pSecondNode: 0, mSecondNode: 0, transmission: 0, T1: 0, T2: 0});
        if (this.transformers !== null) this.transformers.unshift({mFirstNode: 0, pFirstNode: 0, mSecondNode: 0, pSecondNode: 0, R1: 0, R2: 0, L1: 0, L2: 0 , M: 0});
        if (this.idealTransformers !== null) this.idealTransformers.unshift({pFirstNode: 0, mFirstNode: 0, pSecondNode: 0, mSecondNode: 0, gain: 0});
        if (this.operationAmplifiers !== null) this.operationAmplifiers.unshift({pFirstNode: 0, mFirstNode: 0, pSecondNode: 0, mSecondNode: 0, rOut: 0, rIn: 0, u: 0, fT: 0});
        if (this.idealOperationAmplifiers !== null) this.idealOperationAmplifiers.unshift({pFirstNode: 0, mFirstNode: 0, pSecondNode: 0, mSecondNode: 0});
        if (this.unipolarTransistors !== null) this.unipolarTransistors.unshift({Csi: 0, Czi: 0, Czs: 0, Rc: 0, S:0, ni: 0, ns: 0, nz: 0});
        if (this.bipolarTransistors !== null) this.bipolarTransistors.unshift({Cc: 0, Ce: 0, Rb: 0, Rc: 0, Re: 0, b: 0, nb: 0, nc: 0, ne: 0});
    }



    private transferFuncThreePole (f: number) {
        let ku: complex;
        let ri: complex;
        let ro: complex;
        let d: complex;
        //TODO FOUND TYPE
        //console.log(`w = ${this.w[1][1]} ${this.w[1][2]} ${this.w[2][1]} ${this.w[2][2]}` );
        ku = (this.w[2][1].neg()).div(this.w[2][2]);
        (this.w[1][1].mult(this.w[2][2])).sub(this.w[2][1].mult(this.w[1][2]));
        d =  (this.w[1][1].mult(this.w[2][2])).sub((this.w[2][1].mult(this.w[1][2])));
        ri = this.w[2][2].div(d);
        ro = this.w[1][1].div(d);

        this.results.push({
            f,
            kum: ku.mag(),
            kua: ku.arg() * 180 / Math.PI,
            rim: ri.mag(),
            ria:  ri.arg() * 180 / Math.PI,
            rom: ro.mag(),
            roa:  ro.arg() * 180 / Math.PI,
        })

    }
    private gaussGeneral () {
        let l = 0, i = 0, j = 0, k = 0;
        let c = new complex(0,0);
        let d = new complex(0,0);
        let t = new complex(0,0);
        let cn = new complex(0,0);
        let mult = new complex(0,0);
        let minus = new complex(0,0);
        for( k = 1; k < this.nodes; k++ ) {
            l = k;
            for(i = k + 1; i <= this.nodes; i++)
                if (this.w[i][k].mag() > this.w[l][k].mag())
                    l = i;
            if (l != k)
                for (j = 0; j <= this.nodes; j++)
                    if (j === 0 || j >= k) {
                        t = this.w[k][j];
                        this.w[k][j] = this.w[l][j];
                        this.w[l][j] = t;
                    }
            d = new complex(1,0).div(this.w[k][k]);
            for(i = k + 1; i <= this.nodes; i++) {
                if(this.w[i][k] === cn)
                    continue;
                c = this.w[i][k].mult(d);
                for(j = k + 1; j <= this.nodes; j++)
                    if(this.w[k][j] != cn) {
                        mult = c.mult(this.w[k][j]);
                        this.w[i][j] = this.w[i][j].sub(mult);
                    }
                if(this.w[k][0] != cn) {
                    mult = c.mult(this.w[k][0]);
                    this.w[i][0] = this.w[i][0].sub(mult);
                }
            }
        }
        console.log('w =');
        let str = '';
        console.log('nodes: ');
        console.log(this.nodes);
        for (let rows = 0; rows <= this.nodes; rows++) {
            for (let columns = 0; columns <= this.nodes; columns++) {
                str += `${this.w[rows][columns]} `
            }
            console.log(str);
            str = '';
        }
        minus = this.w[this.nodes][0].neg();
        this.w[0][this.nodes] = minus.div(this.w[this.nodes][this.nodes]);
        for(i = this.nodes - 1; i >= 1; i--) {
            t = this.w[i][0];
            for(j = i + 1; j <= this.nodes; j++) {
                mult = this.w[i][j].mult(this.w[0][j]);
                t = t.add(mult);
            }
                minus = t.neg();
                this.w[0][i] = minus.div(this.w[i][i]);
        }
    }
    private transferFuncGeneral (f: number) {
        let ku = new complex(0,0);
        let ri = new complex(0,0);
        let sub = new complex(0,0);
        ri = this.w[0][this.sourceIn.positive].sub(this.w[0][this.sourceIn.negative]);
        sub = this.w[0][this.sourceOut.positive].sub(this.w[0][this.sourceOut.negative]);
        ku = sub.div(ri);
        this.results.push({
            f,
            kum: ku.mag(),
            kua: ku.arg() * 180 / Math.PI,
            rim: ri.mag(),
            ria:  ri.arg() * 180 / Math.PI,
            rom: 0,
            roa: 0
        })
    }
    public calculateElemsComplex() {
        let s = new complex(0, 0);
        for (let i = 0; i <  this.functionValues.length; i++) {
            s = new complex(0, 2 * Math.PI * this.functionValues[i]);

            if (this.resistors !== null) this.addBipolarElemsComplex(this.resistors, BipolarType.Resistor, s);
            if (this.capacitors !== null) this.addBipolarElemsComplex(this.capacitors, BipolarType.Capacitor, s);
            if (this.inductors !== null) this.addBipolarElemsComplex(this.inductors, BipolarType.Inductor, s);
            if (this.VCCSs !== null) this.addVCCSElemsComplex(this.VCCSs);
            if (this.VCCSsFreqDependent !== null) this.addVCCSFreqDependentElemsComplex(this.VCCSsFreqDependent, s);
            if (this.CCCSs !== null) this.addCCCSElemsComplex(this.CCCSs);
            if (this.CCCSsFreqDependent !== null) this.addCCCSFreqDependentElemsComplex(this.CCCSsFreqDependent, s);
            if (this.CCVSs !== null) this.addCCVSElemsComplex(this.CCVSs);
            if (this.CCVSsFreqDependent !== null) this.addCCVSFreqDependentElemsComplex(this.CCVSsFreqDependent, s);
            if (this.VCVSs !== null) this.addVCVSElemsComplex(this.VCVSs);
            if (this.VCVSsFreqDependent) this.addVCVSFreqDependentElemsComplex(this.VCVSsFreqDependent, s);
            if (this.unipolarTransistors) this.addUnipolarTransistorsComplex(this.unipolarTransistors, s);
            if (this.bipolarTransistors) this.addBipolarTransistorsComplex(this.bipolarTransistors, s);
            if (this.transformers !== null) this.addTransformersElemsComplex(this.transformers, s);
            if (this.idealTransformers !== null) this.addIdealTransformerElemsComplex(this.idealTransformers);
            if (this.operationAmplifiers !== null) this.addOperationAmplifierElemsComplex(this.operationAmplifiers, s);
            if (this.idealOperationAmplifiers !== null) this.addIdealOperationAmplifiersElemsComplex(this.idealOperationAmplifiers);
            console.log('nodes before setSource');
            console.log(this.nodes);
            this.setSource();
            console.log('nodes After setSource');
            console.log(this.nodes);
            if (this.sourceType) {
                this.gaussThreePole();
                this.transferFuncThreePole(this.functionValues[i]);
            } else {
                this.gaussGeneral();
                this.transferFuncGeneral(this.functionValues[i]);
            }
        }
        return this.results;
    }

    private setSource () {
        for(let i = 1; i <= MAX_NODES; i++)
            this.w[i][0] = new complex(0,0);
        if (this.sourceIn.positive !== 0)
            this.w[this.sourceIn.positive][0] = new complex(-1,0);
        if(this.sourceIn.negative !== 0)
            this.w[this.sourceIn.negative][0] = new complex(1,0);
    }

    private addVCCSElemsComplex(VCCSs: VCCS[])  {
        let i = 0, j = 0, g = 0;
        for(let kju = 1; kju <= VCCSs.length - 1; kju++)
            for(let l = 2; l <=3; l++) {
                switch (l) {
                    case 2:
                        i = VCCSs[kju].pSecondNode; break;
                    case 3:
                        i = VCCSs[kju].mSecondNode; break;
                }
                if (i === 0) continue;
                for(let m = 0; m <=1; m++)  {
                    switch (m) {
                        case 0:
                            j = VCCSs[kju].pFirstNode; break;
                        case 1:
                            j = VCCSs[kju].mFirstNode; break;
                    }
                    if (j === 0) continue;
                    g = (5 - 2 * l) * (1 - 2 * m);
                    this.w[i][j] =  this.w[i][j].add( new complex(g * VCCSs[kju].transmission,0))
                }
            }
    }

    private addVCCSFreqDependentElemsComplex(VCCSsFreqDependent: InputControlledSource[], s: complex) {
        let ys = new complex(0,0);
        let i: number = 0, j: number = 0, g;
        for(let kjufd = 1; kjufd <= VCCSsFreqDependent.length - 1; kjufd++) {
            let transmission = new complex(VCCSsFreqDependent[kjufd].transmission,0);
            let T1 = new complex(VCCSsFreqDependent[kjufd].T1!,0);
            let T2 = new complex(VCCSsFreqDependent[kjufd].T2!,0);
            let one = new complex(1,0)
            ys = transmission.mult( ( one.add( s.mult(T1) ) ) ).div( one.add( s.mult(T2) ) );
            for(let l = 2; l <= 3; l++) {
                switch (l) {
                    case 2:
                        i = VCCSsFreqDependent[kjufd].pSecondNode; break;
                    case 3:
                        i = VCCSsFreqDependent[kjufd].mSecondNode; break;
                }
                if(i === 0) continue;
                for (let m = 0; m<=1; m++) {
                    switch (m) {
                        case 0:
                            j = VCCSsFreqDependent[kjufd].pFirstNode; break;
                        case 1:
                            j = VCCSsFreqDependent[kjufd].mFirstNode; break;
                    }
                    if (j === 0) continue;
                    g = new complex((5 - 2 * l) * (1 - 2 * m),0);
                    this.w[i][j] = this.w[i][j].add( g.mult(ys) );
                }
            }
        }
    }


    private addCCCSElemsComplex (CCCSs: ControlledSource[]) {
        let i = 0, j , g;
        for(let kji = 1; kji < CCCSs.length - 1;kji++) {
            j = this.nodes + kji;
            for(let l = 0; l <= 3; l++) {
                switch(l) {
                    case 0:
                        i = CCCSs[kji].pFirstNode; break;
                    case 1:
                        i = CCCSs[kji].mFirstNode; break;
                    case 2:
                        i = CCCSs[kji].pSecondNode; break;
                    case 3:
                        i = CCCSs[kji].mSecondNode; break;
                }
                if(i === 0) continue;
                if (l < 2) {
                    g = 1 -2 * l;
                    this.w[i][j] = this.w[i][j].add(new complex(g,0));
                    this.w[j][i] = this.w[j][i].sub(new complex(g,0));
                } else {
                    g = 5 - 2 * l;
                    let multiplication = g * CCCSs[kji].transmission;
                    this.w[i][j] = this.w[i][j].add(new complex(multiplication,0) );
                }
            }
        }
        this.nodes += (CCCSs.length - 1);
    }

    private addCCCSFreqDependentElemsComplex(CCCSsFreqDependent: InputControlledSource[], s: complex) {
        let vs = new complex(0,0);
        let i = 0, j , g;
        for(let kjifd = 1; kjifd < CCCSsFreqDependent.length - 1;kjifd++) {
            let transmission = new complex(CCCSsFreqDependent[kjifd].transmission,0);
            let T1 = new complex(CCCSsFreqDependent[kjifd].T1!,0);
            let T2 = new complex(CCCSsFreqDependent[kjifd].T2!,0);
            let one = new complex(1,0)
            vs = transmission.mult( ( one.add( s.mult(T1) ) ) ).div( one    .add( s.mult(T2) ) );
            j = this.nodes + kjifd;
            for(let l = 0; l <= 3; l++) {
                switch(l) {
                    case 0:
                        i = CCCSsFreqDependent[kjifd].pFirstNode; break;
                    case 1:
                        i = CCCSsFreqDependent[kjifd].mFirstNode; break;
                    case 2:
                        i = CCCSsFreqDependent[kjifd].pSecondNode; break;
                    case 3:
                        i = CCCSsFreqDependent[kjifd].mSecondNode; break;
                }
                if(i === 0) continue;
                if (l < 2) {
                    g = 1 -2 * l;
                    this.w[i][j] = this.w[i][j].add(new complex(g,0));
                    this.w[j][i] = this.w[j][i].sub(new complex(g,0));
                } else {
                    g = 5 - 2 * l;
                    this.w[i][j] = this.w[i][j].add(new complex(g,0).mult(vs));
                }
            }
        }
        this.nodes += (CCCSsFreqDependent.length - 1);
    }

    private addCCVSElemsComplex (CCVSs: ControlledSource[]) {
        let i1, i2, j = 0, g;
        for(let kei = 1; kei <= CCVSs.length - 1; kei++) {
            i1 = this.nodes+ kei;
            i2 = i1 + (CCVSs.length - 1);
            this.w[i2][i1] = new complex(CCVSs[kei].transmission,0);
            for (let m = 0; m <= 3; m++) {
                switch(m) {
                    case 0:
                        j = CCVSs[kei].pFirstNode; break;
                    case 1:
                        j = CCVSs[kei].mFirstNode; break;
                    case 2:
                        j = CCVSs[kei].pSecondNode; break;
                    case 3:
                        j = CCVSs[kei].mSecondNode; break;
                }
                if (j === 0) continue;
                if (m < 2) {
                    g = 1 - 2 * m;
                    this.w[i1][j] = this.w[i1][j].sub(new complex(g,0));
                    this.w[j][i1] = this.w[j][i1].add(new complex(g,0));
                } else {
                    g = 5 - 2 * m;
                    this.w[i2][j] = this.w[i2][j].sub(new complex(g,0));
                    this.w[j][i2] = this.w[j][i2].add(new complex(g,0));
                }
            }
        }
        this.nodes += 2 * (CCVSs.length - 1);

    }

    private addCCVSFreqDependentElemsComplex(CCVSsFreqDependent: InputControlledSource[], s: complex) {
        let ks = new complex(0,0);
        let i1, i2, j = 0, g;
        for(let keiji = 1; keiji <= CCVSsFreqDependent.length - 1; keiji++) {
            let transmission = new complex(CCVSsFreqDependent[keiji].transmission,0);
            let T1 = new complex(CCVSsFreqDependent[keiji].T1!,0);
            let T2 = new complex(CCVSsFreqDependent[keiji].T2!,0);
            let one = new complex(1,0)
            ks = transmission.mult( ( one.add( s.mult(T1) ) ) ).div( one    .add( s.mult(T2) ) );
            i1 = this.nodes+ keiji;
            i2 = i1 + (CCVSsFreqDependent.length - 1);
            this.w[i2][i1] = ks;
            for (let m = 0; m <= 3; m++) {
                switch(m) {
                    case 0:
                        j = CCVSsFreqDependent[keiji].pFirstNode; break;
                    case 1:
                        j = CCVSsFreqDependent[keiji].mFirstNode; break;
                    case 2:
                        j = CCVSsFreqDependent[keiji].pSecondNode; break;
                    case 3:
                        j = CCVSsFreqDependent[keiji].mSecondNode; break;
                }
                if (j === 0) continue;
                if (m < 2) {
                    g = 1 - 2 * m;
                    this.w[i1][j] = this.w[i1][j].sub(new complex(g,0));
                    this.w[j][i1] = this.w[j][i1].add(new complex(g,0));
                } else {
                    g = 5 - 2 * m;
                    this.w[i2][j] = this.w[i2][j].sub(new complex(g,0));
                    this.w[j][i2] = this.w[j][i2].add(new complex(g,0));
                }
            }
        }
        this.nodes += 2 * (CCVSsFreqDependent.length - 1);

    }
    private addVCVSElemsComplex(VCVCs: ControlledSource[]) {
        let i, j:number = 0, g;
        for(let keu = 1; keu <= VCVCs.length - 1; keu++) {
            i = this.nodes + keu;
            for (let m = 0; m <= 3; m++) {
                switch (m) {
                    case 0:
                        j = VCVCs[keu].pFirstNode; break;
                    case 1:
                        j = VCVCs[keu].mFirstNode; break;
                    case 2:
                        j = VCVCs[keu].pSecondNode; break;
                    case 3:
                        j = VCVCs[keu].mSecondNode; break;
                }
                if (j === 0) continue;
                if (m < 2) {
                    g = 1 - 2 * m;
                    this.w[i][j] = this.w[i][j].add(new complex(g * VCVCs[keu].transmission,0))
                } else {
                    g = 5 - 2 * m;
                    this.w[i][j] = this.w[i][j].sub(new complex(g,0));
                    this.w[j][i] = this.w[j][i].add(new complex(g,0));
                }
            }
        }
        this.nodes += (VCVCs.length - 1);
    }

    private addVCVSFreqDependentElemsComplex(CCVSsFreqDependent: InputControlledSource[], s: complex) {
        let ms = new complex(0,0);
        let i, j:number = 0, g;
        for(let keufd = 1; keufd <= CCVSsFreqDependent.length - 1; keufd++) {
            let transmission = new complex(CCVSsFreqDependent[keufd].transmission,0);
            let T1 = new complex(CCVSsFreqDependent[keufd].T1!,0);
            let T2 = new complex(CCVSsFreqDependent[keufd].T2!,0);
            let one = new complex(1,0)
            ms = transmission.mult( ( one.add( s.mult(T1) ) ) ).div( one.add( s.mult(T2) ) );
            i = this.nodes + keufd;
            for (let m = 0; m <= 3; m++) {
                switch (m) {
                    case 0:
                        j = CCVSsFreqDependent[keufd].pFirstNode; break;
                    case 1:
                        j = CCVSsFreqDependent[keufd].mFirstNode; break;
                    case 2:
                        j = CCVSsFreqDependent[keufd].pSecondNode; break;
                    case 3:
                        j = CCVSsFreqDependent[keufd].mSecondNode; break;
                }
                if (j === 0) continue;
                if (m < 2) {
                    g = 1 - 2 * m;
                    this.w[i][j] = this.w[i][j].add(new complex(g ,0).mult(ms));
                } else {
                    g = 5 - 2 * m;
                    this.w[i][j] = this.w[i][j].sub(new complex(g,0));
                    this.w[j][i] = this.w[j][i].add(new complex(g,0));
                }
            }
        }
        this.nodes += (CCVSsFreqDependent.length - 1);
    }




    private addOperationAmplifierElemsComplex(operationAmplifiers: InputOperationAmplifiersType[], s: complex) {
        let cn = new complex(0,0);
        let y: complex[][] = [];
        let ys = new complex(0,0);
        let in_d: number[][] = [[1,2],[3,4]];
        let in_ju: number[] = [1,2,4,3];
        let ii = 0, jj = 0;
        let i,j,g,l,m;
        for(let kou = 1; kou <= operationAmplifiers.length - 1; kou++) {
            for(i = 1; i <= 4; i++)
                for(j = 1; j <= 4; j++)
                    y[i][j] = cn;
            for(let k = 0; k <= 1; k++)
                for(l = 0; l <= 1; l++) {
                    i = in_d[k][l];
                    for(m = 0; m <= 1; m++) {
                        j = in_d[k][m];
                        g = (1 - 2 * l) * (1 - 2 * m);
                        switch (k) {
                            case 0:
                                y[i][j] = y[i][j].add(new complex(g / operationAmplifiers[kou].rIn,0)); break;
                            case 1:
                                y[i][j] = y[i][j].add(new complex(g / operationAmplifiers[kou].rOut,0)); break;
                        }
                    }

                }
            let u = new complex(operationAmplifiers[kou].u,0);
            let ft = new complex(operationAmplifiers[kou].fT,0);
            let rOut = new complex(operationAmplifiers[kou].rOut,0);
            let one = new complex(1,0);
            let num = new complex(0.16,0);
            ys = ( u.div( one.add( (( s.mult(num)).mult(u)).div(ft)))).div(rOut);
            for( l = 2; l <= 3; l++) {
                i = in_ju[l];
                for(m = 0; m <= 1; m++) {
                    j = in_ju[m];
                    g = (1 - 2 * m) * (5 - 2 * l);
                    y[i][j] = y[i][j].add(new complex(g,0).mult(ys));
                }
            }
            for(i = 1; i <= 4; i++) {
                switch (i) {
                    case 1:
                        ii = operationAmplifiers[kou].pFirstNode; break;
                    case 2:
                        ii = operationAmplifiers[kou].mFirstNode; break;
                    case 3:
                        ii = operationAmplifiers[kou].pSecondNode; break;
                    case 4:
                        ii = operationAmplifiers[kou].mSecondNode; break;
                }
                if (ii === 0) continue;
                for(j = 1; j <= 4; j++) {
                    switch (j) {
                        case 1:
                            jj = operationAmplifiers[kou].pFirstNode; break;
                        case 2:
                            jj = operationAmplifiers[kou].mFirstNode; break;
                        case 3:
                            jj = operationAmplifiers[kou].pSecondNode; break;
                        case 4:
                            jj = operationAmplifiers[kou].mSecondNode; break;
                    }
                    if(jj === 0) continue;
                    this.w[ii][jj] = this.w[ii][jj].add(y[i][j]);
                }
            }
        }
    }

    private addIdealOperationAmplifiersElemsComplex(idealOperationAmplifiers: InputIdealOperationAmplifiersType[]) {
        let i = 0, j = 0, j1, j2, g;
        for (let koui = 1; koui <= idealOperationAmplifiers.length - 1; koui++) {
            j1 = this.nodes + koui;
            j2 = j1 + (idealOperationAmplifiers.length - 1);
            this.w[j2][j1] = new complex(-1,0);
            for (let l = 0; l <= 3; l++) {
                switch (l) {
                    case 1:
                        i = idealOperationAmplifiers[koui].pFirstNode; break;
                    case 2:
                        i = idealOperationAmplifiers[koui].mFirstNode; break;
                    case 3:
                        i = idealOperationAmplifiers[koui].pSecondNode; break;
                    case 4:
                        i = idealOperationAmplifiers[koui].mSecondNode; break;
                }
                if (i === 0) continue;
                if (l < 2) {
                    g = 1 - 2 * l;
                    this.w[i][j1] = this.w[i][j1].add(new complex(g,0));
                    this.w[j1][i] = this.w[j1][i].sub(new complex(g,0));
                } else {
                    g = 5 - 2 * l;
                    this.w[i][j2] = this.w[i][j2].add(new complex(g,0));
                }
            }
        }
        this.nodes = 2 * (idealOperationAmplifiers.length - 1);

    }


    private addTransformersElemsComplex(transformers: InputTransformers[], s: complex) {
        let i1, i2, j = 0,g;
        let multS = new complex(0,0);
        let L1 = new complex(0,0);
        let L2 = new complex(0,0);
        let M = new complex(0,0);
        for(let ktr = 1; ktr <= transformers.length - 1; ktr++) {
            i1 = this.nodes + ktr;
            i2 = i1 + (transformers.length - 1);
            L1 = new complex(transformers[ktr].L1,0);
            L2 = new complex(transformers[ktr].L2,0);
            M = new complex(transformers[ktr].M,0);
            multS = s.mult(L1);
            this.w[i1][i1] = new complex(transformers[ktr].R1,0).add(multS);
            multS = s.mult(L2);
            this.w[i2][i2] = new complex(transformers[ktr].R2,0).add(multS);
            this.w[i1][i2] = s.mult(M);
            this.w[i2][i1] = s.mult(M);
            for (let m = 0; m <=3; m++) {
                switch (m) {
                    case 0:
                        j = transformers[ktr].pFirstNode; break;
                    case 1:
                        j = transformers[ktr].mFirstNode; break;
                    case 2:
                        j = transformers[ktr].pSecondNode; break;
                    case 3:
                        j = transformers[ktr].mSecondNode; break;
                }
                if (j === 0) continue;
                if (m < 2) {
                    g = 1 - 2 * m;
                    this.w[i1][j] = this.w[i1][j].sub(new complex(g,0));
                    this.w[j][i1] = this.w[j][i1].add(new complex(g,0));
                } else {
                    g = 5 - 2 * m;
                    this.w[i2][j] = this.w[i2][j].sub(new complex(g,0));
                    this.w[j][i2] = this.w[j][i2].add(new complex(g,0));
                }
            }
        }
        this.nodes += 2 * (transformers.length - 1);
    }

    private addIdealTransformerElemsComplex(idealTransformers: InputIdealTransformersType[]) {
            let i = 0, j = 0, g = 0;
            for(let ktri = 1; ktri <= idealTransformers.length - 1; ktri++) {
                i = this.nodes + ktri;
                for(let m = 0; m <= 3; m++){
                    switch (m) {
                        case 0:
                            j = idealTransformers[ktri].pFirstNode; break;
                        case 1:
                            j = idealTransformers[ktri].mFirstNode; break;
                        case 2:
                            j = idealTransformers[ktri].pSecondNode; break;
                        case 3:
                            j = idealTransformers[ktri].mSecondNode; break;
                    }
                    if (j === 0) continue;
                    if (m < 2) {
                        g = 1 - 2 * m;
                        this.w[i][j] = this.w[i][j].add(new complex(g * idealTransformers[ktri].gain,0));
                        this.w[j][i] = this.w[j][i].sub(new complex(g * idealTransformers[ktri].gain,0));
                    } else {
                        g = 5 - 2 * m;
                        this.w[i][j] =  this.w[i][j].sub(new complex(g,0));
                        this.w[j][i] =  this.w[j][i].add(new complex(g,0));
                    }
                }
            }
            this.nodes += idealTransformers.length - 1;
    }




    private addUnipolarTransistorsComplex(unipolarTransistors: InputUnipolarTransistors[], s: complex) {
        let cn = new complex(0, 0);
        let y: complex[][] = [[],[],[],[]];
        let multiplication = new complex(0,0);
        let Re = new complex(0,0);
        let yMult = new complex(0,0);
        let yAdd = new complex(0,0);
        let yFirstDiv = new complex(0,0);
        let ySecondDiv = new complex(0,0);
        let i, j, ii = 0, jj = 0,l, g, m;
        let in_d: number[][] = [[2,3], [1,], [1,2], [2,3]];
        let in_ju: number[] = [1,3,2,3];
        for (let ktu = 1; ktu <= unipolarTransistors.length - 1; ktu++) {
            for (i = 1; i <= 3; i++)
                for (j = 1; i <= 3; j++)
                    y[i][j] = cn;
            for (let k = 0; k <= 3; k++)
                for (l = 0; l <= 1; l++) {
                    i = in_d[k][l];
                    for (m = 0; m <= 1; m++) {
                        j = in_d[k][m];
                        g = (1 - 2 * l) * (1 - 2 * m);
                        if (k === 0) {
                            y[i][j] = y[i][j].add(new complex(g / unipolarTransistors[ktu].Rc, 0));
                        } else {
                            switch (k) {
                                case 1:
                                    multiplication = s.mult(new complex(g * unipolarTransistors[ktu].Czi, 0));
                                    y[i][j] = y[i][j].add(multiplication);
                                    break;
                                case 2:
                                    multiplication = s.mult(new complex(g * unipolarTransistors[ktu].Czs, 0));
                                    y[i][j] = y[i][j].add(multiplication);
                                    break;
                                case 3:
                                    multiplication = s.mult(new complex(g * unipolarTransistors[ktu].Csi, 0));
                                    y[i][j] = y[i][j].add(multiplication);
                                    break;
                                case 4:
                                    multiplication = s.mult(new complex(g * unipolarTransistors[ktu].S, 0));
                                    y[i][j] = y[i][j].add(multiplication);
                                    break;
                            }
                        }
                    }
                }
            for (l = 2; l <=3; l++) {
                i = in_ju[l];
                for(m = 0; m <= 1; m++) {
                    j = in_ju[m];
                    g = (5 - 2 * l) * (1 - 2 * m);
                    y[i][j] = y[i][j].add(new complex(g * unipolarTransistors[ktu].S,0));
                }
            }
            for(i = 1; i <= 3; i++) {
                switch (i) {
                    case 1:
                        ii = unipolarTransistors[ktu].nz; break;
                    case 2:
                        ii = unipolarTransistors[ktu].ns; break;
                    case 3:
                        ii = unipolarTransistors[ktu].ni; break;
                }
                if (ii === 0) continue;
                for(j = 1; j <= 3; j++) {
                    switch (j) {
                        case 1:
                            jj = unipolarTransistors[ktu].nz; break;
                        case 2:
                            jj = unipolarTransistors[ktu].ns; break;
                        case 3:
                            jj = unipolarTransistors[ktu].ni; break;
                    }
                    if (jj === 0) continue;
                    this.w[ii][jj] = this.w[ii][jj].add(y[i][j]);
                }
            }
        }
    }





    private addBipolarTransistorsComplex(bipolarTransistors: InputBipolarTransistors[], s: complex) {
        let cn = new complex(0, 0);
        let y: complex[][] = [[],[],[],[],[]];
        let multiplication = new complex(0,0);
        let Re = new complex(0,0);
        let yMult = new complex(0,0);
        let yAdd = new complex(0,0);
        let yFirstDiv = new complex(0,0);
        let ySecondDiv = new complex(0,0);
        let i, j, ii = 0, jj = 0, g, l, m;
        let in_d: number[][] = [[4,3], [1,4], [4,2], [1,4], [4,2]];
        let in_ju: number[] = [4,1,2,4];
        for (let ktb = 1; ktb <= bipolarTransistors.length - 1; ktb++) {
            for (i =1; i <= 4; i++)
                for (j = 1; i <= 4; j++)
                    y[i][j] = cn;
            for (let k = 0; k <= 4; k++)
                for (l = 0; l <= 1; l++) {
                        i = in_d[k][l];
                        for (m = 0; m <= 1; m++) {
                            j = in_d[k][m];
                            g = (1 - 2 * l) * (1 - 2 * m);
                            if (k < 3) {
                                switch (k) {
                                    case 0:
                                        y[i][j] = y[i][j].add(new complex(g / bipolarTransistors[ktb].Rb, 0));
                                        break;
                                    case 1:
                                        y[i][j] = y[i][j].add(new complex(g / bipolarTransistors[ktb].Re, 0));
                                        break;
                                    case 2:
                                        y[i][j] = y[i][j].add(new complex(g / bipolarTransistors[ktb].Rc, 0));
                                        break;
                                    case 3:
                                        y[i][j] = y[i][j].add(new complex(g / bipolarTransistors[ktb].Ce, 0));
                                        break;
                                    case 4:
                                        y[i][j] = y[i][j].add(new complex(g / bipolarTransistors[ktb].Cc, 0));
                                        break;
                                }
                            } else {
                                switch (k) {
                                    case 0:
                                        multiplication = s.mult(new complex(g * bipolarTransistors[ktb].Rb, 0));
                                        y[i][j] = y[i][j].add(multiplication);
                                        break;
                                    case 1:
                                        multiplication = s.mult(new complex(g * bipolarTransistors[ktb].Re, 0));
                                        y[i][j] = y[i][j].add(multiplication);
                                        break;
                                    case 2:
                                        multiplication = s.mult(new complex(g * bipolarTransistors[ktb].Rc, 0));
                                        y[i][j] = y[i][j].add(multiplication);
                                        break;
                                    case 3:
                                        multiplication = s.mult(new complex(g * bipolarTransistors[ktb].Ce, 0));
                                        y[i][j] = y[i][j].add(multiplication);
                                        break;
                                    case 4:
                                        multiplication = s.mult(new complex(g * bipolarTransistors[ktb].Cc, 0));
                                        y[i][j] = y[i][j].add(multiplication);
                                        break;
                                }
                            }
                        }
                }
            for (l = 2; l <=3; l++) {
                i = in_ju[l];
                for(m = 0; m <= 1; m++) {
                    j = in_ju[m];
                    g = (5 - 2 * l) * (1 - 2 * m);
                    yMult = new complex(g * bipolarTransistors[ktb].b,0);
                    yAdd = new complex(1 + bipolarTransistors[ktb].b,0);
                    yFirstDiv = yMult.div(yAdd);
                    ySecondDiv = yFirstDiv.div(Re);
                    y[i][j] = y[i][j].add(ySecondDiv);
                }
            }
            for (i = 3; i >=1; i--)
                for(j = 3; j>=1; j++) {
                    yMult = y[i][4].mult(y[4][j]);
                    yFirstDiv = yMult.div(y[4][4]);
                    y[i][j] = y[i][j].sub(yFirstDiv);
                }
            for(i = 1; i <= 3; i++) {
                switch (i) {
                    case 1:
                        ii = bipolarTransistors[ktb].ne; break;
                    case 2:
                        ii = bipolarTransistors[ktb].nc; break;
                    case 3:
                        ii = bipolarTransistors[ktb].nb; break;
                }
                if (ii === 0) continue;
                for(j = 1; j <= 3; j++) {
                    switch (j) {
                        case 1:
                            jj = bipolarTransistors[ktb].ne; break;
                        case 2:
                            jj = bipolarTransistors[ktb].nc; break;
                        case 3:
                            jj = bipolarTransistors[ktb].nb; break;
                    }
                    if (jj === 0) continue;
                    this.w[ii][jj] = this.w[ii][jj].add(y[i][j]);
                }
            }
        }
    }

    private addBipolarElemsComplex(elements: InputResistorsType[] | InputCapacitorsType[] | InputInductorsType[],  type: BipolarType, s: complex): void {
        let i: number = 0, j: number = 0, g:number = 0;
        for(let kd = 1; kd <= elements.length - 1; kd++) {
            for(let l = 0; l <= 1; l++) {
                switch(l) {
                    case 0:
                        i = elements[kd].pNode; break;
                    case 1:
                        i = elements[kd].mNode; break;
                }
                if (i === 0) continue;
                for(let m = 0; m <= 1; m++) {
                    switch (m) {
                        case 0:
                            j = elements[kd].pNode; break;
                        case 1:
                            j = elements[kd].mNode; break;
                    }
                    if (j === 0) continue;
                    g = (1 - 2 * l) * (1 - 2 * m);
                    //TODO check types by elements types
                    switch (type) {
                        case 'R':
                            //TODO check for another way to get access to specific property
                            let division = new complex(g / (elements[kd] as InputResistorsType).resistance,0);
                            this.w[i][j] = this.w[i][j].add(division);
                            break;
                        case 'C':
                            let multiplicationAndMultiplication =  s.mult(new complex(g * (elements[kd] as InputCapacitorsType).capacity,0));
                            this.w[i][j] = this.w[i][j].add(multiplicationAndMultiplication);
                            break;
                        case 'I':
                            let multiplication = s.mult( new complex((elements[kd] as InputInductorsType).induction,0) );
                            let divisionAndMultiplication = new complex(g,0).div(multiplication);
                            this.w[i][j] = this.w[i][j].add(divisionAndMultiplication);
                    }
                }
            }
        }
    }
}

module.exports = Calculations