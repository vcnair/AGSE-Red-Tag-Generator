
import { jsPDF } from 'jspdf';
import QRCode from 'qrcode';
import { NCRRecord } from '../types';

/**
 * Generates a high-quality, shop-floor legible 4x6 Red Tag PDF.
 * Adheres to 2025 traceability standards including precise timestamps and QR-linked digital twins.
 */
export const generateRedTag = async (record: NCRRecord) => {
  // 4x6 inches converted to points (1 inch = 72 points)
  // Format: [width, height]
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'pt',
    format: [288, 432] 
  });

  const width = 288;
  const height = 432;
  const margin = 12;
  const contentWidth = width - (margin * 2);

  // --- 1. HEADER SECTION (HIGH VISIBILITY) ---
  doc.setFillColor(220, 38, 38); // Strong industrial red
  doc.rect(0, 0, width, 80, 'F');

  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(26);
  doc.text('REJECTED', width / 2, 32, { align: 'center' });
  
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text('NON-CONFORMANCE HOLD TAG', width / 2, 50, { align: 'center' });
  
  // Compliance Traceability
  doc.setFontSize(7);
  doc.text(`ISO 9001 / AS9100 COMPLIANT`, width / 2, 65, { align: 'center' });

  // --- 2. PRIMARY TRACKING SECTION ---
  doc.setTextColor(0, 0, 0);
  let y = 100;
  
  // NCMR Number (Left side, more compact)
  doc.setFontSize(7);
  doc.setFont('helvetica', 'bold');
  doc.text('NCMR NUMBER:', margin, y);
  doc.setFontSize(18);
  doc.setFont('courier', 'bold');
  doc.text(record.NCMR || 'UNKNOWN', margin, y + 18);
  
  // Part Number (Center-left, below NCMR label)
  doc.setFontSize(7);
  doc.setFont('helvetica', 'bold');
  doc.text('PART NUMBER:', margin, y + 30);
  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  const partNoText = doc.splitTextToSize(record['Part No.'] || 'N/A', 100);
  doc.text(partNoText, margin, y + 42);
  
  // Disposition (Right side, aligned with Part Number)
  doc.setFontSize(7);
  doc.setFont('helvetica', 'bold');
  doc.text('DISPOSITION:', width / 2 + 5, y + 30);
  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  const dispositionText = doc.splitTextToSize(record.Disposition || 'N/A', 100);
  doc.text(dispositionText, width / 2 + 5, y + 42);
  
  // Priority Indicator (Top right corner)
  const isUrgent = record['Priority Status']?.toLowerCase() === 'urgent';
  if (isUrgent) {
    doc.setFillColor(0, 0, 0);
    doc.rect(width - 75, y - 5, 63, 20, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11);
    doc.text('URGENT', width - 43.5, y + 8, { align: 'center' });
    doc.setTextColor(0, 0, 0);
  } else {
    doc.setFontSize(9);
    doc.setFont('helvetica', 'bold');
    doc.text(record['Priority Status'] || 'Standard', width - margin, y + 5, { align: 'right' });
  }

  y += 60;
  doc.setDrawColor(0, 0, 0);
  doc.setLineWidth(1.5);
  doc.line(margin, y, width - margin, y);
  y += 18;

  // --- 3. CORE ATTRIBUTES ---
  const drawRow = (label1: string, val1: string, label2: string, val2: string, currentY: number) => {
    doc.setFontSize(7);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(80, 80, 80);
    doc.text(label1.toUpperCase(), margin, currentY);
    doc.text(label2.toUpperCase(), width / 2 + 5, currentY);
    
    doc.setFontSize(9);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(0, 0, 0);
    
    // Text wrapping for both columns
    const col1Width = (width / 2) - margin - 10;
    const col2Width = (width / 2) - margin - 10;
    const val1Lines = doc.splitTextToSize(String(val1 || 'N/A'), col1Width);
    const val2Lines = doc.splitTextToSize(String(val2 || 'N/A'), col2Width);
    
    doc.text(val1Lines, margin, currentY + 11);
    doc.text(val2Lines, width / 2 + 5, currentY + 11);
    
    // Calculate height based on max lines
    const maxLines = Math.max(val1Lines.length, val2Lines.length);
    return currentY + 11 + (maxLines * 10) + 8;
  };

  y = drawRow('Qty Defected', record['QTY of Defected Parts'], 'Discovery Area', record['Discovery Area'], y);
  
  // Description block
  doc.setFontSize(7);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(80, 80, 80);
  doc.text('PART DESCRIPTION', margin, y);
  doc.setFontSize(8);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(0, 0, 0);
  const descLines = doc.splitTextToSize(record['Part Description'] || 'N/A', contentWidth);
  doc.text(descLines, margin, y + 10);
  y += (descLines.length * 10) + 10;

  y = drawRow('Defect Type', record['Type of Defect'], 'PO Number', record['Purchase Order No.'], y);
  y = drawRow('Job / GL No', record['Job No. or GL No.'], 'Inspector Stamp', record['Issuing Inspector Stamp No.'], y);
  y = drawRow('Date Flagged', record['Date NC was Flagged'], '', '', y);

  y += 8;
  doc.setLineWidth(0.5);
  doc.line(margin, y, width - margin, y);
  y += 15;

  // --- 4. DISPOSITION & LOGISTICS ---
  doc.setFontSize(8);
  doc.setFont('helvetica', 'bold');
  doc.text('FINAL DISPOSITION:', margin, y);
  
  y += 15;
  const dispoTypes = ['RWK', 'Scrap', 'Use As Is', 'RTV-MRB', 'Mixed'];
  let currentX = margin;
  const spacing = (contentWidth / 5);
  dispoTypes.forEach((type) => {
    const isSelected = record.Disposition === type;
    if (isSelected) {
      doc.setFillColor(220, 220, 220);
      doc.rect(currentX - 2, y - 9, doc.getTextWidth(type) + 4, 13, 'F');
      doc.setFont('helvetica', 'bold');
    } else {
      doc.setFont('helvetica', 'normal');
    }
    doc.text(type, currentX, y);
    currentX += spacing;
  });

  y += 18;
  y = drawRow('Rework WOR', record['Rework WOR No.'], 'Containment', `${record['Containment Required? (Y/N)'] || 'N'}/${record['Containment Completed?'] || 'N'}`, y);
  
  if (record['RTV Status'] || record['Scrap Cost']) {
    y = drawRow('RTV Status', record['RTV Status'], 'Est Scrap Cost', record['Scrap Cost'], y);
  }

  // Comments
  doc.setFontSize(7);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(80, 80, 80);
  doc.text('ACTIONS / COMMENTS:', margin, y);
  doc.setFontSize(8);
  doc.setFont('helvetica', 'italic');
  doc.setTextColor(0, 0, 0);
  const commentLines = doc.splitTextToSize(record['Actions / Comments'] || 'None listed.', contentWidth - 85);
  doc.text(commentLines, margin, y + 10);

  // --- 5. FOOTER & COMPLIANCE ---
  const footerY = height - 90;
  doc.setDrawColor(0, 0, 0);
  doc.setLineWidth(1);
  doc.line(margin, footerY, width - margin, footerY);
  
  // QR Code for digital verification
  try {
    const qrData = `AGSE-VERIFY:NCMR-${record.NCMR}|TS:${Date.now()}`;
    const qrBase64 = await QRCode.toDataURL(qrData, { margin: 1 });
    doc.addImage(qrBase64, 'PNG', width - 82, height - 82, 70, 70);
  } catch (err) {
    console.error('QR failed', err);
  }

  // Traceability block
  doc.setFontSize(6);
  doc.setTextColor(120, 120, 120);
  const now = new Date();
  const timestampStr = now.toLocaleString('en-US', { 
    year: 'numeric', month: 'short', day: '2-digit', 
    hour: '2-digit', minute: '2-digit', second: '2-digit' 
  });
  
  doc.setFont('helvetica', 'bold');
  doc.text('SECURE TRACEABILITY LOG:', margin, footerY + 15);
  doc.setFont('helvetica', 'normal');
  doc.text(`PRINTED TIMESTAMP: ${timestampStr}`, margin, footerY + 25);
  doc.text(`TAG ORIGIN: AGSE-RT-GEN-v1.3`, margin, footerY + 33);
  doc.text(`ISO CONTROL: QP-8.7-NCR`, margin, footerY + 41);
  doc.text(`SCAN QR TO VERIFY DIGITAL TWIN`, margin, footerY + 49);
  
  doc.setFontSize(8);
  doc.setTextColor(0, 0, 0);
  doc.setFont('helvetica', 'bold');
  doc.text('DO NOT REMOVE FROM PART', margin, height - 15);

  // Download trigger
  doc.save(`RED_TAG_${record.NCMR}_${now.getTime()}.pdf`);
};
