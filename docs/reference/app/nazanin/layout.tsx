import { NailProvider } from "../../components/nail-context";
export default function Layout({ children }: { children: React.ReactNode }) {
  return <NailProvider>{children}</NailProvider>;
}
