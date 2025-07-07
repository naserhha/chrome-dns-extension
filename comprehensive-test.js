/**
 * Comprehensive Extension Test
 * 
 * This script tests all aspects of the DNS extension
 */

console.log('🔍 Starting Comprehensive DNS Extension Test...\n');

// Test 1: File Structure and Dependencies
console.log('📁 Test 1: File Structure and Dependencies');
const fs = require('fs');

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

let fileCheckPassed = true;
requiredFiles.forEach(file => {
    if (fs.existsSync(file)) {
        console.log(`  ✅ ${file}`);
    } else {
        console.log(`  ❌ ${file} - MISSING`);
        fileCheckPassed = false;
    }
});

console.log(`\nFile structure check: ${fileCheckPassed ? 'PASSED' : 'FAILED'}\n`);

// Test 2: Manifest Validation
console.log('📋 Test 2: Manifest Validation');
let manifestCheckPassed = true;
try {
    const manifest = JSON.parse(fs.readFileSync('manifest.json', 'utf8'));
    
    const manifestChecks = [
        { field: 'manifest_version', expected: 3 },
        { field: 'name', type: 'string' },
        { field: 'version', type: 'string' },
        { field: 'description', type: 'string' },
        { field: 'permissions', type: 'array' },
        { field: 'background', type: 'object' },
        { field: 'action', type: 'object' }
    ];
    
    manifestChecks.forEach(check => {
        const value = manifest[check.field];
        if (value) {
            if (check.expected && value !== check.expected) {
                console.log(`  ❌ ${check.field}: expected ${check.expected}, got ${value}`);
                manifestCheckPassed = false;
            } else {
                console.log(`  ✅ ${check.field}: ${value}`);
            }
        } else {
            console.log(`  ❌ ${check.field}: MISSING`);
            manifestCheckPassed = false;
        }
    });
    
    // Check permissions
    const requiredPermissions = ['proxy', 'storage', 'alarms'];
    requiredPermissions.forEach(permission => {
        if (manifest.permissions && manifest.permissions.includes(permission)) {
            console.log(`  ✅ Permission: ${permission}`);
        } else {
            console.log(`  ❌ Permission: ${permission} - MISSING`);
            manifestCheckPassed = false;
        }
    });
    
    console.log(`\nManifest validation: ${manifestCheckPassed ? 'PASSED' : 'FAILED'}\n`);
} catch (error) {
    console.log(`  ❌ Manifest validation failed: ${error.message}\n`);
    manifestCheckPassed = false;
}

// Test 3: JavaScript Syntax Validation
console.log('🔧 Test 3: JavaScript Syntax Validation');
const jsFiles = ['background.js', 'popup.js', 'js/i18n.js'];
let syntaxCheckPassed = true;

jsFiles.forEach(file => {
    try {
        const code = fs.readFileSync(file, 'utf8');
        new Function(code); // This will throw if there are syntax errors
        console.log(`  ✅ ${file}: Syntax valid`);
    } catch (error) {
        console.log(`  ❌ ${file}: Syntax error - ${error.message}`);
        syntaxCheckPassed = false;
    }
});

console.log(`\nJavaScript syntax check: ${syntaxCheckPassed ? 'PASSED' : 'FAILED'}\n`);

// Test 4: HTML Structure Validation
console.log('🌐 Test 4: HTML Structure Validation');
let htmlCheckPassed = true;
try {
    const html = fs.readFileSync('popup.html', 'utf8');
    
    const requiredElements = [
        'statusIndicator',
        'currentDnsValue',
        'applyDNS',
        'resetDNS',
        'testDNS',
        'saveCustom',
        'primaryDNS',
        'secondaryDNS',
        'dnsName'
    ];
    
    requiredElements.forEach(element => {
        if (html.includes(`id=\"${element}\"`)) {
            console.log(`  ✅ Element: ${element}`);
        } else {
            console.log(`  ❌ Element: ${element} - MISSING`);
            htmlCheckPassed = false;
        }
    });
    
    // Check for script includes
    const requiredScripts = ['js/i18n.js', 'popup.js'];
    requiredScripts.forEach(script => {
        if (html.includes(script)) {
            console.log(`  ✅ Script: ${script}`);
        } else {
            console.log(`  ❌ Script: ${script} - MISSING`);
            htmlCheckPassed = false;
        }
    });
    
    console.log(`\nHTML structure check: ${htmlCheckPassed ? 'PASSED' : 'FAILED'}\n`);
} catch (error) {
    console.log(`  ❌ HTML validation failed: ${error.message}\n`);
    htmlCheckPassed = false;
}

