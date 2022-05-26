import PageContainer from "../../components/PageContainer";
import {ApolloClient, ApolloError, gql, useMutation, useSubscription} from "@apollo/client";
import {GetServerSidePropsContext} from "next";
import {initializeApollo} from "../../lib/ApolloClient";
import serverAuth from "../../components/serverAuth";
import {getSchema, getSchemaVariables} from "../../generated/apollo/getSchema";
import Container from "../../components/Container";
import SchemaElems from "../../components/SchemaElems";
import ResultElems from "../../components/ResultElems";
import {useEffect} from "react";
import CalcDirectivesElem from "../../components/CalcDirectivesElem";
import SchemaParams from "../../components/SchemaParams";
const GET_SCHEMA_RESULTS_QUERY = gql`
    query getSchemaResults(
        $id: Int!
    ) {
        getSchemaResults(id: $id) {
            f
            kum
            kua
            rim
            ria
            roa
            rom
        }
    }
`
const CALCULATE_SCHEMA_MUTATION = gql`
    mutation calculateSchema(
        $id: Int!
    ) {
        calculateSchema(id: $id) 
    }

`
const GET_SCHEMA = gql`
    query getSchema (
        $id: Int!
    ) {
        getSchema(
            id: $id
        ) {
            name
            nr
            nv
            nc
            nl
            ntri
            ntr
            nou
            noui
            ntb
            ntu
            resistors {
                id
                resistance
                pNode
                mNode
            }
            capacitors {
                id
                capacity
                pNode
                mNode
            }
            inductors {
                id
                pNode
                mNode
                induction
            }
            VCCSs {
                id
                pFirstNode
                mFirstNode
                pSecondNode
                mSecondNode
                transmission
            },
            VCCSsFreqDependent {
                id
                pFirstNode
                mFirstNode
                pSecondNode
                mSecondNode
                transmission
                T1
                T2
            }
            CCCSs {
                id
                pFirstNode
                mFirstNode
                pSecondNode
                mSecondNode
                transmission
            },
            CCCSsFreqDependent {
                id
                pFirstNode
                mFirstNode
                pSecondNode
                mSecondNode
                transmission
                T1
                T2
            }
            CCVSs {
                id
                pFirstNode
                mFirstNode
                pSecondNode
                mSecondNode
                transmission
            },
            CCVSsFreqDependent {
                id
                pFirstNode
                mFirstNode
                pSecondNode
                mSecondNode
                transmission
                T1
                T2
            }
            VCVSs {
                id
                pFirstNode
                mFirstNode
                pSecondNode
                mSecondNode
                transmission
            },
            VCVSsFreqDependent {
                id
                pFirstNode
                mFirstNode
                pSecondNode
                mSecondNode
                transmission
                T1
                T2
            }
            transformers {
                id
                pFirstNode
                mFirstNode
                pSecondNode
                mSecondNode
                L1
                L2
                R1
                R2
                M
            }

            idealTransformers {
                id
                pFirstNode
                mFirstNode
                pSecondNode
                mSecondNode
                gain
            }
            operationAmplifiers {
                id
                pFirstNode
                mFirstNode
                pSecondNode
                mSecondNode
                rIn
                rOut
                u
                fT
            }
            idealOperationAmplifiers {
                id
                pFirstNode
                mFirstNode
                pSecondNode
                mSecondNode
            }
            bipolarTransistors {
                id
                ne
                nc
                nb
                Rb
                Re
                Rc
                Cc
                b
            }
            unipolarTransistors {
                id
                nz
                ns
                ni
                Rc
                Csi
                Czs
                Csi
                S
            }
            calculationDirectives {
                inNodeM
                inNodeP
                outNodeM
                outNodeP
                first
                second
                third
                functionType
            }
            

        }
    }
`

const DELETE_RESISTOR_MUTATION = gql`
    mutation deleteResistor(
        $elemId: Int!
    ) {
        deleteResistor(
            elemId: $elemId
        ) 
    }

`
const CHANGE_RESISTOR_MUTATION = gql`
    mutation changeResistor(
        $elemId: Int!
        $data: InputResistorsType!
    ) {
        changeResistor(
            elemId: $elemId
            data: $data
        )
    }
`

