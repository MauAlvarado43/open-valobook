/**
 * Script: scrape-assets.js
 * Purpose: Download and organize Valorant game assets from the community API
 * Usage: node scripts/scrape-assets.js [--verbose]
 * 
 * Downloads:
 * - Agent icons and portraits
 * - Ability icons for all agents
 * - Map images and splashes
 * - Generates metadata JSON files
 * 
 * Source: https://valorant-api.com (unofficial community API)
 */

import https from 'https';
import http from 'http';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configuration
const CONFIG = {
  apiBaseUrl: 'https://valorant-api.com/v1',
  outputDir: path.join(__dirname, '..', 'public', 'assets'),
  retryAttempts: 3,
  retryDelay: 1000,
  timeout: 30000,
};

// Directory paths
const PATHS = {
  assets: CONFIG.outputDir,
  agents: path.join(CONFIG.outputDir, 'agents'),
  abilities: path.join(CONFIG.outputDir, 'abilities'),
  maps: path.join(CONFIG.outputDir, 'maps'),
};

/**
 * Sanitizes a filename by removing invalid characters
 * 
 * @param {string} name - The original filename
 * @returns {string} A sanitized filename safe for file system use
 * 
 * @example
 * sanitizeFilename('KAY/O') // returns 'kay-o'
 * sanitizeFilename('Agent:123') // returns 'agent-123'
 */