// Test 5: CSS Validation
console.log('🎨 Test 5: CSS Validation');
let cssCheckPassed = true;
try {
    const css = fs.readFileSync('popup.css', 'utf8');
    
    // Check for basic CSS structure
    const cssChecks = [
        { name: 'Container styles', pattern: /\.container/ },
        { name: 'Button styles', pattern: /\.btn/ },
        { name: 'Status indicator', pattern: /\.status-indicator/ },
        { name: 'Preset grid', pattern: /\.preset-grid/ }
    ];
    
    cssChecks.forEach(check => {
        if (check.pattern.test(css)) {
            console.log(`  ✅ ${check.name}`);
        } else {
            console.log(`  ❌ ${check.name} - MISSING`);
            cssCheckPassed = false;
        }
    });
    
    console.log(`\nCSS validation: ${cssCheckPassed ? 'PASSED' : 'FAILED'}\n`);
} catch (error) {
    console.log(`  ❌ CSS validation failed: ${error.message}\n`);
    cssCheckPassed = false;
}

// Test 6: Localization Files
console.log('🌍 Test 6: Localization Files');
const localeFiles = ['locales/en.json', 'locales/fa.json', 'locales/ar.json', 'locales/zh.json'];
let localeCheckPassed = true;

localeFiles.forEach(file => {
    try {
        const content = fs.readFileSync(file, 'utf8');
        const json = JSON.parse(content);
        
        // Check for basic structure
        if (json && typeof json === 'object') {
            console.log(`  ✅ ${file}: Valid JSON`);
        } else {
            console.log(`  ❌ ${file}: Invalid JSON structure`);
            localeCheckPassed = false;
        }
    } catch (error) {
        console.log(`  ❌ ${file}: ${error.message}`);
        localeCheckPassed = false;
    }
});

console.log(`\nLocalization check: ${localeCheckPassed ? 'PASSED' : 'FAILED'}\n`);

// Test 7: Code Quality Checks
console.log('🔍 Test 7: Code Quality Checks');

// Check for common issues
const backgroundCode = fs.readFileSync('background.js', 'utf8');
const popupCode = fs.readFileSync('popup.js', 'utf8');

const qualityChecks = [
    { name: 'Background script has error handling', pattern: /try\s*\{/g, file: backgroundCode },
    { name: 'Background script has console logging', pattern: /console\.log/g, file: backgroundCode },
    { name: 'Popup script has error handling', pattern: /try\s*\{/g, file: popupCode },
    { name: 'Popup script has async/await', pattern: /async\s+function/g, file: popupCode },
    { name: 'Popup script has event listeners', pattern: /addEventListener/g, file: popupCode }
];

let qualityCheckPassed = true;
qualityChecks.forEach(check => {
    const matches = check.file.match(check.pattern);
    if (matches && matches.length > 0) {
        console.log(`  ✅ ${check.name} (${matches.length} instances)`);
    } else {
        console.log(`  ❌ ${check.name} - MISSING`);
        qualityCheckPassed = false;
    }
});

console.log(`\nCode quality check: ${qualityCheckPassed ? 'PASSED' : 'FAILED'}\n`);

// Summary
console.log('📊 TEST SUMMARY');
console.log('================');
console.log(`File Structure: ${fileCheckPassed ? '✅ PASSED' : '❌ FAILED'}`);
console.log(`Manifest: ${manifestCheckPassed ? '✅ PASSED' : '❌ FAILED'}`);
console.log(`JavaScript Syntax: ${syntaxCheckPassed ? '✅ PASSED' : '❌ FAILED'}`);
console.log(`HTML Structure: ${htmlCheckPassed ? '✅ PASSED' : '❌ FAILED'}`);
console.log(`CSS Validation: ${cssCheckPassed ? '✅ PASSED' : '❌ FAILED'}`);
console.log(`Localization: ${localeCheckPassed ? '✅ PASSED' : '❌ FAILED'}`);
console.log(`Code Quality: ${qualityCheckPassed ? '✅ PASSED' : '❌ FAILED'}`);

const allPassed = fileCheckPassed && manifestCheckPassed && syntaxCheckPassed && 
                  htmlCheckPassed && cssCheckPassed && localeCheckPassed && qualityCheckPassed;

console.log(`\n🎯 OVERALL RESULT: ${allPassed ? '✅ ALL TESTS PASSED' : '❌ SOME TESTS FAILED'}`);

if (allPassed) {
    console.log('\n🎉 The extension is ready for testing in Chrome!');
    console.log('📝 To test:');
    console.log('   1. Open Chrome and go to chrome://extensions/');
    console.log('   2. Enable Developer mode');
    console.log('   3. Click "Load unpacked" and select this folder');
    console.log('   4. Click the extension icon to test functionality');
} else {
    console.log('\n⚠️  Please fix the failed tests before testing in Chrome.');
} 