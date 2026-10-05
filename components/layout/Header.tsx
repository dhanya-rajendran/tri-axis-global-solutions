import { ButtonLink } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { Logo } from "@/components/ui/Logo";
import { headerCtas, mainNavigation } from "@/lib/data/navigation";
import { siteConfig } from "@/config/site";
import { DesktopNav } from "./DesktopNav";
import { MobileMenu } from "./MobileMenu";

export function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-line bg-white">
      <Container className="flex h-header items-center justify-between gap-6">
        <Logo />
        <DesktopNav items={mainNavigation} />
        <div className="hidden items-center gap-3 lg:flex">
          <span className="hidden xl:contents">
            <ButtonLink href={headerCtas.findJob.href} variant="outline" size="sm">
              {headerCtas.findJob.label}
            </ButtonLink>
          </span>
          <ButtonLink href={headerCtas.hireTalent.href} variant="primary" size="sm" arrow>
            {headerCtas.hireTalent.label}
          </ButtonLink>
        </div>
        <MobileMenu items={mainNavigation} ctas={headerCtas} email={siteConfig.contact.email} />
      </Container>
    </header>
  );
}
