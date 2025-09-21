interface SkillIconProps { name: string; icon?: string }

export function SkillIcon({ name, icon }: SkillIconProps) {
  const value = icon || deriveIcon(name);
  return <span aria-hidden className="text-sm mr-2 opacity-80 group-hover:opacity-100">{value}</span>;
}

function deriveIcon(name: string): string {
  const n = name.toLowerCase();
  if (n.includes('python')) return '🐍';
  if (n.includes('docker')) return '🐳';
  if (n.includes('react')) return '⚛️';
  if (n.includes('next')) return '▲';
  if (n.includes('postgres')) return '🐘';
  if (n.includes('redis')) return '🧠';
  if (n.includes('kubernetes')) return '☸️';
  if (n.includes('git')) return '🔧';
  if (n.includes('linux')) return '🐧';
  if (n.includes('flutter')) return '🦋';
  if (n.startsWith('c#')) return '⚙️';
  if (n.startsWith('go')) return '🐹';
  if (n.includes('node')) return '🟢';
  if (n.includes('yolo')) return '🎯';
  if (n.includes('opencv')) return '👁️';
  if (n.includes('pytorch')) return '🔥';
  return '•';
}

export default SkillIcon;
