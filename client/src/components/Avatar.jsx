import React from 'react';

function Avatar({ name }) {
    const gradients = {
        a: 'linear-gradient(138.62deg, #F3994A 14.17%, #B325E2 84.99%)',
        b: 'linear-gradient(138.62deg, #9347DF 14.17%, #EC1A46 84.99%)',
        c: 'linear-gradient(138.62deg, #FF5F6D 14.17%, #FFC371 84.99%)',
        d: 'linear-gradient(138.62deg, #42E695 14.17%, #3BB2B8 84.99%)',
        e: 'linear-gradient(138.62deg, #4A00E0 14.17%, #8E2DE2 84.99%)',
        f: 'linear-gradient(138.62deg, #FF512F 14.17%, #F09819 84.99%)',
        g: 'linear-gradient(138.62deg, #56CCF2 14.17%, #2F80ED 84.99%)',
        h: 'linear-gradient(138.62deg, #FF416C 14.17%, #FF4B2B 84.99%)',
        i: 'linear-gradient(138.62deg, #0F2027 14.17%, #203A43 84.99%)',
        j: 'linear-gradient(138.62deg, #12C2E9 14.17%, #C471ED 84.99%)',
        k: 'linear-gradient(138.62deg, #F37335 14.17%, #FDC830 84.99%)',
        l: 'linear-gradient(138.62deg, #000428 14.17%, #004e92 84.99%)',
        m: 'linear-gradient(138.62deg, #FF0099 14.17%, #493240 84.99%)',
        n: 'linear-gradient(138.62deg, #00B4DB 14.17%, #0083B0 84.99%)',
        o: 'linear-gradient(138.62deg, #B24592 14.17%, #F15F79 84.99%)',
        p: 'linear-gradient(138.62deg, #FF512F 14.17%, #DD2476 84.99%)',
        q: 'linear-gradient(138.62deg, #FF416C 14.17%, #FF4B2B 84.99%)',
        r: 'linear-gradient(138.62deg, #1A2980 14.17%, #26D0CE 84.99%)',
        s: 'linear-gradient(138.62deg, #0F2027 14.17%, #203A43 84.99%)',
        t: 'linear-gradient(138.62deg, #F09819 14.17%, #EDDE5D 84.99%)',
        u: 'linear-gradient(138.62deg, #DCE35B 14.17%, #45B649 84.99%)',
        v: 'linear-gradient(138.62deg, #00C6FF 14.17%, #0072FF 84.99%)',
        w: 'linear-gradient(138.62deg, #8A2387 14.17%, #E94057 84.99%)',
        x: 'linear-gradient(138.62deg, #FC466B 14.17%, #3F5EFB 84.99%)',
        y: 'linear-gradient(138.62deg, #56CCF2 14.17%, #2F80ED 84.99%)',
        z: 'linear-gradient(138.62deg, #654ea3 14.17%, #eaafc8 84.99%)'
    };

    const firstLetter = name ? name[0].toLowerCase() : 'a';
    const backgroundStyle = gradients[firstLetter] || gradients['a'];

    return (
        <div className="rounded-full flex items-center justify-center text-white" style={{
            width: '25px',
            height: '25px',
            background: backgroundStyle,
        }}>
            {firstLetter.toUpperCase()}
        </div>
    );
}

export default Avatar;
