const math = require('mathjs');
export const form_d = (elements:any, elementsType :String, w:any, s: any) => {
    let g,i,j;
    for(let kd = 1; kd <= elements.length - 1; kd++) {
        for(let l = 0; l <= 1; l++) {
            switch(l) {
                case 0:
                    i = elements[kd].pNode;
                    break;
                case 1:
                    i = elements[kd].mNode;
                    break;
            }
            if (i == 0) continue;
            for(let m = 0; m <= 1; m++) {
                switch(m) {
                    case 0:
                        j = elements[kd].pNode;
                        break;
                    case 1:
                        j = elements[kd].mNode;
                        break;
                }
                if (j==0) continue;
                g = (1 - 2 * l) * (1 - 2 * m);
                switch(elementsType) {
                    case 'R':
                        w[i][j] = math.add(w[i][j], math.divide(g, elements[kd].resistance));
                        break;
                    case 'C':
                        w[i][j] = math.add(w[i][j], math.multiply(math.multiply(g,s),elements[kd].capacity));
                        break;
                    case 'L':
                        w[i][j] = math.add(w[i][j], math.multiply(g, math.divide(s,elements[kd].induction)));
                        break;
                }
            }
        }
    }
}

export const    form_s = (maxNodes:any,w:any, inNodeM:any, inNodeP:any) => {
    for(let i = 1; i <=  maxNodes;i++)
        w[i][0] = math.complex(0,0);
    if(inNodeP != 0) {
        w[inNodeP][0] = math.complex(-1,0);
    }
    if(inNodeM !=0) {
        w[inNodeM][0] = math.complex(1,0);
    }
}

export const st = (n: any,w:any) => {
    let c = math.complex(0,0);
    let t = math.complex(0,0);
    let cn = math.complex(0,0);
    let l;
    //let g;
    for(let k = n; k >= 3; k--) {

        l = k;
        /*
                g = 0.001;
        while(math.abs(w[l][k]) <= g) {
            l = l -1;
            if (l == 2) {
                l = k;
                g = 0.1 * g;
            }
        }
        */
        if (l != k)
            for (let j = k; j <=n; j++) {

                t = w[k][j];

                w[k][j] = w[l][j];
                w[l][j] = t;
            }
        for (let i = k -1; i >= 1; i--) {
            if (w[i][k] === cn)
                continue;
            c = math.divide(w[i][k],w[k][k]);

            for (let j = 1; j <= k - 1; j++)
                if (w[k][j] != cn)
                    w[i][j] = math.subtract(w[i][j], math.multiply(c,w[k][j]));
        }
    }
}

export const sf1 = (kf:any,kfIncrement :any,w:any,resultArr:any) => {
    let ku = math.complex(0,0);
    let ri = math.complex(0,0);
    let ro = math.complex(0,0);
    let d = math.complex(0,0);

    ku = math.divide((w[2][1]).neg(),w[2][2]);
    d = math.subtract( math.multiply(w[1][1],w[2][2]), math.multiply(w[2][1],w[1][2]));
    ri = math.divide(w[2][2],d);
    ro = math.divide(w[1][1],d);
    if (kfIncrement) {
        resultArr.push({
            kum: math.abs(ku),
            kua: math.atan2(ku.im,ku.re) * 180.0 / Math.PI,
            rim: math.abs(ri),
            ria: math.atan2(ri.im,ri.re) * 180.0 / Math.PI,
            rom: math.abs(ro),
            roa:math.atan2(ro.im,ro.re) * 180.0 / Math.PI,
        })
    } else {
        resultArr[kf].kum =  math.abs(ku);
        resultArr[kf].kua =  math.atan2(ku.im,ku.re) * 180 / Math.PI;
        resultArr[kf].rim = math.abs(ri);
        resultArr[kf].ria = math.atan2(ri.im,ri.re) * 180 / Math.PI;
        resultArr[kf] = math.abs(ro);
        resultArr[kf] =math.atan2(ro.im,ro.re) * 180.0 / Math.PI;
    }
}

export const gauss_c = (n:any,w :any) => {
    let i,j , k, l;
    let c = math.complex(0,0);
    let d = math.complex(0,0);
    let t = math.complex(0,0);
    let cn = math.complex(0,0);

    for( k = 1; k < n; k++) {
        l = k;
        for (i = k + 1; i <= n; i++)
            if (math.abs(w[i][k]) > math.abs(w[l][k]))
                l = i;
        if(l != k)
            for(let j =0; j<=n; j++)
                if (j === 0 || j>=k) {
                    t = w[k][j];
                    w[k][j] = w[l][j];
                    w[l][j] = t;
                }

        d = math.divide(1.0, w[k][k]);
        for (i = k + 1; i <= n; i++) {
            if (w[i][k] === cn)
                continue;
            c = math.multiply(w[i][k], d);
            for (j = k + 1; j <= n; j++)
                if (w[k][j] !== cn)
                    w[i][j] = math.subtract(w[i][j], math.multiply(c, w[k][j]));
            if (w[k][0] !== cn)
                w[i][0] = math.subtract(w[i][0], math.multiply(c, w[k][0]));
        }
    }
    w[0][n] = math.divide(w[n][0].neg(), w[n][n]);
    for (i = n-1; i >= 1; i--) {
        t = w[i][0];
        for (j = i +1; j <= n; j++)
            t = math.add(t,math.multiply(w[i][j], w[0][j]));
        w[0][i] = math.divide(t.neg(), w[i][i]);
    }

}

export const sf2 = (kf :any, kfIncrement :any, inNodeP:any, inNodeM :any, outNodeM :any , outNodeP:any, w:any, resultArr:any ) => {
    let ku = math.complex(0,0);
    let ri = math.complex(0,0);
    ri = math.subtract(w[0][inNodeP], w[0][inNodeM]);
    ku = math.divide(math.subtract(w[0][outNodeP], w[0][outNodeM]),ri);
    if (kfIncrement) {
        resultArr.push({
            kum: math.abs(ku),
            kua: math.atan2(ku.im,ku.re) * 180 / Math.PI,
            rim: math.abs(ri),
            ria: math.atan2(ri.im,ri.re) * 180 / Math.PI
        })
    } else {
        resultArr[kf].kum =  math.abs(ku);
        resultArr[kf].kua =  math.atan2(ku.im,ku.re) * 180 / Math.PI;
        resultArr[kf].rim = math.abs(ri);
        resultArr[kf].ria = math.atan2(ri.im,ri.re) * 180 / Math.PI;
    }
}