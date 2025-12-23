
export interface NCRRecord {
  NCMR: string;
  DATE: string;
  "Date NC was Flagged": string;
  "Time NC was Flagged": string;
  "Priority Status": string;
  "Discovery Area": string;
  "Part No.": string;
  "Part Description": string;
  "QTY of Defected Parts": string;
  "Purchase Order No.": string;
  "Source Simplified": string;
  "Source": string;
  "Job No. or GL No.": string;
  "Type of Defect": string;
  "Issuing Inspector Stamp No.": string;
  "Disposition": string;
  "Containment Required? (Y/N)": string;
  "Containment Completed?": string;
  "RTV Status": string;
  "Scrap Cost": string;
  "Rework WOR No.": string;
  "Actions / Comments": string;
  "Date Dispositioned in Global Shop": string;
  "Date Closed": string;
}

export type DataAdapterType = 'LOCAL' | 'SHAREPOINT';

export interface RecentSearch {
  ncmr: string;
  timestamp: number;
}
