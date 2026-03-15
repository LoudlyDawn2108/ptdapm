import { Component, type ReactNode } from "react";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  render() {
    if (this.state.hasError) {
      return (
        this.props.fallback ?? (
          <div className="flex flex-col items-center justify-center p-8">
            <h2 className="text-lg font-semibold">Đã xảy ra lỗi</h2>
            <p className="text-muted-foreground mt-2">
              {this.state.error?.message ??
                "Đã có lỗi xảy ra trong ứng dụng. Vui lòng thử tải lại trang hoặc liên hệ quản trị viên."}
            </p>
            <button
              type="button"
              className="mt-4 underline"
              onClick={() => window.location.reload()}
            >
              Thử lại
            </button>
          </div>
        )
      );
    }
    return this.props.children;
  }
}
