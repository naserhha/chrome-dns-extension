/**
 * Internationalization (i18n) Manager
 * 
 * 🔒 Custom License – NonCommercial Attribution by Mohammad Nasser Haji Hashemabad
 * Copyright (c) 2025 Mohammad Nasser Haji Hashemabad
 * 
 * This source code is provided for personal, educational, and non-commercial use only.
 * You are allowed to use, study, and modify the code for personal and educational purposes.
 * You are NOT allowed to sell, license, or monetize this project.
 * 
 * Attribution required: Mohammad Nasser Haji Hashemabad
 * Website: https://mohammadnasser.com
 * Email: info@mohammadnasser.com
 * 
 * For commercial licensing, contact: info@mohammadnasser.com
 * 
 * Author: Mohammad Nasser Haji Hashemabad
 */

class I18nManager {
    constructor() {
        this.currentLanguage = 'en'; // Default language
        this.translations = {};
        this.init();
    }

    async init() {
        // Load saved language preference
        const { language } = await chrome.storage.local.get(['language']);
        if (language) {
            this.currentLanguage = language;
        }
        
        // Load translations
        await this.loadTranslations();
        
        // Apply current language
        this.applyLanguage();
    }

    async loadTranslations() {
        try {
            // Load English translations
            const enResponse = await fetch(chrome.runtime.getURL('locales/en.json'));
            if (!enResponse.ok) {
                throw new Error(`Failed to load English translations: ${enResponse.status}`);
            }
            this.translations.en = await enResponse.json();
            
            // Load Persian translations
            const faResponse = await fetch(chrome.runtime.getURL('locales/fa.json'));
            if (!faResponse.ok) {
                throw new Error(`Failed to load Persian translations: ${faResponse.status}`);
            }
            this.translations.fa = await faResponse.json();
            
            // Load Arabic translations
            const arResponse = await fetch(chrome.runtime.getURL('locales/ar.json'));
            if (!arResponse.ok) {
                throw new Error(`Failed to load Arabic translations: ${arResponse.status}`);
            }
            this.translations.ar = await arResponse.json();
            
            // Load Chinese translations
            const zhResponse = await fetch(chrome.runtime.getURL('locales/zh.json'));
            if (!zhResponse.ok) {
                throw new Error(`Failed to load Chinese translations: ${zhResponse.status}`);
            }
            this.translations.zh = await zhResponse.json();
            
            console.log('All translations loaded successfully');
        } catch (error) {
            console.error('Error loading translations:', error);
            // Fallback to English only
            this.translations = {
                en: {
                    "extension": {
                        "name": "DNS Configuration Manager",
                        "description": "Smart DNS settings for Chrome browser"
                    },
                    "popup": {
                        "title": "DNS Settings",
                        "dnsToggle": {
                            "enabled": "DNS is enabled",
                            "disabled": "DNS is disabled"
                        },
                        "openInTab": "Open in new tab",
                        "status": {
                            "default": "Default DNS",
                            "connected": "Connected DNS:",
                            "noConnection": "No DNS connected",
                            "disabled": "DNS disabled"
                        }
                    },
                    "dns": {
                        "presets": {
                            "title": "Ready DNS",
                            "google": {
                                "name": "Google DNS",
                                "servers": "8.8.8.8, 8.8.4.4"
                            },
                            "cloudflare": {
                                "name": "Cloudflare",
                                "servers": "1.1.1.1, 1.0.0.1"
                            },
                            "opendns": {
                                "name": "Open DNS",
                                "servers": "208.67.222.222, 208.67.220.220"
                            },
                            "quad9": {
                                "name": "Quad 9",
                                "servers": "9.9.9.9, 149.112.112.112"
                            }
                        },
                        "custom": {
                            "title": "Custom DNS Settings",
                            "primary": "Primary DNS Server:",
                            "secondary": "Secondary DNS Server:",
                            "name": "Settings Name:",
                            "primaryPlaceholder": "Example: 8.8.8.8",
                            "secondaryPlaceholder": "Example: 8.8.4.4",
                            "namePlaceholder": "My Custom DNS",
                            "saveButton": "Save Custom DNS"
                        },
                        "saved": {
                            "title": "Saved Settings",
                            "noSettings": "No settings saved",
                            "apply": "Apply",
                            "delete": "Delete"
                        },
                        "actions": {
                            "apply": "Apply DNS",
                            "reset": "Reset to Default"
                        }
                    },
                    "notifications": {
                        "errors": {
                            "primaryRequired": "Please enter primary DNS server and settings name",
                            "invalidIP": "Please enter valid IP addresses",
                            "noConfig": "Please select a DNS configuration first",
                            "noSettings": "No DNS settings available for activation. Please select a DNS first."
                        },
                        "success": {
                            "customSaved": "Custom DNS settings saved successfully!",
                            "dnsApplied": "DNS settings applied",
                            "settingsDeleted": "Settings deleted successfully",
                            "resetDefault": "Reset to default DNS settings"
                        }
                    },
                    "info": {
                        "note": "Note: This extension uses Chrome's proxy API to configure DNS. Changes apply to all browser traffic."
                    },
                    "links": {
                        "developer": "About Developer",
                        "github": "GitHub",
                        "privacy": "Privacy Policy",
                        "terms": "Terms of Service"
                    }
                }
            };
        }
    }

