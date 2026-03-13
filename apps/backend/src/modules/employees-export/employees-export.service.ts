import ExcelJS from "exceljs";
import PDFDocument from "pdfkit";
import type {
  Employee,
  EmployeeBankAccount,
  EmployeeCertification,
  EmployeeDegree,
  EmployeeEvaluation,
  EmployeeFamilyMember,
  EmployeeForeignWorkPermit,
  EmployeePartyMembership,
  EmployeePreviousJob,
  EmploymentContract,
} from "../../db/schema";

type EmployeeAllowanceExport = {
  id: string;
  employeeId: string;
  allowanceTypeId: string;
  amount: string | null;
  note: string | null;
  createdAt: Date;
  updatedAt: Date;
  allowanceName: string;
};

export type EmployeeExportAggregate = {
  employee: Employee;
  familyMembers: EmployeeFamilyMember[];
  bankAccounts: EmployeeBankAccount[];
  previousJobs: EmployeePreviousJob[];
  partyMemberships: EmployeePartyMembership[];
  allowances: EmployeeAllowanceExport[];
  degrees?: EmployeeDegree[];
  certifications?: EmployeeCertification[];
  foreignWorkPermits?: EmployeeForeignWorkPermit[];
  contracts?: EmploymentContract[];
  evaluations?: EmployeeEvaluation[];
};

type TableColumn<T> = {
  header: string;
  width?: number;
  value: (item: T) => unknown;
};

type PdfDocumentInstance = InstanceType<typeof PDFDocument>;

const HEADER_FILL = "4472C4";
const HEADER_TEXT = "FFFFFF";
const DEFAULT_MIN_WIDTH = 12;
const DEFAULT_MAX_WIDTH = 40;

function formatValue(value: unknown): string {
  if (value === null || value === undefined) return "";
  if (value instanceof Date) return value.toISOString().split("T")[0] ?? "";
  if (typeof value === "boolean") return value ? "Có" : "Không";
  return String(value);
}

function styleHeaderRow(row: ExcelJS.Row) {
  row.font = { bold: true, color: { argb: HEADER_TEXT } };
  row.alignment = { vertical: "middle", horizontal: "center" };

  row.eachCell((cell) => {
    cell.fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: HEADER_FILL },
    };
    cell.border = {
      top: { style: "thin" },
      left: { style: "thin" },
      bottom: { style: "thin" },
      right: { style: "thin" },
    };
  });
}

function setColumnWidths(worksheet: ExcelJS.Worksheet, headers: string[], rows: string[][]) {
  headers.forEach((header, index) => {
    const maxLength = rows.reduce((currentMax, row) => {
      const cellLength = row[index]?.length ?? 0;
      return Math.max(currentMax, cellLength);
    }, header.length);

    worksheet.getColumn(index + 1).width = Math.min(
      DEFAULT_MAX_WIDTH,
      Math.max(DEFAULT_MIN_WIDTH, maxLength + 2),
    );
  });
}

function addTableSheet<T>(
  workbook: ExcelJS.Workbook,
  title: string,
  columns: TableColumn<T>[],
  items: T[],
) {
  const worksheet = workbook.addWorksheet(title);
  const headers = columns.map((column) => column.header);
  const rows = items.map((item) => columns.map((column) => formatValue(column.value(item))));

  worksheet.addRow(headers);
  rows.forEach((row) => {
    worksheet.addRow(row);
  });

  styleHeaderRow(worksheet.getRow(1));
  worksheet.views = [{ state: "frozen", ySplit: 1 }];
  setColumnWidths(worksheet, headers, rows);

  columns.forEach((column, index) => {
    if (column.width !== undefined) {
      worksheet.getColumn(index + 1).width = column.width;
    }
  });

  return worksheet;
}

function ensureSpace(doc: PdfDocumentInstance, requiredHeight = 24) {
  const bottomLimit = doc.page.height - doc.page.margins.bottom;
  if (doc.y + requiredHeight > bottomLimit) {
    doc.addPage();
  }
}

