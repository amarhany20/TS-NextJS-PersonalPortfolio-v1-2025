import Image from "next/image";

export default function Avatar() {
  return (
    <div className="rounded-full overflow-hidden w-24 h-24 mb-4 border-4 border-[var(--accent-primary)]">
      <Image src="/profile.jpg" alt="Ammar Hany profile photo" className="w-full h-full object-cover" width={96} height={96} />
    </div>
  );
}
