import { Button } from "@/components/ui/button"

interface FooterProps {
  logo: React.ReactNode
  brandName: string
  socialLinks: Array<{
    icon: React.ReactNode
    href: string
    label: string
  }>
  mainLinks: Array<{
    href: string
    label: string
  }>
  legalLinks: Array<{
    href: string
    label: string
  }>
  contact?: {
    phone?: string
    email?: string
    address?: string
    gstin?: string
  }
  copyright: {
    text: string
    license?: string
  }
}

export function Footer({
  logo,
  brandName,
  socialLinks,
  mainLinks,
  legalLinks,
  contact,
  copyright,
}: FooterProps) {
  return (
    <footer className="pb-6 pt-8 lg:pb-8 lg:pt-10 border-t border-foreground/25 bg-white/15 backdrop-blur-md shadow-lg dark:border-white/20 dark:bg-white/5">
      <div className="px-4 lg:px-8">
        {socialLinks.length > 0 && (
          <div className="flex md:justify-end">
            <ul className="flex list-none space-x-3">
              {socialLinks.map((link, i) => (
                <li key={i}>
                  <Button
                    variant="secondary"
                    size="icon"
                    className="h-10 w-10 rounded-full"
                    render={
                      <a href={link.href} target="_blank" aria-label={link.label} rel="noreferrer" />
                    }
                    nativeButton={false}
                  >
                    {link.icon}
                  </Button>
                </li>
              ))}
            </ul>
          </div>
        )}
        <div className="pt-6 lg:grid lg:grid-cols-10 lg:items-end">
          <nav className="lg:mt-0 lg:col-[4/11]">
            <ul className="list-none flex flex-wrap -my-1 -mx-2 lg:justify-end">
              {mainLinks.map((link, i) => (
                <li key={i} className="my-1 mx-2 shrink-0">
                  <a
                    href={link.href}
                    className="text-sm text-primary underline-offset-4 hover:underline"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
          <div className="mt-6 lg:mt-0 lg:col-[4/11]">
            <ul className="list-none flex flex-wrap -my-1 -mx-3 lg:justify-end">
              {legalLinks.map((link, i) => (
                <li key={i} className="my-1 mx-3 shrink-0">
                  <a
                    href={link.href}
                    className="text-sm text-foreground/80 underline-offset-4 hover:underline hover:text-foreground"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          <div className="mt-6 lg:mt-0 lg:row-[1/3] lg:col-[1/4]">
            <a href="/" className="inline-flex items-center" aria-label={brandName}>
              {logo}
              <span className="sr-only">{brandName}</span>
            </a>
            {contact && (
              <div className="mt-4 space-y-1 text-sm leading-6 text-foreground/80">
                {contact.phone && (
                  <div>
                    <a href={`tel:${contact.phone.replace(/[^+\d]/g, "")}`} className="hover:text-foreground">
                      {contact.phone}
                    </a>
                  </div>
                )}
                {contact.email && (
                  <div>
                    <a href={`mailto:${contact.email}`} className="hover:text-foreground">
                      {contact.email}
                    </a>
                  </div>
                )}
                {contact.address && <div className="max-w-xs">{contact.address}</div>}
                {contact.gstin && <div>GSTIN: {contact.gstin}</div>}
              </div>
            )}
            <div className="mt-4 text-sm leading-6 text-foreground/80 whitespace-nowrap">
              <div>{copyright.text}</div>
              {copyright.license && <div>{copyright.license}</div>}
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