function writeSectionTitle(doc: PdfDocumentInstance, title: string) {
  ensureSpace(doc, 28);
  doc.moveDown(0.5);
  doc.fontSize(13).fillColor("#1F4E79").font("Helvetica-Bold").text(title);
  doc.moveDown(0.2);
  doc.fontSize(10).fillColor("black").font("Helvetica");
}

function writeLabelValue(doc: PdfDocumentInstance, label: string, value: unknown) {
  ensureSpace(doc, 16);
  doc.font("Helvetica-Bold").text(`${label}: `, { continued: true });
  doc.font("Helvetica").text(formatValue(value));
}

function writeTableSection(
  doc: PdfDocumentInstance,
  title: string,
  headers: string[],
  rows: string[][],
) {
  writeSectionTitle(doc, title);

  if (rows.length === 0) {
    doc.text("Không có dữ liệu");
    doc.moveDown(0.4);
    return;
  }

  ensureSpace(doc, 18);
  doc.font("Helvetica-Bold").text(headers.join(" | "));
  doc.font("Helvetica");

  rows.forEach((row) => {
    ensureSpace(doc, 16);
    doc.text(row.join(" | "));
  });

  doc.moveDown(0.4);
}

function optionalItems<T>(items: T[] | undefined): T[] {
  return items ?? [];
}

async function workbookToBuffer(workbook: ExcelJS.Workbook): Promise<Buffer> {
  const buffer = await workbook.xlsx.writeBuffer();
  return Buffer.isBuffer(buffer) ? buffer : Buffer.from(buffer);
}

export async function exportEmployeesXlsx(employees: Employee[]): Promise<Buffer> {
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet("Danh sách nhân viên");

  const headers = [
    "Mã CB",
    "Họ tên",
    "CCCD",
    "Giới tính",
    "Ngày sinh",
    "SĐT",
    "Email",
    "Đơn vị",
    "Chức vụ",
    "Trạng thái",
  ];

  const rows = employees.map((employee) => [
    formatValue(employee.staffCode),
    formatValue(employee.fullName),
    formatValue(employee.nationalId),
    formatValue(employee.gender),
    formatValue(employee.dob),
    formatValue(employee.phone),
    formatValue(employee.email),
    formatValue(employee.currentOrgUnitId),
    formatValue(employee.currentPositionTitle),
    formatValue(employee.workStatus),
  ]);

  worksheet.addRow(headers);
  rows.forEach((row) => {
    worksheet.addRow(row);
  });

  styleHeaderRow(worksheet.getRow(1));
  worksheet.views = [{ state: "frozen", ySplit: 1 }];
  setColumnWidths(worksheet, headers, rows);

  return workbookToBuffer(workbook);
}

