import { CarInsurance } from "../types/insurance";
import jsPDF from "jspdf";

export function generateInsurancePdf(insurance: CarInsurance): jsPDF {
  const doc = new jsPDF();

  doc.setFontSize(18);
  doc.text("Car Insurance Policy", 20, 20);

  doc.setFontSize(12);
  doc.text(`Policy Number: ${insurance.policyNumber}`, 20, 40);
  doc.text(`Car ID: ${insurance.carId}`, 20, 50);
  doc.text(`Client Name: ${insurance.clientName}`, 20, 60);
  doc.text(`Client Email: ${insurance.clientEmail}`, 20, 70);
  doc.text(`Start Date: ${insurance.startDate}`, 20, 80);
  doc.text(`End Date: ${insurance.endDate}`, 20, 90);
  doc.text(`Coverage Details: ${insurance.coverageDetails}`, 20, 100);
  doc.text(`Price: €${insurance.price}`, 20, 110);

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
