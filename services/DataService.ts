
import { NCRRecord, DataAdapterType } from '../types';
import { SAMPLE_DATA } from '../constants';
import { liveDataService } from './LiveDataService';

export class DataService {
  private adapter: DataAdapterType = 'LOCAL';
  private customData: NCRRecord[] | null = null;

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

  getRecordCount(): number {
    if (this.adapter === 'LIVE') {
      return liveDataService.getStatus().recordCount;
    }
    return (this.customData || SAMPLE_DATA).length;
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
