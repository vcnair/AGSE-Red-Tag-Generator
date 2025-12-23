import Papa from 'papaparse';
import { NCRRecord } from '../types';

export interface LiveDataConfig {
  dataPath: string;
  autoRefreshInterval: number; // milliseconds
}

export interface LiveDataStatus {
  isLoading: boolean;
  lastSyncTime: Date | null;
  recordCount: number;
  error: string | null;
}

export class LiveDataService {
  private data: NCRRecord[] = [];
  private config: LiveDataConfig;
  private status: LiveDataStatus = {
    isLoading: false,
    lastSyncTime: null,
    recordCount: 0,
    error: null
  };
  private refreshTimer: number | null = null;
  private statusListeners: ((status: LiveDataStatus) => void)[] = [];

  constructor(config?: Partial<LiveDataConfig>) {
    this.config = {
      dataPath: config?.dataPath || '/data/ncr-data.csv',
      autoRefreshInterval: config?.autoRefreshInterval || 300000 // 5 minutes default
    };
  }

  /**
   * Subscribe to status updates
   */
  onStatusChange(callback: (status: LiveDataStatus) => void): () => void {
    this.statusListeners.push(callback);
    // Return unsubscribe function
    return () => {
      this.statusListeners = this.statusListeners.filter(cb => cb !== callback);
    };
  }

  /**
   * Notify all listeners of status changes
   */
  private notifyStatusChange(): void {
    this.statusListeners.forEach(callback => callback(this.status));
  }

  /**
   * Get current status
   */
  getStatus(): LiveDataStatus {
    return { ...this.status };
  }

  /**
   * Fetch and parse CSV data from the configured path
   */
  async fetchData(): Promise<void> {
    this.status.isLoading = true;
    this.status.error = null;
    this.notifyStatusChange();

    try {
      const response = await fetch(this.config.dataPath);
      
      if (!response.ok) {
        throw new Error(`Failed to fetch data: ${response.status} ${response.statusText}`);
      }

      const csvText = await response.text();
      
      // Parse CSV with PapaParse
      Papa.parse<NCRRecord>(csvText, {
        header: true,
        skipEmptyLines: true,
        transformHeader: (header: string) => {
          // Trim whitespace from headers for flexible matching
          return header.trim();
        },
        complete: (results) => {
          if (results.errors.length > 0) {
            console.warn('CSV parsing warnings:', results.errors);
          }

          this.data = this.normalizeRecords(results.data);
          this.status.lastSyncTime = new Date();
          this.status.recordCount = this.data.length;
          this.status.error = null;
          
          console.log(`[LiveDataService] Successfully loaded ${this.data.length} records`);
          this.status.isLoading = false;
          this.notifyStatusChange();
        },
        error: (error) => {
          const errorMessage = error instanceof Error ? error.message : 'CSV parsing error';
          this.status.error = errorMessage;
          console.error('[LiveDataService] Failed to parse CSV:', error);
          this.status.isLoading = false;
          this.notifyStatusChange();
        }
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      this.status.error = errorMessage;
      console.error('[LiveDataService] Failed to fetch data:', error);
    } finally {
      this.status.isLoading = false;
      this.notifyStatusChange();
    }
  }

  /**
   * Normalize records to handle column name variations
   */
  private normalizeRecords(records: any[]): NCRRecord[] {
    return records.map(record => {
      // Create a normalized version with trimmed and case-insensitive matching
      const normalized: any = {};
      
      // Define expected keys from NCRRecord interface
      const expectedKeys: (keyof NCRRecord)[] = [
        'NCMR',
        'DATE',
        'Date NC was Flagged',
        'Time NC was Flagged',
        'Priority Status',
        'Discovery Area',
        'Part No.',
        'Part Description',
        'QTY of Defected Parts',
        'Purchase Order No.',
        'Source Simplified',
        'Source',
        'Job No. or GL No.',
        'Type of Defect',
        'Issuing Inspector Stamp No.',
        'Disposition',
        'Containment Required? (Y/N)',
        'Containment Completed?',
        'RTV Status',
        'Scrap Cost',
        'Rework WOR No.',
        'Actions / Comments',
        'Date Dispositioned in Global Shop',
        'Date Closed'
      ];

      // Map record keys to expected keys (case-insensitive, trimmed)
      for (const expectedKey of expectedKeys) {
        const lowerExpected = expectedKey.toLowerCase().trim();
        
        // Try to find matching key in record
        const matchingKey = Object.keys(record).find(key => 
          key.toLowerCase().trim() === lowerExpected
        );
        
        if (matchingKey) {
          normalized[expectedKey] = record[matchingKey];
        } else {
          normalized[expectedKey] = '';
        }
      }

      return normalized as NCRRecord;
    });
  }

  /**
   * Get all records
   */
  getData(): NCRRecord[] {
    return [...this.data];
  }

  /**
   * Find a record by NCMR number
   */
  findRecord(ncmr: string): NCRRecord | null {
    const searchStr = String(ncmr).trim().toLowerCase();
    
    const record = this.data.find(r => {
      if (!r.NCMR) return false;
      
      const recordStr = String(r.NCMR).trim().toLowerCase();
      
      // 1. Direct match
      if (recordStr === searchStr) return true;
      
      // 2. Numeric match (handles leading zeros)
      const recordNum = parseInt(recordStr, 10);
      const searchNum = parseInt(searchStr, 10);
      
      if (!isNaN(recordNum) && !isNaN(searchNum)) {
        return recordNum === searchNum;
      }

      // 3. Partial match fallback
      if (recordStr.endsWith(searchStr) || searchStr.endsWith(recordStr)) {
        return true;
      }

      return false;
    });
    
    return record || null;
  }

  /**
   * Start auto-refresh with the configured interval
   */
  startAutoRefresh(): void {
    this.stopAutoRefresh();
    
    console.log(`[LiveDataService] Starting auto-refresh every ${this.config.autoRefreshInterval / 1000}s`);
    
    this.refreshTimer = setInterval(() => {
      console.log('[LiveDataService] Auto-refresh triggered');
      this.fetchData();
    }, this.config.autoRefreshInterval) as unknown as number;
  }

  /**
   * Stop auto-refresh
   */
  stopAutoRefresh(): void {
    if (this.refreshTimer !== null) {
      clearInterval(this.refreshTimer);
      this.refreshTimer = null;
      console.log('[LiveDataService] Auto-refresh stopped');
    }
  }

  /**
   * Cleanup resources
   */
  dispose(): void {
    this.stopAutoRefresh();
    this.statusListeners = [];
  }
}

// Export singleton instance
export const liveDataService = new LiveDataService();
