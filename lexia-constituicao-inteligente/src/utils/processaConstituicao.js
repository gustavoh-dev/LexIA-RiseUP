import dataConstituicao from '../data/20200826_EMC108.json';

function extrairTexto(item) {
    if (item && item.texto) {
      
        return item.texto.join(' ').replace(/\s\s+/g, ' ').trim(); 
    }
    return '';
}

function processarConstituicao(data) {
    const artigosPlanos = [];
    let idContador = 1;

    for (const tituloKey in data.titulos) {
        const tituloObj = data.titulos[tituloKey];
        const tituloTexto = extrairTexto(tituloObj);
        
        let blocosArtigos = [];

        if (tituloObj.capitulos) {
            for (const capituloKey in tituloObj.capitulos) {
                const capituloObj = tituloObj.capitulos[capituloKey];
                blocosArtigos.push(capituloObj);
                
                if (capituloObj.secoes) {
                    for (const secaoKey in capituloObj.secoes) {
                         blocosArtigos.push(capituloObj.secoes[secaoKey]);
                    }
                }
            }
        } else {
            blocosArtigos.push(tituloObj);
        }

        for (const bloco of blocosArtigos) {
          
            const capituloTexto = extrairTexto(bloco); 
            const artigos = bloco.artigos || {};

            for (const artigoKey in artigos) {
                const artigoObj = artigos[artigoKey];
                const artigoTextoPrincipal = extrairTexto(artigoObj);
                const artigoNumero = artigoObj.numero ? artigoObj.numero[0] : `Art. ${artigoKey}`; 

                const appendNestedText = (nestedObj) => {
                    let collectedText = '';

                    if (nestedObj.texto && nestedObj !== artigoObj) { 
                        collectedText += ' ' + extrairTexto(nestedObj);
                    }
                    
                    if (nestedObj.incisos) {
                        for (const key in nestedObj.incisos) {
                            collectedText += appendNestedText(nestedObj.incisos[key]);
                        }
                    }
                    if (nestedObj.paragrafos) {
                        for (const key in nestedObj.paragrafos) {
                            collectedText += appendNestedText(nestedObj.paragrafos[key]);
                        }
                    }
                    if (nestedObj.alineas) {
                        for (const key in nestedObj.alineas) {
                            collectedText += appendNestedText(nestedObj.alineas[key]);
                        }
                    }
                    return collectedText;
                };
                
                const nestedText = appendNestedText(artigoObj);
                const textoCompleto = (artigoTextoPrincipal + nestedText).trim().replace(/(\s+)/g, ' ');

                artigosPlanos.push({
                    id: idContador++,
                    titulo_estrutura: tituloTexto.split(': ')[1] || tituloTexto, 
                    capitulo_estrutura: capituloTexto.split(': ')[1] || capituloTexto, 
                    artigo_numero: artigoNumero, // Ex: "163"
                    texto_caput: artigoTextoPrincipal, // Ex: "Art. 163. Lei complementar..."
                    texto_completo: textoCompleto, // Texto completo (Agora sem duplicação e na ordem correta)
                });
            }
        }
    }
    return artigosPlanos;
}

const dadosConstituicaoProcessados = processarConstituicao(dataConstituicao);

export default dadosConstituicaoProcessados;