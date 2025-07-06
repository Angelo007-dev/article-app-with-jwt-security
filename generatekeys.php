<?php
require __DIR__ . '/vendor/autoload.php';

use phpseclib3\Crypt\RSA;

$passphrase = 'angelo123456-dev'; // Change cette passphrase

// Générer une nouvelle paire de clés RSA 4096 bits
$key = RSA::createKey(4096);

// Exporter la clé privée avec passphrase
$privateKey = $key->withPassword($passphrase)->toString('PKCS8');

// Exporter la clé publique
$publicKey = $key->getPublicKey()->toString('PKCS8');

// Chemins pour enregistrer les clés
$privateKeyPath = __DIR__ . '/config/jwt/private.pem';
$publicKeyPath = __DIR__ . '/config/jwt/public.pem';

// Sauvegarder dans les fichiers
file_put_contents($privateKeyPath, $privateKey);
file_put_contents($publicKeyPath, $publicKey);

echo "Clés générées avec succès dans config/jwt/\n";
