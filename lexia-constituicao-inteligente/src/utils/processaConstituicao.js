import dataConstituicao from '../data/20200826_EMC108.json';

/**
 * Extrai e normaliza o texto de um item
 * @param {object} item - Item do JSON da constituição
 * @returns {string} Texto normalizado
 */
function extrairTexto(item) {
    if (!item || !item.texto || !Array.isArray(item.texto)) {
        return '';
    }
    
    // Junta o array de texto, remove espaços múltiplos e normaliza
    return item.texto
        .filter(t => t && typeof t === 'string')
        .join(' ')
        .replace(/\s+/g, ' ')
        .trim();
}

/**
 * Processa recursivamente elementos aninhados (incisos, parágrafos, alíneas)
 * evitando duplicação do texto principal
 * @param {object} nestedObj - Objeto aninhado a processar
 * @param {object} artigoObj - Objeto do artigo principal (para evitar duplicação)
 * @returns {string} Texto coletado dos elementos aninhados
 */
function appendNestedText(nestedObj, artigoObj) {
    if (!nestedObj || nestedObj === artigoObj) {
        return '';
    }
    
    let collectedText = '';
    
    // Adiciona texto apenas se não for o artigo principal
    if (nestedObj.texto) {
        const textoExtraido = extrairTexto(nestedObj);
        if (textoExtraido) {
            collectedText += ' ' + textoExtraido;
        }
    }
    
    // Processa recursivamente TODOS os tipos de elementos aninhados
    // Inclui incisos, parágrafos, alíneas e qualquer outro tipo aninhado
    const nestedTypes = ['incisos', 'paragrafos', 'alineas', 'subalineas', 'itens'];
    for (const type of nestedTypes) {
        if (nestedObj[type] && typeof nestedObj[type] === 'object') {
            for (const key in nestedObj[type]) {
                const nestedItem = nestedObj[type][key];
                if (nestedItem) {
                    collectedText += appendNestedText(nestedItem, artigoObj);
                }
            }
        }
    }
    
    // Processa recursivamente qualquer propriedade que seja um objeto com estrutura similar
    // Isso garante que não perdemos nenhum conteúdo aninhado
    for (const key in nestedObj) {
        if (key !== 'texto' && nestedObj[key] && typeof nestedObj[key] === 'object' && !Array.isArray(nestedObj[key])) {
            // Se é um objeto e não está na lista de tipos conhecidos, tenta processar
            if (!nestedTypes.includes(key)) {
                const subObj = nestedObj[key];
                // Verifica se tem estrutura similar (tem texto ou outros objetos aninhados)
                if (subObj.texto || Object.keys(subObj).some(k => typeof subObj[k] === 'object')) {
                    collectedText += appendNestedText(subObj, artigoObj);
                }
            }
        }
    }
    
    return collectedText;
}

/**
 * Processa o JSON da constituição e retorna um array plano de artigos
 * otimizado para busca
 * @param {object} data - Dados brutos da constituição
 * @returns {Array} Array de artigos processados
 */
function processarConstituicao(data) {
    if (!data || !data.titulos || typeof data.titulos !== 'object') {
        console.warn('Dados da constituição inválidos ou vazios');
        return [];
    }
    
    const artigosPlanos = [];
    let idContador = 1;

    for (const tituloKey in data.titulos) {
        const tituloObj = data.titulos[tituloKey];
        if (!tituloObj) continue;
        
        const tituloTexto = extrairTexto(tituloObj);
        const blocosArtigos = [];

        // Coleta capítulos e seções
        if (tituloObj.capitulos && typeof tituloObj.capitulos === 'object') {
            for (const capituloKey in tituloObj.capitulos) {
                const capituloObj = tituloObj.capitulos[capituloKey];
                if (capituloObj) {
                    blocosArtigos.push(capituloObj);
                    
                    // Adiciona seções se existirem
                    if (capituloObj.secoes && typeof capituloObj.secoes === 'object') {
                        for (const secaoKey in capituloObj.secoes) {
                            const secaoObj = capituloObj.secoes[secaoKey];
                            if (secaoObj) {
                                blocosArtigos.push(secaoObj);
                            }
                        }
                    }
                }
            }
        } else {
            blocosArtigos.push(tituloObj);
        }

        // Processa artigos de cada bloco
        for (const bloco of blocosArtigos) {
            if (!bloco) continue;
            
            const capituloTexto = extrairTexto(bloco); 
            const artigos = bloco.artigos || {};

            for (const artigoKey in artigos) {
                const artigoObj = artigos[artigoKey];
                if (!artigoObj) continue;
                
                const artigoTextoPrincipal = extrairTexto(artigoObj);
                const artigoNumero = artigoObj.numero && Array.isArray(artigoObj.numero) 
                    ? artigoObj.numero[0] 
                    : `Art. ${artigoKey}`; 

                // Coleta texto aninhado (incisos, parágrafos, alíneas)
                // Processa recursivamente todos os elementos aninhados do artigo
                let nestedText = '';
                const nestedTypes = ['incisos', 'paragrafos', 'alineas'];
                for (const type of nestedTypes) {
                    if (artigoObj[type] && typeof artigoObj[type] === 'object') {
                        for (const key in artigoObj[type]) {
                            nestedText += appendNestedText(artigoObj[type][key], artigoObj);
                        }
                    }
                }
                
                // Combina texto principal com texto aninhado, normalizando espaços
                const textoCompleto = (artigoTextoPrincipal + nestedText)
                    .trim()
                    .replace(/\s+/g, ' ');

                // Extrai título e capítulo sem prefixo (ex: "Título I: Dos Direitos" -> "Dos Direitos")
                const tituloLimpo = tituloTexto.includes(': ') 
                    ? tituloTexto.split(': ').slice(1).join(': ') 
                    : tituloTexto;
                    
                const capituloLimpo = capituloTexto.includes(': ') 
                    ? capituloTexto.split(': ').slice(1).join(': ') 
                    : capituloTexto;

                artigosPlanos.push({
                    id: idContador++,
                    titulo_estrutura: tituloLimpo || tituloTexto, 
                    capitulo_estrutura: capituloLimpo || capituloTexto, 
                    artigo_numero: artigoNumero,
                    texto_caput: artigoTextoPrincipal,
                    texto_completo: textoCompleto,
                });
            }
        }
    }
    
    return artigosPlanos;
}

const dadosConstituicaoProcessados = processarConstituicao(dataConstituicao);

export default dadosConstituicaoProcessados;