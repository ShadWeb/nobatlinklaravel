import { CalendarDots, ArrowLeft, ArrowRight, CaretLeft, CaretRight, CaretDown, User, Users, Phone, MapPin, InstagramLogo, WhatsappLogo, NavigationArrow, ShareNetwork, Link, Lightning, GearSix, ChartLineUp, Bell, Wallet, Plus, Check, Clock, House, List, PencilSimple, Trash, DotsThreeVertical, DeviceMobile, PlayCircle, FlowerLotus, Sparkle, Scissors, SignOut, X, MagnifyingGlass, Envelope } from '@phosphor-icons/react';

const icons = {
  calendar: CalendarDots,
  arrow: ArrowLeft,
  back: ArrowRight,
  left: CaretLeft,
  right: CaretRight,
  down: CaretDown,
  user: User,
  users: Users,
  phone: Phone,
  pin: MapPin,
  instagram: InstagramLogo,
  whatsapp: WhatsappLogo,
  navigation: NavigationArrow,
  share: ShareNetwork,
  link: Link,
  bolt: Lightning,
  settings: GearSix,
  chart: ChartLineUp,
  bell: Bell,
  wallet: Wallet,
  plus: Plus,
  check: Check,
  clock: Clock,
  home: House,
  menu: List,
  edit: PencilSimple,
  trash: Trash,
  dots: DotsThreeVertical,
  mobile: DeviceMobile,
  play: PlayCircle,
  flower: FlowerLotus,
  sparkle: Sparkle,
  scissors: Scissors,
  logout: SignOut,
  close: X,
  search: MagnifyingGlass,
  email: Envelope,
};

export type IconName = keyof typeof icons;
export default function Icon({ name, size = 22, className = '' }: { name: IconName; size?: number; className?: string }) {
  const Component = icons[name];
  return <Component size={size} weight="regular" className={className} aria-hidden="true" />;
}
