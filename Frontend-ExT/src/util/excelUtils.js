import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import moment from "moment";



/* ------------------------------------------------------
    EXPORT AS EXCEL
------------------------------------------------------ */
export const exportIncomeToExcel = (incomeData) => {
  if (!incomeData?.length) return;

  const formatted = incomeData.map((item) => ({
    ID: item.id,
    Name: item.name,
    Amount: item.amount,
    Date: item.date,
    CategoryId: item.categoryId,
  }));

  const ws = XLSX.utils.json_to_sheet(formatted);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Income");

  const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });

  const file = new Blob([excelBuffer], {
    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  });

  saveAs(file, "Income_Report.xlsx");
};




/* ------------------------------------------------------
    EXPORT AS CSV
------------------------------------------------------ */
export const exportIncomeToCSV = (incomeData) => {
  if (!incomeData?.length) return;

  const formatted = incomeData.map((item) => ({
    ID: item.id,
    Name: item.name,
    Amount: item.amount,
    Date: item.date,
    CategoryId: item.categoryId,
  }));

  const ws = XLSX.utils.json_to_sheet(formatted);
  const csv = XLSX.utils.sheet_to_csv(ws);

  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  saveAs(blob, "Income_Report.csv");
};




/* ------------------------------------------------------
   EXPORT AS PDF
------------------------------------------------------ */
export const exportIncomeToPDF = (incomeData) => {
  if (!incomeData?.length) return;

  const doc = new jsPDF();

  doc.text("Income Report", 14, 15);

  const tableData = incomeData.map((item) => [
    item.id,
    item.name,
    item.amount.toLocaleString("en-IN"),  // fixed encoding
    moment(item.date).format("Do MMM YYYY"),
    item.categoryId,
  ]);

  autoTable(doc, {
    startY: 25,
    head: [["ID", "Name", "Amount (INR) ", "Date", "Category"]],
    body: tableData,
  });

  doc.save("Income_Report.pdf");
};




/* ------------------------------------------------------
   CREATE EXCEL BLOB FOR EMAIL
------------------------------------------------------ */
export const generateIncomeExcelBlob = (incomeData) => {
  const formatted = incomeData.map((item) => ({
    ID: item.id,
    Name: item.name,
    Amount: item.amount,
    Date: item.date,
    CategoryId: item.categoryId,
  }));

  const ws = XLSX.utils.json_to_sheet(formatted);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Income");

  return XLSX.write(wb, { bookType: "xlsx", type: "array" });
};
