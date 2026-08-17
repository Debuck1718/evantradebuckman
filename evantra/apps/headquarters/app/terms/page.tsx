import Link from "next/link";

export const metadata = {
  title: "Terms of Use | Evantra",
  description:
    "Terms governing access to and use of Evantra websites, software, platforms, and services.",
};

const sections = [
  {
    title: "1. About These Terms",
    content: (
      <>
        <p>
          These Terms of Use govern your access to and use of websites,
          software, applications, platforms, APIs, identity services, and
          other digital services made available by Evantra De-Buckman Ventures
          ("Evantra", "we", "us", or "our").
        </p>
        <p>
          By accessing or using an Evantra service, you agree to comply with
          these Terms and any service-specific terms presented to you.
        </p>
        <p>
          If you do not agree with these Terms, you should not use the relevant
          service.
        </p>
      </>
    ),
  },
  {
    title: "2. Evantra Services",
    content: (
      <>
        <p>
          Evantra develops and operates technology intended to help individuals
          and organizations use digital systems in a secure, practical, and
          human-centered manner.
        </p>
        <p>
          Our services may change over time. We may introduce new products,
          discontinue features, modify functionality, or place additional
          terms on particular services.
        </p>
      </>
    ),
  },
  {
    title: "3. Accounts and Evantra Identity",
    content: (
      <>
        <p>
          Certain Evantra services may require an account or Evantra Identity.
          You are responsible for providing accurate information and keeping
          your authentication credentials secure.
        </p>
        <p>
          You must not knowingly allow another person to use your account in a
          manner that compromises its security or violates these Terms.
        </p>
        <p>
          Evantra may suspend or restrict an account where reasonably necessary
          to protect the service, its users, or the security of the platform,
          including where there is suspected unauthorized access or abuse.
        </p>
      </>
    ),
  },
  {
    title: "4. Acceptable Use",
    content: (
      <>
        <p>You agree not to:</p>
        <ul>
          <li>use Evantra services for unlawful purposes;</li>
          <li>
            attempt to gain unauthorized access to accounts, systems, networks,
            APIs, or infrastructure;
          </li>
          <li>
            interfere with the availability, integrity, or security of an
            Evantra service;
          </li>
          <li>
            introduce malicious code, automated abuse, or harmful traffic;
          </li>
          <li>
            impersonate another person or misrepresent your relationship with
            Evantra;
          </li>
          <li>
            use an Evantra service to violate the rights of another person or
            organization; or
          </li>
          <li>
            circumvent technical, security, or access controls implemented by
            Evantra.
          </li>
        </ul>
      </>
    ),
  },
  {
    title: "5. Security",
    content: (
      <>
        <p>
          Evantra is designed with security as an important engineering
          consideration. However, no internet-connected system can be
          guaranteed to be completely secure.
        </p>
        <p>
          You are responsible for protecting credentials and devices under
          your control and for promptly reporting suspected unauthorized
          access.
        </p>
        <p>
          Additional information about our security approach may be published
          on the Evantra Security page.
        </p>
      </>
    ),
  },
  {
    title: "6. Intellectual Property",
    content: (
      <>
        <p>
          Unless otherwise stated, Evantra and its licensors retain all rights
          in Evantra software, source code, interfaces, designs, trademarks,
          logos, documentation, content, and other intellectual property.
        </p>
        <p>
          These Terms do not transfer ownership of Evantra intellectual
          property to you.
        </p>
        <p>
          You may not reproduce, modify, distribute, reverse engineer, or
          commercially exploit Evantra materials except where expressly
          permitted by applicable law or by written authorization from Evantra.
        </p>
      </>
    ),
  },
  {
    title: "7. Third-Party Services",
    content: (
      <>
        <p>
          Evantra services may interact with or depend on third-party services,
          infrastructure providers, payment providers, communication services,
          hosting providers, or other external systems.
        </p>
        <p>
          Third-party services may have their own terms and privacy policies.
          Evantra is not responsible for independent third-party services that
          it does not control.
        </p>
      </>
    ),
  },
  {
    title: "8. Availability and Changes",
    content: (
      <>
        <p>
          We aim to keep Evantra services reliable and available, but we do not
          guarantee uninterrupted availability.
        </p>
        <p>
          Services may occasionally be unavailable because of maintenance,
          upgrades, security measures, infrastructure failures, or circumstances
          outside our reasonable control.
        </p>
      </>
    ),
  },
  {
    title: "9. Disclaimers",
    content: (
      <>
        <p>
          Evantra services are provided subject to applicable law and the
          service-specific commitments expressly stated by Evantra.
        </p>
        <p>
          Information provided through Evantra services should not be treated
          as professional legal, financial, medical, or other specialized
          advice unless a service expressly states otherwise.
        </p>
      </>
    ),
  },
  {
    title: "10. Limitation of Liability",
    content: (
      <>
        <p>
          To the extent permitted by applicable law, Evantra will not be
          responsible for indirect, incidental, consequential, special, or
          punitive losses arising from your use of an Evantra service.
        </p>
        <p>
          Nothing in these Terms excludes or limits liability that cannot
          lawfully be excluded or limited under applicable law.
        </p>
      </>
    ),
  },
  {
    title: "11. Suspension and Termination",
    content: (
      <>
        <p>
          You may stop using an Evantra service at any time, subject to any
          applicable service-specific obligations.
        </p>
        <p>
          Evantra may suspend or terminate access where necessary to protect
          users, maintain security, comply with legal obligations, enforce
          these Terms, or discontinue a service.
        </p>
      </>
    ),
  },
  {
    title: "12. Privacy",
    content: (
      <>
        <p>
          Our collection and use of personal information is described in the
          Evantra Privacy Policy.
        </p>
        <p>
          You should review the Privacy Policy before using services that
          collect personal information.
        </p>
      </>
    ),
  },
  {
    title: "13. Changes to These Terms",
    content: (
      <>
        <p>
          We may update these Terms as Evantra develops, our services change,
          or legal and security requirements evolve.
        </p>
        <p>
          The updated version will be published on this page with a revised
          effective or last-updated date.
        </p>
      </>
    ),
  },
  {
    title: "14. Governing Law",
    content: (
      <>
        <p>
          These Terms are intended to be governed by the laws applicable to
          Evantra's operations and the relevant service, subject to any
          mandatory rights and protections that apply to you.
        </p>
        <p>
          Where a specific service agreement contains a governing-law or
          dispute-resolution provision, that provision may apply instead.
        </p>
      </>
    ),
  },
  {
    title: "15. Contact",
    content: (
      <>
        <p>
          Questions concerning these Terms may be submitted through the Evantra
          contact channel.
        </p>
        <p>
          Evantra De-Buckman Ventures operates from Ghana.
        </p>
      </>
    ),
  },
];