const ADD_RESISTOR_MUTATION = gql`
    mutation addResistor(
        $schemaId: Int!
        $data: InputResistorsType!
    ) {
        addResistor(
            schemaId: $schemaId
            data: $data
        ) {
            id
        }
    }

`
const DELETE_CAPACITOR_MUTATION = gql`
    mutation deleteCapacitor(
        $elemId: Int!
    ) {
        deleteCapacitor(
            elemId: $elemId
        )
    }

`
const CHANGE_CAPACITOR_MUTATION = gql`
    mutation changeCapacitor(
        $elemId: Int!
        $data: InputCapacitorsType!
    ) {
        changeCapacitor(
            elemId: $elemId
            data: $data
        )
    }
`

const ADD_CAPACITOR_MUTATION = gql`
    mutation addCapacitor(
        $schemaId: Int!
        $data: InputCapacitorsType!
    ) {
        addCapacitor(
            schemaId: $schemaId
            data: $data
        ) {
            id
        }
    }

`

const DELETE_INDUCTOR_MUTATION = gql`
    mutation deleteInductor(
        $elemId: Int!
    ) {
        deleteInductor(
            elemId: $elemId
        )
    }

`
const CHANGE_INDUCTOR_MUTATION = gql`
    mutation changeInductor(
        $elemId: Int!
        $data: InputInductorsType!
    ) {
        changeInductor(
            elemId: $elemId
            data: $data
        )
    }
`

const ADD_INDUCTOR_MUTATION = gql`
    mutation addInductor(
        $schemaId: Int!
        $data: InputInductorsType!
    ) {
        addInductor(
            schemaId: $schemaId
            data: $data
        ) {
            id
        }
    }
`

const DELETE_TRANSFORMER_MUTATION = gql`
    mutation deleteTransformer(
        $elemId: Int!
    ) {
        deleteTransformer(
            elemId: $elemId
        )
    }

`
const CHANGE_TRANSFORMER_MUTATION = gql`
    mutation changeTransformer(
        $elemId: Int!
        $data: InputTransformers!
    ) {
        changeTransformer(
            elemId: $elemId
            data: $data
        )
    }
`

const ADD_TRANSFORMER_MUTATION = gql`
    mutation addTransformer(
        $schemaId: Int!
        $data: InputTransformers!
    ) {
        addTransformer(
            schemaId: $schemaId
            data: $data
        ) {
            id
        }
    }
`

const DELETE_IDEAL_TRANSFORMER_MUTATION = gql`
    mutation deleteIdealTransformer(
        $elemId: Int!
    ) {
        deleteIdealTransformer(
            elemId: $elemId
        )
    }

`
const CHANGE_IDEAL_TRANSFORMER_MUTATION = gql`
    mutation changeIdealTransformer(
        $elemId: Int!
        $data: InputIdealTransformersType!
    ) {
        changeIdealTransformer(
            elemId: $elemId
            data: $data
        )
    }
`

const ADD_IDEAL_TRANSFORMER_MUTATION = gql`
    mutation addIdealTransformer(
        $schemaId: Int!
        $data: InputIdealTransformersType!
    ) {
        addIdealTransformer(
            schemaId: $schemaId
            data: $data
        ) {
            id
        }
    }
`
const DELETE_OPERATION_AMPLIFIER_MUTATION = gql`
    mutation deleteOperationAmplifier(
        $elemId: Int!
    ) {
        deleteOperationAmplifier(
            elemId: $elemId
        )
    }

`
const CHANGE_OPERATION_AMPLIFIER_MUTATION = gql`
    mutation changeOperationAmplifier(
        $elemId: Int!
        $data: InputOperationAmplifiersType!
    ) {
        changeOperationAmplifier(
            elemId: $elemId
            data: $data
        )
    }
`