    getText(key) {
        const keys = key.split('.');
        let value = this.translations[this.currentLanguage];
        
        for (const k of keys) {
            if (value && value[k]) {
                value = value[k];
            } else {
                // Fallback to English
                value = this.translations.en;
                for (const fallbackKey of keys) {
                    if (value && value[fallbackKey]) {
                        value = value[fallbackKey];
                    } else {
                        return key; // Return key if translation not found
                    }
                }
                break;
            }
        }
        
        return value || key;
    }

    async setLanguage(language) {
        try {
            // Validate language
            const validLanguages = ['en', 'fa', 'ar', 'zh'];
            if (!validLanguages.includes(language)) {
                throw new Error(`Invalid language: ${language}`);
            }
            
            // Check if translations are loaded
            if (!this.translations[language]) {
                throw new Error(`Translations for language ${language} not loaded`);
            }
            
            this.currentLanguage = language;
            await chrome.storage.local.set({ language });
            this.applyLanguage();
            
            console.log(`Language changed to: ${language}`);
        } catch (error) {
            console.error('Error setting language:', error);
            // Fallback to English
            this.currentLanguage = 'en';
            await chrome.storage.local.set({ language: 'en' });
            this.applyLanguage();
            throw error;
        }
    }

    applyLanguage() {
        // Update HTML lang attribute
        document.documentElement.lang = this.currentLanguage;
        
        // Set RTL for Arabic and Persian
        const rtlLanguages = ['fa', 'ar'];
        document.documentElement.dir = rtlLanguages.includes(this.currentLanguage) ? 'rtl' : 'ltr';
        
        // Update all translatable elements
        this.updateElements();
    }

