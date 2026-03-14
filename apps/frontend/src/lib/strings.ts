// i18n: shared UI strings — centralised for future localisation
export const commonStrings = {
  actions: {
    confirm: "Xác nhận",
    cancel: "Hủy",
    delete: "Xóa",
    retry: "Thử lại",
    back: "Quay lại",
    save: "Lưu",
    saving: "Đang lưu...",
    search: "Tìm kiếm...",
    edit: "Chỉnh sửa",
  },
  errors: {
    title: "Đã xảy ra lỗi",
    fallback: "Không thể tải dữ liệu. Vui lòng thử lại sau.",
    unknown: "Đã xảy ra lỗi không xác định",
    boundary: "Đã xảy ra lỗi",
    boundaryDescription:
      "Đã có lỗi xảy ra trong ứng dụng. Vui lòng thử tải lại trang hoặc liên hệ quản trị viên.",
  },
  empty: {
    title: "Không có dữ liệu",
    description: "Chưa có dữ liệu để hiển thị",
  },
  pagination: {
    previous: "Trước",
    next: "Tiếp",
    page: "Trang",
    of: "trong",
    showing: "Hiển thị",
    items: "bản ghi",
  },
  filters: {
    all: "Tất cả",
    allStatuses: "Tất cả trạng thái",
    allRoles: "Tất cả vai trò",
    allGenders: "Tất cả",
    status: "Trạng thái",
    gender: "Giới tính",
    role: "Vai trò",
  },
  deleteConfirmPrefix: "Bạn có chắc muốn xóa",
  app: {
    name: "Quản lý nhân sự",
    orgName: "Trường Đại học Thủy Lợi",
  },
} as const;