const ADD_OPERATION_AMPLIFIER_MUTATION = gql`
    mutation addOperationAmplifier(
        $schemaId: Int!
        $data: InputOperationAmplifiersType!
    ) {
        addOperationAmplifier(
            schemaId: $schemaId
            data: $data
        ) {
            id
        }
    }
`

const DELETE_IDEAL_OPERATION_AMPLIFIER_MUTATION = gql`
    mutation deleteIdealOperationAmplifier(
        $elemId: Int!
    ) {
        deleteIdealOperationAmplifier(
            elemId: $elemId
        )
    }

`
const CHANGE_IDEAL_OPERATION_AMPLIFIER_MUTATION = gql`
    mutation changeIdealOperationAmplifier(
        $elemId: Int!
        $data: InputIdealOperationAmplifiersType!
    ) {
        changeIdealOperationAmplifier(
            elemId: $elemId
            data: $data
        )
    }
`

const ADD_IDEAL_OPERATION_AMPLIFIER_MUTATION = gql`
    mutation addIdealOperationAmplifier(
        $schemaId: Int!
        $data: InputIdealOperationAmplifiersType!
    ) {
        addIdealOperationAmplifier(
            schemaId: $schemaId
            data: $data
        ) {
            id
        }
    }
`

const DELETE_VCCS_MUTATION = gql`
    mutation deleteVCCS(
        $elemId: Int!
    ) {
        deleteVCCS(
            elemId: $elemId
        )
    }

`
const CHANGE_VCCS_MUTATION = gql`
    mutation changeVCCS(
        $elemId: Int!
        $data: InputControlledSource!
    ) {
        changeVCCS(
            elemId: $elemId
            data: $data
        )
    }
`

const ADD_VCCS_MUTATION = gql`
    mutation addVCCS(
        $schemaId: Int!
        $data: InputControlledSource!
    ) {
        addVCCS(
            schemaId: $schemaId
            data: $data
        ) {
            id
        }
    }
`

const DELETE_CCCS_MUTATION = gql`
    mutation deleteCCCS(
        $elemId: Int!
    ) {
        deleteCCCS(
            elemId: $elemId
        )
    }

`
const CHANGE_CCCS_MUTATION = gql`
    mutation changeCCCS(
        $elemId: Int!
        $data: InputControlledSource!
    ) {
        changeCCCS(
            elemId: $elemId
            data: $data
        )
    }
`

const ADD_CCCS_MUTATION = gql`
    mutation addCCCS(
        $schemaId: Int!
        $data: InputControlledSource!
    ) {
        addCCCS(
            schemaId: $schemaId
            data: $data
        ) {
            id
        }
    }
`
const DELETE_CCVS_MUTATION = gql`
    mutation deleteCCVS(
        $elemId: Int!
    ) {
        deleteCCVS(
            elemId: $elemId
        )
    }

`
const CHANGE_CCVS_MUTATION = gql`
    mutation changeCCVS(
        $elemId: Int!
        $data: InputControlledSource!
    ) {
        changeCCVS(
            elemId: $elemId
            data: $data
        )
    }
`

const ADD_CCVS_MUTATION = gql`
    mutation addCCVS(
        $schemaId: Int!
        $data: InputControlledSource!
    ) {
        addCCVS(
            schemaId: $schemaId
            data: $data
        ) {
            id
        }
    }
`

const DELETE_VCVS_MUTATION = gql`
    mutation deleteCCCS(
        $elemId: Int!
    ) {
        deleteVCVS(
            elemId: $elemId
        )
    }

`
const CHANGE_VCVS_MUTATION = gql`
    mutation changeCCCS(
        $elemId: Int!
        $data: InputControlledSource!
    ) {
        changeVCVS(
            elemId: $elemId
            data: $data
        )
    }
`