    updateElements() {
        // Update title
        document.title = this.getText('popup.title');
        
        // Update DNS toggle label
        const dnsToggleLabel = document.getElementById('dnsToggleLabel');
        if (dnsToggleLabel) {
            const isEnabled = document.getElementById('dnsToggle')?.checked;
            dnsToggleLabel.textContent = this.getText(`popup.dnsToggle.${isEnabled ? 'enabled' : 'disabled'}`);
        }
        
        // Update open in tab button
        const openInTabBtn = document.getElementById('openInTab');
        if (openInTabBtn) {
            openInTabBtn.textContent = this.getText('popup.openInTab');
        }
        
        // Update header title
        const headerTitle = document.querySelector('header h1');
        if (headerTitle) {
            headerTitle.textContent = this.getText('popup.title');
        }
        
        // Update status text
        const statusText = document.querySelector('.status-text');
        if (statusText) {
            statusText.textContent = this.getText('popup.status.default');
        }
        
        // Update current DNS bar
        const currentDnsTitle = document.querySelector('.current-dns-title');
        if (currentDnsTitle) {
            currentDnsTitle.textContent = this.getText('popup.status.connected');
        }
        
        // Update current IP bar
        const currentIpTitle = document.querySelector('.current-ip-title');
        if (currentIpTitle) {
            currentIpTitle.textContent = this.getText('popup.ip.title');
        }
        
        // Update section titles
        const presetTitle = document.querySelector('.dns-presets h3');
        if (presetTitle) {
            presetTitle.textContent = this.getText('dns.presets.title');
        }
        
        const customTitle = document.querySelector('.custom-dns h3');
        if (customTitle) {
            customTitle.textContent = this.getText('dns.custom.title');
        }
        
        const savedTitle = document.querySelector('.saved-configs h3');
        if (savedTitle) {
            savedTitle.textContent = this.getText('dns.saved.title');
        }
        
        // Update form labels
        const primaryLabel = document.querySelector('label[for="primaryDNS"]');
        if (primaryLabel) {
            primaryLabel.textContent = this.getText('dns.custom.primary');
        }
        
        const secondaryLabel = document.querySelector('label[for="secondaryDNS"]');
        if (secondaryLabel) {
            secondaryLabel.textContent = this.getText('dns.custom.secondary');
        }
        
        const nameLabel = document.querySelector('label[for="dnsName"]');
        if (nameLabel) {
            nameLabel.textContent = this.getText('dns.custom.name');
        }
        
        // Update placeholders
        const primaryInput = document.getElementById('primaryDNS');
        if (primaryInput) {
            primaryInput.placeholder = this.getText('dns.custom.primaryPlaceholder');
        }
        
        const secondaryInput = document.getElementById('secondaryDNS');
        if (secondaryInput) {
            secondaryInput.placeholder = this.getText('dns.custom.secondaryPlaceholder');
        }
        
        const nameInput = document.getElementById('dnsName');
        if (nameInput) {
            nameInput.placeholder = this.getText('dns.custom.namePlaceholder');
        }
        
        // Update buttons
        const saveCustomBtn = document.getElementById('saveCustom');
        if (saveCustomBtn) {
            saveCustomBtn.textContent = this.getText('dns.custom.saveButton');
        }
        
        const applyDnsBtn = document.getElementById('applyDNS');
        if (applyDnsBtn) {
            applyDnsBtn.textContent = this.getText('dns.actions.apply');
        }
        
        const resetDnsBtn = document.getElementById('resetDNS');
        if (resetDnsBtn) {
            resetDnsBtn.textContent = this.getText('dns.actions.reset');
        }
        
        // Update info text
        const infoText = document.querySelector('.info p');
        if (infoText) {
            infoText.innerHTML = `<strong>${this.getText('info.note')}</strong>`;
        }
        
        // Update links
        const developerLink = document.querySelector('.btn-link[href*="mohammadnasser.com"]');
        if (developerLink) {
            const textSpan = developerLink.querySelector('span:last-child');
            if (textSpan) {
                textSpan.textContent = this.getText('links.developer');
            }
        }
        
        const githubLink = document.querySelector('.btn-link[href*="github.com"]');
        if (githubLink) {
            const textSpan = githubLink.querySelector('span:last-child');
            if (textSpan) {
                textSpan.textContent = this.getText('links.github');
            }
        }
        
        const privacyLink = document.querySelector('.btn-link[href="privacy-policy.html"]');
        if (privacyLink) {
            const textSpan = privacyLink.querySelector('span:last-child');
            if (textSpan) {
                textSpan.textContent = this.getText('links.privacy');
            }
        }
        
        const termsLink = document.querySelector('.btn-link[href="terms-of-service.html"]');
        if (termsLink) {
            const textSpan = termsLink.querySelector('span:last-child');
            if (textSpan) {
                textSpan.textContent = this.getText('links.terms');
            }
        }
        
        // Update DNS presets
        this.updateDNSPresets();

        // Update Chrome settings copy button
        const chromeSettingsBtn = document.getElementById('openChromeSettings');
        if (chromeSettingsBtn) {
            chromeSettingsBtn.textContent = this.getText('chromeSettings.copyButton');
        }
    }

    updateDNSPresets() {
        const presetButtons = document.querySelectorAll('.preset-btn');
        
        presetButtons.forEach(btn => {
            const presetType = btn.dataset.preset;
            if (presetType) {
                const nameElement = btn.querySelector('.preset-name');
                const serversElement = btn.querySelector('.preset-servers');
                
                if (nameElement) {
                    nameElement.textContent = this.getText(`dns.presets.${presetType}.name`);
                }
                
                if (serversElement) {
                    serversElement.textContent = this.getText(`dns.presets.${presetType}.servers`);
                }
            }
        });
    }

    // Get current language
    getCurrentLanguage() {
        return this.currentLanguage;
    }

    // Get available languages
    getAvailableLanguages() {
        return Object.keys(this.translations);
    }

    // Check if language is RTL
    isRTL() {
        const rtlLanguages = ['fa', 'ar'];
        return rtlLanguages.includes(this.currentLanguage);
    }

    // Check if translations are loaded
    isReady() {
        return this.translations && Object.keys(this.translations).length > 0;
    }

    // Get translation status
    getTranslationStatus() {
        return {
            isReady: this.isReady(),
            loadedLanguages: Object.keys(this.translations || {}),
            currentLanguage: this.currentLanguage
        };
    }
}

// Create global i18n instance
window.i18n = new I18nManager(); 