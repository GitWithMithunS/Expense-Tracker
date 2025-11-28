import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import moment from "moment";

/* Utility to format file names & sheet titles */
const getMeta = (type) => {
  const t = type === "expense" ? "Expense" : "Income";
  return {
    title: `${t} Report`,
    sheet: t,
    filename: `${t}_Report`,
  };
};

/* Convert dataset into export-friendly format */
const formatData = (data) =>
  data.map((item) => ({
    ID: item.id,
    Name: item.name,
    Amount: item.amount,
    Date: moment(item.date).format("YYYY-MM-DD"),
    CategoryName: item.categoryName,
  }));

/* ------------------------------------------------------
   EXPORT AS EXCEL 
------------------------------------------------------ */
export const exportToExcel = (data, type = "income") => {
  if (!data?.length) return;

  const { sheet, filename } = getMeta(type);
  const formatted = formatData(data);

  const ws = XLSX.utils.json_to_sheet(formatted);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, sheet);

  const buffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });

  const file = new Blob([buffer], {
    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  });

  saveAs(file, `${filename}.xlsx`);
};

/* ------------------------------------------------------
   EXPORT AS CSV 
------------------------------------------------------ */
export const exportToCSV = (data, type = "income") => {
  if (!data?.length) return;

  const { filename } = getMeta(type);
  const formatted = formatData(data);

  const ws = XLSX.utils.json_to_sheet(formatted);
  const csv = XLSX.utils.sheet_to_csv(ws);

  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  saveAs(blob, `${filename}.csv`);
};

/* ------------------------------------------------------
   EXPORT AS PDF 
------------------------------------------------------ */
export const exportToPDF = (data, type = "income") => {
  if (!data?.length) return;

  const { title, filename } = getMeta(type);
  const doc = new jsPDF();

  doc.text(title, 14, 15);

  const tableData = data.map((item) => [
    item.id,
    item.name,
    item.amount.toLocaleString("en-IN"),
    moment(item.date).format("Do MMM YYYY"),
    item.categoryName,
  ]);

  autoTable(doc, {
    startY: 25,
    head: [["ID", "Name", "Amount (INR)", "Date", "Category"]],
    body: tableData,
  });

  doc.save(`${filename}.pdf`);
};

/* ------------------------------------------------------
   CREATE EXCEL BLOB FOR EMAIL 
------------------------------------------------------ */
export const generateExcelBlob = (data, type = "income") => {
  const { sheet } = getMeta(type);
  const formatted = formatData(data);

  const ws = XLSX.utils.json_to_sheet(formatted);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, sheet);

  return XLSX.write(wb, { bookType: "xlsx", type: "array" });
};
