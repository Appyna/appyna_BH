const fs = require('fs');

// Créer un HTML qui contient le SVG
const svgContent = fs.readFileSync('./public/logo-appyna.svg', 'utf8');

const html = `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <style>
        body {
            margin: 0;
            padding: 50px;
            background: white;
            display: flex;
            justify-content: center;
            align-items: center;
        }
    </style>
</head>
<body>
    ${svgContent}
</body>
</html>
`;

fs.writeFileSync('./public/logo-preview.html', html);
console.log('Fichier HTML créé: public/logo-preview.html');
console.log('Ouvrez ce fichier dans votre navigateur, puis faites un clic droit > Enregistrer l\'image');