function sanitizeFilename(name) {
  return name.toLowerCase().replace(/[\/\\:*?"<>|]/g, '-');
}

/**
 * Creates directory structure for assets
 * Ensures all required directories exist before download
 */
function createDirectories() {
  const directories = Object.values(PATHS);
  
  directories.forEach(dir => {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
      console.log(`[SETUP] Created directory: ${dir}`);
    }
  });
}

/**
 * Downloads a file from a URL with retry logic
 * 
 * @param {string} url - The URL to download from
 * @param {string} filepath - The destination file path
 * @param {number} attempt - Current retry attempt (internal use)
 * @returns {Promise<string>} The filepath of the downloaded file
 */
async function downloadFile(url, filepath, attempt = 1) {
  return new Promise((resolve, reject) => {
    const protocol = url.startsWith('https') ? https : http;
    const file = fs.createWriteStream(filepath);
    
    const request = protocol.get(url, (response) => {
      if (response.statusCode === 200) {
        response.pipe(file);
        file.on('finish', () => {
          file.close();
          resolve(filepath);
        });
      } else if (response.statusCode === 301 || response.statusCode === 302) {
        file.close();
        if (fs.existsSync(filepath)) fs.unlinkSync(filepath);
        downloadFile(response.headers.location, filepath, attempt)
          .then(resolve)
          .catch(reject);
      } else {
        file.close();
        if (fs.existsSync(filepath)) fs.unlinkSync(filepath);
        reject(new Error(`HTTP ${response.statusCode}`));
      }
    });
    
    request.on('error', (err) => {
      file.close();
      if (fs.existsSync(filepath)) fs.unlinkSync(filepath);
      reject(err);
    });
    
    request.setTimeout(CONFIG.timeout, () => {
      request.destroy();
      reject(new Error('Request timeout'));
    });
  });
}

/**
 * Downloads a file with automatic retry logic
 * 
 * @param {string} url - The URL to download from
 * @param {string} filepath - The destination file path
 * @returns {Promise<boolean>} True if successful, false otherwise
 */
async function downloadWithRetry(url, filepath) {
  for (let attempt = 1; attempt <= CONFIG.retryAttempts; attempt++) {
    try {
      await downloadFile(url, filepath);
      return true;
    } catch (error) {
      if (attempt === CONFIG.retryAttempts) {
        console.error(`[ERROR] Failed after ${attempt} attempts: ${error.message}`);
        return false;
      }
      console.log(`[RETRY] Attempt ${attempt}/${CONFIG.retryAttempts} failed, retrying...`);
      await new Promise(resolve => setTimeout(resolve, CONFIG.retryDelay));
    }
  }
  return false;
}

/**
 * Downloads agent assets (icons, portraits, abilities)
 * 
 * @returns {Promise<Object>} Download statistics and agent data
 */
async function downloadAgents() {
  console.log('\n[AGENTS] Fetching agent data from API...\n');
  
  const stats = {
    total: 0,
    successful: 0,
    failed: 0,
  };
  
  try {
    const response = await fetch(`${CONFIG.apiBaseUrl}/agents?isPlayableCharacter=true`);
    const data = await response.json();
    
    if (data.status !== 200) {
      throw new Error(`API returned status ${data.status}`);
    }
    
    stats.total = data.data.length;
    console.log(`[AGENTS] Found ${stats.total} agents\n`);
    
    for (const agent of data.data) {
      console.log(`[AGENT] Processing: ${agent.displayName}`);
      const safeName = sanitizeFilename(agent.displayName);
      
      // Create agent abilities directory
      const agentDir = path.join(PATHS.abilities, safeName);
      if (!fs.existsSync(agentDir)) {
        fs.mkdirSync(agentDir, { recursive: true });
      }
      
      // Download agent icon
      if (agent.displayIcon) {
        const iconPath = path.join(PATHS.agents, `${safeName}.png`);
        const success = await downloadWithRetry(agent.displayIcon, iconPath);
        if (success) {
          console.log(`  [OK] Agent icon saved`);
        }
      }
      
      // Download agent portrait
      if (agent.fullPortrait) {
        const portraitPath = path.join(PATHS.agents, `${safeName}-portrait.png`);
        const success = await downloadWithRetry(agent.fullPortrait, portraitPath);
        if (success) {
          console.log(`  [OK] Portrait saved`);
        }
      }
      
      // Download abilities
      if (agent.abilities && agent.abilities.length > 0) {
        for (const ability of agent.abilities) {
          if (ability.displayIcon) {
            const abilityName = sanitizeFilename(ability.displayName).replace(/\s+/g, '-');
            const abilityPath = path.join(agentDir, `${abilityName}.png`);
            const success = await downloadWithRetry(ability.displayIcon, abilityPath);
            if (success) {
              console.log(`  [OK] ${ability.displayName}`);
            }
          }
        }
      }
      
      stats.successful++;
      console.log('');
    }
    
    return { stats, agents: data.data };
    
  } catch (error) {
    console.error(`[ERROR] Failed to download agents: ${error.message}`);
    stats.failed = stats.total - stats.successful;
    return { stats, agents: [] };
  }
}

/**
 * Downloads map assets (icons and splashes)
 * 
 * @returns {Promise<Object>} Download statistics and map data
 */
async function downloadMaps() {
  console.log('\n[MAPS] Fetching map data from API...\n');
  
  const stats = {
    total: 0,
    successful: 0,
    failed: 0,
  };
  
  try {
    const response = await fetch(`${CONFIG.apiBaseUrl}/maps`);
    const data = await response.json();
    
    if (data.status !== 200) {
      throw new Error(`API returned status ${data.status}`);
    }
    
    stats.total = data.data.length;
    console.log(`[MAPS] Found ${stats.total} maps\n`);
    
    for (const map of data.data) {
      console.log(`[MAP] Processing: ${map.displayName}`);
      const safeMapName = sanitizeFilename(map.displayName);
      
      // Download map icon
      if (map.displayIcon) {
        const iconPath = path.join(PATHS.maps, `${safeMapName}.png`);
        const success = await downloadWithRetry(map.displayIcon, iconPath);
        if (success) {
          console.log(`  [OK] Map icon saved`);
        }
      }
      
      // Download map splash
      if (map.splash) {
        const splashPath = path.join(PATHS.maps, `${safeMapName}-splash.png`);
        const success = await downloadWithRetry(map.splash, splashPath);
        if (success) {
          console.log(`  [OK] Splash saved`);
        }
      }
      
      stats.successful++;
      console.log('');
    }
    
    return { stats, maps: data.data };
    
  } catch (error) {
    console.error(`[ERROR] Failed to download maps: ${error.message}`);
    stats.failed = stats.total - stats.successful;
    return { stats, maps: [] };
  }
}

/**
 * Generates agents metadata JSON file
 * 
 * @param {Array} agentsData - Raw agent data from API
 */
function generateAgentsMetadata(agentsData) {
  console.log('\n[METADATA] Generating agents metadata...');
  
  try {
    const metadata = agentsData.map(agent => ({
      id: agent.uuid,
      name: agent.displayName,
      description: agent.description,
      role: {
        name: agent.role?.displayName,
        icon: agent.role?.displayIcon,
      },
      abilities: agent.abilities.map(ability => ({
        slot: ability.slot,
        name: ability.displayName,
        description: ability.description,
        icon: `abilities/${sanitizeFilename(agent.displayName)}/${sanitizeFilename(ability.displayName).replace(/\s+/g, '-')}.png`,
      })),
      icon: `agents/${sanitizeFilename(agent.displayName)}.png`,
      portrait: `agents/${sanitizeFilename(agent.displayName)}-portrait.png`,
    }));
    
    const metadataPath = path.join(PATHS.assets, 'agents-metadata.json');
    fs.writeFileSync(metadataPath, JSON.stringify(metadata, null, 2));
    console.log(`[OK] Agents metadata saved: ${metadataPath}`);
  } catch (error) {
    console.error(`[ERROR] Failed to generate agents metadata: ${error.message}`);
  }
}

/**
 * Generates maps metadata JSON file
 * 
 * @param {Array} mapsData - Raw map data from API
 */
function generateMapsMetadata(mapsData) {
  console.log('\n[METADATA] Generating maps metadata...');
  
  try {
    const metadata = mapsData.map(map => ({
      id: map.uuid,
      name: map.displayName,
      coordinates: map.coordinates,
      icon: `maps/${sanitizeFilename(map.displayName)}.png`,
      splash: `maps/${sanitizeFilename(map.displayName)}-splash.png`,
    }));
    
    const metadataPath = path.join(PATHS.assets, 'maps-metadata.json');
    fs.writeFileSync(metadataPath, JSON.stringify(metadata, null, 2));
    console.log(`[OK] Maps metadata saved: ${metadataPath}`);
  } catch (error) {
    console.error(`[ERROR] Failed to generate maps metadata: ${error.message}`);
  }
}

/**
 * Main execution function
 * Orchestrates the entire asset download process
 */
async function main() {
  console.log('========================================');
  console.log('OpenValoBook Asset Downloader');
  console.log('========================================');
  console.log(`Source: ${CONFIG.apiBaseUrl}`);
  console.log(`Output: ${CONFIG.outputDir}\n`);
  
  const startTime = Date.now();
  
  try {
    // Step 1: Setup directories
    createDirectories();
    
    // Step 2: Download agents
    const agentsResult = await downloadAgents();
    
    // Step 3: Download maps
    const mapsResult = await downloadMaps();
    
    // Step 4: Generate metadata
    if (agentsResult.agents.length > 0) {
      generateAgentsMetadata(agentsResult.agents);
    }
    
    if (mapsResult.maps.length > 0) {
      generateMapsMetadata(mapsResult.maps);
    }
    
    // Summary
    const duration = ((Date.now() - startTime) / 1000).toFixed(2);
    console.log('\n========================================');
    console.log('Download Summary');
    console.log('========================================');
    console.log(`Agents: ${agentsResult.stats.successful}/${agentsResult.stats.total}`);
    console.log(`Maps: ${mapsResult.stats.successful}/${mapsResult.stats.total}`);
    console.log(`Duration: ${duration}s`);
    console.log('\n[SUCCESS] Asset download completed!');
    console.log('\nAssets saved to:');
    console.log(`  - Agents: ${PATHS.agents}`);
    console.log(`  - Abilities: ${PATHS.abilities}`);
    console.log(`  - Maps: ${PATHS.maps}`);
    
  } catch (error) {
    console.error(`\n[FATAL] Process failed: ${error.message}`);
    process.exit(1);
  }
}

// Execute main function
main();
