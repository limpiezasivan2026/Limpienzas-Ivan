// build.js — Script de construcción
const fs = require('fs');
const path = require('path');
const { minify } = require('html-minifier-terser');

const DIST = path.join(__dirname, 'dist');

// Crear carpeta dist
if (!fs.existsSync(DIST)) fs.mkdirSync(DIST, { recursive: true });

// 1. Minificar HTML
async function minificarHTML() {
    const html = fs.readFileSync('index.html', 'utf8');
    const minificado = await minify(html, {
        collapseWhitespace: true,
        removeComments: true,
        minifyCSS: true,
        minifyJS: true,
        removeAttributeQuotes: true
    });
    fs.writeFileSync(path.join(DIST, 'index.html'), minificado);
    console.log('✅ HTML minificado');
}

// 2. Minificar CSS
function minificarCSS() {
    let css = fs.readFileSync('styles.css', 'utf8');
    css = css
        .replace(/\/\*[\s\S]*?\*\//g, '')      // Quitar comentarios
        .replace(/\s+/g, ' ')                   // Quitar espacios múltiples
        .replace(/\s*([{}:;,])\s*/g, '$1')      // Quitar espacios alrededor de símbolos
        .replace(/;}/g, '}')                    // Quitar último ;
        .trim();
    fs.writeFileSync(path.join(DIST, 'styles.css'), css);
    console.log('✅ CSS minificado');
}

// 3. Minificar JS
function minificarJS() {
    let js = fs.readFileSync('script.js', 'utf8');
    js = js
        .replace(/\/\*[\s\S]*?\*\//g, '')      // Quitar comentarios
        .replace(/\/\/.*$/gm, '')               // Quitar comentarios de línea
        .replace(/\s+/g, ' ')                   // Quitar espacios múltiples
        .replace(/\s*([{}:;,=+\-*\/<>])\s*/g, '$1') // Quitar espacios alrededor de símbolos
        .trim();
    fs.writeFileSync(path.join(DIST, 'script.js'), js);
    console.log('✅ JS minificado');
}

// 4. Copiar assets (imágenes ya comprimidas)
function copiarAssets() {
    const origen = path.join(__dirname, 'assets');
    const destino = path.join(DIST, 'assets');
    
    if (!fs.existsSync(origen)) {
        console.log('⚠️ No hay carpeta assets/ para copiar');
        return;
    }
    
    // Copiar recursivamente
    function copiarRecursivo(src, dest) {
        if (!fs.existsSync(dest)) fs.mkdirSync(dest, { recursive: true });
        
        fs.readdirSync(src).forEach(item => {
            const srcPath = path.join(src, item);
            const destPath = path.join(dest, item);
            
            if (fs.statSync(srcPath).isDirectory()) {
                copiarRecursivo(srcPath, destPath);
            } else {
                fs.copyFileSync(srcPath, destPath);
            }
        });
    }
    
    copiarRecursivo(origen, destino);
    console.log('✅ Assets copiados');
}

// Ejecutar todo
(async () => {
    console.log('🏗️ Construyendo versión de producción...\n');
    await minificarHTML();
    minificarCSS();
    minificarJS();
    copiarAssets();
    console.log('\n✨ Versión de producción lista en dist/');
})();