import { CarInsurance } from "../types/insurance";
import jsPDF from "jspdf";

export function generateInsurancePdf(insurance: CarInsurance): jsPDF {
  const doc = new jsPDF();

  // Header
  doc.setFillColor(15, 23, 42);
  doc.rect(0, 0, 210, 25, 'F');
  doc.setFontSize(18);
  doc.setTextColor(255, 255, 255);
  doc.text("Nitron", 14, 16);
  doc.setFontSize(10);
  doc.text("www.nitron.com | +123-456-7890 | info@nitron.com", 14, 22);

  // Title
  doc.setFontSize(20);
  doc.setTextColor(15, 23, 42);
  doc.setFont('helvetica', 'bold');
  doc.text("Car Insurance Policy", 105, 35, { align: "center" });

  // Policy Info
  doc.setFontSize(12);
  doc.setTextColor(0, 0, 0);
  doc.setFont('helvetica', 'bold');
  doc.text("Policy Information", 14, 45);
  doc.setFont('helvetica', 'normal');
  doc.text(`Policy Number: ${insurance.policyNumber}`, 14, 52);
  doc.text(`Start Date: ${insurance.startDate}`, 14, 58);
  doc.text(`End Date: ${insurance.endDate}`, 14, 64);
  doc.text(`Price: €${insurance.price}`, 14, 70);

  // Divider
  doc.setDrawColor(200, 200, 200);
  doc.line(14, 74, 196, 74);

  // Client Info
  doc.setFont('helvetica', 'bold');
  doc.text("Client Information", 14, 82);
  doc.setFont('helvetica', 'normal');
  doc.text(`Name: ${insurance.clientName}`, 14, 88);
  doc.text(`Email: ${insurance.clientEmail}`, 14, 94);

  // Car Info
  doc.setFont('helvetica', 'bold');
  doc.text("Car Information", 14, 104);
  doc.setFont('helvetica', 'normal');
  doc.text(`Car ID: ${insurance.carId}`, 14, 110);

  // Coverage
  doc.setFont('helvetica', 'bold');
  doc.text("Coverage Details", 14, 120);
  doc.setFont('helvetica', 'normal');
  doc.text(insurance.coverageDetails, 14, 126, { maxWidth: 180 });

  // Signature area
  doc.setFont('helvetica', 'bold');
  doc.text("Authorized Signature:", 14, 260);
  doc.setFont('helvetica', 'normal');
  doc.line(60, 260, 120, 260);

  // Footer
  doc.setFontSize(10);
  doc.setTextColor(150, 150, 150);
  doc.text("Thank you for choosing AutoSalloni. This document serves as proof of insurance.", 105, 285, { align: "center" });

  return doc;
}

export async function sendInsuranceEmail(insurance: CarInsurance) {
  const doc = generateInsurancePdf(insurance);
  const pdfBase64 = doc.output("datauristring").split(",")[1];

  await fetch("/api/send-insurance-email", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      to: insurance.clientEmail,
      subject: "Your Car Insurance Policy",
      text: "Please find attached your car insurance policy.",
      pdfBase64,
      pdfFileName: `Insurance-${insurance.policyNumber}.pdf`,
    }),
  });
}