const ADD_VCVS_MUTATION = gql`
    mutation addVCVS(
        $schemaId: Int!
        $data: InputControlledSource!
    ) {
        addVCVS(
            schemaId: $schemaId
            data: $data
        ) {
            id
        }
    }
`
const DELETE_BIPOLAR_TRANSISTOR_MUTATION = gql`
    mutation deleteBipolarTransistor(
        $elemId: Int!
    ) {
        deleteBipolarTransistor(
            elemId: $elemId
        )
    }

`
const CHANGE_BIPOLAR_TRANSISTOR_MUTATION = gql`
    mutation changeBipolarTransistor(
        $elemId: Int!
        $data: InputBipolarTransistors!
    ) {
        changeBipolarTransistor(
            elemId: $elemId
            data: $data
        )
    }
`

const ADD_BIPOLAR_TRANSISTOR_MUTATION = gql`
    mutation addBipolarTransistor(
        $schemaId: Int!
        $data: InputBipolarTransistors!
    ) {
        addBipolarTransistor(
            schemaId: $schemaId
            data: $data
        ) {
            id
        }
    }
`
const DELETE_UNIPOLAR_TRANSISTOR_MUTATION = gql`
    mutation deleteUnipolarTransistor(
        $elemId: Int!
    ) {
        deleteUnipolarTransistor(
            elemId: $elemId
        )
    }

`
const CHANGE_UNIPOLAR_TRANSISTOR_MUTATION = gql`
    mutation changeUnipolarTransistor(
        $elemId: Int!
        $data: InputUnipolarTransistors!
    ) {
        changeUnipolarTransistor(
            elemId: $elemId
            data: $data
        )
    }
`

const ADD_UNIPOLAR_TRANSISTOR_MUTATION = gql`
    mutation addUnipolarTransistor(
        $schemaId: Int!
        $data: InputUnipolarTransistors!
    ) {
        addUnipolarTransistor(
            schemaId: $schemaId
            data: $data
        ) {
            id
        }
    }
`
const CHANGE_IN_NODE_MUTATION = gql`
    mutation changeInNode(
        $schemaId: Int!
        $plus: Int!
        $minus: Int!
    ) {
        changeInNode(
            schemaId: $schemaId
            plus: $plus
            minus: $minus
            
        ) {
            id
        }
    }
`








