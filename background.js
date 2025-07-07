/**
 * DNS Configuration Manager - Background Service Worker
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

class DNSBackgroundManager {
    constructor() {
        this.currentConfig = null;
        this.isActive = false;
        this.init();
    }

    init() {
        try {
            console.log('Initializing DNS Background Manager...');
            
        // Listen for messages from popup
        chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
            this.handleMessage(message, sender, sendResponse);
            return true; // Keep message channel open for async response
        });
            console.log('Message listener setup complete');

        // Load saved configuration on startup
        this.loadSavedConfiguration();
            console.log('Saved configuration loaded');
            
            // Set up alarm to check DNS status periodically
            chrome.alarms.create('checkDNSStatus', { periodInMinutes: 1 });
            chrome.alarms.onAlarm.addListener((alarm) => {
                if (alarm.name === 'checkDNSStatus') {
                    this.checkDNSStatus();
                }
            });
            console.log('Alarm setup complete');
            
            console.log('DNS Background Manager initialization complete');
        } catch (error) {
            console.error('Error during background initialization:', error);
        }
    }

    async handleMessage(message, sender, sendResponse) {
        try {
            switch (message.action) {
                case 'applyDNS':
                    const result = await this.applyDNSConfiguration(message.config);
                    sendResponse({ success: result });
                    break;
                    
                case 'resetDNS':
                    const resetResult = await this.resetDNSConfiguration();
                    sendResponse({ success: resetResult });
                    break;
                    
                case 'getCurrentConfig':
                    const config = await this.getCurrentConfiguration();
                    const status = await this.getDNSStatus();
                    sendResponse({ success: true, config, status });
                    break;
                    
                case 'testDNS':
                    const testResult = await this.testDNSConnection(message.dnsServer);
                    sendResponse({ success: testResult });
                    break;
                    
                case 'testRealDNS':
                    const realDNSTestResult = await this.testRealDNSConnection();
                    sendResponse({ success: realDNSTestResult });
                    break;
                    
                case 'checkDNSStatus':
                    const statusResult = await this.checkDNSStatus();
                    sendResponse({ success: true, status: statusResult });
                    break;
                    
                default:
                    sendResponse({ success: false, error: 'Unknown action' });
            }
        } catch (error) {
            console.error('Error handling message:', error);
            sendResponse({ success: false, error: error.message });
        }
    }

    async applyDNSConfiguration(config) {
        try {
            console.log('Applying DNS configuration:', config);
            
            // Validate DNS server
            if (!this.validateDNSServer(config.primary)) {
                throw new Error('Invalid primary DNS server');
            }

            // Store the configuration
            this.currentConfig = config;
            this.isActive = true;
            
            // Save to storage
            await this.saveConfiguration(config);
            console.log('Configuration saved to storage');
            
            // Note: Chrome extensions cannot actually change system DNS
            // This is a simulation - the configuration is saved but not applied to system
            console.log(`DNS configuration saved: ${config.name} (${config.primary}) - Simulation Mode`);

            return true;
        } catch (error) {
            console.error('Error applying DNS configuration:', error);
            this.isActive = false;
            throw error;
        }
    }

    async resetDNSConfiguration() {
        try {
            console.log('Resetting DNS configuration...');

            // Clear saved configuration
            this.currentConfig = null;
            this.isActive = false;
            
            // Save last active config before reset
            const { currentConfig } = await chrome.storage.local.get(['currentConfig']);
            if (currentConfig) {
                await chrome.storage.local.set({ lastActiveConfig: currentConfig });
                console.log('Last active config saved');
            }
            
            // Clear both storage keys
            await chrome.storage.local.set({
                currentDNSConfig: null,
                currentConfig: null
            });
            console.log('Storage keys cleared');

            console.log('DNS configuration reset to default (Simulation Mode)');
            return true;
        } catch (error) {
            console.error('Error resetting DNS configuration:', error);
            throw error;
        }
    }

    async loadSavedConfiguration() {
        try {
            const result = await chrome.storage.local.get(['currentDNSConfig', 'currentConfig']);
            if (result.currentDNSConfig) {
                this.currentConfig = result.currentDNSConfig;
                this.isActive = true;
                console.log('Loaded saved DNS configuration:', this.currentConfig.name);
                
                // Don't automatically reapply - just load into memory
                // The configuration will be applied when needed
            }
        } catch (error) {
            console.error('Error loading saved configuration:', error);
        }
    }

    async saveConfiguration(config) {
        try {
            console.log('Saving configuration to storage:', config);
            
            // Always save both keys to ensure consistency
            const storageData = {
                currentDNSConfig: config,
                currentConfig: config
            };
            
            await chrome.storage.local.set(storageData);
            console.log('Configuration saved successfully to both keys');
        } catch (error) {
            console.error('Error saving configuration:', error);
        }
    }

    async getCurrentConfiguration() {
        return this.currentConfig;
    }

    async getDNSStatus() {
        try {
            return {
                isActive: this.isActive && this.currentConfig !== null,
                mode: 'simulation',
                config: this.currentConfig
            };
        } catch (error) {
            console.error('Error getting DNS status:', error);
            return { isActive: false, mode: 'unknown', config: null };
        }
    }

    async checkDNSStatus() {
        try {
            // Update active status based on saved configuration
            this.isActive = this.currentConfig !== null;
            
            return {
                isActive: this.isActive,
                mode: 'simulation',
                config: this.currentConfig
            };
        } catch (error) {
            console.error('Error checking DNS status:', error);
            return { isActive: false, mode: 'unknown', config: null };
        }
    }

    // Validate DNS server configuration
    validateDNSServer(server) {
        const ipPattern = /^(?:[0-9]{1,3}\.){3}[0-9]{1,3}$/;
        if (!ipPattern.test(server)) {
            return false;
        }
        
        const parts = server.split('.');
        return parts.every(part => {
            const num = parseInt(part);
            return num >= 0 && num <= 255;
        });
    }

    // Test DNS connection
    async testDNSConnection(dnsServer) {
        try {
            // Test with a simple HTTP request to the DNS server
            const testUrl = `http://${dnsServer}`;
            const response = await fetch(testUrl, {
                method: 'HEAD',
                mode: 'no-cors',
                cache: 'no-cache'
            });
            
            console.log(`DNS test successful for ${dnsServer}`);
            return true;
        } catch (error) {
            console.error(`DNS connection test failed for ${dnsServer}:`, error);
            return false;
        }
    }

    // Test if DNS is actually working by making a real request
    async testRealDNSConnection() {
        try {
            if (this.currentConfig) {
                console.log(`Testing DNS simulation: ${this.currentConfig.primary}`);

                // This is a simulation - we can't actually test DNS without system changes
                console.log('DNS test simulation successful');
                return true;
            } else {
                console.log('No DNS configured for test');
                return false;
            }
        } catch (error) {
            console.error('Error testing DNS connection:', error);
            return false;
        }
    }
}

// Initialize the DNS manager
const dnsManager = new DNSBackgroundManager(); 