export async function exportSingleEmployeeXlsx(
  aggregate: EmployeeExportAggregate,
): Promise<Buffer> {
  const workbook = new ExcelJS.Workbook();
  const employee = aggregate.employee;

  const infoSheet = workbook.addWorksheet("Thông tin");
  const infoHeaders = ["Trường", "Giá trị"];
  const infoRows: string[][] = [
    ["Mã CB", formatValue(employee.staffCode)],
    ["Họ tên", formatValue(employee.fullName)],
    ["Ngày sinh", formatValue(employee.dob)],
    ["Giới tính", formatValue(employee.gender)],
    ["CCCD", formatValue(employee.nationalId)],
    ["Email", formatValue(employee.email)],
    ["SĐT", formatValue(employee.phone)],
    ["Địa chỉ", formatValue(employee.address)],
    ["Quê quán", formatValue(employee.hometown)],
    ["Mã số thuế", formatValue(employee.taxCode)],
    ["Số BHXH", formatValue(employee.socialInsuranceNo)],
    ["Số BHYT", formatValue(employee.healthInsuranceNo)],
    ["Đơn vị hiện tại", formatValue(employee.currentOrgUnitId)],
    ["Chức vụ hiện tại", formatValue(employee.currentPositionTitle)],
    ["Trạng thái công tác", formatValue(employee.workStatus)],
    ["Trạng thái hợp đồng", formatValue(employee.contractStatus)],
    ["Là người nước ngoài", formatValue(employee.isForeigner)],
    ["Trình độ học vấn", formatValue(employee.educationLevel)],
    ["Trình độ đào tạo", formatValue(employee.trainingLevel)],
    ["Học hàm", formatValue(employee.academicTitle)],
    ["Học vị", formatValue(employee.academicRank)],
  ];

  infoSheet.addRow(infoHeaders);
  infoRows.forEach((row) => {
    infoSheet.addRow(row);
  });
  styleHeaderRow(infoSheet.getRow(1));
  setColumnWidths(infoSheet, infoHeaders, infoRows);

  addTableSheet(
    workbook,
    "Gia đình",
    [
      { header: "Quan hệ", value: (item) => item.relation },
      { header: "Họ tên", value: (item) => item.fullName },
      { header: "Ngày sinh", value: (item) => item.dob },
      { header: "SĐT", value: (item) => item.phone },
      { header: "Phụ thuộc", value: (item) => item.isDependent },
      { header: "Ghi chú", value: (item) => item.note, width: 28 },
    ],
    aggregate.familyMembers,
  );

  addTableSheet(
    workbook,
    "Ngân hàng",
    [
      { header: "Ngân hàng", value: (item) => item.bankName },
      { header: "Số tài khoản", value: (item) => item.accountNo },
      { header: "Chính", value: (item) => item.isPrimary },
    ],
    aggregate.bankAccounts,
  );

  addTableSheet(
    workbook,
    "Công tác",
    [
      { header: "Nơi công tác", value: (item) => item.workplace, width: 24 },
      { header: "Từ ngày", value: (item) => item.startedOn },
      { header: "Đến ngày", value: (item) => item.endedOn },
      { header: "Ghi chú", value: (item) => item.note, width: 28 },
    ],
    aggregate.previousJobs,
  );

  addTableSheet(
    workbook,
    "Đoàn thể",
    [
      { header: "Loại tổ chức", value: (item) => item.organizationType },
      { header: "Ngày tham gia", value: (item) => item.joinedOn },
      { header: "Chi tiết", value: (item) => item.details, width: 28 },
    ],
    aggregate.partyMemberships,
  );

  addTableSheet(
    workbook,
    "Phụ cấp",
    [
      { header: "Tên phụ cấp", value: (item) => item.allowanceName },
      { header: "Mức hưởng", value: (item) => item.amount },
      { header: "Ghi chú", value: (item) => item.note, width: 28 },
    ],
    aggregate.allowances,
  );

  addTableSheet(
    workbook,
    "Bằng cấp",
    [
      { header: "Tên bằng cấp", value: (item) => item.degreeName, width: 24 },
      { header: "Trường", value: (item) => item.school, width: 24 },
      { header: "Chuyên ngành", value: (item) => item.major, width: 20 },
      { header: "Năm TN", value: (item) => item.graduationYear },
      { header: "Xếp loại", value: (item) => item.classification },
    ],
    optionalItems(aggregate.degrees),
  );

  addTableSheet(
    workbook,
    "Chứng chỉ",
    [
      { header: "Tên chứng chỉ", value: (item) => item.certName, width: 24 },
      { header: "Đơn vị cấp", value: (item) => item.issuedBy, width: 24 },
      { header: "Ngày cấp", value: (item) => item.issuedOn },
      { header: "Hết hạn", value: (item) => item.expiresOn },
    ],
    optionalItems(aggregate.certifications),
  );

  addTableSheet(
    workbook,
    "Giấy phép NN",
    [
      { header: "Số visa", value: (item) => item.visaNo },
      { header: "Hạn visa", value: (item) => item.visaExpiresOn },
      { header: "Số hộ chiếu", value: (item) => item.passportNo },
      { header: "Hạn hộ chiếu", value: (item) => item.passportExpiresOn },
      { header: "Số GPLĐ", value: (item) => item.workPermitNo },
      { header: "Hạn GPLĐ", value: (item) => item.workPermitExpiresOn },
    ],
    optionalItems(aggregate.foreignWorkPermits),
  );

  addTableSheet(
    workbook,
    "Hợp đồng",
    [
      { header: "Số hợp đồng", value: (item) => item.contractNo },
      { header: "Ngày ký", value: (item) => item.signedOn },
      { header: "Hiệu lực từ", value: (item) => item.effectiveFrom },
      { header: "Hiệu lực đến", value: (item) => item.effectiveTo },
      { header: "Đơn vị", value: (item) => item.orgUnitId },
      { header: "Trạng thái", value: (item) => item.status },
    ],
    optionalItems(aggregate.contracts),
  );

  addTableSheet(
    workbook,
    "Đánh giá",
    [
      { header: "Loại", value: (item) => item.evalType },
      { header: "Khen thưởng", value: (item) => item.rewardName },
      { header: "Kỷ luật", value: (item) => item.disciplineName },
      { header: "Ngày QĐ", value: (item) => item.decisionOn },
      { header: "Số QĐ", value: (item) => item.decisionNo },
      { header: "Hiển thị GV", value: (item) => item.visibleToEmployee },
      { header: "Hiển thị TCKT", value: (item) => item.visibleToTckt },
      { header: "Hiệu lực", value: (item) => item.isActive },
    ],
    optionalItems(aggregate.evaluations),
  );

  return workbookToBuffer(workbook);
}

