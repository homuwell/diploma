import React from 'react';

function ResultElem({elem}:any) {

    return (
        <>
            <div>{`f: ${elem.f}`}</div>
            <div>{`kum: ${elem.kum}`}</div>
            <div>{`kua: ${elem.kua}`}</div>
            <div>{`rim: ${elem.rim}`}</div>
            <div>{`ria: ${elem.ria}`}</div>
            <div>{`roa: ${elem.roa}`}</div>
            <div>{`rom: ${elem.rom}`}</div>
        </>
    );
}

export default ResultElem;