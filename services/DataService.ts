
import Papa from 'papaparse';
import { NCRRecord, DataAdapterType } from '../types';
import { SAMPLE_DATA } from '../constants';
import { liveDataService } from './LiveDataService';

/**
 * Configuration for loading CSV data from a file path
 */
export interface CSVDataConfig {
  csvPath: string;  // Path to the CSV file (relative to public root)
}

const DEFAULT_CSV_CONFIG: CSVDataConfig = {
  csvPath: '/data/ncr-data.csv'
};

export class DataService {
  private adapter: DataAdapterType = 'LOCAL';
  private customData: NCRRecord[] | null = null;
  private isInitialized: boolean = false;
  private initPromise: Promise<void> | null = null;
  private csvConfig: CSVDataConfig;

  constructor(config?: Partial<CSVDataConfig>) {
    this.csvConfig = { ...DEFAULT_CSV_CONFIG, ...config };
  }

  /**
   * Initialize the service by loading CSV data automatically.
   * This simulates a real production environment where data comes from a CSV.
   * Returns a promise that resolves when initialization is complete.
   */
  async initialize(): Promise<void> {
    if (this.isInitialized) {
      return;
    }
    
    if (this.initPromise) {
      return this.initPromise;
    }

    this.initPromise = this.loadCSVData();
    await this.initPromise;
    this.isInitialized = true;
  }

  /**
   * Load CSV data from the configured path
   */
  private async loadCSVData(): Promise<void> {
    try {
      console.log(`[DataService] Loading CSV from: ${this.csvConfig.csvPath}`);
      const response = await fetch(this.csvConfig.csvPath);
      
      if (!response.ok) {
        console.warn(`[DataService] Failed to load CSV: ${response.status}. Using fallback sample data.`);
        return;
      }

      const csvText = await response.text();
      
      return new Promise((resolve) => {
        Papa.parse<NCRRecord>(csvText, {
          header: true,
          skipEmptyLines: true,
          transformHeader: (header: string) => header.trim(),
          complete: (results) => {
            if (results.errors.length > 0) {
              console.warn('[DataService] CSV parsing warnings:', results.errors);
            }

            const normalizedData = this.normalizeRecords(results.data);
            this.customData = normalizedData;
            
            console.log(`[DataService] Successfully loaded ${normalizedData.length} records from CSV`);
            resolve();
          },
          error: (error) => {
            console.warn('[DataService] CSV parse error, using fallback sample data:', error);
            resolve();
          }
        });
      });
    } catch (error) {
      console.warn('[DataService] Failed to fetch CSV, using fallback sample data:', error);
    }
  }

  /**
   * Normalize records to handle column name variations and ensure consistent data
   */
  private normalizeRecords(records: any[]): NCRRecord[] {
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

    return records.map(record => {
      const normalized: any = {};
      
      for (const expectedKey of expectedKeys) {
        const lowerExpected = expectedKey.toLowerCase().trim();
        const matchingKey = Object.keys(record).find(key => 
          key.toLowerCase().trim() === lowerExpected
        );
        
        normalized[expectedKey] = matchingKey ? record[matchingKey] : '';
      }

      return normalized as NCRRecord;
    });
  }

  /**
   * Check if the service has been initialized with CSV data
   */
  isReady(): boolean {
    return this.isInitialized;
  }

  setAdapter(type: DataAdapterType) {
    this.adapter = type;
    
    // Stop auto-refresh when switching away from LIVE mode
    if (type !== 'LIVE') {
      liveDataService.stopAutoRefresh();
    }
  }

  getAdapter(): DataAdapterType {
    return this.adapter;
  }

  /**
   * Updates the internal dataset with custom records (e.g., from an uploaded CSV).
   */
  setCustomData(data: NCRRecord[]) {
    this.customData = data;
  }

  /**
   * Searches for an NCMR record by exact match or normalized numeric match.
   * This handles cases where Excel might have stripped leading zeros.
   */
  async findRecord(ncmr: string): Promise<NCRRecord | null> {
    // Ensure data is initialized before searching
    await this.initialize();
    
    // Handle LIVE adapter mode
    if (this.adapter === 'LIVE') {
      // Small artificial delay for UX feedback
      await new Promise(resolve => setTimeout(resolve, 300));
      return liveDataService.findRecord(ncmr);
    }
    
    if (this.adapter === 'LOCAL') {
      // Small artificial delay for UX feedback
      await new Promise(resolve => setTimeout(resolve, 300));
      
      const dataToSearch = this.customData || SAMPLE_DATA;
      const searchStr = String(ncmr).trim().toLowerCase();
      
      const record = dataToSearch.find(r => {
        if (!r.NCMR) return false;
        
        const recordStr = String(r.NCMR).trim().toLowerCase();
        
        // 1. Direct match (e.g. "0014962" === "0014962")
        if (recordStr === searchStr) return true;
        
        // 2. Numeric match (e.g. "0014962" as number is 14962, "14962" as number is 14962)
        // This handles cases where Excel CSVs might drop leading zeros.
        const recordNum = parseInt(recordStr, 10);
        const searchNum = parseInt(searchStr, 10);
        
        if (!isNaN(recordNum) && !isNaN(searchNum)) {
          return recordNum === searchNum;
        }

        // 3. Fallback: contains or ends with for partial codes
        if (recordStr.endsWith(searchStr) || searchStr.endsWith(recordStr)) {
          return true;
        }

        return false;
      });
      
      return record || null;
    }

    if (this.adapter === 'SHAREPOINT') {
      throw new Error("SharePoint Adapter is not configured. Use Local mode with CSV upload.");
    }

    return null;
  }

  /**
   * Get the count of records in the current data source.
   * Note: This returns a synchronous count. Call initialize() first for accurate CSV data count.
   */
  getRecordCount(): number {
    if (this.adapter === 'LIVE') {
      return liveDataService.getStatus().recordCount;
    }
    return (this.customData || SAMPLE_DATA).length;
  }

  /**
   * Get the count of records asynchronously, ensuring data is loaded first.
   */
  async getRecordCountAsync(): Promise<number> {
    await this.initialize();
    return this.getRecordCount();
  }

  isUsingCustomData(): boolean {
    return this.customData !== null || this.adapter === 'LIVE';
  }

  /**
   * Get live data service instance for direct access
   */
  getLiveDataService() {
    return liveDataService;
  }
}

export const dataService = new DataService();
