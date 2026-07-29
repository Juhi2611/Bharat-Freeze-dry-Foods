import { Facebook, Instagram, Youtube, Linkedin, Twitter } from "lucide-react";
import { SOCIAL_LINKS } from "@/lib/whatsapp";

// Pinterest & Snapchat inline SVGs (lucide lacks them).
const Pinterest = (p: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="currentColor" {...p}>
    <path d="M12 2C6.48 2 2 6.48 2 12c0 4.24 2.64 7.85 6.36 9.29-.09-.79-.17-2 .04-2.86.19-.78 1.19-4.96 1.19-4.96s-.3-.61-.3-1.5c0-1.41.82-2.47 1.83-2.47.86 0 1.28.65 1.28 1.42 0 .87-.55 2.17-.84 3.38-.24 1.01.51 1.83 1.5 1.83 1.8 0 3.19-1.9 3.19-4.64 0-2.42-1.74-4.12-4.23-4.12-2.88 0-4.57 2.16-4.57 4.4 0 .87.33 1.8.75 2.31.08.1.1.19.07.29-.08.32-.25 1.01-.28 1.15-.04.19-.15.23-.34.14-1.27-.59-2.06-2.44-2.06-3.93 0-3.2 2.33-6.14 6.71-6.14 3.52 0 6.26 2.51 6.26 5.87 0 3.5-2.21 6.32-5.27 6.32-1.03 0-2-.53-2.33-1.17l-.63 2.42c-.23.88-.85 1.99-1.26 2.66C9.68 21.81 10.82 22 12 22c5.52 0 10-4.48 10-10S17.52 2 12 2z" />
  </svg>
);
const Snapchat = (p: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="currentColor" {...p}>
    <path d="M12.16 2c3.53 0 5.05 2.68 5.05 5.32 0 .95-.03 1.68-.07 2.29.13.06.34.11.6.11.36 0 .82-.12 1.28-.36l.16-.08c.06-.03.19-.07.34-.07.31 0 .58.19.66.47.09.31-.09.65-.5.85-.44.22-.98.35-1.5.47-.15.03-.29.14-.28.34.02.28.24.55.5.85.44.5 1.08.99 2.07 1.34.28.1.44.32.4.6-.05.35-.4.55-.94.65-.19.03-.31.19-.36.4-.05.2-.16.44-.29.63-.14.19-.4.28-.68.28-.19 0-.4-.04-.6-.09-.32-.08-.7-.16-1.16-.16-.29 0-.6.04-.94.11-.72.15-1.35.7-2.13 1.28-.9.66-1.83 1.34-3.24 1.34s-2.34-.68-3.24-1.34c-.78-.58-1.41-1.13-2.13-1.28-.34-.07-.65-.11-.94-.11-.46 0-.84.08-1.16.16-.2.05-.41.09-.6.09-.28 0-.54-.09-.68-.28-.13-.19-.24-.43-.29-.63-.05-.21-.17-.37-.36-.4-.54-.1-.89-.3-.94-.65-.04-.28.12-.5.4-.6.99-.35 1.63-.84 2.07-1.34.26-.3.48-.57.5-.85.01-.2-.13-.31-.28-.34-.52-.12-1.06-.25-1.5-.47-.41-.2-.59-.54-.5-.85.08-.28.35-.47.66-.47.15 0 .28.04.34.07l.16.08c.46.24.92.36 1.28.36.26 0 .47-.05.6-.11-.04-.61-.07-1.34-.07-2.29C7.11 4.68 8.63 2 12.16 2z" />
  </svg>
);

const items = [
  { name: "Facebook", href: SOCIAL_LINKS.facebook, Icon: Facebook },
  { name: "Instagram", href: SOCIAL_LINKS.instagram, Icon: Instagram },
  { name: "YouTube", href: SOCIAL_LINKS.youtube, Icon: Youtube },
  { name: "Pinterest", href: SOCIAL_LINKS.pinterest, Icon: Pinterest },
  { name: "LinkedIn", href: SOCIAL_LINKS.linkedin, Icon: Linkedin },
  { name: "X", href: SOCIAL_LINKS.twitter, Icon: Twitter },
  { name: "Snapchat", href: SOCIAL_LINKS.snapchat, Icon: Snapchat },
];

export function SocialIcons({ size = 16 }: { size?: number }) {
  return (
    <div className="flex items-center gap-3">
      {items.map(({ name, href, Icon }) => (
        <a
          key={name}
          href={href}
          target="_blank"
          rel="noreferrer noopener"
          aria-label={name}
          className="text-steel-silver transition-all duration-300 hover:text-ice-blue hover:-translate-y-0.5"
        >
          <Icon width={size} height={size} />
        </a>
      ))}
    </div>
  );
}
