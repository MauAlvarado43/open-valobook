import {
  MousePointer2,
  Minus,
  ArrowRight,
  Circle,
  Square,
  Type,
  Pencil,
  Timer,
  Eye,
  MapPin,
  Image as ImageIcon,
} from 'lucide-react';

export const TOOLS = [
  { id: 'select', label: 'Select [V]', Icon: MousePointer2 },
  { id: 'pen', label: 'Pen [P]', Icon: Pencil },
  { id: 'timer-path', label: 'Rotation [O]', Icon: Timer },
  { id: 'line', label: 'Line [L]', Icon: Minus },
  { id: 'arrow', label: 'Arrow [A]', Icon: ArrowRight },
  { id: 'circle', label: 'Circle [C]', Icon: Circle },
  { id: 'rectangle', label: 'Rectangle [R]', Icon: Square },
  { id: 'vision-cone', label: 'Vision [W]', Icon: Eye },
  { id: 'icon', label: 'Marker [M]', Icon: MapPin },
  { id: 'image', label: 'Image [I]', Icon: ImageIcon },
  { id: 'text', label: 'Text [T]', Icon: Type },
] as const;

export const COLORS = [
  { value: '#FF4655', label: 'Valorant Red' },
  { value: '#FFFFFF', label: 'White' },
  { value: '#00D4FF', label: 'Cyan' },
  { value: '#FFFF00', label: 'Yellow' },
  { value: '#00FF00', label: 'Green' },
  { value: '#FF6B00', label: 'Orange' },
  { value: '#A855F7', label: 'Purple' },
];
