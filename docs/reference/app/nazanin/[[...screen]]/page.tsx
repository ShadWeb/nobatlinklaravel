import NailApp from "../../../components/nail-app";
export function generateStaticParams() {
  return [
    { screen: [] },
    ...[
      "services",
      "date",
      "time",
      "details",
      "success",
      "login",
      "appointments",
      "dashboard",
      "manage-services",
    ].map((s) => ({ screen: [s] })),
  ];
}
export default async function Page({
  params,
}: {
  params: Promise<{ screen?: string[] }>;
}) {
  const { screen } = await params;
  return <NailApp screen={screen?.[0] || "home"} />;
}
