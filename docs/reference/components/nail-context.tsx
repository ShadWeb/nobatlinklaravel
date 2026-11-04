"use client";
import {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
} from "react";
export type Service = {
  id: string;
  name: string;
  duration: number;
  price: number;
  description: string;
  crop: string;
};
export type Booking = {
  id: string;
  service: Service;
  date: string;
  time: string;
  name: string;
  phone: string;
  status: "confirmed" | "cancelled" | "pending";
};
export const initialServices: Service[] = [
  {
    id: "repair",
    name: "ترمیم ناخن",
    duration: 90,
    price: 350000,
    description: "ترمیم و رفع شکستگی ناخن‌ها با مواد باکیفیت",
    crop: "50% 50%",
  },
  {
    id: "extension",
    name: "کاشت ناخن",
    duration: 120,
    price: 650000,
    description: "کاشت حرفه‌ای با فرم و اندازه دلخواه شما",
    crop: "25% 30%",
  },
  {
    id: "design",
    name: "طراحی ناخن",
    duration: 60,
    price: 200000,
    description: "طراحی ظریف و خاص، مطابق سلیقه شما",
    crop: "80% 60%",
  },
  {
    id: "manicure",
    name: "مانیکور و پدیکور",
    duration: 75,
    price: 300000,
    description: "مراقبت کامل از زیبایی و سلامت دست و پا",
    crop: "50% 90%",
  },
];
export const fa = (n: number | string) =>
  String(n).replace(/\d/g, (d) => "۰۱۲۳۴۵۶۷۸۹"[Number(d)]);
export function iso(d: Date) {
  return (
    d.getFullYear() +
    "-" +
    String(d.getMonth() + 1).padStart(2, "0") +
    "-" +
    String(d.getDate()).padStart(2, "0")
  );
}
export function dateLabel(value: string, year = false) {
  const parts = new Intl.DateTimeFormat("fa-IR", {
    weekday: "long",
    day: "numeric",
    month: "long",
    ...(year ? { year: "numeric" } : {}),
  }).formatToParts(new Date(value + "T12:00:00"));
  const part = (type: string) =>
    parts.find((p) => p.type === type)?.value || "";
  return [
    part("weekday"),
    part("day"),
    part("month"),
    ...(year ? [part("year")] : []),
  ].join(" ");
}
export const today = () =>
  new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Tehran",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date());
const minute = (s: string) =>
  Number(s.split(":")[0]) * 60 + Number(s.split(":")[1]);
type State = {
  ready: boolean;
  services: Service[];
  setServices: (s: Service[]) => void;
  selected: Service;
  setSelected: (s: Service) => void;
  date: string;
  setDate: (s: string) => void;
  time: string;
  setTime: (s: string) => void;
  bookings: Booking[];
  addBooking: (name: string, phone: string) => Booking | null;
  cancelBooking: (id: string) => void;
  last: Booking | null;
  customer: string;
  setCustomer: (s: string) => void;
  available: (d: string, t: string, duration: number) => boolean;
};
const Context = createContext<State | null>(null);
export function NailProvider({ children }: { children: ReactNode }) {
  const [services, updateServices] = useState(initialServices);
  const [selected, setSelected] = useState(initialServices[0]);
  const [ready, setReady] = useState(false);
  const [date, setDate] = useState("");
  const [time, setTime] = useState("10:30");
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [last, setLast] = useState<Booking | null>(null);
  const [customer, setCustomer] = useState("");
  useEffect(() => {
    let cancelled = false;
    queueMicrotask(() => {
      if (cancelled) return;
      setDate(today());
      setReady(true);
      try {
        const data = JSON.parse(localStorage.getItem("nobt-demo-v1") || "null");
        if (data) {
          if (Array.isArray(data.bookings)) setBookings(data.bookings);
          if (Array.isArray(data.services) && data.services.length)
            updateServices(data.services);
        } else {
          const demo: Booking[] = [
            {
              id: "demo-sara",
              service: initialServices[0],
              date: today(),
              time: "10:00",
              name: "سارا احمدی",
              phone: "09120000001",
              status: "confirmed",
            },
            {
              id: "demo-mina",
              service: initialServices[2],
              date: today(),
              time: "12:00",
              name: "مینا کریمی",
              phone: "09120000002",
              status: "confirmed",
            },
            {
              id: "demo-elham",
              service: initialServices[1],
              date: today(),
              time: "14:00",
              name: "الهام رضایی",
              phone: "09120000003",
              status: "pending",
            },
          ];
          setBookings(demo);
          setCustomer("09120000001");
        }
      } catch {}
    });
    return () => {
      cancelled = true;
    };
  }, []);
  function save(nextBookings: Booking[], nextServices = services) {
    try {
      localStorage.setItem(
        "nobt-demo-v1",
        JSON.stringify({ bookings: nextBookings, services: nextServices }),
      );
    } catch {}
  }
  function setServices(next: Service[]) {
    updateServices(next);
    save(bookings, next);
    if (!next.some((s) => s.id === selected.id) && next.length)
      setSelected(next[0]);
    else {
      const updated = next.find((s) => s.id === selected.id);
      if (updated) setSelected(updated);
    }
  }
  function available(d: string, t: string, duration: number) {
    if (
      !d ||
      !/^([01]\d|2[0-3]):[0-5]\d$/.test(t) ||
      !Number.isFinite(duration) ||
      duration < 15
    )
      return false;
    const start = minute(t);
    if (d < today() || start < 10 * 60 || start + duration > 19 * 60)
      return false;
    if (d === today()) {
      const now = new Intl.DateTimeFormat("en-GB", {
        timeZone: "Asia/Tehran",
        hour: "2-digit",
        minute: "2-digit",
        hourCycle: "h23",
      }).format(new Date());
      if (start <= minute(now)) return false;
    }
    return !bookings.some(
      (b) =>
        b.date === d &&
        b.status !== "cancelled" &&
        start < minute(b.time) + b.service.duration &&
        start + duration > minute(b.time),
    );
  }
  function addBooking(name: string, phone: string) {
    if (!available(date, time, selected.duration)) return null;
    const booking: Booking = {
      id: crypto.randomUUID(),
      service: { ...selected },
      date,
      time,
      name,
      phone,
      status: "confirmed",
    };
    const next = [...bookings, booking];
    setBookings(next);
    setLast(booking);
    setCustomer(phone);
    save(next);
    return booking;
  }
  function cancelBooking(id: string) {
    const next = bookings.map((b) =>
      b.id === id ? { ...b, status: "cancelled" as const } : b,
    );
    setBookings(next);
    save(next);
  }
  return (
    <Context.Provider
      value={{
        ready,
        services,
        setServices,
        selected,
        setSelected,
        date,
        setDate,
        time,
        setTime,
        bookings,
        addBooking,
        cancelBooking,
        last,
        customer,
        setCustomer,
        available,
      }}
    >
      {children}
    </Context.Provider>
  );
}
export function useNail() {
  const c = useContext(Context);
  if (!c) throw new Error("NailProvider required");
  return c;
}
