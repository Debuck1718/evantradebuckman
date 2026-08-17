import Link from "next/link";

export const metadata = {
    title: "Privacy Policy | Evantra",
    description:
        "How Evantra collects, uses, protects, and manages personal information across its websites and services.",
};

const sections = [
    {
        title: "1. About This Privacy Policy",
        content: (
            <>
                <p>
                    This Privacy Policy explains how Evantra De-Buckman Ventures
                    ("Evantra", "we", "us", or "our") collects, uses, stores, protects,
                    and otherwise processes personal information when you interact with
                    Evantra websites, applications, software, platforms, and services.
                </p>
                <p>
                    This policy is intended to provide clear information about our
                    processing practices and the choices and rights available to
                    individuals.
                </p>
            </>
        ),
    },
    {
        title: "2. Information We Collect",
        content: (
            <>
                <p>
                    The information we collect depends on how you interact with Evantra
                    and which service you use.
                </p>

                <h3 className="pt-3 font-medium text-white">
                    Account and identity information
                </h3>

                <ul>
                    <li>name and account information;</li>
                    <li>Evantra Identity identifiers;</li>
                    <li>contact email addresses;</li>
                    <li>authentication and account-status information; and</li>
                    <li>information required to operate and secure an account.</li>
                </ul>

                <h3 className="pt-3 font-medium text-white">
                    Authentication and security information
                </h3>

                <ul>
                    <li>authentication events;</li>
                    <li>browser or session identifiers;</li>
                    <li>security and access events;</li>
                    <li>login-attempt information; and</li>
                    <li>information necessary to detect or investigate unauthorized access.</li>
                </ul>

                <h3 className="pt-3 font-medium text-white">
                    Technical information
                </h3>

                <ul>
                    <li>IP address or network information;</li>
                    <li>browser and device information;</li>
                    <li>operating-system information;</li>
                    <li>request and diagnostic information; and</li>
                    <li>service logs and similar technical information.</li>
                </ul>

                <h3 className="pt-3 font-medium text-white">
                    Information you provide to us
                </h3>

                <p>
                    We may also collect information you voluntarily provide through
                    contact forms, support requests, applications, communications, or
                    other interactions with Evantra.
                </p>
            </>
        ),
    },
    {
        title: "3. How We Use Personal Information",
        content: (
            <>
                <p>We may use personal information to:</p>

                <ul>
                    <li>create and manage accounts;</li>
                    <li>authenticate users;</li>
                    <li>provide requested services;</li>
                    <li>maintain browser and application sessions;</li>
                    <li>secure our systems and prevent abuse;</li>
                    <li>detect, investigate, and respond to security incidents;</li>
                    <li>communicate with users;</li>
                    <li>maintain and improve our services;</li>
                    <li>diagnose technical problems;</li>
                    <li>meet applicable legal obligations; and</li>
                    <li>protect the rights, property, and security of Evantra and others.</li>
                </ul>

                <p>
                    We aim to process information for clearly identified purposes and
                    avoid collecting information that is unnecessary for those purposes.
                </p>
            </>
        ),
    },
    {
        title: "4. Legal Basis and Lawfulness",
        content: (
            <>
                <p>
                    Depending on the circumstances, Evantra may process personal
                    information where processing is necessary to provide a service,
                    perform or establish a contractual relationship, comply with a legal
                    obligation, protect security and legitimate operational interests,
                    or where another lawful basis applies.
                </p>
                <p>
                    Where consent is the appropriate basis for processing, we will seek
                    consent as required and provide appropriate choices.
                </p>
            </>
        ),
    },
    {
        title: "5. Evantra Identity",
        content: (
            <>
                <p>
                    Evantra Identity provides account and authentication capabilities
                    across supported Evantra applications and, where enabled, approved
                    third-party applications.
                </p>
                <p>
                    Identity-related processing may include account identifiers,
                    authentication events, session information, security events, and
                    information required to authorize access to an application.
                </p>
                <p>
                    An application using Evantra Identity may have its own privacy
                    practices. You should review the application's privacy notice where
                    applicable.
                </p>
            </>
        ),
    },
    {
        title: "6. Cookies and Similar Technologies",
        content: (
            <>
                <p>
                    Evantra services may use cookies, session identifiers, local storage,
                    or similar technologies where necessary to provide functionality,
                    maintain authentication sessions, improve security, remember
                    preferences, or understand service usage.
                </p>
                <p>
                    Where a service uses optional technologies that require additional
                    choices or consent, those choices will be presented through the
                    relevant service.
                </p>
            </>
        ),
    },
    {
        title: "7. Information Sharing",
        content: (
            <>
                <p>
                    Evantra does not treat personal information as a commodity to be
                    sold.
                </p>

                <p>
                    We may disclose information where reasonably necessary to provide a
                    requested service, operate infrastructure, protect security, comply
                    with legal obligations, respond to lawful requests, or protect the
                    rights and safety of individuals or organizations.
                </p>

                <p>
                    Service providers may process information on Evantra's behalf where
                    required to operate hosting, infrastructure, communications,
                    security, analytics, or other business functions.
                </p>
            </>
        ),
    },
    {
        title: "8. International Processing",
        content: (
            <>
                <p>
                    Evantra and its service providers may process information in
                    jurisdictions outside the country in which you live.
                </p>
                <p>
                    Where personal information is transferred or processed
                    internationally, Evantra will seek to apply appropriate contractual,
                    organizational, and technical safeguards as required by applicable
                    law.
                </p>
            </>
        ),
    },
    {
        title: "9. Data Security",
        content: (
            <>
                <p>
                    We use technical and organizational measures intended to protect
                    personal information against unauthorized access, loss, misuse,
                    alteration, or destruction.
                </p>
                <p>
                    Security measures may include access controls, authentication
                    controls, encryption or cryptographic protections, logging,
                    monitoring, session security, and controlled access to systems.
                </p>
                <p>
                    No security system can guarantee absolute protection, so we also
                    encourage users to protect their credentials and devices.
                </p>
            </>
        ),
    },
    {
        title: "10. Data Retention",
        content: (
            <>
                <p>
                    We retain personal information only for as long as reasonably
                    necessary for the purpose for which it was collected, to provide the
                    relevant service, to maintain security, to resolve disputes, or to
                    satisfy legal and regulatory requirements.
                </p>
                <p>
                    Different categories of information may have different retention
                    periods depending on their purpose and legal requirements.
                </p>
            </>
        ),
    },
    {
        title: "11. Your Data Protection Rights",
        content: (
            <>
                <p>
                    Depending on applicable law, you may have rights concerning your
                    personal information, including rights to be informed, access
                    information, request correction, object to certain processing,
                    request prevention of processing in applicable circumstances, and
                    seek other remedies provided by law.
                </p>

                <p>
                    Ghana's Data Protection Commission describes data-subject rights
                    under sections 39–44 of the Data Protection Act, 2012 (Act 843),
                    including rights relating to access, objection, prevention of
                    processing, and information.
                </p>

                <p>
                    Requests concerning your personal information can be submitted
                    through Evantra's contact channel.
                </p>
            </>
        ),
    },
    {
        title: "12. Children's Privacy",
        content: (
            <>
                <p>
                    Evantra services are not intentionally designed to collect personal
                    information from children in violation of applicable law.
                </p>
                <p>
                    Where a service is subject to age-related requirements, those
                    requirements will apply to the relevant service.
                </p>
            </>
        ),
    },
    {
        title: "13. Third-Party Links and Services",
        content: (
            <>
                <p>
                    Evantra websites and services may contain links to or integrations
                    with third-party services. Those third parties operate under their
                    own privacy practices.
                </p>
                <p>
                    We encourage you to review the privacy notices of third-party
                    services before providing them with personal information.
                </p>
            </>
        ),
    },
    {
        title: "14. Changes to This Privacy Policy",
        content: (
            <>
                <p>
                    We may update this Privacy Policy as our services, technology,
                    security practices, or legal obligations change.
                </p>
                <p>
                    The latest version will be published on this page with an updated
                    date.
                </p>
            </>
        ),
    },
    {
        title: "15. Contact Us",
        content: (
            <>
                <p>
                    If you have questions about this Privacy Policy or how Evantra
                    processes personal information, please contact Evantra through the
                    official Contact page.
                </p>
                <p>
                    Evantra De-Buckman Ventures operates from Ghana.
                </p>
            </>
        ),
    },
];

export default function PrivacyPage() {
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
                        Legal & Privacy
                    </p>

                    <h1 className="mt-4 text-4xl font-semibold tracking-tight sm:text-5xl">
                        Privacy Policy
                    </h1>

                    <p className="mt-6 text-lg leading-8 text-white/55">
                        How Evantra approaches the collection, use, protection, and
                        management of personal information.
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
                        <Link href="/terms" className="hover:text-white">
                            Terms of Use
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