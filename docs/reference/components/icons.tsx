import { CalendarDotsIcon } from "@phosphor-icons/react/dist/ssr/CalendarDots";
import { ArrowLeftIcon } from "@phosphor-icons/react/dist/ssr/ArrowLeft";
import { ArrowRightIcon } from "@phosphor-icons/react/dist/ssr/ArrowRight";
import { CaretLeftIcon } from "@phosphor-icons/react/dist/ssr/CaretLeft";
import { CaretRightIcon } from "@phosphor-icons/react/dist/ssr/CaretRight";
import { CaretDownIcon } from "@phosphor-icons/react/dist/ssr/CaretDown";
import { UserIcon } from "@phosphor-icons/react/dist/ssr/User";
import { UsersIcon } from "@phosphor-icons/react/dist/ssr/Users";
import { PhoneIcon } from "@phosphor-icons/react/dist/ssr/Phone";
import { MapPinIcon } from "@phosphor-icons/react/dist/ssr/MapPin";
import { InstagramLogoIcon } from "@phosphor-icons/react/dist/ssr/InstagramLogo";
import { WhatsappLogoIcon } from "@phosphor-icons/react/dist/ssr/WhatsappLogo";
import { NavigationArrowIcon } from "@phosphor-icons/react/dist/ssr/NavigationArrow";
import { ShareNetworkIcon } from "@phosphor-icons/react/dist/ssr/ShareNetwork";
import { LinkIcon } from "@phosphor-icons/react/dist/ssr/Link";
import { LightningIcon } from "@phosphor-icons/react/dist/ssr/Lightning";
import { GearSixIcon } from "@phosphor-icons/react/dist/ssr/GearSix";
import { ChartLineUpIcon } from "@phosphor-icons/react/dist/ssr/ChartLineUp";
import { BellIcon } from "@phosphor-icons/react/dist/ssr/Bell";
import { WalletIcon } from "@phosphor-icons/react/dist/ssr/Wallet";
import { PlusIcon } from "@phosphor-icons/react/dist/ssr/Plus";
import { CheckIcon } from "@phosphor-icons/react/dist/ssr/Check";
import { ClockIcon } from "@phosphor-icons/react/dist/ssr/Clock";
import { HouseIcon } from "@phosphor-icons/react/dist/ssr/House";
import { ListIcon } from "@phosphor-icons/react/dist/ssr/List";
import { PencilSimpleIcon } from "@phosphor-icons/react/dist/ssr/PencilSimple";
import { TrashIcon } from "@phosphor-icons/react/dist/ssr/Trash";
import { DotsThreeVerticalIcon } from "@phosphor-icons/react/dist/ssr/DotsThreeVertical";
import { DeviceMobileIcon } from "@phosphor-icons/react/dist/ssr/DeviceMobile";
import { PlayCircleIcon } from "@phosphor-icons/react/dist/ssr/PlayCircle";
import { FlowerLotusIcon } from "@phosphor-icons/react/dist/ssr/FlowerLotus";
import { SparkleIcon } from "@phosphor-icons/react/dist/ssr/Sparkle";
import { ScissorsIcon } from "@phosphor-icons/react/dist/ssr/Scissors";
import { SignOutIcon } from "@phosphor-icons/react/dist/ssr/SignOut";
import { XIcon } from "@phosphor-icons/react/dist/ssr/X";
import { MagnifyingGlassIcon } from "@phosphor-icons/react/dist/ssr/MagnifyingGlass";
import { EnvelopeIcon } from "@phosphor-icons/react/dist/ssr/Envelope";
const icons = {
  calendar: CalendarDotsIcon,
  arrow: ArrowLeftIcon,
  back: ArrowRightIcon,
  left: CaretLeftIcon,
  right: CaretRightIcon,
  down: CaretDownIcon,
  user: UserIcon,
  users: UsersIcon,
  phone: PhoneIcon,
  pin: MapPinIcon,
  instagram: InstagramLogoIcon,
  whatsapp: WhatsappLogoIcon,
  navigation: NavigationArrowIcon,
  share: ShareNetworkIcon,
  link: LinkIcon,
  bolt: LightningIcon,
  settings: GearSixIcon,
  chart: ChartLineUpIcon,
  bell: BellIcon,
  wallet: WalletIcon,
  plus: PlusIcon,
  check: CheckIcon,
  clock: ClockIcon,
  home: HouseIcon,
  menu: ListIcon,
  edit: PencilSimpleIcon,
  trash: TrashIcon,
  dots: DotsThreeVerticalIcon,
  mobile: DeviceMobileIcon,
  play: PlayCircleIcon,
  flower: FlowerLotusIcon,
  sparkle: SparkleIcon,
  scissors: ScissorsIcon,
  logout: SignOutIcon,
  close: XIcon,
  search: MagnifyingGlassIcon,
  email: EnvelopeIcon,
};
export type IconName = keyof typeof icons;
export default function Icon({
  name,
  size = 22,
  className = "",
}: {
  name: IconName;
  size?: number;
  className?: string;
}) {
  const Component = icons[name];
  return (
    <Component
      size={size}
      weight="regular"
      className={className}
      aria-hidden="true"
    />
  );
}
