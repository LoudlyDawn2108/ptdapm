// i18n: accounts feature strings
export const accountStrings = {
  page: {
    title: "Quản lý tài khoản",
    description: "Danh sách tài khoản người dùng hệ thống",
    addButton: "Tạo tài khoản",
    searchPlaceholder: "Tìm kiếm theo tên, email...",
    emptyMessage: "Không có tài khoản nào",
  },
  columns: {
    username: "Tên đăng nhập",
    fullName: "Họ tên",
    email: "Email",
    role: "Vai trò",
    status: "Trạng thái",
  },
  actions: {
    lockTitle: "Khóa tài khoản",
    unlockTitle: "Mở khóa tài khoản",
    lockConfirm: "Khóa",
    unlockConfirm: "Mở khóa",
    lockSuccess: "Đã khóa tài khoản",
    unlockSuccess: "Đã mở khóa tài khoản",
    lockDescription: (username: string) => `Bạn có chắc muốn khóa tài khoản "${username}"?`,
    unlockDescription: (username: string) => `Bạn có chắc muốn mở khóa tài khoản "${username}"?`,
  },
} as const;
