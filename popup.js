/**
 * DNS Configuration Manager - Popup Script
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

class DNSManager {
    constructor() {
        this.currentConfig = null;
        this.savedConfigs = [];
        this.readyDnsPresets = [];
        this.init();
    }

    async init() {
        try {
            console.log('Initializing DNS Manager...');
            
            // Wait for i18n to be ready first
            await this.waitForI18n();
            console.log('i18n system ready');
            
            // Load saved configurations
        await this.loadSavedConfigs();
            console.log('Saved configs loaded');
            
            // Load current DNS configuration from storage
            await this.loadCurrentConfigFromStorage();
            console.log('Current config loaded from storage');
            
            // Setup event listeners
        this.setupEventListeners();
            console.log('Event listeners setup complete');
            
            // Update status and render
            await this.updateStatus();
        this.renderSavedConfigs();
            this.highlightActivePreset();
            console.log('Status updated and configs rendered');
            
            // Load custom DNS presets after saved configs are loaded
            setTimeout(() => {
                this.loadCustomDNSPresets();
                console.log('Custom DNS presets loaded');
            }, 100);
            
            // Update UI elements
            this.updateDNSPresetsVisibility();
            this.highlightActiveLanguage();
            console.log('UI elements updated');
            
            // Set initial privacy policy and terms of service links
            const currentLang = window.i18n ? window.i18n.getCurrentLanguage() : 'en';
            this.updatePrivacyPolicyLink(currentLang);
            this.updateTermsOfServiceLink(currentLang);
            console.log('Privacy and terms links updated');
            
            // Update the current DNS bar after initialization
            updateCurrentDnsBar();
            console.log('DNS bar updated');
            
            this.updateCopyDnsLabels();
            
            console.log('DNS Manager initialization complete');

            await this.loadReadyDnsPresets();
            this.renderReadyDnsPresets();
        } catch (error) {
            console.error('Error during initialization:', error);
        }
    }

    async waitForI18n() {
        let attempts = 0;
        const maxAttempts = 50; // 5 seconds max
        
        while (attempts < maxAttempts) {
            if (window.i18n && window.i18n.isReady()) {
                console.log('i18n is ready');
                return;
            }
            await new Promise(resolve => setTimeout(resolve, 100));
            attempts++;
        }
        
        console.warn('i18n not ready after 5 seconds');
    }

    updatePrivacyPolicyLink(language) {
        const privacyLink = document.getElementById('privacyPolicyLink');
        if (privacyLink) {
            // Map language codes to direct file names
            const languageFileMap = {
                'en': 'privacy-policy.html',
                'fa': 'privacy-policy-fa.html',
                'ar': 'privacy-policy-ar.html',
                'zh': 'privacy-policy-zh.html'
            };
            
            const fileName = languageFileMap[language] || 'privacy-policy.html';
            privacyLink.href = fileName;
        }
    }

    updateTermsOfServiceLink(language) {
        const termsLink = document.getElementById('termsOfServiceLink');
        if (termsLink) {
            // Map language codes to direct file names
            const languageFileMap = {
                'en': 'terms-of-service.html',
                'fa': 'terms-of-service-fa.html',
                'ar': 'terms-of-service-ar.html',
                'zh': 'terms-of-service-zh.html'
            };
            
            const fileName = languageFileMap[language] || 'terms-of-service.html';
            termsLink.href = fileName;
        }
    }

    setupEventListeners() {
        // Preset DNS buttons
        document.querySelectorAll('.preset-btn').forEach(btn => {
            btn.addEventListener('click', async (e) => {
                await this.selectPreset(e.target.closest('.preset-btn'));
            });
        });

        // Add event listeners for built-in copy buttons
        document.querySelectorAll('.preset-btn .copy-dns-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const dns = btn.getAttribute('data-dns');
                const [primary, secondary] = dns.split(',');
                this.copyDnsToClipboardCustom(primary, secondary);
            });
        });

        // Add event listeners for built-in copy labels
        document.querySelectorAll('.preset-btn .copy-dns-label').forEach(label => {
            label.addEventListener('click', (e) => {
                e.stopPropagation();
                const btn = label.closest('.preset-btn').querySelector('.copy-dns-btn');
                if (btn) {
                    const dns = btn.getAttribute('data-dns');
                    const [primary, secondary] = dns.split(',');
                    this.copyDnsToClipboardCustom(primary, secondary);
                }
            });
        });

        // Custom DNS save button
        document.getElementById('saveCustom').addEventListener('click', () => {
            this.saveCustomDNS();
        });

        document.getElementById('cancelEdit').addEventListener('click', () => {
            this.cancelEdit();
        });

        // Apply DNS button
        document.getElementById('applyDNS').addEventListener('click', () => {
            this.applyCurrentDNS();
        });

        // Test DNS connection button (if exists)
        const testDNSBtn = document.getElementById('testDNS');
        if (testDNSBtn) {
            testDNSBtn.addEventListener('click', () => {
                this.testDNSConnection();
            });
        }

        // Reset DNS button
        document.getElementById('resetDNS').addEventListener('click', () => {
            this.resetToDefault();
        });

        // Refresh DNS status button
        document.getElementById('refreshDNS').addEventListener('click', () => {
            this.refreshDNSStatus();
        });

        // Check DNS connection button
        document.getElementById('checkDNS').addEventListener('click', () => {
            this.checkDNSConnection();
        });

        // Test real DNS connection button
        document.getElementById('testRealDNS').addEventListener('click', () => {
            this.testRealDNSConnection();
        });

        // Copy DNS button
        document.getElementById('copyDNS').addEventListener('click', () => {
            this.copyDNSToClipboard();
        });

        // Add click handler for status indicator to show detailed info
        document.getElementById('statusIndicator').addEventListener('click', () => {
            this.showDetailedDNSInfo();
        });

        // Input validation
        document.getElementById('primaryDNS').addEventListener('input', this.validateIPAddress);
        document.getElementById('secondaryDNS').addEventListener('input', this.validateIPAddress);

        // Language selector
        document.querySelectorAll('.lang-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const language = e.target.closest('.lang-btn').dataset.lang;
                if (language) {
                    this.changeLanguage(language);
                    this.updatePrivacyPolicyLink(language);
                    this.updateTermsOfServiceLink(language);
                    this.refreshCustomDNSPresets();
                }
            });
        });
    }

    validateIPAddress(e) {
        const input = e.target;
        const ipPattern = /^(?:[0-9]{1,3}\.){3}[0-9]{1,3}$/;
        
        if (input.value && !ipPattern.test(input.value)) {
            input.style.borderColor = '#dc3545';
        } else {
            input.style.borderColor = '#e9ecef';
        }
    }

    async selectPreset(btn) {
        try {
            // Remove active class and check from all preset buttons
            document.querySelectorAll('.preset-btn').forEach(b => {
                b.classList.remove('active');
                const check = b.querySelector('.preset-check');
                if (check) check.style.display = 'none';
            });
        
            // Add active class and check to selected button
        btn.classList.add('active');
            const check = btn.querySelector('.preset-check');
            if (check) check.style.display = 'inline-block';
        
        // Set current configuration
        const dnsServers = btn.dataset.dns.split(',');
        this.currentConfig = {
            name: btn.dataset.name,
            primary: dnsServers[0],
            secondary: dnsServers[1] || '',
                isPreset: true,
                timestamp: Date.now()
            };
            
            console.log('Selected DNS config:', this.currentConfig);
            
            // Save configuration to storage immediately
            await chrome.storage.local.set({
                currentConfig: this.currentConfig,
                currentDNSConfig: this.currentConfig,
                lastActiveConfig: this.currentConfig
            });
            console.log('DNS config saved to storage');
            
            // Apply DNS configuration
            const response = await chrome.runtime.sendMessage({
                action: 'applyDNS',
                config: this.currentConfig
            });
            
            if (response && response.success) {
                // Update status after DNS is applied
                await this.updateStatus();
                // Update the current DNS bar
                updateCurrentDnsBar();
                
                // Show success notification with simulation info
                this.showNotification(`DNS saved: ${this.currentConfig.name} (Simulation Mode)`, 'success');
            } else {
                this.showNotification('Failed to save DNS settings', 'error');
            }
        } catch (error) {
            console.error('Error applying DNS:', error);
            this.showNotification('Error applying DNS settings', 'error');
        }
    }

    highlightActivePreset() {
        chrome.storage.local.get(['currentConfig', 'currentDNSConfig'], (result) => {
            console.log('Loading saved config for highlighting:', result);
            
            // Clear all active states first
            document.querySelectorAll('.preset-btn').forEach(b => {
                b.classList.remove('active');
                const check = b.querySelector('.preset-check');
                if (check) check.style.display = 'none';
            });
            
            // Get the current config (try both keys)
            const currentConfig = result.currentConfig || result.currentDNSConfig;
            
            if (!currentConfig || !currentConfig.primary) {
                console.log('No saved DNS config found');
                return;
            }
            
            console.log('Found saved config:', currentConfig);
            
            // Highlight the matching preset button
            document.querySelectorAll('.preset-btn').forEach(b => {
                const dnsServers = b.dataset.dns.split(',');
                if (dnsServers[0] === currentConfig.primary) {
                    b.classList.add('active');
                    const check = b.querySelector('.preset-check');
                    if (check) check.style.display = 'inline-block';
                    console.log('Highlighted preset:', b.dataset.name);
                }
            });
        });
    }

    async saveCustomDNS() {
        const primary = document.getElementById('primaryDNS').value.trim();
        const secondary = document.getElementById('secondaryDNS').value.trim();
        const name = document.getElementById('dnsName').value.trim();
        const saveButton = document.getElementById('saveCustom');

        if (!primary || !name) {
            this.showNotification(window.i18n.getText('notifications.errors.primaryRequired'), 'error');
            return;
        }

        if (!this.isValidIP(primary) || (secondary && !this.isValidIP(secondary))) {
            this.showNotification(window.i18n.getText('notifications.errors.invalidIP'), 'error');
            return;
        }

        // Check if we're editing a Ready DNS preset
        const editingReadyId = saveButton.getAttribute('data-editing-ready-id');
        if (editingReadyId) {
            const idx = this.readyDnsPresets.findIndex(p => p.timestamp.toString() === editingReadyId);
            if (idx !== -1) {
                // Update the Ready DNS preset
                this.readyDnsPresets[idx].primary = primary;
                this.readyDnsPresets[idx].secondary = secondary;
                this.readyDnsPresets[idx].nameKey = name; // For custom names, store as nameKey
                await this.saveReadyDnsPresets();
                this.renderReadyDnsPresets();
                // Clear editing state
                saveButton.removeAttribute('data-editing-ready-id');
                saveButton.textContent = window.i18n && window.i18n.isReady() ? 
                    window.i18n.getText('dns.custom.saveButton') || 'Save Custom DNS' : 'Save Custom DNS';
                document.getElementById('cancelEdit').style.display = 'none';
                this.showNotification('Ready DNS updated successfully', 'success');
            }
            // Clear form
            document.getElementById('primaryDNS').value = '';
            document.getElementById('secondaryDNS').value = '';
            document.getElementById('dnsName').value = '';
            return;
        }

        // Check if we're editing an existing configuration
        const editingConfigId = saveButton.getAttribute('data-editing-config-id');
        
        if (editingConfigId) {
            // Update existing configuration
            const existingIndex = this.savedConfigs.findIndex(c => c.timestamp.toString() === editingConfigId);
            if (existingIndex !== -1) {
                // Remove old version from preset grid
                const oldConfig = this.savedConfigs[existingIndex];
                this.removeCustomDNSFromPresetGrid(oldConfig);
                
                // Update the configuration
                this.savedConfigs[existingIndex] = {
                    name: name,
                    primary: primary,
                    secondary: secondary,
                    isPreset: false,
                    timestamp: parseInt(editingConfigId)
                };
                
                await this.saveConfigsToStorage();
                this.renderSavedConfigs();
                
                // Add updated version to preset grid
                this.addCustomDNSToPresetGrid(this.savedConfigs[existingIndex]);
                
                // Clear editing state
                saveButton.removeAttribute('data-editing-config-id');
                saveButton.textContent = window.i18n && window.i18n.isReady() ? 
                    window.i18n.getText('dns.custom.saveButton') || 'Save Custom DNS' : 'Save Custom DNS';
                
                // Hide cancel button
                document.getElementById('cancelEdit').style.display = 'none';
                
                this.showNotification('DNS configuration updated successfully', 'success');
            }
        } else {
            // Create new configuration
        const config = {
            name: name,
            primary: primary,
            secondary: secondary,
            isPreset: false,
            timestamp: Date.now()
        };

        this.savedConfigs.push(config);
        await this.saveConfigsToStorage();
        this.renderSavedConfigs();
            
            // Add custom DNS to preset grid
            this.addCustomDNSToPresetGrid(config);
            
            // Set as current configuration and apply it
            this.currentConfig = config;
            await chrome.storage.local.set({
                currentConfig: config,
                currentDNSConfig: config,
                lastActiveConfig: config
            });
            
            // Apply the custom DNS configuration
            try {
                const response = await chrome.runtime.sendMessage({
                    action: 'applyDNS',
                    config: config
                });
                
                if (response && response.success) {
                    await this.updateStatus();
                    updateCurrentDnsBar();
                    this.showNotification(`Custom DNS saved and applied: ${config.name} (Simulation Mode)`, 'success');
                } else {
                    this.showNotification('Failed to apply custom DNS settings', 'error');
                }
            } catch (error) {
                console.error('Error applying custom DNS:', error);
                this.showNotification('Error applying custom DNS settings', 'error');
            }
        }
        
        // Clear inputs
        document.getElementById('primaryDNS').value = '';
        document.getElementById('secondaryDNS').value = '';
        document.getElementById('dnsName').value = '';
    }

    addCustomDNSToPresetGrid(config) {
        const presetGrid = document.querySelector('.preset-grid');
        if (!presetGrid) {
            return;
        }

        // Create custom DNS container
        const customContainer = document.createElement('div');
        customContainer.className = 'custom-preset-container';
        customContainer.setAttribute('data-config-id', config.timestamp.toString());

        // Create custom DNS button
        const customButton = document.createElement('button');
        customButton.className = 'preset-btn custom-preset';
        customButton.setAttribute('data-dns', `${config.primary}${config.secondary ? ',' + config.secondary : ''}`);
        customButton.setAttribute('data-name', config.name);
        customButton.setAttribute('data-preset', 'custom');
        customButton.setAttribute('data-config-id', config.timestamp.toString());

        customButton.innerHTML = `
            <div class="preset-icon">⚙️</div>
            <div class="preset-info">
                <div class="preset-name">${config.name}</div>
                <div class="preset-servers ltr-text">${config.primary}${config.secondary ? ', ' + config.secondary : ''}</div>
                <div class="custom-label">${window.i18n && window.i18n.isReady() ? 
                    window.i18n.getText('dns.custom.customLabel') || 'Custom' : 'Custom'}</div>
            </div>
            <span class="preset-check" style="display:none;">✔️</span>
        `;

        // Add event listener for selection
        customButton.addEventListener('click', async (e) => {
            await this.selectPreset(customButton);
        });

        // Create action buttons container
        const actionButtons = document.createElement('div');
        actionButtons.className = 'custom-preset-actions';
        actionButtons.innerHTML = `
            <button class="edit-custom-btn" title="Edit DNS" data-config-id="${config.timestamp.toString()}">✏️</button>
            <button class="delete-custom-btn" title="Delete DNS" data-config-id="${config.timestamp.toString()}">🗑️</button>
            <button class="copy-dns-btn" title="${window.i18n && window.i18n.isReady() ? window.i18n.getText('dns.copyButton') : 'Copy DNS'}" data-dns="${config.primary}${config.secondary ? ',' + config.secondary : ''}">📋</button>
        `;

        // Add event listeners for action buttons
        actionButtons.querySelector('.edit-custom-btn').addEventListener('click', (e) => {
            e.stopPropagation();
            this.editCustomDNS(config);
        });

        actionButtons.querySelector('.delete-custom-btn').addEventListener('click', (e) => {
            e.stopPropagation();
            this.deleteCustomDNS(config);
        });

        // Add event listener for copy button
        actionButtons.querySelector('.copy-dns-btn').addEventListener('click', (e) => {
            e.stopPropagation();
            this.copyDnsToClipboardCustom(config.primary, config.secondary);
        });

        // Add button and actions to container
        customContainer.appendChild(customButton);
        customContainer.appendChild(actionButtons);

        // Add to preset grid
        presetGrid.appendChild(customContainer);
    }

    editCustomDNS(config) {
        // Fill the custom DNS form with existing data
        document.getElementById('primaryDNS').value = config.primary;
        document.getElementById('secondaryDNS').value = config.secondary || '';
        document.getElementById('dnsName').value = config.name;
        
        // Change save button text to indicate editing
        const saveButton = document.getElementById('saveCustom');
        saveButton.textContent = window.i18n && window.i18n.isReady() ? 
            window.i18n.getText('dns.custom.updateButton') || 'Update DNS' : 'Update DNS';
        
        // Store the config being edited
        saveButton.setAttribute('data-editing-config-id', config.timestamp.toString());
        
        // Show cancel button
        document.getElementById('cancelEdit').style.display = 'inline-block';
        
        // Scroll to custom DNS section
        document.querySelector('.custom-dns').scrollIntoView({ behavior: 'smooth' });
        
        this.showNotification('DNS configuration loaded for editing', 'info');
    }

    async deleteCustomDNS(config) {
        if (confirm('Are you sure you want to delete this DNS configuration?')) {
            // Find and remove from saved configs
            const index = this.savedConfigs.findIndex(c => c.timestamp === config.timestamp);
            if (index !== -1) {
                this.savedConfigs.splice(index, 1);
                await this.saveConfigsToStorage();
                this.renderSavedConfigs();
                
                // Remove from preset grid
                this.removeCustomDNSFromPresetGrid(config);
                
                this.showNotification('DNS configuration deleted successfully', 'success');
            }
        }
    }

    cancelEdit() {
        // Clear form inputs
        document.getElementById('primaryDNS').value = '';
        document.getElementById('secondaryDNS').value = '';
        document.getElementById('dnsName').value = '';
        
        // Reset save button
        const saveButton = document.getElementById('saveCustom');
        saveButton.removeAttribute('data-editing-config-id');
        saveButton.textContent = window.i18n && window.i18n.isReady() ? 
            window.i18n.getText('dns.custom.saveButton') || 'Save Custom DNS' : 'Save Custom DNS';
        
        // Hide cancel button
        document.getElementById('cancelEdit').style.display = 'none';
        
        this.showNotification(window.i18n && window.i18n.isReady() ? 
            window.i18n.getText('notifications.info.editCancelled') || 'Edit mode cancelled' : 'Edit mode cancelled', 'info');
    }

    loadCustomDNSPresets() {
        // Load saved custom DNS configurations and add them to preset grid
        this.savedConfigs.forEach(config => {
            this.addCustomDNSToPresetGrid(config);
        });
    }

    refreshCustomDNSPresets() {
        // Remove all existing custom DNS containers
        const presetGrid = document.querySelector('.preset-grid');
        if (!presetGrid) return;

        const customContainers = presetGrid.querySelectorAll('.custom-preset-container');
        customContainers.forEach(container => {
            container.remove();
        });

        // Re-add all custom DNS configurations with updated labels
        this.savedConfigs.forEach(config => {
            this.addCustomDNSToPresetGrid(config);
        });
    }

    isValidIP(ip) {
        const ipPattern = /^(?:[0-9]{1,3}\.){3}[0-9]{1,3}$/;
        if (!ipPattern.test(ip)) return false;
        
        const parts = ip.split('.');
        return parts.every(part => {
            const num = parseInt(part);
            return num >= 0 && num <= 255;
        });
    }

    async loadSavedConfigs() {
        try {
            const result = await chrome.storage.local.get(['savedConfigs', 'currentConfig']);
            this.savedConfigs = result.savedConfigs || [];
            this.currentConfig = result.currentConfig || null;
        } catch (error) {
            console.error('Error loading saved configurations:', error);
        }
    }

    async saveConfigsToStorage() {
        try {
            await chrome.storage.local.set({
                savedConfigs: this.savedConfigs,
                currentConfig: this.currentConfig
            });
        } catch (error) {
            console.error('Error saving configurations:', error);
        }
    }

    renderSavedConfigs() {
        const container = document.getElementById('savedConfigsList');
        container.innerHTML = '';

        if (this.savedConfigs.length === 0) {
            container.innerHTML = `<p style="text-align: center; color: #666; font-style: italic;">${window.i18n.getText('dns.saved.noSettings')}</p>`;
            return;
        }

        this.savedConfigs.forEach((config, index) => {
            const configElement = document.createElement('div');
            configElement.className = 'saved-config-item';
            configElement.innerHTML = `
                <div class="saved-config-info">
                    <div class="saved-config-name">${config.name}</div>
                    <div class="saved-config-servers">${config.primary}${config.secondary ? ', ' + config.secondary : ''}</div>
                </div>
                <div class="saved-config-actions">
                    <button class="apply-btn" data-index="${index}">${window.i18n.getText('dns.saved.apply')}</button>
                    <button class="delete-btn" data-index="${index}">${window.i18n.getText('dns.saved.delete')}</button>
                </div>
            `;

            // Add event listeners
            configElement.querySelector('.apply-btn').addEventListener('click', async () => {
                await this.applySavedConfig(index);
            });
            
            configElement.querySelector('.delete-btn').addEventListener('click', async () => {
                await this.deleteSavedConfig(index);
            });

            container.appendChild(configElement);
        });
    }

    async applySavedConfig(index) {
        const config = this.savedConfigs[index];
        this.currentConfig = { ...config };
        
        // Save as current active configuration
        await chrome.storage.local.set({
            currentConfig: this.currentConfig,
            currentDNSConfig: this.currentConfig,
            lastActiveConfig: this.currentConfig
        });
        
        await this.updateStatus();
        await this.saveConfigsToStorage();
        
        // Apply DNS
        try {
            const response = await chrome.runtime.sendMessage({
                action: 'applyDNS',
                config: this.currentConfig
            });
            
            if (response && response.success) {
                // Update the current DNS bar
                updateCurrentDnsBar();
                this.showNotification(`${window.i18n.getText('notifications.success.dnsApplied')} ${config.name} (Simulation Mode)`, 'success');
            } else {
                this.showNotification('Failed to save DNS configuration', 'error');
            }
        } catch (error) {
            console.error('Error applying DNS:', error);
            this.showNotification('Error applying DNS settings', 'error');
        }
    }

    async deleteSavedConfig(index) {
        const deletedConfig = this.savedConfigs[index];
        this.savedConfigs.splice(index, 1);
        await this.saveConfigsToStorage();
        this.renderSavedConfigs();
        
        // Remove custom DNS from preset grid
        this.removeCustomDNSFromPresetGrid(deletedConfig);
        
        this.showNotification(window.i18n.getText('notifications.success.settingsDeleted'), 'success');
    }

    removeCustomDNSFromPresetGrid(config) {
        const presetGrid = document.querySelector('.preset-grid');
        if (!presetGrid) return;

        // Find and remove the custom DNS container
        const customContainers = presetGrid.querySelectorAll('.custom-preset-container');
        customContainers.forEach(container => {
            if (container.getAttribute('data-config-id') === config.timestamp.toString()) {
                container.remove();
            }
        });
    }

    async applyCurrentDNS() {
        if (!this.currentConfig) {
            this.showNotification(window.i18n.getText('notifications.errors.noConfig'), 'error');
            return;
        }

        try {
            this.showNotification('Applying DNS configuration...', 'info');
            
            // Send message to background script to apply DNS
            const response = await chrome.runtime.sendMessage({
                action: 'applyDNS',
                config: this.currentConfig
            });

            if (response.success) {
                // Save as current active configuration
                await chrome.storage.local.set({
                    currentConfig: this.currentConfig,
                    lastActiveConfig: this.currentConfig
                });

                await this.updateStatus();
                // Update the current DNS bar
                updateCurrentDnsBar();
                this.showNotification(`${window.i18n.getText('notifications.success.dnsApplied')} ${this.currentConfig.name} (Simulation Mode)`, 'success');
            } else {
                this.showNotification('Failed to save DNS configuration', 'error');
            }
        } catch (error) {
            console.error('Error applying DNS:', error);
            this.showNotification('Error applying DNS settings', 'error');
        }
    }

    async resetToDefault() {
        try {
            this.showNotification('Resetting to default DNS...', 'info');
            
            const response = await chrome.runtime.sendMessage({
                action: 'resetDNS'
            });

            if (response.success) {
                // Save last active config before reset
                const { currentConfig } = await chrome.storage.local.get(['currentConfig']);
                if (currentConfig) {
                    await chrome.storage.local.set({ lastActiveConfig: currentConfig });
                }

            this.currentConfig = null;
                await chrome.storage.local.set({
                    currentConfig: null
                });
                
                await this.updateStatus();
                // Update the current DNS bar
                updateCurrentDnsBar();
                // Clear active selections
                document.querySelectorAll('.preset-btn').forEach(b => {
                    b.classList.remove('active');
                    const check = b.querySelector('.preset-check');
                    if (check) check.style.display = 'none';
                });
                this.showNotification(window.i18n.getText('notifications.success.resetDefault'), 'success');
            } else {
                this.showNotification('Failed to reset DNS configuration', 'error');
            }
        } catch (error) {
            console.error('Error resetting DNS:', error);
            this.showNotification('Error resetting to default settings', 'error');
        }
    }

    async updateStatus() {
        const statusIndicator = document.getElementById('statusIndicator');
        const statusText = statusIndicator.querySelector('.status-text');
        const statusDot = statusIndicator.querySelector('.status-dot');

        try {
            // First try to get status from background
            const response = await chrome.runtime.sendMessage({
                action: 'getCurrentConfig'
            });

            if (response.success) {
                const { config, status } = response;
                
                if (config && status.isActive) {
                    statusText.textContent = `${config.name} (Simulated)`;
            statusDot.style.background = '#28a745';
                    console.log('DNS is simulated as connected:', config.name);
                } else if (config && !status.isActive) {
                    statusText.textContent = `${config.name} (Not Active)`;
                    statusDot.style.background = '#ffc107';
                    console.log('DNS selected but not active:', config.name);
        } else {
                    // Fallback to storage check
                    await this.loadStatusFromStorage(statusText, statusDot);
                }
            } else {
                // Fallback to storage check
                await this.loadStatusFromStorage(statusText, statusDot);
            }
        } catch (error) {
            console.error('Error updating status:', error);
            // Fallback to storage check
            await this.loadStatusFromStorage(statusText, statusDot);
        }
    }

    async loadStatusFromStorage(statusText, statusDot) {
        try {
            const result = await chrome.storage.local.get(['currentConfig', 'currentDNSConfig']);
            console.log('Loading status from storage:', result);
            
            const config = result.currentConfig || result.currentDNSConfig;
            
            if (config && config.primary) {
                statusText.textContent = `${config.name} (Simulated)`;
            statusDot.style.background = '#28a745';
                console.log('DNS found in storage:', config.name);
                
                // Update current config in memory
                this.currentConfig = config;
        } else {
                statusText.textContent = window.i18n.getText('popup.status.default');
            statusDot.style.background = '#6c757d';
                console.log('No DNS configuration in storage');
                this.currentConfig = null;
            }
        } catch (error) {
            console.error('Error loading status from storage:', error);
            statusText.textContent = window.i18n.getText('popup.status.default');
            statusDot.style.background = '#6c757d';
        }
    }

    // Force refresh DNS status
    async refreshDNSStatus() {
        try {
            this.showNotification('Refreshing DNS status...', 'info');
            await this.updateStatus();
            updateCurrentDnsBar();
            this.showNotification('DNS status refreshed', 'success');
        } catch (error) {
            console.error('Error refreshing DNS status:', error);
            this.showNotification('Error refreshing DNS status', 'error');
        }
    }

    async testDNSConnection() {
        if (!this.currentConfig) {
            this.showNotification(window.i18n.getText('notifications.errors.noConfig'), 'error');
            return;
        }

        try {
            this.showNotification('Testing DNS connection...', 'info');
            
            // Test the DNS connection
            const response = await chrome.runtime.sendMessage({
                action: 'testDNS',
                dnsServer: this.currentConfig.primary
            });

            if (response.success) {
                this.showNotification(`DNS connection test successful for ${this.currentConfig.name}`, 'success');
            } else {
                this.showNotification(`DNS connection test failed for ${this.currentConfig.name}`, 'error');
            }
        } catch (error) {
            console.error('Error testing DNS connection:', error);
            this.showNotification('Error testing DNS connection', 'error');
        }
    }

    // Check if DNS is actually working
    async checkDNSStatus() {
        try {
            const response = await chrome.runtime.sendMessage({
                action: 'getCurrentConfig'
            });

            if (response.success) {
                const { config, status } = response;
                
                if (config && status.isActive) {
                    return { connected: true, config: config.name };
                } else if (config && !status.isActive) {
                    return { connected: false, config: config.name, reason: 'DNS not active' };
                } else {
                    return { connected: false, config: null, reason: 'No configuration' };
                }
            }
            return { connected: false, config: null, reason: 'Error getting status' };
        } catch (error) {
            console.error('Error checking DNS status:', error);
            return { connected: false, config: null, reason: 'Error' };
        }
    }

    // Check if DNS is actually connected
    async checkDNSConnection() {
        try {
            const response = await chrome.runtime.sendMessage({
                action: 'getCurrentConfig'
            });

            if (response.success) {
                const { config, proxySettings } = response;
                const isProxyActive = proxySettings && proxySettings.mode === 'fixed_servers';
                
                if (config && isProxyActive) {
                    this.showNotification(`DNS is connected: ${config.name} (${config.primary})`, 'success');
                    return true;
                } else if (config && !isProxyActive) {
                    this.showNotification(`DNS selected but not active: ${config.name}`, 'error');
                    return false;
                } else {
                    this.showNotification('No DNS configuration selected', 'error');
                    return false;
                }
            } else {
                this.showNotification('Error checking DNS connection', 'error');
                return false;
            }
        } catch (error) {
            console.error('Error checking DNS connection:', error);
            this.showNotification('Error checking DNS connection', 'error');
            return false;
        }
    }

    // Test real DNS connection
    async testRealDNSConnection() {
        try {
            this.showNotification('Testing real DNS connection...', 'info');
            
            const response = await chrome.runtime.sendMessage({
                action: 'testRealDNS'
            });

            if (response.success) {
                this.showNotification('Real DNS connection test successful!', 'success');
            } else {
                this.showNotification('Real DNS connection test failed', 'error');
            }
        } catch (error) {
            console.error('Error testing real DNS connection:', error);
            this.showNotification('Error testing real DNS connection', 'error');
        }
    }

    // Show detailed DNS information
    async showDetailedDNSInfo() {
        try {
            const response = await chrome.runtime.sendMessage({
                action: 'getCurrentConfig'
            });

            if (response.success) {
                const { config, proxySettings } = response;
                const isProxyActive = proxySettings && proxySettings.mode === 'fixed_servers';
                
                let message = 'DNS Status Details:\n';
                message += `Configuration: ${config ? config.name : 'None'}\n`;
                message += `Proxy Active: ${isProxyActive ? 'Yes' : 'No'}\n`;
                message += `Proxy Mode: ${proxySettings ? proxySettings.mode : 'None'}\n`;
                
                if (config && proxySettings && proxySettings.rules && proxySettings.rules.singleProxy) {
                    const proxy = proxySettings.rules.singleProxy;
                    message += `Proxy Server: ${proxy.host}:${proxy.port}\n`;
                    message += `Proxy Scheme: ${proxy.scheme}\n`;
                }
                
                this.showNotification(message, 'info');
            } else {
                this.showNotification('Error getting DNS details', 'error');
            }
        } catch (error) {
            console.error('Error showing DNS details:', error);
            this.showNotification('Error showing DNS details', 'error');
        }
    }

    async changeLanguage(language) {
        try {
            // Check if i18n is available and ready
            if (!window.i18n) {
                throw new Error('i18n not initialized');
            }
            
            if (!window.i18n.isReady()) {
                throw new Error('Translations not loaded');
            }

            // Remove active class and check from all language buttons
            document.querySelectorAll('.lang-btn').forEach(btn => {
                btn.classList.remove('active');
                const check = btn.querySelector('.lang-check');
                if (check) {
                    check.style.display = 'none';
                    check.style.opacity = '0';
                }
            });
            
            // Add active class and check to selected button
            const selectedBtn = document.querySelector(`[data-lang="${language}"]`);
            if (selectedBtn) {
                selectedBtn.classList.add('active');
                const check = selectedBtn.querySelector('.lang-check');
                if (check) {
                    check.style.display = 'flex';
                    check.style.opacity = '1';
                }
            }

            // Set language in i18n
            await window.i18n.setLanguage(language);

            // Update DNS presets visibility
            this.updateDNSPresetsVisibility();

            // Update notification message based on language
            let message;
            switch(language) {
                case 'fa':
                    message = 'زبان به فارسی تغییر یافت';
                    break;
                case 'ar':
                    message = 'تم تغيير اللغة إلى العربية';
                    break;
                case 'zh':
                    message = '语言已更改为中文';
                    break;
                default:
                    message = 'Language changed to English';
            }
            this.showNotification(message, 'success');

            this.updateCopyDnsLabels();
        } catch (error) {
            console.error('Error changing language:', error);
            
            // Revert button state
            document.querySelectorAll('.lang-btn').forEach(btn => {
                btn.classList.remove('active');
                const check = btn.querySelector('.lang-check');
                if (check) {
                    check.style.display = 'none';
                    check.style.opacity = '0';
                }
            });
            
            // Highlight current language
            const currentLang = window.i18n ? window.i18n.getCurrentLanguage() : 'en';
            const currentBtn = document.querySelector(`[data-lang="${currentLang}"]`);
            if (currentBtn) {
                currentBtn.classList.add('active');
                const check = currentBtn.querySelector('.lang-check');
                if (check) {
                    check.style.display = 'flex';
                    check.style.opacity = '1';
                }
            }
            
            let errorMessage;
            switch(currentLang) {
                case 'fa':
                    errorMessage = 'خطا در تغییر زبان';
                    break;
                case 'ar':
                    errorMessage = 'خطأ في تغيير اللغة';
                    break;
                case 'zh':
                    errorMessage = '更改语言时出错';
                    break;
                default:
                    errorMessage = 'Error changing language';
            }
            this.showNotification(errorMessage, 'error');
        }
    }

    updateDNSPresetsVisibility() {
        if (!window.i18n || !window.i18n.isReady()) {
            return;
        }
        
        const isPersian = window.i18n.getCurrentLanguage() === 'fa';
        const persianOnlyButtons = document.querySelectorAll('.preset-btn.persian-only');
        
        persianOnlyButtons.forEach(btn => {
            if (isPersian) {
                btn.style.display = 'flex';
            } else {
                btn.style.display = 'none';
            }
        });
    }

    highlightActiveLanguage() {
        if (!window.i18n || !window.i18n.isReady()) {
            return;
        }
        
        const currentLang = window.i18n.getCurrentLanguage();
        
        document.querySelectorAll('.lang-btn').forEach(btn => {
            btn.classList.remove('active');
            const check = btn.querySelector('.lang-check');
            if (check) {
                check.style.display = 'none';
                check.style.opacity = '0';
            }
        });
        
        const activeBtn = document.querySelector(`[data-lang="${currentLang}"]`);
        if (activeBtn) {
            activeBtn.classList.add('active');
            const check = activeBtn.querySelector('.lang-check');
            if (check) {
                check.style.display = 'flex';
                check.style.opacity = '1';
            }
        }
    }

    showNotification(message, type = 'info') {
        // Ensure notification container exists
        let container = document.getElementById('notification-container');
        if (!container) {
            container = document.createElement('div');
            container.id = 'notification-container';
            container.style.cssText = `
                position: fixed;
                top: 20px;
                right: 20px;
                z-index: 1000;
                display: flex;
                flex-direction: column;
                align-items: flex-end;
                gap: 12px;
                pointer-events: none;
            `;
            document.body.appendChild(container);
        }
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.textContent = message;
        notification.style.cssText = `
            pointer-events: auto;
            padding: 16px 24px;
            border-radius: 12px;
            color: white;
            font-size: 14px;
            max-width: 320px;
            backdrop-filter: blur(10px);
            box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
            border: 1px solid rgba(255, 255, 255, 0.2);
            font-weight: 600;
            letter-spacing: 0.3px;
            animation: slideIn 0.4s cubic-bezier(0.4, 0, 0.2, 1);
            background: linear-gradient(135deg, #667eea, #764ba2);
            margin-bottom: 0;
            position: relative;
        `;
        // Set background color based on type
        switch (type) {
            case 'success':
                notification.style.background = 'linear-gradient(135deg, #10b981, #059669)';
                break;
            case 'error':
                notification.style.background = 'linear-gradient(135deg, #ef4444, #dc2626)';
                break;
            default:
                notification.style.background = 'linear-gradient(135deg, #667eea, #764ba2)';
        }
        // Add to container
        container.appendChild(notification);
        // Remove after 3 seconds
        setTimeout(() => {
            notification.style.animation = 'slideOut 0.3s ease';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
                // Remove container if empty
                if (container.childElementCount === 0 && container.parentNode) {
                    container.parentNode.removeChild(container);
                }
            }, 300);
        }, 3000);
    }

    async loadCurrentConfigFromStorage() {
        try {
            const result = await chrome.storage.local.get(['currentConfig', 'currentDNSConfig']);
            console.log('Loading current config from storage:', result);
            
            const config = result.currentConfig || result.currentDNSConfig;
            
            if (config && config.primary) {
                this.currentConfig = config;
                console.log('Current config loaded:', config.name);
            } else {
                this.currentConfig = null;
                console.log('No current config found in storage');
            }
        } catch (error) {
            console.error('Error loading current config from storage:', error);
            this.currentConfig = null;
        }
    }

    async copyDnsToClipboardCustom(primary, secondary) {
        const dnsText = primary; // Only copy the first (primary) DNS IP
        try {
            if (navigator.clipboard) {
                await navigator.clipboard.writeText(dnsText);
            } else {
                const textArea = document.createElement('textarea');
                textArea.value = dnsText;
                document.body.appendChild(textArea);
                textArea.select();
                document.execCommand('copy');
                document.body.removeChild(textArea);
            }
            this.showNotification((window.i18n && window.i18n.isReady() ? window.i18n.getText('notifications.success.dnsCopied') : 'DNS address copied') + ': ' + dnsText, 'success');
            // Animate the copy button and label
            // Find the active preset-btn with this primary DNS
            const presetBtns = document.querySelectorAll('.preset-btn');
            presetBtns.forEach(btn => {
                const dns = btn.getAttribute('data-dns');
                if (dns && dns.split(',')[0].trim() === primary.trim()) {
                    const copyBtn = btn.querySelector('.copy-dns-btn');
                    const copyLabel = btn.querySelector('.copy-dns-label');
                    if (copyBtn) {
                        copyBtn.classList.add('copied');
                        setTimeout(() => copyBtn.classList.remove('copied'), 600);
                    }
                    if (copyLabel) {
                        copyLabel.classList.add('copied');
                        setTimeout(() => copyLabel.classList.remove('copied'), 600);
                    }
                }
            });
        } catch (error) {
            this.showNotification((window.i18n && window.i18n.isReady() ? window.i18n.getText('notifications.errors.copyFailed') : 'Failed to copy DNS'), 'error');
        }
    }

    updateCopyDnsLabels() {
        const labelText = window.i18n && window.i18n.isReady() ? window.i18n.getText('dns.copyLabel') : 'Copy DNS';
        document.querySelectorAll('.copy-dns-label').forEach(el => {
            el.textContent = labelText;
        });
    }

    async loadReadyDnsPresets() {
        // Try to load from storage, else use defaults
        const defaultPresets = [
            {
                nameKey: 'google',
                icon: '🌐',
                primary: '8.8.8.8',
                secondary: '8.8.4.4',
                isPreset: true,
                timestamp: 1
            },
            {
                nameKey: 'cloudflare',
                icon: '☁️',
                primary: '1.1.1.1',
                secondary: '1.0.0.1',
                isPreset: true,
                timestamp: 2
            },
            {
                nameKey: 'opendns',
                icon: '🔓',
                primary: '208.67.222.222',
                secondary: '208.67.220.220',
                isPreset: true,
                timestamp: 3
            },
            {
                nameKey: 'quad9',
                icon: '🛡️',
                primary: '9.9.9.9',
                secondary: '149.112.112.112',
                isPreset: true,
                timestamp: 4
            }
        ];
        return new Promise((resolve) => {
            chrome.storage.local.get(['readyDnsPresets'], (result) => {
                this.readyDnsPresets = result.readyDnsPresets && Array.isArray(result.readyDnsPresets)
                    ? result.readyDnsPresets
                    : defaultPresets;
                resolve();
            });
        });
    }

    async saveReadyDnsPresets() {
        await chrome.storage.local.set({ readyDnsPresets: this.readyDnsPresets });
    }

    renderReadyDnsPresets() {
        const grid = document.getElementById('readyDnsGrid');
        if (!grid) return;
        grid.innerHTML = '';
        const lang = window.i18n && window.i18n.isReady() ? window.i18n.getCurrentLanguage() : 'en';
        this.readyDnsPresets.forEach((preset, idx) => {
            // Create container
            const container = document.createElement('div');
            container.className = 'ready-preset-container';
            container.setAttribute('data-ready-id', preset.timestamp);

            // Create main button
            const btn = document.createElement('button');
            btn.className = 'preset-btn ready-preset';
            btn.setAttribute('data-dns', `${preset.primary}${preset.secondary ? ',' + preset.secondary : ''}`);
            btn.setAttribute('data-name', window.i18n && window.i18n.isReady() ? window.i18n.getText(`dns.presets.${preset.nameKey}.name`) || preset.nameKey : preset.nameKey);
            btn.setAttribute('data-preset', preset.nameKey);
            btn.setAttribute('data-ready-id', preset.timestamp);
            btn.innerHTML = `
                <div class="preset-icon">${preset.icon}</div>
                <div class="preset-info">
                    <div class="preset-name">${window.i18n && window.i18n.isReady() ? window.i18n.getText(`dns.presets.${preset.nameKey}.name`) || preset.nameKey : preset.nameKey}</div>
                    <div class="preset-servers ltr-text">${preset.primary}${preset.secondary ? ', ' + preset.secondary : ''}</div>
                    <div class="ready-label">${window.i18n && window.i18n.isReady() ? window.i18n.getText('dns.presets.title') : 'Ready DNS'}</div>
                </div>
                <span class="preset-check" style="display:none;">✔️</span>
            `;
            // Select preset on click (not on action buttons)
            btn.addEventListener('click', async (e) => {
                if (e.target.closest('.ready-preset-actions')) return;
                await this.selectPreset(btn);
            });

            // Create action buttons container
            const actionButtons = document.createElement('div');
            actionButtons.className = 'ready-preset-actions custom-preset-actions';
            actionButtons.innerHTML = `
                <button class="edit-custom-btn" title="Edit DNS" data-ready-id="${preset.timestamp}">✏️</button>
                <button class="delete-custom-btn" title="Delete DNS" data-ready-id="${preset.timestamp}">🗑️</button>
                <button class="copy-dns-btn" title="Copy DNS" data-dns="${preset.primary}${preset.secondary ? ',' + preset.secondary : ''}">📋</button>
                <span class="copy-dns-label" data-i18n="dns.copyLabel">${window.i18n && window.i18n.isReady() ? window.i18n.getText('dns.copyLabel') : 'Copy DNS'}</span>
            `;
            // Action listeners
            actionButtons.querySelector('.edit-custom-btn').addEventListener('click', (e) => {
                e.stopPropagation();
                this.editReadyDnsPreset(preset, idx);
            });
            actionButtons.querySelector('.delete-custom-btn').addEventListener('click', (e) => {
                e.stopPropagation();
                this.deleteReadyDnsPreset(idx);
            });
            actionButtons.querySelector('.copy-dns-btn').addEventListener('click', (e) => {
                e.stopPropagation();
                this.copyDnsToClipboardCustom(preset.primary, preset.secondary);
            });
            actionButtons.querySelector('.copy-dns-label').addEventListener('click', (e) => {
                e.stopPropagation();
                this.copyDnsToClipboardCustom(preset.primary, preset.secondary);
            });

            // Add to container
            container.appendChild(btn);
            container.appendChild(actionButtons);
            grid.appendChild(container);
        });
    }

    editReadyDnsPreset(preset, idx) {
        // Fill the custom DNS form with existing data for editing
        document.getElementById('primaryDNS').value = preset.primary;
        document.getElementById('secondaryDNS').value = preset.secondary || '';
        document.getElementById('dnsName').value = window.i18n && window.i18n.isReady() ? window.i18n.getText(`dns.presets.${preset.nameKey}.name`) : preset.nameKey;
        // Store editing state
        const saveButton = document.getElementById('saveCustom');
        saveButton.setAttribute('data-editing-ready-id', preset.timestamp);
        saveButton.textContent = window.i18n && window.i18n.isReady() ? window.i18n.getText('dns.custom.updateButton') || 'Update DNS' : 'Update DNS';
        document.getElementById('cancelEdit').style.display = 'inline-block';
        document.querySelector('.custom-dns').scrollIntoView({ behavior: 'smooth' });
        this.showNotification('Ready DNS loaded for editing', 'info');
    }

    deleteReadyDnsPreset(idx) {
        if (confirm('Are you sure you want to delete this Ready DNS preset?')) {
            this.readyDnsPresets.splice(idx, 1);
            this.saveReadyDnsPresets();
            this.renderReadyDnsPresets();
            this.showNotification('Ready DNS deleted successfully', 'success');
        }
    }

    async copyDNSToClipboard() {
        // Get the currently active DNS config from storage
        chrome.storage.local.get(['currentConfig', 'currentDNSConfig'], (result) => {
            const config = result.currentConfig || result.currentDNSConfig;
            if (config && config.primary) {
                this.copyDnsToClipboardCustom(config.primary, config.secondary);
            } else {
                this.showNotification(
                    (window.i18n && window.i18n.isReady() ? window.i18n.getText('notifications.errors.noConfig') : 'No DNS selected to copy'),
                    'error'
                );
            }
        });
    }
}

// Add CSS animations for notifications
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from { 
            transform: translateX(100%) scale(0.8); 
            opacity: 0; 
        }
        to { 
            transform: translateX(0) scale(1); 
            opacity: 1; 
        }
    }
    
    @keyframes slideOut {
        from { 
            transform: translateX(0) scale(1); 
            opacity: 1; 
        }
        to { 
            transform: translateX(100%) scale(0.8); 
            opacity: 0; 
        }
    }
    
    .notification {
        backdrop-filter: blur(10px);
        box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
        border: 1px solid rgba(255, 255, 255, 0.2);
        font-weight: 600;
        letter-spacing: 0.3px;
    }
`;
document.head.appendChild(style);

// Initialize the DNS Manager when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
        window.dnsManager = new DNSManager();
        const openInTabBtn = document.getElementById('openInTab');
        if (openInTabBtn) {
            openInTabBtn.addEventListener('click', () => {
                chrome.tabs.create({ url: chrome.runtime.getURL('popup.html') });
            });
        }
        
        // Update the current DNS bar on initialization
        updateCurrentDnsBar();

        const openChromeSettingsBtn = document.getElementById('openChromeSettings');
        if (openChromeSettingsBtn) {
            openChromeSettingsBtn.addEventListener('click', () => {
                navigator.clipboard.writeText('chrome://settings/security');
                alert('آدرس chrome://settings/security کپی شد! لطفاً آن را در نوار آدرس مرورگر خود قرار دهید.');
            });
        }

        // هر بار که DNS تغییر کند، نوار را به‌روزرسانی کن
        chrome.storage.onChanged.addListener((changes, area) => {
            if (area === 'local' && changes.currentConfig) {
                if (window.dnsManager && typeof window.dnsManager.highlightActivePreset === 'function') {
                    window.dnsManager.highlightActivePreset();
                }
                updateCurrentDnsBar();
            }
        });
});

function updateCurrentDnsBar() {
    try {
        const currentDnsValue = document.getElementById('currentDnsValue');
        if (!currentDnsValue) {
            console.error('currentDnsValue element not found');
            return;
        }
        
        chrome.storage.local.get(['currentConfig', 'currentDNSConfig'], (result) => {
            console.log('Storage result for DNS bar:', result);
            
            // Try both storage keys
            const config = result.currentConfig || result.currentDNSConfig;
            console.log('Selected config for DNS bar:', config);
            
            if (!config || !config.primary) {
                // Check if i18n is ready, otherwise use fallback text
                if (window.i18n && window.i18n.isReady()) {
                    currentDnsValue.textContent = window.i18n.getText('popup.status.noConnection');
                } else {
                    currentDnsValue.textContent = 'No DNS Connected';
                }
                console.log('No DNS config found, showing default');
            } else {
                // Show the actual DNS server that is connected (simulated)
                currentDnsValue.textContent = `${config.primary} (Simulated)`;
                console.log('DNS config found:', config.primary);
            }
        });
    } catch (error) {
        console.error('Error updating current DNS bar:', error);
    }
}

// === Interactive DoH Poll Guide ===
function renderDohPollGuide(forceLang) {
    const guideDiv = document.getElementById('doh-poll-guide');
    if (!guideDiv) return;
    let lang = forceLang || (window.i18n && window.i18n.getCurrentLanguage && window.i18n.getCurrentLanguage()) || (navigator.language || 'en').split('-')[0];
    lang = ['en', 'fa', 'ar', 'zh'].includes(lang) ? lang : 'en';
    console.log('DoH Guide lang:', lang); // Debug log
    let t = window._i18n && window._i18n[lang] && window._i18n[lang].dohPoll;
    if (!t) t = window._i18n && window._i18n['en'] && window._i18n['en'].dohPoll;
    if (!t) return;
    const rtlLangs = ['fa', 'ar'];
    if (rtlLangs.includes(lang)) {
        guideDiv.setAttribute('dir', 'rtl');
    } else {
        guideDiv.setAttribute('dir', 'ltr');
    }
    let step = 0;
    guideDiv.innerHTML = '';
    // Add button to switch to direct DoH guide
    const switchBtn = document.createElement('button');
    switchBtn.className = 'doh-modern-switch';
    let switchLabel;
    if (lang === 'fa') switchLabel = 'راهنمای فعال‌سازی مستقیم DoH';
    else if (lang === 'ar') switchLabel = 'الدليل التفاعلي لـ DoH';
    else if (lang === 'zh') switchLabel = '直接启用 DoH 指南';
    else switchLabel = 'Direct DoH Activation Guide';
    switchBtn.innerHTML = `<span class='doh-modern-icon'>🔗</span> ${switchLabel}`;
    switchBtn.onclick = () => renderEnableDohGuide(lang);
    guideDiv.appendChild(switchBtn);
    function showStep() {
        guideDiv.innerHTML = '';
        guideDiv.appendChild(switchBtn);
        const card = document.createElement('div');
        card.className = 'doh-modern-card';
        // Progress bar
        const progress = document.createElement('div');
        progress.className = 'doh-modern-progress';
        const progressBar = document.createElement('div');
        progressBar.className = 'doh-modern-progress-bar';
        progressBar.style.width = `${(step === 0 ? 33 : step === 1 || step === 2 ? 66 : 100)}%`;
        progress.appendChild(progressBar);
        card.appendChild(progress);
        // Step indicator
        const stepIndicator = document.createElement('div');
        stepIndicator.className = 'doh-step-indicator';
        stepIndicator.textContent = `${step + 1}/4`;
        card.appendChild(stepIndicator);
        // Steps
        if (step === 0) {
            const q = document.createElement('div');
            q.className = 'doh-modern-step';
            q.innerHTML = `<span class='doh-modern-icon'>❓</span> ${t.q1}`;
            card.appendChild(q);
            const yesBtn = document.createElement('button');
            yesBtn.textContent = t.yes;
            yesBtn.className = 'doh-modern-btn';
            yesBtn.onclick = () => { step = 1; showStep(); };
            const noBtn = document.createElement('button');
            noBtn.textContent = t.no;
            noBtn.className = 'doh-modern-btn secondary';
            noBtn.onclick = () => { step = 2; showStep(); };
            card.appendChild(yesBtn);
            card.appendChild(noBtn);
        } else if (step === 1) {
            const q = document.createElement('div');
            q.className = 'doh-modern-step';
            q.innerHTML = `<span class='doh-modern-icon'>🔒</span> ${t.q2}`;
            card.appendChild(q);
            const showGuideBtn = document.createElement('button');
            showGuideBtn.textContent = t.showGuide;
            showGuideBtn.className = 'doh-modern-btn';
            showGuideBtn.onclick = () => { step = 3; showStep(); };
            card.appendChild(showGuideBtn);
            const openSettingsBtn = document.createElement('button');
            openSettingsBtn.textContent = t.openSettings;
            openSettingsBtn.className = 'doh-modern-btn secondary';
            openSettingsBtn.onclick = (e) => {
                // 1. Show notification/alert
                const msg = (lang === 'fa')
                  ? 'اگر صفحه باز نشد، این آدرس را در نوار آدرس کروم وارد کنید: chrome://settings/security'
                  : (lang === 'ar')
                  ? 'إذا لم يتم فتح الصفحة، يرجى نسخ هذا العنوان في شريط عناوين كروم: chrome://settings/security'
                  : (lang === 'zh')
                  ? '如果页面未打开，请将此地址粘贴到 Chrome 地址栏：chrome://settings/security'
                  : 'If the page did not open, please copy and paste this address in Chrome: chrome://settings/security';
                // Try to use the notification system if available
                if (window.dnsManager && typeof window.dnsManager.showNotification === 'function') {
                  window.dnsManager.showNotification(msg, 'info');
                } else {
                  alert(msg);
                }
                // 2. Animate the button for feedback
                openSettingsBtn.style.transform = 'scale(0.96)';
                openSettingsBtn.style.background = '#bbdefb';
                setTimeout(() => {
                  openSettingsBtn.style.transform = '';
                  openSettingsBtn.style.background = '';
                }, 350);
                // 3. Attempt to open Chrome security settings
                setTimeout(() => {
                  window.open('chrome://settings/security', '_blank');
                }, 400);
            };
            card.appendChild(openSettingsBtn);
        } else if (step === 2) {
            const q = document.createElement('div');
            q.className = 'doh-modern-step';
            q.innerHTML = `<span class='doh-modern-icon'>ℹ️</span> ${t.notifyTitle}`;
            card.appendChild(q);
            const infoText = document.createElement('div');
            infoText.className = 'doh-modern-note';
            infoText.innerHTML = `<span class='doh-modern-icon'>💡</span> ${t.notifyBody}`;
            card.appendChild(infoText);
            const continueBtn = document.createElement('button');
            continueBtn.textContent = t.yes;
            continueBtn.className = 'doh-modern-btn';
            continueBtn.onclick = () => { step = 1; showStep(); };
            card.appendChild(continueBtn);
            if (window.chrome && chrome.notifications) {
                chrome.notifications.create({
                    type: 'basic',
                    iconUrl: 'icons/icon128.png',
                    title: t.notifyTitle,
                    message: t.notifyBody
                });
            } else {
                setTimeout(() => alert(t.notifyTitle + '\n' + t.notifyBody), 300);
            }
        } else if (step === 3) {
            const guideBox = document.createElement('div');
            guideBox.className = 'doh-modern-guidebox';
            const title = document.createElement('strong');
            title.innerHTML = `<span class='doh-modern-icon'>📖</span> ${t.showGuide}`;
            guideBox.appendChild(title);
            const ol = document.createElement('ol');
            t.steps.forEach(stepText => {
                const li = document.createElement('li');
                li.innerHTML = stepText;
                ol.appendChild(li);
            });
            guideBox.appendChild(ol);
            const note = document.createElement('div');
            note.className = 'doh-modern-note';
            note.innerHTML = `<span class='doh-modern-icon'>💡</span> ${t.note}`;
            guideBox.appendChild(note);
            card.appendChild(guideBox);
            // Success check
            const success = document.createElement('div');
            success.className = 'doh-modern-success';
            success.innerHTML = `<span class='doh-modern-icon'>✅</span> ${(lang === 'fa') ? 'آموزش با موفقیت نمایش داده شد!' : (lang === 'ar') ? 'تم عرض الدليل بنجاح!' : (lang === 'zh') ? '指南已成功显示！' : 'Guide displayed successfully!'} `;
            card.appendChild(success);
        }
        guideDiv.appendChild(card);
    }
    showStep();
}

// === Direct DoH Activation Guide ===
function renderEnableDohGuide(forceLang) {
    const guideDiv = document.getElementById('doh-poll-guide');
    if (!guideDiv) return;
    let lang = forceLang || (window.i18n && window.i18n.getCurrentLanguage && window.i18n.getCurrentLanguage()) || (navigator.language || 'en').split('-')[0];
    lang = ['en', 'fa', 'ar', 'zh'].includes(lang) ? lang : 'en';
    console.log('Enable DoH Guide lang:', lang); // Debug log
    let t = window._i18n && window._i18n[lang] && window._i18n[lang].enableDoh;
    if (!t) t = window._i18n && window._i18n['en'] && window._i18n['en'].enableDoh;
    if (!t) return;
    const rtlLangs = ['fa', 'ar'];
    if (rtlLangs.includes(lang)) {
        guideDiv.setAttribute('dir', 'rtl');
    } else {
        guideDiv.setAttribute('dir', 'ltr');
    }
    guideDiv.innerHTML = '';
    // Add button to switch back to poll guide
    const switchBtn = document.createElement('button');
    switchBtn.className = 'doh-modern-switch';
    let switchLabel2;
    if (lang === 'fa') switchLabel2 = 'راهنمای تعاملی DoH';
    else if (lang === 'ar') switchLabel2 = 'الدليل التفاعلي لـ DoH';
    else if (lang === 'zh') switchLabel2 = 'DoH 互动指南';
    else switchLabel2 = 'Interactive DoH Guide';
    switchBtn.innerHTML = `<span class='doh-modern-icon'>💬</span> ${switchLabel2}`;
    switchBtn.onclick = () => renderDohPollGuide(lang);
    guideDiv.appendChild(switchBtn);
    // Card
    const card = document.createElement('div');
    card.className = 'doh-modern-card';
    // Title
    const title = document.createElement('div');
    title.className = 'doh-modern-title';
    title.innerHTML = `<span class='doh-modern-icon'>🔗</span> ${t.title}`;
    card.appendChild(title);
    // Intro
    const intro = document.createElement('div');
    intro.className = 'doh-modern-step';
    intro.innerHTML = `<span class='doh-modern-icon'>ℹ️</span> ${t.intro}`;
    card.appendChild(intro);
    // Steps
    const ol = document.createElement('ol');
    for (let i = 1; i <= 5; i++) {
        const li = document.createElement('li');
        li.innerHTML = `<span class='doh-modern-icon'>${i === 1 ? '⚙️' : i === 2 ? '🔍' : i === 3 ? '⬇️' : i === 4 ? '🛡️' : '🔗'}</span> ${t[`step${i}`]}`;
        ol.appendChild(li);
    }
    card.appendChild(ol);
    // Done
    const done = document.createElement('div');
    done.className = 'doh-modern-success';
    done.innerHTML = `<span class='doh-modern-icon'>✅</span> ${t.done}`;
    card.appendChild(done);
    guideDiv.appendChild(card);
}

// Load translations for all supported languages and always re-render after all are loaded
window._i18n = window._i18n || {};
function loadDohPollTranslations() {
    const langs = ['en', 'fa', 'ar', 'zh'];
    let loaded = 0;
    langs.forEach(lang => {
        try {
            fetch(`locales/${lang}.json`).then(r => r.json()).then(data => {
                window._i18n[lang] = data;
                loaded++;
                if (loaded === langs.length) {
                    // After all translations loaded, render with current language
                    let currentLang = (window.i18n && window.i18n.getCurrentLanguage && window.i18n.getCurrentLanguage()) || 'en';
                    renderDohPollGuide(currentLang);
                }
            });
        } catch (e) {}
    });
}

// Listen for language change and re-render DoH guide
function setupDohGuideLanguageSync() {
    document.querySelectorAll('.lang-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const language = e.target.closest('.lang-btn').dataset.lang;
            if (language) {
                setTimeout(() => renderDohPollGuide(language), 200); // slight delay to allow i18n to update
            }
        });
    });
}

document.addEventListener('DOMContentLoaded', () => {
    loadDohPollTranslations();
    setupDohGuideLanguageSync();
    // ... existing code ...
});

// Add after I18nManager class or at the end of popup.js
function updateLinksBarLabels() {
    if (!window.i18n || !window.i18n.isReady()) return;
    const map = [
        { id: 'homeLink', key: 'home' },
        { id: 'privacyPolicyLink', key: 'privacy' },
        { id: 'termsOfServiceLink', key: 'terms' },
        { id: 'licenseLink', key: 'license' },
        { id: 'contributingLink', key: 'contributing' },
        { id: 'securityLink', key: 'security' }
    ];
    map.forEach(({ id, key }) => {
        const el = document.getElementById(id);
        if (el) {
            // Find the span for label (second span)
            const spans = el.querySelectorAll('span');
            if (spans.length > 1) {
                spans[1].textContent = window.i18n.getText('links.' + key);
            }
        }
    });
    // Update About Developer button (🌐)
    const aboutLink = document.querySelector('.btn-link[href*="mohammadnasser.com"]');
    if (aboutLink) {
        const spans = aboutLink.querySelectorAll('span');
        if (spans.length > 1) {
            spans[1].textContent = window.i18n.getText('links.about');
        }
    }
}
// Patch: call this in applyLanguage and after language change
const origApplyLanguage = window.i18n.applyLanguage.bind(window.i18n);
window.i18n.applyLanguage = function() {
    origApplyLanguage();
    updateLinksBarLabels();
};
// Also call once on DOMContentLoaded
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', updateLinksBarLabels);
} else {
    updateLinksBarLabels();
}

 