export async function exportEmployeePdf(aggregate: EmployeeExportAggregate): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({ size: "A4", margin: 50 });
    const chunks: Buffer[] = [];

    doc.on("data", (chunk: Buffer) => chunks.push(chunk));
    doc.on("end", () => resolve(Buffer.concat(chunks)));
    doc.on("error", reject);

    const employee = aggregate.employee;

    doc.font("Helvetica-Bold").fontSize(18).text("HỒ SƠ CÁ NHÂN", { align: "center" });
    doc.moveDown();

    writeSectionTitle(doc, "Thông tin cá nhân");
    writeLabelValue(doc, "Mã CB", employee.staffCode);
    writeLabelValue(doc, "Họ tên", employee.fullName);
    writeLabelValue(doc, "Ngày sinh", employee.dob);
    writeLabelValue(doc, "Giới tính", employee.gender);
    writeLabelValue(doc, "CCCD", employee.nationalId);
    writeLabelValue(doc, "Email", employee.email);
    writeLabelValue(doc, "SĐT", employee.phone);
    writeLabelValue(doc, "Địa chỉ", employee.address);
    writeLabelValue(doc, "Quê quán", employee.hometown);
    writeLabelValue(doc, "Mã số thuế", employee.taxCode);
    writeLabelValue(doc, "BHXH", employee.socialInsuranceNo);
    writeLabelValue(doc, "BHYT", employee.healthInsuranceNo);
    writeLabelValue(doc, "Đơn vị hiện tại", employee.currentOrgUnitId);
    writeLabelValue(doc, "Chức vụ hiện tại", employee.currentPositionTitle);
    writeLabelValue(doc, "Trạng thái công tác", employee.workStatus);
    writeLabelValue(doc, "Trạng thái hợp đồng", employee.contractStatus);

    writeTableSection(
      doc,
      "Gia đình",
      ["Quan hệ", "Họ tên", "Ngày sinh", "SĐT", "Phụ thuộc", "Ghi chú"],
      aggregate.familyMembers.map((item) => [
        formatValue(item.relation),
        formatValue(item.fullName),
        formatValue(item.dob),
        formatValue(item.phone),
        formatValue(item.isDependent),
        formatValue(item.note),
      ]),
    );

    writeTableSection(
      doc,
      "Quá trình công tác",
      ["Nơi công tác", "Từ ngày", "Đến ngày", "Ghi chú"],
      aggregate.previousJobs.map((item) => [
        formatValue(item.workplace),
        formatValue(item.startedOn),
        formatValue(item.endedOn),
        formatValue(item.note),
      ]),
    );

    writeTableSection(
      doc,
      "Đoàn thể",
      ["Loại tổ chức", "Ngày tham gia", "Chi tiết"],
      aggregate.partyMemberships.map((item) => [
        formatValue(item.organizationType),
        formatValue(item.joinedOn),
        formatValue(item.details),
      ]),
    );

    writeTableSection(
      doc,
      "Tài khoản ngân hàng",
      ["Ngân hàng", "Số tài khoản", "Chính"],
      aggregate.bankAccounts.map((item) => [
        formatValue(item.bankName),
        formatValue(item.accountNo),
        formatValue(item.isPrimary),
      ]),
    );

    writeTableSection(
      doc,
      "Phụ cấp",
      ["Tên phụ cấp", "Mức hưởng", "Ghi chú"],
      aggregate.allowances.map((item) => [
        formatValue(item.allowanceName),
        formatValue(item.amount),
        formatValue(item.note),
      ]),
    );

    writeTableSection(
      doc,
      "Bằng cấp",
      ["Tên bằng cấp", "Trường", "Chuyên ngành", "Năm TN", "Xếp loại"],
      optionalItems(aggregate.degrees).map((item) => [
        formatValue(item.degreeName),
        formatValue(item.school),
        formatValue(item.major),
        formatValue(item.graduationYear),
        formatValue(item.classification),
      ]),
    );

    writeTableSection(
      doc,
      "Chứng chỉ",
      ["Tên chứng chỉ", "Đơn vị cấp", "Ngày cấp", "Hết hạn"],
      optionalItems(aggregate.certifications).map((item) => [
        formatValue(item.certName),
        formatValue(item.issuedBy),
        formatValue(item.issuedOn),
        formatValue(item.expiresOn),
      ]),
    );

    writeTableSection(
      doc,
      "Giấy phép lao động nước ngoài",
      ["Số visa", "Hạn visa", "Số hộ chiếu", "Hạn hộ chiếu", "Số GPLĐ", "Hạn GPLĐ"],
      optionalItems(aggregate.foreignWorkPermits).map((item) => [
        formatValue(item.visaNo),
        formatValue(item.visaExpiresOn),
        formatValue(item.passportNo),
        formatValue(item.passportExpiresOn),
        formatValue(item.workPermitNo),
        formatValue(item.workPermitExpiresOn),
      ]),
    );

    writeTableSection(
      doc,
      "Hợp đồng lao động",
      ["Số hợp đồng", "Ngày ký", "Hiệu lực từ", "Hiệu lực đến", "Đơn vị", "Trạng thái"],
      optionalItems(aggregate.contracts).map((item) => [
        formatValue(item.contractNo),
        formatValue(item.signedOn),
        formatValue(item.effectiveFrom),
        formatValue(item.effectiveTo),
        formatValue(item.orgUnitId),
        formatValue(item.status),
      ]),
    );

    writeTableSection(
      doc,
      "Đánh giá",
      ["Loại", "Khen thưởng", "Kỷ luật", "Ngày QĐ", "Số QĐ", "Hiệu lực"],
      optionalItems(aggregate.evaluations).map((item) => [
        formatValue(item.evalType),
        formatValue(item.rewardName),
        formatValue(item.disciplineName),
        formatValue(item.decisionOn),
        formatValue(item.decisionNo),
        formatValue(item.isActive),
      ]),
    );

    doc.end();
  });
}
