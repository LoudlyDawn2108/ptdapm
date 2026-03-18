import { Outlet, createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_authenticated/training")({
  component: TrainingLayout,
});

function TrainingLayout() {
  return <Outlet />;
}