export default function TermsPage() {
  return (
    <main className="min-h-screen bg-[#06131f] text-white">
      <div className="mx-auto max-w-5xl px-6 py-20 lg:px-8">
        <Link
          href="/"
          className="text-sm text-white/50 transition hover:text-white"
        >
          ← Back to Evantra
        </Link>

        <header className="mt-12 max-w-3xl">
          <p className="text-sm font-medium uppercase tracking-[0.2em] text-[#e6b24a]">
            Legal
          </p>

          <h1 className="mt-4 text-4xl font-semibold tracking-tight sm:text-5xl">
            Terms of Use
          </h1>

          <p className="mt-6 text-lg leading-8 text-white/55">
            The terms that govern access to and use of Evantra websites,
            software, platforms, and services.
          </p>

          <p className="mt-5 text-sm text-white/35">
            Last updated: August 16, 2026
          </p>
        </header>

        <div className="mt-16 space-y-12">
          {sections.map((section) => (
            <section
              key={section.title}
              className="border-t border-white/10 pt-8"
            >
              <h2 className="text-xl font-semibold text-white">
                {section.title}
              </h2>

              <div className="mt-5 space-y-4 text-sm leading-7 text-white/60 [&_li]:ml-5 [&_li]:list-disc">
                {section.content}
              </div>
            </section>
          ))}
        </div>

        <footer className="mt-20 border-t border-white/10 pt-8 text-sm text-white/35">
          <div className="flex flex-wrap gap-x-6 gap-y-3">
            <Link href="/privacy" className="hover:text-white">
              Privacy Policy
            </Link>
            <Link href="/security" className="hover:text-white">
              Security
            </Link>
            <Link href="/contact" className="hover:text-white">
              Contact
            </Link>
          </div>
        </footer>
      </div>
    </main>
  );
}