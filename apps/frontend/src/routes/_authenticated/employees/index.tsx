import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_authenticated/employees/")({
  component: EmployeesIndex,
});

function EmployeesIndex() {
  return null;
}
