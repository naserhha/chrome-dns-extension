/**
 * Extension Test Script
 * 
 * This script tests the basic functionality of the DNS extension
 */

console.log('Testing DNS Extension...');

// Test 1: Check if all required files exist
const requiredFiles = [
    'manifest.json',
    'background.js',
    'popup.html',
    'popup.js',
    'popup.css',
    'js/i18n.js',
    'locales/en.json',
    'locales/fa.json',
    'locales/ar.json',
    'locales/zh.json'
];

console.log('Checking required files...');
requiredFiles.forEach(file => {
    try {
        const fs = require('fs');
        if (fs.existsSync(file)) {
            console.log(`✅ ${file} exists`);
        } else {
            console.log(`❌ ${file} missing`);
        }
    } catch (error) {
        console.log(`❌ Error checking ${file}:`, error.message);
    }
});

// Test 2: Validate manifest.json
console.log('\nValidating manifest.json...');
try {
    const fs = require('fs');
    const manifest = JSON.parse(fs.readFileSync('manifest.json', 'utf8'));
    
    const requiredManifestFields = [
        'manifest_version',
        'name',
        'version',
        'description',
        'permissions',
        'background',
        'action'
    ];
    
    requiredManifestFields.forEach(field => {
        if (manifest[field]) {
            console.log(`✅ ${field} present in manifest`);
        } else {
            console.log(`❌ ${field} missing from manifest`);
        }
    });
    
    // Check permissions
    const requiredPermissions = ['proxy', 'storage', 'alarms'];
    requiredPermissions.forEach(permission => {
        if (manifest.permissions && manifest.permissions.includes(permission)) {
            console.log(`✅ ${permission} permission present`);
        } else {
            console.log(`❌ ${permission} permission missing`);
        }
    });
    
} catch (error) {
    console.log('❌ Error validating manifest:', error.message);
}

// Test 3: Check for syntax errors in JS files
console.log('\nChecking JavaScript syntax...');
const jsFiles = ['background.js', 'popup.js', 'js/i18n.js'];

jsFiles.forEach(file => {
    try {
        const fs = require('fs');
        const code = fs.readFileSync(file, 'utf8');
        
        // Basic syntax check
        new Function(code);
        console.log(`✅ ${file} syntax is valid`);
    } catch (error) {
        console.log(`❌ ${file} has syntax errors:`, error.message);
    }
});

// Test 4: Check HTML structure
console.log('\nChecking HTML structure...');
try {
    const fs = require('fs');
    const html = fs.readFileSync('popup.html', 'utf8');
    
    // Check for required elements
    const requiredElements = [
        'statusIndicator',
        'currentDnsValue',
        'applyDNS',
        'resetDNS',
        'testDNS',
        'saveCustom'
    ];
    
    requiredElements.forEach(element => {
        if (html.includes(`id="${element}"`)) {
            console.log(`✅ Element ${element} found in HTML`);
        } else {
            console.log(`❌ Element ${element} missing from HTML`);
        }
    });
    
} catch (error) {
    console.log('❌ Error checking HTML:', error.message);
}

console.log('\nTest completed!'); 