function Schema(props: any) {

    return(
        <Container>
            <h1>{props.data.name} </h1>
            <SchemaParams
                initialNodes = {props.data.nv}
                schemaId = {+props.schemaId}
            />
            <SchemaElems
                initialValues = {props.data.resistors}
                counter = {props.data.nr}
                elemFields = {{pNode: 'Узел +',mNode: 'Узел -',resistance: 'Сопротивление'}}
                name = {'Резисторы'}
                changeCallback = {CHANGE_RESISTOR_MUTATION}
                deleteCallback = {DELETE_RESISTOR_MUTATION}
                addCallback = {ADD_RESISTOR_MUTATION}
                schemaId = {+props.schemaId}

            />
            <SchemaElems
                initialValues = {props.data.capacitors}
                counter = {props.data.nc}
                elemFields = {{pNode: 'Узел +',mNode: 'Узел -',capacity: 'Ёмкость'}}
                name = {'Конденсаторы'}
                changeCallback = {CHANGE_CAPACITOR_MUTATION}
                deleteCallback = {DELETE_CAPACITOR_MUTATION}
                addCallback = {ADD_CAPACITOR_MUTATION}
                schemaId = {+props.schemaId}

            />
            <SchemaElems
                initialValues = {props.data.inductors}
                counter = {props.data.nl}
                elemFields = {{pNode: 'Узел +',mNode: 'Узел -',induction: 'Индуктивность'}}
                name = {'Катушки'}
                changeCallback = {CHANGE_INDUCTOR_MUTATION}
                deleteCallback = {DELETE_INDUCTOR_MUTATION}
                addCallback = {ADD_INDUCTOR_MUTATION}
                schemaId = {+props.schemaId}
            />
            <SchemaElems
                initialValues = {props.data.transformers}
                counter = {props.data.ntr}
                elemFields ={
                    {
                        pFirstNode: 'Узел 1 +',
                        mFirstNode: 'Узел 1 -',
                        pSecondNode: 'Узел 2 +',
                        mSecondNode: 'Узел 2 -',
                        L1: 'Индуктивность первичной обмотки',
                        L2: 'Индуктивность вторичной обмотки',
                        R1: 'Активное сопротивление 1',
                        R2: 'Активное сопротивление 2',
                        M: 'Коэффициент трансформации'
                    }
                }
                name = {'Трансформаторы'}
                changeCallback = {CHANGE_TRANSFORMER_MUTATION}
                deleteCallback = {DELETE_TRANSFORMER_MUTATION}
                addCallback = {ADD_TRANSFORMER_MUTATION}
                schemaId = {+props.schemaId}
            />
            <SchemaElems
                initialValues = {props.data.idealTransformers}
                counter = {props.data.ntri}
                elemFields ={
                    {
                        pFirstNode: 'Узел 1 +',
                        mFirstNode: 'Узел 1 -',
                        pSecondNode: 'Узел 2 +',
                        mSecondNode: 'Узел 2 -',
                        gain: 'Коэффициент трансформации',
                    }
                }
                name = {'Идеальные трансформаторы'}
                changeCallback = {CHANGE_IDEAL_TRANSFORMER_MUTATION}
                deleteCallback = {DELETE_IDEAL_TRANSFORMER_MUTATION}
                addCallback = {ADD_IDEAL_TRANSFORMER_MUTATION}
                schemaId = {+props.schemaId}
            />
            <SchemaElems
                initialValues = {props.data.operationAmplifiers}
                counter = {props.data.nou}
                elemFields = {
                    {
                        pFirstNode: 'Узел 1 +',
                        mFirstNode: 'Узел 1 -',
                        pSecondNode: 'Узел 2 +',
                        mSecondNode: 'Узел 2 -',
                        fT: 'fT',
                        rIn: 'rIn',
                        rOut: 'rOut',
                        u: 'u'
                    }
                }
                name = {'Операционные усилители'}
                changeCallback = {CHANGE_OPERATION_AMPLIFIER_MUTATION}
                deleteCallback = {DELETE_OPERATION_AMPLIFIER_MUTATION}
                addCallback = {ADD_OPERATION_AMPLIFIER_MUTATION}
                schemaId = {+props.schemaId}
            />
            <SchemaElems
                initialValues = {props.data.idealOperationAmplifiers}
                counter = {props.data.noui}
                elemFields = {
                    {
                        pFirstNode: 'Узел 1 +',
                        mFirstNode: 'Узел 1 -',
                        pSecondNode: 'Узел 2 +',
                        mSecondNode: 'Узел 2 -',
                    }
                }
                name = {'Идеальные операционные усилители'}
                changeCallback = {CHANGE_IDEAL_OPERATION_AMPLIFIER_MUTATION}
                deleteCallback = {DELETE_IDEAL_OPERATION_AMPLIFIER_MUTATION}
                addCallback = {ADD_IDEAL_OPERATION_AMPLIFIER_MUTATION}
                schemaId = {+props.schemaId}
            />
            <SchemaElems
                initialValues = {props.data.VCCSs}
                counter = {props.data.VCCSs.length}
                elemFields = {
                    {
                        pFirstNode: 'Узел 1 +',
                        mFirstNode: 'Узел 1 -',
                        pSecondNode: 'Узел 2 +',
                        mSecondNode: 'Узел 2 -',
                        transmission: 'Коэф передачи'
                    }
                }
                name = {'ИТУН'}
                changeCallback = {CHANGE_VCCS_MUTATION}
                deleteCallback = {DELETE_VCCS_MUTATION}
                addCallback = {ADD_VCCS_MUTATION}
                schemaId = {+props.schemaId}
            />
            <SchemaElems
                initialValues = {props.data.VCCSsFreqDependent}
                counter = {props.data.VCCSsFreqDependent.length}
                elemFields = {
                    {
                        pFirstNode: 'Узел 1 +',
                        mFirstNode: 'Узел 1 -',
                        pSecondNode: 'Узел 2 +',
                        mSecondNode: 'Узел 2 -',
                        transmission: 'Коэффициент передачи',
                        T1: 'T1',
                        T2: 'T2'
                    }
                }
                name = {'Частотно-зависимые ИТУН'}
                changeCallback = {CHANGE_VCCS_MUTATION}
                deleteCallback = {DELETE_VCCS_MUTATION}
                addCallback = {ADD_VCCS_MUTATION}
                schemaId = {+props.schemaId}
            />
            <SchemaElems
                initialValues = {props.data.CCCSs}
                counter = {props.data.CCCSs.length}
                elemFields = {
                    {
                        pFirstNode: 'Узел 1 +',
                        mFirstNode: 'Узел 1 -',
                        pSecondNode: 'Узел 2 +',
                        mSecondNode: 'Узел 2 -',
                        transmission: 'Коэф передачи'
                    }
                }
                name = {'ИТУТ'}
                changeCallback = {CHANGE_CCCS_MUTATION}
                deleteCallback = {DELETE_CCCS_MUTATION}
                addCallback = {ADD_CCCS_MUTATION}
                schemaId = {+props.schemaId}
            />
            <SchemaElems
                initialValues = {props.data.CCCSsFreqDependent}
                counter = {props.data.CCCSsFreqDependent.length}
                elemFields = {
                    {
                        pFirstNode: 'Узел 1 +',
                        mFirstNode: 'Узел 1 -',
                        pSecondNode: 'Узел 2 +',
                        mSecondNode: 'Узел 2 -',
                        transmission: 'Коэффициент передачи',
                        T1: 'T1',
                        T2: 'T2'
                    }
                }
                name = {'Частотно-зависимые ИТУТ'}
                changeCallback = {CHANGE_CCCS_MUTATION}
                deleteCallback = {DELETE_CCCS_MUTATION}
                addCallback = {ADD_CCCS_MUTATION}
                schemaId = {+props.schemaId}
            />
            <SchemaElems
                initialValues = {props.data.VCVSs}
                counter = {props.data.VCVSs.length}
                elemFields = {
                    {
                        pFirstNode: 'Узел 1 +',
                        mFirstNode: 'Узел 1 -',
                        pSecondNode: 'Узел 2 +',
                        mSecondNode: 'Узел 2 -',
                        transmission: 'Коэф передачи'
                    }
                }
                name = {'ИНУН'}
                changeCallback = {CHANGE_VCVS_MUTATION}
                deleteCallback = {DELETE_VCVS_MUTATION}
                addCallback = {ADD_VCVS_MUTATION}
                schemaId = {+props.schemaId}
            />
            <SchemaElems
                initialValues = {props.data.VCVSsFreqDependent}
                counter = {props.data.VCVSsFreqDependent.length}
                elemFields = {
                    {
                        pFirstNode: 'Узел 1 +',
                        mFirstNode: 'Узел 1 -',
                        pSecondNode: 'Узел 2 +',
                        mSecondNode: 'Узел 2 -',
                        transmission: 'Коэффициент передачи',
                        T1: 'T1',
                        T2: 'T2'
                    }
                }
                name = {'Частотно-зависимые ИНУН'}
                changeCallback = {CHANGE_VCVS_MUTATION}
                deleteCallback = {DELETE_VCVS_MUTATION}
                addCallback = {ADD_VCVS_MUTATION}
                schemaId = {+props.schemaId}
            />
            <SchemaElems
                initialValues = {props.data.CCVSs}
                counter = {props.data.CCVSs.length}
                elemFields = {
                    {
                        pFirstNode: 'Узел 1 +',
                        mFirstNode: 'Узел 1 -',
                        pSecondNode: 'Узел 2 +',
                        mSecondNode: 'Узел 2 -',
                        transmission: 'Коэф передачи'
                    }
                }
                name = {'ИНУТ'}
                changeCallback = {CHANGE_CCVS_MUTATION}
                deleteCallback = {DELETE_CCVS_MUTATION}
                addCallback = {ADD_CCVS_MUTATION}
                schemaId = {+props.schemaId}
            />
            <SchemaElems
                initialValues = {props.data.CCVSsFreqDependent}
                counter = {props.data.CCVSsFreqDependent.length}
                elemFields = {
                    {
                        pFirstNode: 'Узел 1 +',
                        mFirstNode: 'Узел 1 -',
                        pSecondNode: 'Узел 2 +',
                        mSecondNode: 'Узел 2 -',
                        transmission: 'Коэффициент передачи',
                        T1: 'T1',
                        T2: 'T2'
                    }
                }
                name = {'Частотно-зависимые ИНУТ'}
                changeCallback = {CHANGE_CCVS_MUTATION}
                deleteCallback = {DELETE_CCVS_MUTATION}
                addCallback = {ADD_CCVS_MUTATION}
                schemaId = {+props.schemaId}
            />
            <SchemaElems
                initialValues = {props.data.bipolarTransistors}
                counter = {props.data.ntb}
                elemFields = {
                    {
                        ne: 'Эмиттер',
                        nc: 'Коллектор',
                        nb: 'База',
                        Re: 'Сопротивление эмиттера',
                        Rc: 'Сопротивление коллектора',
                        Rb: 'Сопротивление базы',
                        Ce: 'Ёмкость эмиттера',
                        Cc: 'Ёмкость коллектора',
                        b: 'Коэф пропорциональности'
                    }
                }
                name = {'Биполярные транзисторы'}
                changeCallback = {CHANGE_BIPOLAR_TRANSISTOR_MUTATION}
                deleteCallback = {DELETE_BIPOLAR_TRANSISTOR_MUTATION}
                addCallback = {ADD_BIPOLAR_TRANSISTOR_MUTATION}
                schemaId = {+props.schemaId}
            />
            <SchemaElems
                initialValues = {props.data.unipolarTransistors}
                counter = {props.data.ntu}
                elemFields = {
                    {
                        nz: 'Затвор',
                        ns: 'Сток',
                        ni: 'Исток',
                        Rc: 'Сопротивление коллектора',
                        Czi: 'Ёмкость затвора-истока',
                        Czs: 'Ёмкость затвора-стока',
                        Csi: 'Ёмкость затвора-истока',
                        b: 'S'
                    }
                }
                name = {'Униполярные транзисторы'}
                changeCallback = {CHANGE_UNIPOLAR_TRANSISTOR_MUTATION}
                deleteCallback = {DELETE_UNIPOLAR_TRANSISTOR_MUTATION}
                addCallback = {ADD_UNIPOLAR_TRANSISTOR_MUTATION}
                schemaId = {+props.schemaId}
            />
            <CalcDirectivesElem
                inP = {props.data.calculationDirectives.inNodeP}
                outP = {props.data.calculationDirectives.outNodeP}
                inM = {props.data.calculationDirectives.inNodeM}
                outM = {props.data.calculationDirectives.outNodeM}
                type = {props.data.calculationDirectives.functionType}
                initialValues ={
                    {
                        first: props.data.calculationDirectives.first,
                        second: props.data.calculationDirectives.second,
                        third: props.data.calculationDirectives.third
                    }
                }
                schema = {+props.schemaId}

            />

                <ResultElems
                    elems={props.schemaResult}
                />



        </Container>



    );
}





export const getServerSideProps = serverAuth(async (ctx: GetServerSidePropsContext, apolloClient :ApolloClient<typeof ctx>) => {

    let result = {data: {}, err: '', schemaId: ctx.params?.id, schemaResult: {}};
    const schemaId = parseInt(ctx.params?.id as string)
    await apolloClient.query<getSchema,getSchemaVariables>({
        query: GET_SCHEMA,
        variables: {
            id: schemaId
        }
    }).then((res) => {
        result.data = res.data.getSchema!;

    }).catch((err:ApolloError) => {
        result.err = err.message;
    });

    await apolloClient.query({
        query: GET_SCHEMA_RESULTS_QUERY,
        variables: {
            id: schemaId
        }
    }).then((res) => {
        result.schemaResult = res.data.getSchemaResults;
    }).catch((err) => {
        result.err = err.message;
    })


    return {
        props: result
    }
});

export default Schema;